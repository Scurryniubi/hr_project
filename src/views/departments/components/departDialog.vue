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
      @close="closeDialog"
      @update:visible="val=>$emit('update:dialogVisible', false)"
    >
      <span><template>
        <div>
          <el-form ref="deptForm" :model="form" :rules="rules" label-width="120px">
            <el-form-item prop="name" label="部门名称">
              <el-input v-model="form.name" style="width:80%" placeholder="1-50个字符" />
            </el-form-item>
            <el-form-item prop="code" label="部门编码">
              <el-input v-model="form.code" style="width:80%" placeholder="1-50个字符" />
            </el-form-item>
            <el-form-item prop="manager" label="部门负责人">
              <el-select v-model="form.manager" style="width:80%" placeholder="请选择">
                <el-option v-for="item in departmentsSimpleList" :key="item.id" :value="item.username" />
              </el-select>
            </el-form-item>
            <el-form-item prop="introduce" label="部门介绍">
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
    },
    validataArr: {
      type: Array,
      default: () => []
    },
    clickId: {
      type: String,
      default: () => null
    },
    isEdit: {
      type: Boolean,
      default: () => false
    }
  },
  data() {
    // 在此处写校验规则
    const validateCode = (rule, value, callback) => {
      // 先找到所有的部门编码
      // console.log(this.validataArr)
      let deptCode = this.validataArr.map(item => item.code)
      // console.log(deptCode)
      // 如果是编辑，则需要排除和自己的Code冲突
      if (this.isEdit) {
        deptCode = this.validataArr.filter(item => item.id !== this.clickId).map(item => item.code)
        // console.log(deptCode)
      }
      // console.log(deptCode.includes(value))
      if (deptCode.includes(value)) {
        callback(new Error(`部门编码 ${value} 已经存在`))
      } else {
        callback()
      }
    }
    return {
      form: {
        name: '', // 部门名称
        code: '', // 部门编码
        manager: '', // 部门管理者
        introduce: '' // 部门介绍
      },
      rules: {
        name: [
          { required: true, message: '部门名称不能为空', trigger: 'blur' },
          { min: 2, max: 10, message: '部门名称要求2-10个字符', trigger: 'blur' }
          // { validator: validateName, trigger: 'blur' }
        ],
        code: [
          { required: true, message: '部门编码不能为空', trigger: 'blur' },
          { min: 1, max: 20, message: '部门编码要求1-20个字符', trigger: 'blur' },
          { validator: validateCode, trigger: 'blur' }
        ],
        manager: [
          { required: true, message: '部门负责人不能为空', trigger: 'change' }
        ],
        introduce: [
          { required: true, message: '部门介绍不能为空', trigger: 'blur' },
          { min: 1, max: 300, message: '部门介绍要求1-300个字符', trigger: 'blur' }
        ]
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
      this.$refs.deptForm.resetFields()
    },
    enterFn() {
      this.$refs.deptForm.validate(async(val) => {
        if (val) {
          this.$emit('addDepartmentsEV', this.form)
          this.$refs.deptForm.resetFields()
          this.$emit('update:dialogVisible', false)
        }
      })
    },
    closeDialog() {
      this.$refs.deptForm.resetFields()
    }
  }
}

</script>

<style>

</style>
