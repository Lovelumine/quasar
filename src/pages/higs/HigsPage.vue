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
          <template #bodyCell="{ text, column, record }">
            <template v-if="column.key === 'Species'">
              <em>{{ text }}</em>
            </template>
            <template v-else-if="column.key === 'Structure of sup-tRNA'">
              <el-image
                style="width: 100px; height: 100px"
                :src="text"
                :preview-src-list="[text]"
                fit="cover"
              />
            </template>
            <template v-else-if="column.key === 'Codon for readthrough'">
              <ElSpace>
                <ElTag
                  v-for="items in Array.isArray(record['Codon for readthrough'])
                    ? record['Codon for readthrough']
                    : record['Codon for readthrough'].split(';').map((str) => str.trim())"
                  :key="items"
                  :type="getTagType(items)"
                >
                  {{ items }}
                </ElTag>
              </ElSpace>
            </template>
            <template v-else-if="column.key === 'Noncanonical charged amino acids'">
              <ElSpace>
                <ElTag
                  v-for="items in Array.isArray(record['Noncanonical charged amino acids'])
                    ? record['Noncanonical charged amino acids']
                    : record['Noncanonical charged amino acids']
                        .split(';')
                        .map((str) => str.trim())"
                  :key="items"
                  :type="getTagType(items)"
                >
                  {{ items }}
                </ElTag>
              </ElSpace>
            </template>
            <template v-else-if="column.key === 'Readthrough mechanism'">
              <ElSpace>
                <ElTag
                  v-for="items in Array.isArray(record['Readthrough mechanism'])
                    ? record['Readthrough mechanism']
                    : record['Readthrough mechanism'].split(';').map((str) => str.trim())"
                  :key="items"
                  :type="getTagType(items)"
                >
                  {{ items }}
                </ElTag>
              </ElSpace>
            </template>
            <template v-else-if="column.key === 'PMID of references'">
              <ElSpace>
                <span
                  v-for="(pmid, index) in getPmidList(record['PMID of references'])"
                  :key="index"
                >
                  <a
                    :href="'https://pubmed.ncbi.nlm.nih.gov/' + pmid.trim()"
                    target="_blank"
                    class="bracket-links"
                    >{{ pmid.trim() }}</a
                  >
                  <span v-if="index < getPmidList(record['PMID of references']).length - 1"
                    >,
                  </span>
                </span>
              </ElSpace>
            </template>
            <template v-else>
              <span>{{ text }}</span>
            </template>
          </template>

          <template #expandedRowRender="{ record }">
            <div>
              <p>
                <b>Species:</b> <em>{{ record.Species }}</em>
              </p>
              <p><b>Species ID:</b> {{ record['Species ID'] }}</p>
              <p><b>Tissue/Organelle of Origin:</b> {{ record['Tissue/Organelle of Origin'] }}</p>
              <p><b>Anticodon before mutation:</b> {{ record['Anticodon before mutation'] }}</p>
              <p><b>Anticodon after mutation:</b> {{ record['Anticodon after mutation'] }}</p>
              <p>
                <b>Codon for readthrough:</b>
                <ElSpace>
                  <ElTag
                    v-for="items in Array.isArray(record['Codon for readthrough'])
                      ? record['Codon for readthrough']
                      : record['Codon for readthrough'].split(';').map((str) => str.trim())"
                    :key="items"
                    :type="getTagType(items)"
                  >
                    {{ items }}
                  </ElTag>
                </ElSpace>
              </p>
              <p>
                <b>Noncanonical charged amino acids:</b>
                <ElSpace>
                  <ElTag
                    v-for="items in Array.isArray(record['Noncanonical charged amino acids'])
                      ? record['Noncanonical charged amino acids']
                      : record['Noncanonical charged amino acids']
                          .split(';')
                          .map((str) => str.trim())"
                    :key="items"
                    :type="getTagType(items)"
                  >
                    {{ items }}
                  </ElTag>
                </ElSpace>
              </p>
              <p>
                <b>tRNA sequence before mutation:</b> {{ record['tRNA sequence before mutation'] }}
              </p>
              <p>
                <b>tRNA sequence after mutation:</b>
                <span v-html="highlightMutation(record['tRNA sequence after mutation'])"></span>
              </p>

              <div>
                <b>Structure of sup-tRNA:</b>
                <img
                  :src="`https://minio.lumoxuan.cn/ensure/picture/${record.pictureid}.png`"
                  @click="showLightbox(record.pictureid)"
                  style="width: 100px; cursor: pointer"
                />
              </div>
              <p>
                <b>Readthrough mechanism:</b>
                <ElSpace>
                  <ElTag
                    v-for="items in Array.isArray(record['Readthrough mechanism'])
                      ? record['Readthrough mechanism']
                      : record['Readthrough mechanism'].split(';').map((str) => str.trim())"
                    :key="items"
                    :type="getTagType(items)"
                  >
                    {{ items }}
                  </ElTag>
                </ElSpace>
              </p>
              <p>
                <b>Mutational position of sup-tRNA:</b>
                {{ record['Mutational position of sup-tRNA'] }}
              </p>
              <p>
                <b>PMID of references:</b>
                <span
                  v-for="(pmid, index) in getPmidList(record['PMID of references'])"
                  :key="index"
                >
                  <a
                    :href="'https://pubmed.ncbi.nlm.nih.gov/' + pmid.trim()"
                    target="_blank"
                    class="tilt-hover"
                    >{{ pmid.trim() }}</a
                  >
                  <span v-if="index < getPmidList(record['PMID of references']).length - 1"
                    >,
                  </span>
                </span>
              </p>
              <p v-if="record.Notes">
                <b>Notes:</b>
                <img
                  :src="`https://minio.lumoxuan.cn/ensure/picture/${record.Notes}.png`"
                  @click="showLightbox(record.Notes)"
                  style="width: 100px; cursor: pointer"
                />
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
import { ElImage, ElSelect, ElOption } from 'element-plus'
import { useTableData } from '../../utils/useTableData.js'
import VueEasyLightbox from 'vue-easy-lightbox'
import { highlightMutation } from '../../utils/highlightMutation.js'
import { getTagType } from '../../utils/tag.js'
import { processCSVData } from '../../utils/processCSVData.js'
import { allColumns, selectedColumns } from './Higscolumns.js'
import { sortData } from '../../utils/sort.js'
import { pagination } from '../../utils/table'

type DataType = {
  [key: string]: string | string[]
  key: string
  Species: string
  'Anticodon before mutation': string
  'Anticodon after mutation': string
  'Codon for readthrough': string[]
  'Noncanonical charged amino acids': string[]
  tRNA_sequence_before_mutation: string
  tRNA_sequence_after_mutation: string
  'Structure of sup-tRNA': string
  'Readthrough mechanism': string
  'Mutational position of sup-tRNA': string
  PMID: string
  pictureid: string
}

import en from '@shene/table/dist/locale/en'
const locale = ref(en)

export default defineComponent({
  name: 'NaturalSupTRNA',
  components: {
    ElImage,
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
    } = useTableData<DataType>(
      'https://minio.lumoxuan.cn/ensure/Frameshift sup-tRNA.csv',
      (data) => {
        return processCSVData(data, [
          'Codon for readthrough',
          'Noncanonical charged amino acids',
          'Readthrough mechanism',
        ])
      },
    )

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
