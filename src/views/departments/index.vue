<template>
  <div class="departments-container">
    <div class="app-container">
      <!-- 卡片组件(分为头部和身体) -->
      <el-card class="box-card" shadow="hover">
        <!-- 头部 -->
        <div slot="header" class="clearfix">
          <!-- tab导航 -->
          <el-tabs v-model="activeName" @tab-click="handleClick">

            <el-tab-pane label="组织导航" name="first" class="tab-pane">
              <!-- class="tab-pane"设置左右padding, 把内容往中间挤压 -->
              <!-- 使用 Layout 布局绘制头部区域
                最外层一行, 2列
                  el-row: type布局模式
                          justify两端对齐
                          align交叉轴排列方式(垂直方向居中)
               -->
              <el-row type="flex" justify="space-between" align="middle" class="department-header">

                <!-- 第一列20份 -->
                <el-col :span="20">
                  <i class="el-icon-s-home" />
                  <span class="company">😆浙江埋土大学🐔算机科学与技术股份有限公司😭 </span>
                </el-col>

                <!-- 第二列4份 -->
                <el-col :span="4">

                  <!-- 在容器范围里, 一行再分2列 -->
                  <el-row type="flex" justify="end">
                    <el-col>负责人</el-col>
                    <el-col>
                      <!-- 这个之前在头部导航右侧下拉菜单讲过 -->
                      <el-dropdown>
                        <!-- 下拉菜单文字 -->
                        <span class="el-dropdown-link">
                          操作<i class="el-icon-arrow-down el-icon--right" />
                        </span>
                        <!-- 下拉项 -->
                        <el-dropdown-menu slot="dropdown">
                          <el-dropdown-item @click.native="add()">添加子部门</el-dropdown-item>
                        </el-dropdown-menu>
                      </el-dropdown>
                    </el-col>
                  </el-row>

                </el-col>

              </el-row>

              <!-- 在这里设置, 树形控件 -->
              <el-tree class="departments-tree" :data="treeData" :props="defaultProps" :default-expand-all="true">
                <!-- 默认插槽  并且使用内部的数据进行自定义模板的渲染, scope.data 所以直接key解构赋值变量也是data(对应数据对象)-->
                <template #default="{ data }">
                  <el-row
                    type="flex"
                    justify="space-between"
                    align="middle"
                    style="height: 40px; width: 100%;"
                  >
                    <!-- 部门名字 -->
                    <el-col :span="20">
                      <span>{{ data.name }}</span>
                    </el-col>

                    <!-- 功能操作区域 -->
                    <el-col :span="4">
                      <el-row type="flex" justify="end">
                        <!-- 两个内容 -->
                        <el-col>{{ data.manager }}</el-col>
                        <el-col>
                          <!-- 下拉菜单 element -->
                          <el-dropdown>
                            <span> 操作<i class="el-icon-arrow-down" /> </span>
                            <!-- 下拉菜单 -->
                            <el-dropdown-menu slot="dropdown">
                              <el-dropdown-item @click.native="add(data)">添加子部门</el-dropdown-item>
                              <el-dropdown-item @click.native="edit(data)">编辑部门</el-dropdown-item>
                              <el-dropdown-item v-if="data && !data.children" @click.native="del(data)">删除部门</el-dropdown-item>
                            </el-dropdown-menu>
                          </el-dropdown>
                        </el-col>
                      </el-row>
                    </el-col>

                  </el-row>

                </template>
              </el-tree>

            </el-tab-pane>
          </el-tabs>
        </div>
      </el-card>
    </div>
    <!-- <departDialog :dialog-visible="showDialog" /> -->
    <depart-dialog
      ref="departDialog"
      :dialog-visible.sync="showDepartDialog"
      :departments-simple-list="DepartmentsSimpleList"
      :add-departments="addDepartments"
      :validata-arr="validataArr"
      :click-id="clickId"
      :is-edit="isEdit"
      @addDepartmentsEV="addDepartments"
    />
  </div>
</template>

<script>
import { getDepartmentsApi, getDepartmentsSimpleListApi, addDepartmentsApi, getDepartmentsDetailApi, updataDepartmentsApi, deleteDepartmentApi } from '@/api'
import { transTree } from '@/utils/transTree'
import departDialog from './components/departDialog.vue'
export default {
  name: 'Departments',
  components: {
    departDialog
  },
  data() {
    return {
      // showDialog: false,
      parentId: '', // 添加操作需要的父级id
      clickId: null, // 当前点击元素的id
      DepartmentsSimpleList: [],
      showDepartDialog: false, // 新增子部门弹框是否出现
      activeName: 'first', // 被激活的 Tab 标签页
      isEdit: false, // 是否处于编辑状态
      // 树形控件数据
      treeData: [
        {
          departName: '总裁办',
          name: '孙财'
        },
        {
          departName: '行政部',
          name: '罗晓晓'
        },
        {
          departName: '人事部',
          name: '安小晴',
          children: [
            {
              departName: '财务核算部'
            }
          ]
        },
        {
          departName: '财务部',
          name: '',
          children: [
            {
              departName: '财务核算部'
            },
            {
              departName: '税务管理部'
            },
            {
              departName: '薪资管理部'
            }
          ]
        },
        {
          departName: '技术部',
          name: '',
          children: [
            {
              departName: '前端技术部'
            },
            {
              departName: '后端技术部'
            }
          ]
        },
        {
          departName: '运营部',
          name: ''
        },
        {
          departName: '市场部',
          name: '武高丽',
          children: [
            {
              departName: '市场部1'
            },
            {
              departName: '市场部2'
            }
          ]
        }
      ],
      validataArr: null,
      // 定义结构显示
      defaultProps: {
        children: 'children',
        label: 'departName'
      }
    }
  },
  created() {
    this.getDepartments()
    this.getDepartmentsSimpleList()
  },
  methods: {
    // cancel(bool) {
    //   this.showDepartDialog = bool
    // },
    // enter(bool) {
    //   this.showDepartDialog = bool
    // },
    async getDepartments() {
      const { data: { depts: res }} = await getDepartmentsApi()
      // console.log(222)
      // console.log(res)
      const tree = transTree(res, '')
      // console.log(tree)
      this.treeData = tree
      // 还需要一个平铺的树数据，用于方便校验
      this.validataArr = res
      console.log(this.validataArr)
    },

    async getDepartmentsSimpleList() {
      const res = await getDepartmentsSimpleListApi()
      // console.log(res)
      this.DepartmentsSimpleList = res.data
    },

    // 兼顾编辑和添加的功能，通过this.isEdit来区分二者
    async addDepartments(dataObj) {
      if (this.isEdit) {
        // console.log('这是数据：', dataObj)
        await updataDepartmentsApi(dataObj)
        // console.log(res)
        this.isEdit = false
      } else {
        dataObj.pid = this.parentId
        await addDepartmentsApi(dataObj)
        // console.log(res)
      }
      this.getDepartments()
    },

    handleClick(tab, event) {
      console.log(tab, event)
    },
    // 正文部分-右侧的添加子部门
    add(data) {
      if (!data) {
        this.parentId = ''
      } else {
        this.parentId = data.id
      }
      // console.log(data)
      this.isEdit = false
      this.$refs.departDialog.form = {
        name: '', // 部门名称
        code: '', // 部门编码
        manager: '', // 部门管理者
        introduce: '' // 部门介绍
      }
      this.showDepartDialog = true
    },
    // 编辑子部分
    async edit(data) {
      const res = await getDepartmentsDetailApi(data.id)
      // console.log(res)
      // 接下来通过ref获得组件对象
      // this.$refs.departDialog.form => 拿到了departDialog组件中的form
      this.clickId = data.id
      this.$refs.departDialog.form = res.data
      this.showDepartDialog = true
      this.isEdit = true
    },
    // 删除部分
    del(data) {
      this.$confirm('此操作将永久删除该部门, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        await deleteDepartmentApi(data.id)
        // console.log(res)
        this.getDepartments()
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }

  }
}
</script>

<style lang="scss" scoped>
.box-card {
  padding: 10px 30px;
}

.tab-pane {
  padding: 20px 80px;

  .company {
    margin-left: 12px;
    font-weight: bold;
    font-size: 14px;
  }

  .department-header {
    height: 50px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #ccc;
  }
}
</style>
