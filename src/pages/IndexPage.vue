<template>
  <div class="q-pa-md" style="max-width: 900px">
    <q-card>
      <q-tabs
        v-model="tab"
        dense
        class="text-grey"
        active-color="primary"
        indicator-color="primary"
        align="justify"
      >
        <q-tab name="home" label="Home" />
        <q-tab name="sigs" label="Sigs" />
        <q-tab name="higs" label="Higs" />
        <q-tab name="migs" label="Migs" />
        <q-tab name="potential target genes" label="Potential target genes" />
        <q-tab name="other" label="Other" />
      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="home" class="q-pa-none">
          <q-splitter
            v-model="splitterModel"
            style="height: 250px"
          >
            <template v-slot:before>
              <q-tabs
                v-model="innerTab"
                vertical
                class="text-teal"
              >
                <q-tab name="innerHome" icon="home" label="Home" />
                <q-tab name="innerHelp" icon="help" label="Help" />
                <q-tab name="innerAbout" icon="about" label="About" />
              </q-tabs>
            </template>

            <template v-slot:after>
              <q-tab-panels
                v-model="innerTab"
                animated
                transition-prev="slide-down"
                transition-next="slide-up"
              >
                <q-tab-panel name="innerHome">
                  <div class="text-h4 q-mb-md">Introduction</div>
                  <p>Establish the first comprehensive database focussing on RNAi pesticides, comprehensively record all kinds of information of RNA pesticides based on the principle of RNAi, solve the current research data fragmentation problem, create a systematic and structured knowledge base, and use it for subsequent AI tool development training sets, and finally realise the purpose of automated design of efficient dsRNA sequences.</p>
                </q-tab-panel>

                <q-tab-panel name="innerAlarms">
                  <div class="text-h4 q-mb-md">Alarms</div>
                  <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis praesentium cumque magnam odio iure quidem, quod illum numquam possimus obcaecati commodi minima assumenda consectetur culpa fuga nulla ullam. In, libero.</p>
                  <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis praesentium cumque magnam odio iure quidem, quod illum numquam possimus obcaecati commodi minima assumenda consectetur culpa fuga nulla ullam. In, libero.</p>
                </q-tab-panel>

                <q-tab-panel name="innerMovies">
                  <div class="text-h4 q-mb-md">Movies</div>
                  <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis praesentium cumque magnam odio iure quidem, quod illum numquam possimus obcaecati commodi minima assumenda consectetur culpa fuga nulla ullam. In, libero.</p>
                  <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis praesentium cumque magnam odio iure quidem, quod illum numquam possimus obcaecati commodi minima assumenda consectetur culpa fuga nulla ullam. In, libero.</p>
                  <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis praesentium cumque magnam odio iure quidem, quod illum numquam possimus obcaecati commodi minima assumenda consectetur culpa fuga nulla ullam. In, libero.</p>
                </q-tab-panel>
              </q-tab-panels>
            </template>
          </q-splitter>
        </q-tab-panel>

        <!-- SIGS 标签页 - 嵌入表格 -->
        <q-tab-panel name="sigs">
          <div class="q-pa-md">
            <q-table
              title="SIGS"
              :rows="rows"
              :columns="columns"
              row-key="name"
              :sort-method="customSort"
              binary-state-sort
            />
          </div>
        </q-tab-panel>

        <!-- 其他标签页保持不变 -->
        <q-tab-panel name="higs">
          <div class="text-h6">Movies</div>
          Lorem ipsum dolor sit amet consectetur adipisicing elit.
        </q-tab-panel>

        <q-tab-panel name="migs">
          <div class="text-h6">Information</div>
          Lorem ipsum dolor sit amet consectetur adipisicing elit.
        </q-tab-panel>

        <q-tab-panel name="potential target genes">
          <div class="text-h6">Movies</div>
          Lorem ipsum dolor sit amet consectetur adipisicing elit.
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
  </div>
</template>

<script>
import { ref } from 'vue'

// 表格列定义
const columns = [
  {
    name: 'name',
    required: true,
    label: 'Target Pest Name',
    align: 'left',
    field: row => row.name,
    format: val => `${val}`,
    sortable: true
  },
  { name: 'target', align: 'center', label: 'Target Pest Order', field: 'target', sortable: true },
  { name: 'stage', label: 'Pest Developmental Stage', field: 'stage', sortable: true },
  { name: 'length', label: 'RNA Length (nt)', field: 'length' },
  { name: 'sequence', label: 'RNA Sequence', field: 'sequence' },
  { name: 'type', label: 'RNA Type', field: 'type' },
  { name: 'method', label: 'RNA Production Method', field: 'method', sortable: true, sort: (a, b) => parseInt(a, 10) - parseInt(b, 10) },
  { name: 'gene', label: 'Target Gene Name', field: 'gene', sortable: true, sort: (a, b) => parseInt(a, 10) - parseInt(b, 10) }
]

// 表格行数据
const rows = [
  {
    name: 'Brassicogethes aeneus',
    target: 'Coleoptera',
    stage: 'Larva',
    length: 'N/A',
    sequence: 'N/A',
    type: 'dsRNA',
    method: '14%',
    gene: '1%'
  },
  {
    name: 'Myzus persicae',
    target: 'Hemiptera',
    stage: 'Nymph and adult',
    length: '21nt',
    sequence: 'AUUUGGAAAAGGAACCAAAGA',
    type: 'miRNA',
    method: '8%',
    gene: '1%'
  },
  {
    name: 'Myzus persicae',
    target: 'Hemiptera',
    stage: 'Nymph and adult',
    length: '21nt',
    sequence: 'AUUUGGAAAAGGAACCAAAGA',
    type: 'miRNA',
    method: '6%',
    gene: '7%'
  },
  {
    name: 'Myzus persicae',
    target: 'Hemiptera',
    stage: 'Nymph and adult',
    length: '21nt',
    sequence: 'CACUUUCGAUUUCAUUAAGAU',
    type: 'miRNA',
    method: '3%',
    gene: '8%'
  },
  {
    name: 'Myzus persicae',
    target: 'Coleoptera',
    stage: 'Nymph and adult',
    length: '21nt',
    sequence: 'CACUUUCGAUUUCAUUAAGAU',
    type: 'miRNA',
    method: '7%',
    gene: '16%'
  },
  {
    name: 'Phyllotreta striolata',
    target: 'Coleoptera',
    stage: 'Adult',
    length: '21nt',
    sequence: 'N/A',
    type: 'dsRNA',
    method: '0%',
    gene: '0%'
  },
  {
    name: 'Phyllotreta striolata',
    target: 'Coleoptera',
    stage: 'Adult',
    length: '21nt',
    sequence: 'N/A',
    type: 'dsRNA',
    method: '0%',
    gene: '2%'
  },
  {
    name: 'Leptinotarsa decemlineata',
    target: 'Coleoptera',
    stage:'Larva（2nd instar）',
    length: '21nt',
    sequence: 'AGGTGCGGCAGACTGTGTTTATTGGGACCGTGTACTGGCCAAACAATGTAGAATGTATGAATTAAGGAACAGGGAGCGTATTTCTGTAGCAGCTGCTTCCAAATTGATGGCAAACATGGTATACAATTACAAGGGAATGGGACTGTCAATGGGAATGATGTTAGCAGGATGGGATAAACAGCTGCTTCCAAATTGATGGCAAACATGGTATACAATTACAAGGGAATGGGACTGTCAATGGGAATGATGTTAGCAGGATGGGATAAATGGTGTCTTGGATTCCGGATACAAATGGGATTTGACGGATGAGGAGGCTTACGATTTGGGTCGCAGGGCGATTTACCATGCCACACACAGAGATGCCTACTCTGGAGGTATCGTGAGGGTTTATCACATGAAGGAGACTGGTTGGATACATATTGATAACAATGATTGTAATGATTTACATTATAAGTACCAGGCTGAGAAGGAAGATTTG',
    type: 'dsRNA',
    method: '0%',
    gene: '45%'
  },
  {
    name: 'Leptinotarsa decemlineata',
    target: 'Coleoptera',
    stage: 'Larva（2nd instar）',
    length: '21nt',
    sequence: 'AGGTGCGGCAGACTGTGTTTATTGGGACCGTGTACTGGCCAAACAATGTAGAATGTATGAATTAAGGAACAGGGAGCGTATTTCTGTAGCAGCTGCTTCCAAATTGATGGCAAACATGGTATACAATTACAAGGGAATGGGACTGTCAATGGGAATGATGTTAGCAGGATGGGATAAACAGCTGCTTCCAAATTGATGGCAAACATGGTATACAATTACAAGGGAATGGGACTGTCAATGGGAATGATGTTAGCAGGATGGGATAAATGGTGTCTTGGATTCCGGATACAAATGGGATTTGACGGATGAGGAGGCTTACGATTTGGGTCGCAGGGCGATTTACCATGCCACACACAGAGATGCCTACTCTGGAGGTATCGTGAGGGTTTATCACATGAAGGAGACTGGTTGGATACATATTGATAACAATGATTGTAATGATTTACATTATAAGTACCAGGCTGAGAAGGAAGATTTG',
    type: 'dsRNA',
    method: '2%',
    iron: '22%'
  },
  {
    name: 'Leptinotarsa decemlineata',
    target: 'Coleoptera',
    stage: 'Larva（2nd instar）',
    length: '21nt',
    sequence: 'AGGTGCGGCAGACTGTGTTTATTGGGACCGTGTACTGGCCAAACAATGTAGAATGTATGAATTAAGGAACAGGGAGCGTATTTCTGTAGCAGCTGCTTCCAAATTGATGGCAAACATGGTATACAATTACAAGGGAATGGGACTGTCAATGGGAATGATGTTAGCAGGATGGGATAAACAGCTGCTTCCAAATTGATGGCAAACATGGTATACAATTACAAGGGAATGGGACTGTCAATGGGAATGATGTTAGCAGGATGGGATAAATGGTGTCTTGGATTCCGGATACAAATGGGATTTGACGGATGAGGAGGCTTACGATTTGGGTCGCAGGGCGATTTACCATGCCACACACAGAGATGCCTACTCTGGAGGTATCGTGAGGGTTTATCACATGAAGGAGACTGGTTGGATACATATTGATAACAATGATTGTAATGATTTACATTATAAGTACCAGGCTGAGAAGGAAGATTTG',
    type: 'dsRNA',
    method: '12%',
    iron: '6%'
  }
]

export default {
  setup () {
    // 自定义排序方法
    const customSort = (rows, sortBy, descending) => {
      const data = [...rows]
      if (sortBy) {
        data.sort((a, b) => {
          const valueA = a[sortBy] !== null && a[sortBy] !== undefined ? String(a[sortBy]) : ''
          const valueB = b[sortBy] !== null && b[sortBy] !== undefined ? String(b[sortBy]) : ''
          const comparison = valueA.localeCompare(valueB)
          return descending ? -comparison : comparison
        })
      }
      return data
    }

    return {
      tab: ref('home'),
      innerTab: ref('innerHome'),
      splitterModel: ref(20),
      columns,
      rows,
      customSort
    }
  }
}
</script>
