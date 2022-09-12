<template>
  <a-tabs
    v-model="active"
    :tab-bar-style="{'border-bottom': 'none'}"
    class="tabs"
    type="card"
    @change="e=>{
      $emit('init', active)
    }"
  >
    <a-tab-pane
      v-for="i in tabs"
      :tab="i.label"
      :key="i.value"
    />
  </a-tabs>
</template>
<script>
export default {
  data() {
    return {
      active: '',
      tabs: [
        { label: '全部客户', value: '' },
        { label: '业绩提成客户', value: '2' },
        { label: '业绩不计提成客户', value: '1' }
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
