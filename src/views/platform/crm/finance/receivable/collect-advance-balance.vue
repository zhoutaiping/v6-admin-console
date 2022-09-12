<template>
  <console-page-layout>
    <DmToolbar>
      <InputSearch
        v-model="bindParams.member_id"
        placeholder="用户ID"
        @submit="$refs.DmData.initPage()"
      />
      <InputSearch
        v-model="bindParams.member_email"
        placeholder="用户邮箱"
        @submit="$refs.DmData.initPage()"
      />
      <DmSelect
        v-model="bindParams.period"
        :selects="period_list"
        placeholder="账期"
        class="input-box"
        @change="$refs.DmData.initPage()"
      />
      <el-button
        type="primary"
        @click="handleExport()"
      >导出</el-button>
      <el-button
        type="primary"
        @click="$refs.addAdvance.handleOpen()"
      >指定更新预收余额</el-button>
    </DmToolbar>

    <DmAlert>
      <i class="el-icon-info primar-color" />
      <span
        v-show="select.length"
        class="tip-text"
      >已选择: <span class="primar-color tip-text">{{ select.length }}</span> </span> &emsp;
      合计累计收款：<span class="color--primary">{{ calc_sum && calc_sum.accumulated_collection || 0 }} </span>&emsp;&emsp;
      平台余额：<span class="color--primary">{{ calc_sum && calc_sum.platform_balance || 0 }} </span>&emsp;&emsp;
      预收余额（用户邮箱）：<span class="color--primary">{{ calc_sum && calc_sum.receive_email_balance_advance || 0 }} </span>&emsp;&emsp;
      预收余额（校正邮箱）：<span class="color--primary">{{ calc_sum && calc_sum.correct_email_balance_advance || 0 }}</span>
    </DmAlert>
    <DmData
      ref="DmData"
      @init="fetchList"
    >
      <DmTable :loading="loading">
        <el-table
          :data="list"
          @selection-change="e => {
            select = e
            calSum()
          }"
        >
          <el-table-column
            type="selection"
            width="55px"
          />
          <el-table-column
            v-for="(item, index) in column"
            :key="index"
            :label="item.label"
            :prop="item.prop"
            :width="item.width"
            :fixed="item.fiexd"
            show-overflow-tooltip
          >
            <template slot-scope="{row}">
              {{ formartValue(row, item.prop) }}
            </template>
          </el-table-column>
        </el-table>
      </DmTable>
    </DmData>
    <Add
      ref="addAdvance"
      @initPage="$refs.DmData.initPage()"
    />
  </console-page-layout>
</template>

<script>
import consoleData from '@/mixins/consoleData'
import Add from './components/balance-advance-create'
export default {
  components: { Add },
  mixins: [consoleData],
  data() {
    return {
      API_INDEX: '/V4/balance.advance.list',
      API_METHOD: 'post',
      bindParams: { period: '' },
      period: '',
      select: [],
      column: [
        { label: 'ID', prop: 'id' },
        { label: '用户ID', prop: 'member_id' },
        { label: '用户邮箱', prop: 'email' },
        { label: '指定账期', prop: 'period' },
        { label: '账期末累计收款', prop: 'accumulated_collection' },
        { label: '账期末平台余额', prop: 'platform_balance' },
        { label: '账期末预收余额（用户邮箱）', prop: 'receive_email_balance_advance' },
        { label: '账期未预收余额（校正邮箱）', prop: 'correct_email_balance_advance' }
      ],
      period_list: [],
      calc_sum: {}
    }
  },
  watch: {
    resData: {
      handler(val) {
        this.calc_sum = this.resData.calc_sum
      },
      deep: true
    }
  },

  async created() {
    await this.periodList()
  },

  methods: {
    async periodList() {
      try {
        const data = await this.Fetch.get('/V4/balance.advance.periodlist', {})
        this.period_list = data.map(i => { return { label: i, value: i } })
      } catch (e) {
        this.period_list = []
        return
      }
    },

    formartValue(data, prop) {
      return data[prop]
    },

    calSum() {
      if (this.select.length) {
        let [accumulated_collection, platform_balance, receive_email_balance_advance, correct_email_balance_advance] = [0, 0, 0, 0]
        this.select.forEach(e => {
          accumulated_collection = (accumulated_collection * 1000 + Number(e.accumulated_collection) * 1000) / 1000
          platform_balance = (platform_balance * 1000 + Number(e.platform_balance) * 1000) / 1000
          receive_email_balance_advance = (receive_email_balance_advance * 1000 + Number(e.receive_email_balance_advance) * 1000) / 1000
          correct_email_balance_advance = (correct_email_balance_advance * 1000 + Number(e.correct_email_balance_advance) * 1000) / 1000
        })
        this.calc_sum = {
          accumulated_collection, platform_balance, receive_email_balance_advance, correct_email_balance_advance
        }
      } else {
        this.calc_sum = this.resData.calc_sum
      }
    },

    handleExport() {
      const parsms = { ...this.bindParams, id: this.select.map(i => i.id) }
      this.$confirm('将会导出预收余额，是否确认操作？', '导出', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.Fetch.post('/V4/balance.advance.export', parsms).then(res => {
          if (res.url) {
            this.downloadFile(res.url)
            this.message.success('导出成功')
          }
        }).catch(e => {
          this.message.warning('导出失败')
        })
      })
    },

    downloadFile(url) {
      const iframe = document.createElement('iframe')
      iframe.style.display = 'none' // 防止影响页面
      iframe.style.height = 0 // 防止影响页面
      iframe.src = url
      document.body.appendChild(iframe) // 这一行必须，iframe挂在到dom树上才会发请求
      // 5分钟之后删除（onload方法对于下载链接不起作用，就先抠脚一下吧）
      setTimeout(() => {
        iframe.remove()
      }, 5 * 60 * 1000)
    }
  }
}
</script>
