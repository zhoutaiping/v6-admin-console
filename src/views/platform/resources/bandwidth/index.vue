<template>
  <Layout />
</template>

<script>
import Layout from '@/layout/Layout'
import bandwidth from '@/views/platform/resources/bandwidth/mixins/bandwidth'

export default {
  components: { Layout },

  mixins: [bandwidth],

  async created() {
    await this.bandwidthFeatchConst()
  }
}
</script>
