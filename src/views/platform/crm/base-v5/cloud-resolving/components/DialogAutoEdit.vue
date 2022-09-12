<style lang="postcss" scoped>
.dialog-base-edit-auto {
  .dialog-form {
    margin: 5px;
    .dialog-form-item {
    }
    .dialog-form-input {
      width: 250px;
    }
  }
  .msg {
    color: red;
    width: 350px;
    display: inline-block;
    margin-left: 20px;
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
    class="dialog-base-edit-auto"
    aside
    @close="handleClose('reportForm')"
  >
    <DmScroll>
      <el-form
        ref="reportForm"
        :model="reportForm"
        :rules="rules"
        label-position="left"
        label-width="140px"
        size="mini"
        class="dialog-form"
      >
        <h3>域名</h3>
        <hr>
        <el-form-item
          label=""
          label-width="0"
          prop="email"
        >
          <el-input
            v-model="reportForm.email"
            placeholder="请输入用户邮箱"
            style="width:95%"
          />
        </el-form-item>
        <el-form-item
          label=""
          label-width="0"
          prop="domain_text"
        >
          <el-input
            :autosize="{ minRows: 2, maxRows: 10}"
            v-model="reportForm.domain_text"
            type="textarea"
            style="width:95%"
            placeholder="请输入要匹配的域名，使用回车分割多个域名！"
          />
        </el-form-item>
        <el-form-item
          label=""
          label-width="0"
        >
          <el-button
            type="primary"
            @click="handleAuto"
          >匹配</el-button>
          <h5 class="msg">支持最新1000条数据根据域名数据自动匹配批量修改状态</h5>
        </el-form-item>
        <h3>自动匹配域名列表</h3>
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
              :height="400"
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
                width="80"
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
import * as Utils from '@/utils/index'
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
      reportForm: { useyundun: '1', domain_text: '', email: '' },
      USEYUNDUN: FORM.USEYUNDUN,
      tag_type: FORM.tag_type,

      rules: {
        email: [{ required: true, message: '请输入用户邮箱！', trigger: ['change', 'blur'] }],
        domain_text: [{ required: true, message: '请输入要匹配的域名，使用回车分割多个域名！', trigger: ['change', 'blur'] }]
      }
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
        this.reportForm = { useyundun: '1', domain_text: '' }
        this.list = []
        setTimeout(() => {
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

    getDomainList() {
      const domain = this.reportForm.domain_text.trim()
      const domain_text = (domain).split('\n')

      return domain_text
    },

    async handleAuto() {
      this.$refs.reportForm.validate((valid) => {
        if (valid) {
          const domain_text = this.getDomainList()
          this.list = []
          this.loading = true
          this.InvokeAllApi.post('/V4/CloudDns.Domain.DnsDomain.getList', { email: this.reportForm.email, page: 1, per_page: 1000 }).then(res => {
            const list = Utils.deepClone(res.list)
            list.forEach(item => {
              if (domain_text.indexOf(item.domain) > -1) {
                this.list.push(item)
                this.$refs.columnList.toggleRowSelection(item, true)
              }
            })
            setTimeout(() => {
              this.loading = false
            }, 1000)
          }).catch(e => {
            this.loading = false
          })
        }
      })
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
            this.Message('ACTION_SUCCESS')
            this.loading = false
            this.open = false
          }).catch(e => {
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
