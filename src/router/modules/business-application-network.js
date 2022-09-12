import TabLayout from '@/layout/TabLayout'
export default {
  path: '/platform/business-application-network',
  component: TabLayout,
  alwaysShow: true, // will always show the root menu
  meta: { title: '应用和网络安全', icon: 'tab', menus: ['bausiness'] },
  redirect: '/platform/business-application-network/rule',
  children: [
    {
      path: '/platform/business-application-network/rule',
      component: () => import('@/views/platform/business/application-network/rule-list'),
      name: 'APPLICATION-NETWORK-RULE',
      meta: {
        title: '平台级防护策略', icon: 'list', noCache: true, menus: ['bausiness']
      }
    },
    {
      path: '/platform/business-application-network/rule-detail/:id',
      component: () => import('@/views/platform/business/application-network/rule-detail'),
      name: 'APPLICATION-NETWORK-RULE-Detail',
      hidden: true,
      meta: {
        title: '规则列表', icon: 'list', noCache: true, menus: ['bausiness']
      }
    }]
}
