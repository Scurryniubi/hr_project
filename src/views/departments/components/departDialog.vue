<template>
  <div>
    <el-dialog
      title="提示"
      :visible="dialogVisible"
      :close-on-click-modal="true"
      :close-on-press-escape="true"
      :show-close="true"
      :before-close="handleClose"
      width="50%"
      @update:visible="val=>$emit('update:dialogVisible', false)"
    >
      <span><template>
        <div>
          <el-form ref="deptForm" label-width="120px">
            <el-form-item label="部门名称">
              <el-input v-model="form.name" style="width:80%" placeholder="1-50个字符" />
            </el-form-item>
            <el-form-item label="部门编码">
              <el-input v-model="form.code" style="width:80%" placeholder="1-50个字符" />
            </el-form-item>
            <el-form-item label="部门负责人">
              <el-select v-model="form.manager" style="width:80%" placeholder="请选择">
                <el-option v-for="item in departmentsSimpleList" :key="item.id" :value="item.username" />
              </el-select>
            </el-form-item>
            <el-form-item label="部门介绍">
              <el-input v-model="form.introduce" style="width:80%" placeholder="1-300个字符" type="textarea" :rows="3" />
            </el-form-item>
          </el-form>
        </div>
      </template></span>
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
    },
    departmentsSimpleList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      form: {
        name: '', // 部门名称
        code: '', // 部门编码
        manager: '', // 部门管理者
        introduce: '' // 部门介绍
      }
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
      this.$emit('addDepartmentsEV', this.form)
      this.$emit('update:dialogVisible', false)
    }
  }
}

</script>

<style>

</style>
