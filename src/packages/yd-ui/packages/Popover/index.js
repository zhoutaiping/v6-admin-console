import Popover from './Popover'
import directive from './directive'
import Vue from 'vue'

Vue.directive('popover', directive)

/* istanbul ignore next */
Popover.install = function() {
  Vue.directive('popover', directive)
  Vue.component(Popover.name, Popover)
}
Popover.directive = directive

export default Popover
