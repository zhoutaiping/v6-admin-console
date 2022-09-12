<style lang="postcss" scoped>
.line-edit {
  .line-edit-dialog {
    .line-dialog-form {
      padding: 5px;
      .line-dialog-item {
        margin-bottom: 0px;
      }
      .line-dialog-input {
        width: 300px;
      }
    }
    .border-bottom {
      border-bottom: 1px solid #66666650;
      padding-bottom: 15px;
    }
    .border-top {
      border-top: 1px solid #66666650;
      padding-top: 10px;
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
      :title="title_text[panelType]"
      :visible.sync="open"
      :close-on-click-modal="true"
      :close-on-press-escape="true"
      width="500px"
      class="line-edit-dialog"
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
          class="line-dialog-form"
        >
          <el-form-item
            v-show="panelType!=='add' && panelType!=='next'"
            label="ID"
            prop="id"
          >
            {{ setForm.id }}
          </el-form-item>
          <el-form-item
            v-show="panelType!=='add' && setForm.pname"
            label="父节点"
            prop="pid"
          >
            {{ setForm.pname }}({{ setForm.pid }})
          </el-form-item>
          <el-form-item
            label="线路名称"
            prop="name"
          >
            <el-input
              v-model="setForm.name"
              class="line-dialog-input"
            />
          </el-form-item>
          <el-form-item
            label="线路标识"
            prop="key"
          >
            <el-input
              v-model="setForm.key"
              class="line-dialog-input"
            />
          </el-form-item>
          <el-form-item
            label="状态"
            prop="status"
          >
            <el-radio-group v-model="setForm.status">
              <el-radio-button :label="1">启用</el-radio-button>
              <el-radio-button :label="0">禁用</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item
            label="排序"
            prop="sort"
          >
            <el-input-number
              v-model="setForm.sort"
              :min="1"
              controls-position="right"
              placeholder=""
            />
          </el-form-item>
          <el-form-item
            label="备注"
            prop="remark"
          >
            <el-input
              v-model="setForm.remark"
              type="textarea"
              placeholder="请输入备注"
              class="line-dialog-input"
            />
          </el-form-item>
        </el-form>
      </DmScroll>
      <div slot="footer">
        <el-button
          type="info"
          @click="handleClose"
        >取消</el-button>
        <el-button
          type="primary"
          @click="handleSubmint"
        >确定</el-button>
      </div>
    </FDialog>
  </div>
</template>

<script>
import * as Form from './form'
import { RULES } from '../form'
export default {
  data() {
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
        pname: '',
        name: '',
        key: '',
        sort: 0,
        status: 1,
        // back_ips: '',
        line: '',
        remark: ''
      },
      LINE: [{ label: '线路1', value: '1' }],
      rules: RULES
    }
  },

  methods: {
    handleOpen(data, type) {
      this.$nextTick(() => {
        this.resetForm('setForm')
        this.panelType = type
        if (type !== 'add') this.getInfo({ id: data.id }, type)
        this.open = true
      })
    },
    getInfo(params, type) {
      this.InvokeDispApi.get('/line/info', params).then(res => {
        const data = JSON.parse(JSON.stringify(res)) || {}
        this.setForm.id = type === 'edit' ? data.info.id : ''
        this.setForm.pid = type === 'edit' ? data.parent.id : data.info.id
        if (type === 'next') this.setForm.pname = data.info.name
        if (type === 'edit') {
          this.setForm.id = data.info.id
          this.setForm.name = data.info.name
          this.setForm.pname = data.parent.name || ''
          this.setForm.key = data.info.key
          this.setForm.status = data.info.status
          this.setForm.sort = data.info.sort
          this.setForm.remark = data.info.remark
        }
      })
    },
    handleCloseTag(tag) {
      this.P_TAG.splice(this.P_TAG.indexOf(tag), 1)
    },
    resetForm(formName) {
      if (this.$refs.setForm !== undefined) this.$refs.setForm.resetFields()
    },
    handleClose() {
      if (this.$refs.setForm) {
        this.open = false
      }
    },

    handleSubmint() {
      const params = this.getParams()
      this.$refs.setForm.validate((valid) => {
        if (valid) {
          if (!params) return
          this.InvokeDispApi.post('/line/save', params).then(res => {
            this.Message('ACTION_SUCCESS')
            this.$emit('handleLoad')
            this.open = false
          })
        }
      })
    },
    checkIP() {
      const ip_Item_text = (this.setForm.back_ips.trim()).split('\n')
      const ip = []
      let ip_check = true
      ip_Item_text.forEach(i => {
        if (i) {
          const i_ip = i.split('-')
          if (i_ip.length === 1) {
            if (Form.isIp(i_ip[0])) {
              ip.push(i_ip[0])
            } else {
              this.message.warning('IP格式不正确!')
              ip_check = false
              return
            }
          } else if (i_ip.length === 2) {
            const max_number = Number(i_ip[1])
            const ip_item = i_ip[0].split('.')
            const last_number = Number(ip_item[3])
            if (!Form.isIp(i_ip[0])) {
              this.message.warning('IP段格式不正确!')
              ip_check = false
              return
            }
            if (last_number >= max_number || max_number > 255) {
              this.message.warning('IP段格式不正确!')
              ip_check = false
              return
            }
            ip.push(i)
          }
        }
      })
      const set = new Set(ip)
      const newArrIP = Array.from(set)
      if (!ip_check) return
      if (!newArrIP.length) {
        this.message.warning('请填写IP!')
        return
      }
      return newArrIP
    },
    getParams() {
      const params = {
        name: this.setForm.name,
        key: this.setForm.key,
        status: this.setForm.status,
        // back_ips: newArrIP,
        remark: this.setForm.remark
      }
      if (this.panelType !== 'add' && this.panelType !== 'next') params.id = Number(this.setForm.id) || 0
      if (this.panelType !== 'add') params.pid = Number(this.setForm.pid) || 0
      return params
    }
  }
}
</script>
