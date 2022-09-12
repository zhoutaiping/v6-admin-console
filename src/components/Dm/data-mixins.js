export default {
  mounted() {
    if (this.autoInit) this.handleInit()
  },
  methods: {
    handleInit() {
      const { page, per_page } = this.pagination
      this.$emit('init', {
        page,
        per_page,
        pagesize: this.group ? per_page : ''
      })
    },

    getPagination() {
      return this.pagination
    },

    getParams() {
      const { page, per_page } = this.pagination
      return {
        page,
        per_page,
        current_page: page,
        current_size: per_page,
        pagesize: this.group ? per_page : ''
      }
    },

    init(options) {
      let { total = 0 } = options
      if (isNaN(total)) total = 0
      this.pagination.total = total
    },

    initPage() {
      this.handleCurrentChange(1)
    },

    handleSizeChange(per_page) {
      this.pagination.per_page = per_page
      this.pagination.page = 1
      this.handleInit()
    },

    handleCurrentChange(page) {
      this.pagination.page = page
      this.handleInit()
    }
  }
}
