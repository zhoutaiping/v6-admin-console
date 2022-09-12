<template>
  <DmDialog
    ref="dmdialog"
    :title="'详情'"
    :footer="false"
    width="700px"
    aside
  >
    <div>
      <el-tabs v-model="activeName" type="border-card" >
        <el-tab-pane label="渠道详情" name="channel">
          <el-form :model="channel" label-width="140px" label-position="left">
            <el-form-item label="注册邮箱">{{ formartVal(rowData,'email') }}</el-form-item>
            <el-form-item label="客户认证名称">{{ formartVal(rowData,'certification_name') }}</el-form-item>
            <el-form-item label="渠道类型">{{ formartVal(channel,'type') }}</el-form-item>
            <el-form-item label="渠道有效期" >
              <DmSelect
                v-model="setting.channel_expire_time"
                :selects="option.channel_expire_time"
                placeholder=" "
                style="width:120px"
              />
              <template v-if="setting.channel_expire_time === 'appoint'">
                <el-input-number v-model="setting.channel_time_num" :min="0" style="width:150px"/>
                <DmSelect
                  v-model="setting.channel_time_type"
                  :selects="option.channel_time_type"
                  placeholder="单位"
                  style="width:120px"
                />
              </template>
            </el-form-item>
            <el-form-item label="未成交解除关联">
              <DmSelect
                v-model="setting.relieve_expire_time"
                :selects="option.relieve_expire_time"
                placeholder=" "
                style="width:120px"
              />
              <template v-if="setting.relieve_expire_time === 'appoint'">
                <el-input-number v-model="setting.relieve_time_num" :min="0" style="width:150px"/>
                <DmSelect
                  v-model="setting.relieve_time_type"
                  :selects="option.relieve_time_type"
                  placeholder="单位"
                  style="width:120px"
                />
              </template>
            </el-form-item>
            <el-form-item label="支持关联类型">
              <el-checkbox-group v-model="setting.support_type">
                <el-checkbox v-for="i in option.support_type" :key="i.value" :label="i.value">{{ i.label }}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="默认关联类型" >
              <el-radio-group v-model="setting.default_type">
                <el-radio v-for="i in option.default_type" :key="i.value" :label="i.value">{{ i.label }}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="备注">{{ channel.remark }}</el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="操作日志" name="hostory">
          <DmTable min-height>
            <el-table :data="history">
              <el-table-column type="expand">
                <template slot-scope="{row}">
                  操作前配置：
                  <DmAlert>
                    <el-form
                      v-show="row.setting_before"
                      label-position="left"
                      inline
                      class="demo-table-expand"
                    >
                      <el-form-item label="渠道有效期">
                        <span>{{ formartValue(row.setting_before, 'channel_expire_time') }}</span>
                      </el-form-item>
                      <el-form-item label="未成交解除关联">
                        <span>{{ formartValue(row.setting_before, 'relieve_expire_time') }}</span>
                      </el-form-item>
                      <el-form-item label="支持关联类型">
                        <span>{{ formartValue(row.setting_before, 'support_type') }}</span>
                      </el-form-item>
                      <el-form-item label="默认关联类型">
                        <span>{{ formartValue(row.setting_before, 'default_type') }}</span>
                      </el-form-item>
                    </el-form>
                    <span v-show="!row.setting_before">暂无配置</span>
                  </DmAlert>
                  操作后配置：
                  <DmAlert>
                    <el-form
                      v-show="row.setting_after"
                      label-position="left"
                      inline
                      class="demo-table-expand"
                    >
                      <el-form-item label="渠道有效期">
                        <span>{{ formartValue(row.setting_after, 'channel_expire_time') }}</span>
                      </el-form-item>
                      <el-form-item label="未成交解除关联">
                        <span>{{ formartValue(row.setting_after, 'relieve_expire_time') }}</span>
                      </el-form-item>
                      <el-form-item label="支持关联类型">
                        <span>{{ formartValue(row.setting_after, 'support_type') }}</span>
                      </el-form-item>
                      <el-form-item label="默认关联类型">
                        <span>{{ formartValue(row.setting_after, 'default_type') }}</span>
                      </el-form-item>
                    </el-form>
                    <span v-show="!row.setting_after">暂无配置</span>
                  </DmAlert>
                </template>
              </el-table-column>
              <el-table-column v-for="tab in column" :key="tab.prop" :label="tab.label">
                <template slot-scope="scope">
                  {{ formartVal(scope.row, tab.prop) }}
                </template>
              </el-table-column>
            </el-table>
          </DmTable>
        </el-tab-pane>
      </el-tabs>

    </div>
  </DmDialog>
</template>
<script>
import defaultSetting from '@/core/defaultSetting'
import { mapState } from 'vuex'
export default {
  data() {
    return {
      activeName: 'channel',
      rowData: {},
      channel: {},
      history: [],
      setting: {
        support_type: []
      },
      column: [
        { label: 'ID', prop: 'id' },
        { label: '操作类型', prop: 'op_type' },
        { label: '操作后渠道类别', prop: 'type' },
        { label: '操作时间', prop: 'updated_at' },
        { label: '备注', prop: 'remark' }
      ],
      option: {
        ...defaultSetting.channel_setting,
        type: [
          { label: '经销渠道', value: '1' },
          { label: '非正式签约渠道', value: '2' }
        ],
        op_type: [
          { label: '新增', value: '1' },
          { label: '解除', value: '2' },
          { label: '续期', value: '3' }
        ],
        cop_status: [
          { label: '合作中', value: '1' },
          { label: '已解除', value: '2' }
        ]
      }
    }
  },
  computed: {
    ...mapState({
      channel_type: state => state.finance.channel_type,
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
        if (this.cbmsMap.op_type_cb_channel_history && Object.keys(this.cbmsMap.op_type_cb_channel_history).length) {
          this.option.op_type = Object.keys(this.cbmsMap.op_type_cb_channel_history).map(i => { return { label: this.cbmsMap.op_type_cb_channel_history[i], value: i } })
        }
      }
    }
  },
  methods: {
    handleOpen(data) {
      this.rowData = Object.assign({}, data)
      this.loading = true
      this.$nextTick(() => {
        this.$refs.dmdialog.handleOpen()
        this.detail({ id: data.id })
      })
    },

    async detail(params) {
      try {
        const data = await this.Fetch.get('/V4/cbms.cb.channel.detail', params)
        this.channel = Object.assign({}, data.channel)
        this.setting = Object.assign({}, data.setting)
        this.history = data.history || []
      } catch (error) {
        this.channel = {}
        this.history = []
        return
      }
    },

    formartVal(data = {}, prop = '') {
      let val = data[prop]
      if (prop === 'cop_status') {
        val = this.option.cop_status.find(i => { return i.value === val }) ? this.option.cop_status.find(i => { return i.value === val }).label : ''
      } else if (prop === 'type') {
        val = this.channel_type.find(i => { return i.value === val }) ? this.channel_type.find(i => { return i.value === val }).label : ''
      } else if (prop === 'op_type') {
        val = this.option.op_type.find(i => { return i.value === val }) ? this.option.op_type.find(i => { return i.value === val }).label : ''
      }
      return val
    },

    formartValue(data, prop) {
      const data_ = data ? JSON.parse(data) : {}
      let val = data ? JSON.parse(data) : {}
      val = val[prop]
      if (Object.keys(data_).length === 0) {
        return ''
      }
      function typeVal(key, val_, maps) {
        let _val = []
        if (val_ && val_.length) {
          const map_key = maps[key]
          _val = val_.map(i => {
            return map_key.find(f => f.value === i) ? map_key.find(f => f.value === i).label : i
          })
        }
        return _val.join(',')
      }
      switch (prop) {
        case 'default_type':
          val = this.option[prop].find(i => i.value === val).label || val || ''
          break
        case 'support_type':
          val = typeVal('support_type', val, this.option)
          break
        case 'channel_expire_time':
          if (val === 'appoint') {
            val = data_.channel_time_num + this.option.time_type[data_.channel_time_type] || ''
          } else {
            val = this.option[prop].find(i => i.value === val).label || val || ''
          }
          break
        case 'relieve_expire_time':
          if (val === 'appoint') {
            val = data_.relieve_time_num + this.option.time_type[data_.relieve_time_type]
          } else {
            val = this.option[prop].find(i => i.value === val).label || val || ''
          }
          break
      }
      return val
    }
  }
}
</script>
