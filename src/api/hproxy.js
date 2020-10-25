import request from '@/utils/request'

export function submit(data) {
  return request({
    url: '/api/hproxy',
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    data
  })
}

export function pullData(params) {
  return request({
    url: '/api/hproxy/list',
    method: 'get',
    params
  })
}