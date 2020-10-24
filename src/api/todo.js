import request from '@/utils/request'

export function submit(data) {
  return request({
    url: '/api/todo',
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    data
  })
}

export function pullData(params) {
  return request({
    url: '/api/todo/list',
    method: 'get',
    params
  })
}
