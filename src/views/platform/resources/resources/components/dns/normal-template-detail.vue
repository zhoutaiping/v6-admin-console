<template>
  <ConsolePageLayout>
    <DmTabs
      ref="active"
      :desc="$route.params.id"
      :back="back"
      layout="back"
    />
    <DmToolbar>
      <el-button
        type="primary"
        @click="$refs.DialogTemplateNormalRule.handleOpen()"
      >新增规则</el-button>
      <el-button
        :disabled="!selectionId.length"
        @click="handleAction('start')"
      >启用</el-button>
      <el-button
        :disabled="!selectionId.length"
        @click="handleAction('stop')"
      >禁用</el-button>
      <el-button
        :disabled="!selectionId.length"
        @click="handleAction('delete')"
      >删除</el-button>
      <!-- <el-button
        :disabled="RowUse === 1"
        type="primary"
        @click="handleRowUse"
      >应用模板</el-button> -->
      <div slot="right">
        <DmSelect
          v-model="bindParams.status"
          :selects="selectStatus"
          class="input-box"
          placeholder="状态"
          @change="$refs.DmData.initPage()"
        />
        <el-date-picker
          v-model="time"
          :default-time="['00:00:00', '23:59:59']"
          type="daterange"
          range-separator="-"
          class="time-box"
          value-format="yyyy-MM-dd HH:mm:ss"
          start-placeholder="创建开始日期"
          end-placeholder="结束日期"
          @change="e =>{
            bindParams.start_time = e && e[0] && e[0] || ''
            bindParams.end_time = e && e[1] && e[1] || ''
            $refs.DmData.initPage()
          }"
        />
      </div>
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
          @selection-change="handleRowSelect"
        >
          <el-table-column
            type="selection"
            width="55"
          />
          <el-table-column
            label="规则ID"
            prop="bn"
            min-width="100"
          />
          <el-table-column
            label="匹配条件"
            min-width="350"
          >
            <template slot-scope="scope">
              <ColumnRules :items="scope.row.rules" :region-options="Region"/>
            </template>
          </el-table-column>
          <el-table-column
            label="创建/编辑时间"
            min-width="150"
          >
            <template slot-scope="scope">
              {{ scope.row.created_at }}<br>
              {{ scope.row.updated_at }}
            </template>
          </el-table-column>
          <el-table-column label="状态">
            <template slot-scope="scope">
              <span
                v-if="Number(scope.row.status) === 0"
                class="color--danger"
              >禁用</span>
              <span
                v-else
                class="color--success"
              >启用</span>
            </template>
          </el-table-column>
          <el-table-column
            label="符合要求资源数"
            prop="source"
            min-width="150"
          />
          <el-table-column
            label="最近操作员"
            prop="operator"
            min-width="150"
          />
          <el-table-column
            label="备注"
            prop="remark"
            min-width="100"
          >
            <template slot-scope="scope">
              <PopoverInput
                v-model="scope.row.remark"
                placeholder="备注"
                default-value="-"
                @submit="val =>handleSubmitRemark(val, scope.row)"
              />
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            align="right"
            min-width="150"
          >
            <template slot-scope="scope">
              <el-button
                type="text"
                @click="$refs.DialogTemplateNormalRule.handleOpen(scope.row)"
              >编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
      </DmTable>
    </DmData>
    <DialogTemplateNormalRule ref="DialogTemplateNormalRule" @init="fetchList" />
  </ConsolePageLayout>
</template>

<script>
import consoleData from '@/mixins/consoleData'
import PopoverInput from '@/components/Popover/PopoverInput'
import DialogTemplateNormalRule from './DialogTemplate/DialogTemplateNormalRule'
import ColumnRules from './ColumnRules'
import { mapState } from 'vuex'

export default {
  components: { PopoverInput, DialogTemplateNormalRule, ColumnRules },

  mixins: [consoleData],

  data() {
    return {
      API_INDEX: '/fd/V4/dispatch.template.rule.list.get',
      bindParams: {
        template_id: this.$route.params.id,
        status: '',
        updated_at: '',
        start_time: '',
        end_time: ''
      },
      time: '',
      back: {
        path: '/platform/resources/resources/dns',
        query: {
          active: 'normal'
        }
      },
      selectStatus: [
        { label: '禁用', value: 0 },
        { label: '启用', value: 1 }
      ],
      selectionId: []
    }
  },
  computed: {
    ...mapState({
      Region: state => state.disp.region
    }),
    RowUse() {
      let val = 0
      if (this.list.length) {
        const row = this.list[0]
        val = row.template_data && Number(row.template_data.use_status) || 0
      }
      return val
    }
  },

  methods: {
    // 应用模板
    async handleRowUse(row) {
      const form = {
        use_status: 1,
        id: this.$route.params.id
      }
      try {
        await this.Fetch.put('/fd/V4/dispatch.template.save', form)
      } catch (e) {
        return
      }
      this.Message('ACTION_SUCCESS')
      this.fetchList()
    },

    async handleAction(name) {
      this.$confirm('确认操作?', '提示', {
        type: 'warning'
      }).then(async() => {
        const params = {
          id: this.selectionId
        }

        try {
          if (name === 'start') {
            params.status = 1
            await this.InvokeAllApi.put('/fd/V4/dispatch.template.rule.save', params)
          } else if (name === 'stop') {
            params.status = 0
            await this.InvokeAllApi.put('/fd/V4/dispatch.template.rule.save', params)
          } else if (name === 'delete') {
            await this.InvokeAllApi.delete('/fd/V4/dispatch.template.rule.save', params)
          }
        } catch (e) {
          return
        }
        this.Message('ACTION_SUCCESS')
        this.fetchList()
      }).catch(e => { return true })
    },

    formatResponse(response) {
      const { list = [] } = response
      list.forEach(item => {
        item.status = Number(item.status)
      })
      return response
    },

    handleRowSelect(selection) {
      this.selectionId = selection.map(_ => _.id)
    },

    async handleSubmitRemark(remark, row) {
      const data = {
        remark,
        id: row.id,
        rules: row.rules
      }

      try {
        await this.Fetch.put(`/fd/V4/dispatch.template.rule.save`, data)
      } catch (e) {
        return
      }
      this.Message('ACTION_SUCCESS')
      this.fetchList()
    }
  }
}
</script>
<style lang="scss" scoped>
.input-box {
  width: 160px;
  margin: 0 0 5px 5px;
}
.time-box {
  width: 340px;
  margin-bottom: 5px;
}
</style>
