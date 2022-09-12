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
      title-label="连接器镜像"
      width="500px"
    >
      <el-form
        ref="Form"
        :model="form"
        :rules="rules"
        label-position="left"
        label-width="120px"
      >
        <el-form-item
          label="版本号"
          prop="version"
          class="item-box"
        >
          <el-input-number
            :readonly="mode === 'Edit'"
            v-model="form.version"
            :controls="false"
            clearable
            placeholder="版本号"
            class="input-box"
          />
        </el-form-item>
        <el-form-item
          label="镜像类型"
          prop="image_type"
          class="item-box"
        >
          <el-input
            v-model="form.image_type"
            :readonly="mode==='Edit'"
            class="input-box"
          />
        </el-form-item>
        <el-form-item
          label="镜像链接"
          prop="image_url"
          class="item-box"
        >
          <el-input
            v-model="form.image_url"
            class="input-box"
          />
          <!-- <el-tag
            v-show="form.image_url"
            closable
            class="input-box file-box"
            @close="form.image_url = ''"
          >
            {{ form.image_url }}
          </el-tag>
          <el-upload
            ref="upload"
            :action="''"
            :on-preview="() => {}"
            :on-change="(file, fileList) =>{
              fileChange(file, fileList, 'image_url')
            }"
            :limit="1"
            :file-list="image_url_list"
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
            >{{ form.image_url ? '重新上传' :'上传' }}</el-button>
          </el-upload> -->
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
  components: {},
  data() {
    return {
      mode: 'Create',
      default_form: {
        version: '',
        image_type: '',
        image_url: '',
        remarks: ''
      },
      image_url_list: [],
      form: {},
      rules: {
        version: [{ required: true, message: ' ' }],
        image_type: [{ required: true, message: ' ' }],
        image_url: [{ required: true, message: ' ' }],
        remarks: []
      }
    }
  },

  methods: {
    handleOpen(data, option = 'Create') {
      this.mode = option
      this.image_url_list = []
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
    fileChange(file, fileList, key) {
      const paramsData = new FormData()
      paramsData.append('keyFiele', file.raw)
      this.upFile(paramsData, 'keyFiele', key)
    },
    upFile(params, fileUrl, key) {
      mealSource.ServiceUpload(params).then(res => {
        if (res[fileUrl]) {
          this.message.success('上传成功')
          this.$set(this.form, key, res[fileUrl])
        } else {
          this.message.warning('上传失败')
          this.$set(this.form, key, '')
        }
      })
    },
    fetchSubmit() {
      this.$refs.Form.validate((valid) => {
        if (valid) {
          let api = ''

          if (this.mode === 'Create') {
            api = '/fd/V4/zero.trust.connector.image.add'
          } else if (this.mode === 'Edit') {
            api = '/fd/V4/zero.trust.connector.image.edit'
          }
          const data = {
            ...this.form
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
