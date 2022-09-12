<style lang="scss">
.InputMultiple {
  &__popover {
    padding: 0px;
  }

  &__list {
    max-height: 300px;
    overflow-x: auto;
    display: flex;
    flex-direction: column;

    .ps-container {
      padding: 12px;
    }
  }

  &__body {
    padding: 12px;
  }

  &__footer {
    padding: 12px;
    border-top: 1px solid $--border-color-light;
    text-align: right;
  }

  &__item {
    .el-form-item__content {
      display: flex;
      position: relative;
    }

    &:not(:last-child) {
      margin-top: 8px;
    }

    .input {
      margin-right: 30px;
    }

    .btn-remove {
      position: absolute;
      right: 0px;
      font-size: 14px;
    }
  }
}
</style>

<template>
  <div :class="b()">
    <el-popover
      :popper-class="b('popover')"
      placement="bottom"
      width="400"
      trigger="click"
    >
      <template v-if="mode === 'batch'">
        <div :class="b('body')">
          <el-input
            v-model="valTextarea"
            :rows="15"
            :placeholder="placeholder"
            type="textarea"
            @blur="handleChangeTextarea"
          />
        </div>
      </template>
      <template v-if="mode === 'list'">
        <div :class="b('list')">
          <yd-scroll>
            <div
              v-for="(item, index) in list"
              :key="index"
            >
              <el-form
                :model="item"
                label-position="top"
              >
                <el-form-item
                  :rules="index === (list.length - 1) ? null : rules"
                  :class="b('item')"
                  prop="value"
                >
                  <el-input
                    v-model="item.value"
                    :placeholder="placeholder"
                    class="input"
                    @blur="handleChangeList"
                    @focus="e => handleFocusItem(e, index)"
                    @input="value => handleChangeItem(value, index)"
                  />
                  <el-button
                    v-show="index !== list.length - 1"
                    :disabled="index === 0 && list.length === 2"
                    :placeholder="placeholder"
                    type="text"
                    class="el-icon-remove-outline btn-remove"
                    @click="handleRemove(index)"
                  />
                </el-form-item>
              </el-form>
            </div>
          </yd-scroll>
        </div>
      </template>
      <div :class="b('footer')">
        <a @click="handleChangeMode">
          {{ mode === 'batch' ? '返回列表' : '批量输入' }}
        </a>
      </div>
      <template slot="reference">
        <el-input
          v-model="valView"
          :placeholder="placeholder"
          :readonly="readonly"
          @input="handleChangeInput"
        />
      </template>
    </el-popover>
  </div>
</template>

<script>
import create from '@/utils/create-basic'

export default create({
  name: 'InputMultiple',

  components: {},

  props: {
    value: [String, Number, Array],
    placeholder: String,
    rules: Object,
    readonly: Boolean
  },

  data() {
    return {
      mode: 'list',
      val: [],
      valTextarea: '',
      list: [],
      valView: ''
    }
  },

  watch: {
    value() {
      this.init()
    }
  },

  created() {
    this.init()
  },

  methods: {
    handleChangeInput(value) {
      this.val = value.split('|')
      this.initTextarea()
      this.initList()
      this.handleUpdate()
    },

    handleFocusItem(e, index) {
      if ((index + 1) === this.list.length) {
        const val = this.list[index].value
        if (val) this.list.push({ value: '' })
      }
    },
    // 添加待输入项
    listPushItem() {
      const list = this.list
      const lastItem = list[list.length - 1]
      if (lastItem && !lastItem.value) return
      list.push({ value: '' })
    },

    handleChangeItem(val, index) {
      this.listPushItem()
    },

    handleRemove(index) {
      this.list.splice(index, 1)
      this.handleChangeList()
      this.handleUpdate()
    },

    handleChangeMode() {
      this.mode = this.mode === 'batch' ? 'list' : 'batch'
    },

    init() {
      const value = this.value
      if (Array.isArray(value)) {
        this.val = value
        this.valView = this.val.join('|')
      } else {
        this.val = []
        this.valView = this.val.join('|')
      }

      this.initList()
      this.initTextarea()
    },

    initTextarea() {
      this.valTextarea = this.val.join('\n')
    },

    handleChangeList() {
      this.val = this.list.map(_ => _.value)
      this.initTextarea()
      this.handleUpdate()
    },

    initList() {
      const list = this.val.map(value => {
        return { value }
      })
      this.list = list
      this.listPushItem()
    },
    // 批量输入框改变
    handleChangeTextarea() {
      const valTextarea = this.valTextarea
      this.val = valTextarea.split('\n').filter(Boolean)
      this.initList()
      this.handleUpdate()
    },

    handleUpdate() {
      const value = this.val.filter(Boolean)
      this.valView = value.join('|')
      this.$emit('input', value)
    }
  }
})
</script>
