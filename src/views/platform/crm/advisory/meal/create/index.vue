<template>
  <console-page-layout>
    <el-card>
      <a-steps
        :current="currentTab"
        class="steps"
      >
        <a-step title="基本信息" />
        <a-step title="开通详情" />
        <a-step title="确认开通" />
      </a-steps>
      <div class="content">
        <setp1
          v-show="currentTab === 0"
          ref="setp1"
          @change="change"
          @close="close"
        />
        <setp2
          v-show="currentTab === 1"
          ref="setp2"
          :member_id="form.member_id"
          @change="change"
          @close="close"
        />
        <setp3
          v-show="currentTab === 2"
          ref="setp3"
          @change="change"
          @close="close"
        />
      </div>
    </el-card>
  </console-page-layout>
</template>
<script>
import Layout from '@/layout/Layout'
import mixins from './mixins'
import setp1 from './components/step-1'
import setp2 from './components/step-2'
import setp3 from './components/step-3'
export default {
  name: 'MealCreate',

  components: { Layout, setp1, setp2, setp3 },

  mixins: [mixins],

  data() {
    return {
      form: {
        member_id: ''
      },
      setpForm: {}
    }
  }
}
</script>

<style lang="scss" scoped>
.steps {
  max-width: 750px;
  margin: 16px auto;
}
</style>
