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
          <el-button type="danger" size="small">导入excel</el-button>
          <el-button type="success" size="small">导出excel</el-button>
          <el-button type="primary" size="small" @click="addEmpShowDialogFn">新增员工</el-button>
        </template>
      </page-tools>

      <el-card style="margin-top: 10px;">
        <el-table :default-sort="{prop: 'workNumber'}" :data="employeesList" border>
          <el-table-column label="序号" type="index" />
          <el-table-column label="姓名" prop="username" />
          <el-table-column label="头像" prop="staffPhoto" />
          <el-table-column label="手机号" prop="mobile" />
          <el-table-column label="工号" prop="workNumber" sortable :sort-method="workNumberSortFn" />
          <el-table-column prop="formOfEmployment" label="聘用形式" :formatter="formatter" />
          <el-table-column label="部门" prop="departmentName" />
          <el-table-column label="入职时间" prop="timeOfEntry" sortable>
            <!-- <template v-slot="{ row }">
              <span>{{ parseTime(row.timeOfEntry, '{yyyy}-{mm}-{dd}') }}</span>
            </template> -->
          </el-table-column>
          <el-table-column prop="" label="操作" width="280">
            <template>
              <el-button type="text" size="small">查看</el-button>
              <el-button type="text" size="small">分配角色</el-button>
              <el-button type="text" size="small">删除</el-button>
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
      >
        <emp-dialog :s-dialog.sync="showDialog" />
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getEmployeeListAPI } from '@/api'
import EmpDialog from './components/empDialog'
// import { parseTime } from '@/utils'
import Employees from '@/api/constant/employees'
export default {
  name: 'Employees',
  components: {
    EmpDialog
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
      showDialog: false // 添加员工组件的展示
    }
  },

  created() {
    this.getEmployeeList()
  },

  methods: {
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
    }
  }
}
</script>

<style lang="scss" scoped></style>
