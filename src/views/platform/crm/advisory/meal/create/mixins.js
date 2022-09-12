import { mapActions } from 'vuex'
export default {
  data() {
    return {
      currentTab: 0
    }
  },
  computed: {
    visitedViews() {
      return this.$store.state.tagsView.visitedViews
    }
  },
  created() {
    this.init()
  },
  methods: {
    ...mapActions({
      getProduct: 'getProduct'
    }),

    init() {
      this.$nextTick(() => {
        this.getProduct({ status: '1', page: '1', per_page: '50' })
        this.$store.commit('SET_STEP_FORM', {})
        this.$store.commit('SET_CREATE_FORM', {})
        if (this.$refs.setp1) {
          this.$refs.setp1.init()
          this.form.member_id = this.$refs.setp1.form.member_id
        }
        if (this.$refs.setp2) {
          this.$refs.setp2.init()
        }
        if (this.$refs.setp3) {
          this.$refs.setp3.init()
        }
      })
    },

    change(type = '') {
      if (type && type !== 'reset') {
        if (this.$refs.setp1) {
          this.form.member_id = this.$refs.setp1.form.member_id
        }
        if (this.$refs.setp2) {
          this.setpForm = Object.assign(this.$refs.setp1.form, this.$refs.setp2.form)
          this.$store.commit('SET_STEP_FORM', this.setpForm)
          this.$store.commit('SET_CREATE_FORM', this.$refs.setp2.apiParams())
        }
      }
      if (type === 'add') {
        this.currentTab++
        if (this.currentTab === 2) {
          this.$refs.setp3.init()
        }
      } else if (type === 'del') {
        this.currentTab--
      } else if (type === 'reset') {
        this.currentTab = 0
        this.init()
      } else {
        this.message.warning('操作失败！')
        this.currentTab = 0
        this.init()
      }
    },

    isActive(route) {
      return route.path === this.$route.path
    },

    close() {
      const find = this.visitedViews.find(i => { return i.path === this.$route.path })
      if (find) {
        this.closeSelectedTag(find)
      }
    },

    closeSelectedTag(view) {
      this.$store.dispatch('delView', view).then(({ visitedViews }) => {
        if (this.isActive(view)) {
          const latestView = visitedViews.slice(-1)[0]
          if (latestView) {
            this.$router.push('/advisory/meal')
          } else {
            this.$router.push('/')
          }
        }
      })
    }
  }
}
