<template>
  <console-page-layout>
    <DmToolbar>
      <div slot="right">
        <InputSearch
          v-model="bindParams.app_type"
          placeholder="应用类型"
          class="input-box"
          @submit="$refs.DmData.initPage()"
        />
      </div>
      <el-button
        type="primary"
        @click="e =>{ $refs.addedit.handleOpen({}, 'Create') }"
      >新 增</el-button>
    </DmToolbar>
    <DmData
      ref="DmData"
      @init="fetchList"
    >
      <DmTable
        :loading="loading"
        min-height
      >
        <el-table :data="app_list">
          <el-table-column
            v-for="(item, index) in column"
            :key="index"
            :label="item.label"
            :width="item.width"
            show-overflow-tooltip
          >
            <template slot-scope="{row}">
              <div v-if="item.prop === 'status' ">
                <a-switch
                  v-model="row.status"
                  checked-children="开启"
                  un-checked-children="关闭"
                  @change="e =>{ changeStatus({
                    id:row.id,
                    status: e === true ? '1' : '0'
                  }) }"
                />
              </div>
              <div v-else>
                {{ formartValue(row, item.prop) }}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            width="120"
          >
            <template slot-scope="{row}">
              <el-button
                type="text"
                @click="$refs.addedit.handleOpen(row, 'Edit')"
              >编辑</el-button>
              <el-divider direction="vertical"/>
              <el-button
                type="text"
                @click="e =>{handleDel({id:row.id})}"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </DmTable>
    </DmData>
    <AddEdit ref="addedit" @init="$refs.DmData.initPage()" />
  </console-page-layout>
</template>
<script>
import consoleData from '@/mixins/consoleData'
import { deepClone } from '@/utils'
import AddEdit from './components/add-edit-sass-application'
export default {
  components: { AddEdit },
  mixins: [consoleData],
  data() {
    return {
      API_INDEX: '/fd/V4/zero.trust.saas.conf.list',
      bindParams: { app_type: '' },
      app_list: [],
      column: [
        { label: '模板类型', prop: 'template_type_name' },
        { label: '应用类型', prop: 'app_type' },
        { label: '状态', prop: 'status' }
      ]
    }
  },
  watch: {
    list: {
      handler(val) {
        const list = deepClone(val)
        this.app_list = list.map(i => {
          i.status = i.status === '1'
          return i
        })
      },
      deep: true
    }
  },
  methods: {
    formartValue(data, prop) {
      return data[prop]
    },

    async handleDel(params = {}) {
      try {
        await this.Fetch.delete('/fd/V4/zero.trust.saas.conf.del', params)
        this.Message('ACTION_SUCCESS')
        await this.$refs.DmData.initPage()
      } catch (error) {
        return
      }
    },

    async changeStatus(params = {}) {
      try {
        await this.Fetch.post('/fd/V4/zero.trust.saas.change.status', params)
        this.Message('ACTION_SUCCESS')
        await this.$refs.DmData.initPage()
      } catch (error) {
        return
      }
    }
  }

}
</script>

<style lang="scss" scoped>
.table-sass {
  padding: 12px;
}
</style>
