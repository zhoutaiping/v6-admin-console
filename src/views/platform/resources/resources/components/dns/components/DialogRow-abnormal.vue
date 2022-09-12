<style lang="scss" scoped>
.input-box {
  width:300px;
}
</style>
<template>
  <DmDialog
    ref="Dialog"
    :fetch-submit="fetchSubmit"
    :mode="mode"
    width="600px"
    title-label="模板"
    @submit="handleSubmit"
  >
    <DmAlert>
      1. 模版名称6-255个字符<br>
      2.相同节点类型和版本的模版只允许有一个全局默认模版<br>
    </DmAlert>
    <el-form
      :model="form"
      label-position="left"
      label-width="120px"
    >
      <el-form-item
        label="模板名称"
        prop="name"
      >
        <el-input
          v-model="form.template_name"
          type="text"
          placeholder="请输入内容"
          maxlength="255"
          class="input-box"
          show-word-limit
        />
      </el-form-item>
      <el-form-item label="版本" prop="service_type">
        <DmSelect
          v-model="form.service_type"
          :selects="options.service_type"
          class="input-box"
          placeholder=" "
          @change="e =>{
            selectTemplate = []
            fetchTemplate()
          }"
        />
      </el-form-item>
      <el-form-item label="模板类型" prop="type">
        <el-radio-group
          v-model="form.type"
          @change="e =>{
            form.email = ''
            form.member_id = ''
            selectTemplate = []
            fetchTemplate()
        }">
          <el-radio v-for="t in options.type" :disabled="mode === 'Edit'" :key="t.value" :label="t.value">{{ t.label }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <template v-if="form.type === 'custom'">
        <el-form-item label="用户邮箱">
          <el-autocomplete
            v-model="form.email"
            :fetch-suggestions="query"
            :debounce="500"
            placeholder=""
            clearable
            class="input-box"
            @select="check"
            @change="change"
          />
        </el-form-item>
      </template>
      <template >
        <el-form-item>
          <el-checkbox
            v-if="mode === 'Create'"
            v-model="form.is_copy"
            :true-label="1"
            :false-label="0"
            @change="e =>{
              if(e === 1){
                selectTemplate = []
                fetchTemplate()
              }
            }"
          >
            复制已有模版配置
          </el-checkbox>

        </el-form-item>
        <el-form-item v-if="form.is_copy">
          <DmSelect
            v-model="form.pro_id"
            :selects="selectTemplate"
            class="input-box"
          />
        </el-form-item>
      </template>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="form.remark" :rows="2" type="textarea" class="input-box"/>
      </el-form-item>
    </el-form>
  </DmDialog>
</template>

<script>
import createDialog from '@/utils/createDialog'
function formartList(data = {}) {
  let list = []
  if (Object.keys(data).length) {
    list = Object.keys(data).map(i => { return { label: data[i], value: i } })
  }
  return list
}
export default createDialog({
  data() {
    return {
      mode: '',
      formDefault: {
        template_name: '',
        template_type: 'abnormal',
        service_type: 'fee',
        type: '',
        is_copy: 0,
        pro_id: '',
        remark: '',
        email: '',
        member_id: ''
      },

      selectTemplate: [],
      options: {
        type: [
          { label: '全局非默认', value: 'notglobal' },
          { label: '自定义', value: 'custom' },
          { label: '全局', value: 'global' }
        ],
        node_type: [],
        node_num: [
          { label: 'min型 ', value: '1' },
          { label: '健壮型', value: '2' }
        ],
        service_type: [
          { label: '免费 ', value: 'fee' },
          { label: '付费', value: 'nofee' }
        ]
      }
    }
  },

  methods: {
    initOptions(form, options) {
      this.mode = form.id ? 'Edit' : 'Create'
      this.selectTemplate = []
      // this.fetchTemplate()
    },

    query(val, cb) {
      let data = []
      if (val !== '') {
        const params = {
          username: this.form.email,
          type: 1,
          report: 2
        }
        this.Fetch.post('/V4/Account.Member.like', params).then(res => {
          const list = res.list
          if (list && list !== []) {
            data = formartList(list)
          }
          if (data.length === 0) {
            this.message.warning('未找到用户!')
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
      }
    },

    change(e) {
      if (!e) {
        this.form.member_id = ''
      }
    },

    async fetchSubmit() {
      const form = this.form

      try {
        if (this.mode === 'Create') {
          await this.InvokeAllApi.post('/fd/V4/dispatch.template.save', form)
        } else {
          const data = {
            id: form.id,
            template_name: form.template_name,
            template_type: form.template_type,
            service_type: form.service_type,
            type: form.type,
            member_id: form.member_id,
            is_copy: form.is_copy,
            pro_id: form.pro_id,
            remark: form.remark
          }

          await this.InvokeAllApi.put('/fd/V4/dispatch.template.save', data)
        }
      } catch (e) {
        throw new Error()
      }
    },

    async fetchTemplate() {
      const params = {
        template_type: 'abnormal'
      }
      const list = await this.InvokeAllApi.get('/fd/V4/dispatch.exist.rule.get', params)
      this.selectTemplate = list.map(_ => {
        return {
          label: _.product_name,
          value: _.pro_id
        }
      })
    },

    async handleSubmit() {
      this.Message('ACTION_SUCCESS')
      this.$emit('init')
      this.handleClose()
    }
  }
})
</script>
