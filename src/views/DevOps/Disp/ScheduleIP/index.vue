<style lang="postcss" scoped>
.app-center-room-index {
  padding: 10px;
  .search-form-input {
    width: 200px;
    margin: 0 2px;
  }
  .dm-footer {
    float: left !important;
    margin: 10px 0;
  }
  .setting-btn {
    margin: 0 2px 5px;
  }
}
</style>

<template>
  <div class="app-center-room-index">
    <DmToolbar>
      <el-button
        :disabled="selRow.length === 0"
        type="primary"
        class="setting-btn"
        @click="$refs.bindTag.handleOpen(selRow, 'setTag-batch')"
      >批量绑定标签</el-button>
      <el-button
        type="primary"
        class="setting-btn"
        @click="handleBindLine(null,'batch-bindline')"
      >批量绑定线路</el-button>
      <el-button
        type="primary"
        class="setting-btn"
        @click="handleRowClick(null,'group-batch')"
      >批量分组</el-button>
      <el-button
        :disabled="selRow.length === 0"
        type="primary"
        class="setting-btn"
        @click="handleReh(3)"
      >批量启用记录</el-button>
      <el-button
        :disabled="selRow.length === 0"
        type="primary"
        class="setting-btn"
        @click="handleReh(1)"
      >批量暂停记录</el-button>
      <el-button
        :disabled="selRow.length === 0"
        type="primary"
        class="setting-btn"
        @click="handleReh(2)"
      >批量调度</el-button>
      <div slot="right">
        <InputSearch
          v-model="bindParams.tags"
          placeholder="请输入标签多个用,分割"
          class="input-box"
          @submit="$refs.DmData.initPage()"
        />
        <InputSearch
          v-model="bindParams.ip"
          placeholder="请输入节点IP"
          class="input-box"
          @submit="$refs.DmData.initPage()"
        />
        <el-select
          v-model="bindParams.tag_tpl_id"
          clearable
          placeholder="请选择分组"
          class="search-form-input"
          @change="$refs.DmData.initPage()"
        >
          <el-option
            v-for="(tag, index) in GROUP"
            :key="index"
            :label="tag.name"
            :value="tag.id"
          />
        </el-select>
      </div>
    </DmToolbar>
    <DmData
      ref="DmData"
      @init="fetchList"
    >
      <DmTable v-loading="loading">
        <el-table
          ref="receivableList"
          :data="list"
          @selection-change="changeSelRow"
        >
          <el-table-column
            :selectable="selectable"
            label=""
            type="selection"
            width="55px"
            fixed="left"
          />
          <el-table-column
            v-for="(item, key) in defalutColumns"
            :key="key"
            :label="item.label"
            :fixed="item.fixed"
            :width="item.width"
            :show-overflow-tooltip="item.prop !== 'tags' && item.prop !== 'lines'"
          >
            <template slot-scope="scope">
              <div v-if="item.prop === 'status'">
                <el-radio-group
                  v-model="scope.row.status"
                  size="mini"
                  @change="changeTurnStatus(scope.row)"
                >
                  {{ scope.row.status }}
                  <el-radio-button :label="1">启用</el-radio-button>
                  <el-radio-button :label="0">禁用</el-radio-button>
                </el-radio-group>
              </div>
              <div v-else-if="item.prop === 'down'">
                {{ ip_alive[ scope.row.ip_alive ] }}
              </div>
              <div v-else-if="item.prop === 'gid'">
                <el-tag
                  v-show="scope.row.gid && formartValue(scope.row, item.prop)!==''"
                >{{ formartValue(scope.row, item.prop) }}</el-tag>
              </div>
              <div v-else-if="item.prop === 'tags'">
                <div v-if="formartValue(scope.row, item.prop).length">
                  <el-tag
                    v-for="(tag, tag_index) in formartValue(scope.row, item.prop).slice(0, 4)"
                    :key="tag_index"
                    size="mini"
                    style="margin: 2px;"
                  >
                    {{ tag }}
                  </el-tag>
                  <el-button
                    v-if="formartValue(scope.row, item.prop).length > 4"
                    type="text"
                    plain
                    size="mini"
                    icon="el-icon-share"
                    style="margin-left:10px;"
                    @click="handleItem(formartValue(scope.row, item.prop),'')"
                  >更多</el-button>
                </div>
              </div>
              <div v-else-if="item.prop === 'lines'">
                <div v-if="formartValue(scope.row, item.prop).length">
                  <el-tag
                    v-for="(ip, ip_index) in formartValue(scope.row, item.prop).slice(0, 4)"
                    :key="ip_index"
                    size="mini"
                    style="margin: 2px;"
                  >
                    {{ ip }}
                  </el-tag>
                  <el-button
                    v-if="formartValue(scope.row, item.prop).length > 4"
                    type="text"
                    plain
                    size="mini"
                    icon="el-icon-share"
                    style="margin-left:10px;"
                    @click="handleItem(formartValue(scope.row, item.prop),'ip')"
                  >更多</el-button>
                </div>
              </div>
              <div v-else>{{ formartValue(scope.row, item.prop) }}</div>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            align="left"
            fixed="right"
            width="150"
          >
            <template slot-scope="scope">
              <el-dropdown
                size="mini"
                trigger="click"
              >
                <el-button
                  type="primary"
                  size="mini"
                >操作<i class="el-icon-arrow-down el-icon--right" /></el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item>
                    <div @click="$refs.bindTag.handleOpen(scope.row,'edit')">标签管理</div>
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <div @click="handleBindLine(scope.row,'bindline')">线路管理</div>
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <div @click="handleRowClick(scope.row,'group')">分组</div>
                  </el-dropdown-item>
                  <el-dropdown-item v-if="scope.row.gid">
                    <div @click="handleRowClick(scope.row,'clean-group')">清空分组</div>
                  </el-dropdown-item>
                  <el-dropdown-item v-show="Number(scope.row.ip_alive) === 1">
                    <div @click="handleDownRecover(scope.row,'down')">宕机</div>
                  </el-dropdown-item>
                  <el-dropdown-item v-show="Number(scope.row.ip_alive) === 0">
                    <div @click="handleDownRecover(scope.row,'recover')">宕机恢复</div>
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <a-popconfirm
                      title="是否确定删除?"
                      ok-text="确定"
                      cancel-text="取消"
                      @confirm="handleDel(scope.row,'del')"
                    >
                      <div>删除</div>
                    </a-popconfirm>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </el-table-column>
        </el-table>
      </DmTable>
    </DmData>

    <DialogGroupBatch ref="dialogGroupBatch" @handleLoad="$refs.DmData.initPage()" @getGroup="getGroup" />
    <DialogTagLog ref="dialogTagLog" @handleLoad="$refs.DmData.initPage()" />
    <BindLine ref="bindLine" @handleLoad="$refs.DmData.initPage()" />
    <DialogItem ref="dialogItem" @handleLoad="$refs.DmData.initPage()" />
    <bind-tag ref="bindTag" @init="$refs.DmData.initPage()" />
    <el-tooltip
      placement="top"
      content="回到顶部"
    >
      <back-to-top
        :custom-style="myBackToTopStyle"
        :visibility-height="300"
        :back-position="50"
        transition-name="fade"
      />
    </el-tooltip>
  </div>
</template>

<script>
import consoleData from '@/mixins/consoleData'
import Form from './form'
import DialogTagLog from './components/DialogTagLog'
import DialogGroupBatch from './components/DialogGroupBatch'
import BindLine from './components/BindLine'
import DialogItem from './components/DialogItem'
import BindTag from './bind/index'
export default {
  components: { DialogTagLog, DialogGroupBatch, BindLine, DialogItem, BindTag },
  mixins: [consoleData],
  data() {
    return {
      bindParams: { ip: '', tag_tpl_id: '', tags: '' },
      API_INDEX: '/ip/list',
      fetch: this.InvokeDispApi,
      lines: {},
      selRow: [],
      pagination: Form.pagination,
      myBackToTopStyle: Form.myBackToTopStyle,
      REGION: [{ label: '全部分组', value: '' }],
      defalutColumns: Form.COLUMN,
      ip_alive: {
        0: '宕机智能',
        1: '正常智能',
        2: '宕机离线',
        3: '宕机在线',
        4: '正常离线',
        5: '正常在线'
      },
      GROUP: []
    }
  },
  async created() {
    this.getGroup()
  },

  methods: {
    selectable(row) {
      return !!row.ip
    },
    formartValue(row, prop) {
      let row_text = row[prop]
      const tags = row.tags
      const arr = []
      switch (prop) {
        case 'gid':
          row_text = this.GROUP.filter(i => i.id === row.gid)[0] && this.GROUP.filter(i => i.id === row.gid)[0].name || ''
          break
        case 'tags':
          if (tags) {
            const a = []
            if (tags && Object.keys(tags).length) {
              Object.keys(tags).forEach(i => {
                const tag_item = tags[i]
                if (Object.keys(tag_item).length) Object.keys(tag_item).forEach(k => { a.push(tag_item[k]) })
              })
            }
            row_text = a
          }
          row_text = row_text || '--'
          break
        case 'lines':
          if (row_text && Object.keys(row_text).length) {
            Object.keys(row_text).forEach(i => {
              arr.push(row_text[i])
            })
          }
          row_text = arr
          break
        default:
          row_text = row_text || '--'
          break
      }
      return row_text
    },

    changeSelRow(sel) {
      this.selRow = sel
    },

    changeTurnStatus(row) {
      const params = { id: row.id }
      this.InvokeDispApi.get('/ip/turn_status', params).then(res => {
        this.Message('ACTION_SUCCESS')
        this.$refs.DmData.initPage()
      })
    },

    handleTagClear(data, type) {
      const params = {}
      if (type === 'rowclean') {
        params.ips = [data.ip]
      } else {
        if (!this.selRow.length) {
          this.message.warning('请选择数据!')
          return
        }
        params.ips = []
        this.selRow.forEach(i => {
          params.ips.push(i.ip)
        })
      }
      this.InvokeDispApi.post('/ip/tag/clear', params).then(res => {
        this.Message('ACTION_SUCCESS')
        this.$refs.DmData.initPage()
      })
    },

    handleDel(data) {
      const params = { ips: [data.ip] }
      this.InvokeDispApi.post('/ip/delete', params).then(res => {
        this.Message('ACTION_SUCCESS')
        this.$refs.DmData.initPage()
      })
    },
    async handleReh(type) {
      const params = {
        ips: ''
      }
      const ips = this.selRow.map(i => {
        return i.ip
      })
      params.ips = ips.join(',')
      try {
        if (Number(type) === 1) {
          params.action = 'stop'
          await this.InvokeDispApi.get('/ip/batch_record', params)
          this.$refs.DmData.initPage()
        } else if (Number(type) === 3) {
          params.action = 'open'
          await this.InvokeDispApi.get('/ip/batch_record', params)
          this.$refs.DmData.initPage()
        } else {
          await this.InvokeDispApi.get('/ip/redisp', params)
          this.$refs.DmData.initPage()
        }
        this.Message('ACTION_SUCCESS')
      } catch (error) {
        return
      }
    },
    handleBindLine(row, type) {
      if (type === 'bindline') {
        const data = JSON.parse(JSON.stringify(row)) || {}
        if (this.$refs.bindLine) this.$refs.bindLine.handleOpen(data, type)
      } else {
        if (!this.selRow.length) {
          this.message.warning('请选择数据!')
          return
        }
        const sel = this.selRow
        if (this.$refs.bindLine) this.$refs.bindLine.handleOpen(sel, 'batch-bindline')
      }
    },

    handleItem(data, type) {
      if (this.$refs.dialogItem) this.$refs.dialogItem.handleOpen(data, type)
    },

    handleRowClick(row, type) {
      const data = JSON.parse(JSON.stringify(row)) || {}
      if (!data.id && !this.selRow.length) {
        this.message.warning('请选择数据!')
        return
      }
      const ips = []
      switch (type) {
        case 'group-batch':
          this.$refs.dialogGroupBatch.handleOpen(this.selRow, 'group-batch')
          break
        case 'group':
          this.$refs.dialogGroupBatch.handleOpen(data, 'group')
          break
        case 'log':
          this.$refs.dialogTagLog.handleOpen(data, 'log')
          break
        case 'clean-batch':
          this.selRow.forEach(i => { ips.push(i.ip) })
          this.cleanBind({ ips: ips })
          break
        case 'clean-group':
          this.cleanGroup({ ips: [data.ip] })
          break
      }
    },

    handleCleanGroup() {
      if (!this.selRow.length) {
        this.message.warning('请选择数据!')
        return
      }
      const ips = this.selRow.map(i => { return i.ip })
      this.cleanGroup({ ips: ips })
    },

    cleanGroup(params) {
      this.InvokeDispApi.post('/ip/group/unbind', params).then(res => {
        this.Message('ACTION_SUCCESS')
        this.$refs.DmData.initPage()
      })
    },

    cleanBind(params) {
      this.InvokeDispApi.get('/ip/tag/unbind', params).then(res => {
        this.Message('ACTION_SUCCESS')
        this.$refs.DmData.initPage()
      })
    },

    getGroup() {
      this.InvokeDispApi.get('/ip/group/list', { page: 1, per_page: 200 }).then(res => {
        this.GROUP = res.list
      })
    },

    handleDownRecover(row, type) {
      const data = JSON.parse(JSON.stringify(row)) || {}
      const params = {
        monitor: [{
          ip: data.ip,
          ip_alive: type === 'down' ? '0' : '1'
        }]
      }
      this.InvokeDispApi.post('/monitor/ip/event', params).then(res => {
        this.Message('ACTION_SUCCESS')
        this.$refs.DmData.initPage()
      })
    }
  }
}
</script>
