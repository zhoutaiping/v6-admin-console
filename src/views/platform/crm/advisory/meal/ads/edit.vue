<template>
  <div>
    <DmDialog
      ref="Dialog"
      :fetch-submit="handleSubmit"
      :footer="true"
      :close-on-click-modal="false"
      :close-show="false"
      submit-text="关闭"
      title="ADS套餐编辑"
      aside
      width="800px"
    >
      <DmScroll>
        <DmAlert style="margin-bottom: 10px;">
          <div>
            1.当前套餐可用防护IP段配额：
            <span class="color--primary">{{ canUse }}</span>，
            剩余可用配额：<span class="color--primary">{{ unUsed }}</span>
          </div>
          <div>
            2.防护IP段仅支持按照CIDR格式，按照C段地址添加；
          </div>
        </DmAlert>
        <div>
          <el-button
            v-show="list.length< canUseNumber"
            type="primary"
            style="margin-bottom:10px;"
            @click="handleAdd"
          >新增IP段</el-button>
          <el-button
            type="primary"
            style="margin-bottom:10px;"
            @click="$refs.DmData.initPage()"
          >刷 新</el-button>
          <DmData
            ref="DmData"
            :auto-ini="false"
            @init="fetchList(Params)"
          >
            <DmTable :loading="loading">
              <el-table :data="list">
                <el-table-column
                  label="IP段"
                  prop="ip_block"
                >
                  <template slot-scope="scope">
                    <div v-if="scope.row.edit">
                      <el-input
                        v-model="scope.row.ip_block"
                        placeholder="1.1.1.2-1.1.1.24"
                        clearable
                      />
                    </div>
                    <div v-else>{{ scope.row.ip_block }}</div>
                  </template>
                </el-table-column>
                <el-table-column
                  label="添加时间"
                  prop="created_at"
                />
                <el-table-column
                  label="备注"
                  prop="remark"
                >
                  <template slot-scope="scope">
                    <div v-if="scope.row.edit">
                      <el-input
                        v-model="scope.row.remark"
                        placeholder="备注"
                        clearable
                      />
                    </div>
                    <div v-else>{{ scope.row.remark }}</div>
                  </template>
                </el-table-column>
                <el-table-column
                  label="操作"
                  width="150"
                >
                  <template slot-scope="scope">
                    <div v-if="scope.row.edit">
                      <a @click="addIp(scope.row)">保存</a>
                      <el-divider direction="vertical" />
                      <a
                        v-if="!scope.row.id || scope.row.id === ''"
                        @click="removeIp(scope.$index, 'del')"
                      >删 除</a>
                      <a
                        v-if="scope.row.id"
                        @click="EditClick(scope.$index, false)"
                      >取 消</a>
                    </div>
                    <div v-else>
                      <a @click="EditClick(scope.$index, true)">编 辑</a>
                      <el-divider direction="vertical" />
                      <a-popconfirm
                        title="是否删除IP段？"
                        ok-text="是"
                        cancel-text="否"
                        @confirm="removeIp(scope.row)"
                      >
                        <a>删 除</a>
                      </a-popconfirm>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
            </DmTable>
          </DmData>
        </div>
      </DmScroll>
    </DmDialog>
  </div>
</template>
<script>
import consoleData from '@/mixins/consoleData'
import moment from 'moment'
import Rul from '@/utils/verify'
export default {
  mixins: [consoleData],
  data() {
    return {
      API_INDEX: '/fd/V4/ads.plan.ip.block.list',

      form: {},
      ads_ip: {},
      rwoData: {}
    }
  },
  computed: {
    canUseNumber() {
      const data = this.ads_ip[this.rwoData.id]
      return data ? Number(data['canUse']) || 0 : 0
    },
    canUse() {
      const data = this.ads_ip[this.rwoData.id]
      let val = 0
      if (data && data['canUse'] !== '') {
        val = data['canUse']
      }
      return val + 'C'
    },
    unUsed() {
      const data = this.ads_ip[this.rwoData.id]
      let val = 0
      if (data && data['unUsed'] !== '') {
        val = data['unUsed']
      }
      return val + 'C'
    },
    Params() {
      return {
        plan_id: this.rwoData.id,
        member_id: this.rwoData.member_id
      }
    }
  },
  methods: {
    handleOpen(data, ads_ip) {
      this.rwoData = JSON.parse(JSON.stringify(data))
      this.ads_ip = Object.assign({}, ads_ip)
      this.$refs.Dialog.handleOpen()
      setTimeout(() => {
        this.$refs.DmData.initPage()
      }, 300)
    },
    handleAdd() {
      this.list.unshift({
        plan_id: this.rwoData.id,
        product_flag: this.rwoData.product_flag,
        meal_flag: this.rwoData.meal_flag,
        member_id: this.rwoData.member_id,
        created_at: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
        ip_block: '',
        remark: '',
        edit: true
      })
    },
    checkIP(ip_block) {
      if (!ip_block) {
        this.message.warning('请输入IP')
        return false
      }
      if (!Rul.ipRangeReg.test(ip_block) && !Rul.cidrREG.test(ip_block)) {
        this.message.warning('IP格式不正确')
        return false
      }
      return true
    },
    addIp(data) {
      if (!this.checkIP(data.ip_block)) return

      let api = '/fd/V4/ads.plan.ip.block.add'
      if (data.id && data.id !== '') {
        api = '/fd/V4/ads.plan.ip.block.edit'
      }
      this.InvokeAllApi.post(api, {
        ...data
      }).then(res => {
        this.Message('ACTION_SUCCESS')
        this.$refs.DmData.initPage()
      }).catch(e => { })
    },
    EditClick(index, val) {
      const list = JSON.parse(JSON.stringify(this.list))
      list.forEach((i, _) => {
        if (_ === index) {
          i.edit = val
        }
      })
      this.list = list
    },
    removeIp(data, type) {
      if (type === 'del') {
        this.list.splice(data, 1)
        return
      }
      const params = {
        id: data.id,
        member_id: data.member_id
      }
      this.InvokeAllApi.post('/fd/V4/ads.plan.ip.block.del', params).then(res => {
        this.Message('ACTION_SUCCESS')
        this.$refs.DmData.initPage()
      }).catch(e => { })
    },
    handleSubmit() {
      this.$refs.Dialog.afterValidate()
      this.$refs.Dialog.handleClose()
      this.$emit('success')
    }
  }
}
</script>
