import request from '@/utils/request'

export function getConnect (params) {
  return request({
    url: '/api/idata',
    method: 'get',
    params
  })
}

export function doConnect (data) {
  return request({
    url: '/api/idata',
    method: 'post',
    data
  })
}

export function exec (data) {
  return request({
    url: '/api/idata/exec',
    method: 'post',
    data
  })
}
