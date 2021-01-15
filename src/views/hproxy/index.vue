<template>
  <div class="app-container">
    <div>
      <el-row :gutter="20">
        <el-col :span="24" :xs="24">
          <el-card>
            <el-button type="primary" @click="createHook">添加HOOK</el-button>
          </el-card>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24" :xs="24">
          <el-table
            :data="tableData"
            border
            style="width: 100%;">
            <el-table-column
              fixed
              prop="name"
              label="HOOK名称">
            </el-table-column>
            <el-table-column
              prop="type"
              label="HOOK类型"
              width="100">
            </el-table-column>
            <el-table-column
              prop="source"
              label="源IP"
              width="120">
            </el-table-column>
            <el-table-column
              prop="target"
              label="目标域名"
              width="120">
            </el-table-column>
            <el-table-column
              prop="content"
              label="HOOK内容">
            </el-table-column>
            <el-table-column
              prop="created_time"
              label="创建时间"
              width="160">
            </el-table-column>
            <el-table-column
              fixed="right"
              label="操作"
              width="60">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="editHook(scope.row)">编辑</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div style="text-align: right; margin: 5px;">
            <el-pagination
              background
              layout="prev, pager, next"
              :page-size="query.pageSize"
              :total="query.total">
            </el-pagination>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24" :xs="24">
          <el-drawer
            title=""
            :visible.sync="drawer"
            :with-header="false"
            size="50%"
          >
            <div style="padding: 10px;">
              <h3>{{ title }}</h3>
              <el-divider content-position="left"></el-divider>
              <el-form ref="form" :model="form" label-width="80px">
                <el-form-item label="名称">
                  <el-input v-model="form.name" placeholder="请输入HOOK名称" />
                </el-form-item>
                <el-form-item label="类型">
                  <el-select v-model="form.type" placeholder="请选择HOOK类型">
                    <el-option label="请求HOOK" value="REQUEST" />
                    <el-option label="响应HOOK" value="RESPONSE" />
                  </el-select>
                </el-form-item>
                <el-form-item label="源IP">
                  <el-input v-model="form.source" placeholder="请输入需要处理的请求IP" />
                </el-form-item>
                <el-form-item label="目标域名">
                  <el-input v-model="form.target" placeholder="请输入需要处理的目标域名" />
                </el-form-item>
                <el-form-item label="脚本内容">
                  <el-input type="textarea" :autosize="{ minRows: 8, maxRows: 12}" v-model="form.content" placeholder="请输入HOOK脚本内容" />
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="onSubmit">保存</el-button>
                  <el-button @click="drawer = false">取消</el-button>
                </el-form-item>
              </el-form>
            </div>
          </el-drawer>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { submit, pullData } from '@/api/hproxy'
export default {
  name: 'HProxy',
  data() {
    return {
      title: '',
      drawer: false,
      tableData: [],
      form: {
        'name': '',
        'type': '',
        'source': '',
        'target': '',
        'content': ''
      },
      query: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      }
    }
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    createHook() {
      this.title = '添加HOOK'
      this.drawer = true
      this.form = {}
    },
    editHook(row) {
      this.title = '编辑HOOK'
      this.drawer = true
      this.form = row
    },
    onSubmit() {
      submit(this.form).then((response) => {
        if (response.code === 0) {
          this.query.pageNum = 1
          this.fetchData()
          this.$message({
            showClose: true,
            message: '保存成功！',
            type: 'success'
          })
          this.drawer = false
        }
      })
    },
    fetchData() {
      pullData({
      ...this.query
      }).then((response) => {
        if (response.code === 0) {
          this.tableData = response.data.list
          this.page = response.data.page
        }
      })
    }
  }
}
</script>
