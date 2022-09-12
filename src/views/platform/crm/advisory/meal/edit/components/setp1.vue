<template>
  <div class="result-content">
    <a-row v-for="(i, index) in info" :key="index">
      <a-col :sm="8" :xs="24">{{ i.title }}：</a-col>
      <a-col :sm="16" :xs="24">{{ i.value }}</a-col>
    </a-row>
  </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  computed: {
    ...mapState({
      info: state => state.meal.info
    })
  }
}
</script>
<style lang="scss" scoped>
.result-content {
  margin-top: 24px;
  padding: 24px 40px;
  background-color: #fafafa;
  line-height: 22px;
  .ant-row:not(:last-child) {
    margin-bottom: 24px;
  }
}
</style>
