import { axios } from '@/utils/request'

const api = {
  user: '/user',
  role: '/role',
  permission: '/privilege',
  branch: '/branch'
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
