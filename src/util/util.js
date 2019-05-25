import JsPDF from 'jspdf'
import _ from 'lodash'

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

export function exportPDF (echarts, titles, arrs, widths, fileName, groupSize, direct) {
  groupSize = groupSize || 24
  fileName = fileName || '统计数据导出'
  var doc
  if (echarts) {
    // a4纸的尺寸[595.28,841.89]
    let opts = {
      type: 'png',
      backgroundColor: 'rgba(8, 29, 45, 0.96)',
      excludeComponents: ['toolbox']
    }
    let img = echarts.getConnectedDataURL(opts)
    doc = new JsPDF({
      orientation: 'l',
      width: 595,
      height: 842
    })
    doc.addImage(img, 'png', 12, 30, 273, 150)
    doc.addPage('a4', 'p')
  } else {
    doc = new JsPDF({
      orientation: direct || 'p',
      width: 595,
      height: 842
    })
  }
  let tmpFlts = JSON.parse(JSON.stringify(arrs[0]))
  tmpFlts.unshift(titles[0])
  let datas = _.chunk(tmpFlts, groupSize)
  let element = []
  datas.forEach((data, x) => {
    element.push(document.createElement('div'))
    element[x].className = 'export-view'
  })
  datas.forEach((data, x) => {
    let html = `
    <table class="echarts-table" border="1" cellpadding="0" cellspacing="0">
      <tbody>`
    let index = x * groupSize - 1
    data.forEach((item, i) => {
      html += `<tr>`
      titles.forEach((title, j) => {
        html += `<td style="width: ${widths[j]}px;">${!x && !i ? titles[j] : arrs[j][index + i]}</td>`
      })
      html += `</tr>`
    })
    html += `
      </tbody>
    </table>`
    element[x].insertAdjacentHTML('beforeend', html)
    document.body.appendChild(element[x])
    var options = {
        pagesplit: false // 不分页
    }
    doc.addHTML(element[x], 12, 15, options, function () {
      if (x < datas.length - 1) {
        doc.addPage('a4', direct || 'p')
      } else {
        doc.save(fileName + '.pdf')
      }
    })
  })
}
