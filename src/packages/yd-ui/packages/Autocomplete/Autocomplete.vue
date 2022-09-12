<style lang="postcss">
.el-autocomplete-suggestion__list {
  li {
    font-size: 12px;
    line-height: 32px;
    &:hover {
      background: var(--color-primary);
      color: #fff;
    }
    &:active {
      background: color(var(--color-primary) blackness(10%));
      color: #fff;
    }
  }
}
</style>
<template>
  <el-autocomplete v-model="val" :fetch-suggestions="querySearch" :placeholder="placeholder" @select="handleSelect"/>
</template>

<script>
const NAME = 'yd-autocomplete'

export default {
  name: NAME,

  components: {},

  props: {
    value: [String, Number],
    placeholder: {
      type: String,
      default: '请输入'
    },
    list: Array
  },

  data() {
    return {
      val: this.value
    }
  },

  computed: {},

  watch: {
    value(val) {
      this.val = val
    }
  },

  // mounted: {},

  methods: {
    querySearch(queryString, cb) {
      this.$emit('input', queryString)
      const { list } = this
      const results = queryString ? list.filter(this.createFilter(queryString)) : list
      cb(results)
    },
    createFilter(queryString) {
      return LIST => {
        const { value } = LIST
        return !!(value && value.indexOf(queryString.toString().toLowerCase()) === 0)
      }
    },
    handleSelect(item) {
      this.$emit('input', item.value)
    }
  }
}
</script>
