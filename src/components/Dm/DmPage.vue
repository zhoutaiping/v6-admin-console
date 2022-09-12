<template>
  <div class="PageHeader">
    <div
      v-show="showTitle"
      class="link-box"
    >
      <el-card
        :body-style="{padding:'10px 10px 0'}"
        class="card-box"
        shadow="never"
      >
        <template v-if="back && Object.keys(back).length">
          <router-link :to="routerTo(back)">
            <el-button
              v-show="back.path"
              type="text"
              icon="el-icon-back"
            >
              返 回
            </el-button>
          </router-link>
        </template>
        <div
          v-show="routeTitle"
          class="title-text "
        >{{ routeTitle }}</div>
      </el-card>
    </div>
    <div
      v-if="$slots.filter"
      class="PageHeader__filter"
    >
      <slot name="filter" />
    </div>
    <slot />
    <div
      v-if="showGroup"
      class="DmData-pagination"
    >
      <div class="pull-left DmData-pagination__desc">
        <slot name="pagination-desc" />
      </div>
      <div class="pull-right">
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
  name: 'DmPage',
  mixins: [mixins],
  props: {
    title: {
      type: String,
      default: ''
    },
    autoInit: {
      type: Boolean,
      default: true
    },
    showTitle: {
      type: Boolean,
      default: true
    },
    layout: {
      type: String,
      default: 'default'
    },
    back: {
      type: Object,
      default: () => { }
    },
    showGroup: {
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
      routerTo: (back = this.back) => {
        return {
          path: back.path,
          query: back.query
        }
      },
      pagination: {
        page: 1,
        per_page: this.per_page,
        total: 0,
        page_sizes: [10, 20, 30, 50]
      }
    }
  },
  computed: {
    routeTitle() {
      return this.title || this.$route.meta.title || ''
    }
  }
}
</script>

<style lang="scss" scoped>
.PageHeader {
  padding: 12px;

  &__filter {
    padding: 12px;
    padding-bottom: 0px;
    margin-bottom: 12px;
    background: rgb(250, 250, 250);
    .el-form {
      max-width: 1200px;
    }
    .el-form-item__label {
      font-weight: 500;
    }
  }
}
.link-box {
  width: 100%;
  height: auto;
  min-height: 50px;
}
.title-text {
  height: 30px;
  line-height: 30px;
  font-size: 15px;
  border-left: 3px solid $--color-primary;
  padding-left: 10px;
  display: inline-block;
}
.card-box {
  position: relative;
  min-height: 50px;
  border-radius: 0;
  border-style: solid;
  box-shadow: 0 8px 16px 0px rgba(10, 14, 29, 0.04),
    0px 8px 64px 0px rgba(10, 14, 29, 0.08);
}
.f-r {
  float: right;
}
.mt {
  margin-top: 10px;
}

.DmData {
  &-pagination {
    padding: 12px;
    overflow: hidden;
  }
}
</style>
