<template>
  <div class="app-container">
    <el-form ref="form" :model="formData" label-width="90px">
      <el-form-item label="请求地址">
        <el-input v-model="reqURL" :disabled="true" />
      </el-form-item>
      <el-form-item label="匹配域名">
        <el-input
          v-model="formData.host"
          placeholder="Mock匹配的请求域名，比如： www.baidu.com。 匹配任意域名可使用*"
        />
      </el-form-item>
      <el-form-item label="匹配路径">
        <el-input
          v-model="formData.path"
          placeholder="Mock匹配的请求路径，比如：/"
        />
      </el-form-item>
      <el-form-item label="匹配方法">
        <el-input
          v-model="formData.method"
          placeholder="Mock匹配的请求方法，比如： GET。匹配全部请求方法可使用*"
        />
      </el-form-item>
      <el-form-item label="Mock响应码">
        <el-input
          v-model.number="formData.code"
          placeholder="请输入Mock响应码。 比如：200"
        />
      </el-form-item>
      <el-form-item label="Mock响应头">
        <el-input
          v-model="formData.headers"
          :rows="4"
          type="textarea"
          placeholder='请输入Mock响应头，以JSON字典的形式描述。 比如：{"Content-Type": "application/json"}'
        />
      </el-form-item>
      <el-form-item label="Mock类型">
        <el-select v-model="formData.type" placeholder="请选择一种Mock类型">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="Mock响应体">
        <el-input
          v-model="formData.content"
          type="textarea"
          :rows="4"
          placeholder="请输入Mock响应体内容，需要与Mock头信息指定的格式一致"
        />
      </el-form-item>
      <el-form-item label="未匹配处理">
        <el-radio v-model="formData.noMatch" label="empty">空字符</el-radio>
        <el-radio v-model="formData.noMatch" label="proxy">代理模式</el-radio>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">设置</el-button>
        <el-button type="primary" @click="onView">查看</el-button>
      </el-form-item>
    </el-form>

    <el-drawer title="" :visible.sync="drawer" :direction="direction" :with-header="true" size="300">
      <div style="padding: 0px 15px; height: 100%;">
        <el-card style="overflow: auto; height: 700px; min-width: 500px; margin-bottom: 20px;" type="card" better-scroll>
          <div>
            <pre v-highlightjs="JSON.stringify(mockData, null, 2)"><code class="json" /></pre>
          </div>
        </el-card>
      </div>
    </el-drawer>
  </div>
</template>
<script>
import { getTestMock, setTestMock } from '@/api/imock'
export default {
  data() {
    return {
      title: 'iMock设置',
      drawer: false,
      direction: 'rtl',
      formData: {
        host: null,
        path: null,
        method: null,
        code: null,
        noMatch: 'empty'
      },
      mockData: {},
      options: [
        {
          'label': '纯文本',
          'value': 'text'
        },
        {
          'label': '参数化',
          'value': 'dynamic'
        },
        {
          'label': 'Python表达式',
          'value': 'express'
        }
      ]
    }
  },
  computed: {
    reqURL: {
      get() {
        if (this.formData.host) {
          const path = this.formData.path || '/'
          return `http://${this.formData.host}${path}`
        } else {
          return ''
        }
      }
    }
  },
  methods: {
    warpData() {
      const data = {}
      data.host = this.formData.host || '*'
      data.url = this.formData.path || '/'
      data.method = this.formData.method || '*'
      data.no_pattern_response = this.formData.noMatch
      data.code = this.formData.code || 200
      data.headers = this.formData.headers || '{}'
      data.data = this.formData.content || ''
      data.type = this.formData.type
      data.headers = JSON.parse(data.headers)
      return data
    },
    onSubmit() {
      const data = this.warpData()
      setTestMock(data).then(res => {
        this.$message({
          message: '设置Mock成功！',
          type: 'success'
        })
      }).catch(err => {
        console.log(err)
      })
    },
    onView() {
      getTestMock().then(res => {
        this.mockData = res.data
        this.drawer = true
        this.$message({
          message: '获取Mock成功！',
          type: 'success'
        })
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>
