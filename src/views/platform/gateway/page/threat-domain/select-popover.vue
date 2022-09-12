<style lang="scss" scoped>
.footer {
  text-align: center;
  padding: 10px 12px;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  margin: 20px 0 0;
}
.margin-bottom {
  margin-bottom: 10px;
}
.input-box {
  width: 270px;
}
.number-box {
  ::v-deep .el-input__inner {
    text-align: left;
  }
}
</style>
<template>
  <div style="display:inline-block;">

    <el-popover
      v-model="visible"
      placement="bottom-start"
      width="300"
      @show="show"
    >
      <el-button
        slot="reference"
        type="text"
      >
        {{ searchText }}
      </el-button>
      <template v-if="logic.length">
        <el-select
          v-model="val.logic"
          class="margin-bottom input-box"
        >
          <el-option
            v-for="item in logic"
            :key="item + Math.random().toString(36).substr(-10)"
            :value="item"
            :label="options.logic[item]"
          />
        </el-select>
      </template>
      <template v-if="mode === 'select'">
        <el-select
          v-model="val.value"
          clearable
          class="input-box"
        >
          <el-option
            v-for="item in selects"
            :key="item.value + Math.random().toString(36).substr(-10)"
            :disabled="item[optionParams.disabled]"
            :value="item[optionParams.value]"
            :label="item[optionParams.label]"
          />
        </el-select>
      </template>
      <template v-else-if="mode === 'tree-select'">
        <el-popover
          placement="bottom-start"
          width="280"
          @show="e =>{
            filterText = ''
          }"
        >
          <template>
            <el-input
              v-model="filterText"
              placeholder="输入关键字进行过滤"
            />
            <el-tree
              ref="treeSelect"
              :data="treeData"
              :props="defaultProps"
              :filter-node-method="filterNode"
              default-expand-all
              show-checkbox
              node-key="id"
              style="max-height: 400px; overflow-y: auto;"
              @check-change="checkChange"
            />
          </template>
          <el-input
            slot="reference"
            v-model="treeText"
            placeholder="请选择"
            suffix-icon="el-icon-arrow-down"
            readonly
            class="input-box"
          />
        </el-popover>
      </template>
      <template v-else-if="mode === 'age'">
        <el-input-number
          v-model="val.value"
          :min="0"
          :max="200"
          :precision="0"
          placeholder="请输入年龄"
          controls-position="right"
          class="input-box number-box"
        />
      </template>
      <template v-else-if="mode === 'name'">
        <el-input
          v-model="val.value"
          placeholder="请输入姓名"
          class="input-box"
        />
      </template>
      <div class="footer">
        <el-button
          size="mini"
          @click="visible = false"
        >取消</el-button>
        <el-button
          size="mini"
          type="primary"
          @click="handleSubmit"
        >确定</el-button>
      </div>
    </el-popover>
  </div>
</template>
<script>
import { deepClone } from '@/utils'
export default {
  name: 'SelectPopover',
  props: {
    searchText: {
      type: String,
      default: '搜索条件'
    },
    mode: {
      type: String,
      default: 'select'
    },
    selects: {
      type: Array,
      default: () => []
    },
    logic: {
      type: Array,
      default: () => []
    },
    value: {
      type: [String, Number, Object, Array],
      default: () => {
        return ''
      }
    },
    optionParams: {
      type: Object,
      default: () => {
        return {
          label: 'label',
          value: 'value',
          disabled: 'disabled'
        }
      }
    }
  },
  data() {
    return {
      visible: false,
      val: '',
      options: {
        logic: {
          recently: '最近',
          past: '过往',
          all: '所有',
          equal_to: '等于',
          greater_than_qual_to: '大于等于',
          less_than_equal_to: '小于等于',
          search: '搜索范围',
          not_filled: '未填写',
          or: '或者',
          and: '并且',
          male: '男',
          female: '女'
        }
      },
      treeText: '',
      filterText: '',
      treeData: [{
        id: 1,
        label: '一级 1',
        children: [{
          id: 4,
          label: '二级 1-1',
          children: [{
            id: 9,
            label: '三级 1-1-1'
          }, {
            id: 10,
            label: '三级 1-1-2'
          }]
        }]
      }, {
        id: 2,
        label: '一级 2',
        children: [{
          id: 5,
          label: '二级 2-1'
        }, {
          id: 6,
          label: '二级 2-2'
        }]
      }, {
        id: 3,
        label: '一级 3',
        children: [{
          id: 7,
          label: '二级 3-1'
        }, {
          id: 8,
          label: '二级 3-2'
        }]
      }],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  computed: {
    label() {
      let val
      if (this.mode === 'select') {
        val = this.searchText
        if (this.val.logic) val = val + '\xa0' + this.options.logic[this.val.logic]
        if (this.val.value !== '') val = val + '\xa0' + this.selects.find(i => i.value === this.val.value).label || ''
      } else if (this.mode === 'tree-select') {
        val = this.searchText
        if (this.val.logic) val = val + '\xa0' + this.options.logic[this.val.logic]
        if (this.treeText) val = val + '\xa0' + this.treeText
      } else if (this.mode === 'age') {
        val = this.searchText
        if (this.val.logic) val = val + '\xa0' + this.options.logic[this.val.logic]
        val = val + '\xa0' + this.val.value
      } else if (this.mode === 'name') {
        if (this.val.value) val = this.searchText + '\xa0' + this.val.value
      }
      return val
    }
  },

  watch: {
    val(val) {
      // this.$emit('input', val)
    },
    value(val) {
      this.val = deepClone(val)
    },
    filterText(val) {
      this.$refs.treeSelect.filter(val)
    }
  },

  methods: {
    show() {
      this.val = JSON.parse(JSON.stringify(this.value)) || ''
      if (this.mode === 'tree-select') {
        const { treeSelect } = this.$refs
        treeSelect.setCheckedKeys(this.val.value)
        const check_node = treeSelect.getCheckedNodes().map(i => i.label)
        this.treeText = check_node.join('|')
        this.filterText = ''
      }
    },
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    checkChange(data, checked, indeterminate) {
      const { treeSelect } = this.$refs
      const check_node = treeSelect.getCheckedNodes().map(i => i.label)
      this.val.value = treeSelect.getCheckedKeys()
      this.treeText = check_node.join('|')
    },

    handleSubmit() {
      this.visible = false
      if (this.mode === 'tree-select') {
        const { treeSelect } = this.$refs
        this.val.value = treeSelect.getCheckedKeys()
      }

      this.val.label = this.label
      this.$emit('input', this.val)
      this.$emit('change', this.val)
    }
  }
}
</script>
