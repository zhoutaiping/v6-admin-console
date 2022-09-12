<template>
  <el-form ref="Form" :model="form" :rules="rules" label-width="100px" class="form-box">
    <el-form-item label="用户" prop="email" class="item-box">
      <el-autocomplete
        v-model="form.email"
        :fetch-suggestions="query"
        :debounce="500"
        placeholder=""
        clearable
        class="input-box"
        @select="check"
        @change="change"
      >
        <el-select
          slot="prepend"
          v-model="form.type"
          style="width:100px;"
        >
          <el-option
            v-for="item in option.type"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-autocomplete>
    </el-form-item>
    <el-form-item label="用户ID" prop="member_id" class="item-box">
      <el-input v-model="form.member_id" readonly placeholder="用户ID" class="input-box"/>
    </el-form-item>
    <el-form-item label="报备名称" class="item-box">
      <span v-if="customer_info.basic_info">
        {{ customer_info.basic_info.message || customer_info.basic_info.info.member_name || '' }}
      </span>
    </el-form-item>
    <el-form-item label="认证名称" class="item-box">
      <span v-if="customer_info.certify_info">
        {{ customer_info.certify_info.message || customer_info.certify_info.certify_name ||'' }}
      </span>
    </el-form-item>
    <el-form-item label="所属销售" class="item-box">
      <span v-if="customer_info.basic_info">
        {{ customer_info.certify_info.message || customer_info.basic_info.info && customer_info.basic_info.info.user_name.join(',') || '' }}
      </span>
    </el-form-item>
    <el-form-item label="客户层级" class="item-box">
      <span v-if="customer_info.basic_info">
        {{ customer_info.basic_info.info && customer_info.basic_info.info.member_type || '暂无，请先完成客户报备' }}
      </span>
    </el-form-item>
    <el-form-item label="渠道邮箱" class="item-box">
      <span v-if="customer_info.agent_basic_info">
        {{ customer_info.agent_basic_info.message || customer_info.agent_basic_info.info && customer_info.agent_basic_info.info.email || '暂无' }}
      </span>
    </el-form-item>
    <el-form-item label="渠道认证名称" class="item-box">
      <span v-if="customer_info.agent_basic_info">
        {{ customer_info.agent_basic_info.message || customer_info.agent_basic_info.info && customer_info.agent_basic_info.info.member_name|| '暂无' }}
      </span>
    </el-form-item>
    <el-form-item>
      <a-button :disabled="form.member_id === ''" type="primary" style="margin-right: 8px" @click="next">下一步</a-button>
      <a-button
        style="margin-right: 8px"
        @click="e =>{
          $refs.Form.resetFields()
          $store.commit('CUSTOMER_INFO', {})
      }">重置</a-button>
      <a-button @click="$emit('close')">返回列表</a-button>
    </el-form-item>
    <el-divider />
    <DmAlert>
      <div class="step-form-style-desc">
        <h3>说明</h3>
        <h4>用户开通服务必须通过<strong>认证</strong>、<strong>报备</strong></h4>
        <p>如果用户未<strong>认证</strong>、<strong>报备</strong>，请联系管理员到客户管理-客户基本信息处理用户报备。</p>
      </div>
    </DmAlert>
  </el-form>
</template>
<script>
function formartList(data = {}) {
  let list = []
  if (Object.keys(data).length) {
    list = Object.keys(data).map(i => { return { label: data[i], value: i } })
  }
  return list
}
import { mapState, mapActions } from 'vuex'
export default {
  data() {
    return {
      form: {
        email: '',
        member_id: '',
        type: '1'
      },
      rules: {
        email: [{ required: true, message: ' ' }],
        member_id: [{ required: true, message: ' ' }],
        type: []
      },
      option: {
        type: [
          { label: '邮箱', value: '1' },
          { label: '手机', value: '2' }
        ]
      }
    }
  },
  computed: {
    ...mapState({
      customer_info: state => state.meal.customer_info
    })
  },
  methods: {
    ...mapActions({
      customerinfo: 'customerinfo'
    }),
    init() {
      if (this.$refs.Form) {
        this.$refs.Form.resetFields()
        this.$store.commit('CUSTOMER_INFO', {})
      }
    },

    query(val, cb) {
      let data = []
      if (val !== '') {
        const params = {
          username: this.form.email,
          type: this.form.type,
          report: 1
        }
        this.Fetch.post('/V4/Account.Member.like', params).then(res => {
          const list = res.list
          if (list && list !== []) {
            data = formartList(list)
          }
          if (data.length === 0) {
            this.message.warning('未找到报备用户!')
          }
          cb(data)
        }).catch(e => {
          cb(data)
        })
      }
    },

    check(e) {
      if (e) {
        this.form.member_id = e.label
        this.customerinfo({ email: e.value })
      }
    },

    change(e) {
      if (!e) {
        this.form.member_id = ''
        this.$store.commit('CUSTOMER_INFO', {})
      }
    },

    next() {
      this.$refs.Form.validate((valid) => {
        if (valid) {
          if (this.customer_info) {
            if (this.customer_info.baisc_flag === false) {
              this.message.warning('用户未报备,请联系管理员！')
              return
            }
            if (this.customer_info.certify_flag === false) {
              this.message.warning('用户未认证,请联系管理员！')
              return
            }
            if (Number(this.customer_info.member_status) === 6) {
              this.message.warning('用户已流失,请联系管理员!')
              return
            }
          }
          this.$emit('change', 'add')
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.form-box {
  max-width: 600px;
  margin: 0 auto;
}
.input-box {
  width: 400px;
}
.item-box {
  margin-bottom: 5px;
}
</style>
