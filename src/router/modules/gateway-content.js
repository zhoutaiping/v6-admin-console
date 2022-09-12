import TabLayout from '@/layout/TabLayout'
export default {
  path: '/gateway-content',
  name: 'GatewayContent',
  component: TabLayout,
  alwaysShow: true,
  meta: { title: '内容分类', icon: 'Receivable1', menus: ['gateway'] },
  redirect: '/gateway-content-index',
  children: [
    {
      path: '/gateway-content-index',
      component: () => import('@/views/platform/gateway/page/content/index'),
      name: 'GatewayContentIndex',
      meta: { title: '内容分类', icon: 'platform1', menus: ['gateway'] }
    },
    {
      path: '/gateway-content-add',
      component: () => import('@/views/platform/gateway/page/content/add-edit'),
      name: 'GatewayContentAdd',
      hidden: true,
      meta: { title: '新增分类', icon: 'platform1', menus: ['gateway'] }
    },
    {
      path: '/gateway-content/bypass',
      component: () => import('@/views/platform/gateway/page/bypass/index'),
      name: 'GatewayContentBypass',
      meta: { title: 'Bypass', icon: 'platform1', menus: ['gateway'] }
    },
    {
      path: '/gateway-content-index/:id',
      component: () => import('@/views/platform/gateway/page/content/add-edit'),
      name: 'GatewayContentEdit',
      hidden: true,
      meta: { title: '编辑分类', icon: 'platform1', menus: ['gateway'] }
    }
    // {
    //   path: '/gateway/content/url',
    //   component: () => import('@/views/platform/gateway/page/content/url'),
    //   name: 'GatewayContentUrl',
    //   meta: { title: 'URL库', icon: 'Receivable1', menus: ['gateway'] }
    // }
  ]
}
