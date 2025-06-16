<template>
  <div class="site--main">
    <h2>MIGS</h2>
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
          :stripe="false"
          :show-sorter-tooltip="true"
          :size="tableSize"
          :expand-row-by-click="false"
          @sorter-change="onSorterChange"
          :loading="loading"
          :pagination="pagination"
        >
          <template #expandedRowRender="{ record }">
            <div class="expanded-row">
              <p><b>Microbial Name:</b> {{ record['Microbial Name'] }}</p>
              <p><b>Microbe ID:</b> {{ record['Microbe ID'] }}</p>
              <p><b>Microbe Category:</b> {{ record['Microbe Category'] }}</p>
              <p><b>Microbe Engineered Methods:</b> {{ record['Microbe Engineered Methods'] }}</p>
              <p><b>Vector:</b> {{ record['Vector'] }}</p>
              <p><b>Yield:</b> {{ record['Yield'] }}</p>
              <p><b>Target Pest Name:</b> {{ record['Target Pest Name'] }}</p>
              <p><b>Pest Taxonomy ID:</b> {{ record['Pest Taxonomy ID'] }}</p>
              <p><b>Target Pest Order:</b> {{ record['Target Pest Order'] }}</p>
              <p><b>Pest Developmental Stage:</b> {{ record['Pest Developmental Stage'] }}</p>
              <p><b>RNA Length (nt):</b> {{ record['RNA Length (nt)'] }}</p>
              <p>
                <b>RNA Sequence:</b> <code>{{ record['RNA Sequence'] }}</code>
              </p>
              <p><b>DNA length (bp):</b> {{ record['DNA length（bp）'] }}</p>
              <p>
                <b>DNA Sequence:</b> <code>{{ record['DNA Sequence'] }}</code>
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
              <p><b>Application methods:</b> {{ record['Application methods'] }}</p>
              <p><b>Feeding Material:</b> {{ record['Feeding Material'] }}</p>
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
                <b>Efficiency:</b>
                {{ record['Efficiency（Low：＜40%；Medium：40%-80%；High：＞80%）'] }}
              </p>
              <p><b>Efficiency:</b>{{ record['Efficiency'] }}</p>
              <p><b>Reference PMID:</b> {{ record['Reference PMID'] }}</p>
              <p>
                <b>Notes (Supplementary Information):</b>
                {{ record['Notes（Supplementary Information）'] }}
              </p>
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
import { ElSelect, ElOption } from 'element-plus'
import { useTableData } from '../../utils/useTableData.js'
import VueEasyLightbox from 'vue-easy-lightbox'
import { highlightMutation } from '../../utils/highlightMutation.js'
import { getTagType } from '../../utils/tag.js'
import { processCSVData } from '../../utils/processCSVData.js'
import { allColumns, selectedColumns, DataType } from './Migscolumn.js'
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
    VueEasyLightbox,
  },
  setup() {
    const {
      searchText,
      filteredDataSource: originalFilteredDataSource,
      searchColumn,
      loadData,
    } = useTableData<DataType>('data/MIGS.csv', (data) => {
      return processCSVData(data, [
        'Codon for readthrough',
        'Noncanonical charged amino acids',
        'Readthrough mechanism',
      ])
    })

    const tableSize = ref('default')
    const loading = ref(false)
    const dataSource = ref<DataType[]>([])
    const sortedDataSource = ref<DataType[]>([])

    onMounted(async () => {
      await loadData()
      dataSource.value = originalFilteredDataSource.value
      sortedDataSource.value = originalFilteredDataSource.value
    })

    const visible = ref(false)
    const lightboxImgs = ref<string[]>([])
    const lightboxKey = ref(0)

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

    const getPmidList = (pmidString) => {
      return String(pmidString).split('、')
    }

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

    return {
      allColumns,
      displayedColumns,
      filteredDataSource,
      tableSize,
      searchText,
      searchColumn,
      locale,
      selectedColumns,
      highlightMutation,
      visible,
      lightboxKey,
      lightboxImgs,
      showLightbox,
      hideLightbox,
      getTagType, // 获取标签类型
      onSorterChange,
      getPmidList, // 添加getPmidList方法
      loading,
      pagination, // 分页配置
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
