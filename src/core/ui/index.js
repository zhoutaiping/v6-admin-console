import Vue from 'vue'
import './antd-ui'
import './public-component'

import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import i18n from '@/core/lang' // Internationalization
import YdUI from '@/packages/yd-ui'
import '@/styles/theme/index.css'
import '@/styles/index.scss'
Vue.use(Element, {
  size: 'small',
  i18n: (key, value) => i18n.t(key, value)
})
Vue.use(YdUI)
