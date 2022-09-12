<style lang="scss" scoped>

</style>

<template>
  <div>
    <el-table v-loading="loading" :data="data">
      <el-table-column label="ID" prop="id" width="55"/>
      <el-table-column label="认证类型" prop="edit_type">
        <template slot-scope="scope">
          {{ scope.row.customer_type }}
        </template>
      </el-table-column>
      <el-table-column label="认证名称" prop="customer_name"/>
      <el-table-column label="时间" prop="created_at"/>
      <el-table-column label="原因" prop="remark"/>
    </el-table>
    <Pagination
      :total="pagination.total"
      :page="pagination.page"
      :limit="pagination.per_page"
      @pagination="handlePagination"
    />
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      data: [],
      member_status: '',
      pagination: {
        page_sizes: [10, 20, 30, 50],
        page: 1,
        per_page: 10,
        total: 0
      }
    }
  },
  methods: {
    init() {
      const params = {
        email: this.member_status,
        page: this.pagination.page,
        per_page: this.pagination.per_page
      }
      this.loading = true
      this.InvokeAllApi.get('/fd/V4/customer.manage.editinfolist', params).then(res => {
        this.pagination.total = Number(res.count) || 0
        this.data = res.list
      })
      setTimeout(() => { this.loading = false }, 1000)
    },
    handleLoad(member_status) {
      this.pagination.page = 1
      this.pagination.per_page = 10
      this.member_status = member_status
      this.init()
    },
    handlePagination(params) {
      this.pagination.page = params.page
      this.pagination.per_page = params.pre_page
      this.init()
    }
  }
}
</script>
