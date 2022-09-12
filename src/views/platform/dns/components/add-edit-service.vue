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
      title-label="服务信息"
      width="600px"
    >
      <el-form
        ref="Form"
        :model="form"
        :rules="rules"
        label-position="left"
        label-width="120px"
      >
        <el-form-item
          label="服务地址"
          prop="server_id"
          class="item-box"
        >

          <DmSelect
            v-model="form.server_id"
            :selects="SERVERS"
            clearable
            placeholder="服务地址"
            class="input-box"
            @change="changServer"
          />
        </el-form-item>
        <el-form-item
          label="服务器属性"
          prop="is_overseas"
          class="item-box"
        >
          <DmSelect
            v-model="form.is_overseas"
            :selects="option.is_overseas"
            disabled
            clearable
            placeholder=""
            class="input-box"
          />
        </el-form-item>
        <el-form-item
          label="适用行业"
          prop="user_trades"
          class="item-box"
        >

          <DmSelect
            v-model="form.user_trades"
            :selects="USER_TRADES"
            clearable
            placeholder=""
            class="input-box"
          />
        </el-form-item>
        <el-form-item
          v-if="mode === 'Edit'"
          label="创建时间"
          class="item-box"
        >
          <el-input
            v-model="form.created_at"
            disabled
            class="input-box"
          />
        </el-form-item>
        <el-form-item
          v-if="mode === 'Edit'"
          label="最近更新时间"
          class="item-box"
        >
          <el-input
            v-model="form.updated_at"
            disabled
            class="input-box"
          />
        </el-form-item>
      </el-form>
    </dm-dialog>
  </div>
</template>
<script>
import { deepClone } from '../../../../utils'
export default {
  data() {
    return {
      mode: 'Create',
      default_form: {
        server_id: '',
        meal_flag: '',
        status: '',
        user_trades: '0',
        is_overseas: ''
      },
      form: {},
      rules: {
        server_id: [{ required: true, message: ' ' }],
        meal_flag: [{ required: true, message: ' ' }],
        status: [{ required: true, message: ' ' }],
        user_trades: [{ required: true, message: ' ' }],
        is_overseas: [{ required: true, message: ' ' }]
      },
      option: {
        is_overseas: [{ label: '国内', value: '0' }, { label: '海外', value: '1' }],
        status: [{ label: '禁用', value: '0' }, { label: '启用', value: '1' }]
      },
      SERVERS: [],
      USER_TRADES: [
        { label: '默认-小微企业', value: '0' },
        { label: '企业', value: '1' },
        { label: '政企', value: '2' },
        { label: '互联网', value: '3' }
      ]
    }
  },

  methods: {

    handleOpen(data, option = 'Create') {
      this.mode = option
      this.getAllCnameServer()
      this.$nextTick(() => {
        this.$refs.dialog.handleOpen()
        this.form = Object.assign({}, this.default_form)
        if (this.$refs.Form) {
          this.$refs.Form.resetFields()
        }
        if (option === 'Edit') {
          this.form = Object.assign({}, data)
        }
      })
    },
    // /V4/CloudDns.Server.getAllServers
    async getAllCnameServer() {
      try {
        const data = await this.Fetch.get('/V4/CloudDns.Server.cname.getAllCnameServer', {})
        const list = deepClone(data).map(i => {
          return { label: i.server, value: i.id, is_overseas: i.is_overseas }
        })
        this.SERVERS = list
      } catch (error) {
        return
      }
    },

    changServer() {
      const item = this.SERVERS.find(i => i.value === this.form.server_id)
      this.$set(this.form, 'is_overseas', item && item.is_overseas || '')
    },
    fetchSubmit() {
      this.$refs.Form.validate((valid) => {
        if (valid) {
          let api
          if (this.mode === 'Created') {
            api = '/V4/CloudDns.Server.cname.addServerUserTrades'
          } else if (this.mode === 'Edit') {
            api = '/V4/CloudDns.Server.cname.saveServerUserTrades'
          }
          this.Fetch.post(api, { ...this.form }).then(res => {
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
