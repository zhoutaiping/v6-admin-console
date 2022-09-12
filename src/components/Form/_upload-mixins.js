export default {
  props: {
    value: String
  },

  data() {
    return {
      loading: false,
      token: '',
      imageUrl: ''
    }
  },

  watch: {
    value(val) {
      this.imageUrl = val
    }
  },

  created() {
    this.init()
  },

  methods: {
    async init() {
      const data = await this.Fetch.get('/upload/token')
      this.token = data.uploadToken
    },

    handleChange(info) {
      if (info.file.status === 'uploading') {
        this.loading = true
        return
      }
      if (info.file.status === 'done') {
        const url = `https://yundun-statics.yundun.com/${info.file.response.hash}`
        this.$emit('success', url)
        this.$emit('input', url)
        getBase64(info.file.originFileObj, (imageUrl) => {
          this.imageUrl = imageUrl
          this.loading = false
        })
      }
    },
    beforeUpload(file) {
      // const isJPG = file.type === 'image/jpeg'
      // if (!isJPG) {
      //   this.$message.error('You can only upload JPG file!')
      // }
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        this.$message.error('Image must smaller than 2MB!')
      }
      return isLt2M
    }
  }
}

function getBase64(img, callback) {
  const reader = new FileReader()
  reader.addEventListener('load', () => callback(reader.result))
  reader.readAsDataURL(img)
}
