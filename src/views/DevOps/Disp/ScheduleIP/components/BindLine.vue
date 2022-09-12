<style lang="postcss" scoped>
.line-edit {
  .bind-line-dialog {
    .bind-form {
      padding: 5px;
      height: auto;

    }
    .bind-item {
      margin-bottom: 0px;
    }
    .bind-input {
      width: 300px;
    }
    .border-bottom {
      /* border-bottom: 1px solid #66666650; */
    }
    .border-top {
      /* border-top: 1px solid #66666650; */
    }
    .ipTag {
      width: 93%;
      margin: 5px 0 5px;
      min-height: 45px;
      max-height: 300px;
      background: #ecf5ff;
      border: 1px solid #b3d8ff;
    }
  }
}
</style>

<template>
  <div class="line-edit">
    <FDialog
      :visible.sync="open"
      :close-on-click-modal="true"
      :close-on-press-escape="true"
      title="绑定线路"
      size="500"
      aside
      class="bind-line-dialog"
      @close="handleClose"
    >
      <DmScroll>
        <el-form
          ref="setForm"
          :model="setForm"
          :rules="rules"
          label-position="left"
          label-width="120px"
          size="mini"
          class="bind-form"
        >
          <el-form-item
            label=""
            label-width="0px;"
            class="bind-item"
          >
            <el-card
              :body-style="{ padding: '5px' }"
              class="box-card"
              shadow="never"
            >
              <div
                slot="header"
                class="clearfix"
              >
                <span>已选IP ({{ P_TAG.length }} 个)</span>
                <div
                  v-if="ipTags.length > 1"
                  style="display: inline-block;float:right"
                >
                  <el-button
                    v-show="!is_edit"
                    type="primary"
                    plain
                    style="float:right;"
                    @click="is_edit = true"
                  >修改</el-button>
                  <el-button
                    v-show="is_edit"
                    type="primary"
                    style="float:right;margin-left:5px;"
                    @click="is_edit = false"
                  >确定</el-button>
                  <el-button
                    v-show="is_edit"
                    type="primary"
                    plain
                    style="float:right;"
                    @click="is_edit = false"
                  >取消</el-button>
                  <el-input
                    v-show="is_edit"
                    v-model="setForm.add_tag"
                    placeholder="请输入IP/IP段"
                    style="float:right;width:160px;"
                  />
                  <el-select
                    v-show="is_edit"
                    v-model="setForm.type"
                    placeholder=""
                    style="float:right;width:130px"
                  >
                    <el-option
                      v-for="(item, index) in TYPE"
                      :key="index"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </div>
              </div>
              <el-tag
                v-for="(tag, index) in P_TAG"
                :key="index"
                :closable="is_edit"
                style="margin: 2px;"
                @close="handleCloseTag(tag)"
              >
                {{ tag }}
              </el-tag>
            </el-card>
          </el-form-item>
          <CardLayout
            title="线路"
          >
            <div slot="layout">
              <el-tree
                ref="tree"
                :data="LINES"
                :default-checked-keys="setForm.line_ids"
                :default-expand-all="false"
                show-checkbox
                check-strictly
                node-key="id"/>
            </div>
          </CardLayout>
          <CardLayout
            v-if="setForm.line_ids.length"
            :title="'已选择线路' + $refs.tree.getCheckedNodes().length"
          >
            <div slot="layout">
              <el-tag v-for="tag in $refs.tree.getCheckedNodes()" :key="tag.id" :style="{'margin':'2px'}">
                {{ tag.label }}
              </el-tag>
            </div>
          </CardLayout>
        </el-form>
      </DmScroll>
      <div slot="footer">
        <el-button
          type="info"
          @click="handleClose"
        >取消</el-button>
        <el-button
          :disabled="loading"
          type="primary"
          @click="handleSubmint"
        >确定</el-button>
      </div>
    </FDialog>
  </div>
</template>

<script>
import * as Form from './form'
import { validateDomain } from '@/utils/validate'
export default {
  data() {
    const defalutTag = []
    const isValidateDomain = (rule, value, callback) => {
      if (!validateDomain(value)) {
        callback(new Error('请输入正确的域名'))
      } else {
        callback()
      }
    }
    return {
      open: false,
      loading: false,
      is_edit: false,
      title_text: {
        'add': '新增',
        'edit': '编辑',
        'next': '新增下级',
        'info': '详情'
      },
      panelType: 'add',
      setForm: {
        id: '',
        pid: '',
        domain: '',
        line_ids: [],
        status: 1,
        remark: ''
      },
      rules: {
        domain: [{ required: true, validator: isValidateDomain, trigger: ['change', 'blur'] }],
        line_ids: [{ required: true, message: '请选择线路', trigger: ['change', 'blur'] }],
        tags: [{ required: true, message: '请选择标签', trigger: ['change', 'blur'] }],
        status: [{ required: true, message: '选择状态', trigger: ['change', 'blur'] }],
        sort: [],
        remark: []
      },
      P_TAG: defalutTag,
      ipTags: defalutTag,
      TYPE: [{ label: '节点IP/IP段', value: '1' }, { label: '按主P批量添加', value: '2' }],
      LINES: []
    }
  },
  mounted() {
  },
  methods: {
    handleOpen(data, type) {
      this.loading = true
      this.open = true
      this.LINES = []
      this.getLine()
      this.$nextTick(() => {
        setTimeout(() => { this.resetForm('setForm') }, 200)
        setTimeout(() => {
          this.setForm.line_ids = []
          this.panelType = type
          if (type === 'bindline') {
            this.P_TAG = [data.ip]
            this.getInfo({ id: data.id })
          } else {
            const tag = []
            data.forEach(i => {
              tag.push(i.ip)
            })
            this.P_TAG = tag
          }
          this.loading = false
        }, 1000)
      })
    },
    getInfo(params = {}) {
      this.InvokeDispApi.get('/ip/info', params).then(res => {
        const lines = res.lines || {}
        this.setForm.line_ids = Form.ObjectArr(lines)
      })
    },
    getLine(params = {}) {
      this.InvokeDispApi.get('/line/tree', params).then(res => {
        const data = JSON.parse(JSON.stringify(res))
        const list = Form.getTreeList(data)
        this.LINES = list
      })
    },
    resetForm(formName) {
      if (this.$refs.setForm !== undefined) this.$refs.setForm.resetFields()
    },
    handleClose() {
      if (this.$refs.setForm) this.open = false
    },

    handleSubmint() {
      this.$refs.setForm.validate((valid) => {
        if (valid) {
          if (!this.P_TAG.length) {
            this.message.warning('IP不存在!')
            return
          }
          // if (!this.setForm.line_ids.length) {
          //   this.message.warning('请选择线路')
          //   return
          // }
          setTimeout(() => { this.handleBindLines() }, 500)
        }
      })
    },

    handleBindLines() {
      const line_ids = this.$refs.tree.getCheckedKeys().map(i => i.toString()) || []
      const params = { 'ips': this.P_TAG, line_ids: line_ids }
      this.loading = true
      this.InvokeDispApi.post('/ip/line/bind', params).then(res => {
        this.message.success('绑定线路成功')
        setTimeout(() => { this.loading = false }, 500)
        this.open = false
        this.$emit('handleLoad')
      })
    }
  }
}
</script>
<style lang="postcss" scoped>
.treeBtn {
  width: 100%;
  margin: 2px;
}
</style>
<style lang='postcss' rel='stylesheet/stylus' scoped>
.permission_toggleFold {
  vertical-align: middle;
  padding-right: 5px;
  font-size: 16px;
  cursor: pointer;
}
.permission_placeholder {
  content: " ";
  display: inline-block;
  width: 16px;
  font-size: 16px;
}
.init_table {
  margin: 0 auto !important;
}
</style>
