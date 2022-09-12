<template>
  <console-page-layout>
    <div>
      <DmTabs
        ref="active"
        :tabs="options.tabs"
        :value="active"
        layout="card"
        @init="e =>{
          active = e
          $refs[e] && $refs[e].init()
        }"
      />
    </div>
    <template v-if="active === 'ip'">
      <IpTemplate ref="ip"/>
    </template>
    <template v-if="active === 'normal'">
      <NormalTemplate ref="normal"/>
    </template>
    <template v-if="active === 'abnormal'">
      <AbnormalTemplate ref="abnormal"/>
    </template>
    <template v-if="active === 'allocated'">
      <AllocatedTemplate ref="allocated"/>
    </template>
    <template v-if="active === 'user'">
      <UserTemplate ref="user"/>
    </template>
  </console-page-layout>
</template>
<script>
import { mapActions } from 'vuex'
import IpTemplate from './components/dns/ip-template.vue'
import NormalTemplate from './components/dns/normal-template.vue'
import AbnormalTemplate from './components/dns/abnormal-template.vue'
import AllocatedTemplate from './components/dns/allocated-template.vue'
import UserTemplate from './components/dns/user-template.vue'
export default {
  components: { IpTemplate, NormalTemplate, AbnormalTemplate, AllocatedTemplate, UserTemplate },
  data() {
    return {
      active: 'ip',
      options: {
        tabs: [
          { label: 'IP资源池', value: 'ip' },
          { label: '资源获取策略', value: 'normal' },
          { label: '异常处置模板', value: 'abnormal' },
          { label: '已分配资源管理', value: 'allocated' },
          { label: '用户组映射管理', value: 'user' }
        ]
      }
    }
  },
  async created() {
    if (this.$route.query && this.$route.query.active && this.$route.query.active !== '') {
      const active = this.$route.query.active
      this.active = active
      setTimeout(() => {
        this.initRoute()
      }, 100)
    }
    await Promise.all([
      this.feachIpGroup(),
      this.featchRegion(),
      this.featchTreeRegion(),
      this.fetchLineGroup(),
      this.fetchNodeType()
    ])
  },
  methods: {
    ...mapActions({
      feachIpGroup: 'feachIpGroup',
      featchRegion: 'featchRegion',
      featchTreeRegion: 'featchTreeRegion',
      fetchLineGroup: 'fetchLineGroup',
      fetchNodeType: 'fetchNodeType'
    }),

    initRoute() {
      const route = Object.assign({}, this.$route, { query: {}})
      this.$store.dispatch('updateVisitedView', route)
      if (window.parent.location.href.match(/active=/)) {
        if (typeof (history.pushState) !== 'undefined') {
          var obj = { Title: document.title, Url: window.parent.location.pathname }
          history.pushState(obj, obj.Title, obj.Url)
        } else {
          window.parent.location = window.parent.location.pathname
        }
      }
    }
  }
}
</script>
