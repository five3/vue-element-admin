/* eslint-disable */
<template>
  <div class="app-container">
    <el-form ref="form" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="用例名称" prop="name">
        <el-input v-model="form.name" placeholder="请输入一个唯一的用例名称" />
      </el-form-item>
      <el-form-item label="请求URL" prop="url">
        <el-input v-model="form.url" placeholder="请输入请求URL" />
      </el-form-item>
      <el-form-item label="请求方法">
        <el-checkbox-group v-model="form.method">
          <el-radio v-model="form.method" label="GET" @change="radioClicked">GET</el-radio>
          <el-radio v-model="form.method" label="POST" @change="radioClicked">POST</el-radio>
          <el-radio v-model="form.method" label="PUT" @change="radioClicked">PUT</el-radio>
          <el-radio v-model="form.method" label="DELETE" @change="radioClicked">DELETE</el-radio>
          <el-radio v-model="form.method" label="HEAD" @change="radioClicked">HEAD</el-radio>
          <el-radio v-model="form.method" label="OPTIONS" @change="radioClicked">OPTIONS</el-radio>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item v-show="showBody" label="请求参数">
        <el-input v-model="form.body" :rows="5" type="textarea" placeholder="请输入原生请求字符串，如：name=api&action=test。如果同时需要上传请求文件，则字段形式为JSON格式，如：{&quot;name&quot;: &quot;api&quot;, &quot;action&quot;: &quot;test&quot;}" />
      </el-form-item>
      <el-form-item v-show="showBody" label="请求文件">
        <el-upload
          class="upload-demo"
          action="/api/http/file"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :before-remove="beforeRemove"
          :before-upload="beforeUpload"
          multiple
          :limit="10"
          :on-exceed="handleExceed"
          :file-list="fileList"
          :on-success="handleSuccess"
          :on-error="handleError"
          :show-file-list="false"
          style="display: inline-block; width: 350px; margin: 0 10px;"
        >
          <el-button size="small" type="primary">点击上传</el-button>
          <span slot="tip" style="margin: 0 10px;" class="el-upload__tip">最多上传10个文件，单文件大小不超过5MB</span>
        </el-upload>
        <div v-for="item in fileList" :key="item.name">
          <el-input v-model="item.key" placeholder="文件字段名" style="display: inline-block; width: 150px;" />&nbsp;
          <el-input v-model="item.name" disabled style="display: inline-block; width: 150px;" />&nbsp;&nbsp;
          <i class="el-icon-delete" style="color: red; cursor: pointer;" @click="removeFile(item)" />
        </div>
      </el-form-item>
      <el-form-item label="请求头">
        <el-input v-model="form.headers" :rows="5" type="textarea" placeholder="请输入JSON格式头信息。如：{&quot;Content-Type&quot;: &quot;application/json&quot;}" />
      </el-form-item>
      <el-form-item label="验证方式" prop="validate">
        <el-select v-model="form.validate" placeholder="请选择一种验证方式" @change="changeOption">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-input v-show="show.express" v-model="form.express" :rows="5" type="textarea" style="margin-top: 20px;" placeholder="请输入验证内容。" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onDebug">调试用例</el-button>
        <el-button type="primary" @click="onSubmit">保存用例</el-button>
      </el-form-item>
      <el-form-item v-show="show.log" label="调试结果">
        {{ result }}
      </el-form-item>
      <el-form-item v-show="show.log" label="调试日志">
        <el-input v-model="log" type="textarea" :rows="15" disabled />
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { sendData, getData, debugData, deleteFile } from '@/api/httpapi'
export default {
  data() {
    return {
      filename: __filename,
      showBody: false,
      form: {
        id: null,
        name: '',
        url: '',
        method: 'GET',
        body: '',
        headers: '',
        fileList: [],
        validate: null,
        express: null
      },
      rules: {
        name: [
          { required: true, message: '请输入用例名称', trigger: 'blur' }
        ],
        url: [
          { required: true, message: '请输入请求URL', trigger: 'blur' }
        ],
        validate: [
          { required: true, message: '请选择一种验证方式', trigger: 'blur' }
        ]
      },
      fileList: [],
      options: [
        {
          'label': '等于',
          'value': 'equal'
        },
        {
          'label': '包含',
          'value': 'contain'
        },
        {
          'label': 'python表达式',
          'value': 'express'
        }
      ],
      show: {
        express: false,
        log: false
      },
      log: '',
      result: ''
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      const params = this.getParams()
      if (params.id) {
        this.fetchData(params.id)
      }
    },
    getParams() {
      var url = window.location.href
      if (url.indexOf('?') < 0) return {}

      var cs = url.split('?')[1]
      var csArr = cs.split('&')
      var d = {}
      for (var i = 0; i < csArr.length; i++) {
        var par = csArr[i].split('=')
        d[par[0]] = par[1]
      }

      return d
    },
    fetchData(id) {
      getData({
        id
      }).then(res => {
        this.form = res.data
        this.fileList = this.form.fileList ? this.form.fileList : []
        this.form.fileList = []
        this.radioClicked(this.form.method)
        this.changeOption(this.form.validate)
      }).catch(err => {
        console.log(err)
      })
    },
    warpFileList() {
      this.form.fileList = []
      for (let i = 0; i < this.fileList.length; i++) {
        this.form.fileList.push({
          id: this.fileList[i].id,
          name: this.fileList[i].name,
          url: this.fileList[i].url,
          fn: this.fileList[i].fn,
          type: this.fileList[i].type,
          key: this.fileList[i].key
        })
      }
    },
    onSubmit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.warpFileList()
          sendData(this.form).then(res => {
            this.$message.success('保存用例成功')
          }).catch(err => {
            console.log(err)
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    onDebug() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.warpFileList()
          debugData(this.form).then(res => {
            this.$message.success('成功调试用例')
            if (res.data.result === 1) {
              this.result = '通过'
            } else if (res.data.result === 2) {
              this.result = '失败'
            } else {
              this.result = '异常'
            }

            this.log = res.data.log.join('\r\n')
            this.show.log = true
          }).catch(err => {
            console.log(err)
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    handlePreview(file) {
      // eslint-disable-next-line
      window.open('javascript:window.name;', '<script>location.replace("' + file.url + '")<\/script>')
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 10 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    beforeRemove(file, fileList) {
      // return this.$confirm(`确定移除 ${file.name}？`)
    },
    handleRemove(file, fileList) {
    },
    handleSuccess(response, file, fileList) {
      file.url = response.data[0].url
      file.id = response.data[0].id
      file.fn = response.data[0].fn
      file.name = response.data[0].name
      file.type = response.data[0].type

      this.fileList = fileList
    },
    handleError(err, file, fileList) {
      console.log(err, file, fileList)
    },
    beforeUpload(file) {
      const isLt10M = file.size / 1024 / 1024 <= 5
      if (!isLt10M) {
        this.$message.error('上传头像图片大小不能超过 5MB!')
        file.reason = '文件大小限制'
        return false
      }

      const exist = this.fileList.filter(item => {
        return item.name === file.name
      })
      if (exist.length > 0) {
        this.$message.error('上传的文件不能重名!')
        file.reason = '重名'
        return false
      }
    },
    radioClicked(v) {
      if (['GET', 'HEAD', 'OPTIONS'].includes(v)) {
        this.showBody = false
      } else {
        this.showBody = true
      }
    },
    changeOption(v) {
      this.show.express = true
    },
    removeFile(item) {
      this.$confirm(`确定移除 ${item.name}？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        for (let i = 0; i < this.fileList.length; i++) {
          if (this.fileList[i].id === item.id) {
            deleteFile({
              url: item.url
            }).then(res => {
              this.fileList.splice(i, 1)
              this.$message.success('删除文件成功')
            }).catch(err => {
              console.log(err)
            })
          }
        }
      }).catch(() => {})
    }
  }
}
</script>
