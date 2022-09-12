import Breadcrumb from './Breadcrumb'
import BreadcrumbItem from './BreadcrumbItem'

/* istanbul ignore next */
Breadcrumb.install = function(Vue) {
  Vue.component(Breadcrumb.name, Breadcrumb)
  Vue.component(BreadcrumbItem.name, BreadcrumbItem)
}

export default Breadcrumb
