<!-- src/pages/MigsAndVigs/VigsDetail.vue -->
<template>
  <div class="detail-page" v-if="record">
    <h1 class="page-title">VIGS Record Details</h1>

    <div v-for="section in sections" :key="section.title" class="section-card">
      <h2 class="section-title">{{ section.title }}</h2>
      <table class="detail-table">
        <tbody>
          <tr v-for="field in section.fields" :key="field.key">
            <th>{{ field.label }}</th>
            <td>
              <!-- 链接类型 -->
              <template v-if="field.type === 'link' && record[field.key]">
                <a
                  :href="field.prefix + record[field.key]"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {{ record[field.key] }}
                </a>
              </template>
              <!-- 默认文本 -->
              <template v-else>
                {{
                  record[field.key] != null && record[field.key] !== '' ? record[field.key] : '—'
                }}
              </template>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <el-button type="primary" @click="$router.back()" class="back-button"> ← Back </el-button>
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

    const { filteredDataSource, loadData } = useTableData<DataType>('/data/VIGS.csv', (data) =>
      processCSVData(data, [
        'Codon for readthrough',
        'Noncanonical charged amino acids',
        'Readthrough mechanism',
      ]),
    )

    onMounted(async () => {
      await loadData()
    })

    const record = computed(
      () => filteredDataSource.value.find((r) => r.key === key) || ({} as DataType),
    )

    // 每个 section 里 fields 用对象，支持自定义 label、type、prefix 等
    const sections = [
      {
        title: 'Virus Information',
        fields: [
          { key: 'Virus', label: 'Virus Name' },
          { key: 'Virus Taxonomy ID', label: 'Taxonomy ID' },
        ],
      },
      {
        title: 'Target Pest',
        fields: [
          { key: 'Target Pest', label: 'Pest Name' },
          { key: 'Pest Taxonomy ID', label: 'Pest Taxonomy ID' },
          { key: 'Target Pest Order', label: 'Pest Order' },
          { key: 'Pest Developmental Stage', label: 'Developmental Stage' },
        ],
      },
      {
        title: 'dsRNA',
        fields: [
          { key: 'RNA Length (nt)', label: 'RNA Length (nt)' },
          { key: 'RNA Sequence', label: 'RNA Sequence' },
          { key: 'RNA Type', label: 'RNA Type' },
          { key: 'RNA Production Method', label: 'Production Method' },
        ],
      },
      {
        title: 'Target Gene',
        fields: [
          { key: 'Target Gene Name', label: 'Gene Name' },
          { key: 'Gene Function', label: 'Function / Role' },
          { key: 'Gene ID', label: 'Gene ID' },
        ],
      },
      {
        title: 'Experimental Conditions',
        fields: [
          { key: 'Delivery Material', label: 'Delivery Material' },
          { key: 'Experimental Environment', label: 'Environment' },
          { key: 'Time to Onset', label: 'Time to Onset' },
          { key: 'Duration of Efficacy', label: 'Duration of Efficacy' },
        ],
      },
      {
        title: 'RNAi Effect',
        fields: [
          { key: 'Effect', label: 'Observed Effect' },
          {
            key: 'Efficiency（Low：＜40%；Medium：40%-80%；High：＞80%）',
            label: 'Efficiency',
          },
        ],
      },
      {
        title: 'Other',
        fields: [
          {
            key: 'Reference PMID',
            label: 'PubMed ID',
            type: 'link',
            prefix: 'https://pubmed.ncbi.nlm.nih.gov/',
          },
          {
            key: 'Notes（Supplementary Information）',
            label: 'Notes',
          },
        ],
      },
    ]

    return {
      record,
      sections,
    }
  },
})
</script>

<style scoped>
.detail-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 24px;
}

.page-title {
  font-size: 2rem;
  text-align: center;
  margin-bottom: 1.5rem;
}

.section-card {
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.section-title {
  font-size: 1.25rem;
  margin-bottom: 0.75rem;
  color: #333;
  border-bottom: 1px solid #ddd;
  padding-bottom: 4px;
}

.detail-table {
  width: 100%;
  border-collapse: collapse;
}

.detail-table th,
.detail-table td {
  padding: 8px 12px;
  border-bottom: 1px solid #f0f0f0;
}

.detail-table th {
  width: 30%;
  background-color: #fafafa;
  font-weight: 600;
  text-align: left;
}

.detail-table tr:last-child td {
  border-bottom: none;
}

.back-button {
  display: block;
  margin: 2rem auto 0;
}
</style>
