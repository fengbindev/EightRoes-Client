import { axios } from '@/utils/request'

const api = {
  user: '/user',
  role: '/role',
  permission: '/privilege',
  branch: '/branch',
  code: '/code',
  config: '/configs',
  schedule: '/schedule',
  security: '/security',
  plugin: '/plugins',
  log: '/operateLog'
}

export default api

export function getBranchList (parameter) {
  return axios({
    url: api.branch,
    method: 'get',
    params: parameter
  })
}

export function saveBranch (parameter) {
  let url = api.branch
  let method = 'post'
  if (parameter.branchInnercode) {
    url = api.branch + `/${parameter.branchInnercode}`
    method = 'put'
  }
  return axios({
    url: url,
    method: method,
    data: parameter
  })
}

export function delBranch (ids) {
  return axios({
    url: api.branch + `/${ids}`,
    method: 'delete'
  })
}

export function getBranchUserList (parameter) {
  return axios({
    url: api.branch + '/user',
    method: 'get',
    params: parameter
  })
}

export function getRoleList (parameter) {
  return axios({
    url: api.role,
    method: 'get',
    params: parameter
  })
}

export function saveRole (parameter) {
  if (parameter.method === 'add') {
    return axios({
      url: api.role,
      method: 'post',
      data: parameter
    })
  } else if (parameter.method === 'edit') {
    return axios({
      url: api.role + `/${parameter.roleCode}`,
      method: 'put',
      data: parameter
    })
  }
}

export function delRole (ids) {
  return axios({
    url: api.role + `/${ids}`,
    method: 'delete'
  })
}

export function getPermissionTree (parameter) {
  return axios({
    url: api.permission + `/id/${parameter.id}/type/${parameter.type}/menus`,
    method: 'get',
    params: parameter
  })
}

export function savePermission (parameter) {
  return axios({
    url: api.permission + `/id/${parameter.id}/type/${parameter.type}/menus`,
    method: 'put',
    params: parameter
  })
}

export function getUserList (parameter) {
  return axios({
    url: api.user,
    method: 'get',
    params: parameter
  })
}

export function getRoleListByBranch (parameter) {
  return axios({
    url: api.user + '/role',
    method: 'get',
    params: parameter
  })
}

export function saveUser (parameter) {
  if (parameter.method === 'add') {
    return axios({
      url: api.user,
      method: 'post',
      data: parameter
    })
  } else if (parameter.method === 'edit') {
    return axios({
      url: api.user + `/${parameter.userName}`,
      method: 'put',
      data: parameter
    })
  }
}

export function delUser (ids) {
  return axios({
    url: api.user + `/${ids}`,
    method: 'delete'
  })
}

export function enableUser (ids) {
  return axios({
    url: api.user + `/enable/${ids}`,
    method: 'put'
  })
}

export function disabledUser (ids) {
  return axios({
    url: api.user + `/disable/${ids}`,
    method: 'put'
  })
}

export function getCodeList (parameter) {
  return axios({
    url: api.code,
    method: 'get',
    params: parameter
  })
}

export function saveCode (parameter) {
  if (parameter.method === 'add') {
    return axios({
      url: api.code,
      method: 'post',
      data: parameter
    })
  } else if (parameter.method === 'edit') {
    return axios({
      url: api.code + `/${parameter.oldCodeType}`,
      method: 'put',
      data: parameter
    })
  }
}

export function delCode (ids) {
  return axios({
    url: api.code + `/${ids}`,
    method: 'delete'
  })
}

export function getCodeItemList (codeType) {
  return axios({
    url: api.code + `/${codeType}/items`,
    method: 'get'
  })
}

export function saveCodeItem (parameter) {
  if (parameter.method === 'add') {
    return axios({
      url: api.code + `/${parameter.codeType}/items`,
      method: 'post',
      data: parameter
    })
  } else if (parameter.method === 'edit') {
    return axios({
      url: api.code + `/${parameter.codeType}/items/${parameter.oldCodeValue}`,
      method: 'put',
      data: parameter
    })
  }
}

export function delCodeItem (codeType, ids) {
  return axios({
    url: api.code + `/${codeType}/items/${ids}`,
    method: 'delete'
  })
}

export function getConfig () {
  return axios({
    url: api.config,
    method: 'get'
  })
}

export function saveConfig (parameter) {
  return axios({
    url: api.config + '/saved',
    method: 'put',
    data: parameter
  })
}

export function getSchedule () {
  return axios({
    url: api.schedule,
    method: 'get'
  })
}

export function saveSchedule (parameter) {
  return axios({
    url: api.schedule,
    method: 'put',
    data: parameter
  })
}

export function excutedSchedule (id) {
  return axios({
    url: api.schedule + '/executed',
    method: 'post',
    data: { id: id }
  })
}

export function getSecurity () {
  return axios({
    url: api.security,
    method: 'get'
  })
}

export function saveSecurity (parameter) {
  return axios({
    url: api.security,
    method: 'put',
    data: parameter
  })
}

export function initpwdcheck () {
  return axios({
    url: api.user + '/initpwdcheck',
    method: 'get'
  })
}

export function changeloginpassword (parameter) {
  return axios({
    url: api.user + '/changeloginpassword',
    method: 'put',
    data: parameter
  })
}

export function password (parameter) {
  return axios({
    url: api.user + '/password',
    method: 'put',
    data: parameter
  })
}

export function getPlugin (parameter) {
  console.log(parameter)
  return axios({
    url: api.plugin,
    method: 'get',
    params: parameter
  })
}

export function getPluginDetail (pluginId) {
  return axios({
    url: api.plugin + `/${pluginId}`,
    method: 'get'
  })
}

export function getUserLoginLog (parameter) {
  return axios({
    url: api.log + '/userloginlog',
    method: 'get',
    params: parameter
  })
}

export function getOperateLog (parameter) {
  return axios({
    url: api.log + '/useroperatelog',
    method: 'get',
    params: parameter
  })
}

export function getSqlLog (parameter) {
  return axios({
    url: api.log + '/sqllog',
    method: 'get',
    params: parameter
  })
}

export function getLogFile (parameter) {
  return axios({
    url: api.log + '/logfiles',
    method: 'get',
    params: parameter
  })
}
