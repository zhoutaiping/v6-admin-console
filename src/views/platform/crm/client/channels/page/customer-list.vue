<template>
  <div>
    <DmData ref="DmData" :auto-init="false" @init="fetchList" >
      <DmTable :loading="loading" min-height >
        <el-table :data="list">
          <el-table-column
            v-for="(item, index) in column"
            :key="index"
            :label="item.label"
            :width="item.width"
          >
            <template slot-scope="scope">
              {{ formartValue(scope.row, item.prop) }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="250">
            <template slot-scope="scope">
              <el-button type="text" @click="$refs.info.handleOpen(scope.row)" >详 情</el-button>
              <el-divider direction="vertical" />
              <el-button type="text" @click="$refs.change.handleOpen(scope.row)">关联关系编辑</el-button>
              <el-divider direction="vertical" />
              <el-button type="text" @click="$refs.remove.handleOpen(scope.row)">解除关联</el-button>
            </template>
          </el-table-column>
        </el-table>
      </DmTable>
    </DmData>
    <Info ref="info" />
    <Remove ref="remove" @init="$refs.DmData.initPage()" />
    <Change ref="change" @init="$refs.DmData.initPage()" />
  </div>
</template>
<script>
import consoleData from '@/mixins/consoleData'
import Info from '../components/customer/info'
import Remove from '../components/customer/remove'
import Change from '../components/customer/change'
import { mapState } from 'vuex'
export default {
  components: {
    Info, Remove, Change
  },
  mixins: [consoleData],
  data() {
    return {
      API_INDEX: '/V4/cbms.cb.channel.end.user.list',
      bindParams: {},
      column: [
        { label: 'ID', prop: 'id' },
        { label: '用户ID', prop: 'end_member_id' },
        { label: '客户实名认证名称', prop: 'certification_name' },
        { label: '关联类型', prop: 'relation_mode' },
        { label: '终端邮箱', prop: 'end_member_email' },
        { label: '渠道邮箱', prop: 'channel_member_email' },
        { label: '所属销售', prop: 'sales' },
        { label: '关联来源', prop: 'relation_source' },
        { label: '关联时间', prop: 'created_at' },
        { label: '关联到期时间', prop: 'relation_expire_time' },
        { label: '备注', prop: 'remark' }
      ],
      option: {
        relation_mode: [
          { label: '代理', value: '1' },
          { label: '代销', value: '2' }
        ]
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
        if (this.cbmsMap.relation_mode && Object.keys(this.cbmsMap.relation_mode).length) {
          this.option.relation_mode = Object.keys(this.cbmsMap.relation_mode).map(i => { return { label: this.cbmsMap.relation_mode[i], value: i } })
        }
      }
    }
  },
  methods: {
    init(bindParams = {}) {
      this.bindParams = { ...bindParams }
      this.$refs.DmData.initPage()
    },
    formartValue(data, prop) {
      const val = data[prop]
      if (prop === 'relation_mode') {
        return this.option.relation_mode.find(i => { return Number(i.value) === Number(val) }) ? this.option.relation_mode.find(i => { return Number(i.value) === Number(val) }).label : ''
      } else if (prop === 'relation_source') {
        return this.cbmsMap.relation_source[val]
      }
      return val
    }
  }
}
</script>
