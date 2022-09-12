<style lang="scss" scoped>
.input-box {
  width: 400px;
}
.item-box {
  margin-bottom: 5px;
}
</style>
<template>
  <DmDialog
    ref="dialog"
    :footer="false"
    title="详情"
    width="900px"
  >
    <DmScroll>
      <el-form :model="form" label-width="100px" label-position="left">
        <el-form-item label="API名称" class="item-box">
          <el-input v-model="form.api_name" readonly placeholder="" class="input-box"/>
        </el-form-item>
        <el-form-item label="API" class="item-box">
          <el-input v-model="form.api" readonly placeholder="" class="input-box"/>
        </el-form-item>
        <el-form-item label="系统" class="item-box">
          <el-input v-model="form.sys_name" readonly placeholder="" class="input-box"/>
        </el-form-item>
        <el-form-item label="请求方式" class="item-box">
          <el-input v-model="form.method" readonly placeholder="" class="input-box"/>
        </el-form-item>
        <el-form-item label="状态" class="item-box">
          <el-radio-group v-model="form.status">
            <el-radio v-for="item in option.status" :disabled="form.status!==item.value" :key="item.value" :label="item.value">{{ item.label }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="描述" class="item-box">
          <el-input v-model="form.doc" type="textarea" readonly placeholder="" class="input-box"/>
        </el-form-item>
        <el-form-item label="历史记录" class="item-box"/>
        <DmData
          ref="DmData"
          :auto-init="false"
          @init="fetchList"
        >
          <DmTable :loading="loading" min-height>
            <el-table
              :data="list"
            >
              <el-table-column
                v-for="(tab, index) in column"
                :key="index"
                :width="tab.width"
                :label="tab.label"
              >
                <template slot-scope="scope">
                  {{ formartValue(scope.row, tab.prop) }}
                </template>
              </el-table-column>
            </el-table>
          </DmTable>
        </DmData>
      </el-form>
    </DmScroll>
  </DmDialog>
</template>
<script>
import consoleData from '@/mixins/consoleData'
export default {
  mixins: [consoleData],
  data() {
    return {
      loading: false,
      form: {},
      API_INDEX: '/V4/acl.api.history',
      bindParams: { api_id: '' },
      option: {
        status: [
          { label: '未启用', value: '0' },
          { label: '上架', value: '1' },
          { label: '下架', value: '2' }
        ]
      },
      column: [
        { label: 'API名称', prop: 'api_name' },
        { label: '路由', prop: 'api' },
        { label: '系统', prop: 'sys_name' },
        { label: '请求方式', prop: 'method' },
        { label: '状态', prop: 'status' },
        { label: '更新时间', prop: 'updated_at' }
      ],
      status: {
        0: '未启用',
        1: '上架',
        2: '下架'
      }
    }
  },
  methods: {
    handleOpen(data, option) {
      this.$nextTick(() => {
        this.$refs.dialog.handleOpen()
        this.form = Object.assign({}, JSON.parse(JSON.stringify(data)))
        this.bindParams.api_id = data.id
        setTimeout(() => {
          if (this.$refs.DmData) {
            this.$refs.DmData.initPage()
          }
        }, 500)
      })
    },

    formartValue(data, prop) {
      let val = data[prop]
      if (prop === 'status') {
        val = this.status[val]
      }
      return val || ''
    }
  }
}
</script>
