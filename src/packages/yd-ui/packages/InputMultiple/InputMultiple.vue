<style lang="postcss">
$row-hover-color: rgba(var(--color-primary), 0.02);
$table-border-color: rgb(223, 229, 236);

.yd-input-multiple {
  height: 30px;
}

.popover--multiple {
  padding: 0px;
  margin-top: 0px !important;
  border-radius: 2px;
  .popper__arrow {
    display: none;
  }

  .btn-add {
    display: block;
    text-align: center;
    border-top: 1px solid $table-border-color;
    height: 42px;
    line-height: 42px;
    cursor: pointer;

    &.is-disabled {
      cursor: not-allowed;
      opacity: 0.5;
    }

    .yd-icon {
      font-size: 12px;
      margin-right: 4px;
    }

    &__title {
      color: var(--color-primary);
      font-size: 13px;
    }

    &__desc {
      color: #999;
      font-size: 12px;
    }

    &:hover {
      background: $row-hover-color;
    }
  }

  .popover__footer {
    display: flex;
    text-align: center;
    border-top: 1px solid #eee;
    padding: 8px 12px;
    .text--total {
      width: 90px;
      text-align: right;
      line-height: 30px;
      color: #666;
    }
    .text--tips {
      flex: 1;
      color: #666;
      text-align: left;
      margin-left: 8px;
    }
  }

  .input {
    &-list {
      &-wrap {
        max-height: 380px;
        overflow-x: auto;
        display: flex;
        flex-direction: column;
        padding: 12px 0;
        padding-bottom: 0px;
      }
    }

    &-item {
      padding: 0px 12px;
      padding-bottom: 12px;
      .el-input {
        margin-right: 12px;
      }
      &__action {
        width: 24px;
      }
    }
  }

  .yd-form-item {
    &--multiple {
      margin-bottom: 8px;
      padding-right: 12px;
      .el-form-item__content {
        display: flex;
        .el-input {
          flex: 1;
        }
      }
    }
  }
}

.tooltip--input {
  word-break: break-all;
  font-size: 0px;
  padding: 12px;
  border-radius: 2px;
  margin-top: 0px !important;
  border: 1px solid #ddd !important;
  box-shadow: none;
  color: #333;

  span {
    font-size: 12px;
    display: inline-block;
  }

  .text--split {
    border-left: 1px solid #ccc;
    margin-right: 4px;
    margin-left: 8px;
    line-height: 12px;
  }

  .popper__arrow {
    display: none;
  }
}

.yd-input--view {
  font-size: 12px;
  line-height: 22px;
  cursor: text;
  .inner {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-left: -6px;
  }
  .text--placeholder {
    color: #999;
  }

  .yd-input__split {
    color: #999;
  }

  .yd-input {
    &__tag {
      background: #f0f2f5;
      border-radius: 5px;
      padding: 4px 9px;
      margin-right: 4px;
      color: #909399;
    }
  }
  &:hover {
    /* border-color: var(--color-primary); */
  }
}
</style>
<template>
  <div ref="dom" class="yd-input-multiple">
    <el-popover ref="popover" :width="popoverWidth" popper-class="popover--multiple" transition="-" placement="bottom" trigger="click" @show="handleShow" @hide="handleHide">
      <yd-form ref="form" :options="form" mode="in-table">
        <slot/>
        <div class="input-list-wrap">
          <yd-scroll ref="scroll">
            <el-form-item v-for="(item, index) in form.list" :key="index" :prop="'list.' + index + '.value'" :rules="rules" class="yd-form-item--multiple input-item is-inline-error">
              <el-input :ref="`input_${index}`" :placeholder="placeholderItem" v-model="item.value" @change="handleChange(item, index)"/>
              <div class="input-item__action">
                <yd-button type="text" @click="removeItem(item)">??????</yd-button>
              </div>
            </el-form-item>
            <a class="btn-add" @click="addItem">
              <span class="btn-add__title">
                <yd-icon name="el-icon-plus"/>
                ??????
              </span>
              <span class="btn-add__desc">
                <slot name="tips"/>
              </span>
            </a>
          </yd-scroll>
        </div>
      </yd-form>
    </el-popover>
    <el-popover :width="popoverWidth - 24" :open-delay="100" :visible-arrow="false" :disabled="!valueView" transition="-" trigger="hover" popper-class="tooltip--input" placement="bottom">
      <template >
        <div v-for="(item, index) in form.list" :key="index">
          <span v-if="index > 0" class="text--split">&nbsp;</span>
          <span class="text--tag">{{ item.value }}</span>
        </div>
      </template>

      <div slot="reference">
        <el-input v-popover:popover v-model="valueView" :placeholder="placeholder"/>
        <!-- <div class="el-input__inner yd-input--view" v-popover:popover>
          <div class="inner" v-if="valueView">
            <span class="yd-input__tag" v-for="(item, index) in form.list" :key="index">
              {{item.value}}
            </span>
          </div>
          <template v-else>
            <span class="text--placeholder">
              {{placeholder}}
            </span>
          </template>
        </div> -->
      </div>
    </el-popover>
  </div>
</template>

<script>
import Form from '../../src/service/form'

const NAME = 'yd-input-multiple'

export default {
  name: NAME,

  props: {
    value: Array,
    rules: [Array, Object],
    placeholder: String,
    placeholderItem: String,
    showPopover: {
      type: Boolean,
      default: false
    },
    inputEdit: {
      type: Boolean,
      default: true
    },
    split: {
      type: String,
      default: '|'
    }
  },

  data() {
    return {
      form: new Form({
        list: []
      }),
      valueView: '',
      popoverWidth: '',
      change_status: false
    }
  },

  computed: {
    total() {
      return this.value.length
    }
  },

  watch: {
    value(val, oVal) {
      // if (this.change_status) {
      //   this.change_status = false
      // } else {
      this.init()
      // }
    },
    valueView(val, oVal) {
      this.handleValueViewChange()
    }
  },

  mounted() {
    this.init()
  },

  methods: {
    handleShow() {
      // this.handleFocus()
    },
    handleHide() {
      const { valueView } = this
      const value = valueView.split(this.split).filter(_ => _)
      this.handleListUpdate(value)
      this.$emit('input', value)
    },
    handleFocus(index = 0) {
      let input = this.$refs[`input_${index}`]
      if (input && input[0]) input = input[0]
      if (input && input.$el && input.$el.children && input.$el.children[0]) input = input.$el.children[0]

      if (!input) return false

      setTimeout(() => {
        input.focus()
      }, 0)
    },
    init() {
      const $el = this.$refs.dom
      this.popoverWidth = $el.clientWidth - 2

      const { value } = this
      // const list = value

      this.valueView = value.join(this.split)

      this.change_status = true
      this.handleListUpdate(value)
    },

    handleListUpdate(value) {
      const list = []

      value.forEach(i => {
        if (i) {
          list.push({ i })
        }
      })

      if (list.length === 0) {
        list.push({
          value: ''
        })
      }
      this.form.list = list
    },

    handleValueViewChange() {
      const { valueView } = this
      const value = valueView.split(this.split)
      this.handleListUpdate(value)
      this.$emit('input', value)
    },

    handleChange(child, index) {
      const { list } = this.form

      if (child) {
        const reg = new RegExp(`[${this.split}]`, 'gim')
        list[index].value = child.value.replace(reg, '')
      }

      const value = list.map(item => item.value)
      const valueView = value.join(this.split)

      this.valueView = valueView
      this.change_status = true
      this.$emit('input', value)
    },

    removeItem(item) {
      const index = this.form.list.indexOf(item)
      if (index !== -1) {
        this.form.list.splice(index, 1)
        this.handleChange()
      }
    },
    addItem() {
      const { list } = this.form
      // ??????
      this.$refs.form.validate(valid => {
        if (valid) {
          list.push({
            value: ''
          })
          this.$refs.scroll.$el.scrollTo(0, 99999)

          this.$nextTick(() => {
            this.handleFocus(list.length - 1)
          })
        }
      })
    }
  }
}
</script>
