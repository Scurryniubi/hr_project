<template>
  <div>
    <!-- 渲染角色列表 -->
    <el-checkbox-group v-model="roleIdArr">
      <el-checkbox v-for="obj in roleList" :key="obj.id" :label="obj.id">
        <span>{{ obj.name }}</span>
      </el-checkbox>
    </el-checkbox-group>
    <el-row class="footer" type="flex" justify="center">
      <el-col :span="6">
        <el-button type="primary" size="small" @click="confirmFn">确定</el-button>
        <el-button size="small" @click="cancleDialog">取消</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'AssignRole',
  props: {
    // 用户的id 用来查询当前用户的角色信息
    userId: {
      type: String,
      default: null
    },
    roleList: {
      type: Array,
      required: true
    },
    roleIds: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      roleIdArr: [] // 保存当前选中的权限列表(选中的复选框数据)
    }
  },
  watch: {
    roleIds() {
      this.roleIdArr = this.roleIds
    }
  },
  methods: {
    // 取消弹框
    cancleDialog() {
      this.$emit('close')
      // setTimeout(() => {
      //   this.roleIdArr = []
      // }, 1000)
      // this.roleIdArr = []
    },
    // 确定-点击事件
    confirmFn() {
      this.$emit('confirm', this.roleIdArr)
      // setTimeout(() => {
      //   this.roleIdArr = []
      // }, 1000)
      // this.roleIdArr = []
    }
  }
}
</script>

<style lang="scss" scoped>
.footer {
  margin-top: 30px;
}
</style>
