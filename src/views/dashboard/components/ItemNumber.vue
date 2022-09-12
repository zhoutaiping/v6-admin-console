<style lang="scss" scoped>
.ItemNumber {
  position: relative;
  height: 100%;
  padding: 12px;
  text-align: left;
  display: flex;
  overflow: hidden;
  justify-content: center;
  flex-direction: column;
  background: #fff;
  -webkit-box-shadow: 4px 4px 40px rgba(0,0,0,.05);
  box-shadow: 4px 4px 40px rgba(0,0,0,.05);
  border-color: rgba(0,0,0,.05);
}
.ItemNumber__num{
    font-weight: 500;
    font-size: 36px;
    line-height: 36px;
}
.ItemNumber__title {
    margin: 0;
    margin-top: 8px;
    color: #606266;
    font-size: 14px;
    font-weight: 600;
    line-height: 15px;
}
</style>
<template>
  <div class="ItemNumber">
    <div class="ItemNumber__num color--primary">{{ value }}</div>
    <p class="ItemNumber__title">{{ title }}</p>
  </div>
</template>
<script>
export default {
  name: 'ItemNumber',
  props: {
    title: {
      type: String,
      default: ''
    },
    value: {
      type: [String, Number],
      default: ''
    }
  },
  data() {
    return {}
  }
}
</script>
