<style lang="scss" scoped>
.input-box {
  width: 300px;
}
.input-box-150 {
  width: 150px;
}
.form-itme-fix {
  display: flex;
  margin-bottom: 0px;
}
.form-itme-line {
  display: inline-block;
  min-width: 200px;
}
</style>
<template>
  <div>
    <el-form
      v-loading="loading"
      ref="form"
      :model="form"
      :rules="rules"
      size="mini"
      label-width="90px"
      style="padding:5px;"
    >
      <el-form-item v-show="form.pid!=='0'" label="父级资源">
        <el-select ref="selectReport" v-model="form.pname" placeholder="上级菜单" class="input-box">
          <el-option :value="form.pid" :label="form.pname" style="min-height:300px; overflow: auto;background-color:#fff">
            <el-tree
              ref="menu"
              :data="reportData"
              :props="defaultProps"
              node-key="id"
              @node-click="handleNodeClick"
            />
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="资源名称" prop="name">
        <el-input v-model="form.name" class="input-box"/>
      </el-form-item>
      <el-form-item class="form-itme-fix" label-width="0">
        <el-form-item
          label="资源类型"
          prop="type"
          class="form-itme-line"
        >
          <el-radio-group v-model="form.type">
            <el-radio-button
              v-for="(item, index) in TYPE"
              :key="index"
              :label="item.value"
            >{{ item.label }}</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="资源状态"
          prop="status"
          class="form-itme-line"
        >
          <el-radio-group v-model="form.status">
            <el-radio-button
              v-for="(item, index) in STATUS"
              :key="index"
              :label="item.value"
            >{{ item.label }}</el-radio-button>
          </el-radio-group>
        </el-form-item>
      </el-form-item>
      <el-form-item
        class="form-itme-fix"
        label-width="0"
      >
        <el-form-item
          label="路由"
          prop="router"
          class="form-itme-line"
        >
          <el-input
            v-model="form.router"
            placeholder="路由"
            class="input-box"
          />
        </el-form-item>
        <el-form-item
          label="图标"
          prop="icon"
          class="form-itme-line"
        >
          <el-input
            v-model="form.icon"
            placeholder="图标路径"
            class="input-box-150"
          />
        </el-form-item>
        <el-form-item
          label="排序"
          prop="sort"
          class="form-itme-line"
        >
          <el-input-number
            v-model="form.sort"
            :min="1"
            controls-position="right"
            class="input-number"
          />
        </el-form-item>
      </el-form-item>
      <el-form-item
        class="form-itme-fix"
        label-width="0"
      >
        <el-form-item
          label="请求类型"
          prop="method"
          class="form-itme-line"
        >
          <el-radio-group v-model="form.method">
            <el-radio-button
              v-for="(item, index) in METHOD"
              :key="index"
              :label="item.value"
              :value="item.value"
            >{{ item.label }}</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="前后端"
          prop="router_type_fb"
          class="form-itme-line"
        >
          <el-radio-group v-model="form.router_type_fb">
            <el-radio-button
              v-for="(item, index) in ROUTER_TYPE_FB"
              :key="index"
              :label="item.value"
              :value="item.value"
            >{{ item.label }}</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="路由类型"
          prop="router_type"
          class="form-itme-line"
        >
          <el-radio-group v-model="form.router_type">
            <el-radio-button
              v-for="(item, index) in ROUTER_TYPE"
              :key="index"
              :label="item.value"
              :value="item.value"
            >{{ item.label }}</el-radio-button>
          </el-radio-group>
        </el-form-item>

      </el-form-item>
      <el-form-item
        class="form-itme-fix"
        label-width="0"
      >
        <el-form-item
          label="平台"
          prop="plat"
          class="form-itme-line"
        >
          <el-radio-group v-model="form.plat" >
            <el-radio-button
              v-for="(item, index) in PLAT"
              :key="index"
              :label="item.label"
              :value="item.value"
            >{{ item.label }}</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="平台Host"
          prop="plat_host"
          class="form-itme-line"
        >
          <el-input
            v-model="form.plat_host"
            placeholder="平台HOST"
            class="input-box "
          />
        </el-form-item>
      </el-form-item>
      <el-form-item label="备注">
        <el-input
          v-model="form.remark"
          :autosize="{ minRows: 2, maxRows: 4}"
          placeholder="备注"
          type="textarea"
          class="input-box"
        />
      </el-form-item>
      <el-form-item class="form-itme-fix">
        <el-button
          v-if="(type === 'add' && Number(form.id) === 0) || (type === 'update' && form.id)"
          :disabled="loading"
          type="primary"
          @click="handleSubmit"
        >保存</el-button>
        <el-button
          v-show="form.id && form.Children && form.Children.length === 0"
          :disabled="loading && !form.id"
          type="primary"
          @click="handleDel(form)"
        >删除</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import treeMixins from '../treeMixins'
export default {
  mixins: [treeMixins],
  props: {
    checkForm: {
      type: Object,
      default: () => { }
    },
    type: {
      type: String, default: 'update'
    },
    menu: {
      type: Array,
      default: () => []
    }
  },
  data() {
    const validItem = [
      { required: true, message: '必填字段' }
    ]
    return {
      loading: false,
      form: {},
      rules: {
        name: validItem,
        status: validItem,
        router: validItem,
        icon: validItem,
        plat_host: validItem,
        router_type_fb: validItem,
        router_type: validItem,
        plat: validItem,
        type: validItem,
        sort: validItem
      },
      defaultProps: {
        children: 'Children',
        label: 'name'
      }
    }
  },
  computed: {
    reportData() {
      if (this.menu.length) return this.menu
      return []
    }
  },
  watch: {
    checkForm(val) {
      this.loading = true
      this.$refs.form.resetFields()
      const rowData = JSON.parse(JSON.stringify(val))
      if (val.pid !== '0') {
        if (this.$refs.menu.getNode(val.pid)) rowData.pname = this.$refs.menu.getNode(val.pid).data.name
      }
      this.form = rowData || {
        icon: '',
        id: '',
        method: '',
        name: '',
        pid: '',
        pname: '',
        plat: 'adminV5Api',
        plat_host: '',
        remark: '',
        router: '',
        router_type: 1,
        router_type_fb: 1,
        sort: 255,
        status: 1,
        type: 'op'
      }
      setTimeout(() => {
        this.loading = false
      }, 500)
    }

  },
  methods: {
    handleSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          const form = {
            ... this.form
          }
          if (form.Children) delete form.Children
          this.loading = true
          if (this.type === 'add') {
            form.id = ''
            this.InvokeAllApi.post('/V4/rbac.resource.add', form).then(res => {
              this.loading = false
              this.$emit('init')
              this.Message('ACTION_SUCCESS')
            }).catch(e => { this.loading = false })
          }
          if (this.type === 'update') {
            this.InvokeAllApi.put('/V4/rbac.resource.update', form).then(res => {
              this.loading = false
              this.$emit('init')
              this.Message('ACTION_SUCCESS')
            }).catch(e => { this.loading = false })
          }
        }
      })
    },

    handleNodeClick: function(node) {
      if (node.children) {
        //
      } else {
        this.$set(this.form, 'pid', node.id)
        this.$set(this.form, 'pname', node.name)
        this.$refs.selectReport.blur()
      }
    }

  }
}
</script>
