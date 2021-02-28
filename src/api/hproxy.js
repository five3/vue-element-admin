import request from '@/utils/request'

export function submit(data) {
  return request({
    url: '/api/hproxy/_plugs_settings_',
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    data
  })
}

export function pullData(params) {
  return request({
    url: '/api/hproxy/_plugs_settings_',
    method: 'get',
    params
  })
}