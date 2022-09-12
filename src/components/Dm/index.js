import DmAlert from './DmAlert'
import DmData from './DmData'
import DmCard from './DmCard'
import DmTable from './DmTable'
import DmToolbar from './DmToolbar'
import DmDialog from './DmDialog'
import DmSelect from './DmSelect'
import DmPage from './DmPage'
import FDialog from './FDialog'
import DmDialogDrawer from './DmDialogDrawer'
import DmCardPanel from './DmCardPanel'
// import DmColumn from './DmColumn'
import DmTabs from './DmTabs'
DmData.install = Vue => {
  Vue.component(DmAlert.name, DmAlert)
  Vue.component(DmData.name, DmData)
  Vue.component(DmTabs.name, DmTabs)
  Vue.component(DmCard.name, DmCard)
  Vue.component(DmTable.name, DmTable)
  Vue.component(DmToolbar.name, DmToolbar)
  Vue.component(DmDialog.name, DmDialog)
  Vue.component(DmSelect.name, DmSelect)
  Vue.component(DmPage.name, DmPage)
  Vue.component(FDialog.name, FDialog)
  Vue.component(DmDialogDrawer.name, DmDialogDrawer)
  Vue.component(DmCardPanel.name, DmCardPanel)
}

export default DmData
