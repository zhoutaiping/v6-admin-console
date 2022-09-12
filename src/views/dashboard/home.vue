<style lang="scss" scoped>

</style>
<template>
  <div style="minWidth:1475px;">
    <Head/>
    <CenterView/>
  </div>
</template>

<script>
import Head from './components/head'
import CenterView from './components/center-view'
export default {
  name: 'HomePage',
  components: { Head, CenterView }
}
</script>

