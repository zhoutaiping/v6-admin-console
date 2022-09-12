export default {
  data() {
    return {
      loading: false,
      multipleSelection: [],
      fetch: this.InvokeAllApi,
      bindParams: {},
      params: {},
      list: [],
      responseData: {},
      resData: {}
    }
  },

  computed: {
    multipleActionDisable() {
      return this.multipleSelection.length === 0
    }
  },

  methods: {
    fetchInit(params = {}) {
      Object.assign(this.bindParams, params)
      if (this.$refs.DmData) this.$refs.DmData.initPage()
    },

    handleSearch() {
      this.$nextTick(() => {
        this.$refs.DmData.initPage()
      })
    },

    mealText(meal_flag) {
      let value = ''
      if (meal_flag) {
        const meal = this.$store.state.finance.meal_list.find((i) => {
          return i.meal_flag === meal_flag
        })
        if (meal) {
          value = meal.product_name + '【' + meal.meal_name + '】'
        }
      }
      return value
    },

    handleSelectionChange(val) {
      this.multipleSelection = val
    },

    formatResponse(response) {
      return response
    },

    formatParams(params) {
      const keys = Object.keys(JSON.parse(JSON.stringify(params)))
      const data = JSON.parse(JSON.stringify(params))
      keys.forEach(i => {
        if (data[i] === '') delete data[i]
      })
      return data
    },

    async fetchList(params = {}) {
      if (this.API_INDEX === '') {
        return
      }
      const { DmData } = this.$refs
      let _params = {
        ...params,
        ...DmData.getParams(),
        ...this.params,
        ...this.bindParams
      }
      const { API_METHOD = 'get' } = this
      _params = this.formatParams(_params)

      this.loading = true
      let total

      try {
        const response = await this.fetch[API_METHOD](this.API_INDEX, _params)
        const data = this.formatResponse(response)
        const { list } = data
        total = Number(data.total) || Number(data.count) || 0
        this.list = list
        this.responseData = response
        this.resData = response
      } catch (error) {
        this.list = []
        total = 0
      } finally {
        this.loading = false
      }
      DmData.init({ total })
    }
  }
}
