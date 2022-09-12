<style lang="postcss" >
  .dialog-invoice-info{
    .dialog-invoice-info-form{
      margin-top: 10px;
      .dialog-invoice-info-form-item {

        .dialog-invoice-info-form-input {
          width: 250px;
        }
      }
    }
    .image{

    }
  }
</style>
<template>
  <DmDialog
    ref="dmdialog"
    :fetch-submit="handleSubmit"
    :title="title"
    :footer="type!=='info'"
    width="500px"
    class="dialog-invoice-info"
    aside
  >
    <DmScroll>
      <el-form ref="invoiceForm" :model="invoiceForm" :rules="invoiceform_rule" label-position="left" label-width="140px" size="mini" class="dialog-invoice-info-form">
        <h3>客户信息</h3><hr>
        <el-form-item :prop="type!=='info'?'email':''" label="注册邮箱" class="dialog-invoice-info-form-item">
          <el-select
            v-model="invoiceForm.email"
            :disabled="type !=='add'"
            :remote-method="remoteMethod"
            :loading="user_type_loading"
            filterable=""
            remote
            clearable
            reserve-keyword
            placeholder="请输入YUNDUN注册用户邮箱"
            class="dialog-invoice-info-form-input"
            @change="handleAccount">
            <el-option v-for="(item, key) in user_type_list" :key="key" :label="item.label" :value="item.label"/>
          </el-select>
        </el-form-item>
        <el-form-item label="用户认证类型" class="dialog-invoice-info-form-item" prop="certification_type_desc">
          <span v-if="!invoiceForm.certification_type" style="color:red">未认证，请先完成实名认证</span>
          <span v-else style="color:green">{{ invoiceForm.certification_type_desc }}</span>
        </el-form-item>
        <h3>发票信息</h3><hr>
        <el-form-item label="开具发票类型" prop="certification_type" class="dialog-invoice-info-form-item">
          <el-select v-model="invoiceForm.certification_type" class="dialog-invoice-info-form-input" @change="changeCompany('init')">
            <el-option v-for="(item, index) in CERTIFICATION_TYPE" :key="index" :label="item.label" :value="item.value" :disabled="item.status"/>
          </el-select>
        </el-form-item>
        <el-form-item :prop="type!=='info'?'invoice_type':''" label="发票类型" class="dialog-invoice-info-form-item">
          <el-select v-model="invoiceForm.invoice_type" :disabled="type==='info'" placeholder="发票类型" class="dialog-invoice-info-form-input" clearable >
            <el-option v-for="(item,index) in INVOICE_TYPE" :key="index" :label="item.label" :value="item.value" :disabled="item.status"/>
          </el-select>
        </el-form-item>
        <el-form-item :prop="type!=='info'?'invoice_title':''" label="发票抬头" class="dialog-invoice-info-form-item">
          <el-input v-model="invoiceForm.invoice_title" placeholder="请填写发票抬头" readonly class="dialog-invoice-info-form-input"/>
        </el-form-item>
        <el-form-item :prop="Number(invoiceForm.invoice_type) ===2 || Number(invoiceForm.invoice_type) ===3 ?'company_taxer_code':''" label="税务登记证号" class="dialog-invoice-info-form-item">
          <el-input v-model="invoiceForm.company_taxer_code" :readonly="type==='info'" placeholder="请填写税务登记证号" class="dialog-invoice-info-form-input"/>
        </el-form-item>
        <el-form-item :prop="Number(invoiceForm.invoice_type) ===2 ?'company_bank':''" label="基本开户银行名称" class="dialog-invoice-info-form-item">
          <el-input v-model="invoiceForm.company_bank" :readonly="type==='info'" placeholder="请填写基本开户银行名称" class="dialog-invoice-info-form-input"/>
        </el-form-item>
        <el-form-item :prop="Number(invoiceForm.invoice_type) ===2 ?'company_bank_code':''" label="基本开户账号" class="dialog-invoice-info-form-item">
          <el-input v-model="invoiceForm.company_bank_code" :readonly="type==='info'" placeholder="请填写基本开户账号" class="dialog-invoice-info-form-input"/>
        </el-form-item>
        <el-form-item :prop="Number(invoiceForm.invoice_type) ===2 ?'company_reg_tel':''" label="注册固定电话" class="dialog-invoice-info-form-item">
          <el-input v-model="invoiceForm.company_reg_tel" :readonly="type==='info'" placeholder="请填写注册固定电话" class="dialog-invoice-info-form-input"/>
        </el-form-item>
        <el-form-item :prop="Number(invoiceForm.invoice_type) ===2 ? 'company_reg_address':''" label="注册场所地址" class="dialog-invoice-info-form-item">
          <el-input v-model="invoiceForm.company_reg_address" :readonly="type==='info'" type="textarea" placeholder="请填写注册场所地址" class="dialog-invoice-info-form-input"/>
        </el-form-item>
        <el-form-item label="营业执照扫描件" class="dialog-invoice-info-form-item" prop="">
          <div v-if="type!=='info'">
            <el-popover v-if="invoiceForm.biz_licence_img" placement="left-start">
              <img :src="invoiceForm.biz_licence_img" class="image" style="height:667px;" alt="">
              <img slot="reference" :src="invoiceForm.biz_licence_img" class="image" style="height:150px;" alt="">
            </el-popover>
            <el-upload
              ref="upload"
              :action="url"
              :on-preview="handlePreview"
              :on-change="fileChange"
              :file-list="fileList"
              :show-file-list ="false"
              :auto-upload="false"
              class="upload-demo">
              <el-button slot="trigger" size="mini" type="primary" style="margin-left:0px;">{{ invoiceForm.biz_licence_img ? '重新上传' :'选取图片' }}</el-button>
            </el-upload>
          </div>
          <div v-else>
            <el-popover v-if="invoiceForm.biz_licence_img" placement="left-start">
              <img :src="invoiceForm.biz_licence_img" class="image" style="height:667px;" alt="">
              <img slot="reference" :src="invoiceForm.biz_licence_img" class="image" style="height:150px;" alt="">
            </el-popover>
          </div>
        </el-form-item>
      </el-form>
    </DmScroll>
  </DmDialog>
</template>
<script>
import * as FORM from './c-from.js'
import { debounce } from 'throttle-debounce'
import MealResource from '@/api/mealApi'
import InvoiceResource from '@/api/finance/invoiceApi'
export default {
  components: {},
  data() {
    return {
      loading: false,
      user_type_loading: false,
      user_type_list: [],
      open: false,
      title: '发票详情',
      url: '', fileList: [],
      certification_type: '',
      invoiceForm: FORM.INVOICEFORM,
      invoiceform_rule: FORM.INVOICEFORM_RULE,
      //  1个人增值税普通发票 2企业增值税专用发票 3企业增值普通发票 4组织增值税普通发票
      INVOICE_TYPE: [
        { label: '个人增值税普通发票', value: '1', status: true }, { label: '企业增值税专用发票', value: '2', status: true },
        { label: '企业增值普通发票', value: '3', status: true }, { label: '组织增值税普通发票', value: '4', status: true }
      ],
      CERTIFICATION_TYPE: [
        { label: '个人', value: '1', status: true },
        { label: '公司', value: '2', status: true },
        { label: '政府/事业单位', value: '3', status: true }
      ],
      DEFAULT: [{ label: '否', value: '0' }, { label: '是', value: '1' }],
      list: [],
      type_title: {
        'add': '新增发票信息',
        'info': '发票信息',
        'edit': '编辑发票信息'
      },
      type: ''
    }
  },
  mounted() {

  },
  methods: {
    handleOpen(type, data) {
      this.loading = true
      this.$refs.dmdialog.handleOpen()
      this.$nextTick(() => {
        this.title = this.type_title[type]
        this.type = type
        this.setFieldValue(data)
        setTimeout(() => { this.loading = false }, 1000)
      })
    },
    setFieldValue(data) {
      this.invoiceForm = {
        email: data.email || '',
        mid: data.member_id || '',
        id: data.id || '',
        invoice_type: data.invoice_type !== '0' ? data.invoice_type || '' : '1' || '',
        company_taxer_code: data.company_taxer_code || '',
        company_reg_address: data.company_reg_address || '',
        company_reg_tel: data.company_reg_tel || '',
        company_bank: data.company_bank || '',
        company_bank_code: data.company_bank_code || '',
        biz_licence_img: data.biz_licence_img || '',
        invoice_title: data.invoice_title || '',
        default: data.default || '1'
      }
      if (data.member_id && data.email) this.getMemberCompanyType(data.member_id, data.email)
    },

    getFieldValue() {
      const data = this.invoiceForm
      const paramsData = new FormData()
      const paramsKey_Value = [
        { key: 'id', value: 'id' }, { key: 'email', value: 'email' },
        { key: 'mid', value: 'mid' },
        { key: 'invoice_type', value: 'invoice_type' }, { key: 'company_taxer_code', value: 'company_taxer_code' },
        { key: 'company_reg_address', value: 'company_reg_address' }, { key: 'company_reg_tel', value: 'company_reg_tel' },
        { key: 'company_bank', value: 'company_bank' }, { key: 'company_bank_code', value: 'company_bank_code' },
        { key: 'biz_licence_img', value: 'biz_licence_img_file' }, { key: 'invoice_title', value: 'invoice_title' },
        { key: 'default', value: 'default' }
      ]
      paramsKey_Value.forEach(item => {
        paramsData.append(item.key, data[item.value])
      })
      return paramsData
    },
    changeCompany(type) {
      if (type === 'init') this.invoiceForm.invoice_type = ''
      this.INVOICE_TYPE.forEach(i => {
        i.status = true
        if (Number(this.invoiceForm.certification_type) === 1 && Number(i.value) === 1) i.status = false
        if (Number(this.invoiceForm.certification_type) === 2 && Number(i.value) !== 1 && Number(i.value) !== 4) i.status = false
        if (Number(this.invoiceForm.certification_type) === 3 && Number(i.value) === 4) i.status = false
      })
    },
    changeCertificationType() {
      this.CERTIFICATION_TYPE.forEach(i => {
        i.status = true
        if (Number(this.invoiceForm.certification_type) === 1 && Number(i.value) === 1) i.status = false
        if (Number(this.invoiceForm.certification_type) === 2) i.status = false
        if (Number(this.invoiceForm.certification_type) === 4 && Number(i.value) === 3) i.status = false
      })
    },
    fileChange(file, fileList) {
      const img_file = file
      const reader = new FileReader()
      const _this = this
      reader.onload = async(e) => {
        _this.invoiceForm.biz_licence_img = e.target.result
      }
      reader.readAsDataURL(img_file.raw)
      if (this.invoiceForm.biz_licence_img) this.invoiceForm.biz_licence_img_file = file.raw
      // this.upFile(file)
    },
    upFile(file) {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
      const params = new FormData()
      params.append('keyFiele', file.raw)
      this.invoiceForm.biz_licence_img_file = ''
      this.invoiceForm.biz_licence_img = ''
      this.InvokeAllApi.post('/V4/uploadfile', params, config).then(res => {
        if (res.keyFiele) {
          this.invoiceForm.biz_licence_img_file = file.raw
          this.invoiceForm.biz_licence_img = res.keyFiele
        }
      }).catch(() => {
        //
      })
    },
    handlePreview(file) {},
    remoteMethod(query) {
      if (query.trim() !== '') {
        this.user_type_loading = true
        debounce(1000, this.getUserTypeList(query.trim()))
      } else {
        this.user_type_list = []
      }
    },

    async getUserTypeList(username) {
      const filter_text = username.trim()
      if (!filter_text) {
        this.user_type_list = []
        this.user_type_loading = false
        return
      }
      const params = {
        'username': filter_text,
        'type': '1'
      }
      let list = []
      // 获取用户列表
      const res = await MealResource.getMemberList(params)
      if (res.list !== [] || !res.list) {
        list = FORM.ArrObjToArr(res.list) // 集合对象转集合
      }
      this.user_type_loading = false
      this.user_type_list = list.filter(FORM.filterMeber(filter_text, 'label'))
    },

    handleAccount(value) {
      const filter_text = value.trim()
      if (!filter_text) {
        this.user_type_list = []
        this.invoiceForm.mid = ''
        return
      }
      const params = { 'username': filter_text }
      MealResource.AccountInfo(params).then(res => {
        const member_id = res.member_id || ''
        this.checkInvoic(member_id, res.email)
      }).catch(e => {
        this.invoiceForm.mid = ''
      })
    },

    checkInvoic(member_id, email) {
      const params = { email: email }
      this.invoiceForm.companyType = ''
      InvoiceResource.getInvoicMemberList(params).then(res => {
        const is_check_user = parseInt(res.total, 10) !== 0
        if (is_check_user !== false) {
          this.invoiceForm.email = ''
          this.invoiceForm.mid = ''
        }
        if (member_id && is_check_user === false) {
          this.getMemberCompanyType(member_id, email)
        } else {
          this.message.warning('该邮箱发票信息已存在!')
        }
        this.invoiceForm.mid = member_id && is_check_user === false ? member_id : ''
      }).catch(e => {
        this.invoiceForm.email = ''
        this.invoiceForm.mid = ''
      })
    },

    getMemberCompanyType(member_id, email) {
      this.invoiceForm.certification_type_desc = ''
      this.invoiceForm.certification_type = ''
      this.invoiceForm.invoice_title = ''
      this.InvokeAllApi.post('/V4/Account.certification.list', { email: email }).then(res => {
        if (res.list && res.list.length) {
          const User = res.list[0]
          const certification_type = User.certification_type
          this.invoiceForm.certification_type_desc = User.certification_type_desc
          this.invoiceForm.certification_type = certification_type.toString()
          let invoice_title = ''
          if (Number(certification_type) === 1) {
            invoice_title = User.personal_name
          } else if (Number(certification_type) === 2) {
            invoice_title = User.company && User.company.company_name || ''
          } else if (Number(certification_type) === 3) {
            invoice_title = User.government && User.government.organization_name || ''
          }
          this.invoiceForm.invoice_title = invoice_title
          this.changeCertificationType()
          this.changeCompany()
        } else {
          this.invoiceForm.certification_type_desc = '用户未认证'
        }
      }).catch(() => { this.invoiceForm.certification_type_desc = '用户未认证' })
    },

    handleSubmit(formName = 'invoiceForm') {
      this.$refs[formName].validate(async(valid) => {
        if (valid) {
          const params = this.getFieldValue()
          try {
            let api = ''
            if (this.type === 'add') {
              api = '/fd/V4/invoice.member.save'
            } else if (this.type === 'edit') {
              api = '/fd/V4/invoice.member.edit'
            }
            await this.Fetch.post(api, params)
            this.Message('ACTION_SUCCESS')
            this.$emit('handleload')
            this.$refs.dmdialog.handleClose()
          } catch (error) {
            this.$refs.dmdialog.afterValidate()
            return
          }
        } else {
          this.$refs.dmdialog.afterValidate()
        }
      })
    }
  }

}
</script>
