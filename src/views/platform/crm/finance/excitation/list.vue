<template>
  <console-page-layout>
    <Search
      ref="search"
      @init="$refs.DmData.initPage()"
    />
    <p>
      <el-button
        :disabled="!select.length"
        type="primary"
        @click="e =>{ $refs.grant.handleOpen(select) }"
      >发放佣金</el-button>
      <el-button
        type="primary"
        @click="e =>{ $refs.DmData.initPage() }"
      >刷新</el-button>
      <el-button
        :disabled="loading"
        type="primary"
        @click="handleExport">导出</el-button>
    </p>
    <DmAlert>
      已选择： {{ count.num || 0 }} &ensp;&ensp;
      实付金额： {{ count.pay_off_price || 0 }} &ensp;&ensp;
      佣金金额： {{ count.commission_total || 0 }}
    </DmAlert>
    <DmData
      ref="DmData"
      @init="fetchList($refs.search.params())"
    >
      <DmTable
        :loading="loading"
        min-height
      >
        <el-table
          :data="list"
          @selection-change="e => {
            select = e
            if(e) getCount()
          }"
        >
          <el-table-column
            :selectable="selectable"
            type="selection"
            width="55"
            fixed="left"
          />
          <el-table-column
            v-for="(item, index) in column"
            :key="index"
            :label="item.label"
            :width="item.width"
          >
            <template slot-scope="scope">
              <template v-if="item.prop === 'meal_flag'">
                {{ mealText(scope.row.meal_flag) }}
              </template>
              <template v-else>
                {{ formartValue(scope.row, item.prop) }}
              </template>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            fixed="right"
            width="150"
          >
            <template slot-scope="{ row }">
              <el-button
                type="text"
                @click="e =>{ $refs.info.handleOpen(row) }"
              >详情</el-button>
              <el-divider direction="vertical" />
              <el-button
                type="text"
                @click="e =>{ $refs.addedit.handleOpen(row, 'Edit') }"
              >管理</el-button>
            </template>
          </el-table-column>
        </el-table>
      </DmTable>
    </DmData>
    <InFo ref="info" />
    <Grant
      ref="grant"
      @init="$refs.DmData.initPage()"
    />
    <AddEdit
      ref="addedit"
      @init="$refs.DmData.initPage()"
    />
  </console-page-layout>
</template>

<script>
import consoleData from '@/mixins/consoleData'
import Grant from './components/commission/grant'
import InFo from './components/commission/info'
import AddEdit from './components/commission/edit'
import Search from './components/commission/search'
import { is_valid } from './utils'
export default {
  components: { Grant, InFo, AddEdit, Search },
  mixins: [consoleData],
  data() {
    return {
      API_INDEX: '/V4/cbms.order.commission.list',
      bindParams: {},
      select: [],
      column: [
        { label: 'ID', prop: 'id', width: '150' },
        { label: '订单Code', prop: 'order_code', width: '150' },
        { label: '用户邮箱', prop: 'member_email', width: '200' },
        { label: '渠道邮箱', prop: 'channel_member_email', width: '200' },
        { label: '套餐名称', prop: 'meal_flag', width: '200' },
        { label: '订单时间', prop: 'order_created_at', width: '150' },
        { label: '应付金额', prop: 'total_price', width: '150' },
        { label: '实付金额', prop: 'pay_off_price', width: '150' },
        { label: '创建时间', prop: 'created_at', width: '150' },
        { label: '完成回款时间', prop: 'finish_payment_time', width: '150' },
        { label: '是否有效', prop: 'is_valid', width: '150' },
        { label: '佣金比例', prop: 'commission_rate', width: '150' },
        { label: '佣金计算', prop: 'commission_total', width: '150' },
        { label: '发放状态', prop: 'is_grant', width: '150' },
        { label: '预计到账时间', prop: 'expected_arrival_time', width: '150' },
        { label: '实际到账时间', prop: 'paid_arrival_time', width: '150' }
      ],
      count: {}
    }
  },
  created() {
    this.$store.dispatch('getMeal')
  },
  methods: {
    selectable(row, index) {
      return row.is_valid && Number(row.is_valid) !== 3
    },
    async getCount() {
      const params = {
        ids: this.select.map(i => i.id)
      }

      if (this.select.length === 0) {
        this.count = {}
        return
      }
      try {
        const data = await this.Fetch.post('/V4/cbms.order.commission.count', params)
        this.count = data
      } catch (e) {
        this.count = {}
        return
      }
    },
    formartValue(data, prop) {
      const val = data[prop]
      if (prop === 'is_grant') return val === '1' ? '已发放' : '未发放'
      else if (prop === 'is_valid') return is_valid.find(i => i.value === val) ? is_valid.find(i => i.value === val).label : ''
      else if (prop === 'commission_rate') return val + '%'
      return val
    },
    async handleExport() {
      this.loading = true
      const params = {
        ...this.$refs.search.params()
      }
      this.$confirm('导出佣金列表excel，是否确认操作？', '导出', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const data = await this.Fetch.get('/V4/cbms.order.commission.export', params)
        const a = document.createElement('a')
        a.setAttribute('href', data.url)
        document.body.appendChild(a)
        a.click()
        a.style.display = 'none'
        this.Message('ACTION_SUCCESS')
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    }
  }
}
</script>
