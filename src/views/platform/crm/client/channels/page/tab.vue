<template>
  <a-tabs
    v-model="active"
    :tab-bar-style="{'border-bottom': 'none'}"
    class="tabs"
    type="card"
    @change="$emit('init', active)"
  >
    <a-tab-pane v-for="i in tabs" :tab="i.label" :key="i.value" />
  </a-tabs>
</template>
<script>
export default {
  data() {
    return {
      active: 'ongoing',
      tabs: [
        { label: '合作中渠道', value: 'ongoing' },
        { label: '历史渠道', value: 'history' },
        { label: '新增解除记录', value: 'relieve' }
      ]
    }
  },
  methods: {
    page() {
      return this.active
    }
  }
}
</script>
