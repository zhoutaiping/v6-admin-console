<style lang="scss" scoped>
.input-box {
  width: 300px;
}
.item-box {
  margin-bottom: 5px;
}
.region {
  display: flex;
  &-box{
    width: 200px;
    margin: 0 2px;
    /deep/.el-card__header {
      padding: 5px;
    }
    /deep/.el-card__body {
      padding: 5px;
      height: 400px;
      overflow: auto;
      &::-webkit-scrollbar{
        width:5px;
        height:10px;
      }
      &::-webkit-scrollbar-track{
        background: rgb(239, 239, 239);
        border-radius:2px;
      }
      &::-webkit-scrollbar-thumb{
        background: #bfbfbf;
        border-radius:10px;
      }
      &::-webkit-scrollbar-thumb:hover{
        background: #333;
      }
      &::-webkit-scrollbar-corner{
        background: #179a16;
      }
    }
  }
}
</style>
<template>
  <DmDialog
    ref="Dialog"
    :fetch-submit="handleSubmit"
    :mode="mode"
    title-label="用户组映射"
    width="820px"
  >
    <div>
      <DmAlert>
        请求来源：当访问策略选择默认用户组映射时，将按照配置的请求来源对该IP生成访问策略；若未配置则资源获取后默认只生成全局“默认”访问策略中
      </DmAlert>
      <el-form
        ref="Form"
        :model="form"
        :rules="rules"
        label-width="120px"
        label-position="left"
      >
        <el-form-item label="组名称" prop="name" class="item-box">
          <el-input v-model="form.name" class="input-box"/>
        </el-form-item>
        <el-form-item label="请求来源" prop="line_keys" class="item-box"/>
        <DmAlert >
          已选择：
          <el-tag v-for="(i, index) in findText(form.line_keys)" :key="index + '@-key'" style="margin:2px;" closable @close="handleClose(form.line_keys[index])">
            {{ i }}
          </el-tag>
        </DmAlert>
        <div class="region">
          <el-card :aria-busy="{'padding':'0'}" shadow="never" class="region-box" style="margin-left: 0px;">
            <div slot="header" class="clearfix">
              <el-checkbox
                v-model="line_keys.check_one"
                :true-label="1"
                @change="e =>{
                  checkLine(e, 'line_one')
              }">全选</el-checkbox>
            </div>
            <el-checkbox-group
              v-model="line_keys.line_one"
              @change="e => {
                line_keys.check_one = line_keys.line_one.length < options.region.length ? 0 : 1
            }">
              <div v-for="(line, _index) in options.region" :key="line.key">
                <el-checkbox :label="line.key" >
                  <el-button
                    type="text"
                    @click="e =>{
                      options.region_tow = options.region[_index].childs || []
                      if(options.region_tow.length) {
                        line_keys.check_tow = 0
                      }
                      options.region_three = []
                      options.region_four = []
                  }"> {{ line.region_name }}
                  <i v-if="options.region[_index].childs.length" class="el-icon-arrow-right"/></el-button>
                </el-checkbox>
              </div>
            </el-checkbox-group>
          </el-card>

          <el-card :aria-busy="{'padding':'0'}" shadow="never" class="region-box" style="margin-left: 0px;">
            <div slot="header" class="clearfix">
              <el-checkbox
                v-model="line_keys.check_tow"
                :true-label="1"
                @change="e =>{
                  checkLine(e, 'line_tow')
              }">全选</el-checkbox>
            </div>
            <el-checkbox-group
              v-model="line_keys.line_tow"
              @change="e => {
                line_keys.check_tow = line_keys.line_one.length < options.region.length ? 0 : 1
            }">
              <div v-for="(line, _index) in options.region_tow" :key="line.key">
                <el-checkbox :label="line.key" >
                  <el-button
                    type="text"
                    @click="e =>{
                      options.region_three = options.region_tow[_index].childs || []
                      options.region_four = []
                  }"> {{ line.region_name }}
                    <i v-if="options.region_tow[_index].childs.length" class="el-icon-arrow-right"/>
                  </el-button>
                </el-checkbox>
              </div>
            </el-checkbox-group>
          </el-card>

          <el-card :aria-busy="{'padding':'0'}" shadow="never" class="region-box" style="margin-left: 0px;">
            <div slot="header" class="clearfix">
              <el-checkbox
                v-model="line_keys.check_three"
                :true-label="1"
                @change="e =>{
                  checkLine(e, 'line_three')
              }">全选</el-checkbox>
            </div>
            <el-checkbox-group
              v-model="line_keys.line_three"
              @change="e => {
                line_keys.check_three = line_keys.line_one.length < options.region.length ? 0 : 1
            }">
              <div v-for="(line, _index) in options.region_three" :key="line.key">
                <el-checkbox :label="line.key" >
                  <el-button
                    type="text"
                    @click="e =>{
                      options.region_four = options.region_three[_index].childs || []
                  }"> {{ line.region_name }}
                    <i v-if="options.region_three[_index].childs.length" class="el-icon-arrow-right"/>
                  </el-button>
                </el-checkbox>
              </div>
            </el-checkbox-group>
          </el-card>

          <el-card :aria-busy="{'padding':'0'}" shadow="never" class="region-box" style="margin-left: 0px;">
            <div slot="header" class="clearfix">
              <el-checkbox
                v-model="line_keys.check_four"
                :true-label="1"
                @change="e =>{
                  checkLine(e, 'line_four')
              }">全选</el-checkbox>
            </div>
            <el-checkbox-group
              v-model="line_keys.line_four"
              @change="e => {
                line_keys.check_four = line_keys.line_one.length < options.region.length ? 0 : 1
            }">
              <div v-for="(line, _index) in options.region_four" :key="line.key">
                <el-checkbox :label="line.key" >
                  <el-button type="text" > {{ line.region_name }} </el-button>
                </el-checkbox>
              </div>
            </el-checkbox-group>
          </el-card>
        </div>
        <el-form-item label="备注" prop="remark" class="item-box" style="margin-top:10px;">
          <el-input v-model="form.remark" :rows="4" type="textarea" />
        </el-form-item>
      </el-form>
    </div>
  </DmDialog>
</template>
<script>
import { mapState } from 'vuex'
export default {
  data() {
    return {
      open: false,
      mode: 'Create',
      formDefault: {
        id: '',
        name: '',
        line_keys: [],
        remark: ''
      },
      form: {},
      rules: {
        id: [],
        name: [{ required: true, message: ' ' }],
        status: [],
        line_keys: [{ required: true, message: ' ' }],
        remark: []
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
      line_keys: { },
      options: {
        region: [],
        region_tow: [],
        region_three: [],
        region_four: []
      }
    }
  },
  computed: {
    ...mapState({
      region_tree: state => state.disp.region_tree
    })
  },
  watch: {
    region_tree: {
      deep: true,
      handler(val) {
        this.options.region = this.region_tree
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
    }
  },
  created() {
    this.options.region = this.region_tree
  },
  methods: {
    handleOpen(data, option) {
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
      this.$nextTick(() => {
        this.$refs.Dialog.handleOpen()
        this.mode = option
        this.form = Object.assign({}, this.formDefault)
        if (this.$refs.Form) {
          this.$refs.Form.resetFields()
        }
        if (option === 'Edit') {
          this.form = {
            id: data.id,
            name: data.name,
            remark: data.remark,
            line_keys: data.line_keys
          }
          data.line_keys.forEach(e => {
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

    findText(list = []) {
      const value = []
      const region = this.options.region
      list.forEach(i => {
        value.push(RegionName(region, i, 'region_name'))
      })
      return value
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

    handleSubmit() {
      if (this.form.line_keys.length === 0) {
        this.message.warning('请选择请求来源')
        this.$refs.Dialog.afterValidate()
        return
      }
      this.$refs.Form.validate(async(valid) => {
        if (valid) {
          try {
            await this.FetchDisp.post('/line_group/save', { ...this.form })
            this.Message('ACTION_SUCCESS')
            this.$emit('init')
            this.$refs.Dialog.handleClose()
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
  let text = null
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
