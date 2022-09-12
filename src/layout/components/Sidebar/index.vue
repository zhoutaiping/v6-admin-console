<template>
  <el-scrollbar wrap-class="scrollbar-wrapper">
    <el-menu
      :show-timeout="200"
      :default-active="$route.path"
      :collapse="isCollapse"
      mode="vertical"
      background-color="#304156"
      text-color="#bfcbd9"
      active-text-color="#409EFF"
    >
      <router-link :to="'/home'" class="logo">
        <img v-show="!log_base" :src="logo_console_svg" class="logo--full" alt="logo--full">
        <span v-show="!log_base" class="logo--title"> 玄武 </span>
        <img v-show="log_base" :src="logo_svg" class="logo--base" alt="logo--base">
      </router-link>
      <sidebar-item v-for="route in permission_routers" :key="route.path" :item="route" :base-path="route.path"/>
    </el-menu>
  </el-scrollbar>
</template>

<script>
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'
import logo_svg from '@/assets/images/logo.svg'
import logo_console_svg from '@/assets/images/logo-console.svg'
export default {
  components: { SidebarItem },
  data() {
    return {
      logo_svg: logo_svg,
      logo_console_svg: logo_console_svg,
      log_base: false
    }
  },
  computed: {
    ...mapGetters([
      'permission_routers',
      'sidebar'
    ]),
    isCollapse() {
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      this.log_base = !this.sidebar.opened
      return !this.sidebar.opened
    }
  }

}
</script>

<style lang="scss" scoped>
.logo {
  background: $--color-primary;
  height: 50px;
  &--full {
    width: 140px;
    height: 52px;
  }
  &--title {
    position: relative;
    top:5px;
    left: -17px;
    color: rgb(255, 255, 255);
    font-size: 19px;
    font-weight: 500;
  }
  &--base {
    margin-top: 8px;
  }
}
</style>
