import Badge from './Badge'
import BadgeCheck from './BadgeCheck'

Badge.install = Vue => {
  Vue.component(Badge.name, Badge)
  Vue.component(BadgeCheck.name, BadgeCheck)
}

export default Badge
