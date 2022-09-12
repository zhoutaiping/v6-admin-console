<template>
  <DmDialog
    ref="Dialog"
    :fetch-submit="handleSubmit"
    title="域名绑定"
    width="600px"
  >
    <DmScroll>
      <DmAlert>
        注：必须绑定 1 个, 最多可以绑定 {{ bind_domain_form.domain_limit }} 个域名
      </DmAlert>
      <el-form
        v-loading="bind_domain_form.loading"
        ref="bind_domain_form"
        :model="bind_domain_form"
        :rules="rules"
      >
        <el-form-item>
          <el-checkbox-group
            v-model="bind_domain_form.domain_list"
            @change="handleCheckedDomain"
          >
            <el-checkbox
              v-for="(item,index) in DOMAIN_LIST"
              :label="item.id"
              :key="index"
              :disabled="item.package_id !=='0' && item.package_id !== bind_domain_form.plan_id"
            >{{ item.domain }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
    </DmScroll>
  </DmDialog>
</template>

<script>
export default {
  data() {
    return {
      bind_domain_form: {
        visible: false,
        loading: false,
        domain_list: [],
        domain_limit: 1,
        plan_id: ''
      },
      DOMAIN_LIST: [],
      rules: {}
    }
  },

  methods: {
    handleOpen(data) {
      this.$refs.Dialog.handleOpen()
      this.$nextTick(() => {
        this.bind_domain_form.loading = true
        this.bind_domain_form.plan_id = data.id
        const meal_detail = data['plan_setting']['meal_latest'] && data['plan_setting']['meal_latest']['meal_detail'] || null
        const default_domain_limit = meal_detail && meal_detail['base_cfg'] ? meal_detail['base_cfg']['domain_limit'] : 1 // 域名条数
        const default_domain_limit_cfg = data['plan_setting']['cfg']['kuorong'] && data['plan_setting']['cfg']['kuorong']['domain_limit'] && data['plan_setting']['cfg']['kuorong']['domain_limit']['buy_num'] || 0 // 域名条数
        this.bind_domain_form.domain_limit = Number(default_domain_limit) + Number(default_domain_limit_cfg)

        this.DOMAIN_LIST = []
        this.getDomainList({ email: data.email, page: 1, per_page: 9999 })
        setTimeout(() => {
          this.bind_domain_form.loading = false
        }, 1000)
      })
    },

    getDomainList(params) {
      this.Fetch.post('/V4/CloudDns.Domain.DnsDomain.getList', params).then(res => {
        const list = JSON.parse(JSON.stringify(res.list))
        this.DOMAIN_LIST = list
        this.getCheckDomain(list, this.bind_domain_form.plan_id)
      }).catch(e => {
        this.message.warning('获取域名失败')
      })
    },

    getCheckDomain(list, default_domain_id) {
      this.bind_domain_form.domain_list = []
      if (!list.length) {
        return
      }
      const domain_list = []
      list.forEach(e => {
        if (e.package_id === default_domain_id) {
          domain_list.push(e.id)
        }
      })
      this.bind_domain_form.domain_list = domain_list
    },

    handleCheckedDomain(value) {
      this.bind_domain_form.domain_list = value
    },

    handleSubmit() {
      if (!this.bind_domain_form.domain_list.length) {
        this.message.warning('请选择要绑定的域名！')
        return
      }

      if (this.bind_domain_form.domain_list.length > this.bind_domain_form.domain_limit) {
        this.message.warning('最多可以绑定' + this.bind_domain_form.domain_limit + '个域名！')
        return
      }
      const params = {
        'domainids': this.bind_domain_form.domain_list,
        'plan_id': this.bind_domain_form.plan_id
      }

      this.bind_domain_form.loading = true
      this.Fetch.post('/fd/V4/order.bind_domain', params).then(res => {
        this.Message('ACTION_SUCCESS')
        this.bind_domain_form.loading = false
        this.$emit('fetchData')
        this.$refs.Dialog.handleClose()
      }).catch(e => {
        this.bind_domain_form.loading = false
      })
    }

  }
}
</script>
