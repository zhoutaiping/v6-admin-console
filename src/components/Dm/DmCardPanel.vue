<template>
  <div class="panel-box">
    <a-card
      :body-style="{'padding': '10px'}"
      class="card-box"
    >
      <div class="router-title ">
        {{ title }}
      </div>
      <slot />
    </a-card>
  </div>
</template>
<script>
export default {
  name: 'DmCardPanel',
  props: {
    title: {
      type: String,
      default: ''
    }
  }
}
</script>
<style lang="scss" scoped>
.card-box {
  margin: 0px 0px 5px;
  min-height: 50px;
  border-radius: 0;
  border-style: solid;
  position: relative;
}
.panel-box {
  width: 100%;
  height: auto;
  min-height: 50px;
}
.router-title {
  font-size: 17px;
  font-weight: 500;
  border-left: 3px solid $--color-primary;
  padding-left: 10px;
  margin-bottom: 10px;
}

</style>
