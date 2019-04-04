export function compareNum (prop) {
  return function (obj1, obj2) {
    var val1 = obj1[prop]
    var val2 = obj2[prop]
    if (val1 < val2) {
      return -1
    } else if (val1 > val2) {
      return 1
    } else {
      return 0
    }
  }
}

// 数组排序方式
export function compareSort (sortKey, sortMeth) {
  if (sortMeth == 'asc') {
    return function (a, b) {
      var value1 = a[sortKey]
      var value2 = b[sortKey]
      return value1 - value2
    }
  } else {
    return function (a, b) {
      var value1 = a[sortKey]
      var value2 = b[sortKey]
      return value2 - value1
    }
  }
}

// 深度平铺MAP
export function flattenDeep (arr, tmpArr, pNode) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].hasOwnProperty('children') && (arr[i].children != null) && (arr[i].children.length > 0)) {
      let obj = JSON.parse(JSON.stringify(arr[i]))
      obj.pNode = pNode || null
      delete obj.children
      tmpArr.push(obj)
      flattenDeep(arr[i].children, tmpArr, arr[i])
    } else {
      let obj = JSON.parse(JSON.stringify(arr[i]))
      obj.pNode = pNode || null
      tmpArr.push(obj)
    }
  }
}
