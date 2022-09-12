<template>
  <DmDialog
    ref="dmdialog"
    :title="'配置详情'"
    :footer="false"
    width="700px"
    aside
  >
    <el-tabs
      v-model="tab"
      type="card"
    >
      <el-tab-pane
        :name="'setting'"
        label="渠道配置"
      />
      <el-tab-pane
        :name="'log'"
        label="操作记录"
      />
    </el-tabs>
    <div v-show="tab === 'setting'">
      <el-form
        :model="form"
        label-position="left"
        label-width="140px"
      >
        <DmCardPanel title="渠道配置信息">
          <el-form-item
            label="渠道类别"
            prop="channel_name"
          >
            <el-input
              v-model="form.channel_name"
              readonly
              class="input-box"
            />
          </el-form-item>
          <el-form-item
            label="渠道有效期"
            prop="channel_expire_time"
          >
            <DmSelect
              v-model="form.channel_expire_time"
              :selects="option.channel_expire_time"
              disabled
              placeholder="时长"
              style="width:120px"
              @change="e => {
                form.channel_time_num = 0
                form.channel_time_type = 'day'
              }"
            />
            <template v-if="form.channel_expire_time === 'appoint'">
              <el-input-number
                v-model="form.channel_time_num"
                :min="0"
                disabled
                style="width:150px"
              />
              <DmSelect
                v-model="form.channel_time_type"
                :selects="option.channel_time_type"
                disabled
                placeholder="单位"
                style="width:120px"
              />
            </template>
          </el-form-item>
          <el-form-item
            label="实名认证类型要求"
            prop="auth_type"
          >
            <el-checkbox-group v-model="form.auth_type">
              <el-checkbox
                v-for="i in option.auth_type"
                :key="i.value"
                :label="i.value"
                disabled
              >{{ i.label }}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </DmCardPanel>
        <DmCardPanel title="渠道终端关联配置">
          <el-form-item
            label="未成交解除关联"
            prop="relieve_expire_time"
          >
            <DmSelect
              v-model="form.relieve_expire_time"
              :selects="option.relieve_expire_time"
              placeholder=" "
              disabled
              style="width:120px"
              @change="e => {
                form.relieve_time_num = 0
                form.relieve_time_type = 'day'
              }"
            />
            <template v-if="form.relieve_expire_time === 'appoint'">
              <el-input-number
                v-model="form.relieve_time_num"
                :min="0"
                disabled
                style="width:150px"
              />
              <DmSelect
                v-model="form.relieve_time_type"
                :selects="option.relieve_time_type"
                disabled
                placeholder="单位"
                style="width:120px"
              />
            </template>
          </el-form-item>
          <el-form-item
            label="支持关联类型"
            prop="support_type"
          >
            <el-checkbox-group v-model="form.support_type">
              <el-checkbox
                v-for="i in option.support_type"
                :key="i.value"
                :label="i.value"
                disabled
              >{{ i.label }}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item
            label="默认关联类型"
            prop="default_type"
          >
            <el-radio-group v-model="form.default_type">
              <el-radio
                v-for="i in option.default_type"
                :key="i.value"
                :label="i.value"
                disabled
              >{{ i.label }}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item
            label="备注"
            prop="remark"
          >
            <el-input
              v-model="form.remark"
              placeholder=""
              readonly
              type="textarea"
              class="input-box"
            />
          </el-form-item>
        </DmCardPanel>
      </el-form>
    </div>
    <div v-show="tab === 'log'">
      <DmData
        ref="DmData"
        :auto-init="false"
        @init="fetchList"
      >
        <DmTable
          :loading="loading"
          min-height
        >
          <el-table :data="list">
            <el-table-column type="expand">
              <template slot-scope="{row}">
                操作前配置：
                <DmAlert>
                  <el-form
                    v-show="row.edit_before"
                    label-position="left"
                    inline
                    class="demo-table-expand"
                  >
                    <el-form-item label="渠道类别">
                      <span>{{ formartValue(row.edit_before, 'channel_name') }}</span>
                    </el-form-item>
                    <el-form-item label="渠道有效期">
                      <span>{{ formartValue(row.edit_before, 'channel_expire_time') }}</span>
                    </el-form-item>
                    <el-form-item label="未成交解除关联">
                      <span>{{ formartValue(row.edit_before, 'relieve_expire_time') }}</span>
                    </el-form-item>
                    <el-form-item label="支持关联类型">
                      <span>{{ formartValue(row.edit_before, 'support_type') }}</span>
                    </el-form-item>
                    <el-form-item label="实名认证类型要求">
                      <span>{{ formartValue(row.edit_before, 'auth_type') }}</span>
                    </el-form-item>
                  </el-form>
                  <span v-show="!row.edit_before">暂无</span>
                </DmAlert>
                操作后配置：
                <DmAlert>
                  <el-form
                    v-show="row.edit_after"
                    label-position="left"
                    inline
                    class="demo-table-expand"
                  >
                    <el-form-item label="渠道类别">
                      <span>{{ formartValue(row.edit_after, 'channel_name') }}</span>
                    </el-form-item>
                    <el-form-item label="渠道有效期">
                      <span>{{ formartValue(row.edit_after, 'channel_expire_time') }}</span>
                    </el-form-item>
                    <el-form-item label="未成交解除关联">
                      <span>{{ formartValue(row.edit_after, 'relieve_expire_time') }}</span>
                    </el-form-item>
                    <el-form-item label="支持关联类型">
                      <span>{{ formartValue(row.edit_after, 'support_type') }}</span>
                    </el-form-item>
                    <el-form-item label="实名认证类型要求">
                      <span>{{ formartValue(row.edit_after, 'auth_type') }}</span>
                    </el-form-item>
                  </el-form>
                  <span v-show="!row.edit_after">暂无</span>
                </DmAlert>
              </template>
            </el-table-column>
            <el-table-column
              label="记录ID"
              prop="id"
            />
            <el-table-column
              label="配置ID"
              prop="channel_setting_id"
            />
            <el-table-column
              label="操作时间"
              prop="created_at"
            />
          </el-table>
        </DmTable>
      </DmData>
    </div>
  </DmDialog>
</template>

<script>
import consoleData from '@/mixins/consoleData'
import defaultSetting from '@/core/defaultSetting'
export default {
  mixins: [consoleData],
  data() {
    return {
      loading: false,
      form: {},
      API_INDEX: '/V4/cbms.cb.channel.setting.history.list',
      bindParams: { channel_setting_id: '' },
      option: {
        ...defaultSetting.channel_setting
      },
      tab: 'setting',
      rowData: {}
    }
  },
  methods: {
    handleOpen(data, option) {
      this.loading = true
      this.$nextTick(() => {
        this.$refs.dmdialog.handleOpen()
        this.tab = 'setting'
        this.rowData = Object.assign({}, data)
        this.form = Object.assign({}, data)
        this.bindParams = { channel_setting_id: data.id }
        setTimeout(() => {
          this.$refs.DmData && this.$refs.DmData.initPage()
        }, 0)
      })
    },

    formartValue(data, prop) {
      let val = data[prop]
      if (!val) {
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
        case 'auth_type':
          val = typeVal('auth_type', val, this.option)
          break
        case 'support_type':
          val = typeVal('support_type', val, this.option)
          break
        case 'channel_expire_time':
          if (val === 'appoint') {
            val = data.channel_time_num + this.option.time_type[data.channel_time_type]
          } else {
            val = this.option[prop].find(i => i.value === val).label || val || ''
          }
          break
        case 'relieve_expire_time':
          if (val === 'appoint') {
            val = data.relieve_time_num + this.option.time_type[data.relieve_time_type]
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

<style lang="scss" scoped>
.input-box {
  width: 300px;
}
.item-box {
  margin-bottom: 5px;
}
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
</style>
