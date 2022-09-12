export default {
  props: {
    id: {
      type: String,
      default: 'container'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '300px'
    },
    loading: {
      type: Boolean,
      default: false
    },
    data: {
      type: Array,
      default: () => {
        return [{ value: 0, name: '暂无数据' }]
      }
    }
  },
  data() {
    return {
      ringPlot: null
    }
  }
}
