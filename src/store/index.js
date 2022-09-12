import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
import errorLog from './modules/errorLog'
import permission from './modules/permission'
import tagsView from './modules/tagsView'
import user from './modules/user'
import finance from './modules/finance'
import client from './modules/client'
import meal from './modules/meal'
import disp from './modules/disp'
import getters from './getters'
import bandwidth from '@/views/platform/resources/bandwidth/store/bandwidth'
import access from '@/views/platform/access/store/access'
import waf from '@/views/platform/business/store/waf'
import gateway from '@/views/platform/gateway/store/gateway'
Vue.use(Vuex)
const store = new Vuex.Store({
  modules: {
    app,
    errorLog,
    permission,
    tagsView,
    finance,
    client,
    user,
    meal,
    disp,
    access,
    bandwidth,
    waf,
    gateway
  },
  getters
})
export default store
