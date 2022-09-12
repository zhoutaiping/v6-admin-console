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
          label="服务器地址"
          prop="server_id"
          class="item-box"
        >
          <el-input
            v-if="mode === 'Edit'"
            v-model="form.server"
            readonly
            class="input-box"
          />
          <DmSelect
            v-else
            v-model="form.server_id"
            :selects="Servers"
            clearable
            placeholder="服务器地址"
            class="input-box"
          />
        </el-form-item>
        <el-form-item
          label="套餐"
          prop="meal_flag"
          class="item-box"
        >
          <DmSelect
            v-model="form.meal_flag"
            :selects="mealList"
            clearable
            placeholder="套餐"
            class="input-box"
          />
        </el-form-item>
        <el-form-item
          label="状态"
          prop="status"
          class="item-box"
        >
          <DmSelect
            v-model="form.status"
            :selects="option.status"
            :disabled="mode === 'Edit'"
            clearable
            placeholder="套状态餐"
            class="input-box"
          />
        </el-form-item>
        <el-form-item
          v-if="mode === 'Edit'"
          label="服务器属性"
          prop="is_overseas"
        >

          <DmSelect
            v-model="form.is_overseas"
            :selects="option.is_overseas"
            :disabled="mode === 'Edit'"
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
            readonly
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
            readonly
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
        is_overseas: ''
      },
      form: {},
      rules: {
        server_id: [{ required: true, message: ' ' }],
        meal_flag: [{ required: true, message: ' ' }],
        status: [{ required: true, message: ' ' }],
        is_overseas: []
      },
      option: {
        is_overseas: [{ label: '国内', value: '0' }, { label: '海外', value: '1' }],
        status: [{ label: '禁用', value: '0' }, { label: '启用', value: '1' }]
      },
      mealList: [],
      Servers: []
    }
  },

  methods: {

    handleOpen(data, option = 'Create') {
      this.mode = option
      this.getAllServers()
      this.getDnsServerPackageList()
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
    async getAllServers() {
      this.Servers = []
      try {
        const data = await this.Fetch.get('/V4/CloudDns.Server.getAllServers', {})
        const list = deepClone(data).map(i => {
          return { label: i.server, value: i.id }
        })
        this.Servers = list
      } catch (error) {
        return
      }
    },
    async getDnsServerPackageList() {
      this.mealList = []
      try {
        const data = await this.Fetch.get('/V4/CloudDns.Server.getDnsPackageList', {})
        const list = deepClone(data).map(i => {
          return { label: i.meal_name, value: i.meal_flag }
        })
        this.mealList = list
      } catch (error) {
        return
      }
    },
    fetchSubmit() {
      this.$refs.Form.validate((valid) => {
        if (valid) {
          let api
          if (this.mode === 'Created') {
            api = '/V4/CloudDns.Server.addDnsServerPackage'
          } else if (this.mode === 'Edit') {
            api = '/V4/CloudDns.Server.saveDnsServerPackage'
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
