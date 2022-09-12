<template>
  <div class="ConsolePageLayout">
    <div v-if="$slots.filter" class="ConsolePageLayout__filter">
      <slot name="filter"/>
    </div>
    <slot/>
  </div>
</template>

<script>

export default {
  name: 'ConsolePageLayout',

  props: {
    title: String,
    message: [Object, Array]
  }
}
</script>

<style lang="scss">
.ConsolePageLayout {
  padding: 12px;

  &__filter{
    padding: 12px;
    padding-bottom: 0px;
    margin-bottom: 12px;
    background: rgb(250, 250, 250);

    .el-form{
      max-width: 1200px;
    }

    .el-form-item__label{
      font-weight: 500;
    }
  }

}
</style>
