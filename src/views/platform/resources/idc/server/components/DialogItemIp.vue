<style lang="postcss" scoped>
.server-edit {
  .server-edit-dialog {
    .server-dialog-form {
      margin: 5px;
      .server-dialog-item {
        display: inline-block;
        margin-bottom: 5px;
      }
      .server-dialog-input {
        width: 300px;
      }
      .server-dialog-input2 {
        width: 105px;
      }
      .ip_item_button {
        margin-top: 10px;
        margin-left: 0px;
      }
      .add_ip_button {
        width: 90%;
        margin: 0 auto;
        background: #ecf5ff;
        border-color: #b3d8ff;
      }
    }
  }
}
</style>

<template>
  <div class="server-edit">
    <FDialog
      :title="'子IP'"
      :visible.sync="open"
      :close-on-click-modal="true"
      :close-on-press-escape="true"
      size="600"
      aside
      class="server-edit-dialog"
      @close="handleClose"
    >
      <DmScroll>
        <el-form
          v-loading="ip_item_loading"
          ref="serverForm_ip_Item"
          :model="serverForm_ip_Item"
          :rules="rules2"
          label-position="left"
          label-width="120px"
          size="mini"
          class="server-dialog-form"
        >
          <el-form-item
            v-if="!add_ip_item"
            label=""
            label-width="0px"
          >
            <ElButton
              v-if="panelType!=='info'"
              type="primary"
              size="mini"
              icon="el-icon-plus"
              @click="add_ip_item = true"
            >新增子IP</ElButton>
            <ElButton
              v-if="panelType!=='info'"
              :disabled="!ip_item_sel.length"
              type=""
              icon="el-icon-delete"
              @click="handleDelIpItem(null,'batch')"
            >删除</ElButton>
          </el-form-item>
          <el-form-item
            v-if="add_ip_item"
            label="+新增子IP"
            class="server-dialog-item"
          />
          <el-form-item
            v-if="add_ip_item"
            label=""
            label-width="0px"
            style="border-top:1px solid #66666650;padding-top:10px;"
          >
            <el-input
              v-model="serverForm_ip_Item.ip_item"
              type="textarea"
              placeholder="例：127.0.0.1 或 127.0.0.1-10多个IP，换行分隔"
            />
            <ElButton
              :disabled="!serverForm_ip_Item.ip_item"
              type="primary"
              size="mini"
              class="ip_item_button"
              @click="handleAddIpItem"
            >新增</ElButton>
            <ElButton
              type=""
              size="mini"
              class="ip_item_button"
              @click="add_ip_item = false"
            >取消</ElButton>
          </el-form-item>
          <el-form-item
            label=""
            label-width="0px"
          >
            <el-table :data="ip_item" :max-height="500" border @selection-change="changeIpItem" >
              <el-table-column type="selection" width="55" />
              <el-table-column label="子IP" prop="ip" />
              <el-table-column label="协议" prop="ip_version" >
                <template slot-scope="scope">
                  IPv{{ scope.row.ip_version }}
                </template>
              </el-table-column>
              <el-table-column label="IP类型">
                <template slot-scope="scope">
                  {{ line_type[scope.row.ip_type] }}
                </template>
              </el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <ElButton
                    v-if="panelType!=='info'"
                    type=""
                    icon="el-icon-delete"
                    @click="handleDelIpItem(scope.row,'one')"
                  >删除</ElButton>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
          <el-form-item v-if="errorData.length" label="异常IP" >
            <el-tag
              v-for="(tag, index) in errorData"
              :key="index"
              type="danger"
              style="margin:2px;"
            > {{ tag.ip }}
            </el-tag>
          </el-form-item>
        </el-form>
      </DmScroll>
    </Fdialog>
  </div>
</template>

<script>
import * as Form from './form'
import { isArray } from '@/utils/array'
export default {
  data() {
    return {
      open: false,
      loading: false,
      ip_item_loading: false,
      panelType: 'add',
      serverForm: Form.serverForm,
      serverForm_ip_Item: Form.serverForm_ip_Item,
      rules2: Form.rules2,
      OS: Form.OS,
      IDC_HOUSE: Form.IDC_HOUSE,
      TYPE: Form.TYPE,
      DISK_TYPE: Form.DISK_TYPE,
      SIZE_UNIT: [{ label: 'GB', value: 'GB' }, { label: 'TB', value: 'TB' }],
      rules: Form.rules,
      add_ip_item: false,
      ip_item: [],
      ip_item_sel: [],
      HOUSE: [],
      line_type: { 1: '外网', 2: '内网' },
      errorData: [],
      server_id: ''
    }
  },

  methods: {
    handleOpen(data, type, HOUSE) {
      this.$nextTick(() => {
        setTimeout(() => {
          this.resetForm()
        }, 0)
        this.add_ip_item = false
        this.serverForm_ip_Item.ip_item = ''
        this.errorData = []
        this.server_id = data.id
        this.getServerIp(data.id)
        this.open = true
      })
    },
    getServerIp(id) {
      const params = {
        'server_id': id || this.server_id,
        'use_type': -1,
        'page': 1,
        'per_page': 9999
      }
      this.ip_item_loading = true
      this.InvokeAssetApi.get('/serverIp/list', params).then(res => {
        const list = JSON.parse(JSON.stringify(res.list))
        this.ip_item = list
        setTimeout(() => {
          this.ip_item_loading = false
        }, 500)
      }).catch(() => {
        this.ip_item = []
        setTimeout(() => {
          this.ip_item_loading = false
        }, 500)
      })
    },

    checkDisk(list) {
      const re = /^[0-9]+.?[0-9]*$/ // 判断字符串是否为数字 //判断正整数 /^[1-9]+[0-9]*]*$/
      let check = true
      list.forEach((i, index) => {
        if (isNaN(i.size) || !re.test(i.size)) {
          this.message.warning('硬盘' + (index + 1) + '容量请填写数字!')
          check = false
          return false
        } else if (Number(i.size) === 0) {
          this.message.warning('硬盘' + (index + 1) + '容量不能为0!')
          check = false
          return false
        } else if (index === 9) {
          this.message.warning('硬盘扩展不能超过10块!')
          check = false
          return false
        }
      })
      return check
    },
    handleAddIpItem() {
      const ip_Item_text = (this.serverForm_ip_Item.ip_item.trim()).split('\n')
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

            for (let c = last_number; c < max_number + 1; c++) {
              const item = ip_item[0] + '.' + ip_item[1] + '.' + ip_item[2] + '.' + c
              ip.push(item)
            }
          }
        }
      })
      const set = new Set(ip)
      const newArrIP = Array.from(set)
      if (!ip_check) {
        return
      }
      if (!newArrIP.length) {
        this.message.warning('请填写IP!')
        return
      }
      const params = {
        server_id: this.server_id,
        ips: newArrIP
      }
      this.handleServerIpAdd(params)
    },

    changeIpItem(val) {
      this.ip_item_sel = val || []
    },

    handleDelIpItem(row, type) {
      const sel = type === 'batch' ? this.ip_item_sel : [row]
      if (!sel.length) return
      const params = {
        ids: []
      }
      sel.forEach(i => {
        params.ids.push(i.id)
      })
      this.errorData = []
      this.InvokeAssetApi.post('/serverIp/del', params).then(res => {
        this.Message('ACTION_SUCCESS')
        this.getServerIp()
      }).catch((errData) => {
        if (isArray(errData)) this.errorData = errData
      })
    },

    resetForm(formName) {
      this.$nextTick(() => {
        this.$refs.serverForm_ip_Item && this.$refs.serverForm_ip_Item.resetFields()
      })
    },

    handleClose() {
      if (this.$refs.serverForm) {
        this.open = false
        this.$emit('handleLoad')
      }
    },
    handleServerIpAdd(params) {
      this.InvokeAssetApi.post('/serverIp/add', params).then(res => {
        this.message.success('新增子Ip成功!')
        this.serverForm_ip_Item.ip_item = ''
        this.errorData = []
        this.getServerIp()
      })
    }
  }
}
</script>
