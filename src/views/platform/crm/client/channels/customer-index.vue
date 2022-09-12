<template>
  <console-page-layout>
    <Form ref="Form" :sales="SALES" @init="init" />
    <el-card :body-style="{'padding':'5px'}">
      <div>
        <Tabs
          ref="Tabs"
          @init="e=>{
            active = e
            init()
          }"
        />
        <div class="right-box">
          <el-button v-show="active === 'list'" type="primary" @click="$refs.edit.handleOpen()" >新增</el-button>
        </div>
      </div>
      <CustomerList v-show="active === 'list'" ref="list" />
      <CustomerLink v-show="active === 'link'" ref="link" />
    </el-card>
    <Edit ref="edit" @init="init" />
  </console-page-layout>
</template>
<script>

import Form from './page/customer-form'
import Tabs from './page/customer-tab'
import CustomerList from './page/customer-list'
import CustomerLink from './page/customer-link'
import Edit from './components/customer/edit'
import mixins from './mixins'
export default {
  components: { Form, Tabs, CustomerList, CustomerLink, Edit },
  mixins: [mixins],
  data() {
    return {
      active: 'list'
    }
  }
}
</script>

<style lang="scss" scoped>
@import url('./style.scss');
</style>
