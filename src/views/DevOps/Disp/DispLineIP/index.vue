<style lang="scss" scoped>
.menu-box {
  width: 100%;
  padding: 10px;
  display: inline-grid;
  grid-template-columns: 350px auto;
  grid-template-rows: calc(100vh - 205px);
  grid-column-gap: 10px;
}
.border-box {
  border: 1px solid #f5f5f5;
}
.input-box {
  width: 200px;
  margin: 0 2px;
}
.filter-tree {
  padding: 10px;
  height: calc(100vh - 205px);
}
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
.line-dialog-form {
  padding: 5px;
  .line-dialog-item {
    margin-bottom: 0px;
  }
  .line-dialog-input {
    width: 300px;
  }
}
</style>
<template>
  <div class="menu-box">
    <div class="border-box ">
      <DmScroll>
        <div style="display:flex;padding-bottom: 10px; border-bottom: 1px solid #f5f5f5;">
          <el-input
            v-model="filterText"
            placeholder="输入关键字进行过滤"
            class="input-box"
          />
          <el-button
            :disabled="loading"
            type="primary"
            @click="init"
          >刷新</el-button>
          <el-button
            type="primary"
            @click="$refs.dialogEdit.handleOpen(null, 'add')"
          >新增</el-button>
        </div>
        <el-tree
          v-loading="loading"
          ref="tree"
          :data="list"
          :props="defaultProps"
          :filter-node-method="filterNode"
          :default-expanded-keys="[checkId]"
          node-key="id"
          class="filter-tree"
          @node-click="handleNodeClick"
        >
          <span
            slot-scope="{ node, data }"
            class="custom-tree-node"
          >
            <span> {{ node.label }}</span>
          </span>
        </el-tree>
      </DmScroll>
    </div>
    <div class="border-box ">
      <el-divider
        v-show="checkForm.id"
        content-position="left"
      ><span style="font-weight: 700; font-size: 15px; color: rgba(0, 0, 0, 0.65);">{{ checkForm.name }}</span></el-divider>
      <DmScroll>
        <el-form
          ref="checkForm"
          :model="checkForm"
          :rules="rules"
          label-position="left"
          label-width="120px"
          size="mini"
          class="line-dialog-form"
        >
          <el-form-item
            label="线路名称"
            prop="name"
          >
            <el-input
              v-model="checkForm.name"
              class="line-dialog-input"
            />
          </el-form-item>
          <el-form-item
            label="线路标识"
            prop="key"
          >
            <el-input
              v-model="checkForm.key"
              class="line-dialog-input"
            />
          </el-form-item>
          <el-form-item
            label="状态"
            prop="status"
          >
            <el-radio-group v-model="checkForm.status">
              <el-radio-button :label="1">启用</el-radio-button>
              <el-radio-button :label="0">禁用</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item
            label="排序"
            prop="sort"
          >
            <el-input-number
              v-model="checkForm.sort"
              :min="1"
              controls-position="right"
              placeholder=""
            />
          </el-form-item>
          <el-form-item
            label="备注"
            prop="remark"
          >
            <el-input
              v-model="checkForm.remark"
              type="textarea"
              placeholder="请输入备注"
              class="line-dialog-input"
            />
          </el-form-item>
          <el-form-item label-width="0">
            <el-button :disabled="!checkForm.id" type="primary" @click="handleSubmit">保存</el-button>
            <el-button :disabled="!checkForm.id" type="primary" @click="$refs.dialogEdit.handleOpen(checkForm, 'next')">新增下级</el-button>
            <el-button :disabled="!checkForm.id" type="primary" @click="$refs.dialogBindIp.handleOpen(checkForm, 'bind')">绑定IP</el-button>
          </el-form-item>
        </el-form>
      </DmScroll>
    </div>
    <DialogEdit
      ref="dialogEdit"
      @handleLoad="init"
    />
    <DialogBindIp
      ref="dialogBindIp"
      @handleLoad="init"
    />
    <DialogItem
      ref="dialogItem"
      @handleLoad="init"
    />
  </div>
</template>
<script>
import DialogEdit from './components/DialogEdit'
import DialogBindIp from './components/DialogBindIp'
import DialogItem from './components/DialogItem'
import { RULES } from './form'
export default {
  components: { DialogEdit, DialogBindIp, DialogItem },
  data() {
    return {
      loading: false,
      bindParams: {
        id: ''
      },
      defaultProps: {
        children: 'childs',
        label: 'name'
      },
      filterText: '',
      type: 'update',
      checkId: '',
      checkForm: {},
      list: [],
      resource: [],
      rules: RULES
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },
  async created() {
    this.init()
  },
  methods: {
    async init(params = {}) {
      params = {
        ...this.bindParams
      }
      this.loading = true
      this.InvokeDispApi.get('/line/tree', params).then(res => {
        this.list = res
        if (!Object.keys(this.checkForm).length) this.checkForm = this.list[0]
      })
      setTimeout(() => { this.loading = false }, 500)
    },

    filterNode(value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },

    handleNodeClick(data) {
      this.checkId = data.id
      this.type = 'update'
      this.checkForm = Object.assign(data, {})
    },

    handleSubmit() {
      this.$refs.checkForm.validate((valid) => {
        if (valid) {
          const params = {
            ... this.checkForm
          }
          delete params.childs
          this.InvokeDispApi.post('/line/save', params).then(res => {
            this.Message('ACTION_SUCCESS')
            this.init()
          })
        }
      })
    }
  }
}
</script>
