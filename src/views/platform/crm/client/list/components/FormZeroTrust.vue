<template>
  <div v-if="form">
    <el-form-item label="零信任">
      <el-switch
        v-model="form.status"
        :active-value="1"
        :inactive-value="0"
      />
    </el-form-item>
    <template v-if="form.status">
      <el-form-item label="关联自有域名">
        <el-switch
          v-model="form.ownable"
          :active-value="1"
          :inactive-value="0"
          @change="handleChangeOwnable"
        />
      </el-form-item>
      <el-form-item label="组织域名">
        <yd-form-radio-button
          v-if="form.ownable"
          v-model="form.domain_type"
          :radios="seletDomainType"
        />
        <div style="magin-top: 8px">
          <div v-if="form.domain_type === 0">
            <el-input
              v-model="form.prefix"
              placeholder="请输入前缀"
              style="width: 120px"
            />
            <span style="padding: 0 10px">.</span>
            <yd-form-select
              :selects="selectSuffix"
              v-model="form.suffix"
              placeholder="请选择后缀"
              style="width: 200px"
            />
          </div>
          <div v-else>
            <yd-form-select
              :selects="selectDomain"
              v-model="form.own_domain"
              style="width: 300px"
              placeholder="请选择域名"
              @change="fetchIcp"
            />
            <template v-if="domainForm">
              <div style="margin-top: 12px"><strong>域名备案信息</strong></div>

              <el-card
                v-if="domainForm.icp_record"
                shadow="never"
                size="small"
                style="margin: 12px 0"
              >
                <el-form-item
                  label="版权信息"
                  class="item-box"
                >
                  <el-input
                    v-model="form.own_copyright"
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
                    v-model="form.own_police_record"
                    clearable
                    class="input-box"
                  />
                </el-form-item>
              </el-card>
              <el-alert
                v-else
                :closable="false"
                title="无备案信息"
                type="error"/>
            </template>
          </div>
        </div>
      </el-form-item>
    </template>
  </div>
</template>

<script>
export default {
  props: {
    value: Object
  },

  data() {
    return {
      form: null,
      formRule: {
        icp_record: {
          require: true
        }
      },
      selectSuffix: [],
      selectDomain: [],
      domainForm: null,
      seletDomainType: [
        {
          label: '内置后缀',
          value: 0
        },
        {
          label: '自有域名',
          value: 1
        }
      ]
    }
  },

  methods: {
    async fetchData(form) {
      const member_id = form.id
      const res = await this.Fetch.get('/fd/V4/zero.trust.member.sso.info', {
        member_id
      })

      this.form = {
        ...res,
        member_id
      }
      this.domainForm = null
      this.form.own_domain && this.fetchIcp()

      this.fetchDomain(member_id)
      this.fetchSuffix(member_id)
    },

    handleChangeOwnable(val) {
      if (!val) this.form.domain_type = 0
    },

    async getForm() {
      await this.checkDomain()
      const form = this.form

      const nForm = {
        ...form,
        status: form.status ? 'on' : 'off'
      }

      if (nForm.domain_type === 1 && !this.domainForm.icp_record) {
        this.$message.warning('无备案信息')
        throw new Error()
      }
      // if (this.domainForm) {
      //   nForm.own_copyright = this.domainForm.copyright
      //   nForm.own_police_record = this.domainForm.police_record
      // }

      return nForm
    },

    async fetchIcp() {
      const domain = this.form.own_domain
      const res = await this.Fetch.get('/fd/V4/zero.trust.web.cdn.domain.info', {
        domain,
        domain_type: 1
      })
      this.domainForm = res
    },

    async checkDomain() {
      const res = await this.Fetch.post('/fd/V4/zero.trust.member.sso.check.authdomain', this.form)
      if (!res.isOk) {
        this.$message.warning('零信任域名校验失败')
        throw new Error()
      }
    },

    async fetchSuffix(member_id) {
      const res = await this.Fetch.get('/fd/V4/zero.trust.suffix.manage.member.list', {
        member_id
      })
      const selectSuffix = res.map(_ => {
        return {
          label: _,
          value: _
        }
      })
      this.selectSuffix = selectSuffix
      if (!this.form.suffix) this.form.suffix = selectSuffix?.[0].value
    },

    async fetchDomain(member_id) {
      const res = await this.Fetch.get('/fd/V4/zero.trust.own.domain.list', {
        member_id
      })
      this.selectDomain = res.map(_ => {
        return {
          label: _,
          value: _
        }
      })
    }
  }
}
</script>
