import Layout from '@/layout/TabLayout'
export default {
  path: '/feedback',
  component: Layout,
  alwaysShow: true, // will always show the root menu
  meta: {
    title: '反馈系统',
    icon: 'tab',
    menus: ['feedback']
  },
  children: [
    {
      path: '/feedback/user-list',
      component: () => import('@/views/platform/feedback/page/user-list'),
      name: 'FeedbackUserList',
      meta: {
        title: '用户建议反馈',
        icon: 'platform4',
        menus: ['feedback']
      }
    }
  ]
}

