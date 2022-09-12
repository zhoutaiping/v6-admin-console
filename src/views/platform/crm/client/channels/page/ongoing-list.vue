<template>
  <div>
    <DmData
      ref="DmData"
      :auto-init="false"
      @init="fetchList">
      <DmTable
        :loading="loading"
        min-height>
        <el-table :data="list">
          <el-table-column
            v-for="(item, index) in column"
            :key="index"
            :label="item.label"
            :width="item.width">
            <template slot-scope="scope">
              {{ formartValue(scope.row, item.prop) }}
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            width="200">
            <template slot-scope="scope">
              <el-button
                type="text"
                @click="$refs.info.handleOpen(scope.row)">详 情</el-button>
              <el-divider direction="vertical" />
              <el-button
                type="text"
                @click="$refs.edit.handleOpen(scope.row)">编 辑</el-button>
              <el-divider direction="vertical" />
              <el-button
                type="text"
                @click="$refs.relieve.handleOpen(scope.row)">解除渠道</el-button>
            </template>
          </el-table-column>
        </el-table>
      </DmTable>
    </DmData>
    <Info ref="info" />
    <Edit
      ref="edit"
      @init="$refs.DmData.initPage()" />
    <Relieve
      ref="relieve"
      @init="$refs.DmData.initPage()" />
  </div>
</template>
<script>
import consoleData from '@/mixins/consoleData'
import Info from '../components/channels/info'
import Edit from '../components/channels/edit'
import Relieve from '../components/channels/relieve'
import { mapState } from 'vuex'
export default {
  components: { Info, Edit, Relieve },
  mixins: [consoleData],
  data() {
    return {
      API_INDEX: '/V4/cbms.cb.channel.list',
      bindParams: {
        cop_status: '1'
      },
      column: [
        { label: 'ID', prop: 'id' },
        { label: '用户ID', prop: 'member_id' },
        { label: '客户实名认证名称', prop: 'certification_name' },
        { label: '渠道类型', prop: 'type' },
        { label: '注册邮箱', prop: 'email' },
        { label: '所属销售', prop: 'sales' },
        { label: '合作状态', prop: 'cop_status' },
        { label: '到期时间', prop: 'expire_time' }
      ],
      option: {
        type: [
          { label: '经销渠道', value: '1' },
          { label: '非正式签约渠道', value: '2' }
        ],
        cop_status: [
          { label: '合作中', value: '1' },
          { label: '已解除', value: '2' }
        ],
        findValue(list, val) {
          if (list.find(i => Number(i.value) === Number(val))) {
            return list.find(i => Number(i.value) === Number(val)).label
          }
          return val
        }

      }
    }
  },
  computed: {
    ...mapState({
      cbmsMap: (state) => state.finance.cbms_map
    })
  },
  watch: {
    cbmsMap: {
      handler(val) {
        if (this.cbmsMap.cop_status && Object.keys(this.cbmsMap.cop_status).length) {
          this.option.cop_status = Object.keys(this.cbmsMap.cop_status).map(i => { return { label: this.cbmsMap.cop_status[i], value: i } })
        }
        if (this.cbmsMap.channel_type && Object.keys(this.cbmsMap.channel_type).length) {
          this.option.type = Object.keys(this.cbmsMap.channel_type).map(i => { return { label: this.cbmsMap.channel_type[i], value: i } })
        }
      }
    }
  },
  methods: {
    init(bindParams = {}) {
      this.bindParams = { cop_status: '1', ...bindParams }
      this.$refs.DmData.initPage()
    },

    formartValue(data, prop) {
      const val = data[prop]
      if (prop === 'cop_status') {
        return this.option.findValue(this.option.cop_status, val)
      } else if (prop === 'type') {
        return this.option.findValue(this.option.type, val)
      }
      return val
    }
  }
}
</script>
