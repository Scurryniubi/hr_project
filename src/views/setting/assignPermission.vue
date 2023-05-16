<template>
  <div>
    <div>分配权限功能</div>
    <!-- 权限点数据展示 -->
    <el-tree
      ref="tree"
      :data="permissionList"
      :props="{ label: 'name' }"
      node-key="id"
      show-checkbox
      default-expand-all
      check-strictly
    />
    <el-row class="footer" type="flex" justify="center">
      <el-col :span="6">
        <el-button size="small" @click="cancelButton">取 消</el-button>
        <el-button size="small" type="primary" @click="setRolesBtn">确 定</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'AssignPermission',
  props: {
    permissionList: {
      type: Array,
      default: _ => []
    },
    roleId: {
      type: [Number, String],
      required: true
    },
    roleIdsList: {
      type: Array,
      default: _ => []
    }
  },
  data() {
    return {}
  },
  watch: {
    roleIdsList() {
      this.$refs.tree.setCheckedKeys(this.roleIdsList)
    }
  },
  created() {
    // console.log(this.roleId)
  },
  methods: {
    // 取消按钮
    cancelButton() {
      this.$emit('close')
    },

    // 设置权限按钮
    setRolesBtn() {
      const permIds = this.$refs.tree.getCheckedKeys()
      this.$emit('confirmPer', { id: this.roleId, permIds: permIds })
    }
  }
}
</script>

<style lang="scss" scoped>
.footer {
  margin-top: 30px;
}
</style>
