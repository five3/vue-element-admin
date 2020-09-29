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

export function pullData(par) {
  return request({
    url: '/api/todo',
    method: 'get',
    params: par
  })
}
