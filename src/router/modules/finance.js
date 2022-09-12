import TabLayout from '@/layout/TabLayout'
import RouterLayout from '@/layout/RouterLayout'
import invoiceRouter from './invoice'

export default {
  path: '/finance',
  component: TabLayout,
  alwaysShow: true, // will always show the root menu
  redirect: '/finance/order',
  meta: {
    title: '财务管理',
    icon: 'tab',
    menus: ['crm']
  },
  children: [
    {
      path: '/finance/order',
      component: () => import('@/views/platform/crm/finance/order/list'),
      name: 'FinanceOrder',
      meta: {
        title: '订单管理',
        icon: 'order1',
        menus: ['crm']
      }
    },
    {
      path: '/finance/receivable',
      name: 'FinanceReceivable',
      component: RouterLayout,
      redirect: '/finance/receivable/list',
      meta: {
        title: '应收管理',
        icon: 'Receivable1',
        menus: ['crm']
      },
      children: [
        {
          path: '/finance/receivable/list',
          component: () => import('@/views/platform/crm/finance/receivable/index'),
          name: 'FinanceReceivableList',
          meta: {
            title: '应收账单',
            icon: 'Receivable1',
            menus: ['crm']
          }
        },
        {
          path: '/finance/receivable/collect-advance-balance',
          component: () =>
            import('@/views/platform/crm/finance/receivable/collect-advance-balance'),
          name: 'FinanceReceivablebalance',
          meta: {
            title: '预收余额',
            icon: 'Receivable1',
            menus: ['crm']
          }
        }
      ]
    },
    invoiceRouter,
    {
      path: '/finance/accountbalance',
      component: () => import('@/views/platform/crm/finance/accountbalance/list'),
      name: 'FinanceAccountbalance',
      meta: {
        title: '余额管理',
        icon: 'Finance1',
        menus: ['crm']
      }
    },
    {
      path: '/finance/collectionlog',
      component: () => import('@/views/platform/crm/finance/collectionlog/list'),
      name: 'FinanceCollectionlog',
      meta: {
        title: '收款流水',
        icon: 'Receivable2',
        menus: ['crm']
      }
    },

    {
      path: '/finance/paylog',
      component: () => import('@/views/platform/crm/finance/paylog/list'),
      name: 'FinancePaylog',
      meta: {
        title: '打款流水',
        icon: 'Receivable1',
        menus: ['crm']
      }
    },
    {
      path: '/finance/paybackrefund',
      component: () => import('@/views/platform/crm/finance/paybackrefund/list'),
      name: 'FinancePaybackRefund',
      meta: {
        title: '回款-退款流水',
        icon: 'Finance1',
        menus: ['crm']
      }
    },
    {
      path: '/finance/cdn',
      component: () => import('@/views/platform/crm/finance/cdn/index'),
      name: 'FinanceCDN',
      meta: {
        title: 'CDN账单',
        icon: 'invoicelist',
        menus: ['crm']
      }
    },
    {
      path: '/finance/log',
      component: () => import('@/views/platform/crm/finance/log/index'),
      name: 'FinanceLog',
      meta: {
        title: '日志管理',
        icon: 'list',
        menus: ['crm']
      }
    },
    {
      path: '/finance/excitation',
      name: 'Finance-EXCITATION',
      component: RouterLayout,
      alwaysShow: true,
      meta: {
        title: '激励管理',
        icon: 'Receivable1',
        menus: ['crm']
      },
      children: [
        {
          path: '/finance/excitation/rule',
          component: () => import('@/views/platform/crm/finance/excitation/rule'),
          name: 'FINANCE-EXCITATION-RULE',
          meta: {
            title: '激励规则',
            icon: 'Receivable1',
            menus: ['crm']
          }
        },
        {
          path: '/finance/excitation/list',
          component: () => import('@/views/platform/crm/finance/excitation/list'),
          name: 'FINANCE-EXCITATION-List',
          meta: {
            title: '激励佣金',
            icon: 'Receivable1',
            menus: ['crm']
          }
        }
      ]
    }
  ]
}
