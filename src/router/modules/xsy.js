import Layout from '@/layout/TabLayout'
export default {
  path: '/xsy',
  component: Layout,
  alwaysShow: true, // will always show the root menu
  meta: {
    title: '销售易',
    icon: 'tab', menus: ['xsy']
  },
  redirect: '/xsy/order',
  children: [
    {
      path: '/xsy/order',
      component: () => import('@/views/platform/xsy/order/index'),
      name: 'XsyOrder',
      meta: { title: 'CRM订单', icon: 'order1', menus: ['xsy'] }
    }, {
      path: '/xsy/flow_refund',
      component: () => import('@/views/platform/xsy/flow/page/flow_refund'),
      name: 'XsyFlowA',
      meta: { title: '回款退款流水', icon: 'order1', menus: ['xsy'] }
    }, {
      path: '/xsy/flow_pay',
      component: () => import('@/views/platform/xsy/flow/page/flow_pay'),
      name: 'XsyFlowB',
      meta: { title: '收款打款流水', icon: 'order1', menus: ['xsy'] }
    }, {
      path: '/xsy/flow_receivable',
      component: () => import('@/views/platform/xsy/flow/page/flow_receivable'),
      name: 'XsyFlowC',
      meta: { title: '应收列表', icon: 'order1', menus: ['xsy'] }
    }, {
      path: '/xsy/customer',
      component: () => import('@/views/platform/xsy/customer/index'),
      name: 'Xsy_customer',
      meta: { title: '客户列表', icon: 'order1', menus: ['xsy'] }
    }

  ]
}
