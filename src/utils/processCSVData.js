// processCSVData.js

/**
 * 1) 去 BOM，把所有 item 里的 key 如果带了 \uFEFF 就替换成干净的
 * 2) 对指定字段做自定义拆分
 */
export const processCSVData = (data, fieldsToProcess) => {
  return data.map((original) => {
    // —— ① 去 BOM —— //
    const item = {}
    for (let rawKey in original) {
      const cleanKey = rawKey.replace(/^\uFEFF/, '')
      item[cleanKey] = original[rawKey]
    }

    // —— ② 对要处理的字段拆分 —— //
    fieldsToProcess.forEach((field) => {
      const val = item[field]
      if (typeof val === 'string' && val.includes(',')) {
        item[field] = parseCSVField(val)
      }
    })

    return item
  })
}

/**
 * 把一个 CSV 单元格里的逗号分隔（支持引号和双引号转义）的内容，
 * 拆成一个字符串数组。
 */
const parseCSVField = (field) => {
  const result = []
  let current = ''
  let insideQuotes = false

  for (let i = 0; i < field.length; i++) {
    const char = field[i]

    if (char === '"') {
      // 如果当前在引号里，且后面紧跟一个 "，那其实就是转义的双引号
      if (insideQuotes && field[i + 1] === '"') {
        current += '"'
        i++ // 跳过下一个 "，它是转义的一部分
      } else {
        // 否则切换 引号中/外 的状态
        insideQuotes = !insideQuotes
      }
    } else if (char === ',' && !insideQuotes) {
      // 遇到非引号区间的逗号，就拆一段
      result.push(current)
      current = ''
    } else {
      current += char
    }
  }

  // 最后一段
  result.push(current)

  // 去掉每段首尾的多余引号和空白
  return result.map((str) => str.replace(/^"(.*)"$/, '$1').trim())
}
