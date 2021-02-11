import request from '@/utils/request'

export function execDB (data) {
  return request({
    url: '/api/idata',
    method: 'post',
    headers: {
      "Content-Type": "application/json"
    },
    data
  })
}
