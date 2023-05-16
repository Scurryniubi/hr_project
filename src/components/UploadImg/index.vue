<template>
  <el-upload
    class="avatar-uploader"
    action="#"
    :show-file-list="false"
    :on-success="handleAvatarSuccess"
    :before-upload="beforeAvatarUpload"
    :http-request="upload"
  >
    <img v-if="imageUrl" :src="imageUrl" class="avatar">
    <i v-else class="el-icon-plus avatar-uploader-icon" />
    <el-progress v-if="showProgress" type="circle" :percentage="100" class="progress" />
  </el-upload>

</template>

<script>
// 导入 cos 模块
const COS = require('cos-js-sdk-v5')

// SECRETID 和 SECRETKEY请登录 https://console.cloud.tencent.com/cam/capi 进行查看和管理
var cos = new COS({
  SecretId: 'AKIDqXYLxObZJsGSQBl7EpFUUKySjnfKm03x',
  SecretKey: '4xe8NQL4e2CAwWwBD8weEi3EE2d4LQJz'
})
export default {
  data() {
    return {
      imageUrl: '', // 上传成功的图片地址（外链）
      percent: 0, // 图片的上传进度
      showProgress: false // 是够显示上传进度

    }
  },
  methods: {
    // 文件上传成功到后台后的回调函数
    handleAvatarSuccess(res, file) {
      // res 后端返回的响应数据 （upload内部自带ajax请求，不会走request.js）
      // file 前端本地磁盘里上传到浏览器上的文件对象信息
      // URL.createObjectURL()方法，会把文件数据转成blob(临时前端地址)
      // 知识点： img标签的src属性的值只能是：图片的base64字符串、外链地址、相对地址、blob临时地址
      this.imageUrl = URL.createObjectURL(file.raw)
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    // 自定义上传属性
    upload(res) {
      if (res.file) {
        // 显示进度条
        this.showProgress = true
        cos.putObject({
          Bucket: 'zhonggangchengwork-1318187505', // 存储桶的名称，必须
          Region: 'ap-nanjing', // 存储桶所在地域，必须字段
          Key: res.file.name, // 文件名，必须
          StorageClass: 'STANDARD', // 上传模式, 标准模式
          Body: res.file, // 上传文件对象
          // 上传进度条
          onProgress: (progressData) => {
            // console.log(JSON.stringify(progressData))
            // 控制进度条的进度
            this.percent = progressData.percent * 100
          }
        }, (err, data) => {
          if (err === null && data.statusCode === 200) {
            this.imageUrl = `https:${data.Location}`
            // 隐藏进度条
            this.showProgress = false
          }
        })
      }
    }
  }
}
</script>

<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
  .progress {
  position: absolute;
  display: flex;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #e4e4e4;
  border-radius: 50%;
  opacity: 0.9;
}
</style>
