<template>
  <div>
    <!-- 放置一个弹层 用来编辑新增节点 -->
    <el-dialog title="新增权限点" :visible="showDialog" @close="btnCancel">
      <!-- 表单 -->
      <el-form ref="perForm" :model="formData" :rules="rules" label-width="120px">
        <el-form-item label="权限名称" prop="name">
          <el-input v-model="formData.name" style="width:90%" />
        </el-form-item>
        <el-form-item label="权限标识" prop="code">
          <el-input v-model="formData.code" style="width:90%" />
        </el-form-item>
        <el-form-item label="权限描述">
          <el-input v-model="formData.description" style="width:90%" />
        </el-form-item>
        <el-form-item label="开启">
          <el-switch
            v-model="formData.enVisible"
            active-value="1"
            inactive-value="0"
          />
        </el-form-item>
      </el-form>
      <el-row slot="footer" type="flex" justify="center">
        <el-col :span="6">
          <el-button size="small" type="primary" @click="confirmFn">确定</el-button>
          <el-button size="small" @click="btnCancel">取消</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    // 是否显示弹层
    showDialog: {
      type: Boolean
    },
    // 添加权限-类型
    type: {
      type: [Number, String],
      default: 0
    },
    // 添加权限-pid(目标)
    pid: {
      type: [Number, String],
      default: 0
    },
    // 编辑时-传入的数据对象
    formDataObj: {
      type: Object,
      default: _ => {}
    },
    // 用于校验的数组
    originList: {
      type: Array,
      default: (_) => []
    },
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    // 校验权限名称
    const validName = (rule, value, callback) => {
      // 添加时的校验： 名字不能取子元素的名字
      let existNameList = this.originList.filter(item => item.pid === this.formData.pid)
      if (this.isEdit) {
        // 编辑时的校验： 名字不能取兄弟（排除自己）的名字
        // 找兄弟，排除自己
        existNameList = this.originList.filter(item => item.pid === this.formData.pid && item.id !== this.formData.id)
      }
      existNameList.map(it => it.name).includes(value)
        ? callback(new Error(value + '已经占用'))
        : callback()
    }

    // 校验权限标识
    const validCode = (rule, value, callback) => {
      // 添加时的校验：code不能重复
      let existCodeList = this.originList
      if (this.isEdit) {
        // 编辑时的校验: code能取自己
        existCodeList = this.originList.filter(item => item.id !== this.formData.id)
      }
      existCodeList.map(it => it.code).includes(value)
        ? callback(new Error(value + '已经占用'))
        : callback()
    }

    return {
      permissionList: [], // 权限管理列表数据
      formData: {
        name: '', // 名称
        code: '', // 权限标识
        description: '', // 描述
        enVisible: '0', // 开启
        pid: '', // 添加到哪个节点下
        type: '' // 类型吖
      },
      rules: {
        name: [{ required: true, message: '权限名称不能为空', trigger: 'blur' },
          { validator: validName, trigger: 'blur' }],
        code: [{ required: true, message: '权限标识不能为空', trigger: 'blur' },
          { validator: validCode, trigger: 'blur' }]
      }
    }
  },
  // 监听传来的type和pid的变化，实现实时赋值
  watch: {
    showDialog() {
      this.formData.type = this.type
      this.formData.pid = this.pid
    },
    formDataObj() {
      this.formData = { ...this.formDataObj }
    }
  },
  methods: {
    // 关闭弹框
    btnCancel() {
      this.formData = {
        name: '', // 名称
        code: '', // 标识
        description: '', // 描述
        type: '', // 类型 该类型 不需要显示 因为点击添加的时候已经知道类型了
        pid: '', // 因为做的是树 需要知道添加到哪个节点下了
        enVisible: '0' // 开启
      }
      this.$refs.perForm.resetFields()
      this.$emit('close')
    },
    // 确定按钮-点击事件
    confirmFn() {
      // 验证用户是否输入了必填项
      this.$refs.perForm.validate(async valid => {
        if (valid) {
          this.$emit('confirm', this.formData)
        }
      })
    }

  }
}
</script>

<style>

</style>
