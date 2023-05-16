<template>
  <div class="permission-container">
    <div class="app-container">
      <!-- 表格 -->
      <el-card>
        <div style="text-align: right; margin-bottom: 20px">
          <el-button type="primary" size="small" @click="addPermission(1, '0')">添加权限</el-button>
        </div>

        <el-table border :data="permissionList" row-key="id">
          <el-table-column label="名称" prop="name" />
          <el-table-column label="标识" prop="code" />
          <el-table-column label="描述" prop="description" />
          <el-table-column label="操作">
            <template v-slot="{ row }">
              <el-button v-if="row.type === 1" type="text" @click="addPermission(2, row.id)">添加</el-button>
              <el-button type="text" @click="editFn(row.id)">编辑</el-button>
              <el-button type="text" @click="delFn(row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
      <per-dialog ref="perDialog" :pid="pid" :show-dialog="showDialog" :form-data-obj="formData" :type="type" :is-edit="isEdit" :origin-list="originList" @close="dialogCloseFn" @confirm="confirmFn" />
    </div>
  </div>
</template>

<script>
import { getPermissionListAPI, addPermissionAPI, getPermissionDetailAPI, updatePermissionAPI, delPermissionAPI } from '@/api'
import { transTree } from '@/utils/transTree'
import perDialog from '@/views/permission/components/perDialog.vue'

export default {
  name: 'Permission',
  components: {
    perDialog
  },
  data() {
    return {
      permissionList: [], // 权限管理列表数据
      showDialog: false, // 控制弹出框是否显示
      type: 0, // 添加权限-类型
      pid: 0, // 添加权限-pid
      formData: {}, // 表单数据
      isEdit: false, // 是否为编辑
      originList: [] // 在做校验时需要用到的数据
    }
  },
  created() {
    // 调用获取权限管理列表的数据
    this.getPermissionList()
  },
  methods: {
    // 获取权限管理列表的数据
    async getPermissionList() {
      const res = await getPermissionListAPI().catch(err => err)
      if (!res.success) return this.$message.error(res.message)
      // 对originList做初始化
      this.originList = res.data.map(({ id, pid, name, code }) => ({ id, pid, name: name.trim(), code }))
      // 一级元素的 id 为 0
      this.permissionList = transTree(res.data, '0')
    },
    dialogCloseFn() {
      this.showDialog = false
      this.isEdit = false
    },

    // 添加-确认-提交权限
    async confirmFn(data) {
      if (this.isEdit) {
        // 更新
        // 调用接口，传入参数，发起请求
        const res = await updatePermissionAPI(data).catch(err => err)
        if (!res.success) return this.$message.error(res.message)
        this.$message.success(res.message)
      } else {
        // 新增
        // 调用接口，传入参数，发起请求
        const res = await addPermissionAPI(data).catch(err => err)
        if (!res.success) return this.$message.error(res.message)
        this.$message.success(res.message)
      }

      // 重新获取页面数据
      this.getPermissionList()
      this.$refs.perDialog.$refs.perForm.resetFields()
      this.showDialog = false
    },

    // 添加权限 - 按钮点击事件
    addPermission(type, id) {
      // 控制弹框展示
      this.showDialog = true
      // 记录当前添加的关键信息
      this.type = type
      this.pid = id
    },

    // 编辑-点击事件
    async editFn(id) {
      this.isEdit = true
      this.showDialog = true
      const res = await getPermissionDetailAPI(id).catch(err => err)
      if (!res.success) return this.$message.error(res.message)
      // 数据回显
      // console.log(res.data)
      this.formData = res.data
    },

    // 删除权限
    async delFn(id) {
      // 确认消息
      const confirmRes = await this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)

      if (confirmRes === 'cancel') return this.$message.info('您取消了删除')

      // 调用接口，并传入 ID
      const res = await delPermissionAPI(id)
      if (!res.success) return this.$message.error(res.message)
      this.$message.success(res.message)
      this.getPermissionList()
    }
  }
}
</script>

<style lang="scss" scoped></style>
