import Vue from 'vue'
import Fetch from '@/utils/fetch'
import Message from '@/utils/message'

import * as filters from '@/filters' // global filters
import './ui'

import InvokeApi from '@/utils/invokeApi' // 公共Api
import InvokeAllApi from '@/utils/invokeAllApi' // 公共Api
import InvokeAssetApi from '@/utils/invokeAssetApi' // 公共Api
import InvokeTagApi from '@/utils/invokeTagApi' // 公共Api
import InvokeDispApi from '@/utils/invokeDispApi'
import InvokeOpLogApi from '@/utils/invokeOpLogApi'
import InvokeGataWay from '@/utils/invokeGateWay'
import userMixins from '@/mixins/user'
Vue.mixin(userMixins)
import YdForm from './components/yd-form'
// register global utility filters.
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})
Vue.use(YdForm)
Vue.config.productionTip = false
Vue.prototype.InvokeApi = InvokeApi
Vue.prototype.InvokeAllApi = InvokeAllApi
Vue.prototype.InvokeAssetApi = InvokeAssetApi
Vue.prototype.InvokeTagApi = InvokeTagApi
Vue.prototype.InvokeDispApi = InvokeDispApi
Vue.prototype.InvokeOpLogApi = InvokeOpLogApi
Vue.prototype.Fetch = Fetch
Vue.prototype.FetchDisp = InvokeDispApi
Vue.prototype.FetchGateWay = InvokeGataWay
Vue.prototype.Message = Message
