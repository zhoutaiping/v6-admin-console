<template>
  <console-page-layout>
    <Form ref="Form" :sales="SALES" @init="init" />
    <el-card :body-style="{'padding':'5px'}">
      <div>
        <Tabs
          ref="Tabs"
          @init="e => {
            active = e
            init()
          }"
        />
        <div class="right-box">
          <el-button v-show="active === 'ongoing'" ype="primary" @click="$refs.add.handleOpen()" >新增</el-button>
        </div>
      </div>
      <OngoingList v-show="active === 'ongoing'" ref="ongoing" />
      <HistoryList v-show="active === 'history'" ref="history" />
      <RelieveList v-show="active === 'relieve'" ref="relieve" />
    </el-card>
    <Add ref="add" @init="init" />
  </console-page-layout>
</template>
<script>
import Form from './page/search-form'
import Tabs from './page/tab'
import OngoingList from './page/ongoing-list'
import HistoryList from './page/history-list'
import RelieveList from './page/relieve-list'
import Add from './components/channels/add'
import mixins from './mixins'
export default {
  components: { Form, Tabs, OngoingList, HistoryList, RelieveList, Add },
  mixins: [mixins],
  data() {
    return {
      active: 'ongoing'
    }
  }
}
</script>

<style lang="scss" scoped>
@import url('./style.scss');
</style>
