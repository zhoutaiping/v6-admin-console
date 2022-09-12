import TabLayout from '@/layout/TabLayout'
export default {
  path: '/Soc',
  component: TabLayout,
  alwaysShow: true, // will always show the root menu
  meta: { title: 'SOC安全运营', icon: 'tab', menus: ['soc'] },
  redirect: '/Soc/ip/list',
  children: [{
    path: '/Soc/ip/list',
    component: () => import('@/views/platform/Soc/ip'),
    name: 'SocIp',
    meta: {
      title: '主机IP', icon: 'list', noCache: true, menus: ['soc'] }
  }]
}
