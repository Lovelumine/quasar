import { ref, computed } from 'vue'
import Papa from 'papaparse'

/**
 * @template T
 * @param {string} csvUrl
 * @param {(rows: any[]) => T[]} [transformer]
 * @returns {{
 *   searchText: import('vue').Ref<string>,
 *   searchColumn: import('vue').Ref<string>,
 *   filteredDataSource: import('vue').Ref<T[]>,
 *   loadData: () => Promise<void>,
 *   isLoading: import('vue').Ref<boolean>,
 *   error: import('vue').Ref<any>
 * }}
 */
export function useTableData(csvUrl, transformer) {
  const allData = ref([])
  const searchText = ref('')
  const searchColumn = ref('')
  const isLoading = ref(false)
  const error = ref(null)

  const loadData = async () => {
    isLoading.value = true
    error.value = null
    try {
      const response = await fetch(csvUrl)
      const csvText = await response.text()

      // —— 新增：用来统计每个“干净”列头出现次数 —— //
      const headerCount = {}

      Papa.parse(csvText, {
        header: true,
        delimiter: ',',
        skipEmptyLines: true,
        dynamicTyping: true,

        // —— 新增：在这里清理 BOM、trim 并检测重复 —— //
        transformHeader(rawHeader) {
          const clean = rawHeader.replace(/^\uFEFF/, '').trim()
          headerCount[clean] = (headerCount[clean] || 0) + 1
          if (headerCount[clean] > 1) {
            console.warn(`[useTableData] 重复列头 "${clean}" 第 ${headerCount[clean]} 次出现`)
          }
          return clean
        },

        complete: (results) => {
          // —— 新增：打印最终使用的所有列名 —— //
          console.log('[useTableData] 最终列头：', results.meta.fields)

          // 原始解析结果
          let rows = results.data
          // 如果提供了 transformer 函数，则对 rows 进行二次加工
          if (typeof transformer === 'function') {
            rows = transformer(rows)
          }
          // 添加唯一 key 并存储
          allData.value = rows.map((item, index) => ({
            key: index.toString(),
            ...item,
          }))
          isLoading.value = false
        },
        error(err) {
          error.value = err
          isLoading.value = false
        },
      })
    } catch (err) {
      error.value = err
      isLoading.value = false
    }
  }

  const filteredDataSource = computed(() => {
    if (!searchText.value) return allData.value
    return allData.value.filter((item) => {
      if (searchColumn.value && item[searchColumn.value] != null) {
        return item[searchColumn.value]
          .toString()
          .toLowerCase()
          .includes(searchText.value.toLowerCase())
      }
      return Object.keys(item).some(
        (key) =>
          item[key] != null &&
          item[key].toString().toLowerCase().includes(searchText.value.toLowerCase()),
      )
    })
  })

  return {
    searchText,
    searchColumn,
    filteredDataSource,
    loadData,
    isLoading,
    error,
  }
}
