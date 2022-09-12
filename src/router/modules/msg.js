import Layout from '@/layout/TabLayout'
export default {
  path: '/msg',
  component: Layout,
  alwaysShow: true, // will always show the root menu
  meta: {
    title: '消息中心管理',
    icon: 'tab',
    menus: ['msg']
  },
  children: [
    {
      path: '/msg/type',
      component: () => import('@/views/platform/msg/page/msg-type'),
      name: 'MsgType',
      meta: {
        title: '消息类型管理',
        icon: 'platform4',
        menus: ['msg']
      }
    },
    {
      path: '/msg/type/:id',
      component: () => import('@/views/platform/msg/page/msg-type-detail'),
      name: 'MsgTypeDetail',
      hidden: true,
      meta: {
        title: '服务通知管理', icon: 'platform4', noCache: true, menus: ['msg']
      }
    },
    {
      path: '/msg/template',
      component: () => import('@/views/platform/msg/page/msg-template'),
      name: 'MsgTmplate',
      meta: {
        title: '消息模板管理',
        icon: 'platform4',
        menus: ['msg']
      }
    },
    {
      path: '/msg/email',
      component: () => import('@/views/platform/msg/page/email'),
      name: 'MsgEmail',
      meta: {
        title: '邮件通知模板',
        icon: 'platform4',
        menus: ['msg']
      }
    },
    {
      path: '/msg/node',
      component: () => import('@/views/platform/msg/page/node'),
      name: 'MsgNode',
      meta: {
        title: '短信通知模板',
        icon: 'platform4',
        menus: ['msg']
      }
    },
    {
      path: '/msg/mail',
      component: () => import('@/views/platform/msg/page/mail'),
      name: 'MsgMail',
      meta: {
        title: '站内信通知模板',
        icon: 'platform4',
        menus: ['msg']
      }
    }
  ]
}

