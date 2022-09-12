<template>
  <div class="modifyPass-box">
    <h1>密码修改</h1>
    <el-form
      ref="Form"
      :model="form"
      :rules="rules"
      size="medium"
    >
      <el-form-item
        label="旧密码"
        prop="oldPass"
      >
        <el-input
          v-model="form.oldPass"
          placeholder="请输入旧密码"
          type="password"
          class="input-box"
        />
      </el-form-item>
      <el-form-item
        label="新密码"
        prop="newPass"
      >
        <el-input
          v-model="form.newPass"
          placeholder="密码"
          type="password"
          class="input-box"
        />
      </el-form-item>
      <el-form-item
        label="确认密码"
        prop="newRepeatPass"
      >
        <el-input
          v-model="form.newRepeatPass"
          placeholder="确认密码"
          type="password"
          class="input-box"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          :loading="loading"
          type="primary"
          style=" font-size: 17px; font-weight: 500; margin-bottom:30px; background: #007bfc;"
          @click.native.prevent="handleSubmit"
        >保存</el-button>
        <el-button
          style=" font-size: 17px; font-weight: 500; margin-bottom:30px;"
          @click="init"
        >重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import Rsa from '@/utils/rsa'
export default {
  components: {},
  data() {
    const validateRepPassword = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入确认密码'))
      } else if (value !== this.form.newPass) {
        callback(new Error('确认密码和新密码不一致'))
      } else {
        callback()
      }
    }
    return {
      loading: false,
      form: {
        oldPass: '',
        newPass: '',
        newRepeatPass: ''
      },
      rules: {
        oldPass: [{ required: true, message: '请输入旧密码' }],
        newPass: [{ required: true, message: '请输入新密码' }, { min: 6, message: '密码不能小于6位' }],
        newRepeatPass: [{ required: true, validator: validateRepPassword }]
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.init()
    })
  },
  methods: {
    init() {
      this.$refs.Form && this.$refs.Form.resetFields()
    },
    handleSubmit() {
      this.$refs.Form.validate(valid => {
        if (valid) {
          this.loading = true
          const params = Rsa.setRsa({ ...this.form })
          this.Fetch.post('/V4/User/modifyPass', params).then(res => {
            this.loading = false
            this.Message('ACTION_SUCCESS')
            this.$store.dispatch('FedLogOut').then(() => {
              this.$router.push('/')
            })
          }).catch(e => {
            this.loading = false
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style scoped>
.modifyPass-box {
  width: 500px;
  margin: 100px auto 0;
  text-align: center;
}
</style>
