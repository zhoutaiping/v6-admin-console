<template>
  <console-page-layout>
    <DmTabs
      ref="active"
      :desc="desc"
      :back="back"
      layout="back"
    />
    <a-card>
      <a-steps
        :current="currentTab"
        class="steps"
      >
        <a-step
          v-for="s in step"
          :title="s.label"
          :key="s.value"
        />
      </a-steps>
      <setp1 v-show="currentTab === 0" ref="setp1" class="info-box"/>
      <setp2 v-show="currentTab === 1" ref="setp2" class="info-box" @setAsyncDetail="setAsyncDetail"/>
      <setp3 v-show="currentTab > 1" ref="setp3" :async-detail="asyncDetail" class="info-box"/>
      <div class="steps center-box">
        <a-button
          v-show="currentTab > 0"
          type="primary"
          @click="e =>{setSetp('del')}"
        >上一步</a-button>
        <a-button
          type="primary"
          @click="e =>{setSetp('add')}"
        >下一步</a-button>
        <a-button>重置</a-button>
      </div>
    </a-card>
  </console-page-layout>
</template>
<script>
import mixins from './mixins'
export default {
  components: {},
  mixins: [mixins],
  data() {
    return {
      back: {
        path: '/advisory/meal',
        query: {}
      },
      desc: '',
      step: [
        { label: '基本信息', value: 'info' },
        { label: '操作详情', value: 'option' },
        { label: '确认操作', value: 'pay' }
      ]

    }
  },
  methods: {

  }
}
</script>
<style lang="scss" scoped>
.steps {
  max-width: 750px;
  margin: 16px auto;
}
.info-box {
  max-width: 640px;
  margin: 16px auto;
}
.center-box {
  text-align: center;
}
</style>
