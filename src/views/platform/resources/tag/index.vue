<style lang="scss" scoped>
.app-center-devops-tag-index {
  padding: 5px 10px 0;
  .op-btn {
    margin: 0px 2px;
  }
  .search-from {
    margin: 5px;
    .search-from-item {
      margin-bottom: 5px;
    }
  }
  .search-from-input {
    width: 200px;
    margin: 0px 2px;
  }
}
</style>

<template>
  <div class="app-center-devops-tag-index">
    <template v-if="active === 'tag'">
      <DmToolbar>
        <el-radio-group v-model="is_expand" size="mini" >
          <el-radio-button label="1">展开</el-radio-button>
          <el-radio-button label="2">折叠</el-radio-button>
        </el-radio-group>
        <div slot="right">
          <el-select
            v-model="search.type_ukey"
            placeholder="请选择"
            clearable
            class="search-from-input"
            @change="initTagTree"
          >
            <el-option
              v-for="(item, index) in TYPE"
              :key="index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
      </DmToolbar>

      <TagTree
        v-loading="loading"
        ref="tagTree"
        :data="TagTree"
        :is_expand="is_expand"
        @handleDel="handleDel"
        @handleAddTag="handleAddTag"
        @handleEdit="handleEdit"
        @handleAddNextTag="handleAddNextTag"
      />
    </template>
    <TagType
      v-loading="loading_2"
      v-show="active === 'tag_type'"
      :data="TYPE_UKEY"
      @init="initType"
      @link="link"
      @handleAdd="handleAdd"
      @handleInfo="handleInfo"
    />
    <typeLink
      ref="typeLink"
      @init="initType"
    />
    <Bind
      v-show="active ==='band_tag'"
      ref="bandTag"
      :tag_type="tag_type"
      :link-tag="linkTag"
    />
    <DialogInfo
      ref="dialogInfo"
      @initType="initType"
      @handleLoad="initTagTree"
    />
    <DialogAddType
      ref="dialogAddType"
      @initType="initType"
      @handleLoad="initTagTree"
    />
    <DialogEdit
      ref="dialogEdit"
      @initType="initType"
      @handleLoad="initTagTree"
    />
    <DialogAddTage
      ref="dialogAddTage"
      @initType="initType"
      @handleLoad="initTagTree"
    />
    <DialogAddNextTag
      ref="dialogAddNextTag"
      @initType="initType"
      @handleLoad="initTagTree"
    />
  </div>
</template>

<script>
import DmHeader from '@/components/DmHeader'

import * as Form from './form'
import DialogInfo from './components/DialogInfo'
import DialogAddType from './components/DialogAddType'
import DialogEdit from './components/DialogEdit'
import DialogAddTage from './components/DialogAddTag'
import DialogAddNextTag from './components/DialogAddNextTag'
import TagTree from './tagTree'
import TagType from './list'
import Bind from './band'
import indexmixins from './mixins/index'
import typeLink from './components/type-link'
export default {
  components: { Bind, DmHeader, typeLink, TagTree, DialogInfo, DialogAddType, TagType, DialogEdit, DialogAddTage, DialogAddNextTag },
  mixins: [indexmixins],
  data() {
    return {
      search: Form.search,
      active: 'tag',
      TYPE: [{ label: '请选择标签类型', value: '' }],
      tag_type: [],
      TYPE_UKEY: [],
      params: {},
      list: [],
      loading: false,
      loading_2: false,
      tablekey: 1,
      is_expand: '1',
      TagTree: [],
      tabPanels: {
        type: 'new',
        items: [
          {
            key: 'tag',
            title: '标签列表'
          },
          {
            key: 'tag_type',
            title: '类型列表'
          },
          {
            key: 'band_tag',
            title: '行业标签'
          }
        ],
        activeModel: 'tag',
        callback: (key) => {
          this.active = key
          this.changeTab()
        }
      }
    }
  },
  async created() {
    await this.changeTab()
  },
  methods: {
    async changeTab() {
      if (this.active === 'tag') await Promise.all([this.initTagTree(), this.initType()])
      if (this.active === 'tag_type') await this.initType()
      if (this.active === 'band_tag') await this.$refs.bandTag.init()
    },
    getTypeUkeyText(value) {
      const text = this.TYPE_UKEY.filter(i => i.ukey === value)[0] && this.TYPE_UKEY.filter(i => i.ukey === value)[0].name || '--'
      return text
    },
    handleInfo(data) {
      const ukey_id = data.id || ''
      if (!ukey_id) return
      this.openWin(null, ukey_id, 'dialogAddType')
    },
    link(data) {
      this.$refs.typeLink.openWin(JSON.parse(JSON.stringify(data)), this.linkTag)
    },
    handleAdd() {
      this.openWin(null, null, 'dialogAddType')
    },
    handleEdit(type, data) {
      this.openWin(JSON.parse(JSON.stringify(data)), type, 'dialogEdit')
    },
    handleAddTag(type, data) {
      this.openWin(JSON.parse(JSON.stringify(data)), type, 'dialogAddTage')
    },
    handleAddNextTag(type, data) {
      this.openWin(JSON.parse(JSON.stringify(data)), type, 'dialogAddNextTag')
    },
    handleDel(type, data) {
      const params = { ids: [data.id] }
      this.$confirm('是否删除标签?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.delte(params)
      }).catch(e => { return true })
    }
  }
}
</script>
