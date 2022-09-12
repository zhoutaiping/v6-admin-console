<template>
  <DmDialog
    ref="dialog"
    :fetch-submit="fetchSubmit"
    :close-on-click-modal="false"
    width="600px"
    title="登录设置"
  >
    <el-form
      ref="Form"
      :model="form"
      :rules="rules"
      label-position="left"
      label-width="120px"
    >
      <el-form-item
        label="登录白名单IP"
        prop="ips"
      >
        <el-input
          v-model="form.ips"
          :autosize="{ minRows: 2}"
          type="textarea"
          placeholder="请使用回车分割多个ip"
          style="width:400px"
        />
      </el-form-item>
      <el-form-item
        label="可登录时间"
        prop="time"
      >
        <el-date-picker
          v-model="form.time"
          :default-time="['00:00:00', '23:59:59']"
          type="datetimerange"
          placeholder="选择开始时间"
          range-separator="-"
          value-format="yyyy-MM-dd HH:mm:ss"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          style="width:400px"
        />
      </el-form-item>
    </el-form>
  </DmDialog>
</template>
<script>
export default {
  data() {
    return {
      form_default: {
        uid: '',
        ips: '',
        time: []
      },
      form: {},
      rules: {
        uuid: [],
        ips: { message: '请输入IP' },
        time: { type: 'array', message: ' ' }
      }
    }
  },
  methods: {
    handleOpen(form, option) {
      this.$nextTick(() => {
        this.$refs.dialog.handleOpen()
        this.form = Object.assign({}, this.form_default)
        this.$refs.Form && this.$refs.Form.resetFields()
        this.form.uid = form.id
        this.getSetting({ uid: form.id })
      })
    },
    async getSetting(params = {}) {
      try {
        const data = await this.Fetch.get('/V4/user.setting.get', params)
        // const data = { 'uid': 1, 'group_data': { 'time_white_list': { 'content': '2021-12-23 00:00:00~2021-12-23 18:00:00' }, 'ip_white_list': { 'content': '1.1.1.1,2.2.2.2' } } }
        const group_data = data.group_data
        const time_white_list = group_data.time_white_list && group_data.time_white_list.content || ''
        const ip_white_list = group_data.ip_white_list && group_data.ip_white_list.content || ''
        const ips = ip_white_list.split(',').length && ip_white_list.split(',')
        const time = time_white_list.split(',').length && time_white_list.split(',')[0]
        this.form.time = time.split('~') || []
        this.form.ips = ips.join('\n') || ''
      } catch (error) {
        return
      }
    },
    getForm() {
      const form = {
        uid: this.form.uid,
        group_data: {
          time_white_list: {
            content: ''
          },
          ip_white_list: {
            content: ''
          }
        }
      }
      const time = this.form.time && this.form.time.length ? JSON.parse(JSON.stringify((this.form.time.join('~')))) : ''
      const ips = this.form.ips && JSON.parse(JSON.stringify(this.form.ips.split('\n'))) || []
      let ip_check = true
      const ip = []
      ips.forEach(i => {
        if (i) {
          const i_ip = i.split('-')
          if (i_ip.length === 1) {
            if (isIp(i_ip[0])) {
              ip.push(i_ip[0])
            } else {
              this.message.warning('IP格式不正确!')
              ip_check = false
              return
            }
          } else if (i_ip.length === 2) {
            const max_number = Number(i_ip[1])
            const ip_item = i_ip[0].split('.')
            const last_number = Number(ip_item[3])
            if (!isIp(i_ip[0])) {
              this.message.warning('IP段格式不正确!')
              ip_check = false
              return
            }
            if (last_number >= max_number || max_number > 255) {
              this.message.warning('IP段格式不正确!')
              ip_check = false
              return
            }
            ip.push(i)
          }
        }
      })
      if (!ip_check) {
        return null
      }
      form.group_data = {
        'time_white_list': {
          content: time
        },
        'ip_white_list': {
          content: ip.join(',')
        }
      }
      return form
    },
    fetchSubmit() {
      this.$refs.Form.validate(valid => {
        if (valid) {
          // const { ips = '', time = [] } = this.form
          // if (!ips && (!time || time.length === 0)) {
          //   this.message.warning('登录白名单IP 和 登录时间必须选填一个')
          //   this.$refs.dialog.afterValidate()
          //   return
          // }
          const form = this.getForm()
          if (!form) {
            this.$refs.dialog.afterValidate()
            return
          }
          this.Fetch.post('/V4/user.setting.save', { ...form }).then(res => {
            this.Message('ACTION_SUCCESS')
            this.$refs.dialog.handleClose()
          })
          this.$refs.dialog.afterValidate()
        } else {
          this.$refs.dialog.afterValidate()
        }
      })
    }
  }
}

function isIp(value) {
  var regexp = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/
  var valid = regexp.test(value)
  if (!valid) { // 首先必须是 xxx.xxx.xxx.xxx 类型的数字，如果不是，返回false
    return false
  }
  return value.split('.').every(function (num) {
    // 切割开来，每个都做对比，可以为0，可以小于等于255，但是不可以0开头的俩位数
    // 只要有一个不符合就返回false
    if (num.length > 1 && num.charAt(0) === '0') {
      // 大于1位的，开头都不可以是‘0’
      return false
    } else if (parseInt(num, 10) > 255) {
      // 大于255的不能通过
      return false
    }
    return true
  })
}
</script>
