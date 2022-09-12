<template>
  <a-upload
    :multiple="false"
    :data="{ token }"
    name="file"
    action="https://upload.qiniup.com"
    @change="handleChange"
  >
    <a-button>
      <a-icon type="upload" /> Click to Upload
    </a-button>
  </a-upload>
</template>
<script>
import mixins from './_upload-mixins'
export default {
  name: 'FormUploadFile',
  mixins: [mixins]
}
</script>

<style lang="less">
.avatar-uploader > .ant-upload {
  width: 128px;
  height: 128px;

  img {
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
