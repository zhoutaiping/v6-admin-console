<template>
  <TransferItem
    ref="TransferItem"
    :fetch-data="fetchData"
    v-model="value"
    :size="500"
    @update="handleUpdate"
  />
</template>

<script>
import TransferItem from '@/components/Transfer/TransferItem'

export default {
  components: { TransferItem },

  data() {
    return {
      value: [],
      total: 0,
      size: 20
    }
  },

  methods: {
    init() {
      this.$refs.TransferItem.init()
    },

    getValue() {
      return {
        list: this.value,
        total: this.total
      }
    },

    handleUpdate({ total }) {
      this.total = total
    },

    async fetchData(params) {
      const res = await this.Fetch.get('V4/web.domain.group.list', {
        ...params,
        group_name: params.keyword
      })

      const list = res.list.map(_ => {
        return {
          label: _.group_name,
          value: _.id
        }
      })

      return {
        list,
        total: Number(res.total)
      }
    }
  }
}
</script>
