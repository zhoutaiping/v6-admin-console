import Layout from '@/layout/TabLayout'
import RouterLayout from '@/layout/RouterLayout'
export default {
  path: '/client',
  component: Layout,
  alwaysShow: true,
  redirect: '/client/base/index',
  name: 'Client',
  meta: {
    title: '客户管理',
    icon: 'tab',
    menus: ['crm']
  },
  children: [
    {
      path: '/client/base/index',
      component: () => import('@/views/platform/crm/client/base/index'),
      name: 'ClienBase',
      meta: {
        title: '基本信息',
        noCache: true,
        icon: 'documentation',
        menus: ['crm']
      }
    },
    {
      path: '/client/list/index',
      component: () => import('@/views/platform/crm/client/list/index'),
      name: 'ClientList',
      meta: {
        title: '用户列表',
        noCache: true,
        icon: 'documentation',
        menus: ['crm']
      }
    },
    {
      path: '/client/requestInviteCode/index',
      component: () => import('@/views/platform/crm/client/requestInviteCode/index'),
      name: 'requestInviteCode',
      meta: {
        title: '邀请码列表',
        noCache: true,
        icon: 'documentation',
        menus: ['crm']
      }
    },
    {
      path: '/client/whitelist/index',
      component: () => import('@/views/platform/crm/client/whitelist/index'),
      name: 'ClientWhitelist',
      meta: {
        title: '白名单策略',
        noCache: true,
        icon: 'documentation',
        menus: ['crm']
      }
    },
    {
      path: '/msg/cdn-ip',
      component: () => import('@/views/platform/msg/page/cdn-ip'),
      name: 'CDN-IP',
      meta: {
        title: 'CDN-高防IP',
        noCache: true,
        icon: 'documentation',
        menus: ['crm']
      }
    },
    {
      path: '/client/loginlog/index',
      component: () => import('@/views/platform/crm/client/loginlog/index'),
      name: 'ClientLoginLog',
      meta: {
        title: '登录日志',
        noCache: true,
        icon: 'documentation',
        menus: ['crm']
      }
    },
    {
      path: '/client/certification/index',
      component: () => import('@/views/platform/crm/client/certification/index'),
      name: 'certification',
      meta: {
        title: '变更认证',
        noCache: true,
        icon: 'documentation',
        menus: ['crm']
      }
    },
    {
      path: '/finance/invoice/info/index',
      component: () => import('@/views/platform/crm/finance/invoice/info/index'),
      name: 'FinanceInvoiceInfo',
      meta: {
        title: '发票信息',
        icon: 'invoicelist',
        noCache: true,
        menus: ['crm']
      }
    },
    {
      path: '/finance/invoice/channels',
      name: 'INVOICE-CHANNELS',
      component: RouterLayout,
      redirect: '/finance/crm/invoice/channels/index',
      meta: {
        title: '渠道管理',
        icon: 'documentation',
        menus: ['crm']
      },
      children: [
        {
          path: '/finance/invoice/channels/setting',
          component: () => import('@/views/platform/crm/client/channels/setting'),
          name: 'INVOICE-CHANNELS-SETTING',
          meta: {
            title: '渠道配置',
            icon: 'documentation',
            menus: ['crm']
          }
        },
        {
          path: '/finance/invoice/channels/index',
          component: () => import('@/views/platform/crm/client/channels/index'),
          name: 'INVOICE-CHANNELS-LIST',
          meta: {
            title: '渠道列表',
            icon: 'documentation',
            menus: ['crm']
          }
        },
        {
          path: '/finance/invoice/customer/index',
          component: () => import('@/views/platform/crm/client/channels/customer-index'),
          name: 'INVOICE-CUSTOMER',
          meta: {
            title: '终端客户',
            icon: 'documentation',
            menus: ['crm']
          }
        }
      ]
    },
    // riskcontrol
    {
      path: '/client/riskcontrol',
      name: 'INVOICE-RISKCONTROL',
      component: RouterLayout,
      redirect: '/client/riskcontrol/lsit',
      alwaysShow: true,
      meta: {
        title: '风控管理',
        icon: 'documentation',
        menus: ['crm']
      },
      children: [
        {
          path: '/client/riskcontrol/list',
          component: () => import('@/views/platform/crm/client/riskcontrol/list'),
          name: 'INVOICE-RISKCONTROL-LIST',
          meta: {
            title: '风控列表',
            icon: 'documentation',
            menus: ['crm']
          }
        }
      ]
    }
  ]
}
