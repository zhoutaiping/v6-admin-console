import Layout from '@/layout/TabLayout'
export default {
  path: '/record-white',
  component: Layout,
  alwaysShow: true, // will always show the root menu
  meta: {
    title: '备案白名单',
    icon: 'tab',
    menus: ['msg']
  },
  children: [
    {
      path: '/record-white/list',
      component: () => import('@/views/platform/msg/page/record-white-list'),
      name: 'RecordWhiteList',
      meta: {
        title: '白名单列表',
        icon: 'skill',
        menus: ['msg']
      }
    }
  ]
}
