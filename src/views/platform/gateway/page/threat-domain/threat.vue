<style lang="scss" scoped>
::v-deep.el-steps--simple {
  background: #f5f5f5;
  padding: 10px 10px;
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
      <DmSelect
        v-model="bindParams.classification_ids"
        :selects="CLASSIFICATION"
        multiple
        filterable
        placeholder="威胁类别"
      />
      <el-button
        :loading="loading"
        type="primary"
        @click="$refs.DmData.initPage()"
      >搜 索</el-button>
      <div style="display:inline-block;float:right;">
        <router-link :to="{path:'/gateway/threat/domain/type-add'}">
          <el-button type="primary">新 增</el-button>
        </router-link>
      </div>
    </div>
    <el-table
      v-loading="loading"
      :data="list"
      class="margin-top"
    >
      <el-table-column
        v-for="item in column"
        :key="item.$index"
        :label="item.label"
      >
        <template slot-scope="{row}">
          <div v-if="item.dataIndex ==='associations'">
            <p
              v-for="(_, index) in formartValue(row, item.dataIndex)"
              :key="index"
            >
              {{ _.source_identifier }} : {{ _.identifier }}
            </p>
          </div>
          <div v-else>
            {{ formartValue(row, item.dataIndex) }}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="120"
      >
        <template slot-scope="{row}">
          <el-button
            v-if="row.data && row.data.status === 'off'"
            type="text"
            @click="updataStatus(row.data, 'on')"
          >
            启用
          </el-button>
          <el-button
            v-if="row.data && row.data.status === 'on'"
            type="text"
            @click="updataStatus(row.data, 'off')"
          >
            禁用
          </el-button>
          <el-divider direction="vertical" />
          <router-link :to="ToEdit(row.data && row.data.id)">
            <el-button
              type="text"
              @click="e =>{}"
            >编辑</el-button>
          </router-link>
        </template>
      </el-table-column>
    </el-table>
  </DmPage>
</template>
<script>
import consoleData from '@/mixins/consoleData'

import SearchCard from './SearchCard'
export default {
  components: { SearchCard },
  mixins: [consoleData],
  data() {
    return {
      PagePanel: 'THREATENLIST',
      search: true,
      visible: false,
      API_METHOD: 'post',
      API_INDEX: '/fd/V4/gateway/threat.classification.list',
      bindParams: {
      },
      list: [{ id: '12312', desc: '31231', name: '1231312', status: 1 }],
      column: [
        { label: '编号', dataIndex: 'id' },
        { label: '威胁类别', dataIndex: 'class_name' },
        { label: '类别映射', dataIndex: 'associations' },
        { label: '说明', dataIndex: 'description' },
        { label: '启用状态', dataIndex: 'status' },
        { label: '更新时间', dataIndex: 'updated_at' }
      ],
      options: {
        checkRow: []
      },
      CLASSIFICATION: [],
      ToEdit: (id) => {
        return {
          path: `/gateway/threat/domain/type/${id}`
        }
      }
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
    formartValue(data, index) {
      let val = data['data']
      let associationsName = []

      if (data['source_list'] && data['source_list'].length) {
        data['source_list'].forEach(i => {
          if (i.associations.length) {
            associationsName = associationsName.concat(i.associations)
          }
        })
      }
      console.log(associationsName.length)
      if (index === 'id') val = val && val.id || ''
      else if (index === 'class_name') val = val && val.name || ''
      else if (index === 'associations') val = associationsName
      else if (index === 'description') val = val && val.description || ''
      else if (index === 'status') val = val && val.status && val.status === 'on' ? '启用' : '禁用' || ''
      else if (index === 'updated_at') val = val && val.updated_at || ''
      else val = '--'
      return val
    },

    async updataStatus(data, val) {
      const params = {
        id: data.id,
        status: val
      }
      try {
        await this.Fetch.put('/fd/V4/gateway/threat.classification.alter.status', params)
        this.Message('ACTION_SUCCESS')
        await this.fetchList({
          page: this.$refs.DmData.getParams().page,
          page_size: this.$refs.DmData.getParams().per_page,
          ...this.bindParams
        })
      } catch (error) {
        return
      }
    }
  }
}
</script>
