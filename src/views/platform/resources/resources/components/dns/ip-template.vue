<template>
  <el-card :body-style="{'padding':'10px'}">
    <DmToolbar>
      <div slot="right">
        <DmSelect
          v-model="bindParams.status"
          :selects="options.status"
          class="input-box"
          placeholder="状态"
          @change="$refs.DmData.initPage()"
        />
        <DmSelect
          v-model="bindParams.gid"
          :selects="options.group"
          class="input-box"
          placeholder="分组"
          @change="$refs.DmData.initPage()"
        />
        <InputSearch
          v-model="bindParams.ip"
          placeholder="IP/主域名"
          class="input-box"
          @submit="$refs.DmData.initPage()"
        />
      </div>
      <el-dropdown
        trigger="click"
        placement="bottom-start"
      >
        <el-button plain>批量操作<i class="el-icon-arrow-down el-icon--right" /></el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item :disabled="options.selRow.length === 0">
            <div @click="e=>{batchStatus(options.selRow, 1)}"> 启 用 </div>
          </el-dropdown-item>
          <el-dropdown-item :disabled="options.selRow.length === 0">
            <div @click="e=>{batchStatus(options.selRow, 0)}"> 禁 用 </div>
          </el-dropdown-item>
          <el-dropdown-item :disabled="options.selRow.length === 0">
            <div @click="e=>{$refs.deleteDisp.handleOpen(options.selRow)}"> 删除&调度 </div>
          </el-dropdown-item>
          <el-dropdown-item :disabled="options.selRow.length === 0">
            <div @click="$refs.batchTags.handleOpen(options.selRow, 'ip-tag-bind')"> 绑定标签 </div>
          </el-dropdown-item>
          <el-dropdown-item :disabled="options.selRow.length === 0">
            <div @click="$refs.dialogGroupBatch.handleOpen(options.selRow, 'group-batch')"> 分 组 </div>
          </el-dropdown-item>
          <el-dropdown-item :disabled="options.selRow.length === 0">
            <div @click="$refs.bindgroup.handleOpen(options.selRow)"> 绑定到用户组 </div>
          </el-dropdown-item>
          <el-dropdown-item :disabled="options.selRow.length === 0">
            <div @click="e =>{batchIpEven(options.selRow, 0)}"> 离 线 </div>
          </el-dropdown-item>
          <el-dropdown-item :disabled="options.selRow.length === 0">
            <div @click="e =>{batchIpEven(options.selRow, 1)}"> 在 线 </div>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <router-link :to="`/platform/resources/resources/dns-ip-group`">
        <el-button type="primary">分组管理</el-button>
      </router-link>
      <el-button
        type="primary"
        @click="setColumn"
      >自定义展示</el-button>
    </DmToolbar>
    <DmData
      ref="DmData"
      @init="fetchList"
    >
      <DmTable :loading="loading">
        <el-table
          :data="list"
          @selection-change="e =>{ options.selRow = e}"
        >
          <el-table-column
            type="selection"
            width="55"
          />
          <el-table-column
            v-for="(_, _index) in filtet_column"
            :key="_.prop"
            :label="_.label"
            :width="_.width"
            show-overflow-tooltip
          >
            <template slot-scope="{row}">
              <template v-if="_.prop==='tags'">
                <template v-if="row && row.tags ">
                  <el-tag
                    v-for="(tag, tag_index) in formartValue(row, 'tags').slice(0, 1)"
                    :key="tag_index"
                    size="mini"
                    style="margin: 2px;"
                  >
                    {{ tag }}
                  </el-tag>
                  <el-button
                    v-if="formartValue(row, 'tags').length > 1"
                    type="text"
                    icon="el-icon-more"
                    @click="$refs.tags.handleOpen(formartValue(row, 'tags'))"
                  >更多</el-button>
                </template>

              </template>
              <template v-else-if="_.prop === 'status'">
                <span :class="row.status === 1 ? 'color--primary':'color--danger'">
                  {{ formartValue(row, 'status') }}
                </span>
                <el-divider direction="vertical" />
                <span :class="row.ip_alive === 1 ? 'color--primary':'color--danger'">
                  {{ formartValue(row, 'ip_alive') }}
                </span>
              </template>
              <template v-else-if="_.prop === 'attribute'">
                <span>ISP：{{ formartValue(row, 'isps').join(',') }}<br></span>
                <span>地区：{{ formartRegion(row.regions) }}<br></span>
                <span>IP类型：{{ formartValue(row, 'ip_share') }}</span>
              </template>
              <template v-else-if="_.prop === 'line_group_ids'">
                <div
                  v-for="line in row.line_group_ids"
                  :key="line"
                >
                  {{ row.line_groups[line] }}
                </div>
              </template>
              <template v-else>
                {{ formartValue(row, _.prop) }}
              </template>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            width="150"
          >
            <template slot-scope="{row}">
              <el-button
                type="text"
                @click="$refs.batchTags.handleOpen([row], 'edit')"
              >绑定标签</el-button>
            </template>
          </el-table-column>
        </el-table>
      </DmTable>
    </DmData>
    <AutoColumn
      ref="autoColumn"
      @initColumn="initColumn"
    />
    <BatchTags
      ref="batchTags"
      @init="$refs.DmData.initPage()"
    />
    <BindGroup
      ref="bindgroup"
      @init="$refs.DmData.initPage()"
    />
    <DeleteDisp
      ref="deleteDisp"
      @init="$refs.DmData.initPage()"
    />
    <DialogGroupBatch
      ref="dialogGroupBatch"
      @handleLoad="$refs.DmData.initPage()"
      @getGroup="getGroup()"
    />
    <Tags ref="tags" />

  </el-card>
</template>

<script>
import { mapState } from 'vuex'
import consoleData from '@/mixins/consoleData'
import initColumn from '@/mixins/initColumn'
import BindGroup from './components/ip-bind-group'
import Tags from './components/ip-tags'
import DialogGroupBatch from './components/DialogGroupBatch'
import BatchTags from './components/tags'
import DeleteDisp from './components/delete-disp'
import { formartRegion } from '@/views/platform/business/constant/utils'
export default {
  components: { BindGroup, DialogGroupBatch, Tags, BatchTags, DeleteDisp },
  mixins: [consoleData, initColumn],
  data() {
    return {
      pannel_name: 'resources_ip',
      initPage: false,
      API_INDEX: '/ip/list',
      bindParams: {
        ip: '',
        tags: '',
        gid: ''
      },
      fetch: this.FetchDisp,
      list: [],
      column: [
        { label: '节点ID', prop: 'ip_id' },
        { label: '节点IP', prop: 'ip' },
        { label: '所属分组', prop: 'gid' },
        { label: '使用状态/健康状态', prop: 'status' },
        { label: '标签', prop: 'tags' },
        { label: '覆盖请求来源', prop: 'line_group_ids' },
        { label: '属性', prop: 'attribute' }
      ],
      options: {
        selRow: [],
        isp: [],
        status: [
          { label: '启用', value: 1 },
          { label: '禁用', value: 0 }
        ],
        ip_share: [
          { label: '独享', value: 1 },
          { label: '共享', value: 0 }
        ],
        group: [],
        ip_alive: {
          0: '宕机智能',
          1: '正常智能',
          2: '宕机离线',
          3: '宕机在线',
          4: '正常离线',
          5: '正常在线'
        },
        isps: [
          { label: '电信 ', value: 'dx' },
          { label: '联通 ', value: 'lt' },
          { label: '移动 ', value: 'yd' },
          { label: 'BGP ', value: 'bgp' },
          { label: 'CN2 ', value: 'cn2' },
          { label: '国际线路 ', value: 'gjxl' },
          { label: '其他 ', value: 'other' }
        ]
      }
    }
  },
  computed: {
    ...mapState({
      ip_group: state => state.disp.ip_group,
      region_list: state => state.disp.region_list
    })
  },
  watch: {
    ip_group: {
      deep: true,
      handler(val) {
        this.options.group = this.ip_group.map(i => { return { label: i.name, value: i.id } })
      }
    }
  },
  mounted() {
    this.$store.dispatch('feachIpGroup')
  },
  methods: {
    init() { },

    getGroup() {
      this.$store.dispatch('feachIpGroup')
    },

    formartValue(data, prop) {
      const val = data[prop]
      if (prop === 'status') {
        return val === 1 ? '启用' : '禁用'
      } else if (prop === 'ip_alive') {
        return this.options.ip_alive[val]
      } else if (prop === 'gid') {
        return this.options.group.find(i => Number(i.value) === Number(val)) ? this.options.group.find(i => Number(i.value) === Number(val)).label : val
      } else if (prop === 'isps') {
        return val.map(i => { return this.options.isps.find(k => k.value === i).label || '' })
      } else if (prop === 'ip_share') {
        return this.options.ip_share.find(k => k.value === val) ? this.options.ip_share.find(k => k.value === val).label : ''
      } else if (prop === 'tags') {
        const a = []
        if (data.tags && Object.keys(data.tags).length) {
          Object.keys(data.tags).forEach(i => {
            const tag_item = data.tags[i]
            if (Object.keys(tag_item).length) Object.keys(tag_item).forEach(k => { a.push(tag_item[k]) })
          })
        }
        return a
      }
      return val
    },

    async batchStatus(list, status) {
      try {
        const params = {
          ids: list.map(i => i.id).join(','),
          status: status
        }
        await this.FetchDisp.post('/ip/batch_save_status', params)
        this.Message('ACTION_SUCCESS')
        await this.$refs.DmData.initPage()
      } catch (error) {
        return
      }
    },

    async batchIpEven(list, status) {
      try {
        const params = {
          monitor: list.map(i => { return { ip: i.ip, ip_alive: status } })
        }
        await this.FetchDisp.post('/monitor/ip/event', params)
        this.Message('ACTION_SUCCESS')
        await this.$refs.DmData.initPage()
      } catch (error) {
        return
      }
    },

    formartRegion(code) {
      return formartRegion(code, this.region_list)
    }
  }
}
</script>
<style lang="scss" scoped>
.input-box {
  width: 160px;
  margin: 0 0 5px 5px;
}
</style>
