import Layout from '@/layout/TabLayout'
export default {
  path: '/advisory',
  component: Layout,
  alwaysShow: true, // will always show the root menu
  meta: {
    title: '客服管理',
    icon: 'tab',
    menus: ['crm']
  },
  redirect: '/advisory/meal',
  children: [
    {
      path: '/advisory/meal',
      component: () => import('@/views/platform/crm/advisory/meal/list'),
      name: 'AdvisoryMeal',
      meta: { title: '套餐列表', icon: 'list', menus: ['crm'] }
    },
    {
      path: '/advisory/create-meal',
      component: () => import('@/views/platform/crm/advisory/meal/create/index'),
      name: 'create-meal',
      meta: { title: '开通服务', icon: 'list', menus: ['crm'] },
      hidden: true
    },
    {
      path: '/advisory/edit-meal/:id',
      component: () => import('@/views/platform/crm/advisory/meal/edit/index'),
      name: 'edit-meal',
      meta: { title: '编辑', icon: 'list', menus: ['crm'] },
      hidden: true
    }
  ]
}
