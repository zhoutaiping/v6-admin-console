<style lang="scss" scoped>
.input-box {
  width: 300px;
}
.item-box {
  margin-bottom: 5px;
}
.file-box {
  background-color: #fff;
  border: 1px solid #c0ccda;
  line-height: 20px;
  padding: 10px 20px 10px 10px;
  margin-top: 10px;
  height: auto;
  white-space: normal;
  word-wrap: break-word;
  word-break: unset;
}
::v-deep .el-tag .el-icon-close {
  position: absolute;
  top: 20%;
  right: 50px;
}
::v-deep .el-input-number.is-without-controls .el-input__inner {
  text-align: left;
}
</style>
<template>
  <div>
    <dm-dialog
      ref="dialog"
      :fetch-submit="fetchSubmit"
      :mode="mode"
      :title-label="'渠道商'"
      width="500px"
    >
      <el-form
        ref="Form"
        :model="form"
        :rules="rules"
        label-position="left"
        label-width="140px"
      >
        <el-form-item
          label="渠道邮箱"
          prop="channel_email"
          class="item-box"
        >
          <el-autocomplete
            v-model="form.channel_email"
            :fetch-suggestions="query"
            :debounce="500"
            :disabled="mode === 'Edit'"
            placeholder=""
            clearable
            class="input-box"
            @select="check"
          />
        </el-form-item>
        <el-form-item
          label="认证名称"
          class="item-box"
          prop="channel_name"
        >
          <el-input
            v-model="form.channel_name"
            disabled
            clearable
            class="input-box"
          />
        </el-form-item>
        <el-form-item
          label="后缀"
          prop="suffix"
          class="item-box"
        >
          <yd-form-select
            :disabled="mode === 'Edit'"
            v-model="form.suffix"
            :selects="selectSuffix"
            @change="fetchIcp"
          />
        </el-form-item>
        <template v-if="domainForm">
          <div><strong>域名备案信息</strong></div>
          <el-card

            shadow="never"
            style="margin: 12px 0"
          >
            <template v-if="domainForm.icp_record">
              <el-form-item
                label="版权信息"
                class="item-box"
              >
                <el-input
                  v-model="domainForm.copyright"
                  clearable
                  class="input-box"
                />
              </el-form-item>
              <el-form-item
                label="ICP备案"
                prop="icp_record"
                class="item-box"
              >
                <el-input
                  v-model="domainForm.icp_record"
                  disabled
                  clearable
                  class="input-box"
                />
              </el-form-item>
              <el-form-item
                label="公安备案"
                prop="police_record"
                class="item-box"
              >
                <el-input
                  v-model="domainForm.police_record"
                  clearable
                  class="input-box"
                />
              </el-form-item>
            </template>
            <el-alert
              v-else
              :closable="false"
              title="无备案信息"
              type="error"/>
          </el-card>

        </template>

        <el-form-item
          label="备注"
          prop="remarks"
          class="item-box"
        >
          <el-input
            v-model="form.remarks"
            :rows="2"
            type="textarea"
            class="input-box"
          />
        </el-form-item>
      </el-form>
    </dm-dialog>
  </div>
</template>
<script>

export default {
  data() {
    return {
      mode: 'Create',
      default_form: {
        channel_member_id: '',
        channel_name: '',
        channel_email: '',
        auth_name: '',
        suffix: '',
        remarks: ''
      },
      form: {},
      selectChannel: [],
      domainForm: null,
      rules: {
        channel_name: [{ required: true, message: ' ' }],
        channel_email: [{ required: true, message: ' ' }],
        suffix: [{ required: true, message: ' ' }],
        remarks: []
      },
      selectSuffix: []
    }
  },

  methods: {
    async query(val, cb, type) {
      if (val !== '') {
        const res = await this.Fetch.get('/fd/V4/zero.trust.cb.email.list?email=luorf', {
          email: this.form.channel_email
        })
        const list = res?.cb_emails.map(item => {
          return {
            label: item.email,
            value: item.email,
            id: item.channel_member_id
          }
        })
        cb(list)
      }
    },

    check(e, type) {
      this.form.channel_member_id = e.id
      this.fetchSuffix()
      this.fetchInfo()
    },

    handleOpen(data, option = 'Create') {
      this.mode = option
      this.domainForm = null
      this.$nextTick(() => {
        this.$refs.dialog.handleOpen()
        this.form = Object.assign({}, this.default_form)
        if (this.$refs.Form) {
          this.$refs.Form.resetFields()
        }
        if (option === 'Edit') {
          this.form = Object.assign({}, data)
          this.fetchIcp()
        }
      })
    },

    async fetchInfo() {
      let res
      try {
        res = await this.Fetch.get('/fd/V4/zero.trust.cb.member.certification', {
          channel_member_id: this.form.channel_member_id
        })
      } catch (e) {
        return
      }

      this.form.channel_name = res.member_auth_name
    },

    async fetchSuffix() {
      if (!this.form.channel_email) return
      let res
      try {
        res = await this.Fetch.get('/fd/V4/zero.trust.cb.domain.list', {
          channel_member_id: this.form.channel_member_id
        })
      } catch (e) {
        return
      }

      const selectSuffix = res.list.map(_ => {
        return {
          label: _,
          value: _
        }
      })
      this.form.suffix = selectSuffix?.[0]?.value
      this.selectSuffix = selectSuffix
      this.form.suffix && this.fetchIcp()
    },

    async fetchIcp() {
      const domain = this.form.suffix
      const res = await this.Fetch.get('/fd/V4/zero.trust.web.cdn.domain.info', {
        domain
      })
      this.domainForm = res
    },

    fetchSubmit() {
      this.$refs.Form.validate((valid) => {
        if (valid) {
          let api = ''
          const data = {
            ...this.form,
            suffix_copyright: this.domainForm.copyright,
            suffix_police_record: this.domainForm.police_record
          }

          if (!this.domainForm.icp_record) {
            this.$message.warning('无备案信息')
            throw new Error()
          }

          if (this.mode === 'Create') {
            api = '/fd/V4/zero.trust.suffix.manage.add'
          } else if (this.mode === 'Edit') {
            api = '/fd/V4/zero.trust.suffix.manage.save'
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
