<template>
  <q-page class="home-page">
    <!-- 搜索区域 -->
    <!-- <section class="search-section bg-light q-py-lg">
      <div class="container">

        <div class="search-box bg-white rounded-pill shadow-5 row"> -->
          <!-- 添加下拉筛选框 -->
          <!-- <q-select
            class="col-auto"
            v-model="searchField"
            :options="searchOptions"
            dense
            borderless
            style="min-width: 100px;"
            popup-content-class="search-select-popup"
          />
          <q-input
            class="col-grow"
            borderless
            placeholder="Search by pest name, target gene, mechanism, or crop..."
            input-class="text-body1"
          />
          <q-btn
            class="bg-primary text-white"
            label="Search"
            unelevated
            size="lg"
            style="border-radius: 0 70px 70px 0"
          />
        </div>
        <div class="search-examples text-center q-mt-md">
          <p>
            <span class="example-label text-weight-bold">Examples:</span>
            <span class="example-bold">Lepidoptera</span>,
            <span class="example-italic">Helicoverpa armigera</span>,
            <span class="example-italic">Zea mays</span>,
            <span class="example-italic">V-ATPase</span>,
            <span class="example-italic">chitinase</span>
          </p>
        </div>
      </div>
    </section> -->

    <!-- 搜索区域 -->
    <section class="search-section bg-light q-py-lg">
      <div class="container">
        <div class="search-box bg-white rounded-pill shadow-5 row">
          <!-- 添加下拉筛选框 -->
          <q-select
            class="col-auto"
            v-model="searchField"
            :options="searchOptions"
            dense
            borderless
            style="min-width: 100px;"
            popup-content-class="search-select-popup"
          />
          <q-input
            class="col-grow"
            v-model="searchKeyword"
            borderless
            placeholder="Search by pest name, target gene, mechanism, or crop..."
            input-class="text-body1"
            @keyup.enter="performSearch"
          />
          <q-btn
            class="bg-primary text-white"
            label="Search"
            unelevated
            size="lg"
            style="border-radius: 0 70px 70px 0"
            @click="performSearch"
          />
        </div>
        <div class="search-examples text-center q-mt-md">
          <p>
            <span class="example-label text-weight-bold">Examples:</span>
            <span class="example-bold">Lepidoptera</span>,
            <span class="example-italic">Helicoverpa armigera</span>,
            <span class="example-italic">Zea mays</span>,
            <span class="example-italic">V-ATPase</span>,
            <span class="example-italic">chitinase</span>
          </p>
        </div>

        <!-- 搜索结果展示 -->
        <div v-if="searchResults.length > 0" class="search-results bg-white q-mt-lg rounded-borders shadow-3">
          <div class="q-pa-md">
            <div class="text-h6 text-primary q-mb-md">
              Search Results ({{ searchResults.length }})
              <q-btn
                label="Clear"
                flat
                dense
                color="negative"
                class="float-right"
                @click="clearSearch"
              />
            </div>
            <q-table
              :rows="searchResults"
              :columns="resultColumns"
              row-key="id"
              dense
              flat
              separator="cell"
              :rows-per-page-options="[5, 10, 20]"
            >
              <template v-slot:body-cell-type="props">
                <q-td :props="props">
                  <q-badge :color="typeColors[props.row.type]" class="q-px-sm q-py-xs">
                    {{ props.row.type }}
                  </q-badge>
                </q-td>
              </template>
            </q-table>
          </div>
        </div>
      </div>
    </section>


    <!-- 主视觉区域 -->
    <section class="hero">
      <div class="container">
        <div class="hero-content q-mx-auto">
          <h1 class="text-h3 text-weight-bold q-mb-lg text-white">RNA Pesticide Database</h1>
          <p class="text-h6 q-mb-xl text-white">
            A comprehensive database of RNAi-based pesticides targeting agricultural pests, covering
            multiple species and classified by mechanisms: SIGS, HIGS, VIGS, MIGS, and others.
          </p>
        </div>
      </div>
    </section>

    <!-- 统计区域 -->
    <section class="stats bg-blue-1 text-center q-py-xl">
      <div class="container">
        <div class="stats-container row justify-around">
          <div
            v-for="stat in stats"
            :key="stat.title"
            class="stat-item bg-white shadow-5 rounded-borders q-pa-xl"
          >
            <q-icon :name="stat.icon" size="3rem" color="primary" class="q-mb-md" />
            <div class="stat-title text-primary text-h6 text-weight-bold">{{ stat.title }}</div>
            <div class="stat-number text-primary text-h4 text-weight-bold">{{ stat.number }}</div>
            <div class="stat-description text-grey">{{ stat.description }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- RNA农药介绍 -->
    <section class="rna-intro bg-white q-py-xl">
      <div class="container">
        <div class="rna-container">
                <div class="image-container">
                  <q-img
                    :src="imagePath"
                    alt="图片描述"
                    style="max-width: 95%"
                  />
                </div>
          <div class="rna-card bg-yellow-1 shadow-3 rounded-borders q-pa-md q-mb-lg">
            <div class="rna-title q-mt-sm q-mb-md">
              <h2 class="text-h4 q-mt-sm text-center ">RNA Pesticide</h2>
            </div>
            <div class="rna-content">
              <p class="text-body1 q-mb-md">
                RNA pesticides are a new class of pesticides developed based on RNA interference
                (RNAi).
              </p>
              <p class="text-body1 q-mb-md">
                RNA interference is a gene silencing mechanism mediated by double-stranded RNA
                (dsRNA) that can specifically degrade homologous target mRNA, thereby inhibiting the
                expression of specific genes.
              </p>
              <p class="text-body1 q-mb-md">
                This technology provides the potential to develop highly specific novel pesticides
                and an important development direction for green agriculture.
              </p>
            </div>
          </div>

            <!-- 对比表格 -->
<div class="comparison-table shadow-3 rounded-borders overflow-hidden">
  <!-- RNA 农药行 -->
  <div class="table-row row">
    <div class="table-cell category-cell rna-cell col-2 column items-center justify-center q-pa-md">
      <q-icon name="check" class="category-icon" />
      <div class="category-title text-h6 text-weight-bold">RNA Pesticide</div>
    </div>
    <div
      v-for="feature in rnaFeatures"
      :key="feature.title"
      class="table-cell feature-cell col column q-pa-md"
      style="height: 180px; display: flex; flex-direction: column;"
    >
      <div class="feature-text" style="flex: 1; display: flex; flex-direction: column;">
        <h4 class="text-h6 q-mb-sm" style="height: 60px; display: flex; align-items: center; justify-content: center; margin: 0;">
          {{ feature.title }}
        </h4>
        <div class="text-body1" style="flex: 1; display: flex; align-items: center; justify-content: center;">
          <p style="margin: 0; text-align: center;">{{ feature.description }}</p>
        </div>
      </div>
    </div>
  </div>

  <!-- 化学农药行 -->
  <div class="table-row row">
    <div class="table-cell category-cell chemical-cell col-2 column items-center justify-center q-pa-md">
      <q-icon name="close" class="category-icon" />
      <div class="category-title text-h6 text-weight-bold">Chemical Pesticide</div>
    </div>
    <div
      v-for="feature in chemicalFeatures"
      :key="feature.title"
      class="table-cell feature-cell col column q-pa-md"
      style="height: 180px; display: flex; flex-direction: column;"
    >
      <div class="feature-text" style="flex: 1; display: flex; flex-direction: column;">
        <h4 class="text-h6 q-mb-sm" style="height: 60px; display: flex; align-items: center; justify-content: center; margin: 0;">
          {{ feature.title }}
        </h4>
        <div class="text-body1" style="flex: 1; display: flex; align-items: center; justify-content: center;">
          <p style="margin: 0; text-align: center;">{{ feature.description }}</p>
        </div>
      </div>
    </div>
  </div>
</div>

        </div>
      </div>

    </section>

    <!-- 应用方法区域 -->
    <section class="methods q-py-xl bg-grey-2">
      <div class="container">
        <div class="section-title text-center q-mb-xl">
          <h2 class="text-h4 text-weight-bold">Methods of Application</h2>
          <p style="margin-top: -15px; margin-bottom: 100px">RNAi-based pesticides classified by delivery methods</p>
        </div>
        <div class="methods-container row justify-between q-col-gutter-y-lg">
          <div
            v-for="method in methods"
            :key="method.title"
            class="method-card col bg-white shadow-5 rounded-borders overflow-hidden"
          >
            <div
              class="method-img"
              :style="`background: linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.1)), url('${method.image}'); background-size: cover;
                background-position: center;
                height: 140px;
                margin: 0 auto;
                width: 85%;  `"
            ></div>
            <div class="method-content q-pa-lg">
              <h3 class="text-h6 text-primary q-mb-sm">{{ method.title }}</h3>
              <p class="text-weight-medium q-mb-sm">{{ method.subtitle }}</p>
              <p class="method-desc text-grey q-mb-md">{{ method.description }}</p>
              <q-btn label="View Data" color="primary" unelevated class="q-mt-sm" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 物种区域 -->
    <section class="species q-py-xl bg-white">
      <div class="container">
        <div class="section-title text-center q-mb-xl">
          <h2 class="text-h4 text-weight-bold">Pest Species</h2>
          <p style="margin-top: -15px; margin-bottom: 100px">Database covers diverse agricultural pests with RNAi solutions</p>
        </div>
        <div class="species-container row justify-center q-col-gutter-y-lg ">
          <div
            v-for="specie in species"
            :key="specie.name"
            class="species-card col bg-grey-1 shadow-3 rounded-borders overflow-hidden "
          >
            <div
              class="species-img flex flex-center"
              :style="`background: linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.1)), url('${specie.image}'); background-size: cover;
                background-position: left;
                height: 140px;
                margin: 0 auto;
                width: 90%;  ` "
            ></div>
            <div class="species-content q-pa-lg">
              <h3 class="text-h6 text-primary q-mb-sm">{{ specie.name }}</h3>
              <div class="species-count text-accent text-weight-bold q-mb-sm">
                {{ specie.count }} species
              </div>
              <div class="species-name text-italic text-dark">{{ specie.examples }}</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 可视化区域 -->
    <section class="visualization q-py-xl bg-white">
      <div class="container">
        <div
          class="section-title text-center q-mb-md"
          style="margin-top: -15px; margin-bottom: 25px"
        >
          <h2 class="text-h4 text-weight-bold">Data Visualization</h2>
        </div>
        <div
          class="section-subtitle text-center text-grey q-mb-xl"
          style="margin-top: -15px; margin-bottom: 100px"
        >
          Visualize key data and trends in RNAi pesticide research through charts
        </div>

        <div class="vis-container row justify-center q-col-gutter-xl">
          <div
            v-for="vis in visualizations"
            :key="vis.title"
            class="vis-card col bg-white shadow-5 rounded-borders overflow-hidden"
          >
            <div class="vis-img bg-blue-1 flex flex-center" style="height: 200px;width: 85%;">
              <q-icon :name="vis.icon" size="4rem" color="primary" />
            </div>

            <div class="vis-content q-pa-lg flex flex-center" style="height: 200px;width: 92%;">
              <h3 class="text-h6 text-primary q-mb-md">{{ vis.title }}</h3>
              <p class="text-grey">{{ vis.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 出版物区域 -->
    <!-- <section class="publications q-py-xl bg-grey-2">
      <div class="container">
        <div class="section-title text-center q-mb-md">
          <h2 class="text-h4 text-weight-bold">Latest Research Publications</h2>
        </div>
        <div class="section-subtitle text-center text-grey q-mb-xl">
          Stay updated with the latest advances in RNA pesticide research
        </div>

        <div class="row q-col-gutter-xl">
          <div v-for="pub in publications" :key="pub.title" class="col-12 col-md-6 col-lg-4">
            <div class="pub-card bg-white shadow-5 rounded-borders overflow-hidden">
              <div class="pub-img" style="height: 170px">
                <img
                  :src="pub.image"
                  alt="Publication"
                  class="full-width"
                  style="height: 100%; object-fit: cover"
                />
              </div>
              <div class="pub-content q-pa-lg">
                <div class="pub-meta row items-center text-grey">
                  <span>{{ pub.date }}</span>
                  <span class="pub-dot q-mx-sm">•</span>
                  <span>{{ pub.journal }}</span>
                </div>
                <h3 class="pub-title text-h6 text-weight-bold text-dark q-my-md">
                  {{ pub.title }}
                </h3>
                <p class="pub-abstract text-grey q-mb-lg">{{ pub.abstract }}</p>
                <a href="#" class="pub-link text-primary text-weight-medium row items-center">
                  Read full text <q-icon name="arrow_right" class="q-ml-sm" />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div class="view-more text-center q-mt-xl">
          <q-btn label="View More Publications" color="primary" icon-right="arrow_right" />
        </div>
      </div>
    </section> -->


<!-- 行业动态区域 -->
    <!-- <section class="industry q-py-xl bg-grey-1">
      <div class="container">
        <div class="section-title text-center q-mb-md">
          <h2 class="text-h4 text-weight-bold">Industry trends</h2>
        </div>
        <div class="section-subtitle text-center text-grey q-mb-xl">
          Stay updated with the industry trends in RNA pesticide research
        </div>

        <div class="row q-col-gutter-xl">
          <div v-for="pub in industry" :key="pub.title" >
            <div class="pub-card bg-white shadow-5 rounded-borders overflow-hidden">
              <div class="pub-img" style="height: 270px">
                <img
                  :src="pub.image"
                  alt="Publication"
                  class="full-width"
                  style="height: 100%; object-fit: cover"
                />
              </div>
              <div class="pub-content q-pa-lg">
                <div class="pub-meta row items-center text-grey">
                  <span>{{ pub.date }}</span>
                  <span class="pub-dot q-mx-sm">•</span>
                  <span>{{ pub.journal }}</span>
                </div>
                <h3 class="pub-title text-h6 text-weight-bold text-dark q-my-md">
                  {{ pub.title }}
                </h3>
                <p class="pub-abstract text-grey q-mb-lg">{{ pub.abstract }}</p>
                <a href="#" class="pub-link text-primary text-weight-medium row items-center">
                  Read full text <q-icon name="arrow_right" class="q-ml-sm" />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div class="view-more text-center q-mt-xl">
          <q-btn label="View More Publications" color="primary" icon-right="arrow_right" />
        </div>
      </div>
    </section>
 -->

    <!-- 关于数据库 -->
    <section class="about-db q-py-xl bg-white">
      <div class="container">
        <div class="section-title text-center q-mb-xl">
          <h2 class="text-h4 text-weight-bold">About the Database</h2>
        </div>
        <div
          class="about-content text-grey q-mb-xl"
          style="max-width: 1400px; margin: 0 auto; font-size: 1.1rem; line-height: 1.8"
        >
          <p class="q-mb-md" >
            RNA Pesticide Database is a specialized platform focused on collecting, organizing, and
            analyzing data on agricultural pest control based on RNAi technology. We are committed
            to providing researchers, agricultural professionals, and pesticide developers with
            comprehensive, accurate, and up-to-date information resources on RNAi pesticides.
          </p>
          <p style="margin-top: -15px; margin-bottom: 100px">
            This database is hosted and developed by the School of Life Sciences and the School of
            Agriculture and Biotechnology at Sun Yat-sen University. Our goal is to promote the
            application and development of RNAi technology in the field of agricultural pest
            control, supporting the realization of green and sustainable agriculture.
          </p>
        </div>
        <div class="features-container row q-col-gutter-xl">
          <div
            v-for="feature in features"
            :key="feature.title"
            class="feature-card col bg-white shadow-3 rounded-borders q-pa-lg text-center"
          >
            <div
              class="feature-icon bg-green-1 text-primary rounded-circle flex flex-center"
              style="width: 70px; height: 70px; margin: 0 auto 20px"
            >
              <q-icon :name="feature.icon" size="1.8rem" />
            </div>
            <h3 class="feature-title text-h6 text-weight-bold text-dark q-mb-md">
              {{ feature.title }}
            </h3>
            <p class="feature-desc text-grey">{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 页脚 -->
    <footer class="bg-dark text-white q-pt-xl q-pb-lg">
      <div class="container">
        <div class="footer-content row q-col-gutter-xl q-mb-lg">
          <div class="col">
            <h3 class="text-h6 q-mb-md">RNA Pesticide Database</h3>
            <p class="text-grey-5">
              A comprehensive resource for RNAi-based pesticide research targeting agricultural
              pests.
            </p>
          </div>
          <div class="col">
            <h3 class="text-h6 q-mb-md">Quick Links</h3>
            <ul class="footer-links q-gutter-y-sm">
              <li v-for="link in footerLinks" :key="link">
                <a href="#" class="text-grey-5">{{ link }}</a>
              </li>
            </ul>
          </div>
          <div class="col">
            <h3 class="text-h6 q-mb-md">Contact Us</h3>
            <ul class="footer-links q-gutter-y-sm">
              <li class="row items-center">
                <q-icon name="mail" class="q-mr-sm" />
                <span class="text-grey-5">contact@rnaipesticide.org</span>
              </li>
              <li class="row items-center">
                <q-icon name="phone" class="q-mr-sm" />
                <span class="text-grey-5">+1 (555) 123-4567</span>
              </li>
              <li class="row items-center">
                <q-icon name="location_on" class="q-mr-sm" />
                <span class="text-grey-5">Research Center, Agriculture Campus</span>
              </li>
            </ul>
          </div>
        </div>
        <div
          class="copyright text-center text-grey q-pt-lg"
          style="border-top: 1px solid rgba(255, 255, 255, 0.1)"
        >
          <p>&copy; 2023 RNA Pesticide Database | All Rights Reserved</p>
        </div>
      </div>
    </footer>
  </q-page>
</template>

<script>
import { ref, onMounted } from 'vue';
import Papa from 'papaparse';

export default {
  name: 'HomePage',
  setup() {

    //搜索框
    // 搜索相关变量
    const searchField = ref('All Fields');
    const searchKeyword = ref('');
    const searchResults = ref([]);
    const allData = ref([]);
    const isLoading = ref(false);

    // 搜索选项
    const searchOptions = [
      'All Fields', 'Pest Name', 'Target Gene', 'Mechanism', 'Crop', 'Type'
    ];

    // 搜索结果表格列定义
    const resultColumns = [
      { name: 'type', label: 'Type', field: 'type', align: 'left', sortable: true },
      { name: 'pest', label: 'Pest', field: 'pest', align: 'left', sortable: true },
      { name: 'target_gene', label: 'Target Gene', field: 'target_gene', align: 'left' },
      { name: 'mechanism', label: 'Mechanism', field: 'mechanism', align: 'left' },
      { name: 'crop', label: 'Crop', field: 'crop', align: 'left' },
      { name: 'efficacy', label: 'Efficacy', field: 'efficacy', align: 'center' }
    ];

    // 类型颜色映射
    const typeColors = {
      HIGS: 'blue',
      MIGS: 'green',
      SIGS: 'orange',
      VIGS: 'purple',
      PTO: 'red'
    };

    // 加载CSV数据
    const loadCSVData = async () => {
      isLoading.value = true;
      const files = ['HIGS', 'MIGS', 'SIGS', 'VIGS', 'PTO'];
      const promises = files.map(file => {
        return new Promise((resolve) => {
          // 注意：文件路径需要根据实际项目结构调整
          Papa.parse(`/data/${file}.csv`, {
            download: true,
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
              // 添加类型标识并规范化数据
              const dataWithType = results.data.map(item => ({
                ...item,
                type: file,
                id: `${file}-${Math.random().toString(36).substr(2, 9)}`
              }));
              resolve(dataWithType);
            },
            error: (error) => {
              console.error(`Error loading ${file}.csv:`, error);
              resolve([]);
            }
          });
        });
      });

      try {
        const results = await Promise.all(promises);
        allData.value = results.flat();
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        isLoading.value = false;
      }
    };

    // 执行搜索
    const performSearch = () => {
      if (!searchKeyword.value.trim()) {
        return;
      }

      const keyword = searchKeyword.value.toLowerCase().trim();

      searchResults.value = allData.value.filter(item => {
        // 根据选择的搜索字段进行过滤
        switch (searchField.value) {
          case 'Target Pest Name':
            return item.pest?.toLowerCase().includes(keyword);
          case 'Target Gene Name':
            return item.target_gene?.toLowerCase().includes(keyword);
          case 'RNA Sequence':
            return item.mechanism?.toLowerCase().includes(keyword);
          case 'Target Pest Order':
            return item.crop?.toLowerCase().includes(keyword);
          case 'Plant Name':
            return item.type?.toLowerCase().includes(keyword);
          default: // 'All Fields'
            return (
              item.pest?.toLowerCase().includes(keyword) ||
              item.target_gene?.toLowerCase().includes(keyword) ||
              item.mechanism?.toLowerCase().includes(keyword) ||
              item.crop?.toLowerCase().includes(keyword) ||
              item.type?.toLowerCase().includes(keyword)
            );
        }
      });
    };

    // 清除搜索结果
    const clearSearch = () => {
      searchResults.value = [];
      searchKeyword.value = '';
    };

    // 组件挂载时加载数据
    onMounted(() => {
      loadCSVData();
    });


    // 导航链接
    const navLinks = ['Home', 'SIGS', 'HIGS', 'VIGS', 'MIGS', 'Other', 'About', 'Help']

    // 统计数据
    const stats = [
      {
        icon: 'bug_report',
        title: 'Pest Species',
        number: '185+',
        description: 'Covering major agricultural pests',
      },
      {
        icon: 'biotech',
        title: 'Target Genes',
        number: '1,850+',
        description: 'Continuously updated',
      },
      {
        icon: 'spa',
        title: 'Plants',
        number: '120+',
        description: 'Protected by RNA pesticides'
        },
      {
        icon: 'menu_book',
        title: 'References',
        number: '950+',
        description: 'Scientific publications',
      },
    ]

     const imagePath = ['/picture/home.png'

        ]


    // RNA特性
    const rnaFeatures = [
      {
        title: 'High Specificity',
        description: 'Targets specific pests while being safe for non-target organisms',
      },
      {
        title: 'Environmental Friendly',
        description: 'Rapid degradation, minimal residues, and reduced environmental pollution',
      },
      {
        title: 'Resistance Management',
        description: 'Provides novel modes of action, delaying the development of resistance',
      },
      {
        title: 'Precision Agriculture',
        description: 'Customizable designs targeting specific organisms with tailored sequences',
      },
    ]

    // 化学农药特性
    const chemicalFeatures = [
      {
        title: 'Non-Specific Action',
        description: 'Broad-spectrum toxicity affecting beneficial insects and non-target species',
      },
      {
        title: 'Environmental Pollution',
        description: 'Long residual periods leading to soil and water contamination',
      },
      {
        title: 'Rapid Resistance',
        description: 'Pests develop resistance quickly, requiring higher doses or new chemicals',
      },
      {
        title: 'Limited Precision',
        description: 'Inability to target specific pests without affecting other organisms',
      },
    ]

    // 应用方法
    const methods = [
      {
        title: 'SIGS',
        subtitle: 'Spray-Induced Gene Silencing',
        description:
          'Direct application of dsRNA to plant leaves via spraying. Pests ingest dsRNA when feeding, silencing target genes.',
        image:
          'https://images.unsplash.com/photo-1587049633312-d628ae50a8ae?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
      },
      {
        title: 'HIGS',
        subtitle: 'Host-Induced Gene Silencing',
        description:
          'Genetically engineered host plants express dsRNA targeting key pest genes. Pests ingest dsRNA when feeding on transgenic plants.',
        image:
          'https://images.unsplash.com/photo-1516253593875-bd7ba052fbc5?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
      },
      {
        title: 'VIGS',
        subtitle: 'Virus-Induced Gene Silencing',
        description:
          'Engineered viral vectors deliver dsRNA to plants or directly to pests. Viruses replicate and express dsRNA, inducing target gene silencing.',
        image:
          'https://images.unsplash.com/photo-1579546929662-711aa81148cf?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
      },
      {
        title: 'MIGS',
        subtitle: 'Microbe-Induced Gene Silencing',
        description:
          'Engineered symbiotic microbes (bacteria, fungi) produce and deliver dsRNA. Microbes colonize plant surfaces or pest guts, continuously producing dsRNA.',
        image:
          'https://images.unsplash.com/photo-1590486803833-1c5dc8ddd4c8?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
      },
      {
        title: 'Other',
        subtitle: 'Injection, feeding, soaking',
        description:
          'In laboratory settings, diverse delivery methods such as direct injection of dsRNA into pests are commonly used.',
        image:
          'https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
      },
    ]

    // 物种数据
    const species = [
      {
        name: 'Lepidoptera',
        count: '12 species',
        examples: 'Chilo suppressalis, Helicoverpa armigera, Spodoptera frugiperda...',
        image:
          'https://images.unsplash.com/photo-1587049633312-d628ae50a8ae?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
      },
      {
        name: 'Coleoptera',
        count: '8 species',
        examples: 'Leptinotarsa decemlineata, Diabrotica virgifera...',
        image:
          'https://images.unsplash.com/photo-1516253593875-bd7ba052fbc5?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
      },
      {
        name: 'Hemiptera',
        count: '15 species',
        examples: 'Bemisia tabaci, Myzus persicae, Aphis gossypii...',
        image:
          'https://images.unsplash.com/photo-1579546929662-711aa81148cf?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
      },
      {
        name: 'Thysanoptera',
        count: '5 species',
        examples: 'Frankliniella occidentalis, Thrips palmi...',
        image:
          'https://images.unsplash.com/photo-1590486803833-1c5dc8ddd4c8?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
      },
      {
        name: 'Other',
        count: '10 species',
        examples: 'Tetranychus urticae, Drosophila melanogaster...',
        image:
          'https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
      },
    ]

    // 可视化数据
    const visualizations = [
      {
        title: 'Pest species statistics',
        description: 'Pie chart showing distribution of pest species in the database',
        icon: 'pie_chart',
      },
      {
        title: 'Delivery Methods',
        description: 'Bar chart showing proportion of different delivery methods',
        icon: 'bar_chart',
      },
      {
        title: 'Target Gene Categories',
        description: 'Pie chart showing distribution of target gene categories',
        icon: 'pie_chart',
      },
    ]

    // 出版物
    const publications = [
      {
        title: 'RNAi-Mediated Pest Control: From Laboratory to Field',
        date: '2025-05-15',
        journal: 'Nature Biotechnology',
        abstract:
          'This review summarizes the latest progress in RNAi-based pest control technologies and their application prospects in agriculture.',
        image:
          'https://images.unsplash.com/photo-1581093458799-ee1e9d7b6a31?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
      },
      {
        title: 'Novel Delivery Systems for RNA-Based Pesticides',
        date: '2025-04-22',
        journal: 'Plant Biotechnology Journal',
        abstract:
          'Study on innovative nanocarriers for enhancing RNA stability and cellular uptake in pest control applications.',
        image:
          'https://images.unsplash.com/photo-1581094271901-8022df4466f9?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
      },
      {
        title: 'Identification of Essential Genes for RNAi-Based Control of Lepidopteran Pests',
        date: '2025-03-10',
        journal: 'Pest Management Science',
        abstract:
          'Genome-wide screening reveals novel target genes for species-specific control of major agricultural pests.',
        image:
          'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
      },
    ]
  // 行业动态
  const industry = [
      {
        title:
          'From RNAi to fungal vaccines: BioEx 2025 reveals a new revolution in agricultural biotechnology',
        date: '2025-06-21',
        journal: 'Industry trends',
        abstract:
          'As global agriculture faces multiple challenges such as reducing the use of chemical pesticides, responding to climate change and ensuring food security, the 6th International Summit on Biopesticides, Biostimulants and Biofertilizers (BioEx 2025) will be held in Shanghai from March 13 to 14, bringing together leading researchers and innovative companies from around the world to discuss cutting-edge technologies and development trends in bio-agriculture.',
        image:
          'https://th.bing.com/th/id/R.888e79cd1657d405ebfd568779e72179?rik=WAyajhODhIwBhQ&riu=http%3a%2f%2fwww.sciento.cn%2fuploads%2fkindeditor417%2fimage%2f20221116%2f20221116075954_42642.jpg&ehk=XWzVZC7iHCtZKzCiikwommlRSF7jcEhkABKY%2bRl%2fXx8%3d&risl=&pid=ImgRaw&r=0',
      },
    ]



    // 特性
    const features = [
      {
        title: 'Professional Team',
        description:
          'Maintained by experts in RNA and agricultural biotechnology fields with extensive research experience.',
        icon: 'groups',
      },
      {
        title: 'Continuous Updates',
        description:
          'Regular collection and addition of the latest research data from scientific literature and experiments.',
        icon: 'sync',
      },
      {
        title: 'Data Quality',
        description:
          'All data undergoes rigorous review and validation by domain experts to ensure accuracy.',
        icon: 'verified',
      },
      {
        title: 'Open Access',
        description:
          'Most data freely available for research and development purposes to advance scientific progress.',
        icon: 'lock_open',
      },
    ]

    // 页脚链接
    const footerLinks = ['Home', 'User Guide', 'PubMed', 'CABI', 'Web of Science', 'About Us']

    return {
       searchField,
      searchKeyword,
      searchOptions,
      searchResults,
      resultColumns,
      typeColors,
      performSearch,
      clearSearch,
      navLinks,
      stats,
      rnaFeatures,
      chemicalFeatures,
      methods,
      species,
      visualizations,
      publications,
      imagePath,
      industry,
      features,
      footerLinks,
    }
  },
}
</script>

<style lang="scss" scoped>
// 定义CSS变量
:root {
  --primary: #3596b7;
  --secondary: #4c8e95;
  --accent: #d68c45;
  --light: #fefee3;
  --dark: #1d3523;
  --gray: #6c757d;
  --light-gray: #f8f9fa;
}

// 通用样式
.container {
  width: 100%;
  max-width: 1300px;
  margin: 0 auto;
  padding: 0 20px;
}

// 搜索区域
.search-section {
  padding: 2.5rem 0;
}
.search-results {
  max-height: 600px;
  overflow: auto;
  border: 1px solid #e0e0e0;

  .q-table {
    th {
      font-weight: bold;
      background-color: #f5f7fa;
    }

    tr:nth-child(even) {
      background-color: #f9f9f9;
    }
  }
}
.search-box {
  max-width: 900px;
  margin: 0 auto;
  background: white;
  border-radius: 50px;
  padding: 5px;
  display: flex;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
}

.search-examples {
  margin-top: 1.5rem;
  color: var(--dark);
  font-size: 0.95rem;

  .example-label {
    color: var(--dark);
    font-weight: 600;
  }

  .example-bold {
    font-weight: bold;
    color: var(--primary);
  }

  .example-italic {
    font-style: italic;
    font-weight: bold;
    color: var(--primary);
  }
}

// 主视觉区域
.hero {
  background:
    linear-gradient(135deg, rgba(5, 151, 200, 0.9) 0%, rgba(126, 189, 214, 0.9) 100%),
    url('https://images.unsplash.com/photo-1616382093586-84ed7932c216?q=80&w=2076&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D');
  background-size: cover;
  background-position: center;
  padding: 4rem 0;
}

.hero-content {
  max-width: 900px;
  margin: 0 auto;
}

// 统计卡片
.stat-item {
  transition:
    transform 0.3s,
    box-shadow 0.3s;
    width: 250px;

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 20px rgba(0, 0, 0, 0.15) !important;
  }
}
.image-container {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

// 对比表格
.comparison-table {
  .table-row {
    width: 100%;
    display: flex;

    .table-cell {
      padding: 0.5rem;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    .category-cell {
      flex: 0 0 200px;
      text-align: center;
      font-weight: 700;
      font-size: 1.2rem;

      .category-icon {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 15px;
        font-size: 1.5rem;
      }
    }

    .rna-cell {
      background-color: #deebf7;

      .category-icon {
        background-color: rgba(255, 255, 255, 0.3);
        color: #2f5597;
      }
    }

    .chemical-cell {
      background-color: #fbe5d6;

      .category-icon {
        background-color: rgba(255, 255, 255, 0.3);
        color: #c55a11;
      }
    }

    .feature-cell {
      flex: 1;
      border-left: 1px solid rgba(0, 0, 0, 0.05);
    }
  }
}

// 方法卡片
.methods-container {
  gap: 20px; /* 增加卡片之间的间隙 */
}
.method-card {
  transition:
    transform 0.3s,
    box-shadow 0.3s;

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15) !important;
  }
}

// 物种卡片
.species-container {
  gap: 30px; /* 增加卡片之间的间隙 */
}
.species-card {
  transition: all 0.3s;
  width: 240px;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1) !important;
  }
}

// 可视化卡片
.vis-card {
  transition: transform 0.3s;

  &:hover {
    transform: translateY(-8px);
  }
}

// 出版物卡片
.vis-container{
   gap: 30px; /* 增加卡片之间的间隙 */
}
.pub-card {
  transition: transform 0.3s;

  &:hover {
    transform: translateY(-5px);
  }
} /* 添加负边距来上移标题 */
.section-title.raised-up {
  margin-top: -15px; /* 上移15px */
  margin-bottom: 25px; /* 增加底部间距以保持整体布局 */
}

// 特性卡片
.features-container
{
   gap: 30px; /* 增加卡片之间的间隙 */
}
.feature-card {
  transition: transform 0.3s;

  &:hover {
    transform: translateY(-5px);
  }
}

// 响应式设计
@media (max-width: 768px) {
  .nav-links {
    display: none !important;
  }

  .stats-container,
  .methods-container,
  .species-container,
  .guide-container,
  .vis-container,
  .features-container {
    flex-direction: column;
    align-items: center;

  }

  .stat-item,
  .method-card,
  .species-card,
  .guide-card,
  .vis-card,
  .feature-card {
    width: 100%;
    max-width: 350px;
    margin-bottom: 1.5rem;
  }

  .pub-container {
    grid-template-columns: 1fr;
  }

  .comparison-row {
    flex-direction: column;
  }

  .comparison-title {
    width: 100%;
    margin-bottom: 1rem;
  }

  .comparison-item {
    width: 100%;
  }

  .form-row {
    flex-direction: column;
    gap: 1.5rem;
  }
}
</style>
