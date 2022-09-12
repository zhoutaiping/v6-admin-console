<template>
  <div
    :class="classObj"
    class="app-wrapper"
  >
    <div
      v-if="device==='mobile'&&sidebar.opened"
      class="drawer-bg"
      @click="handleClickOutside"
    />
    <sidebar class="sidebar-container" />
    <div class="main-container">
      <navbar :breadcrumb="false"/>
      <tags-view :breadcrumb="true" :router-tag="false" />
      <div v-if="tabs && tabs.type === 'new'" class="link-box">
        <el-card :body-style="{padding:'10px 10px 0'}" class="card-box" shadow="never">
          <div v-show="routeTitle" class="title-text ">
            {{ routeTitle }}
            <breadcrumb v-show="false" id="breadcrumb-container" :style="{'line-height':'30px'}" class="breadcrumb-container" />
          </div>
          <div v-show="false" class="router-title ">
            {{ routeTitle }}
          </div>
          <div v-if="tabs && tabs.items" class="router-tab">
            <a-tabs :tab-bar-style="{margin: '0 0 2px', 'border-bottom': 'none'}" v-model="tabs.activeModel" @change="tabs.callback">
              <a-tab-pane v-for="item in tabs.items" :key="item.key" :tab="item.title" style="margin:0" />
            </a-tabs>
          </div>
        </el-card>
      </div>
      <template>
        <section class="app-main">
          <keep-alive :include="cachedViews">
            <router-view ref="content" :key="key"/>
          </keep-alive>
        </section>
      </template>
    </div>
  </div>
</template>

<script>
import Breadcrumb from '@/components/Breadcrumb'
import { Navbar, Sidebar, AppMain, TagsView } from './components'
import ResizeMixin from './mixin/ResizeHandler'

export default {
  name: 'TabLayout',

  components: {
    Navbar,
    Sidebar,
    AppMain,
    TagsView,
    Breadcrumb
  },
  mixins: [ResizeMixin],
  data: () => {
    return {
      routerPage: null,
      tabs: {}
    }
  },

  computed: {
    cachedViews() {
      return this.$store.state.tagsView.cachedViews
    },
    key() {
      return this.$route.fullPath
    },
    sidebar() {
      return this.$store.state.app.sidebar
    },

    device() {
      return this.$store.state.app.device
    },

    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      }
    },
    routeTitle() {
      return this.$route.meta.title || ''
    }

  },
  mounted() {
    this.tabs = null
    this.getPageMeta()
  },
  updated() {
    this.getPageMeta()
  },
  methods: {
    getPageMeta() {
      if (this.$refs.content) this.tabs = this.$refs.content.tabPanels || null
    },
    handleClickOutside() {
      this.$store.dispatch('closeSideBar', { withoutAnimation: false })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "src/styles/mixin.scss";
.app-main {
  /*84 = navbar + tags-view = 50 +34 */
  min-height: calc(100vh - 85px);
  width: 100%;
  position: relative;
  overflow: hidden;
}
.card-box {
  margin: 5px 10px;
  min-height: 50px;
  border-radius: 0;
  border-style: solid;
  border-width: 0 0 0 3px;
  border-left: 3px solid $--color-primary;
  box-shadow: 0 8px 16px 0px rgba(10, 14, 29, 0.04), 0px 8px 64px 0px rgba(10, 14, 29, 0.08);
  position: relative;
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
}
.router-title {
  margin: 10px 0 5px 20px;
  font-size: 17px;
  font-weight: 500;
}
.router-tab {
  margin-top: 0px;
}
.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;
  &.mobile.openSidebar {
    position: fixed;
    top: 0;
  }
}
.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}
</style>
