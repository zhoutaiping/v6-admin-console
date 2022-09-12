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
          change(e)
        }"
      />
    </div>
    <BaseTemplate v-show="active === 'base'" ref="base" />
    <NodeLine v-show="active === 'line'" ref="line"/>
    <CentralNode v-show="active === 'centralNode'" ref="centralNode"/>
    <CDN v-show="active === 'cdn'" ref="cdn"/>
    <WEBWAF v-show="active === 'webwaf'" ref="webwaf"/>
  </console-page-layout>
</template>

<script>
import BaseTemplate from './base-template'
import NodeLine from './node-line'
import CentralNode from './central-node'
import CDN from './cdn'
import WEBWAF from './web-waf'
export default {
  components: { BaseTemplate, NodeLine, CentralNode, CDN, WEBWAF },
  data() {
    return {
      desc: '',
      active: 'base',
      options: {
        tabs: [
          { label: '概览信息', value: 'base' },
          { label: '边缘节点线路', value: 'line' },
          { label: '中心节点配置', value: 'centralNode' },
          { label: 'CDN配置', value: 'cdn' },
          { label: 'WEB防火墙配置', value: 'webwaf' }
        ]
      }
    }
  },
  created() {
    this.desc = this.$route.query.domain
  },
  mounted() {
    this.change('base')
  },
  methods: {
    change(e) {
      if (e && this.$refs[e]) {
        this.$refs[e].init()
      }
    }
  }
}
</script>
