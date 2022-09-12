<template>
  <console-page-layout>
    <div>
      <DmTabs
        ref="active"
        :tabs="options.tabs"
        :value="active"
        :desc="desc"
        layout="card"
        @init="e =>{
          active = e
          change(e)
        }"
      />
    </div>
    <template v-if="active === '1'">
      <BaseTemplate ref="base" />
    </template>
    <template v-if="active === '2'">
      <Setting ref="setting"/>
    </template>
    <template v-if="active === '3'">
      <Visit ref="visit"/>
    </template>
    <template v-if="active === '4'">
      <line-template ref="line"/>
    </template>
  </console-page-layout>
</template>

<script>
import BaseTemplate from './base-template'
import Setting from './setting-template.vue'
import Visit from './visit-template.vue'
import LineTemplate from './line-template'

export default {
  components: { BaseTemplate, Setting, Visit, LineTemplate },
  data() {
    return {
      active: '1',
      desc: '',
      options: {
        tabs: [
          { label: '概览信息', value: '1' },
          { label: '资源包管理', value: '2' },
          { label: '访问规则管理', value: '3' },
          { label: '解析线路', value: '4' }
        ]
      }
    }
  },
  async created() {
    this.desc = this.$route.query.name || ''
    await this.init()
  },

  methods: {
    async init() {
      await Promise.all([
        this.$store.dispatch('fetchDispGroupInfo', { disp_group_id: this.$route.params.id }),
        this.$store.dispatch('fetchTemplateBind', {
          id: this.$route.params.id,
          data_type: 'group'
        }),
        // this.$store.dispatch('fetchIpPool', { member_id: this.$route.query.member_id }),
        this.$store.dispatch('fetchDispGroud', { group_id: this.$route.params.id }),
        // this.$store.dispatch('featchPolicyIp', { disp_group_id: this.$route.params.id, page: 1, pagesize: 9999 }),
        this.$store.dispatch('fetchNodeType'),
        this.$store.dispatch('featchRegion'),
        this.$store.dispatch('featchTreeRegion'),
        this.$store.dispatch('feachLine'),
        this.$store.dispatch('fetchLineGroup')

      ])
    },

    change(e) {
      if (e === '2') {
        this.$store.dispatch('fetchIpPool', { member_id: this.$route.query.member_id })
      } else if (e === '3') {
        this.$store.dispatch('featchPolicyIp', { disp_group_id: this.$route.params.id, page: 1, pagesize: 9999 })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/.el-card__heade {
  padding: 10px 20px;
}

</style>
