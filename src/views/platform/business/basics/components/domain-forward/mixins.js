import { mapState, mapActions } from 'vuex'
import { deepClone } from '@/utils'
export default {
  data() {
    return {
      params: {},
      group: '',
      default_form: {
        domain_proxy_conf: {
          proxy_timeout: 0,
          keep_new_src_time: 0,
          center_node_cache_only: 0
        },
        dynamic_accelerate: {
          status: 0
        },
        upload_file: {
          upload_size: 0,
          upload_size_unit: 'K'
        },
        cdn_advance_cache_back: {
          cache_post: 0,
          from_other_domain: ''
        },
        real_remote_addr: {
          status: 0,
          custom_ip_header: ''
        },
        head_form: {
          customized_req_headers: ''
        },
        log_ratio: {
          log_ratio: 0,
          log_reserved: 0
        },

        ssl_acl: {
          mode: ''
        },
        cloud_waf: {
          max_times: 0,
          action: ''
        },
        white_check_status: {
          white_check: 0
        }
      }
    }
  },
  computed: {
    ...mapState({
      web_domain: (state) => state.disp.web_domain
    })
  },
  created() {
    this.params.domain_id = this.$route.params.id
    this.params.user_id = this.$route.query.member_id
  },
  methods: {
    ...mapActions(['getWebDomain', 'saveWebDomain']),
    async init() {
      try {
        const params = { ...this.params, group: this.group }
        await this.getWebDomain(params)
        await this.initOption(this.web_domain)
      } catch (error) {
        return
      }
    },

    initForm(default_data, value_data) {
      const defaul = deepClone(default_data)
      const value = deepClone(value_data)
      Object.keys(defaul).forEach((key) => {
        if (value[key]) {
          defaul[key] = value[key]
        }
      })
      return defaul
    },

    async Submit(from = {}) {
      const params = {
        ...this.params,
        group: { ...from }
      }
      try {
        await this.saveWebDomain(params)
        this.Message('ACTION_SUCCESS')
        await this.init()
      } catch (error) {
        return
      }
    }
  }
}
