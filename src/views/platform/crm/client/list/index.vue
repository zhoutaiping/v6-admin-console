<template>
  <console-page-layout>
    <div slot="filter">
      <DmToolbar>
        <div slot="right">
          <InputSearch
            v-model="bindParams.email"
            placeholder="请输入邮箱"
            @submit="$refs.DmData.initPage()"
          />
        </div>
      </DmToolbar>
    </div>
    <DmData
      ref="DmData"
      @init="fetchList"
    >
      <DmTable
        :loading="loading"
        min-height
      >
        <el-table
          :data="list"
          @select="handleRowSelect"
          @select-all="handleRowSelect"
        >
          <el-table-column
            label="用户ID"
            prop="id"
            min-width="200"
          />
          <el-table-column
            label="注册邮箱"
            prop="email"
            min-width="200"
          />
          <el-table-column
            label="用户名称"
            prop="username"
            min-width="200"
          />
          <el-table-column
            label="昵称"
            prop="nickname"
            min-width="200"
          />
          <el-table-column
            label="申请时间"
            prop="create_at"
            min-width="200"
          />
          <el-table-column
            label="最后一次登录"
            prop="last_login"
            min-width="200"
          />
          <el-table-column
            label="推广来源"
            prop="seo_origin"
            min-width="200"
          >
            <template slot-scope="{row}">
              <PopoverEllipsis
                v-model="row.seo_origin"
                :url="false"
                :max-length="50"
              />
            </template>
          </el-table-column>
          <el-table-column
            label="推广计划"
            prop="seo_plan"
            min-width="200"
          >
            <template slot-scope="{row}">
              <PopoverEllipsis
                v-model="row.seo_plan"
                :url="false"
                :max-length="50"
              />
            </template>
          </el-table-column>
          <el-table-column
            label="推广单元"
            prop="seo_group"
            min-width="200"
          >
            <template slot-scope="{row}">
              <PopoverEllipsis
                v-model="row.seo_group"
                :url="false"
                :max-length="50"
              />
            </template>
          </el-table-column>
          <el-table-column
            label="推广关键词"
            prop="seo_keyword"
            min-width="200"
          >
            <template slot-scope="{row}">
              <PopoverEllipsis
                v-model="row.seo_keyword"
                :url="false"
                :max-length="50"
              />
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            align="right"
            min-width="150"
            fixed="right"
          >
            <template slot-scope="scope">
              <el-button
                type="text"
                @click="$refs.SingClient.handleOpen(scope.row)"
              >编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
      </DmTable>
    </DmData>
    <SingClient
      ref="SingClient"
      @init="fetchList"
    />
  </console-page-layout>
</template>

<script>
import consoleData from '@/mixins/consoleData'
import SingClient from './sing-client'
import PopoverEllipsis from '@/components/Popover/PopoverEllipsis'
export default {
  components: { SingClient, PopoverEllipsis },
  mixins: [consoleData],
  data() {
    return {
      API_INDEX: '/V4/member.list',
      bindParams: {
        email: ''
      },
      selectionId: []
    }
  },

  methods: {
    formatResponse(response) {
      return response
    },

    handleRowSelect(selection) {
      this.selectionId = selection.map(_ => _.id)
    }
  }
}
</script>
