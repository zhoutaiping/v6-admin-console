<template>
  <div class="app-container-main">
    <newMenu ref="webTree" />
  </div>
</template>

<script>
import DialogSave from './Dialog/dialogSave'
import newMenu from './newMenu'
export default {

  components: { DialogSave, newMenu },
  data() {
    return {
      activeType: 'web'
    }
  },
  mounted() {
    this.initActive()
  },

  methods: {
    initActive() {
      this.activeType = 'web'
    },

    handleClick(tab, e) {
      let ActivePanel = null
      if (tab.name === 'web') {
        ActivePanel = this.$refs['webTree']
      } else if (tab.name === 'api') {
        ActivePanel = this.$refs['apiTree']
      }
      if (ActivePanel) {
        ActivePanel.init()
      }
    }
  }
}
</script>

<style lang='postcss'>
.app-container-main {
  padding: 5px !important;
}
</style>
