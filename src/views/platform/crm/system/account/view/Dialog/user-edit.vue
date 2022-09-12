<style lang="scss" scoped>
.input-box {
  width: 300px;
}
</style>
<template>
  <div>
    <DmDialog
      ref="dmdialog"
      :fetch-submit="fetchSubmit"
      :model="model"
      :title="model === 'Create' ? '创建'+ title :'编辑'+ title"
      width="500px"
      aside
    >
      <div>
        <el-form
          ref="form"
          :model="form"
          :rules="rules"
          label-position="left"
          label-width="90px"
        >
          <el-form-item
            label="账户名"
            prop="account"
          >
            <el-input
              v-model="form.account"
              clearable
              placeholder="请输入账户名"
              class="input-box "
            />
          </el-form-item>
          <el-form-item
            label="昵称"
            prop="nickname"
          >
            <el-input
              v-model="form.nickname"
              clearable
              placeholder="请输入昵称"
              class="input-box "
            />
          </el-form-item>
          <el-form-item
            :label="model==='Create'? '密码' : '重置密码'"
            :prop=" model==='Create' ? 'password' :''"
          >
            <el-input
              v-model="form.password"
              clearable
              type="password"
              placeholder="请输入密码"
              class="input-box "
            />
          </el-form-item>
          <el-form-item
            :label="'手机'"
            prop="mobile"
          >
            <el-input
              v-model="form.mobile"
              :maxlength="11"
              clearable
              placeholder="请输入手机"
              class="input-box "
            />
          </el-form-item>
          <el-form-item
            :label="'邮箱'"
            prop="email"
          >
            <el-input
              v-model="form.email"
              clearable
              placeholder="请输入邮箱"
              class="input-box "
            />
          </el-form-item>
          <el-form-item
            label="操作密码"
            prop="second_password"
          >
            <el-input
              v-model="form.second_password"
              clearable
              type="password"
              placeholder="请输入密码"
              class="input-box "
            />
          </el-form-item>
          <el-form-item
            label="状态"
            prop="status"
          >
            <el-radio-group v-model="form.status">
              <el-radio-button label="1">启用</el-radio-button>
              <el-radio-button label="0">禁用</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <!-- <el-form-item
            label="管理员"
            prop="is_admin"
          >
            <el-radio-group v-model="form.is_admin">
              <el-radio-button label="1">是</el-radio-button>
              <el-radio-button label="0">否</el-radio-button>
            </el-radio-group>
          </el-form-item> -->
          <el-form-item
            label="角色"
            prop="role_id"
          >
            <el-checkbox
              :indeterminate="isIndeterminate"
              v-model="checkAll"
              @change="handleCheckAllChange"
            >全选</el-checkbox>
            <div style="margin: 15px 0;" />
            <el-checkbox-group
              v-if="ruleList.length"
              v-model="form.role_id"
              @change="handleCheckRole"
            >
              <el-checkbox
                v-for="role in ruleList"
                :label="role.id"
                :key="role.id"
              >{{ role.name }}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item
            label="备注"
            prop="remark"
          >
            <el-input
              v-model="form.remark"
              placeholder="备注"
              type="textarea"
              class="input-box"
            />
          </el-form-item>
        </el-form>
        {{ ROLE }}
      </div>
    </DmDialog>
  </div>
</template>
<script>
import Rsa from '@/utils/rsa'
import Rul from '@/utils/verify'
import { mapGetters } from 'vuex'
import { deepClone } from '../../../../../../../utils'
const validateMobile = (rule, value, callback) => {
  if (value && !Rul.strictMobile.test(value)) {
    callback(new Error('手机号不正确'))
  } else {
    callback()
  }
}
export default {
  props: {
    ruleList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      form: {
        id: '',
        account: '',
        nickname: '',
        mobile: '',
        email: '',
        status: '1',
        is_admin: '0',
        password: '',
        second_password: '',
        role_id: [],
        remark: ''
      },
      rules: {
        account: [{ required: true, message: '请输入邮箱' }],
        nickname: [{ required: true, message: '请输入邮箱' }],
        password: [{ required: true, message: '请输入密码' }],
        second_password: [{ required: true, message: '请输入密码(当前用户登录密码)' }],
        email: [
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ],
        mobile: [
          { validator: validateMobile, trigger: ['blur', 'change'] }
        ],
        status: [{ required: true, message: '请选择状态' }],
        is_admin: [{ required: true, message: '请选择' }],
        role_id: [],
        remark: []
      },
      model: 'Create',
      title: '用户',
      checkAll: false,
      isIndeterminate: true
    }
  },
  computed: {
    ...mapGetters([
      'user'
    ]),

    ROLE() {
      let list = deepClone(this.ruleList)
      if (list.length) {
        list = list.filter(i => !['审计管理员', '超级管理员'].includes(i.name))
      }
      if (this.model === 'Create' || Number(this.user.id) === 3) { // 新增 业务管理员
        list = list.filter(i => Number(i.id) === 172) // 业务操作员
      }
      return list
    }
  },
  methods: {
    handleOpen(data, model = 'Create') {
      this.$nextTick(() => {
        this.model = model
        this.$refs.dmdialog.handleOpen()
        if (this.$refs.form) this.$refs.form.resetFields()
        if (model !== 'Create' && data.id) this.getUser(data.id)
      })
    },

    async getUser(id) {
      try {
        const data = await this.InvokeAllApi.get('/V4/rbac.user.get', { id })
        data.role_id = data.role_ids
        delete data.role_ids
        delete data.error_passwd_last
        delete data.error_passwd_count
        delete data.created_at
        delete data.updated_at
        this.form = Object.assign({}, data)
      } catch (e) {
        return
      }
    },

    handleCheckAllChange(val) {
      this.form.role_id = val ? this.ruleList.map(i => i.id) : []
      this.isIndeterminate = false
    },

    handleCheckRole(value) {
      this.checkAll = value.length === this.form.role_id.length
      this.isIndeterminate = value.length > 0 && value.length < this.form.role_id.length
    },

    fetchSubmit(form = 'form') {
      this.$refs[form].validate(async (valid) => {
        if (valid) {
          const data = { ...this.form }
          data.second_password = Rsa.rsaPublicData(data.second_password)
          if (this.model === 'Create') {
            try {
              data.password = Rsa.rsaPublicData(data.password)
              await this.InvokeAllApi.post('/V4/rbac.user.add', data)
              this.Message('ACTION_SUCCESS')
              this.$emit('on-success')
              this.$refs.dmdialog.handleClose()
            } catch (error) {
              this.$refs.dmdialog.afterValidate()
              return
            }
          } else {
            try {
              if (data.password) data.password = Rsa.rsaPublicData(data.password)
              if (!data.password) delete data.password
              await this.InvokeAllApi.put('/V4/rbac.user.update', data)
              this.Message('ACTION_SUCCESS')
              this.$emit('on-success')
              this.$refs.dmdialog.handleClose()
            } catch (error) {
              this.$refs.dmdialog.afterValidate()
              return
            }
          }
        } else {
          this.$refs.dmdialog.afterValidate()
        }
      })
    }
  }
}
</script>
