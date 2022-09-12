<style lang="scss" scoped>
.input-box {
  width: 300px;
}
</style>
<template>
  <div>
    <el-form
      ref="Form"
      :model="form"
      :rules="rules"
      label-position="left"
      label-width="150px"
    >
      <el-form-item
        label="映射主体名称"
        prop="name"
      >
        <el-select
          v-model="form.name"
          placeholder="类别名称"
          class="input-box"
          @change="e => changeSource(e, 'label')"
        >
          <el-option
            v-for="(item, index) in SOURCE"
            :key="index"
            :label="item.label"
            :value="item.label"
            :disabled="item.disabled"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        label=""
        prop="identifier"
      >
        <span slot="label">
          映射主体标识
          <el-tooltip
            :content="content_flag"
            placement="top"
          >
            <i class="el-icon-question" />
          </el-tooltip>
        </span>
        <el-select
          v-model="form.identifier"
          placeholder="映射主体标识"
          class="input-box"
          @change="e => changeSource(e, 'value')"
        >
          <el-option
            v-for="(item, index) in SOURCE"
            :key="index"
            :label="item.value"
            :value="item.value"
            :disabled="item.disabled"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <dm-table
      add-button
      style="width:700px"
      @click-add-button="hnadleAdd"
    >
      <el-table :data="form.associations">
        <el-table-column
          label="威胁类别标识"
          width="150"
        >
          <template slot-scope="scope">
            <el-input
              v-model="scope.row.identifier"
              readonly
            />
            <!-- <el-select
              v-model="scope.row.source_identifier"
              placeholder="威胁类别标识"
              disabled
              @change="e => changeRowSource(e, 'value', scope.$index)"
            >
              <el-option
                v-for="(item, index) in ASSOC_LIST"
                :key="index"
                :label="item.value"
                :value="item.value"
              />
            </el-select> -->
          </template>
        </el-table-column>
        <el-table-column label="威胁类别名称">
          <template slot-scope="scope">
            <el-select
              v-model="scope.row.name"
              placeholder="威胁类别名称"
              @change="e => changeRowSource(e, 'label', scope.$index)"
            >
              <el-option
                v-for="(item, index) in ASSOC_LIST"
                :key="index"
                :label="item.label"
                :value="item.label"
                :disabled="item.disabled"
              />
            </el-select>
          </template>
        </el-table-column>

        <el-table-column
          label="操作"
          width="120"
        >
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="handleDel(scope.$index, scope.row.id)"
            > 删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </dm-table>
  </div>
</template>
<script>
import { deepClone } from '@/utils'
import ColumnForm from '@/components/Column/ColumnForm'
export default {
  name: 'CardRecord',
  components: { ColumnForm },
  props: {
    value: {
      type: Object,
      default: () => {}
    },
    mode: {
      type: String,
      default: ''
    },
    SOURCE: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      content_flag: '唯一标识 第三方威胁情报',
      form: this.value,
      row: {
        identifier: '', name: ''
      },
      rowKey: ['identifier', 'name'],
      rules: {
        name: { required: true, message: ' ' },
        identifier: { required: true, message: ' ' },
        source_identifier: { required: true, message: ' ' }
      },
      SOURCE: [],
      SOURCE_IDENTIFIER: []
    }
  },
  computed: {
    ASSOC_LIST() {
      return this.SOURCE_IDENTIFIER.map(i => {
        return {
          label: i.name,
          value: i.identifier,
          disabled: this.form.associations.findIndex(f => f.source_identifier === i.identifier) > -1
        }
      })
    }
  },
  watch: {
    form(val) {
      this.$emit('input', val)
      this.fetchAassoc(this.form.identifier)
    },
    value(val) {
      this.form = val
    }
  },
  mounted() {
    this.$nextTick(() => {
      if (this.form.identifier) {
        this.fetchAassoc(this.form.identifier)
      }
    })
  },
  methods: {
    async fetchAassoc(source_identifier) {
      const data = await this.Fetch.get('/fd/V4/gateway/threat.classification.assoc.list', { page: 1, page_size: 999, source_identifier: source_identifier })
      const { list = [] } = data || {}
      this.SOURCE_IDENTIFIER = list
    },
    init() {

    },

    changeSource(e, type) {
      const Item = this.SOURCE.find(i => i[type] === e)
      this.form.name = Item.label
      this.form.identifier = Item.value
      this.form.associations = []
      this.fetchAassoc(Item.value)
    },
    changeRowSource(e, type, index) {
      const Item = this.ASSOC_LIST.find(i => i[type] === e)
      const row = {
        identifier: Item.value, name: Item.label
      }
      this.$set(this.form.associations, index, row)
    },

    hnadleAdd() {
      this.form.associations.push(deepClone(this.row))
      this.$emit('input', this.form)
    },

    async handleDel(index, id) {
      this.form.associations.splice(index, 1)
      this.$emit('input', this.form)
    },

    async validateForm() {
      return await this.$refs.Form.validate()
    }
  }
}
</script>
