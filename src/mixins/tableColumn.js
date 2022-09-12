export default {
  data() {
    return {
      tabKey: 0,
      check: []
    }
  },
  created() {
    if (this.PagePanel) {
      if (localStorage.getItem(this.PagePanel)) {
        this.check = JSON.parse(localStorage.getItem(this.PagePanel)) || []
        this.TabColumn('set', this.check)
      } else {
        this.TabColumn('init', [])
      }
    }
  },
  methods: {
    TabColumn(type, data) {
      if (type === 'init') {
        const column = JSON.parse(JSON.stringify(this.column))
        this.check = []
        column.forEach(_ => {
          this.check.push(_.dataIndex)
        })
        this.tableColumn = column
      } else if (type === 'set') {
        this.check = data
        let column = JSON.parse(JSON.stringify(this.column))
        column = column.filter(_ => data.includes(_.dataIndex))
        if (this.PagePanel) {
          localStorage.setItem(this.PagePanel, JSON.stringify(data))
        }
        this.tableColumn = column
        this.tabKey++
      }
    }
  }
}
