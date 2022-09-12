import { mapState } from 'vuex'
export default {
  computed: {
    ...mapState({
      conf: (state) => state.finance.conf
    }),
    SALES() {
      return this.conf.group
    }
  },
  async created() {
    await Promise.all([this.$store.dispatch('getbasicconf'), this.$store.dispatch('getCbmsMap')])
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      const active = this.$refs.Tabs.page()
      if (active && this.$refs[active]) {
        this.$refs[active].init(this.$refs.Form.params())
      }
    }
  }
}
