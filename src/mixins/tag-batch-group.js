export default {
  data() {
    return {
      open: false,
      loading: false,
      is_edit: false,
      groupForm: {
        tag: '',
        type: '1',
        add_tag: '',
        remark: ''
      },
      P_TAG: [],
      TYPE: [{ label: '节点IP/IP段', value: '1' }, { label: '按主P批量添加', value: '2' }],
      rules: {
        remark: [],
        tag: [{ required: true, message: '请选择分组标识', trigger: ['change', 'blur'] }]
      },
      GROUP: [],
      panel_type: ''
    }
  },

  methods: {
    handleOpen(data, type) {
      this.$nextTick(() => {
        this.resetForm()
        this.handleLoadGroup()
        this.is_edit = false
        this.panel_type = type
        if (type === 'group-batch') {
          const arr = []
          data.forEach(i => {
            arr.push(i.ip)
          })
          this.P_TAG = arr
        } else {
          this.P_TAG = [data.ip]
          this.groupForm.tag = data.gid
        }
        this.open = true
      })
    },
    resetForm(formName) {
      if (this.$refs.groupForm) this.$refs.groupForm.resetFields()
    },
    formartTag(tag) {
      let tag_text = tag
      tag_text = this.GROUP.filter(i => i.id === tag)[0] && this.GROUP.filter(i => i.id === tag)[0].name || tag
      return tag_text
    },
    handleLoadGroup() {
      this.loading = true
      this.InvokeDispApi.get('/ip/group/list', { page: 1, per_page: 200 }).then(res => {
        this.GROUP = res.list
        setTimeout(() => {
          this.loading = false
        }, 1000)
      }).catch(e => {
        this.loading = false
      })
    },

    handleCloseTag(tag) {
      this.P_TAG.splice(this.P_TAG.indexOf(tag), 1)
    },

    handleAddGroup() {
      this.$refs.dialogGroup.handleOpen()
    },

    handleClose() {
      this.open = false
      this.$emit('handleLoad')
      this.$emit('getGroup')
    },

    handleSubmint() {
      this.$refs.groupForm.validate((valid) => {
        if (valid) {
          this.InvokeDispApi.post('/ip/group/bind', this.getParams()).then(res => {
            this.Message('ACTION_SUCCESS')
            this.open = false
          })
        }
      })
    },
    getParams() {
      const params = {
        'ips': this.P_TAG,
        'gid': this.groupForm.tag
      }

      return params
    }
  }
}
