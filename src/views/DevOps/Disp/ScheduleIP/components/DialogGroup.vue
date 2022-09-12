<style lang="postcss" scoped>
.groupForm {
  margin: 5px;
  .groupForm-item {
    margin-bottom: 5px;
  }
  .groupForm-input {
    width: 250px;
  }
}

</style>

<template>
  <el-dialog :visible.sync="open" title="新增分组标识" width="600px" @close="handleClose">
    <el-form v-loading="loading" ref="groupForm" :model="groupForm" :rules="rules" size="mini" label-position="left" label-width="90px" class="groupForm">
      <el-tabs v-model="tabpanel">
        <el-tab-pane label="搜索" name="1"/>
        <el-tab-pane label="新增" name="2"/>
      </el-tabs>
      <el-form-item v-if="tabpanel === '1'" label-width="0px">
        <el-input v-model="groupForm.keyword" clearable placeholder="请输入分组标识" class="groupForm-input"/>
        <el-button type="primary" @click="init">搜索</el-button>
      </el-form-item>
      <el-form-item v-if="tabpanel === '2'" label="分组标识" prop="name" >
        <el-input v-model="groupForm.name" placeholder="请输入分组标识" class="groupForm-input"/>
        <el-button type="primary" @click="handleSubmit">新增</el-button>
      </el-form-item>
      <el-form-item label-width="0px">
        <el-table :data="groupList" :height="300" border>
          <el-table-column label="id" prop="id" width="55"/>
          <el-table-column label="名称" prop="name">
            <template slot-scope="scope">
              <div v-if="!scope.row.is_edit">
                {{ scope.row.name }}
                <el-button type="primary" style="float:right" @click="scope.row.is_edit = true">修改</el-button>
              </div>
              <div v-else>
                <el-input v-model="scope.row.name" placeholder="名称" class="groupForm-input"/>
                <el-button type="" @click="scope.row.is_edit = false">取消</el-button>
                <el-button type="primary" style="margin-left:0" @click="handleEdit(scope.row)">确定</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <Pagination :total="pagination.total" :page="pagination.page" :limit="pagination.per_page" layout="total, sizes, prev, pager, next" @pagination="handlePagination" />
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button type="info" @click="handleClose">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import Pagination from '@/components/Pagination'
export default {
  components: { Pagination },
  data() {
    return {
      open: false,
      loading: false,
      groupForm: {
        name: '',
        keyword: ''
      },
      tabpanel: '1',
      groupList: [],
      pagination: {
        page_sizes: [10, 20, 50, 100],
        page: 1,
        per_page: 10,
        total: 0
      },
      rules: {
        keyword: [],
        name: [{ required: true, message: '请输入分组标识', trigger: ['change', 'blur'] }]
      }
    }
  },
  methods: {
    handleOpen() {
      this.$nextTick(() => {
        this.tabpanel = '1'
        setTimeout(() => {
          this.$refs.groupForm && this.$refs.groupForm.resetFields()
        }, 500)
        this.init()
        this.open = true
      })
    },
    init() {
      this.pagination.page = 1
      this.pagination.per_page = 10
      this.handleLoadGroup()
    },
    handleLoadGroup() {
      this.loading = true
      const params = {
        page: this.pagination.page, per_page: this.pagination.per_page
      }
      if (this.groupForm.keyword) params.keyword = this.groupForm.keyword
      this.InvokeDispApi.get('/ip/group/list', params).then(res => {
        const list = JSON.parse(JSON.stringify(res.list))
        list.forEach(i => {
          i.is_edit = false
        })
        this.groupList = list
        this.pagination.total = res.total
        setTimeout(() => {
          this.loading = false
        }, 1000)
      }).catch(e => {
        this.loading = false
      })
    },
    handlePagination(params) {
      this.pagination.page = params.page
      this.pagination.per_page = params.pre_page
      this.handleLoadGroup()
    },
    handleClose() {
      this.open = false
      this.$emit('handleLoad')
    },
    handleEdit(row) {
      if (!row.id || !row.name) {
        this.message.warning('请填写分组标签名称!')
        return
      }
      this.InvokeDispApi.post('/ip/group/save', { id: row.id, pid: row.pid, name: row.name }).then(res => {
        this.Message('ACTION_SUCCESS')
        this.init()
      })
    },
    handleSubmit() {
      this.$refs.groupForm.validate((valid) => {
        if (valid) {
          if (!this.groupForm.name) {
            this.message.warning('请填写分组标签名称!')
            return
          }
          this.InvokeDispApi.post('/ip/group/save', { name: this.groupForm.name }).then(res => {
            this.Message('ACTION_SUCCESS')
            this.init()
          })
        }
      })
    }
  }
}
</script>
