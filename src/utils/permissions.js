
export function actionToObject (json) {
  try {
    return JSON.parse(json)
  } catch (e) {
    console.log('err', e.message)
  }
  return []
}

export function getMenuTreePermission (permission, menuData, route) {
  let index = 0
  for (let i = 0; i < route.length; i++) {
    let flag = false
    if (route[i].meta && route[i].meta.permission) {
      for (let j = 0, len = permission.length; j < len; j++) {
        flag = route[i].meta.permission.includes(permission[j].id)
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
