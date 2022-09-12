<style lang="scss">
.FormMediaSelect {
  position: relative;
  width: 80px;
  height: 80px;

  &__core {
    width: 80px;
    height: 80px;
  }

  &__error {
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f5f7fa;
    color: #909399;
    height: 100%;
  }

  &__button {
    cursor: pointer;
    z-index: 1;
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 20px;
    line-height: 20px;
    font-size: 12px;
    text-align: center;
    color: #fff;
    background: rgba(0, 0, 0, 0.5);
  }
}
</style>

<template>
  <div :class="b()">
    <DialogAttachments
      ref="DialogAttachments"
      @submit="handleUpdate"
    />
    <div
      :class="b('button')"
      @click="$refs.DialogAttachments.handleOpen()"
    >更换图片</div>
    <el-image
      :class="b('core')"
      :src="value"
      fit="fill"
    >
      <div
        slot="error"
        :class="b('error')"
      >
        <i class="el-icon-picture-outline" />
      </div>
    </el-image>
  </div>
</template>

<script>
import create from '@/utils/create-basic'
import DialogAttachments from '@/components/Dialog/DialogAttachments'

export default create({
  name: 'FormMediaSelect',

  components: { DialogAttachments },

  props: {
    value: String
  },

  methods: {
    handleUpdate(data) {
      this.$emit('input', data[0].url)
    }
  }
})
</script>
