<template>
  <console-page-layout>
    <div slot="filter">
      <DmToolbar>
        <InputSearch
          v-model="bindParams.email"
          placeholder="用户邮箱"
          class="input-box"
          @submit="$refs.DmData.initPage()"
        />
        <InputSearch
          v-model="bindParams.host_name"
          placeholder="主机名称"
          class="input-box"
          @submit="$refs.DmData.initPage()"
        />
        <InputSearch
          v-model="bindParams.host_ip"
          placeholder="主机IP"
          class="input-box"
          @submit="$refs.DmData.initPage()"
        />
        <DmSelect
          v-model="bindParams.auth_status"
          :selects="options.auth_status"
          class="input-box"
          placeholder="认证状态"
          @change="$refs.DmData.initPage()"
        />
        <el-button
          icon="el-icon-search"
          type="primary"
          @click="$refs.DmData.initPage()"
        >搜索</el-button>
      </DmToolbar>
    </div>
    <DmData
      ref="DmData"
      @init="fetchList"
    >
      <DmTable :loading="loading">
        <el-table :data="list">
          <el-table-column
            type="selection"
            width="55"
          />
          <el-table-column
            v-for="(_, _index) in column"
            :key="_.prop"
            :label="_.label"
            :width="_.width"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <div v-if="_.prop === 'auth_status'">
                <el-switch
                  v-model="scope.row.auth_status"
                  :active-value="1"
                  :inactive-value="0"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                  @change="changeStatus(scope.row)"
                />
                <span style="margin-left:10px;">
                  {{ formartValue(scope.row, _.prop) }}
                </span>
              </div>
              <div v-else>
                {{ formartValue(scope.row, _.prop) }}
              </div>
            </template>
          </el-table-column>
        </el-table>
      </DmTable>
    </DmData>
  </console-page-layout>
</template>
<script>
import consoleData from '@/mixins/consoleData'
export default {
  components: {},
  mixins: [consoleData],
  data() {
    return {
      API_INDEX: '/fd/V4/soc.property.all.host.ip',
      bindParams: {
        email: '',
        host_name: '',
        host_ip: '',
        auth_status: ''
      },
      column: [
        { label: 'ID', prop: 'id', width: 100 },
        { label: '主机名称', prop: 'host_name', width: 150 },
        { label: '主机IP', prop: 'host_ip', width: 200 },
        { label: '用户邮箱', prop: 'email', width: 200 },
        { label: '认证状态', prop: 'auth_status' },
        { label: '添加时间', prop: 'created_at' },
        { label: '修改时间', prop: 'updated_at' },
        { label: '备注', prop: 'remark' }
      ],
      options: {
        auth_status: [
          { label: '未认证', value: '0' },
          { label: '已认证', value: '1' }
        ]
      }
    }
  },

  methods: {
    formartValue(data, prop) {
      let val = data[prop]
      if (prop === 'auth_status') {
        val = this.options.auth_status.find(i => { return Number(i.value) === Number(val) }) ? this.options.auth_status.find(i => { return Number(i.value) === Number(val) }).label : ''
      }
      return val
    },

    async changeStatus(data) {
      const params = {
        id: data.id,
        auth_status: data.auth_status,
        member_id: data.member_id
      }
      try {
        await this.Fetch.post('/fd/V4/soc.property.host.ip.change.status', params)
        this.Message('ACTION_SUCCESS')
        await this.$refs.DmData.initPage()
      } catch (error) {
        return
      }
    }
  }
}
</script>
