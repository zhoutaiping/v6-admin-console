<template>
  <div class="navbar">
    <hamburger
      :toggle-click="toggleSideBar"
      :is-active="sidebar.opened"
      class="hamburger-container"
    />
    <breadcrumb
      v-show="breadcrumb"
      class="breadcrumb-container"
    />
    <!-- <a-tabs :tab-bar-style="{margin: '0 0 2px', 'border-bottom': 'none'}" v-model="active" class="tabs-item" @change="e=>{handleLind(active)}">
      <a-tab-pane v-for="item in munuItems" :tab="item.title" :key="item.key"/>
    </a-tabs> -->
    <el-dropdown
      trigger="click"
      placement="bottom-start"
    >
      <el-button
        icon="el-icon-menu"
        style="width:150px;"
      >{{ menuText() }} <i class="el-icon-caret-bottom el-icon--right" /></el-button>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item
          v-for="(item,index) in munuItems"
          :key="item.index"
          :class="[item.key ===menu_type && 'select-item']"
          :divided="item.index !==0"
        >
          <div
            class="dropdown-item-box"
            @click="handleLind(item.key)"
          >
            {{ item.title }}
            <span style="float:right;"><i class="el-icon-arrow-right el-icon--right" /></span>
          </div>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <div class="right-menu">
      <Screenfull
        id="screenfull"
        class="right-menu-item hover-effect"
      />
      <el-dropdown
        class="avatar-container right-menu-item"
        trigger="click"
      >
        <div class="avatar-wrapper">
          <el-avatar
            :src="account_th"
            size="medium"
          />
          {{ userInfo.account }}
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>
            <router-link to="/home">
              <span>主页</span>
            </router-link>
          </el-dropdown-item>
          <el-dropdown-item>
            <span
              style="display:block;"
              @click="logout"
            >{{ $t('navbar.logOut') }}</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import Screenfull from '@/components/Screenfull'
import th from '@/assets/images/th.png'
import th_default from '@/assets/images/th.jpg'
import th_zhangpan from '@/assets/images/th_zhangpan.jpg'
import th_zhaojinlei from '@/assets/images/zhaojinlei.png'
import router, { resetRouter } from '@/router'
export default {
  components: {
    Breadcrumb,
    Hamburger,
    Screenfull
  },
  props: {
    breadcrumb: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      user_info: {},
      active: 'crm'
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'name',
      'menu_type',
      'munuItems'
    ]),
    account_th() {
      const th_url = {
        'zhoutaiping': th,
        'zhangpan': th_zhangpan,
        'lixuan': th_default,
        'zhaojinlei': th_zhaojinlei
      }
      return th_url[this.userInfo.account] || th_default
    }
  },
  methods: {
    ...mapActions({
      changeMenuType: 'changeMenuType'
    }),
    toggleSideBar() {
      this.$store.dispatch('toggleSideBar')
    },
    logout() {
      this.$store.dispatch('LogOut').then((res) => {
        const iam_logout_url = res && res.iam_logout_url || res[0].iam_logout_url || ''
        if (iam_logout_url) window.location.href = iam_logout_url
      })
    },

    menuText(key) {
      const item = this.munuItems.find(i => i.key === this.menu_type)
      return item && item.title || ''
    },

    handleLind(key) {
      if (key === this.menu_type) {
        return
      }
      this.$store.dispatch('delAllViews')
      this.changeMenuType({ menu_type: key }).then(res => {
        resetRouter()
        router.addRoutes(res)
        this.$router.push('/')
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.select-item {
  color: #2991fa;
  background: #eaf4ff;
  border-color: #a9d3fd;
}
.tabs-item {
  display: inline-block;
}
.navbar {
  height: 50px;
  line-height: 50px;
  border-radius: 0px !important;
  border: 1px solid #ebeef5;
  .hamburger-container {
    line-height: 58px;
    height: 50px;
    float: left;
    padding: 0 10px;
  }
  .breadcrumb-container {
    float: left;
  }
  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }
  .right-menu {
    float: right;
    height: 100%;
    &:focus {
      outline: none;
    }
    .right-menu-item {
      display: inline-block;
      margin: 0 8px;
    }
    .screenfull {
      height: 20px;
    }
    .international {
      vertical-align: top;
    }
    .theme-switch {
      vertical-align: 15px;
    }
    .avatar-container {
      height: 50px;
      margin-right: 30px;
      .avatar-wrapper {
        cursor: pointer;
        position: relative;
        display: flex;
        align-items: center;

        .el-avatar {
          margin-right: 10px;
        }

        .el-icon-caret-bottom {
          position: absolute;
          right: -20px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
