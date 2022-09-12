<template>
  <div class="yd-breadcrumb" aria-label="Breadcrumb" role="navigation">
    <slot/>
  </div>
</template>
<script>
export default {
  name: 'YdBreadcrumb',

  props: {
    separator: {
      type: String,
      default: '/'
    },
    separatorClass: {
      type: String,
      default: ''
    }
  },

  provide() {
    return {
      ydBreadcrumb: this
    }
  },

  mounted() {
    const items = this.$el.querySelectorAll('.yd-breadcrumb__item')
    if (items.length) {
      items[items.length - 1].setAttribute('aria-current', 'page')
    }
  }
}
</script>

<style lang="postcss">
.yd {
  &-breadcrumb {
    font-size: 13px;
    line-height: 1;
    @utils-clearfix;

    &__separator {
      margin: 0 9px;
      font-weight: bold;
      color: #999;

      &[class*='icon'] {
        margin: 0 6px;
        font-weight: normal;
      }
    }
    &__item {
      float: left;

      &__inner {
        color: var(--color-text-regular);

        &.is-link,
        & a {
          font-weight: bold;
          text-decoration: none;
          transition: var(--color-transition-base);
          color: var(--color-text-primary);

          &:hover {
            color: var(--color-primary);
            cursor: pointer;
          }
        }
      }

      &:last-child {
        .yd-breadcrumb__inner,
        .yd-breadcrumb__inner a {
          &,
          &:hover {
            font-weight: normal;
            color: $--color-text-regular;
            cursor: text;
          }
        }

        .yd-breadcrumb__separator {
          display: none;
        }
      }
    }
  }
}
</style>
