<template>
  <div class="user-info">
    <!-- 个人信息 -->
    <el-form label-width="220px">
      <!-- 工号 入职时间 -->
      <el-row class="inline-info">
        <el-col :span="12">
          <el-form-item label="工号">
            <el-input v-model="userInfo.workNumber" class="inputW" />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="入职时间">
            <el-date-picker
              v-model="userInfo.timeOfEntry"
              style="width: 300px"
              type="date"
              class="inputW"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <!-- 姓名 部门 -->
      <el-row class="inline-info">
        <el-col :span="12">
          <el-form-item label="姓名">
            <el-input v-model="userInfo.username" class="inputW" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="部门">
            <el-input v-model="userInfo.departmentName" class="inputW" readonly />
          </el-form-item>
        </el-col>
      </el-row>
      <!--手机 聘用形式  -->
      <el-row class="inline-info">
        <el-col :span="12">
          <el-form-item label="手机">
            <el-input v-model="userInfo.mobile" style="width: 300px" readonly />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="聘用形式">
            <el-select v-model="userInfo.formOfEmployment" class="inputW">
              <el-option
                v-for="item in EmployeeEnum.hireType"
                :key="item.id"
                :label="item.value"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <!-- 员工照片 -->
      <el-row class="inline-info">
        <el-col :span="12">
          <el-form-item label="员工头像">
            <!-- 放置上传图片 -->
            <UploadImg ref="UploadImg" />
          </el-form-item>
        </el-col>
      </el-row>
      <!-- 保存个人信息 -->
      <el-row class="inline-info" type="flex" justify="center">
        <el-col :span="12">
          <el-button type="primary" @click="saveUser">保存更新</el-button>
          <el-button @click="$router.back()">返回</el-button>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { getInfo, saveUserDetailByIdAPI } from '@/api'
import EmployeeEnum from '@/api/constant/employees'

export default {
  data() {
    return {
      userId: this.$route.query.id,
      EmployeeEnum, // 员工枚举数据
      userInfo: {}
    }
  },
  created() {
    // 调用获取用户信息的 API
    this.loadUserInfoById()
  },
  methods: {
    async loadUserInfoById() {
      const res = await getInfo(this.userId).catch(err => err)
      console.log(res)
      // this.$refs.uploadImg.imageUrl = res.data.staffPhoto
      console.log(this.$refs.UploadImg.imageUrl)
      this.$refs.UploadImg.imageUrl = res.data.staffPhoto
      if (!res.success) return this.$message.error(res.message)
      this.userInfo = res.data
      // this.userInfo.formOfEmployment = parseInt(this.$route.query.formOfEmployment)
      this.$set(this.userInfo, 'formOfEmployment', parseInt(this.$route.query.formOfEmployment))
    },
    // 保存用户信息的更改
    async saveUser() {
      // 获取到子组件中的图片地址
      const newimageUrl = this.$refs.UploadImg.imageUrl
      this.userInfo.staffPhoto = newimageUrl

      const res = await saveUserDetailByIdAPI(this.userInfo)
      console.log(res)
      if (!res.success) return this.$message.error(res.message)
      this.loadUserInfoById()
      this.$message.success(res.message)
    }
  }
}
</script>

<style scoped lang="scss">
  .user-info{
    padding-top:20px;
  }
</style>
