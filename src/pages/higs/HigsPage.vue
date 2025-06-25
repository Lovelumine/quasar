<template>
  <div class="site--main">
    <h2>HIGS</h2>
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
          <el-option v-for="column in allColumns" :key="column.key" :value="column.dataIndex" />
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
          @sorter-change="onSorterChange"
          :loading="loading"
          :pagination="pagination"
        >
          <template #expandedRowRender="{ record }">
            <div class="expanded-row">
              <el-button type="primary" size="small" @click="openDetailPage(record)">
                Details
              </el-button>
            </div>
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
import { defineComponent, ref, onMounted, computed } from 'vue'
import { ElSelect, ElOption, ElButton } from 'element-plus'
import { useTableData } from '../../utils/useTableData.js'
import VueEasyLightbox from 'vue-easy-lightbox'
import { processCSVData } from '../../utils/processCSVData.js'
import { allColumns, selectedColumns, DataType } from './Higscolumns.js'
import { sortData } from '../../utils/sort.js'
import { pagination } from '../../utils/table'

import en from '@shene/table/dist/locale/en'
const locale = ref(en)

export default defineComponent({
  name: 'NaturalSupTRNA',
  components: {
    // ElImage,
    ElSelect,
    ElOption,
    ElButton,
    VueEasyLightbox,
  },
  setup() {
    const {
      searchText,
      filteredDataSource: originalFilteredDataSource,
      searchColumn,
      loadData,
    } = useTableData<DataType>('data/HIGS.csv', (data) => {
      return processCSVData(data, [
        'Codon for readthrough',
        'Noncanonical charged amino acids',
        'Readthrough mechanism',
      ])
    })

    const tableSize = ref('default')
    const loading = ref(false)
    const sortedDataSource = ref<DataType[]>([])
    const visible = ref(false)
    const lightboxImgs = ref<string[]>([])
    const lightboxKey = ref(0)


    onMounted(async () => {
      await loadData()
      sortedDataSource.value = originalFilteredDataSource.value
    })

    const showLightbox = (pictureid: string) => {
      const imgUrl = `https://minio.lumoxuan.cn/ensure/picture/${pictureid}.png`
      lightboxImgs.value = [imgUrl]
      lightboxKey.value += 1 // 更新key以重新渲染组件
      visible.value = true
    }

    const hideLightbox = () => {
      visible.value = false
    }

    const displayedColumns = computed(() =>
      allColumns.filter((column) => selectedColumns.value.includes(column.key as string)),
    )

    const onSorterChange = (params: any) => {
      let sorter: { field?: string; order?: 'ascend' | 'descend' } = {}
      if (Array.isArray(params)) {
        sorter = params[0]
      } else {
        sorter = params
      }

      loading.value = true
      const timer = setTimeout(() => {
        sortedDataSource.value = sortData(originalFilteredDataSource.value, sorter)
        loading.value = false
        clearTimeout(timer)
      }, 300)
    }

    const filteredDataSource = computed(() => {
      if (!searchText.value) {
        return sortedDataSource.value
      }
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

    function openDetailPage(record: DataType) {
      const groups = [
        {
          title: 'Transgenic Plant',
          {}
        }
      ]
      const rows = Object.entries(record)
        .map(([key, val]) => `<tr>
          <td class="label">${key}:</td>
          <td>${val != null ? val : ''}`)
        .join('\n')
      const html = `
        <!doctype html>
        <html><head>
          <meta charset="utf-8">
          <title>Detail Information</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
            }
            td {
            padding: 8px;
            border:1px solid #eee;
            vertical-align: top;
            }
            .label{
            font-weight:bold;
            width:30%;
            background-color:#f9f9f9;
            }
            .highlight{
            background-color:#fffacd;
            font-weight:bold;
            }

          </style>
        </head>
        <body>
          <h1>Details: ${record['Virus'] || ''}</h1>
          <table>
            <tbody>

            </tbody>
          <table>
        </body>
        </html>`
      const blob = new Blob([html], { type: 'text/html' })
      const url = URL.createObjectURL(blob)
      window.open(url, '_blank')
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
      loading, // ← 新增这一行
      visible,
      lightboxImgs,
      lightboxKey,
      showLightbox,
      hideLightbox,
      onSorterChange,
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

.chart-section-wrapper {
  /* 横向滚动的外层不用改 */
  overflow-x: auto;
  padding: 10px 0;
}

/* 把原来的横向 flex 换成纵向 flex */
.chart-row {
  display: flex;
  flex-direction: column; /* 改成纵向堆叠 */
  gap: 20px; /* 每行间距 */
}

/* 每个图表占满整行 */
.chart-col {
  width: 100%; /* 撑满父容器宽度 */
  /* 删除或注释掉原来的 flex 相关设置：
     flex: 0 0 auto;
     width: 1000px;
  */
}
</style>
