import Layout from '@/layout/TabLayout'
export default {
  path: '/base-v5',
  component: Layout,
  alwaysShow: true,
  redirect: '/base-v5/cloud-resolving',
  name: 'Base',
  meta: {
    title: '应用安全',
    icon: 'tab',
    menus: ['crm']
  },
  children: [
    {
      path: '/base-v5/cloud-resolving',
      component: () => import('@/views/platform/crm/base-v5/cloud-resolving/index'),
      name: 'Base-Resolving',
      meta: { title: '云解析', noCache: true, icon: 'Cloud', menus: ['crm'] }
    },
    {
      path: '/base-v5/cloud-dns',
      component: () => import('@/views/platform/crm/base-v5/cloud-dns/index'),
      name: 'Base-Dns',
      meta: { title: '线路管理', noCache: true, icon: 'list', menus: ['crm'] }
    },
    {
      path: 'power',
      component: () => import('@/views/platform/crm/base-v5/power/index'),
      meta: { title: '权限管理', icon: 'platform', noCache: true, menus: ['crm'] },
      redirect: '/power/api',
      children: [
        {
          path: 'power/api',
          component: () => import('@/views/platform/crm/base-v5/power/api-list'),
          name: 'power-api',
          meta: { title: 'API管理', icon: '', noCache: true, menus: ['crm'] }
        },
        {
          path: 'power/module',
          component: () => import('@/views/platform/crm/base-v5/power/module'),
          name: 'power-module',
          meta: { title: '模块管理', icon: '', noCache: true, menus: ['crm'] }
        },
        {
          path: 'power/router',
          component: () => import('@/views/platform/crm/base-v5/power/router-list'),
          name: 'power-router',
          meta: { title: '路由列表', icon: '', noCache: true, menus: ['crm'] }
        },
        {
          path: 'power/router-group',
          component: () => import('@/views/platform/crm/base-v5/power/router-group'),
          name: 'power-router-group',
          meta: { title: '授权对象', icon: '', noCache: true, menus: ['crm'] }
        }
      ]
    }
  ]
}
