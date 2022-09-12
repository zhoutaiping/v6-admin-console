
<style lang="scss" scoped>
.search-box {
  display: inline-block;
  text-align: left;
}
.search-box_right {
  display: inline;
  float: right;
}

.tag-box {
  text-align: left;
}
</style>
<template>
  <div>
    <el-card :body-style="{padding:'12px'}">
      <div style="margin-bottom:10px;">
        <div class="search-box">
          <div
            v-show="search"
            style="display: inline-block;"
          >
            <SelectPopover
              v-model="form.type"
              :logic="['recently','all']"
              mode="tree-select"
              search-text="类型"
              @change="$emit('init', form)"
            />
            <el-divider direction="vertical" />
            <SelectPopover
              v-model="form.age"
              :logic="['greater_than_qual_to','equal_to','less_than_equal_to']"
              mode="age"
              search-text="年龄"
              @change="$emit('init', form)"
            />
            <el-divider direction="vertical" />
            <SelectPopover
              v-model="form.name"
              mode="name"
              search-text="姓名"
              @change="$emit('init', form)"
            />
            <el-divider direction="vertical" />
            <SelectPopover
              v-model="form.status"
              :selects="[
                {label:'启用',value:1},
                {label:'禁用',value:0},
              ]"
              search-text="状态"
              @change="$emit('init', form)"
            />
          </div>

          <el-button
            size="mini"
            type="text"
            @click="search = !search"
          >
            <el-tag><i :class="search ? 'el-icon-caret-left': 'el-icon-caret-right'" />{{ search ? '隐藏':'显示' }}</el-tag>
          </el-button>
        </div>
        <div class="search-box_right">
          <el-switch v-model="search" /> <span style="font-size:12px; color:#909399;">高级搜索</span>
        </div>
      </div>
      <div
        v-show="showTagBox"
        class="tag-box"
      >
        <el-tag
          v-for="item in Object.keys(form)"
          v-show="form[item].label"
          :key="item"
          type="info"
          style="margin:2px"
          closable
          @close="closeForm(item)"
        >
          <span>
            {{ form[item].label }}
          </span>
        </el-tag>
        <a
          class="el-icon-delete"
          @click="resetForm('reset')"
        />
        <el-button
          size="small"
          type="text"
          @click="submit"
        >保存搜索条件</el-button>
      </div>
    </el-card>
  </div>
</template>
<script>
import SelectPopover from './select-popover'
export default {
  name: 'SearchCard',
  components: { SelectPopover },
  data() {
    return {
      search: true,
      defaultForm: {
        type: {
          logic: 'recently',
          value: []
        },
        age: {
          logic: 'equal_to',
          value: ''
        },
        status: {
          value: ''
        },
        name: {
          value: ''
        }
      },
      form: {}
    }
  },
  computed: {
    showTagBox() {
      let val = false
      Object.keys(this.form).forEach(key => {
        if (this.form[key].label) val = true
      })
      return val
    }
  },
  created() {
    this.resetForm()
  },
  methods: {
    resetForm(type = '') {
      this.form = Object.assign({}, this.defaultForm)
      if (type === 'reset') {
        this.$message.success('操作成功！')
        this.$emit('init', { ...this.form })
      }
    },
    closeForm(item) {
      this.$set(this.form, item, this.defaultForm[item])
      this.$emit('init', { ...this.form })
    },
    submit() {
      this.$message.success('操作成功！')
    }
  }
}
</script>
