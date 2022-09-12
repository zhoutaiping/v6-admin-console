<style lang="scss" scoped>
.input-box {
  width: 300px;
}
</style>
<template>
  <DmDialog
    ref="dialog"
    :fetch-submit="fetchSubmit"
    title="替换"
    width="900px"
    submit-text="替换"
  >
    <el-form ref="form" :model="form">
      <el-form-item label="" style="text-align:center">
        <el-input
          v-model="bindParams.keyword"
          placeholder="名称、路由、系统、关键字"
          clearable
          class="input-box"
        />
        <el-button
          type="primary"
          icon="el-icon-search"
          @click="$refs.DmData.initPage()"
        >搜 索</el-button>
      </el-form-item>
      <DmAlert>
        <span v-show="form" class="color--primary">
          当前API：{{ form.api_name }}【{{ form.api }}】
        </span><br>
        <span v-show="check">
          替换API：{{ check.api_name }}【{{ check.api }}】
        </span>
      </DmAlert>
      <el-form-item label="">
        <DmData ref="DmData" :auto-init="false" @init="fetchList" >
          <DmTable :loading="loading" min-height>
            <el-table :data="data">
              <el-table-column label="" width="55">
                <template slot-scope="scope">
                  <el-checkbox v-model="scope.row.check" @change="checkRow(scope.row, scope.$index)"/>
                </template>
              </el-table-column>
              <el-table-column v-for="(tab, index) in column" :key="index" :label="tab.label">
                <template slot-scope="scope">
                  {{ formartValue(scope.row, tab.prop) }}
                </template>
              </el-table-column>
            </el-table>
          </DmTable>
        </DmData>
      </el-form-item>
    </el-form>
  </DmDialog>
</template>
<script>
import consoleData from '@/mixins/consoleData'
export default {
  mixins: [consoleData],
  data() {
    return {
      API_INDEX: '/V4/acl.api.list',
      bindParams: {
        keyword: ''
      },
      loading: false,
      form: {},
      check: '',
      data: [],
      column: [
        { label: 'API名称', prop: 'api_name' },
        { label: '路由', prop: 'api' },
        { label: '系统', prop: 'sys_name' },
        { label: '所属产品', prop: 'api_biz' }
      ]
    }
  },
  watch: {
    list(val) {
      const data = val
      this.check = ''
      data.forEach(e => {
        e.check = false
      })
      this.data = data
    }
  },
  methods: {
    handleOpen(data, option) {
      this.$nextTick(() => {
        this.form = Object.assign({}, data)
        this.$refs.dialog.handleOpen()
        this.bindParams.keyword = ''
        this.check = ''
        this.list = []
        setTimeout(() => {
          this.$refs.DmData.initPage()
        }, 100)
      })
    },
    checkRow(data, index) {
      const list = JSON.parse(JSON.stringify(this.list))
      list.forEach((i, index_) => {
        if (index_ === index) {
          i.check = true
        } else {
          i.check = false
        }
      })
      this.check = data
      this.data = list
    },

    formartValue(data, prop) {
      return data[prop] || ''
    },

    fetchSubmit() {
      if (!this.check) {
        this.message.warning('请选择要替换的API！')
        this.$refs.dialog.afterValidate()
        return
      }
      const params = {
        id: this.form.id,
        api_replace: this.check.id
      }
      this.$confirm('此操作将替换API, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.Fetch.post('/V4/acl.api.save', params).then(res => {
          this.Message('ACTION_SUCCESS')
          this.$refs.DmData.initPage()
        })
        this.$refs.dialog.afterValidate()
      }).catch(() => {
        this.$refs.dialog.afterValidate()
        this.Message('ACTION_ERROR')
      })
    }
  }
}
</script>
