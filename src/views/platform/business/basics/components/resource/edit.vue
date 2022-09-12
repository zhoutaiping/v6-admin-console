<template>
  <console-page-layout>
    <div>
      <DmTabs
        ref="active"
        :desc="desc"
        :tabs="options.tabs"
        :value="active"
        layout="card"
        @init="e =>{
          active = e
        }"
      />
    </div>
    <BaseTemplate v-show="active === '1'" ref="base" />
    <Setting v-show="active === '2'" ref="setting"/>
  </console-page-layout>
</template>

<script>
import BaseTemplate from './base-template'
import Setting from './setting-template.vue'
export default {
  components: { BaseTemplate, Setting },
  data() {
    return {
      active: '1',
      desc: '',
      options: {
        tabs: [
          { label: '概览信息', value: '1' },
          { label: '节点IP资源获取配置', value: '2' }
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
        this.$store.dispatch('fetchNodeType'),
        this.$store.dispatch('feachTagTree'),
        this.$store.dispatch('fetchIpPool', { ippool_id: this.$route.params.id, page: 1, pagesize: 1 }),
        this.$store.dispatch('fetchDispIppoolInfo', { disp_ippool_id: this.$route.params.id }),
        this.$store.dispatch('fetchTemplateBind', {
          id: this.$route.params.id,
          data_type: 'ippool'
        })
      ])
    }

  }
}
</script>

<style lang="scss" scoped>
/deep/.el-card__heade {
  padding: 10px 20px;
}

</style>
