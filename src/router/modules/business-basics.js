import TabLayout from '@/layout/TabLayout'
export default {
  path: '/platform/business',
  component: TabLayout,
  alwaysShow: true, // will always show the root menu
  meta: { title: '基础设施', icon: 'tab', menus: ['bausiness'] },
  redirect: '/platform/business/basics/dispatch',
  children: [
    {
      path: '/platform/business/basics/domain-forward',
      component: () => import('@/views/platform/business/basics/domain-forward'),
      name: 'platformbusinessbasicsDomainForward',
      meta: {
        title: '域名转发', icon: 'list', noCache: true, menus: ['bausiness']
      }
    },
    {
      path: '/platform/business/basics/domain-forward/:id',
      component: () => import('@/views/platform/business/basics/components/domain-forward/edit'),
      name: 'platformbusinessbasicsDomainForwardEdit',
      hidden: true,
      meta: {
        title: '域名转发管理', icon: 'list', noCache: true, menus: ['bausiness']
      }
    },
    {
      path: '/platform/business/basics/tcp-forward',
      component: () => import('@/views/platform/business/basics/tcp-forward'),
      name: 'PLATFORM-BUSINESS-BASICS-TCP-FORWARD',
      meta: {
        title: 'TCP转发', icon: 'list', noCache: true, menus: ['bausiness']
      }
    },
    {
      path: '/platform/business/basics/tcp-forward/:id',
      component: () => import('@/views/platform/business/basics/components/tcp-forward/edit'),
      name: 'PLATFORM-BUSINESS-BASICS-TCP-FORWARD-EDIT',
      hidden: true,
      meta: {
        title: 'TCP转发管理', icon: 'list', noCache: true, menus: ['bausiness']
      }
    },
    {
      path: '/platform/business/basics/dispatch',
      component: () => import('@/views/platform/business/basics/dispatch'),
      name: 'platformbusinessbasicsdispatch',
      meta: {
        title: '调度列表', icon: 'list', noCache: true, menus: ['bausiness']
      }
    }, {
      path: '/platform/business/basics/dispatch/:id',
      component: () => import('@/views/platform/business/basics/components/disp/edit'),
      name: 'platformbusinessbasicsdispatchEdit',
      hidden: true,
      meta: {
        title: '调度管理', icon: 'list', noCache: true, menus: ['bausiness']
      }
    }, {
      path: '/platform/business/basics/resources',
      component: () => import('@/views/platform/business/basics/resources'),
      name: 'platformbusinessbasicsresources',
      meta: {
        title: '资源列表', icon: 'list', noCache: true, menus: ['bausiness']
      }
    }, {
      path: '/platform/business/basics/resources/:id',
      component: () => import('@/views/platform/business/basics/components/resource/edit'),
      name: 'platformbusinessbasicsresourcesEdit',
      hidden: true,
      meta: {
        title: '资源管理', icon: 'list', noCache: true, menus: ['bausiness']
      }
    }]
}
