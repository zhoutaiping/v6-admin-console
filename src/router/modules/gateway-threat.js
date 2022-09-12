import TabLayout from '@/layout/TabLayout'
import RouterLayout from '@/layout/RouterLayout'
export default {
  path: '/gateway/threat',
  name: 'GatewayThreat',
  component: TabLayout,
  alwaysShow: true,
  meta: { title: '威胁情报', icon: 'Receivable1', menus: ['gateway'] },
  redirect: '/gateway/threat/domain/type',
  children: [
    {
      path: '/gateway/threat/domain',
      component: RouterLayout,
      name: 'GatewayThreatDomain',
      meta: { title: '恶意域名', icon: 'Receivable1', menus: ['gateway'] },
      alwaysShow: true,
      children: [
        {
          path: '/gateway/threat/domain/type',
          component: () => import('@/views/platform/gateway/page/threat-domain/threat.vue'),
          name: 'GatewayThreatDomainThreat',
          meta: { title: '威胁分类', icon: 'Receivable1', menus: ['gateway'] }
        },
        {
          path: '/gateway/threat/domain/type-add',
          component: () => import('@/views/platform/gateway/page/threat-domain/threat-add-edit'),
          name: 'GatewayThreatDomainThreatAdd',
          hidden: true,
          meta: { title: '威胁分类-新增', icon: 'Receivable1', menus: ['gateway'] }
        },
        {
          path: '/gateway/threat/domain/type/:id',
          component: () => import('@/views/platform/gateway/page/threat-domain/threat-add-edit'),
          name: 'GatewayThreatDomainThreatEdit',
          hidden: true,
          meta: { title: '威胁分类-编辑', icon: 'Receivable1', menus: ['gateway'] }
        },
        {
          path: '/gateway/threat/domain/intelligence',
          component: () => import('@/views/platform/gateway/page/threat-domain/intelligence'),
          name: 'GatewayThreatDomaInintelligence',
          meta: { title: '威胁情报', icon: 'Receivable1', menus: ['gateway'] }
        }

      ]
    }
    // {
    //   path: '/gateway/threat/url',
    //   component: RouterLayout,
    //   name: 'GatewayThreatUrl',
    //   alwaysShow: true,
    //   meta: {
    //     title: '恶意URL',
    //     icon: 'Receivable1',
    //     menus: ['gateway']
    //   },
    //   children: [{
    //     path: '/gateway/threat/url/type',
    //     component: () => import('@/views/platform/gateway/page/threat-url/threat.vue'),
    //     name: 'GatewayThreatUrl',
    //     meta: { title: '威胁分类', icon: 'Receivable1', menus: ['gateway'] }
    //   }]
    // }
  ]
}
