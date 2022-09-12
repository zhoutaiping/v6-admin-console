import NavbarPage from './components/NavbarPage/NavbarPage'

const Layouts = {}
Layouts.install = Vue => {
  Vue.component(NavbarPage.name, NavbarPage)
}

export default Layouts
