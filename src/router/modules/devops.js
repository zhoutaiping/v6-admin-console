import TabLayout from '@/layout/TabLayout'
export default {
  path: '/devops',
  component: TabLayout,
  alwaysShow: true,
  name: 'DEVOPS',
  redirect: '/devops/Disp/template',
  meta: {
    title: '调度',
    icon: 'tab',
    menus: ['crm']
  },
  children: [
    {
      path: '/devops/Disp/ScheduIP',
      component: () => import('@/views/DevOps/Disp/ScheduleIP/index'),
      name: 'devops-ScheduleIP',
      meta: { title: 'IP资源', noCache: true, icon: 'service', menus: ['crm'] }
    },
    {
      path: '/devops/Disp/domainRecord',
      component: () => import('@/views/DevOps/Disp/domainRecord/index'),
      name: 'devops-domainRecord',
      meta: { title: '调度节点', noCache: true, icon: 'service', menus: ['crm'] }
    },
    {
      path: '/devops/Disp/DispLineIP',
      component: () => import('@/views/DevOps/Disp/DispLineIP/index'),
      name: 'devops-DispLineIP',
      meta: { title: '线路', noCache: true, icon: 'service', menus: ['crm'] }
    }
  ]
}
