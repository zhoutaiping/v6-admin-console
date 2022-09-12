<style lang="scss">
.NavbarPageItem {
  display: inline-block;

  &:not(:first-child) {
    margin-left: 10px;
  }

  a {
    display: inline-block;
    text-decoration: none;
    color: #000;
    line-height: 36px;
    font-size: 14px;
    padding: 0 8px;

    &:active{
      opacity: .7;
    }

    &.router-link-active {
      font-weight: 600;
    }
  }
}
</style>
<template>
  <div class="NavbarPageItem">
    <template v-if="tab">
      <a
        :class="{'router-link-active': active}"
        @click="handleClick(to)"
      >
        {{ label }}
        <slot />
      </a>
    </template>
    <template v-else>
      <router-link
        v-if="to"
        :to="to"
      >
        {{ label }}
        <slot />
      </router-link>
      <template v-else>
        <a @click="handleClick">
          {{ label }}
          <slot />
        </a>
      </template>
    </template>
  </div>
</template>

<script>
import create from '@/utils/create-basic'

export default create({
  name: 'navbarPageItem',

  props: {
    active: Boolean,
    label: String,
    to: [String, Object],
    tab: {
      type: Boolean,
      default: false
    }
  },

  methods: {
    handleClick(value) {
      this.$emit('click', value)
    }
  }
})
</script>
