<template>
  <div id="dm-table" class="dm-table">
    <slot/>
  </div>
</template>

<script>
export default {
  name: 'DmTable',
  components: { },
  watch: {},
  methods: {}
}
</script>

<style lang="scss">
$row-hover-color: rgba(var(--color-primary), 0.02);
$table-border-color: rgb(223, 229, 236);

.dm-table {
  position: relative;
  a {
    cursor: pointer;
  }
  hr {
    border-top: 1px solid #eee;
    margin: 5px 0px;
    &.dotted {
      border-top: 1px dotted #eee;
    }
  }
  .el-table {
    // color: rgb(0, 0, 0, 0.65);
    td {
      padding: 5px 0;
      height: 48px;
    }
    th {
      border-top: 1px solid rgb(223, 229, 236);
      background-color: $--color-primary;
      color: #FFFFFF;
      padding: 8px 0;
      div {
        font-weight: 600;
      }
    }
    .el-table__row {
      &:hover > td {
        background-color: rgba(var(--color-primary), 0.02);
      }
    }
  }
  &-td {
    &--less {
      margin-left: -12px;
    }
    &__action {
      button {
        color: var(--color-primary);
        margin-right: 8px;
        &:last-child {
          margin-right: 0px;
        }
        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
  .el-table__footer-wrapper thead div,
  .el-table__header-wrapper thead div {
    background-color: rgba(0, 0, 0, 0);
  }
  // 去行动画
  .el-table--enable-row-transition .el-table__body td {
    transition: 0s;
  }
}
</style>
