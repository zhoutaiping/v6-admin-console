<template>
  <DmDialog
    ref="Dialog"
    :fetch-submit="handleClick"
    :title="dialogForm.title"
    width="600px"
    aside
  >
    <DmScroll>
      <el-form
        v-loading="dialogForm.loading"
        ref="dialogForm"
        :model="dialogForm"
        :rules="rules"
        label-width="90px"
        class="dialogForm"
        size="mini"
      >
        <el-form-item
          v-if="dialogForm.p_name"
          label="上级资源"
          style="margin-top:5px;"
        >
          <el-input
            v-model="dialogForm.p_name"
            placeholder="请输入资源名称"
            class="dialogForm-input"
          />
        </el-form-item>
        <el-form-item
          label="资源名称"
          style="margin-top:5px;"
          prop="name"
        >
          <el-input
            v-model="dialogForm.name"
            placeholder="请输入资源名称"
            class="dialogForm-input"
          />
        </el-form-item>
        <el-form-item
          label="资源状态"
          prop="status"
        >
          <el-radio-group v-model="dialogForm.status">
            <el-radio-button
              v-for="(item, index) in STATUS"
              :key="index"
              :label="item.value"
            >{{ item.label }}</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="资源类型"
          prop="type"
        >
          <el-radio-group v-model="dialogForm.type">
            <el-radio-button
              v-for="(item, index) in TYPE"
              :key="index"
              :label="item.value"
            >{{ item.label }}</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="请求类型"
          prop="method"
        >
          <el-radio-group v-model="dialogForm.method">
            <el-radio-button
              v-for="(item, index) in METHOD"
              :key="index"
              :label="item.value"
              :value="item.value"
            >{{ item.label }}</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="路由"
          prop="router"
        >
          <el-input
            v-model="dialogForm.router"
            placeholder="路由"
            class="dialogForm-input"
          />
        </el-form-item>
        <el-form-item
          label="路由类型"
          prop="router_type"
        >
          <el-radio-group v-model="dialogForm.router_type">
            <el-radio-button
              v-for="(item, index) in ROUTER_TYPE"
              :key="index"
              :label="item.value"
              :value="item.value"
            >{{ item.label }}</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="前后端"
          prop="router_type_fb"
        >
          <el-radio-group v-model="dialogForm.router_type_fb">
            <el-radio-button
              v-for="(item, index) in ROUTER_TYPE_FB"
              :key="index"
              :label="item.value"
              :value="item.value"
            >{{ item.label }}</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="排序"
          prop="sort"
        >
          <el-input-number
            v-model="dialogForm.sort"
            :min="1"
            controls-position="right"
            class="dialogForm-input input-number"
          />
        </el-form-item>
        <el-form-item
          label="图标地址"
          prop="icon"
        >
          <el-input
            v-model="dialogForm.icon"
            placeholder="图标地址"
            class="dialogForm-input"
          />
        </el-form-item>
        <el-form-item
          label="平台"
          prop="plat"
        >
          <el-radio-group v-model="dialogForm.plat">
            <el-radio-button
              v-for="(item, index) in PLAT"
              :key="index"
              :label="item.label"
              :value="item.value"
            >{{ item.label }}</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="平台HOST"
          prop="plat_host"
        >
          <el-input
            v-model="dialogForm.plat_host"
            placeholder="平台HOST"
            class="dialogForm-input"
          />
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model="dialogForm.remark"
            :autosize="{ minRows: 2, maxRows: 4}"
            placeholder="备注"
            type="textarea"
            class="dialogForm-input"
          />
        </el-form-item>
      </el-form>
    </DmScroll>
  </DmDialog>
</template>
<script>

import * as FORM from './dialogForm'
import DmTable from '@/components/DmTable'
import PermissionResource from '@/views/platform/crm/system/resourceApi/permissionApi'
export default {
  components: { DmTable },
  data() {
    return {
      dialogForm: FORM.SAVE_FORM,
      rules: FORM.SAVE_FORM_RULE,
      STATUS: FORM.STATUS,
      PLAT: FORM.PLAT,
      TYPE: FORM.TYPE,
      ROUTER_TYPE: FORM.ROUTER_TYPE,
      ROUTER_TYPE_FB: FORM.ROUTER_TYPE_FB,
      METHOD: FORM.METHOD
    }
  },

  mounted() {

  },

  methods: {
    handleOpen(type, data) {
      this.$refs.Dialog.handleOpen()
      if (this.$refs.dialogForm) this.$refs.dialogForm.resetFields()
      this.dialogForm.loading = true
      this.dialogForm.dialog_type = type
      if (type === 'add') {
        setTimeout(() => { this.dialogForm.loading = false }, 300)
      } else if (type === 'addChildren') {
        this.dialogForm.title = '新增下级资源'
        this.getResource(data, type)
      } else if (type === 'update') {
        this.dialogForm.title = '编辑'
        this.getResource(data, type)
      }
    },
    getResource(data, type) {
      const params = {
        id: data.id
      }
      PermissionResource.getResourceById(params).then(res => {
        this.dialogForm.loading = false
        if (type === 'update') {
          this.dialogForm.icon = res.icon
          this.dialogForm.id = res.id
          this.dialogForm.method = res.method
          this.dialogForm.name = res.name
          this.dialogForm.pid = res.pid
          this.dialogForm.plat = res.plat
          this.dialogForm.plat_host = res.plat_host
          this.dialogForm.remark = res.remark
          this.dialogForm.router = res.router
          this.dialogForm.router_type = Number(res.router_type)
          this.dialogForm.router_type_fb = Number(res.router_type_fb)
          this.dialogForm.sort = Number(res.sort)
          this.dialogForm.status = Number(res.status)
          this.dialogForm.type = res.type
        } else if (type === 'addChildren') {
          this.dialogForm.pid = res.id
          this.dialogForm.p_name = res.name
        }
      }).catch(e => {
        this.dialogForm.loading = false
      })
    },

    handleClick(form = 'dialogForm') {
      const that = this
      this.$refs[form].validate(valid => {
        if (valid) {
          const { icon, id, method, name, pid, plat, plat_host, remark, router, router_type, router_type_fb, sort, status, type, dialog_type } = this.dialogForm
          const params = {
            id, pid, method,
            plat, plat_host,
            name: name.trim(),
            router_type, router_type_fb, sort, status, type,
            router: router.trim(),
            icon: icon.trim(),
            remark: remark.trim()

          }

          if (dialog_type === 'add' || dialog_type === 'addChildren') {
            that.handleAdd(params)
          } else if (dialog_type === 'update') {
            that.handleUpdate(params)
          }
        } else {
          this.$refs.Dialog.afterValidate()
        }
      })
    },

    handleAdd(params) {
      PermissionResource.ResourceAdd(params).then(res => {
        this.Message('ACTION_SUCCESS')
        this.$emit('on-success')
        this.$refs.Dialog.handleClose()
      }).catch(e => {
        this.$refs.Dialog.afterValidate()
      })
    },

    handleUpdate(params) {
      this.dialogForm.submit()
      PermissionResource.ResourceUpdate(params).then(res => {
        this.Message('ACTION_SUCCESS')
        this.$emit('on-success')
        this.$refs.Dialog.handleClose()
      }).catch(e => {
        this.$refs.Dialog.afterValidate()
      })
    }

  }
}
</script>

<style lang="scss">
.dialogForm-input {
  width: 300px;
}
</style>
