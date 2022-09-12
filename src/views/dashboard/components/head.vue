<style lang="scss" scoped>
.header-box {
  position: absolute;
  z-index: 100;
  width: 100%;
  height: 64px;
  border-bottom: 1px solid rgba(229,235,255,.08);
  .head-conter {
    max-width: 1200px;
    margin: auto;
    padding-left: 0;
    height: 64px;
  }
}
.logo {
  display: inline-block;
  height: 100%;
  padding: 5px 0;
  .img{
    width: 160px;
  }
}
.box-r {
  float: right;
  height: 100%;
}
.bg-primary {
  background: $--color-primary;
}
.login-btn {
  width: 110px;
  height: 48px;
  font-size: 17px;
  line-height: 45px;
  font-weight: 500;
  color: #fff;
  text-align: center;
  cursor: pointer;
  border: 1px solid rgba(229,235,255,.08);
  margin: 10px 0;
  display: inline-block;
}
.link-item {
  width: 110px;
  height: 48px;
  font-size: 17px;
  line-height: 45px;
  font-weight: 500;
  color: #fff;
  text-align: center;
}
.avatar-wrapper {
  height: 100%;
  line-height: 45px;
  display: flex;
  align-items: center;
  color: #fff;
}
</style>

<template>
  <div class="header-box">
    <div class="head-conter">
      <div class="logo ">
        <router-link
          to="/home"
        >
          <img :src="login_console" alt="avatar_logo" class="img">
        </router-link>
      </div>
      <div class="box-r">
        <div v-show="!user.id" class="login-btn bg-primary" @click="handleLogin">
          登 陆
        </div>
        <el-dropdown
          trigger="click"
          style="margin:10px 0;"
        >
          <div v-show="user.id" class="avatar-wrapper">
            <el-avatar :src="account_th+'?imageView2/1/w/80/h/80'" size="medium"/>
            <span style="margin-left:10px;">{{ name }}</span>
            <i class="el-icon-caret-bottom" />
          </div>
          <el-dropdown-menu slot="dropdown" style="margin:10px 0;">
            <el-dropdown-item>
              <router-link
                to="/dashboard"
              >
                <div>控制台</div>
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
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import login_console from '@/assets/images/logo-console.svg'
import th from '@/assets/images/th.png'
import th_default from '@/assets/images/th.jpg'
import th_zhangpan from '@/assets/images/th_zhangpan.jpg'
import th_zhaojinlei from '@/assets/images/zhaojinlei.png'
export default {
  data() {
    return {
      login_console
    }
  },
  computed: {
    ...mapGetters([
      'user',
      'name'
    ]),
    year() {
      return new Date().getFullYear()
    },
    account_th() {
      const th_url = {
        'zhoutaiping': th,
        'zhangpan': th_zhangpan,
        'lixuan': th_default,
        'zhaojinlei': th_zhaojinlei
      }
      return th_url[this.user.account] || th_default
    }
  },
  methods: {
    handleLogin() {
      this.$router.push('/login')
    },
    logout() {
      this.$store.dispatch('LogOut').then(() => {
        location.reload()// In order to re-instantiate the vue-router object to avoid bugs
      })
    }
  }
}
</script>
