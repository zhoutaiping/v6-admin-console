import TabLayout from '@/layout/TabLayout'
export default {
  path: '/access',
  name: 'ACCESS',
  component: TabLayout,
  alwaysShow: true,
  meta: {
    title: '应用可信访问',
    icon: 'platform',
    menus: ['access']
  },
  children: [
    {
      path: '/access/saas-application',
      component: () => import('@/views/platform/access/saas-application'),
      name: 'ACCESS-SAAS-APPLICATION',
      meta: {
        title: 'SaaS应用管理',
        icon: '',
        menus: ['access']
      }
    },
    {
      path: '/access/connector-version',
      component: () => import('@/views/platform/access/connector-version'),
      name: 'ACCESS-SAAS-CONNECTOR-VERSION',
      meta: {
        title: 'Connector升级管理',
        icon: '',
        menus: ['access']
      }
    },
    {
      path: '/access/connector-up',
      component: () => import('@/views/platform/access/connector-up'),
      name: 'ACCESS-SAAS-CONNECTOR-UP',
      meta: {
        title: 'Connector镜像管理',
        icon: '',
        menus: ['access']
      }
    },
    {
      path: '/access/intranet-ip',
      component: () => import('@/views/platform/access/IntranetIP'),
      name: 'ACCESS-INTRANET-IP',
      meta: {
        title: '内网IP管理',
        icon: '',
        menus: ['access']
      }
    },
    {
      path: '/access/channel-suffix',
      component: () => import('@/views/platform/access/channel-suffix'),
      name: 'ACCESS-SAAS-channel-suffix',
      meta: {
        title: '渠道商后缀管理',
        icon: '',
        menus: ['access']
      }
    }

  ]
}
