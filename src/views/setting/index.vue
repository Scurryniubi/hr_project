<template>
  <div class="setting-container">
    <div class="app-container">
      <!-- 卡片组件 -->
      <el-card class="box-card">
        <!-- 使用 Tabs 组件完成标签页布局 -->
        <el-tabs v-model="activeName">
          <el-tab-pane label="角色管理" name="first" class="tab-pane">
            <!-- 新增角色按钮 -->
            <el-row style="height:60px">
              <el-button
                icon="el-icon-plus"
                size="small"
                type="primary"
                @click="addRoleBtnFn"
              >新增角色</el-button>
            </el-row>
            <!-- 使用 Table 组件实现用户角色的渲染 -->
            <el-table :data="rolesList" border style="width: 100%">
              <el-table-column type="index" label="序号" width="120" />
              <el-table-column prop="name" label="角色名" width="240" />
              <el-table-column prop="description" label="描述" />
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <!-- scope.row拿到的是当前行的数据对象 -->
                  <el-button size="small" type="success" @click="setRoles(scope.row)">分配权限</el-button>
                  <el-button size="small" type="primary" @click="editRoles(scope.row)">编辑</el-button>
                  <el-button size="small" type="danger" @click="delRoles(scope.row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>

            <!-- 分页区域 -->
            <el-pagination
              :current-page="query.page"
              :page-sizes="[10, 15, 20, 25]"
              :page-size="query.pagesize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            />
            <!-- size-change	pageSize 改变时会触发
                 current-change	currentPage 改变时会触发  -->

            <!-- 卡片组件 -->

            <!-- 新增弹框 -->
            <el-dialog
              :title="isEdit ? '编辑角色' : '新增角色'"
              :close-on-click-modal="false"
              :close-on-press-escape="false"
              :visible.sync="showDialog"
              @close="closeRoleDialog"
            >
              <el-form ref="roleForm" :model="roleForm" :rules="roleRules" label-width="100px">
                <el-form-item label="角色名称" prop="name">
                  <el-input v-model="roleForm.name" />
                </el-form-item>
                <el-form-item label="角色描述" prop="description">
                  <el-input v-model="roleForm.description" />
                </el-form-item>
              </el-form>

              <!-- 底部 -->
              <el-row slot="footer" type="flex" justify="center">
                <el-col :span="6">
                  <el-button size="small" @click="cancleRoles">取消</el-button>
                  <el-button size="small" type="primary" @click="roleSubmit">确定</el-button>
                </el-col>
              </el-row>
            </el-dialog>

          </el-tab-pane>
          <el-tab-pane label="公司信息" class="tab-pane">
            <el-alert
              title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改"
              type="info"
              show-icon
              :closable="false"
            />
            <el-form :model="companyInfo" label-width="120px" style="margin-top:50px">
              <el-form-item label="公司名称">
                <el-input v-model="companyInfo.name" disabled style="width:400px" />
              </el-form-item>
              <el-form-item label="公司地址">
                <el-input v-model="companyInfo.companyAddress" disabled style="width:400px" />
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input v-model="companyInfo.mailbox" disabled style="width:400px" />
              </el-form-item>
              <el-form-item label="备注">
                <el-input v-model="companyInfo.remarks" type="textarea" :rows="3" disabled style="width:400px" />
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </el-card>

      <!-- 分配权限弹框 -->
      <el-dialog
        title="分配权限"
        :visible.sync="dialogVisible"
        width="50%"
      >
        <assign-permission :role-id="roleId" :permission-list="permissionList" :role-ids-list="roleIdsList" @close="setVisible" @confirmPer="confirmFn" />
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getRolesAPI, getCompanyInfoAPI, addRoleAPI, getRoleIdAPI, updataRoleAPI, deleteRoleAPI, getPermissionListAPI, assignPermAPI } from '@/api/index'
import { mapGetters } from 'vuex'
import AssignPermission from './assignPermission.vue'
import { transTree } from '@/utils/transTree'
export default {
  name: 'Setting',
  components: {
    AssignPermission
  },
  data() {
    return {
      roleIdsList: [],
      roleId: 0,
      permissionList: [], // 权限点数组
      dialogVisible: false,
      activeName: 'first',
      query: {
        page: 1, // 当前页面
        pagesize: 10 // 页面显示的条数
      },
      rolesList: [], // 当前单页面的角色列表
      total: 0, // 角色数据总条数
      companyInfo: {}, // 公司信息
      // ...其他选项
      showDialog: false, // 控制弹框的隐藏和展示
      // 添加角色
      roleForm: {
        name: '',
        description: ''
      },
      // 添加角色验证
      roleRules: {
        name: [
          { required: true, message: '角色名称不能为空', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '角色描述不能为空', trigger: 'blur' }
        ]
      },
      isEdit: false
    }
  },
  computed: {
    ...mapGetters(['companyId'])
  },
  created() {
    this.getRoleList()
    this.getCompanyInfo()
    // 调用获取权限点列表的方法
    this.getPermissionListFn()
  },
  methods: {
    // 获取员工列表
    async getRoleList() {
      const res = await getRolesAPI(this.query)
      // 根据返回的状态码进行业务处理
      if (!res.success) return this.$message.error(res.message)
      this.rolesList = res.data.rows
      this.total = res.data.total
    },

    // 获取企业信息
    async getCompanyInfo() {
      const res = await getCompanyInfoAPI(this.companyId)
      // console.log(res)
      this.companyInfo = res.data
    },

    // 每页显示的条数发生改变时触发
    handleSizeChange(newSize) {
      this.query.pagesize = newSize
      this.getRoleList()
    },

    // 当前页面发生改变时触发
    handleCurrentChange(newPage) {
      this.query.page = newPage
      this.getRoleList()
    },

    // 设置角色
    async setRoles(obj) {
      this.roleIdsList = []
      this.dialogVisible = true
      this.roleId = obj.id
      const res = await getRoleIdAPI(obj.id)
      this.roleIdsList = res.data.permIds
    },

    // 编辑角色
    async editRoles(dataObj) {
      this.isEdit = true
      const res = await getRoleIdAPI(dataObj.id)
      if (!res.success) return this.$message.error(res.message)
      this.roleForm = res.data
      this.showDialog = true
    },

    // 删除角色
    async delRoles(dataObj) {
      // 显示删除询问对话框
      const delRes = await this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)

      if (delRes === 'cancel') {
        return this.$message.info('您取消了删除')
      }
      const res = await deleteRoleAPI(dataObj.id)
      if (!res.success) return this.$message.error(res.message)
      this.$message.success(res.message)

      // 删除最后一页的最后一项时的特殊情况
      if (this.rolesList.length === 1) {
        this.query.page--
        // 如果删除的是第一页的第一项（针对一页只展示一条数据的情况）
        if (this.query.page === 1) {
          this.query.page = 1
        }
      }
      this.getRoleList()
    },

    // 角色弹框-> 确定按钮
    roleSubmit() {
      this.$refs.roleForm.validate(async valid => {
        if (valid) {
          if (this.isEdit) {
            const res = await updataRoleAPI(this.roleForm)
            // 根据状态码判断请求成功与否
            if (!res.success) return this.$message.error(res.message)
            // 添加成功，给用户进行提示
            this.$message.success(res.message)
          } else {
            const res = await addRoleAPI(this.roleForm)
            // 根据状态码判断请求成功与否
            if (!res.success) return this.$message.error(res.message)
            // 添加成功，给用户进行提示
            this.$message.success(res.message)
          }
          // 调用新增角色的 API

          // 重新获取权限列表数据
          this.getRoleList()
          // 隐藏弹框
          this.showDialog = false
        }
      })
    },
    // 角色弹框-> 取消按钮
    cancleRoles() {
      this.showDialog = false
    },

    addRoleBtnFn() {
      this.isEdit = false
      this.showDialog = true
    },

    /**
     * 关闭弹窗是清空数据
     */
    closeRoleDialog() {
      this.roleForm = {
        name: '',
        description: ''
      }
    },

    // 分配权限弹框隐藏
    setVisible() {
      this.dialogVisible = false
    },

    // 获取-权限点列表
    async getPermissionListFn() {
      const res = await getPermissionListAPI()
      this.permissionList = transTree(res.data, '0')
    },

    // 分配权限菜单-确定事件
    async confirmFn(data) {
      const res = await assignPermAPI(data)
      if (res.success) this.$message.success(res.message)
      this.dialogVisible = false
      this.getRoleList()
    }
  }
}
</script>

<style lang="scss" scoped>
.box-card {
  padding: 10px 30px;
}

.tab-pane {
  padding: 20px;
}

.el-pagination {
  text-align: center;
  margin-top: 20px;
}
</style>
