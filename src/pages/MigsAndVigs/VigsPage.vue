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
          @sorter-change="onSorterChange"
          :loading="loading"
          :pagination="pagination"
        >
          <template #expandedRowRender="{ record }">
            <div class="expanded-row">
              <!--   <p><b>Virus:</b> {{ record['Virus'] }}</p>
              <p><b>Virus Taxonomy ID:</b> {{ record['Virus Taxonomy ID'] }}</p>
              <p><b>Virus Engineered Methods:</b> {{ record['Virus Engineered Methods'] }}</p>
              <p><b>Target Pest:</b> {{ record['Target Pest'] }}</p>
              <p><b>Pest Taxonomy ID:</b> {{ record['Pest Taxonomy ID'] }}</p>
              <p><b>Target Pest Order:</b> {{ record['Target Pest Order'] }}</p>
              <p><b>Pest Developmental Stage:</b> {{ record['Pest Developmental Stage'] }}</p>
              <p><b>RNA Length (nt):</b> {{ record['RNA Length (nt)'] }}</p>
              <p>
                <b>RNA Sequence:</b>
                <code>{{ record['RNA Sequence'] }}</code>
              </p>
              <p><b>DNA length (bp):</b> {{ record['DNA length（bp）'] }}</p>
              <p>
                <b>DNA Sequence:</b>
                <code>{{ record['DNA Sequence'] }}</code>
              </p>
              <p><b>RNA Type:</b> {{ record['RNA Type'] }}</p>
              <p><b>RNA Production Method:</b> {{ record['RNA Production Method'] }}</p>
              <p><b>Target Gene Name:</b> {{ record['Target Gene Name'] }}</p>
              <p><b>Gene Function:</b> {{ record['Gene Function'] }}</p>
              <p><b>Gene ID:</b> {{ record['Gene ID'] }}</p>
              <p>
                <b>Mechanism of Pesticide / Biochemical Process:</b>
                {{ record['Mechanism of Pesticide/Biochemical Process'] }}
              </p>
              <p><b>Delivery Material:</b> {{ record['Delivery Material'] }}</p>
              <p><b>Experimental Plants:</b> {{ record['Experimental Plants'] }}</p>
              <p><b>Experimental Environment:</b> {{ record['Experimental Environment'] }}</p>
              <p><b>Optimal Concentration:</b> {{ record['Optimal Concentration'] }}</p>
              <p><b>LC50:</b> {{ record['LC50'] }}</p>
              <p><b>Time to Onset:</b> {{ record['Time to Onset'] }}</p>
              <p><b>Duration of Efficacy:</b> {{ record['Duration of Efficacy'] }}</p>
              <p>
                <b>Stability:</b>
                {{ record['Stability（Chemical Stability、Environmental Stability、Half-Life）'] }}
              </p>
              <p><b>Effect:</b> {{ record['Effect'] }}</p>
              <p>
                <b>Efficiency（Low：＜40%；Medium：40%-80%；High：＞80%）:</b>
                {{ record['Efficiency（Low：＜40%；Medium：40%-80%；High：＞80%）'] }}
              </p>
              <p><b>Reference PMID:</b> {{ record['Reference PMID'] }}</p>
              <p>
                <b>Notes (Supplementary Information):</b>
                {{ record['Notes（Supplementary Information）'] }}
              </p> -->
              <!-- 新增：跳转到新窗口查看所有字段 -->
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
import { allColumns, selectedColumns, DataType } from './Vigscolumn.js'
import { sortData } from '../../utils/sort.js'
import { pagination } from '../../utils/table'

import en from '@shene/table/dist/locale/en'
const locale = ref(en)

export default defineComponent({
  name: 'VIGS',
  components: {
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
    } = useTableData<DataType>('data/VIGS.csv', (data) =>
      processCSVData(data, [
        'Codon for readthrough',
        'Noncanonical charged amino acids',
        'Readthrough mechanism',
      ]),
    )

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

    const displayedColumns = computed(() =>
      allColumns.filter((c) => selectedColumns.value.includes(c.key as string)),
    )

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

    function onSorterChange(params: any) {
      let sorter = Array.isArray(params) ? params[0] : params
      loading.value = true
      setTimeout(() => {
        sortedDataSource.value = sortData(originalFilteredDataSource.value, sorter)
        loading.value = false
      }, 300)
    }

    function showLightbox(pictureid: string) {
      const imgUrl = `https://minio.lumoxuan.cn/ensure/picture/${pictureid}.png`
      lightboxImgs.value = [imgUrl]
      lightboxKey.value += 1
      visible.value = true
    }
    function hideLightbox() {
      visible.value = false
    }

    // —— 新增：在新窗口展示完整 record —— //
    function openDetailPage(record: DataType) {
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
.custom-tag-styles {
  margin-top: 20px;
}
</style>
