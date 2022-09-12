<style lang="scss" scoped>
.is-horizonta {
  display: flex;
  margin-bottom: 16px;
  /deep/.el-card__header {
    flex: 0 0 180px;
    padding-right: 24px;
  }
  /deep/.el-card__body {
    flex: 1;
    overflow: hidden;
    clear: both;
    height: 100%;
  }
}
.input-box {
  width: 200px;
  /deep/.el-input__inner {
    text-align: left;
  }
}
</style>
<template>
  <el-card class="is-horizonta">
    <div
      slot="header"
      class="clearfix"
    >
      <span>解析线路</span>
    </div>
    <div>
      <el-form
        :model="form"
        :rules="rules"
        label-position="left"
      >
        <el-form-item label="同步业务CNAME方式">
          <DmSelect
            v-model="form.generate_dns_mode"
            :selects="options.generate_dns_mode"
            class="input-box"
            placeholder=""
          />
          <el-button
            type="primary"
            @click="handleSubmit()"
          >保 存</el-button>
        </el-form-item>
      </el-form>
    </div>
  </el-card>
</template>
<script>
import { mapState } from 'vuex'
export default {
  data() {
    return {
      form: {
        generate_dns_mode: ''
      },
      rules: {
        group: []
      },
      options: {
        generate_dns_mode: [
          { label: 'CNAME同步', value: 'CNAME' },
          { label: 'A记录同步', value: 'A' }
        ]
      }
    }
  },
  computed: {
    ...mapState({
      disp_group: state => state.disp.disp_group
    })
  },
  created() {
    this.form.group_id = this.$route.params.id
    this.form.generate_dns_mode = this.disp_group.generate_dns_mode || ''
  },
  methods: {
    init() {

    },

    async handleSubmit() {
      try {
        await this.FetchDisp.post('/disp/group/save', { ...this.form })
        this.Message('ACTION_SUCCESS')
        await this.$store.dispatch('fetchDispGroud', { group_id: this.$route.params.id })
      } catch (error) {
        return
      }
    }
  }
}
</script>
