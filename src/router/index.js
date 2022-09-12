import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)
/* Layout */
import Layout from '@/layout/Layout'
import TabLayout from '@/layout/TabLayout'
import clientRouter from './modules/client'
import baseRouter from './modules/base'
import finance from './modules/finance'
import system from './modules/system'
import advisory from './modules/advisory'
import devops from './modules/devops'
import log from './modules/log'
import msg from './modules/msg'
import dns from './modules/dns'
import feedback from './modules/feedback'
import RecordWhitelist from './modules/record-whitelist'
import user from './modules/user'
import xsy from './modules/xsy'
import soc from './modules/soc'
import access from './modules/access'
import GatewayThreat from './modules/gateway-threat'
import GatewayContent from './modules/gateway-content'
import BusinessBasics from './modules/business-basics'
import BusinessApplicationNetwork from './modules/business-application-network'
/** note: Submenu only appear when children.length>=1
 *  detail see
 **/

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    roles: ['admin','editor']     will control the page roles (you can set multiple roles)
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
    noCache: true                if true ,the page will no be cached(default is false)
  }
**/
export const constantRouterMap = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/home',
    component: () => import('@/views/dashboard/home'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/errorPage/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/errorPage/401'),
    hidden: true
  },
  {
    path: '/form-generator',
    component: () => import('@/form-generator/index'),
    hidden: true
  },
  {
    path: '',
    component: Layout,
    redirect: 'dashboard',
    hidden: true,
    children: [{
      path: 'dashboard',
      component: () => import('@/views/dashboard/index'),
      name: 'Dashboard',
      meta: {
        title: '首页',
        icon: 'dashboard',
        noCache: true
      }
    }]
  },
  {
    path: '/icon',
    component: Layout,
    hidden: true,
    children: [{
      path: 'index',
      component: () => import('@/svg-icons/index'),
      name: 'Icons',
      meta: {
        title: 'icons',
        icon: 'icon',
        noCache: true
      }
    }]
  }
]

export const asyncRouterMap = [
  advisory,
  finance,
  xsy,
  clientRouter,
  baseRouter,
  devops,
  system,
  msg,
  dns,
  feedback,
  user,
  log,
  RecordWhitelist,
  access,
  soc,
  GatewayThreat,
  GatewayContent,
  BusinessBasics,
  BusinessApplicationNetwork,
  {
    path: '/devops/Entry',
    component: TabLayout, // Parent router-view
    alwaysShow: true,
    name: 'DevOpsEntry',
    redirect: '/devops/Entry/room',
    meta: { title: 'IDC资产', noCache: true, icon: 'server', menus: ['resources'] },
    children: [
      {
        path: '/devops/Entry/room',
        component: () => import('@/views/platform/resources/idc/room/index'),
        name: 'DevOpsEntry-room',
        meta: { title: '机房', noCache: true, icon: 'service', menus: ['resources'] }
      },
      {
        path: '/devops/Entry/server',
        component: () => import('@/views/platform/resources/idc/server/index'),
        name: 'DevOpsEntry-server',
        meta: { title: '服务器', noCache: true, icon: 'service', menus: ['resources'] }
      },
      {
        path: '/devops/Entry/IpResource',
        component: () => import('@/views/platform/resources/idc/IpResource/index'),
        name: 'DevOpsEntry-IpResource',
        meta: { title: 'IP', noCache: true, icon: 'service', menus: ['resources'] }
      }
    ]
  },
  {
    path: '/tag-service',
    component: TabLayout, // Parent router-view
    alwaysShow: true,
    redirect: '/tag-service/index',
    meta: { title: '标签管理', noCache: true, icon: 'service', menus: ['resources'] },
    children: [
      {
        path: '/tag-service/index',
        component: () => import('@/views/platform/resources/tag/index'),
        name: 'tag-service-index',
        meta: { title: '标签列表', noCache: true, icon: 'service', menus: ['resources'] }
      }
    ]
  },
  {
    path: '/platform/resources',
    component: TabLayout,
    alwaysShow: true, // will always show the root menu
    meta: { title: '资源分配策略', icon: 'tab', menus: ['resources'] },
    redirect: '/platform/resources/resources/dns',
    children: [{
      path: '/platform/resources/resources/dns',
      component: () => import('@/views/platform/resources/resources/dns'),
      name: 'platform-business-basics-resources-dns',
      meta: {
        title: 'DNS调度', icon: 'list', noCache: true, menus: ['resources']
      }
    }, {
      path: '/platform/resources/resources/dns-ip-group',
      component: () => import('@/views/platform/resources/resources/components/dns/ip-group-template'),
      name: 'platform-business-basics-resources-dns-ip-group',
      hidden: true,
      meta: {
        title: '分组管理', icon: 'list', noCache: true, menus: ['resources']
      }
    }, {
      path: '/platform/resources/resources/dns-normal-detail/:id',
      component: () => import('@/views/platform/resources/resources/components/dns/normal-template-detail'),
      name: 'platform-business-basics-resources-dns-normal-detail',
      hidden: true,
      meta: {
        title: 'DNS调度管理', icon: 'list', noCache: true, menus: ['resources']
      }
    }, {
      path: '/platform/resources/resources/dns-abnormal-detail/:id',
      component: () => import('@/views/platform/resources/resources/components/dns/abnormal-template-detail'),
      name: 'platform-business-basics-resources-dns-abnormal-detail',
      hidden: true,
      meta: {
        title: 'DNS调度管理', icon: 'list', noCache: true, menus: ['resources']
      }
    }]
  },
  {
    path: '/bandwidth',
    component: () => import('@/views/platform/resources/bandwidth/index'),
    hidden: false,
    alwaysShow: true, // will always show the root menu
    meta: { title: '带宽限速', icon: 'tab', menus: ['crm', 'resources'] },
    redirect: '/bandwidth/list',
    children: [{
      path: '/bandwidth/list',
      component: () => import('@/views/platform/resources/bandwidth/pages/list'),
      name: 'BandWidth',
      meta: {
        title: '限速列表', icon: 'list', noCache: true, menus: ['crm', 'resources']
      }
    },
    {
      path: '/bandwidth/customer-rule/:id',
      component: () => import('@/views/platform/resources/bandwidth/pages/customer-rule'),
      name: 'BandWidth-detail-customer',
      hidden: true,
      meta: { title: '客户维度', noCache: true, icon: 'service', menus: ['crm', 'resources'] }
    },
    {
      path: '/bandwidth/host-rule/:id',
      component: () => import('@/views/platform/resources/bandwidth/pages/host-rule'),
      name: 'BandWidth-detail-host',
      hidden: true,
      meta: { title: '主机维度', noCache: true, icon: 'service', menus: ['crm', 'resources'] }
    }]
  },
  {
    path: '*',
    redirect: '/404',
    hidden: true
  }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

const router = createRouter()

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
