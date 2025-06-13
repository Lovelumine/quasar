<template>
  <div class="q-pa-md">
    <!-- 全局搜索框 -->
    <div class="q-mb-md">
      <q-input
        v-model="globalFilter"
        placeholder="全字段搜索..."
        dense
        outlined
        clearable
      >
        <template #prepend>
          <q-icon name="search" />
        </template>
      </q-input>
    </div>

    <!-- 多字段筛选器 -->
    <div class="row q-gutter-sm q-mb-md">
      <q-select
        v-model="selectedFilters"
        :options="filterOptions"
        label="筛选字段"
        multiple
        dense
        outlined
        style="min-width: 150px"
      />
      <template v-for="filter in selectedFilters" :key="filter">
        <q-input
          v-model="filterValues[filter]"
          :label="`${filter} 筛选`"
          dense
          outlined
          clearable
        />
      </template>
    </div>

    <!-- 数据表格 -->
    <q-table
      :rows="filteredRows"
      :columns="columns"
      row-key="id"
      :pagination="pagination"
      :loading="loading"
      dense
      flat
      bordered
      class="my-sticky-table"
    >
      <!-- 展开行按钮 -->
      <template #body-cell-expand="props">
        <q-td :props="props">
          <q-btn
            size="sm"
            round
            :icon="props.expand ? 'remove' : 'add'"
            @click="props.expand = !props.expand"
          />
        </q-td>
      </template>

      <!-- 展开行详情 -->
      <template #body-cell-details="props">
        <q-td v-if="props.expand" :props="props" colspan="100%">
          <div class="q-pa-sm bg-blue-grey-1">
            <div
              v-for="(value, key) in props.row"
              :key="key"
              class="q-py-xs"
            >
              <strong>{{ key }}:</strong> {{ value }}
            </div>
          </div>
        </q-td>
      </template>

      <!-- 分页控制 -->
      <template #bottom>
        <div class="row items-center full-width">
          <div class="col-6">
            共 {{ filteredRows.length }} 条记录
          </div>
          <div class="col-6 text-right">
            <q-select
              v-model="pagination.rowsPerPage"
              :options="[10, 20, 50, 100]"
              label="每页条数"
              dense
              outlined
              style="width: 120px; display: inline-block"
            />
            <q-pagination
              v-model="pagination.page"
              :max="Math.ceil(filteredRows.length / pagination.rowsPerPage)"
              direction-links
              boundary-links
              flat
            />
          </div>
        </div>
      </template>
    </q-table>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import * as XLSX from 'xlsx'
// 按需引入 Quasar 组件
import {
  QInput,
  QIcon,
  QSelect,
  QBtn,
  QTable,
  QTd,
  QPagination
} from 'quasar'

export default {
  components: {
    QInput,
    QIcon,
    QSelect,
    QBtn,
    QTable,
    QTd,
    QPagination
  },
  setup() {
    const loading = ref(true)
    const excelData = ref([])
    const columns = ref([])
    const globalFilter = ref('')
    const selectedFilters = ref([])
    const filterValues = ref({})
    const filterOptions = ref([])
    const pagination = ref({
      sortBy: 'id',
      descending: false,
      page: 1,
      rowsPerPage: 20
    })

    async function loadExcelData() {
      try {
        loading.value = true
        const res = await fetch('/Potential.xlsx')
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`)
        }
        const buf = await res.arrayBuffer()
        const wb = XLSX.read(new Uint8Array(buf), { type: 'array' })
        const ws = wb.Sheets[wb.SheetNames[0]]
        const data = XLSX.utils.sheet_to_json(ws, { defval: '' })

        excelData.value = data

        if (data.length) {
          // 生成 columns
          const first = data[0]
          columns.value = [
            { name: 'expand', label: '详情', field: 'expand', align: 'center', sortable: false },
            ...Object.keys(first).map(key => ({
              name: key,
              label: key,
              field: key,
              align: 'left',
              sortable: true,
              headerClasses: 'sticky-column',
              headerStyle: { position: 'sticky', left: '0', zIndex: '1', background: 'white' }
            }))
          ]
          // 初始化 filters
          filterOptions.value = Object.keys(first)
          selectedFilters.value = filterOptions.value.slice(0, 4)
          selectedFilters.value.forEach(f => {
            filterValues.value[f] = ''
          })
        }
      } catch (e) {
        console.error('加载Excel文件失败:', e)
      } finally {
        loading.value = false
      }
    }

    const filteredRows = computed(() => {
      return excelData.value.filter(row => {
        // 全局搜索
        const g = globalFilter.value.toLowerCase()
        if (g && !Object.values(row).some(v => String(v).toLowerCase().includes(g))) {
          return false
        }
        // 多字段筛选
        for (const f of selectedFilters.value) {
          const v = filterValues.value[f]?.toLowerCase()
          if (v && !String(row[f]).toLowerCase().includes(v)) {
            return false
          }
        }
        return true
      })
    })

    onMounted(loadExcelData)

    return {
      loading,
      columns,
      globalFilter,
      selectedFilters,
      filterValues,
      filterOptions,
      filteredRows,
      pagination
    }
  }
}
</script>

<style lang="scss" scoped>
.my-sticky-table {
  .q-table__top {
    border-bottom: 1px solid #ddd;
  }
  .sticky-column {
    position: sticky;
    left: 0;
    z-index: 1;
    background: white;
  }
  .q-table__container {
    max-height: 70vh;
    overflow: auto;
  }
  .q-table th {
    position: sticky;
    top: 0;
    z-index: 2;
    background: white;
  }
  .q-table thead tr:first-child th {
    top: 0;
  }
}
</style>