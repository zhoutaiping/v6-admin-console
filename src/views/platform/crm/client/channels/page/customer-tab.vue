<template>
  <a-tabs
    v-model="active"
    :tab-bar-style="{'border-bottom': 'none'}"
    type="card"
    class="tabs"
    @change="$emit('init', active)"
  >
    <a-tab-pane v-for="i in tabs" :tab="i.label" :key="i.value" />
  </a-tabs>
</template>
<script>
export default {
  data() {
    return {
      active: 'list',
      tabs: [
        { label: '终端客户', value: 'list' },
        { label: '关联记录', value: 'link' }
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
