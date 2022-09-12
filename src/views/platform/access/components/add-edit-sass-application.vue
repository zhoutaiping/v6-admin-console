<style lang="scss" scoped>
.input-box {
  width: 300px;
}
.item-box {
  margin-bottom: 5px;
}
</style>
<template>
  <div>
    <dm-dialog
      ref="dialog"
      :fetch-submit="fetchSubmit"
      :mode="mode"
      title-label="SaaS应用"
      width="700px"
      aside
    >
      <DmAlert>
        消息模板
      </DmAlert>
      <el-form
        ref="Form"
        :model="form"
        :rules="rules"
        label-position="left"
        label-width="120px"
      >
        <el-form-item
          label="模板类型"
          prop="template_type_id"
          class="item-box"
        >
          <DmSelect
            v-model="form.template_type_id"
            :selects="saas_template"
            clearable
            placeholder="模板类型"
            class="input-box"
          />
        </el-form-item>
        <el-form-item
          label="应用类型"
          prop="app_type"
          class="item-box"
        >
          <el-input
            v-model="form.app_type"
            class="input-box"
          />
        </el-form-item>
        <el-form-item
          label="应用图标"
          prop="logo"
          class="item-box"
        >
          <a-upload
            :file-list="fileList"
            :remove="handleRemove"
            :before-upload="beforeUpload"
            @change="changeFile"
          >
            <a-button>
              <a-icon type="upload" /> Select File
            </a-button>
            <span
              v-if="!form.logo"
              style="color:red;"
            >请上传LOGO</span>
          </a-upload>
          <img
            v-show="form.logo"
            :src="form.logo"
            alt="avatar"
            height="150px"
            style="margin-top:10px"
          >
        </el-form-item>
        <el-form-item
          label="默认会话时长"
          prop="session_duration"
        >
          <DmSelect
            v-model="form.session_duration"
            :selects="option.session_duration"
            clearable
            placeholder="会话时长"
            class="input-box"
          />
        </el-form-item>
        <el-form-item
          label-width="0"
          prop="saas_conf"
        >
          <sass-conf ref="sass_conf" />
        </el-form-item>

      </el-form>
    </dm-dialog>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import SassConf from './sass-conf/index'
export default {
  components: { SassConf },
  data() {
    return {
      mode: 'Create',
      default_form: {
        template_type_id: '',
        app_type: '',
        logo: '',
        session_duration: '',
        saas_conf: {
          sso_login_url: {
            display: false,
            required: true,
            content: ''
          },
          use_recipient_destination_url: {
            display: false,
            required: true,
            recipient_url: '',
            destination_url: ''
          },
          entity_id: {
            display: false,
            required: true,
            content: ''
          },
          name_id_format: {
            display: false,
            required: true,
            content: ''
          },
          attribute: {
            display: false,
            required: true,
            allowAdd: true,
            content: []
          },
          algorithmMethod: {
            display: false,
            required: true,
            content: ''
          },
          digestMethod: {
            display: false,
            required: true,
            content: ''
          }
        }
      },
      form: {},
      fileList: [],
      uploading: false,
      rules: {
        template_type_id: [{ required: true, message: ' ' }],
        app_type: [{ required: true, message: ' ' }],
        logo: [{ required: true, message: ' ' }],
        session_duration: [{ required: true, message: ' ' }],
        saas_conf: [{ type: 'object' }]
      },
      option: {
        session_duration: [
          { label: '15分钟', value: '900' },
          { label: '30分钟', value: '1800' },
          { label: '1小时', value: '3600' },
          { label: '6小时', value: '21600' },
          { label: '24小时', value: '86400' },
          { label: '7天', value: '604800' },
          { label: '30天', value: '2592000' }
        ]
      },
      config: {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    }
  },
  computed: {
    ...mapState({
      saas_template: state => state.access.saas_template
    })
  },

  methods: {
    handleOpen(data, option = 'Create') {
      this.$store.dispatch('access/featchSaasTemplate')
      this.form = Object.assign({}, this.default_form)
      this.mode = option
      this.fileList = []
      this.$nextTick(() => {
        this.$refs.dialog.handleOpen()
        if (this.$refs.Form) {
          this.$refs.Form.resetFields()
          this.form.logo = ''
        }
        if (option === 'Edit') {
          this.form = Object.assign({}, data)
          setTimeout(() => {
            this.$refs.sass_conf && this.$refs.sass_conf.init(data)
          }, 200)
          return
        } else {
          this.$refs.sass_conf && this.$refs.sass_conf.init(this.default_form)
          return
        }
      })
    },

    handleRemove(file) {
      const index = this.fileList.indexOf(file)
      const newFileList = this.fileList.slice()
      newFileList.splice(index, 1)
      this.fileList = newFileList
      this.form.logo = ''
    },

    beforeUpload(file) {
      this.fileList = [file]
      return false
    },

    changeFile(file) {
      const { fileList, config } = this
      if (!fileList.length) return
      this.uploading = true
      const params = new FormData()
      params.append('logo', fileList[0])
      this.Fetch.post('/V4/uploadfile', params, config).then(res => {
        this.form.logo = res.logo
        this.uploading = false
      }).catch(e => {
        this.uploading = false
      })
    },

    fetchSubmit() {
      this.$refs.Form.validate((valid) => {
        if (valid) {
          let api = ''

          if (this.mode === 'Create') {
            api = '/fd/V4/zero.trust.saas.conf.add'
          } else if (this.mode === 'Edit') {
            api = '/fd/V4/zero.trust.saas.conf.save'
          }
          const data = {
            ...this.form
          }
          const sass_conf = this.$refs.sass_conf.getForm()
          data.saas_conf = sass_conf
          if (Object.keys(sass_conf).length === 0) {
            this.message.warning('应用属性最少配置一个！')
            this.$refs.dialog.afterValidate()
            return
          }
          this.Fetch.post(api, data).then(res => {
            this.Message('ACTION_SUCCESS')
            this.$emit('init')
            this.$refs.dialog.handleClose()
          }).catch(e => {
            this.$refs.dialog.afterValidate()
          })
        } else {
          this.$refs.dialog.afterValidate()
        }
      })
    }
  }
}
</script>
