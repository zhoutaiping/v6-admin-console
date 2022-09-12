import RouterLayout from '@/layout/RouterLayout'
export default {
  path: '/finance/invoice',
  component: RouterLayout, // Parent router-view
  alwaysShow: true,
  redirect: '/finance/invoice/order',
  name: 'FinanceInvoice',
  meta: {
    title: '发票管理',
    icon: 'invoice2',
    menus: ['crm']
  },
  children: [
    {
      path: 'order',
      component: () => import('@/views/platform/crm/finance/invoice/orderList'),
      name: 'FinanceInvoiceOrder',
      meta: { title: '申请发票', noCache: true, menus: ['crm'] }
    },
    {
      path: 'invoicListUser',
      component: () => import('@/views/platform/crm/finance/invoice/invoiceList-user'),
      name: 'FinanceInvoiceListUser',
      meta: { title: '发票列表-用户', noCache: true, menus: ['crm'] }
    },
    {
      path: 'invoicListFinace',
      component: () => import('@/views/platform/crm/finance/invoice/invoiceList-finace'),
      name: 'FinanceInvoiceListFinace',
      meta: { title: '发票列表-财务', noCache: true, menus: ['crm'] }
    }
  ]
}
