<template>
  <div>
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      :before-close="handleClose"
      width="50%"
    >
      <span>这是一段信息</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelFn">取 消</el-button>
        <el-button type="primary" @click="enterFn">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {})
    },
    // cancelFn() {
    //   this.$emit('cancel', false)
    // },
    // enterFn() {
    //   this.$emit('enter', false)
    // }
    // 简写方法：
    cancelFn() {
      this.$emit('update:dialogVisible', false)
      // this.$emit('update:dialogVisible', false)
    },
    enterFn() {
      this.$emit('update:dialogVisible', false)
    }
  }
}

</script>

<style>

</style>
