<template>
  <div class="detail-page" v-if="record">
    <h1>VIGS Record Details</h1>
    <table class="detail-table">
      <tr v-for="(value, field) in record" :key="field">
        <th>{{ field }}</th>
        <td>{{ value }}</td>
      </tr>
    </table>
    <el-button type="primary" @click="$router.back()">Back</el-button>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useTableData } from '../../utils/useTableData.js'
import { processCSVData } from '../../utils/processCSVData.js'
import type { DataType } from './Vigscolumn.js'

export default defineComponent({
  name: 'VigsDetail',
  setup() {
    const route = useRoute()
    const key = route.params.key as string

    // 加载 CSV
    const { filteredDataSource, loadData } = useTableData<DataType>('/data/VIGS.csv', (data) =>
      processCSVData(data, [
        'Codon for readthrough',
        'Noncanonical charged amino acids',
        'Readthrough mechanism',
      ]),
    )

    // 一定要在 mounted 时调用它
    onMounted(async () => {
      await loadData()
    })

    // 找到对应记录
    const record = computed(() => filteredDataSource.value.find((r) => r.key === key) || null)

    return { record }
  },
})
</script>

<style scoped>
.detail-page {
  padding: 20px;
}
.detail-table {
  width: 100%;
  border-collapse: collapse;
}
.detail-table th,
.detail-table td {
  border: 1px solid #ddd;
  padding: 8px;
}
.detail-table th {
  background: #f5f5f5;
  text-align: left;
}
</style>
