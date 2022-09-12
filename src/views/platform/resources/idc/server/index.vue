<style lang="postcss" scoped>
.app-center-room-index {
  padding: 10px;
  .search-form-input {
    width: 200px;
    margin: 0 2px 5px;
  }
  .dm-footer {
    float: left !important;
    margin: 10px 0;
  }
  .optionBtn {
    margin: 0 2px;
  }
}
</style>

<template>
  <div class="app-center-room-index">
    <div style="margin-bottom: 12px;">
      <InputSearch
        v-model="bindParams.id"
        placeholder="请输入ID"
        class="search-form-input"
        @submit="$refs.DmData.initPage()"
      />
      <InputSearch
        v-model="bindParams.ip"
        placeholder="请输入主IP"
        class="search-form-input"
        @submit="$refs.DmData.initPage()"
      />
      <InputSearch
        v-model="bindParams.sub_ip"
        placeholder="请输入子IP"
        class="search-form-input"
        @submit="$refs.DmData.initPage()"
      />
      <el-select
        v-model="bindParams.idc_house_id"
        clearable
        filterable
        placeholder="请选择机房"
        class="search-form-input"
        @change="$refs.DmData.initPage()"
      >
        <el-option
          v-for="(item, index) in HOUSE"
          :key="index"
          :label="item.ukey"
          :value="item.id"
        />
      </el-select>
      <el-select
        v-model="bindParams.server_type"
        clearable
        placeholder="请选择服务器类型"
        class="search-form-input"
        @change="$refs.DmData.initPage()"
      >
        <el-option
          v-for="(item, index) in SERVER_TYPE"
          :key="index"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-button
        type="primary"
        icon="el-icon-search"
        class="optionBtn"
        @click="$refs.DmData.initPage()"
      >搜 索</el-button>
      <el-button
        type="primary"
        icon="el-icon-plus"
        class="optionBtn"
        @click="handleRowClick(null,'add')"
      >新 增
      </el-button>
    </div>
    <DmData
      ref="DmData"
      @init="fetchList"
    >
      <DmTable v-loading="loading">
        <el-table
          ref="receivableList"
          :data="list"
        >
          <el-table-column
            v-for="(item,key) in defalutColumns"
            :key="key"
            :label="item.label"
            :fixed="item.fixed"
            :width="item.width"
            :show-overflow-tooltip="item.prop!=='serverIPs'"
          >
            <template slot-scope="scope">
              <div v-if="item.prop ==='ip'">
                {{ formartValue(scope.row, item.prop) }}
              </div>
              <div v-else-if="item.prop ==='serverIPs'">
                <el-tag
                  v-for="(tag, index) in getServerIPs(scope.row).slice(0, 5)"
                  :key="index"
                  size="mini"
                  style="margin: 2px;"
                >
                  {{ tag.ip }}
                </el-tag>
                <i
                  v-if="getServerIPs(scope.row).length > 5"
                  class="el-icon-share"
                  style="color:#409EFF"
                  @click="handleItem(scope.row)"
                >更多</i>
              </div>
              <div v-else>{{ formartValue(scope.row, item.prop) }}</div>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            align="left"
            fixed="right"
            width="300"
          >
            <template slot-scope="scope">
              <a class="color--primary" style="margin:0 5px;" @click="handleRowClick(scope.row,'info')">详 情</a>
              <a class="color--primary" style="margin:0 5px;" @click="handleRowClick(scope.row,'ItemIp')">子IP</a>
              <a class="color--primary" style="margin:0 5px;" @click="handleRowClick(scope.row,'edit')">编 辑</a>
              <a class="color--primary" style="margin:0 5px;" @click="handleDel(scope.row,'del')">删 除</a>
            </template>
          </el-table-column>
        </el-table>
      </DmTable>
    </DmData>
    <DialogEdit ref="dialogEdit" @handleLoad="$refs.DmData.initPage()" />
    <DialogIpItem ref="dialogIpItem" @handleLoad="$refs.DmData.initPage()" />
    <DialogItemIp ref="dialogItemIp" @handleLoad="$refs.DmData.initPage()" />
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
import BackToTop from '@/components/BackToTop'
import DmTable from '@/components/DmTable'
import Pagination from '@/components/Pagination'
import DialogEdit from './components/DialogEdit'
import DialogIpItem from './components/DialogIpItem'
import DialogItemIp from './components/DialogItemIp'
export default {
  components: { BackToTop, DmTable, Pagination, DialogEdit, DialogIpItem, DialogItemIp },
  mixins: [consoleData],
  data() {
    return {
      bindParams: {},
      fetch: this.InvokeAssetApi,
      API_INDEX: '/server/list',
      expands_loading: false,
      ip_item: [],
      pagination: Form.pagination,
      myBackToTopStyle: Form.myBackToTopStyle,
      REGION: [{ label: '全部', value: '' }],
      defalutColumns: Form.COLUMN,
      SERVER_TYPE: Form.SERVER_TYPE,
      SERVER_TYPE_TEXT: Form.SERVER_TYPE_TEXT,
      HOUSE: []
    }
  },
  mounted() {
    this.getHouse()
  },
  methods: {
    formartValue(row, prop) {
      let row_text = row[prop]
      let house = []
      switch (prop) {
        case 'server_type':
          row_text = this.SERVER_TYPE_TEXT[row[prop]]
          break
        case 'idc_house_id':
          house = this.HOUSE.filter(i => Number(i.id) === Number(row[prop]))
          row_text = house.length ? house[0].ukey + '(' + house[0].id + ')' : ''
          break
        default:
          row_text = row_text || '--'
          break
      }
      return row_text || '--'
    },

    getServerIPs(row) {
      let list = []
      list = this.responseData.serverIPs.filter(s => s.server_id === row.id)
      return list
    },

    handleRowClick(row, type) {
      const data = JSON.parse(JSON.stringify(row)) || {}
      switch (type) {
        case 'add':
          this.$refs.dialogEdit.handleOpen(data, 'add', this.HOUSE)
          break
        case 'info':
          this.$refs.dialogEdit.handleOpen(data, 'info', this.HOUSE)
          break
        case 'edit':
          this.$refs.dialogEdit.handleOpen(data, 'edit', this.HOUSE)
          break
        case 'ItemIp':
          this.$refs.dialogItemIp.handleOpen(data, 'ItemIp', this.HOUSE)
      }
    },
    handleItem(row) {
      const data = JSON.parse(JSON.stringify(row)) || {}
      this.$refs.dialogIpItem.handleOpen(this.getServerIPs(data))
    },
    handleDel(row) {
      const data = JSON.parse(JSON.stringify(row)) || {}
      this.$confirm('此操作将删除服务器, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.InvokeAssetApi.post('/server/del', { id: data.id }).then(res => {
          this.Message('ACTION_SUCCESS')
          this.$refs.DmData.initPage()
        })
      }).catch(e => { return true })
    },

    async getHouse() {
      try {
        const data = await this.InvokeAssetApi.get('/idc_house/list', { page: 1, per_page: 999 })
        this.HOUSE = data.list
      } catch (error) {
        this.HOUSE = []
      }
    }
  }
}
</script>
