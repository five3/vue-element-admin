<template>
  <div class="app-container">
    <el-card class="box-card card">
      <el-form :inline="true" label-width="80px" :model="form" class="demo-form-inline" style="text-align: left; margin-bottom: -20px;">
        <el-form-item label="用例名称">
          <el-input v-model="form.name" placeholder="请输入用例名称"></el-input>
        </el-form-item>
        <el-form-item label="请求方法">
          <el-select v-model="form.method">
            <el-option
              v-for="item in methodList"
              :key="item"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="请求URL">
          <el-input v-model="form.url" placeholder="请输入请求URL"></el-input>
        </el-form-item>
        <el-form-item label="创建日期">
          <el-date-picker
            v-model="date"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit" size="small">查询</el-button>
          <el-button type="primary" @click="runSelected" size="small">运行所选</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card>
      <el-table
      ref="multipleTable"
      v-loading="loading"
      :data="tableData"
      min-height="300"
      border
      style="width: 100%"
      @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          width="50">
        </el-table-column>
        <el-table-column
          prop="name"
          label="用例名称"
          width="130">
        </el-table-column>
        <el-table-column
          prop="url"
          label="请求URL">
        </el-table-column>
        <el-table-column
          prop="method"
          label="请求方法"
          width="80">
        </el-table-column>
        <el-table-column
          prop="status"
          label="上次执行状态"
          width="120">
          <template slot-scope="scope">
            <div slot="reference" class="name-wrapper">
              <el-tag size="medium" :type="scope.row.statusFlag">{{ scope.row.statusText }}</el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="created_time"
          label="创建时间"
          width="160">
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="130">
          <template slot-scope="scope">
            <el-button @click="onView(scope.row)" type="text" size="small">编辑</el-button>
            <el-button @click="onRun(scope.row)" type="text" size="small">运行</el-button>
            <el-button @click="onLog(scope.row)" type="text" size="small">日志</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        :page-size="this.page.pageSize"
        layout="prev, pager, next"
        @current-change="handleCurrentChange"
        :total="this.page.total">
      </el-pagination>
    </el-card>
    <el-drawer
      title="我是标题"
      :visible.sync="show.log"
      :with-header="false">
      <el-input
        disabled
        type="textarea"
        autosize
        placeholder="请输入内容"
        v-model="log">
      </el-input>
    </el-drawer>
  </div>
</template>

<script>
import { getList, runAPI, viewLog } from '@/api/httpapi'
export default {
  data () {
    return {
      filename: __filename,
      tableData: [],
      date: [],
      form: {
        name: null,
        url: null,
        method: null
      },
      page: {
        pageSize: 10,
        pageNum: 1,
        total: 0
      },
      methodList: ['GET', 'POST', 'PUT', 'DELETE', 'HEAD', 'OPTIONS'],
      multipleSelection: [],
      log: '',
      show: {
        log: false
      },
      loading: false
    }
  },
  mounted () {
    this.fetchData()
  },
  methods: {
    onSubmit () {
      this.page.pageNum = 1
      this.fetchData()
    },
    handleCurrentChange (val) {
      this.page.pageNum = val
      this.fetchData()
    },
    fetchData () {
      if (this.date && this.date.length > 0) {
        this.form.date1 = this.date[0]
        this.form.date2 = this.date[1]
      }
      getList({
        ...this.form,
        ...this.page
      }).then(res => {
        this.tableData = res.list
        for (let i = 0; i < res.list.length; i++) {
          this.warpStatus(res.list[i])
        }
        this.page = res.page
      }).catch(err => {
        console.log(err)
      })
    },
    warpStatus (row) {
      if (row.status === 0) {
        row.statusText = '未执行'
        row.statusFlag = 'primary'
      } else if (row.status === 1) {
        row.statusText = '成功'
        row.statusFlag = 'success'
      } else if (row.status === 2) {
        row.statusText = '失败'
        row.statusFlag = 'danger'
      } else if (row.status === 3) {
        row.statusText = '异常'
        row.statusFlag = 'danger'
      }
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    onView (row) {
      this.$router.push({ name: 'http-api', query: { id: row.id } })
    },
    onRun (row) {
      this.loading = true
      runAPI(row.id).then(res => {
        row.status = res.result
        row.method = row.method + ' ' // 用于触发状态内容及时渲染
        this.warpStatus(row)
        this.$message.success('成功运行用例')
        this.loading = false
      }).catch(err => {
        console.log(err)
        this.loading = false
      })
    },
    onLog (row) {
      viewLog(row.id).then(res => {
        this.log = ''
        let c = JSON.parse(res)
        for (let i in c) {
          this.log += c[i] + '\r\n'
        }
        this.show.log = true
      }).catch(err => {
        console.log(err)
      })
    },
    runSelected () {
      let len = this.multipleSelection.length
      this.loading = true
      for (let i = 0; i < len; i++) {
        runAPI(this.multipleSelection[i].id).then(res => {
          this.multipleSelection[i].status = res.result
          this.multipleSelection[i].method = this.multipleSelection[i].method + ' ' // 用于触发状态内容及时渲染
          this.warpStatus(this.multipleSelection[i])
          this.multipleSelection[i].method = this.multipleSelection[i].method.trim()
          if (i + 1 === len) {
            this.loading = false
          }
        }).catch(err => {
          console.log(err)
          if (i + 1 === len) {
            this.loading = false
          }
        })
      }
    }
  }
}
</script>