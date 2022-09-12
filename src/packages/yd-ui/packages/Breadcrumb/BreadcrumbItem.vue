<template>
  <span class="yd-breadcrumb__item">
    <span ref="link" :class="['yd-breadcrumb__inner', to ? 'is-link' : '']" role="link">
      <slot/>
    </span>
    <i v-if="separatorClass" :class="separatorClass" class="yd-breadcrumb__separator"/>
    <span v-else class="yd-breadcrumb__separator" role="presentation">{{ separator }}</span>
  </span>
</template>
<script>
export default {
  name: 'YdBreadcrumbItem',
  props: {
    to: {
      type: String, default: ''
    },
    replace: Boolean
  },
  data() {
    return {
      separator: '',
      separatorClass: ''
    }
  },

  inject: ['ydBreadcrumb'],

  mounted() {
    this.separator = this.ydBreadcrumb.separator
    this.separatorClass = this.ydBreadcrumb.separatorClass
    const link = this.$refs.link
    link.setAttribute('role', 'link')
    link.addEventListener('click', _ => {
      const { to, $router } = this
      if (!to || !$router) return
      this.replace ? $router.replace(to) : $router.push(to)
    })
  }
}
</script>
