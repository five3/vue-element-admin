<template>
  <div class="app-container">
    <div>
      <el-row :gutter="20">
        <el-col :span="24" :xs="24">
          <el-card>
            <el-button type="primary" @click="createTask">创建任务</el-button>
            <el-tabs v-model="activeTab" @tab-click="swithTab">
              <el-tab-pane label="当前任务" name="current">
              </el-tab-pane>
              <el-tab-pane label="未完成" name="unfinish">
              </el-tab-pane>
              <el-tab-pane label="已完成" name="finished">
              </el-tab-pane>
            </el-tabs>
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
              label="任务名称"
              width="100">
            </el-table-column>
            <el-table-column
              prop="desc"
              label="任务描述"
              width="400">
            </el-table-column>
            <el-table-column
              prop="start_time"
              label="开始时间"
              width="150">
            </el-table-column>
            <el-table-column
              prop="end_time"
              label="结束时间"
              width="150">
            </el-table-column>
            <el-table-column
              prop="assign"
              label="执行人"
              width="120">
            </el-table-column>
            <el-table-column
              prop="status"
              label="任务状态"
              width="120">
            </el-table-column>
            <el-table-column
              fixed="right"
              label="操作"
              width="60">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="editTask(scope.row)">编辑</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24" :xs="24">
          <el-drawer
            title=""
            :visible.sync="drawer"
            :with-header="false"
          >
            <div style="padding: 10px;">
              <h3>{{ title }}</h3>
              <el-form ref="form" :model="form" label-width="80px">
                <el-form-item label="任务名称">
                  <el-input v-model="form.name" />
                </el-form-item>
                <el-form-item label="任务描述">
                  <el-input v-model="form.desc" />
                </el-form-item>
                <el-form-item label="开始时间">
                  <el-date-picker
                    v-model="form.start_time"
                    align="right"
                    type="date"
                    value-format="yyyy-MM-dd"
                    placeholder="选择日期"
                  />
                </el-form-item>
                <el-form-item label="结束时间">
                  <el-date-picker
                    v-model="form.end_time"
                    align="right"
                    type="date"
                    value-format="yyyy-MM-dd"
                    placeholder="选择日期"
                  />
                </el-form-item>
                <el-form-item label="执行人">
                  <el-input v-model="form.assign" />
                </el-form-item>
                <el-form-item label="任务状态">
                  <el-select v-model="form.status" placeholder="请选择任务状态">
                    <el-option label="待执行" value="INIT" />
                    <el-option label="进行中" value="INPROCESS" />
                    <el-option label="已完成" value="FINISHED" />
                    <el-option label="已废弃" value="DISCARD" />
                  </el-select>
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
import { submit, pullData } from '@/api/todo'
export default {
  name: 'Todo',
  data() {
    return {
      title: '',
      drawer: false,
      activeTab: 'current',
      tableData: [],
      form: {
        'name': '',
        'desc': '',
        'start_time': '',
        'end_time': '',
        'assign': '',
        'status': ''
      }
    }
  },
  mounted() {
    this.getTaskList(this.activeTab)
  },
  methods: {
    swithTab(tab, event) {
      this.getTaskList(this.activeTab)
    },
    createTask() {
      this.title = '创建任务'
      this.drawer = true
      this.form = {}
    },
    editTask(row) {
      this.title = '编辑任务'
      this.drawer = true
      this.form = row
    },
    onSubmit() {
      submit(this.form).then((response) => {
        if (response.code === 0) {
          this.getTaskList(this.activeTab)
          this.$message({
            showClose: true,
            message: '保存成功！',
            type: 'success'
          })
          this.drawer = false
        }
      })
    },
    getTaskList(tab) {
      pullData({ tab: tab }).then((response) => {
        if (response.code === 0) {
          this.tableData = response.data
        }
      })
    }
  }
}
</script>
