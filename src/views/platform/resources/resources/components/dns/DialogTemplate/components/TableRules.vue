<style lang="scss" scoped>
.input-box {
  width: 170px;
}
</style>
<template>
  <DmTable
    class="TableRules"
    add-button
    border
    @click-add-button="handleRowAdd"
  >
    <el-table :data="list">
      <el-table-column
        label="匹配类型"
        min-width="160"
      >
        <template slot-scope="scope">
          <ColumnForm
            :model="scope.row"
            prop="rule_type"
          >
            <yd-form-select
              :disabled="scope.$index !== list.length - 1"
              v-model="scope.row.rule_type"
              :selects="wafTypeSelect"
              @change="val => handleTypeChange(val, scope)"
            />
          </ColumnForm>
        </template>
      </el-table-column>
      <el-table-column
        label="逻辑 | 匹配目标"
        min-width="420"
      >
        <template slot-scope="scope">
          <!-- 选择逻辑 -->
          <DmSelect
            v-if="scope.row.form"
            v-model="scope.row.logic"
            :selects="scope.row.selectLogic"
            style="width: 140px; margin-right: 10px; display: inline-block;"
          />
          <!-- 匹配目标 -->
          <ColumnForm
            v-if="scope.row.form"
            :model="scope.row"
            prop="data"
            style="max-width: 320px; min-width:200px; display: inline-block;"
          >
            <span
              v-for="(item, index) in scope.row.form"
              :key="index"
            >
              <template v-if="scope.row.rule_type === 'ip_usable'">
                <yd-form-select
                  :selects="item.selects"
                  v-model="scope.row.data[item.key]"
                  filterable
                  allow-create
                  style="display: inline-block; margin-right: 10px; width: 120px"
                />
                <span>%</span>
              </template>
              <template v-else-if="scope.row.rule_type === 'ip_region'">
                <a-cascader
                  v-model="scope.row.data[item.key]"
                  :options="regionOptions"
                  placeholder="请选择"
                  change-on-select
                  style="display: inline-block; margin-right: 10px; width: 130px"
                />
              </template>
              <template v-else>
                <template v-if="item.type === 'select'">
                  <yd-form-select
                    :selects="item.selects"
                    v-model="scope.row.data[item.key]"
                    :allow-create="scope.row.allowCreate"
                    filterable
                    style="display: inline-block; margin-right: 5px; width: 120px"
                  />
                  <span v-if="['ddos_attack_size', 'clean_size'].includes(scope.row.rule_type)">G</span>
                  <span v-if="item.key === 'per'">%</span>
                  <span v-if="item.key === 'day'">天</span>
                  <span v-if="item.key === 'freq'">次</span>
                </template>
                <template v-else-if="item.type === 'number'">
                  <el-input-number
                    :min="0"
                    v-model="scope.row.data[item.key]"
                  />
                </template>
              </template>
            </span>
          </ColumnForm>
        </template>
      </el-table-column>
      <el-table-column
        align="right"
        label="操作"
        width="80px"
      >
        <template slot-scope="scope">
          <el-button
            type="text"
            @click="handleRowDelete(scope.$index)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </DmTable>
</template>

<script>
import consoleTable from '@/mixins/consoleTable'
import ColumnForm from '@/components/Column/ColumnForm'
import InputArea from '@/components/Input/InputArea'
import InputSuffix from '@/components/Input/InputSuffix'
import InputRuleLimit from '@/components/Input/InputRuleLimit'
import InputWeekTime from '@/components/Input/InputWeekTime'
import InputMultiple from '@/components/Input/InputMultiple'
import { deepClone } from '@/utils'
import InputRulesCommonData from './InputRulesCommonData'

export default {
  components: { ColumnForm, InputArea, InputRuleLimit, InputSuffix, InputWeekTime, InputMultiple, InputRulesCommonData },

  mixins: [consoleTable],

  props: {
    ruleOptions: Array,
    regionOptions: {
      type: Array, default: () => []
    },
    filterRule: {
      type: Array, default: () => []
    }
  },

  data() {
    return {
      rowKey: [],
      row: {
        rule_type: '',
        logic: '',
        data: ''
      }
    }
  },

  computed: {
    wafTypeSelect() {
      const rules = this.ruleOptions
      const selected = this.list.map(_ => _.rule_type)
      rules.forEach(_ => {
        _.disabled = selected.includes(_.value) || this.filterRule.includes(_.value)
      })
      return rules
    }
  },

  mounted() {
    this.init()
  },

  methods: {
    init() {
      this.list = []
    },

    setItemOptions(item) {
      const { rule_type } = item
      const ruleConfig = this.ruleOptions.find(_ => _.value === rule_type)

      item.selectLogic = ruleConfig.logic
      item.form = ruleConfig.form
      item.allowCreate = ruleConfig.allowCreate
      item.formDefault = deepClone(ruleConfig.formDefault)
    },

    handleTypeChange(rule_type, scope) {
      const { row, $index } = scope
      row.rule_type = rule_type
      this.setItemOptions(row)

      row.logic = row.selectLogic[0].value
      row.data = deepClone(row.formDefault)
      this.$nextTick(() => {
        this.handleRowClearValidate($index)
      })
    },

    async setList(list) {
      list.forEach(item => {
        this.setItemOptions(item)
      })
      this.list = list
    },

    async getList() {
      return this.list
    }
  }
}
</script>
