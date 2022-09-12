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
.item-box {
  display: inline-block;
  min-width: 380px;
}
</style>
<template>
  <el-card class="is-horizonta">
    <div slot="header" class="clearfix">
      <span>访问策略配置</span>
    </div>
    <div>
      <el-form :model="form" :rules="rules" label-width="100px" label-position="left">
        <el-form-item label-width="0px">
          <el-form-item label="推荐访问策略" class="item-box">
            <DmSelect
              v-model="form.dns_view_mode"
              :selects="options.dns_view_mode"
              class="input-box"
              placeholder=""
            />
            <el-button type="primary" @click="handleSubmit('dns_view_mode')">保存</el-button>
          </el-form-item>
          <el-form-item label="自定义TTL" class="item-box">
            <el-input-number
              v-model="form.dns_ttl"
              :controls="false"
              :min="0"
              :precision="0"
              class="input-box"
              placeholder="默认30"
            />
            <el-button type="primary" @click="handleSubmit('dns_ttl')">保存</el-button>
          </el-form-item>
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
        group_id: '',
        dns_view_mode: 'default',
        dns_ttl: 30
      },
      rules: {
        ttl: [],
        group: []
      },
      options: {
        dns_view_mode: [
          { label: '默认用户组访问策略', value: 'default' },
          { label: '网络优先', value: 'network' },
          { label: '地理就近', value: 'region' }
        ]
      }
    }
  },
  computed: {
    ...mapState({
      disp_group: state => state.disp.disp_group
    })
  },
  watch: {
    disp_group: {
      deep: true,
      handler(val) {
        this.form.dns_ttl = this.disp_group.dns_ttl || ''
        this.form.dns_view_mode = this.disp_group.dns_view_mode || ''
      }
    }
  },
  created() {
    this.form.group_id = this.$route.params.id
    this.form.dns_ttl = this.disp_group.dns_ttl || ''
    this.form.dns_view_mode = this.disp_group.dns_view_mode || ''
  },
  methods: {

    async handleSubmit(key = '') {
      const params = {
        group_id: this.form.group_id
      }

      if (key !== '') {
        params[key] = this.form[key] || ''
      } else {
        return
      }

      try {
        await this.FetchDisp.post('/disp/group/save', params)
        this.Message('ACTION_SUCCESS')
        await this.$store.dispatch('fetchDispGroud', { group_id: this.$route.params.id })
      } catch (error) {
        return
      }
    }
  }
}
</script>
