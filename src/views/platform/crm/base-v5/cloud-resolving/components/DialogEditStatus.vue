<style lang="postcss" scoped>
.dialog-base-edit-status {
  .dialog-form {
    margin: 5px;
    .dialog-form-item {
    }
    .dialog-form-input {
      width: 250px;
    }
  }
  .coupon-list-item {
    margin: 6px 0 6px 2px;
    border-left: 1px solid #dcdfe6;
    border-radius: 0;
  }
}
</style>
<template>
  <FDialog
    :title="title"
    :visible.sync="open"
    :close-on-click-modal="true"
    :close-on-press-escape="true"
    size="500"
    class="dialog-base-edit-status"
    aside
    @close="handleClose('reportForm')"
  >
    <DmScroll>
      <el-form
        ref="reportForm"
        :model="reportForm"
        label-position="left"
        label-width="140px"
        size="mini"
        class="dialog-form"
      >
        <h3>域名列表</h3>
        <hr>
        <el-form-item
          label=""
          label-width="0"
        >
          <DmTable>
            <el-table
              v-loading="loading"
              ref="columnList"
              :data="list"
              :height="500"
              @selection-change="selectChange"
            >
              <el-table-column
                label=""
                type="selection"
                width="60"
              />
              <el-table-column
                label="ID"
                prop="id"
                fixed="left"
                width="70"
                show-overflow-tooltip
              />
              <el-table-column
                label="域名"
                prop="domain"
                min-width="200"
                show-overflow-tooltip
              />
              <el-table-column
                label="域名状态"
                prop="status_desc"
                width="80"
              >
                <template slot-scope="scope">
                  <el-tag :type="tag_type[Number(scope.row.status)]">{{ scope.row.status_desc }}</el-tag>
                </template>
              </el-table-column>
            </el-table>
          </DmTable>
        </el-form-item>
        <el-form-item
          label="域名接入状态"
          class="dialog-form-item"
        >
          <el-select
            v-model="reportForm.useyundun"
            placeholder="域名接入状态"
            class="dialog-form-input"
          >
            <ElOption
              v-for="(item,key) in USEYUNDUN"
              :key="key"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-form>
    </DmScroll>
    <div
      slot="footer"
      class="dialog-footer"
    >
      <el-button
        type="info"
        @click="handleClose('reportForm')"
      >取 消</el-button>
      <el-button
        :disabled="loading"
        type="primary"
        @click="handleSubmit('reportForm')"
      >确 定</el-button>
    </div>
  </FDialog>
</template>

<script>
import * as FORM from './dialogForm'
import DmTable from '@/components/DmTable'
export default {
  components: { DmTable },
  data() {
    return {
      loading: false,
      open: false,
      list: [],
      select: [],
      title: '批量修改域名接入状态',
      reportForm: { useyundun: '1' },
      USEYUNDUN: FORM.USEYUNDUN,
      tag_type: FORM.tag_type
    }
  },
  watch: {
  },
  mounted() {
  },
  methods: {

    handleOpen(data) {
      this.$nextTick(() => {
        this.loading = true
        this.open = true
        this.reportForm = { useyundun: '1' }
        this.list = data
        setTimeout(() => {
          this.list.forEach(item => {
            this.$refs.columnList.toggleRowSelection(item, true)
          })
          this.loading = false
        }, 1000)
      })
    },

    handleClose(formName) {
      this.$refs[formName].resetFields()
      this.open = false
      this.$emit('loadGrid')
    },
    selectChange(val) {
      this.select = val
    },

    handleSubmit(formName) {
      if (!this.select.length) {
        this.message.warning('请选择数据')
        return
      }
      const domain_ids = []
      this.select.forEach(item => {
        domain_ids.push(item.id)
      })
      const params = {
        domain_ids: domain_ids,
        useyundun: this.reportForm.useyundun
      }
      this.loading = true
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.InvokeAllApi.post('/V4/CloudDns.Domain.useyundun.update', params).then(res => {
            this.loading = false
            this.Message('ACTION_SUCCESS')
            this.open = false
          }).catch(() => {
            this.loading = false
          })
        } else {
          this.loading = false
          return false
        }
      })
    }
  }

}
</script>
