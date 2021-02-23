import request from '@/utils/request'

export function sendData(data) {
  return request({
    url: '/api/http/',
    method: 'post',
    data
  })
}

export function debugData(data) {
  return request({
    url: '/api/http/debug',
    method: 'post',
    data
  })
}

export function deleteFile(data) {
  return request({
    url: '/api/http/file',
    method: 'delete',
    data
  })
}

export function getData(params) {
  return request({
    url: '/api/http/',
    method: 'get',
    params
  })
}

export function getList(params) {
  return request({
    url: '/api/http/list',
    method: 'get',
    params
  })
}

export function runAPI(id) {
  return request({
    url: '/api/http/run/' + id,
    method: 'get'
  })
}

export function viewLog(id) {
  return request({
    url: '/api/http/api/log/' + id,
    method: 'get'
  })
}

export function getLogList(params) {
  return request({
    url: '/api/http/log/list',
    method: 'get',
    params
  })
}

export function viewLogById(id) {
  return request({
    url: '/api/http/log/' + id,
    method: 'get'
  })
}
