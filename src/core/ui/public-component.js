import Vue from 'vue'
import ElTreeSelect from '@/components/ElTreeSelect'

import Dm from '@/components/Dm'
import Particles from '@/components/particles'
import Input from '@/components/Input'
import DmHeader from '@/components/DmHeader'
import BackToTop from '@/components/BackToTop'
import Pagination from '@/components/Pagination'
import CardLayout from '@/components/Card/CardLayout'
import CardInfo from '@/components/Card/CardInfo'
// import CheckTag from '@/components/Card/checkTag'
import BindTagTree from '@/components/Card/bindTag_tree'
import autoColumn from '@/components/TabAutoClumn/autoColumn'
import DmScroll from '@/components/DmScroll'
import ConsolePageLayout from '@/components/Layout/ConsolePageLayout'
import Form from '@/components/Form'
import Layout from '@/layout'

Vue.use(Dm)
Vue.use(Input)
Vue.use(Form)
Vue.use(Layout)
Vue.component('Particles', Particles)
Vue.component('DmHeader', DmHeader)
Vue.component('BackToTop', BackToTop)
Vue.component('Pagination', Pagination)
Vue.component('CardInfo', CardInfo)
Vue.component('CardLayout', CardLayout)
// Vue.component('CheckTag', CheckTag)
Vue.component('BindTagTree', BindTagTree)
Vue.component('AutoColumn', autoColumn)

Vue.component('DmScroll', DmScroll)
Vue.component('ElTreeSelect', ElTreeSelect)
Vue.component('ConsolePageLayout', ConsolePageLayout)
