<style lang="scss" scoped>
.input-box {
  width: 150px;
}
.input-box-2 {
  width: 300px;
}
</style>
<template>
  <console-page-layout>
    <div slot="filter">
      <DmToolbar>
        <InputSearch
          v-model="bindParams.email"
          placeholder="请输入邮箱"
          class="input-box"
          @submit="$refs.DmData.initPage()"
        />
        <el-input
          v-model="bindParams.ip"
          :disabled="bindParams.ip_type==='all'"
          clearable
          placeholder="IP"
          class="input-box-2"
          @keyup.enter.native="$refs.DmData.initPage()"
        >
          <DmSelect
            slot="prepend"
            v-model="bindParams.ip_type"
            :selects="options.ip_type"
            placeholder="IP类型"
            style="width:100px;"
            @change="e =>{
              bindParams.ip = ''
            }"
          />
        </el-input>
        <DmSelect
          v-model="bindParams.phase"
          :selects="options.phase"
          placeholder="付费状态"
          class="input-box"
          @change="$refs.DmData.initPage()"
        />
        <DmSelect
          v-model="bindParams.status"
          :selects="options.status"
          placeholder="加白状态"
          class="input-box"
          @change="$refs.DmData.initPage()"
        />
        <el-select
          v-model="bindParams.sale"
          placeholder="请选择销售"
          class="input-box"
          clearable
          @change="$refs.DmData.initPage()"
        >
          <el-option
            v-for="(item, key) in sales"
            :key="key"
            :label="item.label"
            :value="item.value"
            :disabled="Number(item.status) === 0"
          />
        </el-select>
        <DmSelect
          v-model="bindParams.afterSales"
          :selects="afterSales_list"
          clearable
          placeholder="售后技术支持"
          class="input-box"
          @change="$refs.DmData.initPage()"
        />
        <el-button
          type="primary"
          icon="el-icon-search"
          @click="$refs.DmData.initPage()"
        >搜索</el-button>
        <el-button
          type="primary"
          icon="el-icon-download"
          @click="download"
        >导出</el-button>
        <el-button
          v-loading="noticeloading"
          :disabled="!PLANT_ID.length"
          type="primary"
          icon="el-icon-bell"
          @click="handelNotice"
        >立即通知</el-button>
      </DmToolbar>
    </div>
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
          @select="handleRowSelect"
          @select-all="handleRowSelect"
        >
          <el-table-column
            type="selection"
            width="55"
          />
          <el-table-column
            v-for="_ in column"
            :key="_.prop"
            :label="_.label"
            :width="_.width"
          >
            <template slot-scope="scope">
              {{ formartValue(scope.row, _.prop) }}
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
                @click="$refs.Edit.handleOpen(scope.row)"
              >编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
      </DmTable>
    </DmData>
    <Edit
      ref="Edit"
      @init="fetchList"
    />
  </console-page-layout>
</template>
<script>
import consoleData from '@/mixins/consoleData'
import Edit from './components/edit'
import { mapActions, mapState } from 'vuex'
export default {
  components: { Edit },
  mixins: [consoleData],
  data() {
    return {
      API_INDEX: '/fd/V4/ip.white.list',
      bindParams: {
        ip: '',
        email: '',
        status: '',
        phase: '',
        ip_type: ''
      },
      column: [
        { label: '用户邮箱', prop: 'email' },
        { label: '套餐ID', prop: 'plant_id' },
        { label: '产品', prop: 'product_name' },
        { label: '套餐', prop: 'meal_name' },
        { label: '是否付费', prop: 'phase' },
        { label: '是否加白', prop: 'status' },
        { label: '加白IP信息', prop: 'ip' },
        { label: '所属销售', prop: 'sales', width: 200 },
        { label: '所属运营', prop: 'after_sales', width: 200 }
      ],
      selectionId: [],
      noticeloading: false,
      PLANT_ID: [],
      options: {
        status: [
          { label: '是', value: 1 },
          { label: '否', value: 0 }
        ],
        ip_type: [
          { label: '全局IP', value: 'all' },
          { label: '手动', value: 'hand' }
        ],
        phase: [
          { label: '已付费', value: 1 },
          { label: '未付费', value: 0 }
        ]
      }
    }
  },
  computed: {
    ...mapState({
      conf: (state) => state.finance.conf
    }),
    sales() {
      function get(list) {
        let newlist = []
        list.forEach(item => {
          if (item.role_flag === 'CRM_NORMAL_MARKET') {
            newlist = item.children && Array.isArray(item.children) ? item.children : []
          }
        })
        return newlist
      }
      return this.conf.group.length && get(this.conf.group) || []
    },

    afterSales_list() {
      const maplist = this.conf.afterSales_list || []
      return maplist.map(i => { return { label: i.name, value: i.user_id } })
    }
  },
  async created() {
    await Promise.all([this.getbasicconf()])
  },
  methods: {
    ...mapActions({
      getbasicconf: 'getbasicconf'
    }),
    formartValue(row, prop) {
      let _text = ''
      switch (prop) {
        case 'status':
          _text = Number(row[prop]) === 1 ? '是' : '否'
          break
        case 'phase':
          _text = Number(row[prop]) === 1 ? '已付费' : '未付费'
          break
        case 'ip':
          _text = Array.isArray(row[prop]) ? row[prop].join(', ') : row[prop]
          break
        case 'sales':
          _text = this.getSalesText(row.user_list)
          break
        case 'after_sales':
          _text = this.getSalesText(row.user_list, 'CRM_AFTER_SALES')
          break
        default:
          _text = row[prop]
          break
      }
      return _text
    },
    getSalesText(value, type = 'CRM_NORMAL_MARKET') {
      let salesMsg = '暂未关联'
      for (var _item in value) {
        const sales = this.conf.role_list.find(elment => {
          return parseInt(_item) === parseInt(elment.id)
        })
        if (sales && sales.role_flag === type) {
          value[_item].forEach((element, index) => {
            let user = {}
            this.conf.user_list.forEach(record => {
              if (record.user_id === element) user = record
            })
            if (user) {
              if (index === 0) {
                salesMsg = user.name
              } else {
                salesMsg = user.name + ' | ' + salesMsg
              }
            }
          })
        }
      }
      return salesMsg
    },
    handleRowSelect(selection) {
      this.selectionId = selection.map(_ => _.id)
      this.PLANT_ID = selection.map(_ => _.plant_id)
    },

    download() {
      const data = {
        ...this.bindParams,
        ...this.$refs.DmData.getParams(),
        action: 'download'
      }
      this.Fetch.get('/fd/V4/ip.white.list', data).then(res => {
        if (res.key) {
          const a = document.createElement('a')
          a.setAttribute('href', res.key)
          document.body.appendChild(a)
          a.click()
          a.style.display = 'none'
          this.Message('ACTION_SUCCESS')
        } else {
          this.Message('ACTION_ERROR')
        }
      })
    },
    handelNotice() {
      const params = { plan_ids: this.PLANT_ID }
      this.noticeloading = true
      this.Fetch.post('/fd/V4/ip.white.promptly.notice', params).then(res => {
        this.noticeloading = false
        this.Message('ACTION_SUCCESS')
      }).catch(e => {
        this.noticeloading = false
      })
    }
  }
}
</script>
