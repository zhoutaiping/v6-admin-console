<style lang="scss" scoped>
.is-horizonta {
  display: flex;
  margin-bottom: 16px;
  /deep/.el-card__header {
    flex: 0 0 180px;
    padding-right: 24px;
  }
  /deep/.el-card__body {
    flex: 1;
    overflow: hidden;
    clear: both;
    height: 100%;
  }
}
</style>
<template>
  <div>
    <el-card class="is-horizonta">
      <div slot="header" class="clearfix">
        <span>基本信息</span>
      </div>
      <div>
        <DmAlert>
          <el-form label-position="left" label-width="120px">
            <el-form-item v-for="i in info" :key="i.label" :label="i.label" class="item-box">
              {{ formartValue(disp_group, i.value) }}
            </el-form-item>
          </el-form>
        </DmAlert>
        <el-form ref="Form" :model="form" :rules="rules" >
          <el-form-item label="备注说明" style="margin-bottom:5px;"/>
          <el-form-item prop="remark">
            <el-input v-model="form.remark" :rows="4" type="textarea" placeholder="备注说明" class="input-box" />
          </el-form-item>
        </el-form>
        <el-button type="primary" @click="handleSubmit">保存</el-button>
      </div>
    </el-card>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import SELECT from '../../../constant/select'
export default {
  data() {
    return {
      form: {
        remark: ''
      },
      rules: {
        remark: [{ required: true, message: ' ' }]
      },

      info: [
        { label: '调度包名称', value: 'name' },
        { label: '服务类型', value: 'service_type' },
        { label: '开通时间', value: 'start_time' },
        { label: '到期时间', value: 'expire_time' },
        { label: '节点类型', value: 'node_type' },
        { label: '节点数量', value: 'node_limit' },
        { label: '已绑定调度域名', value: 'cname_server' },
        { label: '备用域名', value: 'cname_server_slaves' }
      ],
      options: {
        service_type: SELECT.service_type
      }
    }
  },
  computed: {
    ...mapState({
      disp_group: state => state.disp.disp_group_info,
      node_type: state => state.disp.node_type
    })
  },
  watch: {
    disp_group: {
      deep: true,
      handler(val) {
        this.form.remark = val.remark
      }
    }
  },
  methods: {
    formartValue(data, prop) {
      const value = data[prop]
      if (prop === 'service_type') {
        return this.options.service_type.find(e => { return e.value === value }) ? this.options.service_type.find(e => { return e.value === value }).label : '暂无'
      } else if (prop === 'node_type') {
        return value && this.node_type.find(e => { return e.value === value }) ? this.node_type.find(e => { return e.value === value }).label : '暂无'
      } else if (prop === 'cname_server_slaves') {
        return Array.isArray(value) && value.length > 0 ? value.join(',') : '暂无'
      }
      return value || '暂无'
    },

    handleSubmit() {
      this.$refs.Form.validate(async(valid) => {
        if (valid) {
          const params = {
            ids: [this.$route.params.id],
            ...this.form
          }
          await this.Fetch.put('/fd/V4/disp.group.batch.remark', params)
          await this.$store.dispatch('fetchDispGroupInfo', { disp_group_id: this.$route.params.id })
          this.Message('ACTION_SUCCESS')
        } else {
          return false
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.item-box {
  display: inline-block;
  width: 400px;
  margin-bottom: 5px;
}
.box-card {
  margin: 0 0 10px;
}
.input-box {
  width: 100%;
  min-width: 200px;
}
</style>
