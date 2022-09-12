<style lang="postcss" scoped>
.DialogDetail{
  .detail-from{
    margin: 5px;
    .detail-from-input{
      width: 300px;
    }
  }
}
</style>
<template>
  <DmDialog
    ref="dmdialog"
    :fetch-submit="handleSubmit"
    :title="titleText[type]"
    width="500px"
    aside
    class="DialogDetail"
  >
    <DmScroll>
      <el-form ref="detailForm" :model="detailForm" :rules="rules" label-width="110px" size="mini" class="detail-from">
        <ElFormItem label="转账流水号" class="detail-from-item" prop="flow_code">
          <el-input v-model="detailForm.flow_code" :readonly="type==='edit'" placeholder="转账流水号" class="detail-from-input"/>
        </ElFormItem>
        <ElFormItem label="收款来源" class="detail-from-item" prop="flow_source">
          <el-select v-model="detailForm.flow_source" :disabled="type==='edit'" placeholder="收款来源" clearable class="detail-from-input">
            <ElOption v-for="(item, index) in FLOW_SOURCE" :key="index" :label="item.label" :value="item.value"/>
          </el-select>
        </ElFormItem>
        <ElFormItem label="收款金额" class="detail-from-item" prop="flow_money">
          <el-input-number v-model="detailForm.flow_money" :min="0" controls-position="right" class="detail-from-input input-number"/>
        </ElFormItem>
        <ElFormItem label="收款时间" class="detail-from-item" prop="flow_time">
          <el-date-picker
            v-model="detailForm.flow_time"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择日期时间"
            class="detail-from-input"/>
        </ElFormItem>
        <ElFormItem label="收款人" class="detail-from-item" prop="flow_people">
          <el-input v-model="detailForm.flow_people" placeholder="收款人" class="detail-from-input"/>
        </ElFormItem>
        <ElFormItem label="收款截图" class="detail-from-item" prop="screen_pic">
          <el-popover v-if="detailForm.screen_pic_img" placement="left-start">
            <img :src="detailForm.screen_pic_img" class="image" style="height:500px;" alt="">
            <img slot="reference" :src="detailForm.screen_pic_img" class="image" style="height:150px;" alt="">
          </el-popover>
          <el-upload
            ref="upload"
            :action="url"
            :on-preview="handlePreview"
            :on-change="fileChange"
            :file-list="fileList"
            :show-file-list="false"
            :auto-upload="false"
            class="upload-demo">
            <el-button slot="trigger" size="mini" type="primary" style="margin-left:0px;">选取图片</el-button>
          </el-upload>
        </ElFormItem>
        <ElFormItem label="备注" class="detail-from-item" prop="remark">
          <el-input v-model="detailForm.remark" type="textarea" placeholder="备注" class="detail-from-input"/>
        </ElFormItem>
      </el-form>
    </DmScroll>
  </DmDialog>
</template>

<script>
import * as FORM from './dialogForm'
import collectionSource from '@/api/finance/collectionlogApi'
import mealSource from '@/api/mealApi'
export default {
  data() {
    return {
      type: 'save',
      titleText: {
        'save': '录入收款',
        'edit': '编辑收款'
      },
      url: '',
      fileList: [],
      detailForm: FORM.detailForm,
      rules: FORM.rules,
      FLOW_STATUS: FORM.FLOW_STATUS,
      FLOW_STATUS_TEXT: FORM.FLOW_STATUS_TEXT,
      FLOW_SOURCE_TEXT: FORM.FLOW_SOURCE_TEXT,
      FLOW_SOURCE: FORM.FLOW_SOURCE,
      FLOW_TYPE_TEXT: {
        1: '收款', 2: '打款', 3: '回款', 4: '退款'
      }
    }
  },
  mounted() {

  },
  methods: {
    handleOpen(type, data) {
      this.$refs.dmdialog.handleOpen()
      this.$nextTick(() => {
        this.$refs.detailForm && this.$refs.detailForm.resetFields()
        this.detailForm.loading = true
        this.detailForm.screen_pic_img = ''
        this.type = type || 'link'
        this.loadForm(type, data)
        setTimeout(() => {
          this.detailForm.loading = false
        }, 500)
      })
    },

    loadForm(type, data) {
      if (type !== 'edit') {
        return
      }

      this.InvokeAllApi.get('/V4/financial.flow.receive.list', { id: data.id }).then(res => {
        const line = res.list[0]
        if (line) {
          this.detailForm.flow_code = line.flow_code
          this.detailForm.flow_source = line.flow_source
          this.detailForm.flow_money = line.flow_money
          this.detailForm.flow_time = line.flow_time
          this.detailForm.flow_people = line.flow_people
          this.detailForm.screen_pic_img = line.screen_pic
          this.detailForm.screen_pic = line.screen_pic
          this.detailForm.remark = line.remark
        }
      }).catch(e => {
        const line = data
        if (line) {
          this.detailForm.flow_code = line.flow_code
          this.detailForm.flow_source = line.flow_source
          this.detailForm.flow_money = line.flow_money
          this.detailForm.flow_time = line.flow_time
          this.detailForm.flow_people = line.flow_people
          this.detailForm.screen_pic_img = line.screen_pic
          this.detailForm.screen_pic = line.screen_pic
          this.detailForm.remark = line.remark
        }
      })
    },

    handlePreview(file) {
    },
    fileChange(file, fileList) {
      this.detailForm.screen_pic = file.raw
      this.detailForm.screen_pic_img = file.url
      const paramsData = new FormData()
      paramsData.append('keyFiele', file.raw)
      this.upFile(paramsData, 'keyFiele')
    },

    upFile(params, fileUrl) {
      mealSource.ServiceUpload(params).then(res => {
        if (res[fileUrl]) {
          this.detailForm.screen_pic = res[fileUrl]
          this.detailForm.screen_pic_img = res[fileUrl]
          this.message.success('上传成功！')
        } else {
          this.detailForm.screen_pic = ''
          this.detailForm.screen_pic_img = ''
          this.message.warning('上传失败')
        }
      })
    },

    handleSubmit(formName = 'detailForm') {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (Number(this.detailForm.flow_money) <= 0) {
            this.message.warning('收款金额大于0')
            this.$refs.dmdialog.afterValidate()
            return
          }
          switch (this.type) {
            case 'save' :
              this.handleSave(this.getParams())
              break
            case 'edit' :
              this.handleEdit(this.getParams())
              break
          }
        } else {
          this.$refs.dmdialog.afterValidate()
        }
      })
    },
    getParams() {
      const paramsData = {
        'flow_code': this.detailForm.flow_code,
        'flow_money': this.detailForm.flow_money,
        'flow_time': this.detailForm.flow_time,
        'screen_pic': this.detailForm.screen_pic,
        'flow_source': this.detailForm.flow_source,
        'flow_people': this.detailForm.flow_people,
        'remark': this.detailForm.remark
      }

      return paramsData
    },

    handleSave(params) {
      this.detailForm.loading = true
      collectionSource.flowAdd(params).then(res => {
        this.detailForm.loading = false
        this.Message('ACTION_SUCCESS')
        this.$emit('loadGrid')
        this.$refs.dmdialog.handleClose()
      }).catch(e => { this.$refs.dmdialog.afterValidate() })
    },

    handleEdit(params) {
      this.detailForm.loading = true
      collectionSource.flowSave(params).then(res => {
        this.detailForm.loading = false
        this.Message('ACTION_SUCCESS')
        this.$emit('loadGrid')
        this.$refs.dmdialog.handleClose()
      }).catch(e => { this.$refs.dmdialog.afterValidate() })
    }
  }
}
</script>
