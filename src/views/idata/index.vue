<template>
  <div class="app-container">
    <el-card class="box-card">
      <el-form :inline="true" ref="form" :model="formData" label-width="55px">
        <el-form-item label="IP">
          <el-input v-model="formData.ip"></el-input>
        </el-form-item>
        <el-form-item label="域名">
          <el-input
          v-model="formData.host"></el-input>
        </el-form-item>
        <el-form-item label="端口">
          <el-input
          v-model="formData.port" style="width: 80px;"></el-input>
        </el-form-item>
        <el-form-item label="数据库">
          <el-input
          v-model="formData.db"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onConnect">测试连接</el-button>
        </el-form-item>
      </el-form>
      <el-input
        type="textarea"
        :rows="5"
        placeholder="请输入SQL语句"
        v-model="sql">
      </el-input>
      <div style="margin: 10px 10px 0 0; text-align: right;">
        <el-button type="primary" @click="onExec">执行SQL</el-button>
      </div>
    </el-card>
    <el-card class="box-card">
      <el-table
      :data="tableData"
      style="width: 100%">
        <el-table-column
          prop="date"
          label="日期"
          width="180">
        </el-table-column>
        <el-table-column
          prop="name"
          label="姓名"
          width="180">
        </el-table-column>
        <el-table-column
          prop="address"
          label="地址">
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import { getConnect, doConnect, exec } from '@/api/imock'
export default {
  name: 'idata',
  data() {
    return {
      title: 'iData设置',
      formData: {},
      tableData: [],
      time: 0,
      uniqKey: null,
      maxCount: 20,
      sql: null
    }
  },
  methods: {
    onConnect () {
      doConnect({}).then(res => {
        this.uniqKey = res.uniq_key
        this.$message({
          message: '连接测试成功！',
          type: 'success'
        })
      }).catch(err => {
        this.$log.danger(err)
      })
    },
    onExec () {
      exec({
        ...this.formData,
        uniqKey: this.uniqKey,
        maxCount: this.MaxCount
      }).then(res => {
        this.tableData = res.list
        this.time = res.time
        this.$message({
          message: '执行SQL成功',
          type: 'success'
        })
      }).catch(err => {
        this.$log.danger(err)
      })
    }
  }
}
</script>