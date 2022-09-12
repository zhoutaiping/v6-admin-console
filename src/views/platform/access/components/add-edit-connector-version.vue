<style lang="scss" scoped>
.input-box {
  width: 300px;
}
.item-box {
  margin-bottom: 5px;
}
.file-box {
  background-color: #fff;
  border: 1px solid #c0ccda;
  line-height: 20px;
  padding: 10px 20px 10px 10px;
  margin-top: 10px;
  height: auto;
  white-space: normal;
  word-wrap: break-word;
  word-break: unset;
}
::v-deep .el-tag .el-icon-close {
  position: absolute;
  top: 20%;
  right: 50px;
}
::v-deep .el-input-number.is-without-controls .el-input__inner {
  text-align: left;
}
</style>
<template>
  <div>
    <dm-dialog
      ref="dialog"
      :fetch-submit="fetchSubmit"
      :mode="mode"
      :title-label="mode === 'Edit'?'备注':'连接器版本'"
      width="500px"
    >
      <el-form
        ref="Form"
        :model="form"
        :rules="rules"
        label-position="left"
        label-width="140px"
      >
        <el-form-item
          label="版本号"
          prop="version"
          class="item-box"
        >
          <el-input
            v-model="form.version"
            :readonly="mode === 'Edit'"
            clearable
            placeholder="版本号"
            class="input-box"
          />
        </el-form-item>
        <!-- <el-form-item
          v-if="mode !== 'Edit'"
          label="openresty"
          prop="openresty"
          class="item-box"
        >
          <el-tag
            v-if="form.openresty"
            closable
            class="input-box file-box"
            @close="e =>{
              openrestyList = []
              form.openresty = ''
            }"
          >
            {{ form.openresty }}
          </el-tag>
          <el-upload
            v-else
            ref="upload"
            :action="''"
            :on-preview="preview"
            :on-change="(file, fileList) =>{
              fileChange(file, fileList, 'openresty')
            }"
            :limit="1"
            :file-list="openrestyList"
            :show-file-list="false"
            :auto-upload="false"
            list-type="picture"
            class="upload-demo"
          >
            <el-button
              slot="trigger"
              size="mini"
              type="primary"
              style="margin:1px;"
            >{{ form.openresty ? '重新上传' :'上传' }}</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item
          v-if="mode !== 'Edit'"
          label="Web Terminal"
          prop="webTerminal"
          class="item-box"
        >
          <el-tag
            v-if="form.webTerminal"
            closable
            class="input-box file-box"
            @close="e =>{
              webTerminalList = []
              form.webTerminal = ''
            }"
          >
            {{ form.webTerminal }}
          </el-tag>
          <el-upload
            v-else
            ref="upload"
            :action="''"
            :on-preview="preview"
            :on-change="(file, fileList) =>{
              fileChangeWebTerminal(file, fileList, 'webTerminal')
            }"
            :limit="1"
            :file-list="webTerminalList"
            :show-file-list="false"
            :auto-upload="false"
            list-type="picture"
            class="upload-demo"
          >
            <el-button
              slot="trigger"
              size="mini"
              type="primary"
              style="margin:1px;"
            >{{ form.webTerminal ? '重新上传' :'上传' }}</el-button>
          </el-upload>
        </el-form-item> -->

        <el-form-item
          v-if="mode !== 'Edit'"
          label="Connector升级包"
          prop="connector"
          class="item-box"
        >
          <el-tag
            v-if="form.connector"
            closable
            class="input-box file-box"
            @close="e =>{
              connectorList = []
              form.connector = ''
            }"
          >
            {{ form.connector }}
          </el-tag>
          <el-upload
            v-else
            ref="upload"
            :action="''"
            :on-preview="preview"
            :on-change="(file, fileList) =>{
              fileChangeConnector(file, fileList, 'connector')
            }"
            :limit="1"
            :file-list="connectorList"
            :show-file-list="false"
            :auto-upload="false"
            list-type="picture"
            class="upload-demo"
          >
            <el-button
              slot="trigger"
              size="mini"
              type="primary"
              style="margin:1px;"
            >{{ form.connector ? '重新上传' :'上传' }}</el-button>
            <p slot="tip">支持 .tgz .tar.gz 文件格式</p>
          </el-upload>
        </el-form-item>
        <el-form-item
          label="备注"
          prop="remarks"
          class="item-box"
        >
          <el-input
            v-model="form.remarks"
            :rows="2"
            type="textarea"
            class="input-box"
          />
        </el-form-item>
      </el-form>
    </dm-dialog>
  </div>
</template>
<script>
import mealSource from '@/api/mealApi'
export default {
  data() {
    return {
      mode: 'Create',
      openrestyList: [],
      webTerminalList: [],
      connectorList: [],
      default_form: {
        version: '',
        openresty: '',
        webTerminal: '',
        connector: '',
        remarks: ''
      },
      form: {},
      rules: {
        version: [{ required: true, message: ' ' }],
        openresty: [],
        webTerminal: [],
        connector: [{ required: true, message: ' ' }],
        remarks: []
      }
    }
  },

  methods: {
    handleOpen(data, option = 'Create') {
      this.mode = option
      this.openrestyList = []
      this.webTerminalList = []
      this.connectorList = []
      this.$nextTick(() => {
        this.$refs.dialog.handleOpen()
        this.form = Object.assign({}, this.default_form)
        if (this.$refs.Form) {
          this.$refs.Form.resetFields()
        }
        if (option === 'Edit') {
          this.form = Object.assign({}, data)
        }
      })
    },
    preview() {},
    fileChange(file, fileList, key) {
      this.openrestyList = fileList
      const paramsData = new FormData()
      paramsData.append('keyFiele', file.raw)
      this.upFile(paramsData, 'keyFiele', key)
    },
    fileChangeConnector(file, fileList, key) {
      console.log(file)
      this.connectorList = fileList
      const paramsData = new FormData()
      paramsData.append('keyFiele', file.raw)
      this.upFile(paramsData, 'keyFiele', key)
    },
    fileChangeWebTerminal(file, fileList, key) {
      this.webTerminalList = fileList
      const paramsData = new FormData()
      paramsData.append('keyFiele', file.raw)
      this.upFile(paramsData, 'keyFiele', key)
    },
    async upFile(params, fileUrl, key) {
      const data = await mealSource.ServiceUpload(params)
      if (data[fileUrl]) {
        this.message.success('上传成功')
        this.$set(this.form, key, data[fileUrl])
      } else {
        this.message.warning('上传失败')
      }
    },
    fetchSubmit() {
      this.$refs.Form.validate((valid) => {
        if (valid) {
          let api = ''
          let data = {}
          if (this.mode === 'Create') {
            data = {
              ...this.form
            }
            api = '/fd/V4/zero.trust.connector.version.add'
          } else if (this.mode === 'Edit') {
            data = {
              version_id: this.form.version_id,
              remarks: this.form.remarks
            }
            api = '/fd/V4/zero.trust.connector.version.edit.remarks'
          }

          this.Fetch.post(api, data).then(res => {
            this.Message('ACTION_SUCCESS')
            this.$emit('init')
            this.$refs.dialog.handleClose()
          }).catch(e => {
            this.$refs.dialog.afterValidate()
          })
        } else {
          this.$refs.dialog.afterValidate()
        }
      })
    }
  }
}
</script>
