<template>
  <div class="login-container">
    <div class="login-center">

      <el-form
        ref="loginForm"
        :model="loginForm"
        :rules="loginRules"
        class="login-form"
        autocomplete="on"
        label-position="left"
      >

        <div class="title-container">
          <h1 class="title">Welcome Back</h1>
        </div>
        <!-- <a-tabs
          v-model="loginForm.login_type"
          :tab-bar-style="{ textAlign: 'center', borderBottom: 'unset' }"
          @change="handleTabClick"
        >
          <a-tab-pane
            :key="1"
            tab="账号密码登录"
          />
          <a-tab-pane
            :key="2"
            tab="手机验证码登录"
          />
        </a-tabs> -->
        <template v-if="loginForm.login_type ===1">
          <el-form-item prop="username">
            <span class="svg-container">
              <svg-icon icon-class="user" />
            </span>
            <el-input
              ref="username"
              v-model="loginForm.username"
              placeholder="用户名"
              name="username"
              type="text"
              tabindex="1"
              autocomplete="on"
            />
          </el-form-item>

          <el-tooltip
            v-model="capsTooltip"
            content="Caps lock is On"
            placement="right"
            manual
          >
            <el-form-item prop="password">
              <span class="svg-container">
                <svg-icon icon-class="password" />
              </span>
              <el-input
                ref="password"
                :key="passwordType"
                v-model="loginForm.password"
                :type="passwordType"
                placeholder="密码"
                name="password"
                tabindex="2"
                autocomplete="on"
                @keyup.native="checkCapslock"
                @blur="capsTooltip = false"
                @keyup.enter.native="handleLogin"
              />
              <span
                class="show-pwd"
                @click="showPwd"
              >
                <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
              </span>
            </el-form-item>
          </el-tooltip>
        </template>
        <template v-if="loginForm.login_type ===2">
          <el-form-item prop="mobile">
            <span class="svg-container">
              <i class="el-icon-phone" />
            </span>
            <el-input
              ref="mobile"
              v-model="loginForm.mobile"
              placeholder="手机号"
              disabled
              name="mobile"
              type="text"
              tabindex="1"
              autocomplete="on"
            />
          </el-form-item>
          <el-form-item prop="code">
            <span class="svg-container">
              <i class="el-icon-phone" />
            </span>
            <el-input
              ref="mobile"
              v-model="loginForm.code"
              placeholder="短信验证码"
              name="mobile"
              type="text"
              tabindex="1"
              autocomplete="on"
              style="width:200px"
            />
            <a-button
              v-if="time !== 60 && time !== 0"
              disabled
              block
              style="float:right;height:48px; width: 140px; text-align:center;"
            >{{ time }}秒后可重发</a-button>
            <a-button
              v-else
              :loading="sendLoading"
              type="default"
              block
              style="float:right;height:48px; width: 140px; text-align:center;"
              @click="fetchCap"
            >发送短信验证码</a-button>
            <!-- <el-button
              type="primary"
              style="float:right;height:48px; width: 140px; text-align:center;"
            >发送短信</el-button> -->
          </el-form-item>
        </template>
        <el-form-item
          v-show="loginForm.login_type===1"
          prop="yzm"
        >
          <el-input
            v-model="loginForm.yzm"
            placeholder="验证码"
            style="width:200px"
          />
          <img
            id="yzm"
            ref="yzm"
            :src="yzm"
            alt=""
            style="margin-left: 10px; cursor:pointer;"
            @click="getXzm"
          >
          <el-button
            id="yzm_change"
            type="text"
            @click="getXzm"
          >看不清?</el-button>
        </el-form-item>
        <div class="help">
          <!-- <el-button
            v-show="loginForm.login_type===2"
            type="text"
            @click="loginForm.login_type=1"
          >账号密码登录</el-button> -->
          <el-button
            v-show="loginForm.login_type===2"
            type="text"
            @click="loginForm.login_type=1"
          >修改账号密码</el-button>
        </div>
        <el-button
          :loading="loading"
          type="primary"
          style="width:100%;height:47px; font-size: 17px; font-weight: 500; margin-bottom:30px; background: #007bfc;"
          @click.native.prevent="handleLogin"
        >Sign in</el-button>

      </el-form>
    </div>
    <!-- <particles/> -->
  </div>
</template>

<script>
import login_console from '@/assets/images/logo-console.svg'
import axios from 'axios'
import Rul from '@/utils/verify'
import Rsa from '@/utils/rsa'
import { setToken } from '@/utils/auth'
export default {
  name: 'Login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入用户名'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码不能少于6位数字'))
      } else {
        callback()
      }
    }
    const validateMobile = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入手机号'))
      } else if (!Rul.strictMobile.test(value)) {
        callback(new Error('手机号码不正确'))
      } else {
        callback()
      }
    }
    // strictMobile
    const validateYzm = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入验证码'))
      } else {
        callback()
      }
    }
    return {
      time: 0,
      sendLoading: false,
      yzm: '',
      login_console,
      loginForm: {
        login_type: 1,
        username: '',
        password: '',
        mobile: '',
        code: '',
        yzm: ''
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }],
        mobile: [{ required: true, trigger: 'blur', validator: validateMobile }],
        code: [{ required: true, trigger: 'blur', message: '请输入短信验证码' }],
        yzm: [{ required: true, trigger: 'blur', validator: validateYzm }]
      },
      passwordType: 'password',
      capsTooltip: false,
      loading: false,
      showDialog: false,
      redirect: undefined,
      otherQuery: {}
    }
  },
  watch: {
    $route: {
      handler: function (route) {
        const query = route.query
        if (query) {
          this.redirect = query.redirect
          this.otherQuery = this.getOtherQuery(query)
        }
      },
      immediate: true
    }
  },
  created() {

  },
  mounted() {
    if (this.loginForm.login_type === 1) {
      if (this.loginForm.username === '') {
        this.$refs.username.focus()
      } else if (this.loginForm.password === '') {
        this.$refs.password.focus()
      }
    }
    this.getXzm()
  },
  destroyed() {
  },
  methods: {
    handleTabClick(key) {
      this.loginForm.login_type = key
      if (key === 1) {
        this.loginForm.username = ''
        this.loginForm.password = ''
      } else {
        this.loginForm.mobile = ''
        this.loginForm.code = ''
        this.time === 0
        if (this.interval) clearInterval(this.interval)
      }
    },
    startTimer() {
      this.time = 59
      this.interval = setInterval(() => {
        this.timer()
      }, 1000)
    },

    timer() {
      this.time--
      if (this.time === 0) clearInterval(this.interval)
    },
    async fetchCap() {
      const mobile = this.loginForm.mobile
      if (!Rul.mobile.test(mobile)) {
        this.message.warning('手机号码不正确')
        return
      }
      const param = {
        mobile
      }
      this.sendLoading = true
      try {
        await this.Fetch.post('/V4/User/send_mobile_code', param)
      } catch (e) {
        return
      } finally {
        this.sendLoading = false
      }
      this.message.success('发送成功')
      this.startTimer()
    },

    getXzm() {
      const rand = randomString(10)
      axios({
        method: 'get',
        url: '/api/V4/User/yzm',
        params: rand,
        responseType: 'blob',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        }
      }).then(res => {
        const URL = window.URL.createObjectURL(res.data)
        this.yzm = URL
      })
    },
    checkCapslock({ shiftKey, key } = {}) {
      if (key && key.length === 1) {
        if (shiftKey && (key >= 'a' && key <= 'z') || !shiftKey && (key >= 'A' && key <= 'Z')) {
          this.capsTooltip = true
        } else {
          this.capsTooltip = false
        }
      }
      if (key === 'CapsLock' && this.capsTooltip === true) {
        this.capsTooltip = false
      }
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        if (this.loginForm.login_type === 1) {
          this.$refs.password.focus()
        }
      })
    },
    handleLogin() {
      this.loading = true
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          if (this.loginForm.login_type === 1) {
            this.handleLoginUser()
          } else {
            this.$store.dispatch('LoginByUsername', {
              ...this.loginForm
            })
              .then(() => {
                this.$router.push({ path: this.redirect || '/', query: this.otherQuery })
                this.loading = false
              })
              .catch(() => {
                this.loginForm.login_type = 1
                this.getXzm()
                if (this.loginForm.login_type === 2) {
                  this.time === 0
                  if (this.interval) clearInterval(this.interval)
                }
                this.loading = false
              })
          }
        } else {
          return false
        }
      })
    },

    async handleLoginUser() {
      const userInfo = { ...this.loginForm }
      try {
        const data = await this.Fetch.post('/V4/User/login', {
          yzm: userInfo.yzm,
          username: userInfo.username,
          password: Rsa.rsaPublicData(userInfo.password),
          login_type: 1
        })

        if (data.mobile) {
          this.loginForm.login_type = 2
          this.loginForm.mobile = data.mobile || '15659036060'
        } else {
          this.message.success('登录成功!')
          this.$store.commit('SET_TOKEN', data.account)
          this.$store.commit('SET_INFO', data)
          this.$store.commit('MENU_TYPE', 'crm')
          localStorage.setItem('MENU_TYPE', 'crm')
          localStorage.setItem('userInfo', JSON.stringify(data))
          setToken(data.account)
          this.$router.push({ path: this.redirect || '/', query: this.otherQuery })
          this.loading = false
        }
      } catch (error) {
        this.loginForm.login_type = 1
        this.getXzm()
        return
      } finally {
        this.loading = false
      }
    },

    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur]
        }
        return acc
      }, {})
    }
  }
}

function randomString(e) {
  e = e || 32
  var t = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'
  var a = t.length
  var n = ''
  for (var i = 0; i < e; i++) {
    n += t.charAt(Math.floor(Math.random() * a))
  }
  return n
}
</script>

<style lang="scss" >
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #fff;
$light_gray: #142149;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $light_gray;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $light_gray !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    // background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #525666;
    background-color: #fff;
    border: 1px solid #d3d6e2;
  }
}
</style>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #142149;

.login-container {
  height: 100vh;
  width: 100%;
  // background-color: $bg;
  overflow: hidden;
  // background-image: linear-gradient(-45deg,#2179dd,#00289c);
  background-image: url("../../assets/images/login.png");
  background-size: cover;
  background-repeat: no-repeat;
  .login_icon {
    width: 100%;
    position: absolute;
    text-align: center;
    img {
      width: 200px;
      margin-top: 150px;
    }
  }
  .Container {
    width: 100%;
    height: 80vh;
    position: absolute;
    bottom: 0;
    overflow: hidden;
  }
  .Container-left {
    position: relative;
    width: 0;
    height: 0;
    border-bottom: 10000px solid #ffffff;
    border-right: 19000px solid transparent;
  }
  .Container-rigth {
    position: absolute;
    width: 0;
    height: 0;
    top: 0;
    right: 0;
    border-bottom: 10000px solid #ffffff;
    border-left: 19000px solid transparent;
  }
  .login-center {
    position: relative;
    width: 480px;
    height: 520px;
    margin: 0 auto;
    top: 50%;
    z-index: 9999;
    transform: translate(0%, -50%);
    background-color: white;
    border-radius: 4px;
    box-shadow: 0 4px 32px 0 rgba(10, 14, 29, 0.02),
      0 8px 64px 0 rgba(10, 14, 29, 0.08);
  }
  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 60px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }
  .help {
    text-align: right;
    font-size: 12px;
    color: #2179dd;
  }
  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;
    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }

  .thirdparty-button {
    position: absolute;
    right: 0;
    bottom: 6px;
  }

  @media only screen and (max-width: 470px) {
    .thirdparty-button {
      display: none;
    }
  }
}
</style>
