<style lang="scss" scoped>
.input-box {
  width: 200px;
}
.mr-box {
  margin-right: 10px;
}
</style>
<template>
  <DmDialog
    ref="dialog"
    :fetch-submit="fetchSubmit"
    :title="'人工确认'"
    :footer="false"
    width="850px"
    @close="$emit('init')"
  >
    <DmScroll>
      <el-form
        label-position="left"
        label-width="120px">
        <DmCardPanel title="用户基本信息">
          <el-form-item label="用户邮箱" class="item-box">{{ rowData.member_email }}</el-form-item>
        </DmCardPanel>
        <DmCardPanel title="确认同人信息">
          <p>
            <el-button type="primary" @click="saveRow">新 增</el-button>
            <a-popconfirm
              title="是否批量删除数据?"
              ok-text="是"
              cancel-text="否"
              @confirm="Del"
            >
              <el-button :disabled="select.length === 0">删 除</el-button>
            </a-popconfirm>
            <el-button @click="$refs.DmData.initPage()">刷 新</el-button>
          </p>
          <DmData ref="DmData" :auto-init="false" @init="fetchList">
            <DmTable
              :loading="loading"
              min-height
              add-button
              @click-add-button="saveRow">
              <el-table :data="detail_list" @selection-change="e =>{ select = e }">
                <el-table-column :selectable="selectable" type="selection" width="44" />
                <el-table-column
                  label="疑似同人邮箱"
                  width="260">
                  <template slot-scope="{ row }">
                    <template v-if="!row.edit || row.add === false">
                      {{ row.member_email }}
                    </template>
                    <el-autocomplete
                      v-show="row.add === true"
                      v-model="row.member_email"
                      :fetch-suggestions="query"
                      :debounce="500"
                      placeholder=""
                      clearable
                      class="input-box"
                      @select="e =>{ check(e, row) }"
                      @change="e =>{ change(e, row) }" />
                  </template>
                </el-table-column>
                <el-table-column
                  label="实名认证名称"
                  prop="certification_name"
                  width="120" />
                <el-table-column
                  label="匹配维度"
                  prop="risk_dimension" />
                <el-table-column
                  label="同人确认"
                  width="100">
                  <template slot-scope="{ row }">
                    <el-select
                      v-show="row.add === false"
                      v-model="row.fellow_status"
                      :disabled="!row.edit"
                      style="width:90px;">
                      <el-option value="1" label="确认" />
                      <el-option value="0" label="未确认" />
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="120">
                  <template slot-scope="scope">
                    <el-button v-show="!scope.row.edit" type="text" @click="scope.row.edit = true">编辑</el-button>
                    <div v-show="scope.row.edit">
                      <el-button type="text" @click="changeRow(scope.row, scope.$index)">取消</el-button>
                      <el-divider direction="vertical" />
                      <el-button v-show="scope.row.add === false" :disabled="!scope.row.member_id" type="text" @click="confirm_cancel(scope.row)">确定</el-button>
                      <el-button v-show="scope.row.add === true" :disabled="!scope.row.member_id" type="text" @click="add(scope.row)">保存</el-button>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
            </DmTable>
          </DmData>
        </DmCardPanel>
      </el-form>
      <DmAlert>
        说明：<br>
        疑似同人邮箱-指的是通过系统检测，与指定用户邮箱在某项或某几项维度上一致的用户；<br>
        选择确认操作，代表确认该疑似用户与指定用户为同一用户。<br>
      </DmAlert>
    </DmScroll>
  </DmDialog>
</template>
<script>
import defaultSetting from '@/core/defaultSetting'
import { deepClone } from '@/utils'
import consoleData from '@/mixins/consoleData'
export default {
  mixins: [consoleData],
  data() {
    return {
      API_INDEX: '/fd/V4/risk.customer.detail',
      bindParams: {},
      rowData: {},
      detail_list: [],
      select: [],
      option: {
        arrkey: (Arr, key) => {
          return Arr.map(i => i[key])
        }
      }
    }
  },
  computed: {
    detail() {
      return this.resData.list
    }
  },
  watch: {
    resData: {
      handler(val) {
        this.detail_list = deepClone(this.resData.list).map(i => { return { ...i, edit: false, add: false } })
      },
      deep: true
    }
  },
  methods: {
    handleOpen(data, option) {
      this.bindParams = { id: data.id }
      this.$nextTick(() => {
        this.$refs.dialog.handleOpen()
        this.rowData = Object.assign({}, data)
        setTimeout(() => {
          this.$refs.DmData && this.$refs.DmData.initPage()
        }, 100)
      })
    },
    is_add(row) {
      return row.add
    },
    selectable(row, index) {
      return Number(row.artificial) === 1
    },
    saveRow() {
      this.detail_list.unshift({ member_id: '', member_email: '', edit: true, add: true })
    },
    changeRow(row, index) {
      if (row.add === true) {
        this.detail_list.splice(index, 1)
      } else {
        row.edit = false
      }
    },
    async Del() {
      const data = {
        member_id: this.rowData.member_id,
        del: this.option.arrkey(this.select, 'member_id')
      }
      try {
        await this.Fetch.post('/fd/V4/risk.customer.del', data)
        this.Message('ACTION_SUCCESS')
        this.$refs.DmData.initPage()
      } catch (error) {
        this.$refs.DmData.initPage()
      }
    },
    async confirm_cancel(row) {
      try {
        const data = {
          member_id: this.rowData.member_id
        }
        let api = ''
        if (Number(row.fellow_status) === 1) {
          data['confirm'] = [row.member_id]
          api = '/fd/V4/risk.customer.confirm'
        } else {
          data['cancel'] = [row.member_id]
          api = '/fd/V4/risk.customer.cancel'
        }
        await this.Fetch.post(api, data)
        this.Message('ACTION_SUCCESS')
        this.$refs.DmData.initPage()
      } catch (error) {
        this.$refs.DmData.initPage()
      }
    },
    async add(row) {
      if (!row.member_id) return
      const data = {
        member_id: this.rowData.member_id,
        add: [row.member_id]
      }
      try {
        await this.Fetch.post('/fd/V4/risk.customer.add', data)
        this.Message('ACTION_SUCCESS')
        this.$refs.DmData.initPage()
      } catch (error) {
        this.$refs.DmData.initPage()
      }
    },
    query(val, cb, type) {
      let data = []
      if (val !== '') {
        const params = { member_email: val }
        this.Fetch.get('/fd/V4/risk.customer.riskmembers', params).then(res => {
          data = defaultSetting.riskmembers(res.member_list || [])
          if (data.length === 0) this.message.warning('未找到报备用户!')
          cb(data)
        }).catch(e => {
          cb(data)
        })
      }
    },
    check(e, row) {
      if (e) {
        row.member_id = e.member_id
      } else {
        row.member_id = ''
      }
    },
    change(e, row) {
      if (!e) {
        row.member_id = ''
      }
    }
  }
}
</script>
