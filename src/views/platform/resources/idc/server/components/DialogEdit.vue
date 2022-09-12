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
      :title="title_text[panelType]"
      :visible.sync="open"
      :close-on-click-modal="true"
      :close-on-press-escape="true"
      size="600"
      aside
      class="server-edit-dialog"
      @close="handleClose"
    >
      <DmScroll>
        <el-tabs
          v-if="panelType ==='info'"
          v-model="tabpanel"
          @tab-click="tabClick"
        >
          <el-tab-pane
            label="属性"
            name="ip"
          />
          <el-tab-pane
            label="子IP"
            name="ip_item"
          />
        </el-tabs>
        <el-form
          v-show="tabpanel==='ip'"
          ref="serverForm"
          :model="serverForm"
          :rules="rules"
          label-position="left"
          label-width="120px"
          size="mini"
          class="server-dialog-form"
        >
          <el-form-item
            label="主IP"
            prop="ip"
          >
            <el-input
              v-model="serverForm.ip"
              :readonly="panelType !=='add'"
              placeholder="请输入IP"
              class="server-dialog-input"
            />
          </el-form-item>
          <el-form-item
            label=""
            class="server-dialog-item"
          >
            <el-checkbox
              v-model="serverForm.is_use"
              :disabled="panelType ==='info'"
              :true-label="1"
              :false-label="0"
            >同时作为业务IP使用</el-checkbox>
            <el-checkbox
              v-model="serverForm.clear_cache"
              :disabled="panelType ==='info'"
              :true-label="1"
              :false-label="0"
            >清理缓存</el-checkbox>
          </el-form-item>
          <el-form-item
            label="所属机房"
            prop="idc_house_id"
          >
            <el-select
              v-model="serverForm.idc_house_id"
              :disabled="panelType ==='info'"
              clearable
              filterable
              placeholder="请选择地区"
              class="server-dialog-input"
            >
              <el-option
                v-for="(item, index) in HOUSE"
                :key="index"
                :label="item.ukey"
                :value="Number(item.id)"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            label=""
            class="server-dialog-item"
          >
            <el-radio-group
              v-model="serverForm.use_type"
              :disabled="panelType ==='info'"
            >
              <el-radio :label="1">租用</el-radio>
              <el-radio :label="2">托管</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item
            label="服务器类型"
            prop="server_type"
          >
            <el-radio-group v-model="serverForm.server_type">
              <el-radio-button
                v-for="(item, index) in TYPE"
                :key="index"
                :disabled="panelType ==='info' && item.value !== serverForm.server_type"
                :label="item.value"
              >{{ item.label }}</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item
            label="机柜号"
            prop="idc_cabinet_code"
          >
            <el-input
              v-model="serverForm.idc_cabinet_code"
              :readonly="panelType ==='info'"
              placeholder="请输入唯一标识"
              class="server-dialog-input"
            />
          </el-form-item>
          <el-form-item
            label="交换机/路由器"
            prop="route"
          >
            <el-input
              v-model="serverForm.route"
              :readonly="panelType ==='info'"
              placeholder="请输入唯一标识"
              class="server-dialog-input"
            />
          </el-form-item>
          <el-form-item
            label="系统"
            prop="os"
          >
            <el-radio-group v-model="serverForm.os">
              <el-radio-button
                v-for="(item, index) in OS"
                :key="index"
                :disabled="panelType ==='info' && item.value !== serverForm.os"
                :label="item.value"
              >{{ item.label }}</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="服务器配置">
            <el-form-item
              label="CPU"
              label-width="60px"
              prop="cpu"
              style="display:inline-block;"
            >
              <el-input-number
                :step="1"
                :precision="0"
                :disabled="panelType ==='info'"
                v-model="serverForm.cpu"
                controls-position="right"
                placeholder=""
                class="server-dialog-input2"
              />
            </el-form-item>
            <el-form-item
              label="内存"
              label-width="60px"
              prop="memory"
              style="display:inline-block;margin-left:20px;"
            >
              <el-input-number
                :step="1"
                :precision="0"
                :disabled="panelType ==='info'"
                v-model="serverForm.memory"
                controls-position="right"
                placeholder=""
                class="server-dialog-input2"
              /> GB
            </el-form-item>
            <el-form-item
              label=""
              label-width="0px"
              style="border-top:1px solid #66666650;padding-top:10px;"
            >
              <div
                v-for="(item,index) in serverForm.DISK"
                :key="index"
              >
                <el-form-item
                  label=""
                  label-width="0"
                  class="server-dialog-item"
                >
                  <span style="width:75px; display:inline-block;">#硬盘{{ index+1 }} </span>
                  <el-input
                    v-model="item.size"
                    :readonly="panelType ==='info'"
                    placeholder=""
                    class="server-dialog-input2"
                    style="width:155px;"
                  >
                    <el-select
                      slot="append"
                      v-model="item.size_unit"
                      :disabled="panelType ==='info'"
                      placeholder=""
                      style="width:65px;"
                    >
                      <el-option
                        v-for="(record, r_indx) in SIZE_UNIT"
                        :key="r_indx"
                        :label="record.label"
                        :value="record.value"
                      />
                    </el-select>
                  </el-input>
                  <el-radio-group
                    v-model="item.type"
                    :disabled="panelType ==='info'"
                  >
                    <el-radio
                      v-for="(item, index) in DISK_TYPE"
                      :key="index"
                      :label="item.value"
                    >{{ item.label }}</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-button
                  v-if="serverForm.DISK.length > 1 && panelType!=='info'"
                  type="danger"
                  plain
                  circle
                  icon="el-icon-close"
                  style="margin-left:10px;"
                  @click="handleDisk('del',index)"
                />
              </div>
              <el-button
                v-if="panelType!=='info'"
                class="add_ip_button"
                @click="handleDisk('add')"
              > + </el-button>
            </el-form-item>
          </el-form-item>
          <el-form-item
            label="备注"
            prop="remark"
          >
            <el-input
              v-model="serverForm.remark"
              :readonly="panelType ==='info'"
              type="textarea"
              placeholder="请输入备注"
              class="server-dialog-input"
            />
          </el-form-item>
        </el-form>
        <el-form
          v-loading="ip_item_loading"
          v-if="panelType ==='info' && tabpanel==='ip_item'"
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
              :autosize="{ minRows: 4,maxRows:8}"
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
            <el-table
              :data="ip_item"
              :max-height="500"
              border
              @selection-change="changeIpItem"
            >
              <el-table-column
                type="selection"
                width="55"
              />
              <el-table-column
                label="子IP"
                prop="ip"
              />
              <el-table-column
                label="协议"
                prop="ip_version"
              >
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
          <el-form-item
            v-if="errorData.length"
            label="异常IP"
          >
            <el-tag
              v-for="(tag, index) in errorData"
              :key="index"
              type="danger"
              style="margin:2px;"
            > {{ tag.ip }}</el-tag>
          </el-form-item>
        </el-form>
      </DmScroll>
      <div slot="footer">
        <el-button
          v-if="tabpanel !== 'ip_item'"
          type="info"
          size="mini"
          @click="handleClose"
        >{{ panelType === 'info'?'关闭':'取消' }}</el-button>
        <el-button
          v-if="panelType !== 'info' && tabpanel !== 'ip_item'"
          type="primary"
          size="mini"
          @click="handleSubmint"
        >确定</el-button>
      </div>
    </FDialog>
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
      tabpanel: 'ip',
      title_text: { 'add': '新增', 'edit': '编辑', 'info': '详情' },
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
      errorData: []
    }
  },

  methods: {
    handleOpen(data, type, HOUSE) {
      this.$nextTick(() => {
        this.resetForm('serverForm')
        this.panelType = type
        this.tabpanel = 'ip'
        this.HOUSE = isArray(HOUSE) && HOUSE || []
        this.open = true
        if (type !== 'add') this.getInfo({ id: data.id })
      })
    },

    getInfo(params) {
      this.InvokeAssetApi.get('/server/info', params).then(res => {
        const data = JSON.parse(JSON.stringify(res))
        this.serverForm = {
          clear_cache: data.clear_cache,
          cpu: data.cpu,
          DISK: JSON.parse(data.disk) || [],
          id: data.id,
          idc_cabinet_code: data.idc_cabinet_code,
          idc_house_id: data.idc_house_id,
          ip: data.ip,
          is_use: data.is_use,
          memory: data.memory,
          os: data.os,
          remark: data.remark,
          route: data.route,
          server_type: data.server_type,
          use_type: data.use_type
        }
      })
    },
    getServerIp() {
      const params = {
        'server_id': this.serverForm.id,
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
    tabClick(tab) {
      if (tab.name === 'ip_item') {
        this.add_ip_item = false
        this.serverForm_ip_Item.ip_item = ''
        this.errorData = []
        this.getServerIp()
      }
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
    handleDisk(type, index) {
      if (type === 'del') {
        if (this.serverForm.DISK.length === 1) return
        this.serverForm.DISK = this.serverForm.DISK.filter((item, i_index) => i_index !== index)
        return
      }
      if (!this.checkDisk(this.serverForm.DISK)) return
      this.serverForm.DISK.push({
        size: 0,
        size_unit: 'GB',
        type: 'SATA'
      })
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
        server_id: this.serverForm.id,
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
        this.$refs[formName] && this.$refs[formName].resetFields()
        this.$refs.serverForm_ip_Item && this.$refs.serverForm_ip_Item.resetFields()
        if (this.serverForm && this.$refs[formName]) {
          this.serverForm.DISK = [{ size: 0, size_unit: 'GB', type: 'SATA' }]
        }
      })
    },

    handleClose() {
      if (this.$refs.serverForm) {
        this.open = false
      }
    },

    handleSubmint() {
      this.$refs.serverForm.validate((valid) => {
        if (valid) {
          if (this.panelType === 'add' && this.tabpanel === 'ip') this.handleAdd()
          if (this.panelType === 'edit' && this.tabpanel === 'ip') this.handleUpdate()
        }
      })
    },

    getAddParams() {
      if (!this.checkDisk(this.serverForm.DISK)) return null
      const params = {
        'ip': this.serverForm.ip,
        'idc_house_id': (+this.serverForm.idc_house_id) || 0,
        'idc_cabinet_code': this.serverForm.idc_cabinet_code,
        'use_type': (+this.serverForm.use_type) || 0,
        'server_type': this.serverForm.server_type,
        'is_use': this.serverForm.is_use,
        'clear_cache': this.serverForm.clear_cache,
        'route': this.serverForm.route,
        'os': this.serverForm.os,
        'cpu': this.serverForm.cpu,
        'disk': this.serverForm.DISK,
        'memory': this.serverForm.memory,
        'remark': this.serverForm.remark
      }
      if (this.serverForm.id) params.id = this.serverForm.id
      return params
    },
    handleAdd() {
      const params = this.getAddParams()
      if (!params) return
      this.InvokeAssetApi.post('/server/add', params).then(res => {
        this.Message('ACTION_SUCCESS')
        this.$emit('handleLoad')
        this.open = false
      })
    },

    handleServerIpAdd(params) {
      this.InvokeAssetApi.post('/serverIp/add', params).then(res => {
        this.message.success('新增子Ip成功!')
        this.serverForm_ip_Item.ip_item = ''
        if (this.panelType === 'add' && this.tabpanel === 'ip') {
          this.$emit('handleLoad')
          this.open = false
        }
        this.errorData = []
        this.getServerIp()
      })
    },
    handleUpdate() {
      const params = this.getAddParams()
      if (!params) return
      this.InvokeAssetApi.post('/server/update', params).then(res => {
        this.Message('ACTION_SUCCESS')
        if (this.tabpanel === 'ip') {
          this.$emit('handleLoad')
          this.open = false
        }
      })
    }
  }
}
</script>
