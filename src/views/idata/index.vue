/* eslint-disable */
<template>
  <div class="app-container">
    <el-card class="box-card">
      <el-form :inline="true" ref="formData" :rules="rules" :model="formData" label-width="70px">
        <el-form-item label="域名" prop="db_host">
          <el-input v-model="formData.db_host" style="width: 150px;"></el-input>
        </el-form-item>
        <el-form-item label="端口" prop="db_port">
          <el-input v-model="formData.db_port" style="width: 80px;"></el-input>
        </el-form-item>
        <el-form-item label="用户名" prop="db_user">
          <el-input v-model="formData.db_user" style="width: 130px;"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="db_passwd">
          <el-input v-model="formData.db_passwd" type="password" style="width: 130px;"></el-input>
        </el-form-item>
        <el-form-item label="数据库" prop="db_name">
          <el-input v-model="formData.db_name" style="width: 130px;"></el-input>
        </el-form-item>
      </el-form>
      <el-input
        type="textarea"
        :rows="5"
        placeholder="请输入SQL语句"
        v-model="formData.sql">
      </el-input>
      <div style="margin: 10px 10px 0 0; text-align: right;">
        <span style="float: left;">执行耗时：{{time}}s</span>
        <el-button type="primary" @click="onExec('formData')">执行SQL</el-button>
      </div>
    </el-card>
    <el-card class="box-card">
      <el-table
      :data="tableData"
      v-loading="loading"
      style="width: 100%">
        <el-table-column v-for="h in tableHead" :key="h"
          :prop="h" :label="h">
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<script>
import { execDB } from '@/api/idata'
export default {
  name: 'idata',
  data () {
    return {
      rules: {
        db_host: [
          { required: true, message: '请输入域名', trigger: 'blur' }
        ],
        db_port: [
          { required: true, message: '请选输入端口', trigger: 'blur' }
        ],
        db_user: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        db_passwd: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ],
        db_name: [
          { required: true, message: '请输入数据库', trigger: 'blur' }
        ]
      },
      formData: {
        db_charset: 'utf8',
        db_host: null,
        db_port: null,
        db_user: null,
        db_passwd: null,
        db_name: null,
        sql: null,
        param: {},
        key: 'all'
      },
      tableData: [
      ],
      tableHead: [],
      time: 0,
      maxCount: 20,
      loading: false
    }
  },
  methods: {
    onExec (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (!this.formData.sql) {
            this.$message({
              message: 'SQL语句不能为空。',
              type: 'warning'
            })
            return
          }
          this.loading = true
          execDB({
            ...this.formData,
            maxCount: this.MaxCount
          }).then(res => {
            if (res.data.length > 0) {
              this.tableHead = []
              for (let i in res.data[0]) {
                this.tableHead.push(i)
              }
              this.tableData = res.data
              this.time = res.time_cost
            } else {
              this.tableHead = []
              this.tableData = []
            }
            this.loading = false
            this.$message({
              message: '查询成功',
              type: 'success'
            })
          }).catch(err => {
            this.loading = false
            console.log(err)
            this.$message({
              message: '查询内容为空，请确认信息正确',
              type: 'error'
            })
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>