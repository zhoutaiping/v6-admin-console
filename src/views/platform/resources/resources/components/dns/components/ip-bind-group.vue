<style lang="scss" scoped>
.input-box {
  width: 300px;
}
.item-box {
  margin-bottom: 5px;
}
.desc-box {
  min-height: 60px;
}
</style>>
<template>
  <DmDialog
    ref="Dialog"
    :fetch-submit="handleSubmit"
    title="绑定到用户组映射"
    width="600px"
  >
    <div>
      <DmAlert>
        绑定到用户组
      </DmAlert>
      <el-form
        ref="Form"
        :model="form"
        :rules="rules"
        label-width="120px"
        label-position="left"
      >
        <el-form-item
          label="映射组"
          prop="line_group_ids"
          class="item-box"
        >
          <DmSelect
            v-model="form.line_group_ids"
            :selects="options.line_group"
            :multiple="true"
            class="input-box"
            placeholder=""
            @change="e=>{changeLine(e)}"
          />
        </el-form-item>
        <el-form-item label="覆盖请求来源" label-width="200px" class="item-box"/>
        <el-alert :closable="false" type="info" class="desc-box">
          <p v-for="(i, line_index) in form.desc " :key="line_index">
            [{{ i.name }}]：{{ i.lines.join(',') }}
          </p>
        </el-alert>
      </el-form>
    </div>
  </DmDialog>
</template>
<script>
import { mapState } from 'vuex'
export default {
  data() {
    return {
      open: false,
      formDefault: {
        ips: [],
        line_group_ids: [],
        desc: []
      },
      form: {},
      rules: {
        ips: [{ required: true, message: ' ' }],
        line_group_ids: []
      },

      options: {
        line_group: [],
        region: {
          'default': '全局',
          'china': '中国',
          'overseas': '海外',
          'searchengine': '搜索引擎'
        }
      }
    }
  },
  computed: {
    ...mapState({
      line_group: state => state.disp.line_group
    })
  },
  watch: {
    line_group: {
      deep: true,
      handler(val) {
        this.options.line_group = this.line_group.map(i => {
          return {
            label: i.name,
            value: i.id
          }
        })
      }
    }
  },
  created() {
    this.options.line_group = this.line_group.map(i => {
      return {
        label: i.name,
        value: i.id
      }
    })
  },
  methods: {
    handleOpen(data, option) {
      this.form = Object.assign({}, this.formDefault)
      this.$nextTick(() => {
        this.$refs.Dialog.handleOpen()
        if (this.$refs.Form) {
          this.$refs.Form.resetFields()
        }
        this.form.ips = data.map(i => i.ip)
      })
    },
    changeLine(e) {
      this.form.desc = []
      if (e && e.length) {
        const check = this.line_group.filter(i => e.includes(i.id))
        check.forEach(record => {
          const lines = Object.assign(record.lines, this.options.region)
          const line = record.line_keys.map(l => lines[l])
          this.form.desc.push({ lines: line, name: record.name })
        })
      }
    },
    handleSubmit() {
      this.$refs.Form.validate(async(valid) => {
        if (valid) {
          try {
            await this.FetchDisp.post('/ip/line_group/bind', { ...this.form })
            this.Message('ACTION_SUCCESS')
            this.$emit('init')
            this.$refs.Dialog.handleClose()
          } catch (error) {
            this.$refs.Dialog.afterValidate()
            return
          }
        } else {
          this.$refs.Dialog.afterValidate()
          return false
        }
      })
    }
  }
}
</script>
