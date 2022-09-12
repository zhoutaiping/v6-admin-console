<template>
  <div v-loading="loading" :id="id" :style="{height:height,width:width}"/>
</template>
<script>
import { Bar } from '@antv/g2plot'
import mixins from './chart-mixins'
export default {
  mixins: [mixins],
  methods: {
    init() {
      const barPlot = new Bar(this.$el, {
        forceFit: true,
        title: {
          visible: true,
          text: 'CRM-用户统计'
        },
        description: {
          visible: true,
          text: ''
        },
        data: this.data,
        xField: 'value',
        yField: 'label',
        colorField: 'label',
        label: {
          visible: true,
          position: 'middle', // options: left / middle / right
          adjustColor: true
        }
      })

      barPlot.render()
    }
  }
}
</script>
