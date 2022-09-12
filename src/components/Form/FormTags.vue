<style lang="scss">
.FormTags{

  &__item{
    display: inline-block;
    border: 1px solid #CCC;
    height: 32px;
    line-height: 32px;
    list-style: none;
  }
}
</style>

<template>
  <div :class="b()">
    <ul :class="b('list')">
      <li
        v-for="(item, index) in list"
        :class="b('item')"
        :key="index"
      >
        {{ item.label }}
      </li>
    </ul>
  </div>
</template>

<script>
import create from '@/utils/create-basic'

export default create({
  name: 'FormTags',

  components: {},

  props: {
    list: Array
  },

  data() {
    return {}
  },

  computed: {},

  methods: {}
})
</script>
