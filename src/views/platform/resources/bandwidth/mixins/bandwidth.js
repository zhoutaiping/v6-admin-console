import { mapState, mapActions } from 'vuex'

export default {
  computed: {
    ...mapState({
      bandwidthLabel: state => state.bandwidth.label,
      bandwidthSelectMeal: state => state.bandwidth.selectMeal
    })
  },

  methods: {
    ...mapActions({
      bandwidthFeatchConst: 'bandwidth/featchConst',
      bandwidthFetchMeal: 'bandwidth/fetchMeal'
    })
  }
}
