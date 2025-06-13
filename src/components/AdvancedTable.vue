<template>
  <div class="q-pa-md">
    <q-table
      :rows="filteredData"
      :columns="columns"
      row-key="id"
      title="VIGS 数据表"
      :pagination="{ rowsPerPage: 10 }"
      dense
    >
      <!-- 顶部工具栏 -->
      <template v-slot:top>
        <div class="text-h6">VIGS 数据表</div>
        <q-space />
        <q-btn
          color="primary"
          icon="refresh"
          label="刷新数据"
          @click="loadExcelData"
          class="q-ml-md"
        />
        <q-btn
          color="negative"
          icon="clear"
          label="清除筛选"
          @click="clearFilters"
          class="q-ml-md"
        />
        <q-input
          v-model="searchQuery"
          dense
          debounce="300"
          placeholder="搜索..."
          class="q-ml-md"
          style="width: 200px"
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>

      <!-- 列筛选器 -->
      <template v-slot:header="props">
        <q-tr :props="props">
          <q-th v-for="col in props.cols" :key="col.name" :props="props">
            {{ col.label }}
            <!-- 筛选器 -->
            <q-select
              v-if="col.filterable"
              v-model="filters[col.name]"
              :options="getUniqueValues(col.name)"
              dense
              borderless
              emit-value
              map-options
              option-value="value"
              option-label="label"
              style="width: 100%"
            />
          </q-th>
        </q-tr>
      </template>

      <!-- 无数据时的提示 -->
      <template v-slot:no-data>
        <div class="full-width row flex-center q-gutter-sm">
          <q-icon name="warning" color="warning" size="2em" />
          <span>没有找到匹配的数据</span>
        </div>
      </template>
    </q-table>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import * as XLSX from 'xlsx';

// 表格列定义 (根据你的 Excel 文件表头调整)
const columns = [
  { name: 'virusName', label: 'Virus Name', field: 'virusName', align: 'left', filterable: true },
  {
    name: 'virusTaxonomyID',
    label: 'Temporarily Omitted (Virus Taxonomy ID)',
    field: 'virusTaxonomyID',
    align: 'left',
    filterable: true,
  },
  {
    name: 'virusEngineeredMethods',
    label: 'Virus Engineered Methods',
    field: 'virusEngineeredMethods',
    align: 'left',
    filterable: true,
  },
  {
    name: 'targetPestName',
    label: 'Target Pest Name',
    field: 'targetPestName',
    align: 'left',
    filterable: true,
  },
  {
    name: 'pestTaxonomyID',
    label: 'Temporarily Omitted (Pest Taxonomy ID)',
    field: 'pestTaxonomyID',
    align: 'left',
    filterable: true,
  },
  {
    name: 'pestOrder',
    label: 'Target Pest Order',
    field: 'pestOrder',
    align: 'left',
    filterable: true,
  },
  {
    name: 'developmentalStage',
    label: 'Pest Developmental Stage',
    field: 'developmentalStage',
    align: 'center',
    filterable: true,
  },
  {
    name: 'rnaLength',
    label: 'RNA Length (nt)',
    field: 'rnaLength',
    align: 'center',
    filterable: true,
  },
  {
    name: 'rnaSequence',
    label: 'RNA Sequence',
    field: 'rnaSequence',
    align: 'center',
    filterable: true,
  },
  {
    name: 'dnaLength',
    label: 'DNA length (bp)',
    field: 'dnaLength',
    align: 'center',
    filterable: true,
  },
  {
    name: 'dnaSequence',
    label: 'DNA Sequence',
    field: 'dnaSequence',
    align: 'center',
    filterable: true,
  },
  { name: 'rnaType', label: 'RNA Type', field: 'rnaType', align: 'center', filterable: true },
  {
    name: 'rnaProductionMethod',
    label: 'RNA Production Method',
    field: 'rnaProductionMethod',
    align: 'center',
    filterable: true,
  },
  {
    name: 'targetGeneName',
    label: 'Target Gene Name',
    field: 'targetGeneName',
    align: 'center',
    filterable: true,
  },
  {
    name: 'geneFunction',
    label: 'Gene Function',
    field: 'geneFunction',
    align: 'center',
    filterable: true,
  },
  { name: 'geneID', label: 'Gene ID', field: 'geneID', align: 'center', filterable: true },
  {
    name: 'mechanism',
    label: 'Mechanism of Pesticide/Biochemical Process',
    field: 'mechanism',
    align: 'center',
    filterable: true,
  },
  {
    name: 'deliveryMaterial',
    label: 'Delivery Material',
    field: 'deliveryMaterial',
    align: 'center',
    filterable: true,
  },
  {
    name: 'experimentalPlants',
    label: 'Experimental Plants',
    field: 'experimentalPlants',
    align: 'center',
    filterable: true,
  },
  {
    name: 'experimentalEnvironment',
    label: 'Experimental Environment',
    field: 'experimentalEnvironment',
    align: 'center',
    filterable: true,
  },
  {
    name: 'optimalConcentration',
    label: 'Optimal Concentration',
    field: 'optimalConcentration',
    align: 'center',
    filterable: true,
  },
  { name: 'lc50', label: 'LC50', field: 'lc50', align: 'center', filterable: true },
  {
    name: 'timeToOnset',
    label: 'Time to Onset',
    field: 'timeToOnset',
    align: 'center',
    filterable: true,
  },
  {
    name: 'durationOfEfficacy',
    label: 'Duration of Efficacy',
    field: 'durationOfEfficacy',
    align: 'center',
    filterable: true,
  },
  { name: 'stability', label: 'Stability', field: 'stability', align: 'center', filterable: true },
  { name: 'effect', label: 'Effect', field: 'effect', align: 'center', filterable: true },
  {
    name: 'efficiencylmh',
    label: 'Efficiency (Low:<40%;Medium:40%-80%;High:>80%)',
    field: 'efficiencylmh',
    align: 'center',
    filterable: true,
  },
  {
    name: 'efficiency',
    label: 'Efficiency',
    field: 'efficiency',
    align: 'center',
    filterable: true,
  },
  {
    name: 'safetyProfile',
    label: 'Safety Profile/Off-target Probability',
    field: 'safetyProfile',
    align: 'center',
    filterable: true,
  },
  {
    name: 'nonTargetSpecies',
    label: 'Non-target Species',
    field: 'nonTargetSpecies',
    align: 'center',
    filterable: true,
  },
  {
    name: 'referencePMID',
    label: 'Reference PMID',
    field: 'referencePMID',
    align: 'center',
    filterable: true,
  },
  {
    name: 'notes',
    label: 'Notes (Supplementary Information)',
    field: 'notes',
    align: 'center',
    filterable: true,
  },
];

// 表格数据
const tableData = ref([]);
const searchQuery = ref('');
const filters = ref({});

// 加载 Excel 数据
const loadExcelData = async () => {
  try {
    // 1. 获取 Excel 文件 (假设文件放在 public 目录下)
    const response = await fetch('/RNA农药-数据库（提供给代码组.xlsx');
    const arrayBuffer = await response.arrayBuffer();

    // 2. 解析 Excel 文件
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });

    // 3. 获取第一个工作表
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];

    // 4. 转换为 JSON
    const jsonData = XLSX.utils.sheet_to_json(worksheet);

    // 5. 处理数据并添加 ID
    tableData.value = jsonData.map((row, index) => {
      return {
        id: index + 1,
        virusName: row['Virus Name'] || '',
        virusTaxonomyID: row['Temporarily Omitted （Virus Taxonomy ID）'] || '',
        virusEngineeredMethods: row['Virus Engineered Methods'] || '',
        targetPestName: row['Target Pest Name'] || '',
        pestTaxonomyID: row['Temporarily Omitted （Pest Taxonomy ID）'] || '',
        pestOrder: row['Target Pest Order'] || '',
        developmentalStage: row['Pest Developmental Stage'] || '',
        rnaLength: row['RNA Length (nt)'] || '',
        rnaSequence: row['RNA Sequence'] || '',
        dnaLength: row['DNA length（bp）'] || '',
        dnaSequence: row['DNA Sequence'] || '',
        rnaType: row['RNA Type'] || '',
        rnaProductionMethod: row['RNA Production Method'] || '',
        targetGeneName: row['Target Gene Name'] || '',
        geneFunction: row['Gene Function'] || '',
        geneID: row['Gene ID'] || '',
        mechanism: row['​​Mechanism of Pesticide/Biochemical Process'] || '',
        deliveryMaterial: row['Delivery Material'] || '',
        experimentalPlants: row['Experimental Plants'] || '',
        experimentalEnvironment: row['Experimental Environment'] || '',
        optimalConcentration: row['Optimal Concentration'] || '',
        lc50: row['LC50'] || '',
        timeToOnset: row['Time to Onset'] || '',
        durationOfEfficacy: row['Duration of Efficacy'] || '',
        stability: row['Stability（Chemical Stability、Environmental Stability、Half-Life）'] || '',
        effect: row['Effect'] || '',
        efficiencylmh: row['Efficiency（Low：＜40%；Medium：40%-80%；High：＞80%）'] || '',
        efficiency: row['Efficiency'] || '',
        safetyProfile: row['Safety Profile/Off-target Probability'] || '',
        nonTargetSpecies: row['Non-target Species'] || '',
        referencePMID: row['Reference PMID'] || '',
        notes: row['Notes (Supplementary Information)'] || '',
      };
    });

    console.log('Excel 数据加载成功', tableData.value);
  } catch (error) {
    console.error('加载 Excel 数据失败:', error);
    // 使用静态数据作为后备
    tableData.value = [
      // 静态示例数据
    ];
  }
};

// 过滤后的数据
const filteredData = computed(() => {
  let result = tableData.value;

  // 搜索
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter((row) => {
      return Object.values(row).some((value) => String(value).toLowerCase().includes(query));
    });
  }

  // 列筛选
  for (const [key, value] of Object.entries(filters.value)) {
    if (value) {
      result = result.filter((row) => row[key] === value);
    }
  }

  return result;
});

// 获取某列的唯一值用于筛选器
const getUniqueValues = (fieldName) => {
  const values = tableData.value.map((row) => row[fieldName]).filter((value) => value);
  const uniqueValues = [...new Set(values)];
  return uniqueValues.map((value) => ({ label: value, value }));
};

// 清除筛选条件
const clearFilters = () => {
  filters.value = {};
  searchQuery.value = '';
};

// 初始化时加载数据
onMounted(() => {
  loadExcelData();
});
</script>

<style scoped>
/* 自定义表格样式 */
.q-table__title {
  font-size: 1.5rem;
  font-weight: bold;
  color: #1976d2;
}

/* 增加行高 */
.q-table tbody tr {
  height: 60px;
}

/* 表头样式 */
.q-table thead tr {
  background-color: #f5f5f5;
  font-weight: bold;
}

/* 表格容器样式 */
.q-pa-md {
  min-height: 500px;
}
</style>

