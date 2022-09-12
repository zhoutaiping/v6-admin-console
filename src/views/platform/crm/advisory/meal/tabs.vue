<template>
  <a-tabs
    v-model="active"
    :tab-bar-style="{'border-bottom': 'none'}"
    class="actionTab"
    type="card"
    @change="change">
    <a-tab-pane
      v-for="i in option.tabs"
      :tab="i.text"
      :key="i.value" />
  </a-tabs>
</template>
<script>
export default {
  props: {
    vm: {
      type: [Object],
      default: null
    }
  },
  data() {
    return {
      active: '',
      option: {
        tabs: [
          { text: '全部', value: '' },
          { text: '未到期', value: '1' },
          { text: '已到期', value: '2' }
        ]
      }
    }
  },
  methods: {
    change(e) {
      this.$emit('init', e)
    }
  }
}
</script>
<style lang="scss" scoped>
.actionTab {
  display: inline-block;
}
</style>
