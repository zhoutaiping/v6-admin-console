<template>
  <a-upload
    :show-upload-list="false"
    :before-upload="beforeUpload"
    :data="{ token }"
    list-type="picture-card"
    class="avatar-uploader"
    action="https://upload.qiniup.com"
    @change="handleChange"
  >
    <img v-if="imageUrl" :src="imageUrl" alt="avatar" >
    <div v-else>
      <a-icon :type="loading ? 'loading' : 'plus'" />
      <div class="ant-upload-text">Upload</div>
    </div>
  </a-upload>
</template>
<script>
import mixins from './_upload-mixins'
export default {
  name: 'FormUploadImg',
  mixins: [mixins]
}
</script>

<style lang="less">
  .avatar-uploader > .ant-upload {
    width: 128px;
    height: 128px;

    img{
      max-width: 128px;
    }
  }
  .ant-upload-select-picture-card i {
    font-size: 32px;
    color: #999;
  }

  .ant-upload-select-picture-card .ant-upload-text {
    margin-top: 8px;
    color: #666;
  }
</style>
