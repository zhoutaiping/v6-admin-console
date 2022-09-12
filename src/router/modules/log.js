import Layout from '@/layout/TabLayout'
export default {
  path: '/log',
  component: Layout,
  alwaysShow: true, // will always show the root menu
  meta: {
    title: '日志管理',
    icon: 'tab',
    menus: ['crm', 'msg']
  },
  redirect: '/log/index',
  children: [
    {
      path: '/log/index',
      component: () => import('@/views/platform/crm/log/index'),
      name: 'LogIndex',
      meta: {
        title: '日志列表',
        icon: 'list',
        menus: ['crm', 'msg']
      }
    },
    {
      path: '/log/operation',
      component: () => import('@/views/platform/crm/log/operation/index'),
      name: 'LogOperation',
      meta: {
        title: '二次操作确认',
        icon: 'list',
        menus: ['crm', 'msg']
      }
    }
  ]
}
