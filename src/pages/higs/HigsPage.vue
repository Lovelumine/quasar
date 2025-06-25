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

  <!-- 新增HIGS介绍卡片 -->
   <div class="container">
      <div class="q-pa-md row items-start q-gutter-md">
        <q-card class="card">
          <q-card-section section class="bg-primary text-white">
            <div class="text-h5">HIGS</div>
          </q-card-section>
        </q-card>

        <q-separator />

        <q-card-section horizontal>
          <

          <q-card-section class="col-5 flex flex-center">
          <q-img
            class="rounded-borders"
            src="https://cdn.quasar.dev/img/parallax2.jpg"
          />
          </q-card-section>
        </q-card-section>


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
          keys:['Transgenic Plant','Plant Taxonomy ID','Transgenic Site','Transformation Method','Expression System Vector']
        },
        {
          title:'Target Pest',
          keys:['Target Pest','Pest Taxonomy ID','Target Pest Order','Pest Developmental Stage']
        },
        {
          title:'dsRNA',
          keys:['RNA Length (nt)','RNA Sequence','RNA Type','RNA Production Method']
        },
        {
          title:'Target Gene',
          keys:['Target Gene Name','Gene Type Gene ID','Gene Function/Role']
        },
        {
          title:'RNAi Effect',
          keys:['Time to Onset','Effect','Efficiency','Experimental Result']
        },
        {
          title:'Other',
          keys:['Reference PMID','Notes']
        }
      ]
      const Grouprows = groups.map(group =>{
        const rows = group.keys
          .filter(key => record[key] !== undefined)
          .map(key =>
            <tr>
              <td class="label">${key}:</td>
              <td>${record[key]}</td>
            </tr>
          )
          .join('\n');

          return rows ?
          <div class="section">
            <h2>${group.title}</h2>
            <table>
              <tbody>
                ${rows}
              </tbody>
            </table>
          </div>
          :'';
      }).join('\n');

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
            .label {
            background-color: #f8f9fa;
            font-weight: 600;
            color: #2c3e50;
            width: 30%;
          }
          .section-A h2 { color: #e74c3c; border-color: #e74c3c; }
          .section-B h2 { color: #3498db; border-color: #3498db; }
          .section-C h2 { color: #2ecc71; border-color: #2ecc71; }
          .section-D h2 { color: #f39c12; border-color: #f39c12; }
          .section-E h2 { color: #9b59b6; border-color: #9b59b6; }
          .footer {
            text-align: center;
            margin-top: 40px;
            color: #7f8c8d;
            font-size: 0.9em;
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
            ${Grouprows}
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

/* HIGS 介绍卡片 */
.card{
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0);
  background:white;
  transition: all 0.4s cubic-bezier(0.175,0.885,0.32,1.275);
}

.container{
  max-width: 1000px;
  width: 100%;
  margin: 0 auto;
}

.header{
  text-align:left;
  margin-bottom:40px;
}
</style>
