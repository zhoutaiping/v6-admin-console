<style lang="scss">
.FormMedias {
  &__list {
    // box-sizing: border-box;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
  }

  &__item {
    display: inline-block;
    vertical-align: top;
    position: relative;
    margin-right: 12px;
    margin-bottom: 12px;
    border: 1px solid rgba(0, 0, 0, 0.15);
    width: 80px;
    height: 80px;
    &:hover {
      .FormMedias__itemAction {
        display: inline-block;
      }
    }

    .el-image {
      width: 80px;
      height: 80px;
    }

    &Action {
      position: absolute;
      z-index: 1;
      right: -10px;
      top: -10px;
      height: 20px;
      line-height: 20px;
      display: none;

      i {
        color: $--color-danger;
        font-size: 20px;
      }
    }
  }
}
</style>

<template>
  <div :class="b()">
    <DialogAttachments
      ref="DialogAttachments"
      @submit="handleUpdateMedia"
    />
    <Draggable v-model="list">
      <transition-group>
        <div
          v-for="(item, index) in list"
          :class="b('item')"
          :key="`${item.id}${index}`"
        >
          <a
            :class="b('itemAction')"
            @click="handleRemove(index)"
          >
            <i class="el-icon-remove" />
          </a>
          <el-image
            :src="item.url"
            fit="cover"
          />
        </div>
      </transition-group>
    </Draggable>
    <el-button
      :class="b('item')"
      icon="el-icon-plus"
      @click="$refs.DialogAttachments.handleOpen()"
    >添加</el-button>
  </div>
</template>

<script>
import create from '@/utils/create-basic'
import DialogAttachments from '@/components/Dialog/DialogAttachments'
import Draggable from 'vuedraggable'

export default create({
  name: 'FormMedias',

  components: { DialogAttachments, Draggable },

  props: {
    value: {
      type: Array,
      default: function() {
        return []
      }
    }
  },

  data() {
    return {
      list: this.value
    }
  },

  watch: {
    value(val) {
      this.list = val
    },

    list(val) {
      this.$emit('input', val)
    }
  },

  methods: {
    handleUpdateMedia(data) {
      this.list.push(...data)
    },

    handleRemove(index) {
      this.list.splice(index, 1)
    }
  }
})
</script>
