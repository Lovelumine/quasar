<template>
  <div class="q-pa-md">
    <!-- 主卡片容器 -->
    <q-card flat bordered class="my-card text-left">
      <q-card-section>
        <!-- 介绍 -->
        <h3>1. Introduction</h3>
        <p>This section will briefly introduce the RNA Pesticide Database. By reading this section, you will understand the information our database contains, how to cite our database, and how to contact us.</p>
      </q-card-section>

      <!-- 关于RNA农药数据库 -->
      <q-card-section>
        <h4>1.1 About RNA Pesticide Database</h4>
        <p>The RNA Pesticide Database provides information on pesticides based on RNA interference (RNAi), mainly including five types of data: HIGS (host-induced gene silencing), MIGS (microbial-induced gene silencing), SIGS (spray-induced gene silencing), VIGS (virus-induced gene silencing) and potential pesticides. The database collects RNAi target sequences, effectiveness data and application methods for a variety of crop pests, providing a scientific basis for agricultural pest control.</p>
      </q-card-section>

      <!-- 数据库构建方法 -->
      <q-card-section>
        <h4>1.2 Database construction and data processing methods</h4>

          <h6 style="margin-left: 50px">Q: Where does our data come from?</h6>
          <p style="margin-left: 50px">The data are derived from published scientific literature, patent databases and laboratory research results, covering RNAi targets for a variety of crop pests.</p>
           <q-img src="images/data_source.png" alt="数据来源图示" class="image-placeholder"/>

          <h6 style="margin-left: 50px">Q: What is our data processing process?</h6>
          <p style="margin-left: 50px">The original data were quality controlled, standardized and cross-validated to ensure the accuracy and reliability of the data.</p>
           <q-img src="images/data_processing.png" alt="数据处理流程" class="image-placeholder"/>

          <h6 style="margin-left: 50px">Q: How does the RNA Pesticide Database present data?</h6>
          <p style="margin-left: 50px">The data are categorized by pest species, crop type and RNAi method, providing detailed target sequences, mechanisms of action and efficacy assessments.</p>
          <q-img src="data_presentation.png" alt="数据呈现方式" class="image-placeholder" />
      </q-card-section>

      <!-- 如何引用 -->
      <q-card-section>
        <h4>1.3 How to cite the RNA pesticide database</h4>
        <p>If you use this database in your research, please cite:<br>
        <em>RNA Pesticide Database: A comprehensive resource for RNAi-based pest control. (2025)</em></p>
      </q-card-section>

      <!-- 联系方式 -->
      <q-card-section>
        <h4>1.4 How to contact us</h4>
        <p>For any questions or suggestions about the RNA pesticide database,please contact us at<em>zhengchx28@mail2.sysu.edu.cn.</em>  </p>
      </q-card-section>
    </q-card>

    <!-- 用户教程部分 -->
    <q-card flat bordered class="my-card text-left">
      <q-card-section>
        <h3>2. User Tutorial</h3>
        <p>By reading this section, you will learn how to navigate and search for the required information in the RNA pesticide database. Below we have provided screenshots of various parts of the user interface, with key information marked in red boxes.</p>
      </q-card-section>

      <!-- HIGS部分 -->
      <q-card-section>
        <h4>2.1 HIGS (Host-induced gene silencing)</h4>
        <p>The HIGS section provides data on RNA interference pesticides achieved through genetically modified crops. You can filter the data by crop type or target pest to view the target gene sequence, transformation method, and control effect.
</p>
        <q-img src="images/higs_interface.png" alt="HIGS界面" class="image-placeholder"/>
      </q-card-section>

      <!-- MIGS部分 -->
      <q-card-section>
        <h4>2.2 MIGS (Microbial-induced gene silencing)</h4>
        <p>The MIGS section contains data on the use of engineered microbes to deliver RNAi pesticides. You can query the microbial vector type, target gene, and field trial results.</p>
        <q-img src="images/migs_interface.png" alt="MIGS界面" class="image-placeholder"/>
      </q-card-section>

      <!-- SIGS部分 -->
      <q-card-section>
        <h4>2.3 SIGS (Spray-induced gene silencing)</h4>
        <p>The SIGS section provides data on RNA pesticide formulations that can be sprayed directly, including dsRNA sequences, nanocarrier formulations, stabilizers, and application concentration recommendations.</p>
        <q-img src="images/sigs_interface.png" alt="SIGS界面" class="image-placeholder"/>
      </q-card-section>

      <!-- VIGS部分 -->
      <q-card-section>
        <h4>2.4 VIGS (Virus-induced gene silencing)</h4>
        <p>The VIGS section contains data on the use of viral vectors to deliver RNA interference factors, providing viral vector information, target genes, and safety assessments.</p>
        <q-img src="images/vigs_interface.png" alt="VIGS界面" class="image-placeholder"/>
      </q-card-section>

      <!-- 潜在农药部分 -->
      <q-card-section>
        <h4>2.5 Potential pesticides</h4>
        <p>The potential pesticides section includes RNAi targets that have not yet been commercialized but have potential, including computer-predicted high-efficiency targets and laboratory verification results.</p>
        <q-img src="images/potential_interface.png" alt="潜在农药界面" class="image-placeholder"/>
      </q-card-section>

      <!-- BLAST功能 -->
      <q-card-section>
        <h4>2.6 BLAST sequence alignment</h4>
        <p>Use the BLAST function to align your sequence with target sequences in the database to find homologous targets and possible cross-reactivity.</p>
        <q-img src="images/blast_interface.png" alt="BLAST界面" class="image-placeholder"/>
        <p>Operation steps：<br>
        1. Paste your sequence or upload the sequence file on the BLAST page<br>
        2. Select the alignment parameters and database subset<br>
        3. Submit the alignment and view the results</p>
      </q-card-section>

      <!-- 下载功能 -->
      <q-card-section>
        <h4>2.7 Data download</h4>
        <p>You can get all or part of the database from the "Downloads" section.</p>
        <q-img src="images/download_interface.png" alt="下载界面" class="image-placeholder"/>
        <p>The downloaded data can be used for further analysis or integrated into your research project.</p>
      </q-card-section>
    </q-card>

    <!-- 更新与新闻 -->
    <q-card flat bordered class="my-card text-left">
      <q-card-section>
        <h3>3. Updates and News</h3>
        <p>2025-1-10，Started to build RNA pesticide database and collect HIGS related literature and data.</p>
        <p>2025-2-15，Completed SIGS data collation and added spray stability test results.</p>
        <p>2025-3-22，Integrate MIGS and VIGS datasets and establish a standardized data format.</p>
        <p>2025-4-18，Implement BLAST comparison function and optimize sequence search algorithm.</p>
        <p>2025-5-30，Added a potential pesticide prediction module, including efficient targets predicted by machine learning.</p>
        <p>2025-6-25，The website interface optimization has been completed and the RNA pesticide database is officially launched.
</p>
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'RNAPesticideHelpPage',
  data() {
    return {
      // 可以在这里添加动态数据
    }
  }
})
</script>

<style scoped>
.my-card {
  margin-top: 20px;
  margin-bottom: 20px;
  width: 80%;
  margin-left: auto;
  margin-right: auto;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

h2, h3, h4 {
  color: #086ed4;
  margin-bottom: 20px;
  margin-left: 30px;
  margin-right: 30px;
}

h3 {
  border-bottom: 2px solid #889aa8;
  padding-bottom: 10px;
}

p {
  margin-left: 30px;
  margin-right: 30px;
  font-size: 16px;
  line-height: 1.6;
}

em {
  font-style: italic;
  color: #086ed4;
}

.image-placeholder {
  max-width: 90%;
  display: block;
  margin: 20px auto;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.text-left {
  text-align: left;
}

@media (max-width: 768px) {
  .my-card {
    width: 95%;
  }

  h2, h3, h4, p {
    margin-left: 15px;
    margin-right: 15px;
  }
}
</style>
