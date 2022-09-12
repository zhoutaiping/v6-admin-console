<style lang="scss" scoped>
.input-box {
  width: 160px;
}
</style>
<template>
  <DmPage
    ref="DmData"
    :page-panel="PagePanel"
    @init="fetchList({
      page:$refs.DmData.getParams().page,
      page_size:$refs.DmData.getParams().per_page,
      ...bindParams
    })"
  >
    <div slot="filter">
      <InputSearch
        v-model="bindParams.domain"
        placeholder="请输入域名"
        class="input-box "
      />
      <DmSelect
        :selects="CONFIDENCE"
        v-model="bindParams.confidence"
        multiple
        filterable
        placeholder="置信度"
        class="input-box "
      />
      <DmSelect
        :selects="CLASSIFICATION"
        v-model="bindParams.classification_ids"
        multiple
        filterable
        placeholder="威胁类型"
        class="input-box "
      />
      <el-button
        :loading="loading"
        type="primary"
        @click="$refs.DmData.initPage()"
      >搜 索</el-button>
      <div style="display:inline-block;float:right"/>
    </div>
    <el-table
      v-loading="loading"
      :data="list"
      element-loading-text="加载中"
      element-loading-spinner="el-icon-loading"
    >
      <el-table-column
        v-for="item in column"
        :key="item.dataIndex"
        :label="item.label"
      >
        <template slot-scope="{row}">
          <div>
            {{ formartValue(row, item.dataIndex) }}
          </div>
        </template>
      </el-table-column>
    </el-table>
    <InFo
      ref="InFo"
      @init="$refs.DmData.initPage()"
    />
  </DmPage>
</template>
<script>
import consoleData from '@/mixins/consoleData'
import InFo from '../../components/intelligence-info'
export default {
  components: { InFo },
  mixins: [consoleData],
  data() {
    return {
      PagePanel: 'MSG_EMAIL',
      API_METHOD: 'post',
      API_INDEX: '/fd/V4/gateway/domain.name.intelligence.list',
      bindParams: {},
      list: [{ id: '12312', desc: '31231', name: '1231312', status: '1' }],
      column: [
        { label: '编号', dataIndex: 'id' },
        { label: '域名', dataIndex: 'domain' },
        { label: '置信度', dataIndex: 'confidence' },
        { label: '威胁类型(原始)', dataIndex: 'classification_raw' },
        { label: '威胁类型', dataIndex: 'classification' },
        { label: '情报来源', dataIndex: 'source' },
        { label: '更新时间', dataIndex: 'updated_at' }
      ],
      options: {
        checkRow: []
      },
      CONFIDENCE: [
        { label: '0-10', value: 0 },
        { label: '11-20', value: 1 },
        { label: '21-30', value: 2 },
        { label: '31-40', value: 3 },
        { label: '41-50', value: 4 },
        { label: '51-60', value: 5 },
        { label: '61-70', value: 6 },
        { label: '71-80', value: 7 },
        { label: '81-90', value: 8 },
        { label: '91-100', value: 9 }
      ],
      CLASSIFICATION: []
    }
  },
  created() {
    this.getClassification()
  },
  methods: {
    async getClassification() {
      try {
        const data = await this.Fetch.get('/fd/V4/gateway/threat.classification.name.list', {
          page: 1, page_size: 20
        })
        const { list = [] } = data
        this.CLASSIFICATION = list.map(i => {
          return {
            label: i.name,
            value: i.id
          }
        })
      } catch (error) {
        return
      }
    },
    loadData() {
      this.loading = true
      setTimeout(() => {
        this.loading = false
      }, 800)
    },
    formartValue(data, index) {
      let val = data[index]
      if (index === 'classification_raw') val = val && val.length ? val.join('|') : ''
      else if (index === 'classification') val = val && val.length ? val.join('|') : ''
      else if (index === 'status') val = val === '1' ? '开启' : '关闭'
      return val
    }
  }
}
</script>
