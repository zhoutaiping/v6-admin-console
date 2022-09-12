<template>
  <console-page-layout>
    <DmToolbar>
      <el-button
        type="primary"
        @click="$refs.DialogRow.handleOpen()"
      >新增</el-button>
      <el-button
        :disabled="!multipleSelection.length"
        @click="hanldeAction('open')"
      >启用</el-button>
      <el-button
        :disabled="!multipleSelection.length"
        @click="hanldeAction('close')"
      >关闭</el-button>
      <el-button
        :disabled="!multipleSelection.length"
        @click="hanldeAction('delete')"
      >删除</el-button>
      <template slot="right">
        <InputSearch
          v-model="bindParams.speed_limit_obj"
          placeholder="限速对象"
          clearable
          @submit="fetchList"
        />
        <el-date-picker
          v-model="bindParams.created_at"
          :default-time="['00:00:00', '23:59:59']"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          format="yyyy-MM-dd HH:mm:ss"
          value-format="yyyy-MM-dd HH:mm:ss"
          @change="handleSearch"
        />
        <yd-form-select :selects="bandwidthLabel.record_type" v-model="bindParams.speed_limit_type" style="width: 140px" default-text="限速类型" @change="fetchList" />
      </template>
    </DmToolbar>
    <DmData
      ref="DmData"
      @init="fetchList"
    >
      <DmTable
        :loading="loading"
        min-height
      >
        <el-table
          :data="list"
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            type="selection"
            width="55"
          />
          <el-table-column
            label="限速类型"
          >
            <template slot-scope="scope">
              {{ scope.row.speed_limit_type | labelView(bandwidthLabel.record_type) }}
            </template>
          </el-table-column>
          <el-table-column label="限速对象">
            <template slot-scope="scope">
              {{ scope.row.speed_limit_obj }}
            </template>
          </el-table-column>
          <el-table-column label="限速大小">
            <template slot-scope="scope">
              {{ scope.row.speed_limit_size }} Mbps
            </template>
          </el-table-column>
          <el-table-column label="状态">
            <template slot-scope="scope">
              <span
                v-if="scope.row.status === 1"
                class="color--success"
              >开启</span>
              <span
                v-else
                class="color--danger"
              >关闭</span>
            </template>
          </el-table-column>
          <el-table-column
            label="备注"
            prop="remark"
          />
          <el-table-column
            label="操作"
            width="130"
          >
            <template slot-scope="scope">
              <el-button
                type="text"
                @click="$refs.DialogRow.handleOpen(scope.row)"
              >编辑</el-button>
              <el-button
                type="text"
                @click="handleDeleteRow(scope.row)"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </DmTable>
    </DmData>
    <DialogRow
      ref="DialogRow"
      @init="fetchList"
    />
  </console-page-layout>
</template>

<script>
import consoleData from '@/mixins/consoleData'
import DialogRow from './components/DialogRow'
import bandwidthMixins from '@/views/platform/resources/bandwidth/mixins/bandwidth'

export default {
  components: { DialogRow },

  mixins: [bandwidthMixins, consoleData],

  data() {
    return {
      API_INDEX: '/fd/V4/bandwidthhost.operate.record',
      bindParams: {
        speed_limit_type: '',
        speed_limit_obj: '',
        parent_id: this.$route.params.id,
        created_at: []
      }
    }
  },

  created() {
    this.bandwidthFeatchConst()
  },

  methods: {
    hanldeAction(type) {
      this.$confirm('确认操作？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const ids = this.multipleSelection.map(_ => _.id)
        const params = { ids, parent_id: this.bindParams.parent_id }
        if (type === 'open' || type === 'close') {
          const STATUS_MAP = {
            open: 1,
            close: 2
          }
          try {
            await this.InvokeAllApi.put('/fd/V4/bandwidthhost.operate.record', {
              status: STATUS_MAP[type],
              ...params
            })
          } catch (e) {
            return
          }
        } else if (type === 'delete') {
          try {
            await this.InvokeAllApi.delete('/fd/V4/bandwidthhost.operate.record', params)
          } catch (e) {
            return
          }
        }
        this.fetchList()
        this.Message('ACTION_SUCCESS')
      }).catch(e => { return true })
    },

    handleDeleteRow(row) {
      this.$confirm('确认操作？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        try {
          await this.InvokeAllApi.delete('/fd/V4/bandwidthhost.operate.record', { ids: [row.id] })
        } catch (e) {
          return
        }
        this.fetchList()
        this.Message('ACTION_SUCCESS')
      }).catch(e => { return true })
    },

    formatParams(params) {
      const [created_at_start, created_at_end] = params.created_at
      delete params.created_at
      return {
        created_at_start,
        created_at_end,
        ...params
      }
    },

    formatResponse(response) {
      const { list = [] } = response
      list.forEach(item => {
        item.speed_limit_type = Number(item.speed_limit_type)
        item.status = Number(item.status)
      })
      return response
    }
  }
}
</script>
