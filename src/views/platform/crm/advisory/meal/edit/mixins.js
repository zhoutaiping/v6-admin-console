import defaultSetting from '@/core/defaultSetting'
import setp1 from './components/setp1'
import setp2 from './components/step2'
import setp3 from './components/step3'
export default {
  components: { setp1, setp2, setp3 },
  data() {
    return {
      operateMap: defaultSetting.operateMap,
      currentTab: 0,
      asyncDetail: {}
    }
  },
  computed: {},
  created() {
    this.$store.dispatch('getbasicconf')
    if (this.$route.query.type) {
      this.desc = this.operateMap[this.$route.query.type] || ''
    }

    if (this.$route.params.id) {
      this.$store.dispatch('detail', { id: this.$route.params.id })
    }
  },
  mounted() {},
  methods: {
    setSetp(type) {
      if (type === 'add') {
        if (this.currentTab < 2) {
          this.currentTab++
          Object.keys(this.asyncDetail).length === 0 && this.$refs.setp2.init()
        }
      } else {
        if (this.currentTab > 0) {
          this.currentTab--
        }
      }
    },

    setAsyncDetail(data = {}) {
      this.asyncDetail = data
    }
  }
}
