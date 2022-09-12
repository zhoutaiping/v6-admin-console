<template>
  <DmDialog
    ref="Dialog"
    :fetch-submit="fetchSubmit"
    width="600px"
    title="分配IP段"
    submit-text="确定"
    @submit="handleSubmit"
  >
    <DmAlert>
      <p>将根据用户数量分配内网IP段，请输入指定A段下的C段</p>
    </DmAlert>
    <el-form label-position="left" label-width="120px">
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
      <el-form-item label="内网IP段">
        <div
          v-for="(item, index) in list"
          :key="index"
        >
          <el-form label-position="inline">
            <el-form-item>
              <span style="width: 180px">
                10.
                <el-input
                  v-model="item.value"
                  style="width: 120px"
                  placeholder="0.0"
                />.0 / 24
              </span>
              <a
                v-if="index > 0"
                type="text"
                style="margin-left: 40px"
                @click="handleRemove(index)"
              >删除</a>
            </el-form-item>
          </el-form>
        </div>
        <el-button
          type="primary"
          plain
          @click="handleAdd"
        >+ 添加</el-button>
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
      list: [{
        value: ''
      }],
      formDefault: {
        member_id: '',
        email: ''
      }
    }
  },

  methods: {
    check(e) {
      if (e) {
        this.form.member_id = e.label
        this.customerinfo({ email: e.value })
      }
    },

    change(e) {
      if (!e) {
        this.form.member_id = ''
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

    initOptions() {
      this.list = [{
        value: ''
      }]
    },

    handleRemove(index) {
      this.list.splice(index, 1)
    },

    handleAdd() {
      this.list.push({ value: '' })
    },

    async fetchMemberList() {

    },

    async fetchSubmit() {
      try {
        await this.FetchGateWay.post('ip/create', {
          ...this.form,
          ip_range: this.list.map(_ => {
            return `10.${_.value}.0/24`
          })
        })
      } catch (e) {
        this.error = e.status.message
        throw new Error()
      }

      this.error = ''
    },

    async handleSubmit(form) {
      this.Message('ACTION_SUCCESS')
      this.$emit('init')
      this.handleClose()
    }
  }
})
</script>
