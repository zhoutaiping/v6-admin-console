<template>
  <console-page-layout>
    <DmAlert>
      自定义类型优先级大于系统默认，没有默认时，表示系统默认不限制
    </DmAlert>
    <DmToolbar>
      <yd-form-select :selects="selectType" v-model="type" style="width: 120px" />
      <template v-if="type === 'host'">
        <InputSearch
          v-model="bindParams.speed_limit_obj"
          placeholder="限速对象"
          style="width: 200px"
          clearable
          @submit="handleSearch"
        />
      </template>
      <template v-else>
        <InputMember v-model="bindParams.speed_limit_obj" @change="handleSearch"/>
      </template>
      <yd-form-select :selects="bandwidthLabel.SPEED_LIMIT_TYPE" v-model="bindParams.speed_limit_type" style="width: 150px" default-text="限速维度" @change="handleSearch"/>
      <yd-form-select :selects="bandwidthLabel.RECORD_TYPE" v-model="bindParams.record_type" style="width: 150px" default-text="记录类型" @change="handleSearch"/>
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
    </DmToolbar>
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
    </DmToolbar>
    <DmData
      ref="DmData"
      @init="fetchList"
    >
      <DmTable
        :loading="loading"
        min-height
      >
        <el-table :data="list" @selection-change="handleSelectionChange">
          <el-table-column
            type="selection"
            width="55"
          />
          <el-table-column label="限速名称" prop="speed_limit_name"/>
          <el-table-column label="限速维度">
            <template slot-scope="scope">
              {{ scope.row.speed_limit_type | labelView(bandwidthLabel.SPEED_LIMIT_TYPE) }}
            </template>
          </el-table-column>
          <el-table-column label="限速对象">
            <template slot-scope="scope">
              {{ scope.row.email || scope.row.speed_limit_obj }}
            </template>
          </el-table-column>
          <el-table-column label="类型">
            <template slot-scope="scope">
              {{ scope.row.record_type | labelView(bandwidthLabel.RECORD_TYPE) }}
            </template>
          </el-table-column>
          <el-table-column label="备注" prop="remark"/>
          <el-table-column label="添加/修改时间">
            <template slot-scope="scope">
              {{ scope.row.created_at }}<br >
              {{ scope.row.updated_at }}
            </template>
          </el-table-column>
          <!-- <el-table-column label="操作人" prop="speed_limit_obj"/> -->
          <el-table-column label="状态">
            <template slot-scope="scope">
              <span v-if="scope.row.status === 1" class="color--success">开启</span>
              <span v-else class="color--danger">关闭</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200">
            <template slot-scope="scope">
              <el-button type="text" @click="$refs.DialogRow.handleOpen(scope.row)">编辑</el-button>
              <el-divider direction="vertical"/>
              <template v-if="scope.row.speed_limit_type === bandwidthLabel.SPEED_LIMIT_TYPE_VAR.CUSTOMER">
                <router-link :to="{path: `/bandwidth/customer-rule/${scope.row.id}`, query: {speed_limit_obj: scope.row.speed_limit_obj}}">
                  <el-button type="text" >编辑规则</el-button>
                </router-link>
              </template>
              <template v-else-if="scope.row.speed_limit_type === bandwidthLabel.SPEED_LIMIT_TYPE_VAR.HOST">
                <router-link :to="{path: `/bandwidth/host-rule/${scope.row.id}`, query: {speed_limit_obj: scope.row.speed_limit_obj}}">
                  <el-button type="text" >编辑规则</el-button>
                </router-link>
              </template>
            </template>
          </el-table-column>
        </el-table>
      </DmTable>
    </DmData>
    <DialogRow ref="DialogRow" @init="fetchList"/>
  </console-page-layout>
</template>

<script>
import consoleData from '@/mixins/consoleData'
import DialogRow from './components/DialogRow'
import bandwidth from '@/views/platform/resources/bandwidth/mixins/bandwidth'
import InputMember from './components/InputMember'

export default {
  components: { DialogRow, InputMember },

  mixins: [bandwidth, consoleData],

  data() {
    return {
      selectType: [
        {
          label: '按主机',
          value: 'host'
        },
        {
          label: '按账号',
          value: 'user'
        }
      ],
      type: 'host',
      API_INDEX: '/fd/V4/bandwidth.operate.record',
      bindParams: {
        created_at: [],
        speed_limit_type: '',
        speed_limit_obj: '',
        record_type: ''
      }
    }
  },

  methods: {
    hanldeAction(type) {
      this.$confirm('确认操作？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const ids = this.multipleSelection.map(_ => _.id)
        const params = { ids }
        if (type === 'open' || type === 'close') {
          const STATUS_MAP = {
            open: 1,
            close: 2
          }
          try {
            await this.InvokeAllApi.put('/fd/V4/bandwidth.operate.record', {
              status: STATUS_MAP[type],
              ids
            })
          } catch (e) {
            return
          }
        } else if (type === 'delete') {
          try {
            await this.InvokeAllApi.delete('/fd/V4/bandwidth.operate.record', params)
          } catch (e) {
            return
          }
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
        item.record_type = Number(item.record_type)
        item.status = Number(item.status)
      })
      return response
    }
  }
}
</script>
