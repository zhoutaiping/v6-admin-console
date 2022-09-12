import Layout from '@/layout/TabLayout'
export default {
  path: '/user',
  component: Layout,
  alwaysShow: true, // will always show the root menu
  meta: {
    title: '用户管理',
    icon: 'tab',
    menus: ['msg']
  },
  children: [
    {
      path: '/user/whitelist',
      component: () => import('@/views/platform/crm/client/whitelist/index'),
      name: 'UserWhitelist',
      meta: {
        title: '白名单策略',
        noCache: true,
        icon: 'documentation',
        menus: ['msg']
      }
    },
    {
      path: '/user/cdn-ip',
      component: () => import('@/views/platform/msg/page/cdn-ip'),
      name: 'UserCdn-ip',
      meta: {
        title: 'CDN-高防IP',
        icon: 'platform4',
        menus: ['msg']
      }
    }
  ]
}

