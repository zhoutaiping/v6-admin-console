import TabLayout from '@/layout/TabLayout'
export default {
  path: '/dns',
  name: 'DNS',
  component: TabLayout,
  alwaysShow: true,
  meta: {
    title: 'DNS安全运营',
    icon: 'platform',
    menus: ['dns']
  },
  children: [
    {
      path: '/dns/meal-list',
      component: () => import('@/views/platform/dns/page/meal-list'),
      name: 'DNS-MEAL-LIST',
      meta: {
        title: 'DNS服务器套餐列表',
        icon: '',
        menus: ['dns']
      }
    },
    {
      path: '/dns/service-list',
      component: () => import('@/views/platform/dns/page/service-list'),
      name: 'dns-service-list',
      meta: {
        title: 'DNS服务器管理',
        icon: '',
        menus: ['dns']
      }
    }
    // {
    //   path: '/access/connector-up',
    //   component: () => import('@/views/platform/access/connector-up'),
    //   name: 'ACCESS-SAAS-CONNECTOR-UP',
    //   meta: {
    //     title: 'Connector镜像管理',
    //     icon: '',
    //     menus: ['access']
    //   }
    // }
  ]
}
