<!-- src/views/home/VIGS.vue -->
<template>
  <div class="site--main">
    <h2>VIGS</h2>
    <!-- 顶部行包含尺寸调整、搜索框和列选择 -->
    <div class="top-controls">
      <!-- 搜索框 -->
      <div class="search-box">
        <input v-model="searchText" placeholder="Enter search content" class="search-input" />
        <el-select
          v-model="searchColumn"
          placeholder="Select column to search"
          class="search-column-select"
        >
          <el-option :key="'all'" :label="'All columns'" :value="''" />
          <el-option
            v-for="column in allColumns"
            :key="column.key"
            :value="column.dataIndex"
            :label="column.title as string"
          />
        </el-select>
      </div>
      <!-- 调整尺寸 -->
      <div class="size-controls" style="margin-bottom: 10px">
        <el-radio-group v-model="tableSize">
          <el-radio-button value="small">Small Size</el-radio-button>
          <el-radio-button value="default">Default Size</el-radio-button>
          <el-radio-button value="large">Large Size</el-radio-button>
        </el-radio-group>
      </div>
      <!-- 选择显示列 -->
      <div class="column-controls" style="margin-bottom: 10px">
        <el-select
          v-model="selectedColumns"
          multiple
          placeholder="Select columns to display"
          collapse-tags
          class="column-select"
        >
          <el-option
            v-for="column in allColumns"
            :key="column.key"
            :label="column.title as string"
            :value="column.key"
          />
        </el-select>
      </div>
    </div>
    <!-- 表格组件 -->
    <div class="custom-tag-styles">
      <s-table-provider :hover="true" :locale="locale">
        <s-table
          :columns="displayedColumns"
          :data-source="filteredDataSource"
          :row-key="(record) => record.key"
          :stripe="true"
          :show-sorter-tooltip="true"
          :size="tableSize"
          :expand-row-by-click="true"
          v-model:expandedRowKeys="expandedRowKeys"
          @sorter-change="onSorterChange"
          :loading="loading"
          :pagination="pagination"
        >
          <!-- 保留 slot 以渲染“+”图标，但不显示实际展开内容 -->
          <template #expandedRowRender>
            <div style="display: none"></div>
          </template>
        </s-table>
      </s-table-provider>
      <vue-easy-lightbox
        :key="lightboxKey"
        :visible="visible"
        :imgs="lightboxImgs"
        :index="0"
        @hide="hideLightbox"
      />
    </div>
  </div>
</template>

<script lang="tsx">
import { defineComponent, ref, onMounted, computed, watch } from 'vue'
import { ElSelect, ElOption } from 'element-plus'
import { useTableData } from '../../utils/useTableData.js'
import VueEasyLightbox from 'vue-easy-lightbox'
import { processCSVData } from '../../utils/processCSVData.js'
import { allColumns, selectedColumns, DataType } from './Vigscolumn.js'
import { sortData } from '../../utils/sort.js'
import { pagination } from '../../utils/table'
import { useRouter } from 'vue-router'

import en from '@shene/table/dist/locale/en'
const locale = ref(en)

export default defineComponent({
  name: 'VIGS',
  components: {
    ElSelect,
    ElOption,
    VueEasyLightbox,
  },
  setup() {
    // 从 CSV 加载数据
    const {
      searchText,
      filteredDataSource: originalFilteredDataSource,
      searchColumn,
      loadData,
    } = useTableData<DataType>('data/VIGS.csv', (data) =>
      processCSVData(data, [
        'Codon for readthrough',
        'Noncanonical charged amino acids',
        'Readthrough mechanism',
      ]),
    )

    // 各种响应式状态
    const tableSize = ref('default')
    const loading = ref(false)
    const sortedDataSource = ref<DataType[]>([])
    const visible = ref(false)
    const lightboxImgs = ref<string[]>([])
    const lightboxKey = ref(0)
    // 记录当前哪些行展开
    const expandedRowKeys = ref<string[]>([])
    const router = useRouter()
    // 点击图片打开 Lightbox
    const showLightbox = (pictureid: string) => {
      const imgUrl = `https://minio.lumoxuan.cn/ensure/picture/${pictureid}.png`
      lightboxImgs.value = [imgUrl]
      lightboxKey.value += 1
      visible.value = true
    }
    const hideLightbox = () => {
      visible.value = false
    }

    // 组件挂载后加载数据
    onMounted(async () => {
      await loadData()
      sortedDataSource.value = originalFilteredDataSource.value
    })

    // 计算哪些列要显示
    const displayedColumns = computed(() =>
      allColumns.filter((c) => selectedColumns.value.includes(c.key as string)),
    )

    // 计算过滤后的数据
    const filteredDataSource = computed(() => {
      if (!searchText.value) return sortedDataSource.value
      return sortedDataSource.value.filter((record) => {
        if (!searchColumn.value) {
          return Object.values(record).some((val) =>
            String(val).toLowerCase().includes(searchText.value.toLowerCase()),
          )
        }
        return String(record[searchColumn.value])
          .toLowerCase()
          .includes(searchText.value.toLowerCase())
      })
    })

    // 排序回调
    function onSorterChange(params: any) {
      const sorter = Array.isArray(params) ? params[0] : params
      loading.value = true
      setTimeout(() => {
        sortedDataSource.value = sortData(originalFilteredDataSource.value, sorter)
        loading.value = false
      }, 300)
    }

    // 侦听 expandedRowKeys，只要用户点击 “+” 就会有值
    watch(expandedRowKeys, (keys) => {
      if (keys.length) {
        const key = keys[0]
        router.push({ name: 'vigs-detail', params: { key } })
        expandedRowKeys.value = []
      }
    })

    // 在新标签页打开详情
    function openDetailPage(record: DataType) {
      console.log('openDetailPage record=', record)
      const rows = Object.entries(record)
        .map(([key, val]) => `<p><strong>${key}:</strong> ${val != null ? val : ''}</p>`)
        .join('\n')
      const html = `
        <!doctype html>
        <html><head>
          <meta charset="utf-8">
          <title>Record Details</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            p { margin: 6px 0; }
            strong { color: #333; }
          </style>
        </head>
        <body>
          <h1>Details: ${record['Virus'] || ''}</h1>
          ${rows}
        </body>
        </html>`
      const blob = new Blob([html], { type: 'text/html' })
      const url = URL.createObjectURL(blob)
      window.open(url, '_blank')
      // 1 分钟后释放 URL
      setTimeout(() => URL.revokeObjectURL(url), 60_000)
    }

    return {
      allColumns,
      displayedColumns,
      filteredDataSource,
      tableSize,
      searchText,
      searchColumn,
      locale,
      selectedColumns,
      loading,
      visible,
      lightboxImgs,
      lightboxKey,
      showLightbox,
      hideLightbox,
      onSorterChange,
      expandedRowKeys, // v-model:expandedRowKeys 绑定
      pagination,
      openDetailPage,
    }
  },
})
</script>

<style>
.site--main {
  padding: 20px;
}
.top-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.search-box {
  flex-grow: 1;
  margin-right: 10px;
}
.size-controls,
.column-controls {
  display: flex;
  align-items: center;
}
.column-select {
  margin-left: 10px;
  width: 200px;
}
.custom-tag-styles {
  margin-top: 20px;
}
</style>
