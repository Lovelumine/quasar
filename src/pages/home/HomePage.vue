<template>
  <q-page class="column items-center">
    <!-- 搜索框部分 -->
    <div class="search-container q-pa-md" style="width: 80%; max-width: 800px">
      <q-input
        v-model="searchQuery"
        placeholder="Search across all database..."
        outlined
        dense
        class="q-mb-md"
        @keyup.enter="performSearch"
        :loading="isLoading"
      >
        <template v-slot:append>
          <q-icon name="search" @click="performSearch" class="cursor-pointer" />
        </template>
      </q-input>

      <!-- 样例展示 -->
      <div class="q-mb-md">
        <div class="text-caption text-grey">Try these examples:</div>
        <div class="row q-gutter-sm q-mt-xs">
          <q-chip
            v-for="(example, index) in searchExamples"
            :key="index"
            clickable
            @click="useExample(example)"
          >
            {{ example }}
          </q-chip>
        </div>
      </div>

      <!-- 搜索结果展示 -->
      <q-card v-if="searchResults.length > 0" class="full-width">
        <q-card-section>
          <div class="text-h6">Search Results ({{ searchResults.length }})</div>
          <q-separator class="q-my-sm" />
          <q-list bordered separator>
            <q-item v-for="(result, index) in searchResults" :key="index" class="q-pa-md">
              <q-item-section>
                <!-- 核心字段展示 -->
                <div class="row items-center q-gutter-sm">
                  <q-chip outline color="primary" icon="mdi-bug">
                    <strong>Pest:</strong> {{ result['Target Pest Name'] || 'N/A' }}
                  </q-chip>
                  <q-chip outline color="teal" icon="mdi-dna">
                    <strong>Gene:</strong> {{ result['Target Gene Name'] || 'N/A' }}
                  </q-chip>
                </div>

                <!-- RNA序列展示（折叠式） -->
                <q-expansion-item
                  label="RNA Sequence"
                  caption="Click to view full sequence"
                  class="q-mt-sm"
                >
                  <q-card>
                    <q-card-section class="bg-grey-2">
                      <div class="text-monospace">
                        {{ result['RNA Sequence'] || 'No sequence data' }}
                      </div>
                      <q-btn
                        v-if="result['RNA Sequence']"
                        label="Copy"
                        color="primary"
                        size="sm"
                        class="q-mt-sm"
                        @click="copyToClipboard(result['RNA Sequence'])"
                      />
                    </q-card-section>
                  </q-card>
                </q-expansion-item>

                <!-- 其他动态字段展示 -->
                <div class="q-mt-md">
                  <template v-for="field in displayedFields" :key="field">
                    <q-chip v-if="result[field]" outline :color="getChipColor(field)">
                      {{ field }}: {{ truncateValue(result[field]) }}
                    </q-chip>
                  </template>
                </div>
              </q-item-section>

              <q-item-section side top>
                <q-badge color="grey" :label="result.source_file" />
                <q-btn
                  label="Details"
                  color="primary"
                  @click="viewDetails(result)"
                  class="q-mt-sm"
                  dense
                />
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
      </q-card>

      <q-card v-else-if="searchPerformed" class="full-width">
        <q-card-section>
          <div class="text-subtitle1 text-center">No results found for "{{ searchQuery }}"</div>
        </q-card-section>
      </q-card>
    </div>
    <!-- 介绍 -->
    <div class="content-container q-pa-md row items-start q-gutter-md"></div>
    <div class="middle-side">
      <q-card flat bordered class="my-card">
        <q-card-section>
          <div class="text-h5 text-center">Welcome to RNA Pesticide Database!</div>
        </q-card-section>
        <q-separator inset />
        <q-card-section style="font-size: larger">
          <strong>Introduction</strong> This database centers on RNAi-based pesticides. Leveraging
          the RNA interference mechanism, these pesticides target pests. The RNAi-Pesticide Database
          is the first of its kind, aiming to gather comprehensive information on RNAi-based
          pesticides. It resolves fragmented data issues by creating a systematic knowledge base to
          train AI tools for designing effective dsRNA sequences. It serves as an open-access
          platform to promote data sharing and collaboration among research teams, driving
          innovation in RNAi technology for pest control.

          <!-- 可点击图片展示 Lightbox -->
          <div class="image-container">
            <img
              src="picture/dataimg.jpg"
              alt="Data Image"
              class="clickable-image"
              @click="openLightbox(0)"
            />
          </div>
        </q-card-section>
      </q-card>
    </div>

    <!-- 功能卡片 -->
    <div class="q-mt-lg q-px-lg">
      <h2 class="text-h5 text-center q-mb-md">Use RNAi Database</h2>
      <div class="row justify-around q-gutter-lg">
        <router-link to="/SIGS" class="no-underline">
          <q-card flat bordered class="function-card">
            <q-card-section>
              <!-- <q-icon name="mdi-spray-bottle" size="40px" color="primary" /> -->
              <svg width="40" height="40" viewBox="0 0 24 24" fill="#1976D2">
                <path
                  d="M16.72 10.43C14.68 8.39 14.5 4.66 14.5 4H13V6H9V4H7C7 2.9 7.9 2 9 2H16V3C16 3.08 16.04 7.63 17.78 9.37L16.72 10.43M17 2V4H18V2H17M15 12C13 10 13 7 13 7H9V9C9 10 9 10 8 11S7 13 7 13V20C7 21.1 7.9 22 9 22H13C14.1 22 15 21.1 15 20V12Z"
                />
              </svg>
              <div class="text-h6 q-mt-sm">SIGS</div>
              <div class="text-subtitle2">Spray-induced Gene Silencing Database.</div>
            </q-card-section>
          </q-card>
        </router-link>

        <router-link to="/HIGS" class="no-underline">
          <q-card flat bordered class="function-card">
            <q-card-section>
              <!-- <q-icon name="mdi-sprout" size="40px" color="primary" /> -->
              <svg width="40" height="40" viewBox="0 0 24 24" fill="#1976D2">
                <path
                  d="M2,22V20C2,20 7,18 12,18C17,18 22,20 22,20V22H2M11.3,9.1C10.1,5.2 4,6.1 4,6.1C4,6.1 4.2,13.9 9.9,12.7C9.5,9.8 8,9 8,9C10.8,9 11,12.4 11,12.4V17C11.3,17 11.7,17 12,17C12.3,17 12.7,17 13,17V12.8C13,12.8 13,8.9 16,7.9C16,7.9 14,10.9 14,12.9C21,13.6 21,4 21,4C21,4 12.1,3 11.3,9.1Z"
                />
              </svg>
              <div class="text-h6 q-mt-sm">HIGS</div>
              <div class="text-subtitle2">Host-induced Gene Silencing Database.</div>
            </q-card-section>
          </q-card>
        </router-link>

        <router-link to="/migs-and-vigs" class="no-underline">
          <q-card flat bordered class="function-card">
            <q-card-section>
              <!-- <q-icon name="mdi-microscope" size="40px" color="primary" /> -->
              <svg width="40" height="40" viewBox="0 0 24 24" fill="#1976D2">
                <path
                  d="M9.46,6.28L11.05,9C8.47,9.26 6.5,11.41 6.5,14A5,5 0 0,0 11.5,19C13.55,19 15.31,17.77 16.08,16H13.5V14H21.5V16H19.25C18.84,17.57 17.97,18.96 16.79,20H19.5V22H3.5V20H6.21C4.55,18.53 3.5,16.39 3.5,14C3.5,10.37 5.96,7.2 9.46,6.28M12.74,2.07L13.5,3.37L14.36,2.87L17.86,8.93L14.39,10.93L10.89,4.87L11.76,4.37L11,3.07L12.74,2.07Z"
                />
              </svg>
              <div class="text-h6 q-mt-sm">MIGS</div>
              <div class="text-subtitle2">Microbe-induced Gene Silencing Database.</div>
            </q-card-section>
          </q-card>
        </router-link>

        <router-link to="/migs-and-vigs" class="no-underline">
          <q-card flat bordered class="function-card">
            <q-card-section>
              <!-- <q-icon name="mdi-virus-outline" size="40px" color="primary" /> -->
              <svg width="40" height="40" viewBox="0 0 24 24" fill="#1976D2">
                <path
                  d="M12 .5C11.03 .5 10.25 1.28 10.25 2.25C10.25 2.84 10.55 3.37 11 3.68V5.08C10.1 5.21 9.26 5.5 8.5 5.94L7.39 4.35C7.58 3.83 7.53 3.23 7.19 2.75C6.84 2.26 6.3 2 5.75 2C5.4 2 5.05 2.1 4.75 2.32C3.96 2.87 3.76 3.96 4.32 4.75C4.66 5.24 5.2 5.5 5.75 5.5L6.93 7.18C6.5 7.61 6.16 8.09 5.87 8.62C5.67 8.54 5.46 8.5 5.25 8.5C4.8 8.5 4.35 8.67 4 9C3.33 9.7 3.33 10.8 4 11.5C4.29 11.77 4.64 11.92 5 12L5 12C5 12.54 5.07 13.06 5.18 13.56L3.87 13.91C3.56 13.65 3.16 13.5 2.75 13.5C2.6 13.5 2.44 13.5 2.29 13.56C1.36 13.81 .809 14.77 1.06 15.71C1.27 16.5 2 17 2.75 17C2.9 17 3.05 17 3.21 16.94C3.78 16.78 4.21 16.36 4.39 15.84L5.9 15.43C6.35 16.22 6.95 16.92 7.65 17.5L6.55 19.5C6 19.58 5.5 19.89 5.21 20.42C4.75 21.27 5.07 22.33 5.92 22.79C6.18 22.93 6.47 23 6.75 23C7.37 23 7.97 22.67 8.29 22.08C8.57 21.56 8.56 20.96 8.31 20.47L9.38 18.5C10.19 18.82 11.07 19 12 19C12.06 19 12.12 19 12.18 19C12.05 19.26 12 19.56 12 19.88C12.08 20.8 12.84 21.5 13.75 21.5C13.79 21.5 13.84 21.5 13.88 21.5C14.85 21.42 15.57 20.58 15.5 19.62C15.46 19.12 15.21 18.68 14.85 18.39C15.32 18.18 15.77 17.91 16.19 17.6L18.53 19.94C18.43 20.5 18.59 21.07 19 21.5C19.35 21.83 19.8 22 20.25 22S21.15 21.83 21.5 21.5C22.17 20.8 22.17 19.7 21.5 19C21.15 18.67 20.7 18.5 20.25 18.5C20.15 18.5 20.05 18.5 19.94 18.53L17.6 16.19C18.09 15.54 18.47 14.8 18.71 14H19.82C20.13 14.45 20.66 14.75 21.25 14.75C22.22 14.75 23 13.97 23 13S22.22 11.25 21.25 11.25C20.66 11.25 20.13 11.55 19.82 12H19C19 10.43 18.5 9 17.6 7.81L18.94 6.47C19.05 6.5 19.15 6.5 19.25 6.5C19.7 6.5 20.15 6.33 20.5 6C21.17 5.31 21.17 4.2 20.5 3.5C20.15 3.17 19.7 3 19.25 3S18.35 3.17 18 3.5C17.59 3.93 17.43 4.5 17.53 5.06L16.19 6.4C15.27 5.71 14.19 5.25 13 5.08V3.68C13.45 3.37 13.75 2.84 13.75 2.25C13.75 1.28 12.97 .5 12 .5M12 17C9.24 17 7 14.76 7 12S9.24 7 12 7 17 9.24 17 12 14.76 17 12 17M10.5 9C9.67 9 9 9.67 9 10.5S9.67 12 10.5 12 12 11.33 12 10.5 11.33 9 10.5 9M14 13C13.45 13 13 13.45 13 14C13 14.55 13.45 15 14 15C14.55 15 15 14.55 15 14C15 13.45 14.55 13 14 13Z"
                />
              </svg>
              <div class="text-h6 q-mt-sm">VIGS</div>
              <div class="text-subtitle2">Virus Induced Gene Silencing Database.</div>
            </q-card-section>
          </q-card>
        </router-link>

        <router-link to="/VIGS" class="no-underline">
          <q-card flat bordered class="function-card">
            <q-card-section>
              <!-- <q-icon name="mdi-compare-horizontal" size="40px" color="primary" /> -->
              <svg width="40" height="40" viewBox="0 0 24 24" fill="#1976D2">
                <path d="M9 14H2V16H9V19L13 15L9 11V14M15 13V10H22V8H15V5L11 9L15 13Z" />
              </svg>
              <div class="text-h6 q-mt-sm">BLAST</div>
              <div class="text-subtitle2">Bio-sequence similarity alignment search.</div>
            </q-card-section>
          </q-card>
        </router-link>

        <router-link to="/VIGS" class="no-underline">
          <q-card flat bordered class="function-card">
            <q-card-section>
              <!-- <q-icon name="mdi-cloud-download" size="40px" color="primary" /> -->
              <svg width="40" height="40" viewBox="0 0 24 24" fill="#1976D2">
                <path
                  d="M6.5 20Q4.22 20 2.61 18.43 1 16.85 1 14.58 1 12.63 2.17 11.1 3.35 9.57 5.25 9.15 5.83 7.13 7.39 5.75 8.95 4.38 11 4.08V12.15L9.4 10.6L8 12L12 16L16 12L14.6 10.6L13 12.15V4.08Q15.58 4.43 17.29 6.39 19 8.35 19 11 20.73 11.2 21.86 12.5 23 13.78 23 15.5 23 17.38 21.69 18.69 20.38 20 18.5 20Z"
                />
              </svg>
              <div class="text-h6 q-mt-sm">Download</div>
              <div class="text-subtitle2">
                Provide downloadable files of data used in the database.
              </div>
            </q-card-section>
          </q-card>
        </router-link>

        <router-link to="/help" class="no-underline">
          <q-card flat bordered class="function-card">
            <q-card-section>
              <!-- <q-icon name="mdi-help-rhombus-outline" size="40px" color="primary" /> -->
              <svg width="40" height="40" viewBox="0 0 24 24" fill="#1976D2">
                <path
                  d="M11 15.5H12.5V17H11V15.5M12 6.95C14.7 7.06 15.87 9.78 14.28 11.81C13.86 12.31 13.19 12.64 12.85 13.07C12.5 13.5 12.5 14 12.5 14.5H11C11 13.65 11 12.94 11.35 12.44C11.68 11.94 12.35 11.64 12.77 11.31C14 10.18 13.68 8.59 12 8.46C11.18 8.46 10.5 9.13 10.5 9.97H9C9 8.3 10.35 6.95 12 6.95M12 2C11.5 2 11 2.19 10.59 2.59L2.59 10.59C1.8 11.37 1.8 12.63 2.59 13.41L10.59 21.41C11.37 22.2 12.63 22.2 13.41 21.41L21.41 13.41C22.2 12.63 22.2 11.37 21.41 10.59L13.41 2.59C13 2.19 12.5 2 12 2M12 4L20 12L12 20L4 12Z"
                />
              </svg>
              <div class="text-h6 q-mt-sm">Help</div>
              <div class="text-subtitle2">Provide methods on how to use the database website.</div>
            </q-card-section>
          </q-card>
        </router-link>

        <router-link to="/about" class="no-underline">
          <q-card flat bordered class="function-card">
            <q-card-section>
              <!-- <q-icon name="mdi-account-circle-outline" size="40px" color="primary" /> -->
              <svg width="40" height="40" viewBox="0 0 24 24" fill="#1976D2">
                <path
                  d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M7.07,18.28C7.5,17.38 10.12,16.5 12,16.5C13.88,16.5 16.5,17.38 16.93,18.28C15.57,19.36 13.86,20 12,20C10.14,20 8.43,19.36 7.07,18.28M18.36,16.83C16.93,15.09 13.46,14.5 12,14.5C10.54,14.5 7.07,15.09 5.64,16.83C4.62,15.5 4,13.82 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,13.82 19.38,15.5 18.36,16.83M12,6C10.06,6 8.5,7.56 8.5,9.5C8.5,11.44 10.06,13 12,13C13.94,13 15.5,11.44 15.5,9.5C15.5,7.56 13.94,6 12,6M12,11A1.5,1.5 0 0,1 10.5,9.5A1.5,1.5 0 0,1 12,8A1.5,1.5 0 0,1 13.5,9.5A1.5,1.5 0 0,1 12,11Z"
                />
              </svg>
              <div class="text-h6 q-mt-sm">About us</div>
              <div class="text-subtitle2">Find more information about web builders here.</div>
            </q-card-section>
          </q-card>
        </router-link>
      </div>
    </div>

    <!-- Lightbox 组件 -->
    <vue-easy-lightbox
      :visible="lightboxVisible"
      :imgs="lightboxImgs"
      :index="lightboxIndex"
      @hide="lightboxVisible = false"
    />
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import VueEasyLightbox from 'vue-easy-lightbox'
import { useQuasar } from 'quasar'

const $q = useQuasar()

// 新增搜索样例
const searchExamples = ref([
  'Drosophila',
  'dsRNA',
  'Spodoptera',
  'RNAi efficiency',
  'PxAChE2'
])

// 使用样例搜索
function useExample(example: string) {
  searchQuery.value = example
  performSearch()
}

// 状态管理
const lightboxVisible = ref(false)
const lightboxIndex = ref(0)
const lightboxImgs = ['picture/dataimg.jpg']
const searchQuery = ref('')
const searchResults = ref<any[]>([])
const searchPerformed = ref(false)
const isLoading = ref(false)
const displayedFields = ref<string[]>([])

// CSV文件列表
const csvFiles = ['data/SIGS.csv', 'data/HIGS.csv', 'data/MIGS.csv', 'data/VIGS.csv']

async function performSearch() {
  if (!searchQuery.value.trim()) {
    $q.notify({ type: 'warning', message: 'Please enter a search term' })
    return
  }

  isLoading.value = true
  searchPerformed.value = true
  searchResults.value = []

  try {
    const allResults = []
    const searchTerm = searchQuery.value.toLowerCase()
    const tempDisplayedFields = new Set<string>()

    for (const file of csvFiles) {
      try {
        const response = await fetch(file)
        if (!response.ok) continue

        const text = await response.text()
        const rows = text.split('\n').filter((line) => line.trim())

        if (rows.length < 2) continue

        const headers = rows[0].split(',').map((h) => h.trim())

        for (let i = 1; i < rows.length; i++) {
          const values = rows[i].split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/)
          const row: any = { source_file: file.replace('data/', '').replace('.csv', '') }

          for (let j = 0; j < headers.length && j < values.length; j++) {
            const val = values[j].trim().replace(/^"|"$/g, '')
            row[headers[j]] = val

            // 收集非核心字段
            if (
              !['Target Pest Name', 'Target Gene Name', 'RNA Sequence', 'source_file'].includes(
                headers[j],
              )
            ) {
              tempDisplayedFields.add(headers[j])
            }

            // 检查是否匹配
            if (val.toLowerCase().includes(searchTerm)) {
              allResults.push(row)
              break
            }
          }
        }
      } catch (error) {
        console.error(`Error processing ${file}:`, error)
      }
    }

    // 限制最多显示3个额外字段
    displayedFields.value = Array.from(tempDisplayedFields).slice(0, 3)
    searchResults.value = allResults

    if (allResults.length === 0) {
      $q.notify({ type: 'info', message: 'No matching results found' })
    }
  } catch (error) {
    console.error('Search error:', error)
    $q.notify({
      type: 'negative',
      message: 'Search failed: ' + (error instanceof Error ? error.message : String(error)),
    })
  } finally {
    isLoading.value = false
  }
}

// 辅助方法
function getChipColor(fieldName: string): string {
  const colorMap: Record<string, string> = {
    Effectiveness: 'green',
    Species: 'orange',
    Reference: 'purple',
    Method: 'blue',
  }
  return colorMap[fieldName] || 'grey'
}

function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text)
  $q.notify({ type: 'positive', message: 'Sequence copied!' })
}

function truncateValue(value: any, maxLen = 20): string {
  const strValue = String(value)
  return strValue.length > maxLen ? `${strValue.substring(0, maxLen)}...` : strValue
}

function viewDetails(result: any) {
  const routeMap: Record<string, string> = {
    SIGS: '/SIGS',
    HIGS: '/HIGS',
    MIGS: '/migs-and-vigs',
    VIGS: '/migs-and-vigs',
  }
  const route = routeMap[result.source_file] || '/'
  window.location.href = `${route}?id=${result.id || result['Target Gene Name']}`
}

function openLightbox(index: number) {
  lightboxIndex.value = index
  lightboxVisible.value = true
}
</script>

<style scoped>
.content-container {
  width: 100px;
  margin-top: 20px;
}

.middle-side {
  flex: 2;
  margin-left: 40px;
  margin-right: 40px;
}

.function-card {
  width: 230px;
  text-align: center;
  padding: 16px;
  margin-bottom: 20px;
}

.no-underline {
  text-decoration: none;
  color: inherit;
}

.image-container {
  text-align: center;
  margin: 20px 0;
}

.clickable-image {
  max-width: 100%;
  cursor: pointer;
}

/* 新增搜索相关样式 */
.search-container {
  margin-top: 20px;
  margin-bottom: 30px;
}

.search-card {
  transition: all 0.3s ease;
}

.result-item:hover {
  background-color: #f5f5f5;
  cursor: pointer;
}

.loading-spinner {
  margin: 20px auto;
  display: block;
}
.text-monospace {
  font-family: monospace;
  word-break: break-all;
}

.q-chip {
  max-width: 300px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.search-container {
  margin-top: 20px;
  margin-bottom: 30px;
}
</style>
