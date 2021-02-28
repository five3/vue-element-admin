import request from '@/utils/request'

export function getTestMock (params) {
  return request({
    url: '/api/imock/_mock_settings_',
    method: 'get',
    params
  })
}

export function setTestMock (data) {
  return request({
    url: '/api/imock/_mock_settings_',
    method: 'post',
    data
  })
}