<template>
  <div class="employees-container">
    <div class="app-container">
      <!-- 通用工具栏组件使用 -->
      <page-tools>
        <!-- 自定义左侧内容 -->
        <template #slot-left>
          <span>共19条记录</span>
        </template>

        <!-- 自定义右侧内容 -->
        <template #slot-right>
          <el-button v-power="'import'" type="danger" size="small" @click="uploadExcelBtnFn">导入excel</el-button>
          <el-button v-power="'export'" type="success" size="small" @click="downloadExcel">导出excel</el-button>
          <el-button type="primary" size="small" @click="addEmpShowDialogFn">新增员工</el-button>
        </template>
      </page-tools>

      <el-card style="margin-top: 10px;">
        <el-table :default-sort="{prop: 'workNumber'}" :data="employeesList" border>
          <el-table-column label="序号" type="index" />
          <el-table-column label="姓名" prop="username" />
          <el-table-column label="头像" prop="staffPhoto">
            <template slot-scope="scope">
              <image-holder class="staffPhoto" :src="scope.row.staffPhoto" />
            </template>
          </el-table-column>
          <el-table-column label="手机号" prop="mobile" />
          <el-table-column label="工号" prop="workNumber" sortable :sort-method="workNumberSortFn" />
          <el-table-column prop="formOfEmployment" label="聘用形式" :formatter="formatter" />
          <el-table-column label="部门" prop="departmentName" />
          <el-table-column label="入职时间" prop="timeOfEntry" sortable>
            <template v-slot="scope">
              {{ formatTime(scope.row.timeOfEntry) }}
            </template>
          </el-table-column>
          <el-table-column prop="" label="操作" width="280">
            <template v-slot="scope">
              <el-button
                type="text"
                size="small"
                @click="$router.push(`/employees/detail?id=${scope.row.id}&formOfEmployment=${scope.row.formOfEmployment}`)"
              >查看</el-button>
              <el-button type="text" size="small" @click="setEmp(scope.row.id)">分配角色</el-button>
              <el-button type="text" size="small" @click.native="delEmp(scope.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页组件 -->
        <el-row type="flex" justify="center" align="middle" style="height: 60px">
          <!-- 分页区域 -->
          <el-pagination
            :current-page="query.page"
            :page-sizes="[10, 15, 20, 25]"
            :page-size="query.size"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </el-row>
      </el-card>
      <el-dialog
        title="新增员工"
        :visible.sync="showDialog"
        @close="addEmpDialogCloseFn"
      >
        <emp-dialog
          ref="addEmpDialog"
          :s-dialog.sync="showDialog"
          @addEmpEV="addEmpFn"
        />
      </el-dialog>
      <!-- 员工-分配角色权限 - 弹窗 -->
      <el-dialog title="分配角色" :visible="showRoleDialog" @close="cancleDialog">
        <!-- 设置角色组件 -->
        <assign-role-dialog :user-id="userId" :role-list="roleList" :role-ids="roleIds" @close="showRoleDialog = false" @confirm="addRoleFn" />
      </el-dialog>
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import { getEmployeeListAPI, addEmployeeAPI, delEmployeeAPI, getUserDetailByIdAPI, getRolesAPI, assignRolesAPI } from '@/api'
import EmpDialog from './components/empDialog'
// import { parseTime } from '@/utils'
import Employees from '@/api/constant/employees'
import AssignRoleDialog from '@/components/assignRoleDialog'
export default {
  name: 'Employees',
  components: {
    EmpDialog,
    AssignRoleDialog
  },
  data() {
    return {
      query: {
        page: 1, // 页码
        size: 10 // 每页条数
      },
      employeesList: [], // 员工列表
      total: 0, // 数据总条数
      hireType: Employees.hireType,
      showDialog: false, // 添加员工组件的展示
      showRoleDialog: false, // 控制`分配角色权限弹窗的显示`
      roleIds: [], // 被选中项
      roleList: [], // 角色列表数据
      userId: null
    }
  },

  created() {
    this.getEmployeeList()
    // 获取所有角色信息
    this.getRoleListFn()
  },

  methods: {
    // 获取角色列表
    async getRoleListFn() {
      const res = await getRolesAPI()
      this.roleList = res.data.rows
    },
    /**
     * 格式化入职日期的方法
     */
    formatTime(time) {
      return dayjs(time).format('YYYY-MM-DD')
    },

    /**
     *  获取员工列表
     */
    async getEmployeeList() {
      // 调用获取员工列表的 API
      const res = await getEmployeeListAPI(this.query)
      // 根据返回的状态码给用户提示
      if (!res.success) return this.$message.error(res.message)
      // 将返回的结果赋值 data 中的数据
      this.employeesList = res.data.rows
      this.total = res.data.total
    },
    // 每页显示的条数发生改变时触发
    handleSizeChange(newSize) {
      this.query.size = newSize
      this.getEmployeeList()
    },

    // 当前页面发生改变时触发
    handleCurrentChange(newPage) {
      this.query.page = newPage
      this.getEmployeeList()
    },

    // 格式化表格的某一项
    // 格式化表格的某一项
    formatter(row, column, cellValue, index) {
      // 用数组的 find 方法找到 id = 1 的元素，再取出它的 value
      const obj = this.hireType.find((item) => item.id === +cellValue)
      // console.log(obj)
      return obj ? obj.value : '未知'
    },

    // parseTime,

    workNumberSortFn(a, b) {
      return parseInt(a.workNumber) - parseInt(b.workNumber)
    },

    addEmpShowDialogFn() {
      this.showDialog = true
    },
    // 新增员工->事件触发
    async addEmpFn(formData) {
      const res = await addEmployeeAPI(formData)

      if (res.success) {
        this.$message.success(res.message)
        // 提示后, 重新请求列表
        this.getEmployeeList()
      } else {
        this.$message.error(res.message)
      }
    },

    addEmpDialogCloseFn() {
      this.$refs.addEmpDialog.$refs.addForm.resetFields()
      this.$refs.addEmpDialog.formData = {
        username: '', // 用户名
        mobile: '', // 手机号
        formOfEmployment: '', // 聘用形式
        workNumber: '', // 工号
        departmentName: '', // 部门
        timeOfEntry: '', // 入职时间
        correctionTime: '' // 转正时间
      }
    },

    /**
     * 删除功能
     */
    async delEmp(id) {
    // 显示删除询问对话框
      const delRes = await this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)

      // 用户点击了取消，给用户进行提示
      if (delRes === 'cancel') return this.$message.info('您取消了删除')

      const res = await delEmployeeAPI(id)
      if (!res.success) return this.$message.error(res.message)
      // 删除成功后的提示
      this.$message.success(res.message)
      // 判断是不是最后一条数据
      if (this.employeesList.length === 1) {
        this.query.page--
        if (this.query.page <= 0) {
          this.query.page = 1
        }
      }
      // 重新获取数据
      this.getEmployeeList()
    },

    // 导入excel按钮->点击事件
    uploadExcelBtnFn() {
      this.$router.push('/excel')
    },

    // 导出excel按钮->点击事件
    transData(rows) {
      // // 写代码
      // const map = {
      //   'id': '编号',
      //   'password': '密码',
      //   'mobile': '手机号',
      //   'username': '姓名',
      //   'timeOfEntry': '入职日期',
      //   'formOfEmployment': '聘用形式',
      //   'correctionTime': '转正日期',
      //   'workNumber': '工号',
      //   'departmentName': '部门',
      //   'staffPhoto': '头像地址'
      // }

      // const headerKeys = Object.keys(rows[0])
      // const header = headerKeys.map(item => {
      //   return map[item]
      // })

      // const data = rows.map(obj => {
      //   return Object.values(obj)
      // })

      // return { header, data }

      // 考虑顺序 (页面上列保持一致顺序)
      // 4.0 准备一个列表头中文数组 (8个)
      const headerArr = ['序号', '姓名', '头像', '手机号', '工号', '聘用形式', '部门', '入职时间']
      // 4.1 数据key的映射关系(思路: 遍历上边数组里按照顺序, 取出中文的名字, 但是对应数组值的数组, 要从英文key对象中取出value值, 我要用中文key换到英文key然后去取到值)
      const myObj = {
        // 序号可以等遍历的时候直接用索引值, 而不是来自于英文对象里
        '姓名': 'username',
        '头像': 'staffPhoto',
        '手机号': 'mobile',
        '工号': 'workNumber',
        '聘用形式': 'formOfEmployment',
        '部门': 'departmentName',
        '入职时间': 'timeOfEntry'
      }
      // 4.2 按照顺序, 形成值的数组 (明确目标->想要数据结构->读代码(每个变量意思)读2-3遍->仿写3-5遍)
      const resultArr = rows.map((item, index) => {
        const valueArr = [] // 值小数组
        headerArr.forEach(zhKey => {
          if (zhKey === '序号') {
            valueArr.push(index + 1)
          } else {
            const enKey = myObj[zhKey]
            valueArr.push(item[enKey])
          }
        })
        return valueArr
      })

      return { header: headerArr, data: resultArr }
    },

    // 导出 Excel
    async downloadExcel() {
      const res = await getEmployeeListAPI()
      const res2 = await getEmployeeListAPI({
        page: 1,
        size: res.data.total
      })
      const excelObj = this.transData(res2.data.rows)
      import('@/vendor/Export2Excel').then(excel => {
      // excel表示导入的模块对象
        excel.export_json_to_excel({
          header: excelObj.header, // 表头 必填
          data: excelObj.data, // 具体数据 必填
          filename: '员工列表', // 文件名称
          autoWidth: true, // 宽度是否自适应
          bookType: 'xlsx' // 生成的文件类型
        })
      })
    },
    // 关闭分配角色弹框
    cancleDialog() {
      this.showRoleDialog = false
    },
    // 调用员工详情数据
    async getUserRoles() {
      const infoRes = await getUserDetailByIdAPI(this.userId)
      // console.log(infoRes)
      if (!infoRes.success) return this.$message.error(infoRes.message)
      this.roleIds = infoRes.data.roleIds
    },
    // 分配角色
    setEmp(id) {
      this.roleIds = []
      this.userId = id
      this.showRoleDialog = true
      // 获取员工详细数据
      this.getUserRoles()
    },
    // 子组件弹窗 - 点击确定 - 员工角色分配
    async addRoleFn(roleIds) {
    // 调用 API，传入参数
      const res = await assignRolesAPI({ id: this.userId, roleIds: roleIds })
      if (!res.success) return this.$message.error(res.message)

      // 员工分配成功，给用户提示
      this.$message.success(res.message)
      // 关闭弹框
      this.showRoleDialog = false
      // 重新获取当前当前列表数据
      this.getEmployeeList()
    }
  }
}
</script>

<style lang="scss" scoped>
.staffPhoto {
  width: 100px;
  height: 100px;
  border-radius: 50%;
}
</style>
