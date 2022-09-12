<style lang="scss" scoped>
.input-box {
  margin-bottom: 5px;
}
</style>
<template>
  <div>
    <el-form ref="Form" :model="form">
      <InputSearch
        v-model="form.end_member_email"
        placeholder="终端邮箱"
        class="input-box"
        @submit="$emit('init')"
      />
      <InputSearch
        v-model="form.channel_member_email"
        placeholder="渠道邮箱"
        class="input-box"
        @submit="$emit('init')"
      />
      <InputSearch
        v-model="form.auth_name"
        placeholder="认证名称"
        class="input-box"
        @submit="$emit('init')"
      />

      <el-select
        v-model="form.sale_user_ids"
        filterable
        multiple
        collapse-tags
        placeholder="销售"
        clearable
        class="input-box"
        @change="$emit('init')"
      >
        <el-option-group
          v-for="(group, g_index) in option.sales"
          :key="g_index"
          :label="group.role_name"
        >
          <el-option
            v-for="item in group.children"
            :key="item.value"
            :disabled="item.label === '' || item.status !=='1'"
            :label="item.label"
            :value="item.value"
          />
        </el-option-group>
      </el-select>
    </el-form>
  </div>
</template>
<script>
export default {
  props: {
    sales: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      form: {
        relation_mode: '',
        auth_name: '',
        end_member_email: '',
        channel_member_email: '',
        sale_user_ids: []
      },
      option: {
        relation_mode: [
          { label: '代理', value: '1' },
          { label: '代销', value: '2' }
        ],
        sales: []
      }
    }
  },
  watch: {
    sales: {
      handler(val) {
        if (Array.isArray(val)) {
          this.option.sales = val
        }
      }
    }
  },
  methods: {
    params() {
      return { ...this.form }
    }
  }
}
</script>
