<template>
  <console-page-layout>
    <div slot="filter">
      <DmToolbar>
        <InputSearch
          v-model="bindParams.name"
          placeholder="线路标识"
          @submit="$refs.DmData.initPage()"
        />
        <InputSearch
          v-model="bindParams.desc"
          placeholder="线路名称"
          @submit="$refs.DmData.initPage()"
        />
        <el-select v-model="bindParams.status" clearable placeholder="线路状态" class="search-form-input" @change="$refs.DmData.initPage()">
          <el-option v-for="(item,key) in STATUS" :key="key" :label="item.label" :value="item.value"/>
        </el-select>
        <el-select v-model="bindParams.parent_id" filterable clearable placeholder="父级线路名称" class="search-form-input" @change="$refs.DmData.initPage()">
          <ElOption v-for="(item,key) in list_All" :key="key" :label="item.label" :value="item.value">
            <span style="float: left">{{ item.label }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">id:{{ item.value }}</span>
          </ElOption>
        </el-select>
        <el-button type="primary" icon="el-icon-setting" @click="handleEditRowStatus('add',null)">新 增</el-button>
      </DmToolbar>
    </div>
    <DmData
      ref="DmData"
      @init="fetchList"
    >
      <DmTable v-loading="loading">
        <el-table v-loading="loading" :data="list" @selection-change="selectChange">
          <el-table-column label="" type="selection" width="55"/>
          <el-table-column v-for="(item, index) in column" :key="index" :label="item.label" show-overflow-tooltip>
            <template v-slot="scope">
              <div v-if="item.prop ==='status'">
                <span :class=" Number(scope.row.status)!==0 ? 'color--success':'color--warning'">
                  {{ STATUS_TEXT[scope.row.status] }}
                </span>
              </div>
              <div v-else-if="item.prop ==='parent_name'">
                {{ getParentDesc(scope.row.parent_id) }}
              </div>
              <div v-else>
                {{ scope.row[item.prop] }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200" >
            <template slot-scope="scope">
              <a class="color--primary" style="margin: 0 10px 0 0" @click="handleEditRowStatus('save_next',scope.row)">新增下级线路</a>
              <a class="color--primary" @click="handleEditRowStatus('edit',scope.row)">修 改</a>
            </template>
          </el-table-column>
        </el-table>
      </DmTable>
    </DmData>
    <DialogSave ref="dialogSave" @loadGrid="$refs.DmData.initPage()"/>
    <el-tooltip placement="top" content="回到顶部">
      <back-to-top :custom-style="myBackToTopStyle" :visibility-height="300" :back-position="50" transition-name="fade"/>
    </el-tooltip>
  </console-page-layout>
</template>

<script>
import consoleData from '@/mixins/consoleData'
import * as FORM from './form'
import DialogSave from './components/DialogSave'
export default {
  components: { DialogSave },
  mixins: [consoleData],
  data() {
    return {
      bindParams: { },
      API_INDEX: '/V4/CloudDns.dnsview.list',
      column: [
        { label: 'ID', prop: 'id' },
        { label: '线路标识', prop: 'name' },
        { label: '线路名称', prop: 'desc' },
        { label: '资源状态', prop: 'status' },
        { label: '父级ID', prop: 'parent_id' },
        { label: '父级线路名称', prop: 'parent_name' },
        { label: '排序', prop: 'sort' },
        { label: '更新时间', prop: 'updated_at' }
      ],
      list_All: [],
      select: [],
      myBackToTopStyle: FORM.myBackToTopStyle,
      STATUS: FORM.STATUS,
      STATUS_TEXT: { 1: '启用', 0: '禁用' }
    }
  },

  async created() {
    this.getListAll()
  },

  methods: {
    getListAll() {
      this.InvokeAllApi.get('/V4/CloudDns.dnsview.list', { page: 1, per_page: 999 }).then(res => {
        const list = JSON.parse(JSON.stringify(res.list))
        this.list_All = []
        list.forEach(element => {
          element.label = element.desc || '--'
          element.value = element.id
          this.list_All.push(element)
        })
      }).catch(e => {
        this.list_All = []
      })
    },

    getParentDesc(id) {
      const find = this.list_All.find(item => {
        return item.id === id
      })
      return find && find.desc || ''
    },

    getMemberEmail(row) {
      return row.member_info ? row.member_info.email || '--' : '--'
    },
    getMemberMobile(row) {
      return row.member_info ? row.member_info.mobile || '--' : '--'
    },
    selectChange(val) {
      this.select = val
    },
    handleEditRowStatus(type, data) {
      this.$refs.dialogSave.handleOpen(type || 'save', data || {}, this.list_All)
    }
  }
}
</script>
