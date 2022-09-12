<style lang="scss" scoped>
.app-container {
  padding: 10px;
}
.search-form-item {
  margin-bottom: 5px;
}
.search-form-input {
  width: 200px;
  margin: 0 2px;
}
.op-btn {
  margin: 0 2px;
}
.title-color-primary {
  color: #409eff;
}
</style>
<template>
  <console-page-layout>
    <DmToolbar>
      <InputSearch
        v-model="bindParams.keyword"
        placeholder="用户邮箱"
        class="input-box"
        @submit="$refs.DmData.initPage()"
      />
      <el-button
        type="primary"
        class="op-btn"
        @click="$refs.DmData.initPage()"
      >搜 索</el-button>
    </DmToolbar>
    <el-tabs
      v-model="panel_type"
      class="tab-box"
      type="card"
      @tab-click="changeTab"
    >
      <el-tab-pane
        v-for="item in tabs"
        :key="item.name"
        :label="item.label"
        :name="item.name"
      />
    </el-tabs>
    <DmAlert style="margin-bottom: 10px;">
      <i class="el-icon-info primar-color" />
      <span v-show="panel_type === '1' || panel_type ==='2'">
        <span class="tip-text">合计总余额： </span> <span class="primar-color tip-text">{{ responseData.total_balance || 0 }}</span>
        <span class="tip-text">合计微信账户余额： </span> <span class="primar-color tip-text">{{ responseData.total_wx_balance || 0 }}</span>
        <span class="tip-text">合计支付宝账户余额: </span> <span class="primar-color tip-text">{{ responseData.total_alipay_balance || 0 }} </span>
        <span class="tip-text">合计银行账户余额: </span> <span class="primar-color tip-text">{{ responseData.total_bank_balance || 0 }}</span>
      </span>
      <span v-show="panel_type === '3' || panel_type ==='4'">
        <span class="tip-text">合计总余额： </span> <span class="primar-color tip-text">{{ responseData.baishan_total_balance || 0 }}</span>
        <span class="tip-text">合计微信账户余额： </span> <span class="primar-color tip-text">{{ responseData.baishan_online_balance_wx || 0 }}</span>
        <span class="tip-text">合计支付宝账户余额： </span> <span class="primar-color tip-text">{{ responseData.baishan_online_balance_alipay || 0 }}</span>
      </span>
    </DmAlert>
    <DmData
      ref="DmData"
      @init="fetchList(setParams())"
    >
      <DmTable :loading="loading" >
        <el-table :data="data" >
          <el-table-column
            v-for="(item, index) in column"
            :key="index"
            :label="item.label"
            :prop="item.prop"
            :width="item.width"
            :fixed="item.fiexd"
            show-overflow-tooltip
          />
          <el-table-column label="操作" width="260" >
            <template slot-scope="scope">
              <a class="color--primary" @click="handleRowClick(scope.row,'opDetail',scope.$index)">操作详情</a>
              <el-divider direction="vertical"/>
              <a class="color--primary" @click="handleRowClick(scope.row,'flow',scope.$index)">余额明细</a>
              <el-divider direction="vertical"/>
              <a class="color--primary" @click="handleRowClick(scope.row,'plus',scope.$index)">提 现</a>
            </template>
          </el-table-column>
        </el-table>
      </DmTable>
    </DmData>
    <dialog-detail ref="dialogDetail" @on-success="$refs.DmData.initPage()" />
    <dialog-edit ref="dialogEdit" @on-success="$refs.DmData.initPage()" />
    <el-tooltip placement="top" content="回到顶部" >
      <back-to-top
        :custom-style="myBackToTopStyle"
        :visibility-height="300"
        :back-position="50"
        transition-name="fade"
      />
    </el-tooltip>
  </console-page-layout>
</template>

<script>
import consoleData from '@/mixins/consoleData'
// import remitApi from '@/api/remitApi'
import DialogDetail from './components/DialogDetail'
import DialogEdit from './components/DialogEdit'
import * as FORM from './form'
export default {
  components: { DialogDetail, DialogEdit },
  mixins: [consoleData],
  data() {
    return {
      API_INDEX: '/fd/V4/member.list',
      API_METHOD: 'post',
      bindParams: { keyword: '' },
      column: FORM.column_yd,
      myBackToTopStyle: FORM.myBackToTopStyle,
      panel_type: '1', // 余额类型  0-全部，1-余额大于0,2-余额等于0，默认是1
      tabs: [
        { label: '云盾-总金额大于0', name: '1' },
        { label: '云盾-总金额为0', name: '2' },
        { label: '白山-总金额大于0', name: '3' },
        { label: '白山-总金额为0', name: '4' }
      ]
    }
  },
  computed: {
    data() {
      const list = JSON.parse(JSON.stringify(this.list)) || []
      list.length && list.forEach(element => {
        // 云盾总金额
        const total_blance_yd = (Number(element.online_balance_wx) || 0) + (Number(element.offline_balance_wx) || 0) + (Number(element.online_balance_alipay) || 0) +
        (Number(element.offline_balance_alipay) || 0) + (Number(element.offline_balance_bank) || 0) + (Number(element.online_balance_bank_baofu) || 0)
        // 白山总金额
        const total_blance_bs = (Number(element.baishan_online_balance_alipay) || 0) + (Number(element.baishan_online_balance_wx) || 0)
        element.total_blance = this.panel_type === '1' || this.panel_type === '2' ? total_blance_yd.toFixed(2) : total_blance_bs.toFixed(2)
        element.total_blance_yd = total_blance_yd
        element.total_blance_bs = total_blance_bs
      })
      return list
    }
  },
  methods: {
    setParams() {
      const data = { ...this.bindParams, pagesize: this.$refs.DmData.getParams().per_page }
      if (this.panel_type === '1' || this.panel_type === '2') { // 云盾
        data.balance_type = this.panel_type
        data.plat = 'yd'
      }
      if (this.panel_type === '3' || this.panel_type === '4') { // 白山
        data.balance_type = this.panel_type === '3' ? '1' : '2'
        data.plat = 'bs'
      }
      return data
    },
    async handleload() {
      this.$refs.DmData.initPage()
    },
    changeTab(panel_type) {
      if (this.panel_type === '1' || this.panel_type === '2') this.column = FORM.column_yd
      if (this.panel_type === '3' || this.panel_type === '4') this.column = FORM.column_bs
      this.$refs.DmData.initPage()
    },
    handleRowClick(data, type, index) {
      const rowData = JSON.parse(JSON.stringify(data))
      switch (type) {
        case 'add':
          this.$refs.dialogEdit.handleOpen(rowData, type)
          break
        case 'plus':
          this.$refs.dialogEdit.handleOpen(rowData, type)
          break
        case 'opDetail':
          this.$refs.dialogDetail.handleOpen(rowData, type)
          break
        case 'flow':
          this.$refs.dialogDetail.handleOpen(rowData, type)
          break
      }
    }

  }
}
</script>
