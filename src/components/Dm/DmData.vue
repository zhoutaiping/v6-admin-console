<style lang="scss">
.DmData {
  background: #fff;
  overflow: auto;
  // box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.2);

  &-pagination {
    &__desc {
      line-height: 45px;
      font-size: 13px;
      color: #333;
      font-weight: 600;
    }
  }

  .DmData {
    &-pagination {
      padding: 12px;
      overflow: hidden;
    }
  }
}
</style>

<template>
  <div class="DmData">
    <div class="DmData-table">
      <slot />
    </div>
    <div class="DmData-pagination">
      <div class="pull-left DmData-pagination__desc">
        <slot name="pagination-desc" />
      </div>
      <div
        v-if="showPagination"
        class="pull-right"
      >
        <el-pagination
          :current-page="pagination.page"
          :page-sizes="page_sizes || pagination.page_sizes"
          :page-size="pagination.per_page"
          :total="pagination.total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
  </div>
</template>

<script>
import mixins from './data-mixins'
export default {
  name: 'DmData',
  mixins: [mixins],
  props: {
    autoInit: {
      type: Boolean,
      default: true
    },
    innerCard: {
      type: Boolean,
      default: true
    },
    group: {
      type: Boolean,
      default: true
    },
    showPagination: {
      type: Boolean,
      default: true
    },
    per_page: {
      type: Number,
      default: 10
    },
    page_sizes: {
      type: Array,
      default: () => [10, 20, 30, 50]
    }
  },

  data() {
    return {
      pagination: {
        page: 1,
        per_page: this.per_page,
        total: 0,
        page_sizes: [10, 20, 30, 50]
      }
    }
  }
}
</script>
