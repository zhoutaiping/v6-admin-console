import Alert from './packages/Alert'
import Badge from './packages/Badge'
import Button from './packages/Button'
import Card from './packages/Card'
import Dialog from './packages/Dialog'
import DmHeader from './packages/DmHeader'
import Form from './packages/Form'
// import FormItem from './packages/FormItem'
import Scroll from './packages/Scroll'
import Pagination from './packages/Pagination'
import Pagination2 from './packages/Pagination2'
import Icon from './packages/Icon'
import Loading from './packages/Loading'
import Table from './packages/Table'
import Tips from './packages/Tips'
import InputCheckbox from './packages/InputCheckbox'
function install(Vue) {
  if (install.installed) {
    return
  }
  install.installed = true

  const components = [
    Alert,
    Badge,
    Button,
    Card,
    Dialog,
    DmHeader,
    Form,
    InputCheckbox,
    // FormItem,
    Scroll,
    Pagination,
    Pagination2,
    Icon,
    Loading,
    Table,
    Tips
  ]

  components.forEach(Component => {
    Component.install(Vue)
  })
}

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(install)
}

export default {
  install
}
