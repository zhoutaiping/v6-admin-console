<template>
  <div v-loading="loading" :id="id" :style="{height:height,width:width}"/>
</template>
<script>
import { Ring } from '@antv/g2plot'
import mixins from './chart-mixins'
export default {
  mixins: [mixins],
  methods: {
    init() {
      const ringPlot = new Ring(this.$el, {
        forceFit: true,
        title: {
          visible: true,
          text: '套餐'
        },
        description: {
          visible: true,
          text: ''
        },
        radius: 0.8,
        padding: 'auto',
        data: this.data,
        angleField: 'value',
        colorField: 'type'
      })

      ringPlot.render()
    }
  }
}
</script>
