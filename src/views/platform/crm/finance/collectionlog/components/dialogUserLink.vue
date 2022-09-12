<style lang="scss" scoped>
.UserLink-from{
    margin: 10px 0;
    .UserLink-from-item {
      margin-bottom: 5px;
    }
    .UserLink-from-input{
      width: 225px;
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
    class="DialogUserLink"
  >
    <template>
      <el-form ref="userLink" :model="userLink" :rules="rules" label-width="110px" label-position="left" class="UserLink-from">
        <el-form-item :label="linkMsg[msgtype]" label-width="600px" class="UserLink-from-item"/><hr>
        <el-form-item label="流水号" class="UserLink-from-item">
          <el-input v-model="userLink.record.flow_code" :readonly="true" placeholder="" class="UserLink-from-input"/>
        </el-form-item>
        <el-form-item label="流水类型" class="UserLink-from-item">
          <el-input v-model="FLOW_TYPE_TEXT[userLink.record.flow_type]" :readonly="true" placeholder="" class="UserLink-from-input"/>
        </el-form-item>
        <el-form-item label="流水金额" class="UserLink-from-item">
          <el-input v-model="userLink.record.flow_money" :readonly="true" placeholder="" class="UserLink-from-input"/>
        </el-form-item>
        <el-form-item label="收款来源" class="UserLink-from-item">
          <el-input v-model="FLOW_SOURCE_TEXT[userLink.record.flow_source]" :readonly="true" placeholder="" class="UserLink-from-input"/>
        </el-form-item>
        <el-form-item label="关联邮箱" prop="member_email">
          <el-select
            v-model="userLink.member_email"
            :remote-method="remoteMethod"
            :disabled="type === 'unlink'"
            :loading="user_type_loading"
            filterable=""
            remote
            clearable
            reserve-keyword
            placeholder="请输入云盾注册用户邮箱"
            class="UserLink-from-input"
            @change="handleAccount">
            <el-option v-for="(item, key) in user_type_list" :key="key" :label="item.label" :value="item.label"/>
          </el-select>
        </el-form-item>
        <el-form-item label="客户名称" class="UserLink-from-item">
          <el-input v-model="userLink.record.member_basic_name" :readonly="true" placeholder="" class="UserLink-from-input"/>
        </el-form-item>
        <el-form-item label="账号总余额" class="UserLink-from-item">
          <el-input v-model="userLink.record.total_balance_after" :readonly="true" placeholder="" class="UserLink-from-input"/>
        </el-form-item>
        <el-form-item label="微信充值余额" class="UserLink-from-item">
          <el-input v-model="userLink.record.online_balance_wx_after" :readonly="true" placeholder="" class="UserLink-from-input"/>
        </el-form-item>
        <el-form-item label="支付宝充值余额" class="UserLink-from-item">
          <el-input v-model="userLink.record.online_balance_alipay_after" :readonly="true" placeholder="" class="UserLink-from-input"/>
        </el-form-item>
        <el-form-item label="支付宝转账余额" class="UserLink-from-item">
          <el-input v-model="userLink.record.offline_balance_alipay_after" :readonly="true" placeholder="" class="UserLink-from-input"/>
        </el-form-item>
        <el-form-item label="银行转账余额" class="UserLink-from-item">
          <el-input v-model="userLink.record.offline_balance_bank_after" :readonly="true" placeholder="" class="UserLink-from-input"/>
        </el-form-item>
        <el-form-item v-if="act_pay_pic" label-width="0px">
          （与打款方名称不一致，无法关联，<span style="color:red">申请代打款</span>）
        </el-form-item>
        <ElFormItem v-if="act_pay_pic" label="代打款证明" class="detail-from-item" prop="act_pay_pic">
          <el-popover v-if="userLink.act_pay_pic" placement="left-start">
            <img :src="userLink.act_pay_pic" class="image" style="height:500px;" alt="">
            <img slot="reference" :src="userLink.act_pay_pic" class="image" style="height:150px;" alt="">
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
            <el-button slot="trigger" size="mini" type="primary" style="margin-left:0px;">上传证明</el-button>
          </el-upload>
        </ElFormItem>
      </el-form>
    </template>
  </DmDialog>
</template>

<script>
import * as FORM from './dialogForm'
import mealSource from '@/api/mealApi'
import MealResource from '@/api/mealApi'
import { throttle } from 'throttle-debounce'
export default {
  data() {
    return {
      type: 'link',
      titleText: {
        link: '关联用户',
        unlink: '取消关联'
      },
      linkMsg: {
        1: '关联后将影响用户余额，请谨慎操作',
        2: '取消关联后将直接扣减用户转账余额，请谨慎操作',
        3: '客户转账余额不足，请先在订单回款管理处进行余额退回'
      },
      msgtype: 1,
      FLOW_STATUS: FORM.FLOW_STATUS,
      FLOW_STATUS_TEXT: FORM.FLOW_STATUS_TEXT,
      FLOW_SOURCE_TEXT: FORM.FLOW_SOURCE_TEXT,
      FLOW_SOURCE: FORM.FLOW_SOURCE,
      FLOW_TYPE_TEXT: {
        1: '收款', 2: '打款', 3: '回款', 4: '退款', 5: '提现'
      },
      userLink: {
        visible: false,
        loading: false,
        record: {},
        member_email: '',
        act_pay_pic: ''
      },
      rules: {
        member_email: [{ required: true, message: '请输入云盾报备用户邮箱', trigger: ['change', 'blur'] }],
        act_pay_pic: [{ required: true, message: '请上传图片' }]
      },
      act_pay_pic: false,
      user_type_loading: false,
      user_type_list: [],
      url: '',
      fileList: []
    }
  },
  mounted() {

  },
  methods: {
    handleOpen(type, data) {
      this.$refs.dmdialog.handleOpen()
      this.$nextTick(() => {
        this.$refs.userLink && this.$refs.userLink.resetFields()
        this.userLink.loading = true
        this.act_pay_pic = false
        this.type = type || 'link'
        this.userLink.record = data
        this.userLink.member_email = data.member_email || ''
        this.msgtype = 1
        setTimeout(() => {
          this.userLink.loading = true
        }, 500)
      })
    },
    handlePreview() {},
    fileChange(file, fileList) {
      this.userLink.act_pay_pic = file.url
      const paramsData = new FormData()
      paramsData.append('keyFiele', file.raw)
      this.upFile(paramsData, 'keyFiele')
    },
    upFile(params, fileUrl) {
      mealSource.ServiceUpload(params).then(res => {
        if (res[fileUrl]) {
          this.userLink.act_pay_pic = res[fileUrl]
          this.message.success('上传成功！')
        } else {
          this.userLink.screen_pic = ''
          this.message.warning('上传失败')
        }
      }).cathc(() => {
        this.userLink.screen_pic = ''
      })
    },
    handleClose() {
      this.userLink.visible = false
    },
    remoteMethod(query) {
      if (query.trim() !== '') {
        this.user_type_loading = true
        throttle(1000, this.getUserTypeList(query.trim()))
      } else {
        this.user_type_loading = false
        this.user_type_list = []
      }
    },
    async getUserTypeList(username) {
      if (!username.trim()) {
        this.user_type_list = []
        this.user_type_loading = false
        return
      }
      const params = {
        'username': username.trim(),
        'type': '1',
        'report': 1
      }
      const list = []
      // 获取用户列表
      const res = await MealResource.getMemberList(params)
      if (res.list !== [] || !res.list) {
        for (var item in res.list) {
          list.push({
            'label': item,
            'value': res.list[item]
          })
        }
      }
      this.user_type_loading = false
      const user_type_list = username ? list.filter(this.filterMeber(username, 'label')) : []
      this.user_type_list = user_type_list
    },

    filterMeber(username, key) {
      return (restaurant) => {
        const findIndex = restaurant[key].indexOf(username.trim())
        if (findIndex > -1) {
          return restaurant
        }
      }
    },
    async handleAccount(value) {
      if (!value.trim()) {
        this.user_type_list = []
        this.userLink.record.member_id = ''
        this.userLink.record.member_basic_name = ''
        this.userLink.record.total_balance_after = ''

        this.userLink.record.online_balance_wx_after = ''
        this.userLink.record.online_balance_alipay_after = ''
        this.userLink.record.offline_balance_alipay_after = ''
        this.userLink.record.offline_balance_bank_after = ''
        return
      }
      const params = { 'username': value.trim() }
      const res = await MealResource.AccountInfo(params)
      if (res && res.member_id) {
        this.userLink.record.member_id = res.member_id
        this.userLink.record.member_basic_name = res.basic_info.member_name
        this.userLink.record.total_balance_after = res.total_balance

        this.userLink.record.online_balance_wx_after = res.online_balance_wx
        this.userLink.record.online_balance_alipay_after = res.online_balance_alipay
        this.userLink.record.offline_balance_alipay_after = res.offline_balance_alipay
        this.userLink.record.offline_balance_bank_after = res.offline_balance_bank
      } else {
        this.user_type_list = []
        this.userLink.record.member_id = ''
        this.userLink.record.member_basic_name = ''
        this.userLink.record.total_balance_after = ''

        this.userLink.record.online_balance_wx_after = ''
        this.userLink.record.online_balance_alipay_after = ''
        this.userLink.record.offline_balance_alipay_after = ''
        this.userLink.record.offline_balance_bank_after = ''
      }
    },

    handleSubmit(formName = 'userLink') {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.type === 'link') {
            this.handleLink(this.getParams())
          } else {
            this.handleUnLink({ id: this.userLink.record.id })
          }
        } else {
          this.$refs.dmdialog.afterValidate()
        }
      })
    },
    getParams() {
      const params = {
        id: this.userLink.record.id,
        member_id: this.userLink.record.member_id,
        member_email: this.userLink.member_email
      }
      if (this.type === 'link' && this.act_pay_pic) params.act_pay_pic = this.userLink.act_pay_pic
      return params
    },
    handleLink(params) {
      const api = '/V4/financial.flow.relation.member'
      this.InvokeAllApi.post(api, params).then(res => {
        this.Message('ACTION_SUCCESS')
        this.$emit('loadGrid')
        this.$refs.dmdialog.handleClose()
      }).catch(e => {
        if (e === 2019030702) this.act_pay_pic = true
        this.$refs.dmdialog.afterValidate()
      })
    },

    handleUnLink(params) {
      const api = '/V4/financial.flow.unrelation.member'
      this.InvokeAllApi.post(api, params).then(res => {
        this.Message('ACTION_SUCCESS')
        this.$emit('loadGrid')
        this.$refs.dmdialog.handleClose()
      }).catch(e => { this.$refs.dmdialog.afterValidate() })
    }
  }
}
</script>
