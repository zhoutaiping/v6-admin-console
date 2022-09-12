<style lang="scss" scoped>
.is-horizonta {
  display: flex;
  margin-bottom: 16px;
  /deep/.el-card__header {
    flex: 0 0 180px;
    padding-right: 24px;
  }
}
/deep/.el-input__inner {
 text-align: left;
}
</style>
<template>
  <el-card class="is-horizonta">
    <div slot="header" class="clearfix">
      <span>资源包</span>
    </div>
    <div>
      <el-form v-loading="loading" :model="form" :rules="rules" label-width="150px" label-position="left">
        <el-form-item label="待绑定资源包">
          <DmSelect
            v-model="form.ippool_id"
            :selects="options.ippool"
            class="input-box"
            placeholder=""
          />
          <el-button v-show="form.ippool_id" type="primary" @click="handleBind(form.ippool_id,'bind')">绑定</el-button>
        </el-form-item>
        <el-form-item label="已绑定资源包">
          <p v-for="i in options.ippool_user" :key="i.ippool_id" style="margin-bottom:0px;">
            {{ i.ippool_bn }}（{{ i.name }}）
            <el-button type="text" @click="handleBind(i.ippool_id,'unbind')">解 绑</el-button>
          </p>
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
      loading: false,
      form: {
        ippool_id: ''
      },
      rules: {},
      options: {
        ippool: [],
        ippool_user: []
      }
    }
  },
  computed: {
    ...mapState({
      ippool: state => state.disp.ip_pool_list
    })
  },

  watch: {
    ippool: {
      deep: true,
      handler(val) {
        this.init()
      }
    }
  },

  created() {
    this.init()
  },

  methods: {
    init() {
      this.loading = true
      this.options.ippool = this.ippool.filter(i => i.group_id === 0 && i.ips.length > 0).length
        ? this.ippool.filter(i => i.group_id === 0 && i.ips.length > 0).map(e => {
          return {
            label: e.ippool_bn + '(' + (e.name) + ')',
            value: e.ippool_id
          }
        })
        : []
      this.options.ippool_user = []
      this.ippool.forEach(e => {
        if (Number(e.group_id) === Number(this.$route.params.id)) {
          this.options.ippool_user.push(e)
        }
      })
      setTimeout(() => {
        this.loading = false
      }, 500)
    },

    async handleBind(id, type = '') {
      const params = {
        'disp_group_id': this.$route.params.id,
        'disp_ippool_id': id,
        'bind_type': type
      }
      this.loading = true
      try {
        await this.Fetch.post('/fd/V4/disp.ippool.bind.group', params)
        this.form.ippool_id = ''
        this.loading = false
        this.Message('ACTION_SUCCESS')
        await this.$store.dispatch('fetchIpPool', { member_id: this.$route.query.member_id })
        this.$emit('cname_init')
      } catch (error) {
        this.loading = false
        return
      }
      setTimeout(() => {
        this.loading = false
      }, 500)
    }
  }
}
</script>
