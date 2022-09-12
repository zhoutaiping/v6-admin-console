<template>
  <DmDialog
    ref="Dialog"
    :fetch-submit="handleSubmit"
    :mode="mode"
    title-label="用户组映射"
    width="750px"
    aside
  >
    <div>
      <DmAlert>
        1、优先级越小越优先，当优先级高的资源全部不可用会使用优先级低的资源 <br>
        2、权重越大响应比例越高 <br>
        3、同一解析请求来源仅允许有一条策略
      </DmAlert>
      <el-form
        ref="Form"
        :model="form"
        :rules="rules"
        label-position="left"
        label-width="120px"
      >
        <el-form-item
          label="策略名称"
          prop="name"
        >
          <el-input
            v-model="form.name"
            class="input-box"
          />
        </el-form-item>
        <el-form-item label="资源" />
        <DmTable
          add-button
          border
          @click-add-button="handleRowAdd"
        >
          <el-table :data="list">
            <el-table-column
              label="优先级"
              width="150"
            >
              <template slot-scope="{row}">
                <ColumnForm
                  :model="row"
                  :rules="rules"
                  prop="level"
                >
                  <el-input-number
                    v-model="row.level"
                    :controls="false"
                    :min="1"
                    :precision="0"
                    placeholder="优先级1~30"
                  />
                </ColumnForm>
              </template>
            </el-table-column>
            <el-table-column label="IP/CNAME">
              <template slot-scope="{row}">
                <ColumnForm
                  :model="row"
                  :rules="rules"
                  prop="ip"
                >
                  <!-- <el-input v-model="row.ip" placeholder="IP/CNAME"/> -->
                  <DmSelect
                    v-model="row.ip"
                    :selects="options.policy_ip"
                    :filterable="true"
                    placeholder=" "
                  />

                </ColumnForm>
              </template>
            </el-table-column>
            <el-table-column
              align="right"
              label="操作"
              width="150"
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
        <el-form-item label="请求来源" />
        <DmAlert>
          已选择：
          <el-tag
            v-for="(i, index) in findText(form.line_keys)"
            :key="index + '@-key'"
            style="margin:2px;"
            closable
            @close="handleClose(form.line_keys[index])"
          >
            {{ i }}
          </el-tag>
        </DmAlert>
        <div class="region">
          <el-card
            :aria-busy="{'padding':'0'}"
            shadow="never"
            class="region-box"
            style="margin-left: 0px;"
          >
            <div
              slot="header"
              class="clearfix"
            >
              <el-checkbox
                v-model="line_keys.check_one"
                :true-label="1"
                @change="e =>{
                  checkLine(e, 'line_one')
                }"
              >全选</el-checkbox>
            </div>
            <el-checkbox-group
              v-model="line_keys.line_one"
              @change="e => {
                line_keys.check_one = line_keys.line_one.length < options.region.length ? 0 : 1
              }"
            >
              <div
                v-for="(line, _index) in options.region"
                :key="line.key"
              >
                <el-checkbox :label="line.key">
                  <el-button
                    type="text"
                    @click="e =>{
                      options.region_tow = options.region[_index].childs || []
                      if(options.region_tow.length) {
                        line_keys.check_tow = 0
                      }
                      options.region_three = []
                      options.region_four = []
                    }"
                  >
                    {{ line.region_name }}
                    <i
                      v-if="options.region[_index].childs.length"
                      class="el-icon-arrow-right"
                    />
                  </el-button>
                </el-checkbox>
              </div>
            </el-checkbox-group>
          </el-card>

          <el-card
            :aria-busy="{'padding':'0'}"
            shadow="never"
            class="region-box"
            style="margin-left: 0px;"
          >
            <div
              slot="header"
              class="clearfix"
            >
              <el-checkbox
                v-model="line_keys.check_tow"
                :true-label="1"
                @change="e =>{
                  checkLine(e, 'line_tow')
                }"
              >全选</el-checkbox>
            </div>
            <el-checkbox-group
              v-model="line_keys.line_tow"
              @change="e => {
                line_keys.check_tow = line_keys.line_one.length < options.region.length ? 0 : 1
              }"
            >
              <div
                v-for="(line, _index) in options.region_tow"
                :key="line.key"
              >
                <el-checkbox :label="line.key">
                  <el-button
                    type="text"
                    @click="e =>{
                      options.region_three = options.region_tow[_index].childs || []
                      options.region_four = []
                    }"
                  >
                    {{ line.region_name }}
                    <i
                      v-if="options.region_tow[_index].childs.length"
                      class="el-icon-arrow-right"
                    />
                  </el-button>
                </el-checkbox>
              </div>
            </el-checkbox-group>
          </el-card>

          <el-card
            :aria-busy="{'padding':'0'}"
            shadow="never"
            class="region-box"
            style="margin-left: 0px;"
          >
            <div
              slot="header"
              class="clearfix"
            >
              <el-checkbox
                v-model="line_keys.check_three"
                :true-label="1"
                @change="e =>{
                  checkLine(e, 'line_three')
                }"
              >全选</el-checkbox>
            </div>
            <el-checkbox-group
              v-model="line_keys.line_three"
              @change="e => {
                line_keys.check_three = line_keys.line_one.length < options.region.length ? 0 : 1
              }"
            >
              <div
                v-for="(line, _index) in options.region_three"
                :key="line.key"
              >
                <el-checkbox :label="line.key">
                  <el-button
                    type="text"
                    @click="e =>{
                      options.region_four = options.region_three[_index].childs || []
                    }"
                  >
                    {{ line.region_name }}
                    <i
                      v-if="options.region_three[_index].childs.length"
                      class="el-icon-arrow-right"
                    />
                  </el-button>
                </el-checkbox>
              </div>
            </el-checkbox-group>
          </el-card>

          <el-card
            :aria-busy="{'padding':'0'}"
            shadow="never"
            class="region-box"
            style="margin-left: 0px;"
          >
            <div
              slot="header"
              class="clearfix"
            >
              <el-checkbox
                v-model="line_keys.check_four"
                :true-label="1"
                @change="e =>{
                  checkLine(e, 'line_four')
                }"
              >全选</el-checkbox>
            </div>
            <el-checkbox-group
              v-model="line_keys.line_four"
              @change="e => {
                line_keys.check_four = line_keys.line_one.length < options.region.length ? 0 : 1
              }"
            >
              <div
                v-for="(line, _index) in options.region_four"
                :key="line.key"
              >
                <el-checkbox :label="line.key">
                  <el-button type="text"> {{ line.region_name }} </el-button>
                </el-checkbox>
              </div>
            </el-checkbox-group>
          </el-card>
        </div>
      </el-form>
    </div>
  </DmDialog>
</template>
<script>
import { mapState } from 'vuex'
import consoleTable from '@/mixins/consoleTable'
import ColumnForm from '@/components/Column/ColumnForm'
export default {
  components: { ColumnForm },
  mixins: [consoleTable],
  data() {
    return {
      open: false,
      mode: 'Create',
      formDefault: {
        disp_group_id: '',
        name: '',
        level_ip: [],
        line_keys: []
      },
      form: {

      },
      rules: {
        name: [{ required: true, message: ' ' }],
        level_ip: [{ required: true, message: ' ' }],
        line_keys: [{ required: true, message: ' ' }],
        ip: [{ required: true, message: ' ' }],
        level: [{ required: true, message: ' ' }]
      },
      list: [],
      rowKey: [],
      row: {
        ip: '',
        level: 1
      },

      lineDefault: {
        line_one: [],
        check_one: false,
        line_tow: [],
        check_tow: false,
        line_three: [],
        check_three: false,
        line_four: [],
        check_four: false
      },
      line_keys: {},

      options: {
        region: [],
        region_tow: [],
        region_three: [],
        region_four: [],
        policy_ip: []
      }
    }
  },
  computed: {
    ...mapState({
      region_tree: state => state.disp.region_tree,
      policy_ip: state => state.disp.policy_ip
    })
  },
  watch: {
    region_tree: {
      deep: true,
      handler(val) {
        this.options.region = this.region_tree
      }
    },
    policy_ip: {
      deep: true,
      handler(val) {
        this.options.policy_ip = this.policy_ip.map(i => { return { label: i, value: i } })
      }
    },
    line_keys: {
      deep: true,
      handler(val) {
        let list = ['line_one', 'line_tow', 'line_three', 'line_four'].map(i => { return this.line_keys[i] })
        list = list.join().split(',')
        list = [... new Set(list)]
        this.form.line_keys = list.filter(n => n !== '')
      }
    },

    list: {
      deep: true,
      handler(val) {
        const policy_ip = this.options.policy_ip
        policy_ip.forEach(i => {
          i.disabled = this.list.findIndex(f => f.ip === i.value) > -1
        })

        this.options.policy_ip = policy_ip
      }
    }
  },
  created() {
    this.options.region = this.region_tree
    this.options.policy_ip = this.policy_ip.map(i => { return { label: i, value: i } })
  },
  methods: {
    handleOpen(data, option) {
      this.form = { ...this.formDefault }
      this.line_keys = {
        line_one: [],
        check_one: false,
        line_tow: [],
        check_tow: false,
        line_three: [],
        check_three: false,
        line_four: [],
        check_four: false
      }
      this.mode = option
      this.list = []
      this.$store.dispatch('featchPolicyIp', { disp_group_id: this.$route.params.id, page: 1, pagesize: 9999 })
      this.$nextTick(() => {
        this.$refs.Dialog.handleOpen()
        if (this.$refs.Form) {
          this.$refs.Form.resetFields()
        }
        this.form.disp_group_id = this.$route.params.id
        if (option === 'Edit') {
          this.form = {
            id: data.id,
            name: data.name,
            disp_group_id: this.$route.params.id,
            policy_bn: data.policy_bn,
            level_ip: data.records.map(i => {
              return {
                ip: i.ip,
                level: i.level || 0
              }
            }),
            line_keys: data.line_groups
          }
          this.list = this.form.level_ip
          data.line_groups.forEach(e => {
            const key_level = RegionName(this.options.region, e, 'key_level')
            if (key_level === 1) {
              this.line_keys.line_one.push(e)
            } else if (key_level === 2) {
              this.line_keys.line_tow.push(e)
            } else if (key_level === 3) {
              this.line_keys.line_three.push(e)
            } else if (key_level === 4) {
              this.line_keys.line_four.push(e)
            }
          })
        }
      })
    },

    checkLine(value, type) {
      let val = []
      if (type === 'line_one' && value === 1) {
        val = this.options.region.map(i => i.key)
      } else if (type === 'line_tow' && value === 1) {
        val = this.line_keys[type].concat(this.options.region_tow.map(i => i.key))
      } else if (type === 'line_three' && value === 1) {
        val = this.line_keys[type].concat(this.options.region_three.map(i => i.key))
      } else if (type === 'line_four' && value === 1) {
        val = this.line_keys[type].concat(this.options.region_four.map(i => i.key))
      }
      this.line_keys[type] = [...new Set(val)]
    },
    findText(list = []) {
      const value = []
      const region = this.options.region
      list.forEach(i => {
        value.push(RegionName(region, i, 'region_name'))
      })
      return value
    },
    handleClose(value) {
      const list = ['line_one', 'line_tow', 'line_three', 'line_four']
      list.forEach(i => {
        const Item = JSON.parse(JSON.stringify(this.line_keys[i]))
        const find_index = Item.indexOf(value)
        if (find_index > -1) {
          this.line_keys[i] = Item.filter(v => v !== value)
        }
      })
    },
    handleSubmit() {
      if (this.list.length === 0) {
        this.message.warning('请新增资源!')
        this.$refs.Dialog.afterValidate()
        return
      }

      if (this.list.filter(i => i.ip === '').length > 0) {
        this.message.warning('资源IP/CNAME不能为空!')
        this.$refs.Dialog.afterValidate()
        return
      }

      if (this.form.line_keys.length === 0) {
        this.message.warning('请选择请求来源!')
        this.$refs.Dialog.afterValidate()
        return
      }

      this.$refs.Form.validate(async(valid) => {
        if (valid) {
          const params = {
            ... this.form,
            level_ip: this.list

          }
          if (this.mode === 'Create') {
            params.type = 5
          } else if (this.mode === 'Edit') {
            params.type = 6
          }
          try {
            await this.FetchDisp.post('/disp/policy/operate', params)
            this.Message('ACTION_SUCCESS')
            this.$refs.Dialog.afterValidate()
            this.$refs.Dialog.handleClose()
            this.$emit('init')
          } catch (error) {
            this.$refs.Dialog.afterValidate()
            return
          }
        } else {
          this.$refs.Dialog.afterValidate()
          return false
        }
      })
    }
  }
}

function RegionName(list = [], value = '', type = '') {
  let text = ''
  for (let i = 0; i < list.length; i++) {
    if (list[i] && list[i].key === value) {
      text = list[i][type]
      break
    } else {
      if (list[i].childs && list[i].childs.length) {
        text = RegionName(list[i].childs, value, type)
        if (text) {
          break
        }
      }
    }
  }
  return text
}
</script>

<style lang="scss" scoped>
.input-box {
  width: 300px;
}
/deep/.el-input__inner {
  text-align: left;
}
.region {
  display: flex;
  &-box {
    width: 200px;
    margin: 0 2px;
    /deep/.el-card__header {
      padding: 5px;
    }
    /deep/.el-card__body {
      padding: 5px;
      height: 400px;
      overflow: auto;
      &::-webkit-scrollbar {
        width: 5px;
        height: 10px;
      }
      &::-webkit-scrollbar-track {
        background: rgb(239, 239, 239);
        border-radius: 2px;
      }
      &::-webkit-scrollbar-thumb {
        background: #bfbfbf;
        border-radius: 10px;
      }
      &::-webkit-scrollbar-thumb:hover {
        background: #333;
      }
      &::-webkit-scrollbar-corner {
        background: #179a16;
      }
    }
  }
}
</style>
