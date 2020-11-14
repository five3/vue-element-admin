import request from '@/utils/request'

export function getTestMock (params) {
  return request({
    url: '/api/imock',
    method: 'get',
    params
  })
}

export function setTestMock (data) {
  return request({
    url: '/api/imock',
    method: 'post',
    data
  })
}