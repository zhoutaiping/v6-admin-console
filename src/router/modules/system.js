import Layout from '@/layout/TabLayout'
export default {
  path: '/system',
  component: Layout,
  alwaysShow: true, // will always show the root menu
  redirect: '/system/account',
  meta: {
    title: '系统管理',
    icon: 'tab',
    menus: ['identity', 'crm']
  },
  children: [
    {
      path: '/system/permission',
      component: () => import('@/views/platform/crm/system/permission/view/index'),
      name: 'SystemPermission',
      meta: {
        title: '资源管理',
        icon: 'web', menus: ['identity', 'crm']
      }
    }, {
      path: '/system/role',
      component: () => import('@/views/platform/crm/system/role/index'),
      name: 'SystemRole',
      meta: {
        title: '角色管理',
        icon: 'peoples', menus: ['identity', 'crm']
      }
    }, {
      path: '/system/account',
      component: () => import('@/views/platform/crm/system/account/view/index'),
      name: 'SystemAccount',
      meta: {
        title: '用户管理',
        icon: 'user', menus: ['identity', 'crm']
      }
    }
  ]
}

