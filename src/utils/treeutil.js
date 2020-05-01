/**
 * 构造树型结构数据
 * @param {*} source 数据源
 * @param {*} id id字段 默认 'id'
 * @param {*} parentId 父节点字段 默认 'parentId'
 * @param {*} children 孩子节点字段 默认 'children'
 * @param {*} rootId 根Id 默认 0
 */
export function treeData (source, id, parentId, children, rootId) {
  id = id || 'id'
  parentId = parentId || 'parentId'
  children = children || 'children'
  rootId = rootId || 0
  const cloneData = JSON.parse(JSON.stringify(source))// 对源数据深度克隆
  return cloneData.filter(father => {
    const branchArr = cloneData.filter(child => father[id] === child[parentId])// 返回每一项的子级数组
    branchArr.length > 0 ? father[children] = branchArr : delete father[children]// 如果存在子级，则给父级添加一个children属性，并赋值
    return father[parentId] === rootId // 返回第一层
  })
}

export function getMenuTreePermission (permission, menuData, route) {
  let index = 0
  for (let i = 0; i < route.length; i++) {
    let flag = false
    if (route[i].meta && route[i].meta.priv) {
      for (let j = 0, len = permission.length; j < len; j++) {
        flag = route[i].meta.priv.includes(permission[j].id)
        if (flag) {
          const items = permission[j].items
          if (items) {
            for (let k = 0; k < items.length; k++) {
              items[k].title = items[k].name
              items[k].key = items[k].id
              items[k].class = 'tree_float'
            }
          }
          menuData.push({
            key: permission[j].id,
            title: route[i].meta.title,
            disabled: permission[j].disabled,
            children: items,
            class: 'tree_clear'
          })
          if (route[i].children && route[i].children.length > 0) {
            getMenuTreePermission(permission, menuData[index].children, route[i].children)
            index++
          }
        }
      }
    }
  }
  return menuData
}
