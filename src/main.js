import 'core-js'
import Vue from 'vue'
import 'normalize.css/normalize.css'

import App from './App'
import router from './router'
import store from './store'
import i18n from './core/lang' // Internationalization
import './errorLog' // error log
import '@/assets/icons' // icon
import './permission' // permission control

import '@/iconfont/iconfont.css'
import './core/use'

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
})
