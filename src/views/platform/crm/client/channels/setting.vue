<template>
  <console-page-layout>
    <p>
      <el-button
        type="primary"
        @click="e =>{ $refs.addedit.handleOpen({}, 'Create') }"
      >新增</el-button>
      <el-button
        type="primary"
        @click="e =>{ $refs.DmData.initPage() }"
      >刷新</el-button>
      <el-button
        v-show="false"
        :disabled="!select.length"
        type="primary"
        @click="settingDel()"
      >删除</el-button>
    </p>
    <DmData ref="DmData" @init="fetchList" >
      <DmTable :loading="loading" min-height >
        <el-table :data="list" @selection-change="e => { select = e }" >
          <!-- <el-table-column type="selection" width="55px" /> -->
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
          <el-table-column label="操作">
            <template slot-scope="{ row }">
              <el-button
                type="text"
                @click="e =>{ $refs.info.handleOpen(row) }"
              >详情</el-button>
              <el-divider direction="vertical" />
              <el-button
                type="text"
                @click="e =>{ $refs.addedit.handleOpen(row, 'Edit') }"
              >编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
      </DmTable>
    </DmData>
    <InFo ref="info" />
    <AddEdit ref="addedit" @init="$refs.DmData.initPage()" />
  </console-page-layout>
</template>

<script>
import consoleData from '@/mixins/consoleData'
import InFo from './components/settting/info'
import AddEdit from './components/settting/add-edit'
export default {
  components: { InFo, AddEdit },
  mixins: [consoleData],
  data() {
    return {
      API_INDEX: '/V4/cbms.cb.channel.setting.list',
      bindParams: {},
      select: [],
      column: [
        { label: 'ID', prop: 'id' },
        { label: '渠道类别', prop: 'channel_name' },
        { label: '渠道有效期', prop: 'channel_expire_time' },
        { label: '未成交解除关联', prop: 'relieve_expire_time' },
        { label: '支持关联类型', prop: 'support_type' },
        { label: '实名认证类型要求', prop: 'auth_type' }
      ],
      options: {
        channel_expire_time: { nolimit: '不限制', appoint: '指定' },
        relieve_expire_time: { nolimit: '不限制', appoint: '指定' },
        support_type: { agent: '代理', sell: '代销' },
        auth_type: { personal: '个人 ', enterprise: '企业 ', government: '政府 ' },
        time_type: { day: '天 ', month: '月', year: '年' }
      }
    }
  },
  methods: {
    formartValue(data, prop) {
      let val = data[prop]
      function typeVal(key, val_, maps) {
        let _val = []
        if (val_ && val_.length) {
          _val = val_.map(i => { return maps[key][i] })
        }
        return _val.join(',')
      }
      switch (prop) {
        case 'auth_type':
          val = typeVal('auth_type', val, this.options)
          break
        case 'support_type':
          val = typeVal('support_type', val, this.options)
          break
        case 'channel_expire_time':
          if (val === 'appoint') {
            val = data.channel_time_num + this.options.time_type[data.channel_time_type]
          } else {
            val = this.options[prop][val] || val || ''
          }
          break
        case 'relieve_expire_time':
          if (val === 'appoint') {
            val = data.relieve_time_num + this.options.time_type[data.relieve_time_type]
          } else {
            val = this.options[prop][val] || val || ''
          }
          break
      }
      return val
    },

    async settingDel() {
      const params = {
        ids: this.select.map(i => i.id)
      }

      try {
        await this.Fetch.delete('/V4/cbms.cb.channel.setting.del', params)
        await this.$refs.DmData.initPage()
        this.Message('ACTION_SUCCESS')
      } catch (error) {
        return error
      }
    }
  }
}
</script>
