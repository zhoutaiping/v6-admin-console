<style lang="postcss" scoped>
.group-batch-edit {
  .group-batch-edit-dialog {
    .group-batch-dialog-form {
      padding: 5px;
      .group-batch-dialog-item {
        display: inline-block;
        margin-bottom: 5px;
      }
      .group-batch-dialog-input {
        width: 300px;
      }
    }
    .ipTag {
      width: 93%;
      margin: 5px 0 5px;
      min-height: 45px;
      max-height: 300px;
      background: #ecf5ff;
      border: 1px solid #b3d8ff;
    }
  }
}
/deep/ .el-card__header {
  padding: 5px 10px !important;
}
</style>
<template>
  <div class="group-batch-edit">
    <FDialog
      :visible.sync="open"
      :close-on-click-modal="true"
      :close-on-press-escape="true"
      title="分组"
      width="600px"
      class="group-batch-edit-dialog"
      @close="handleClose"
    >
      <DmScroll>
        <el-form
          v-loading="loading"
          ref="groupForm"
          :model="groupForm"
          :rules="rules"
          label-position="top"
          label-width="120px"
          class="group-batch-dialog-form"
        >
          <el-form-item
            label=""
            label-width="0px"
          >
            <el-card
              :body-style="{ padding: '5px' }"
              class="box-card"
              shadow="never"
            >
              <div
                slot="header"
                class="clearfix"
              >
                <span>已选 {{ P_TAG.length }} 个</span>
                <div
                  v-if="panel_type === 'group-batch'"
                  style="display: inline-block;float:right"
                >
                  <el-button
                    v-show="!is_edit"
                    type="primary"
                    plain
                    style="float:right;"
                    @click="is_edit=true"
                  >修改</el-button>
                  <el-button
                    v-show="is_edit"
                    type="primary"
                    style="float:right;margin-left:5px;"
                    @click="is_edit=false"
                  >确定</el-button>
                  <el-button
                    v-show="is_edit"
                    type="primary"
                    plain
                    style="float:right;"
                    @click="is_edit=false"
                  >取消</el-button>
                  <el-input
                    v-show="is_edit"
                    v-model="groupForm.add_tag"
                    placeholder="请输入IP/IP段"
                    style="float:right;width:160px;"
                  />
                  <el-select
                    v-show="is_edit"
                    v-model="groupForm.type"
                    placeholder=""
                    style="float:right;width:130px"
                  >
                    <el-option
                      v-for="(item, index) in TYPE"
                      :key="index"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </div>
                <div v-else />
              </div>
              <el-tag
                v-for="(tag, index) in P_TAG"
                :key="index"
                :closable="is_edit"
                style="margin: 2px;"
                @close="handleCloseTag(tag)"
              >
                {{ tag }}
              </el-tag>
            </el-card>
          </el-form-item>
          <el-form-item label="分组标识">
            <el-form-item
              label=""
              class="group-batch-dialog-item"
              prop="tag"
            >
              <el-select
                v-model="groupForm.tag"
                clearable
                placeholder="分组标识"
              >
                <el-option
                  v-for="(tag, index) in GROUP"
                  :key="index"
                  :label="tag.name"
                  :value="tag.id"
                />
              </el-select>
            </el-form-item>
            <div
              v-if="groupForm.tag"
              class="ipTag"
            >
              <el-tag style="margin: 2px;">
                {{ formartTag(groupForm.tag) }}
              </el-tag>
            </div>
          </el-form-item>
          <el-form-item
            label="备注"
            prop="remark"
          >
            <el-input
              v-model="groupForm.remark"
              type="textarea"
              placeholder="请输入备注"
            />
          </el-form-item>
        </el-form>
      </DmScroll>
      <div slot="footer">
        <el-button
          type="info"
          @click="handleClose"
        >取消</el-button>
        <el-button
          type="primary"
          @click="handleSubmint"
        >确定</el-button>
      </div>
    </FDialog>
  </div>
</template>
<script>
import mixins from '@/mixins/tag-batch-group'
export default {
  mixins: [mixins]
}
</script>
