<template>
  <q-page class="column items-center">
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
              <q-icon name="mdi-spray-bottle" size="40px" color="primary" />
              <div class="text-h6 q-mt-sm">SIGS</div>
              <div class="text-subtitle2">Spray-induced Gene Silencing Database.</div>
            </q-card-section>
          </q-card>
        </router-link>

        <router-link to="/HIGS" class="no-underline">
          <q-card flat bordered class="function-card">
            <q-card-section>
              <q-icon name="mdi-sprout" size="40px" color="primary" />
              <div class="text-h6 q-mt-sm">HIGS</div>
              <div class="text-subtitle2">Host-induced Gene Silencing Database.</div>
            </q-card-section>
          </q-card>
        </router-link>

        <q-card flat bordered class="function-card">
          <q-card-section>
            <q-icon name="mdi-microscope" size="40px" color="primary" />
            <div class="text-h6 q-mt-sm">MIGS</div>
            <div class="text-subtitle2">Microbe-induced Gene Silencing Database.</div>
          </q-card-section>
        </q-card>

        <q-card flat bordered class="function-card">
          <q-card-section>
            <q-icon name="mdi-virus-outline" size="40px" color="primary" />
            <div class="text-h6 q-mt-sm">VIGS</div>
            <div class="text-subtitle2">Virus Induced Gene Silencing Database.</div>
          </q-card-section>
        </q-card>

        <q-card flat bordered class="function-card">
          <q-card-section>
            <q-icon name="mdi-compare-horizontal" size="40px" color="primary" />
            <div class="text-h6 q-mt-sm">BLAST</div>
            <div class="text-subtitle2">Bio-sequence similarity alignment search.</div>
          </q-card-section>
        </q-card>

        <q-card flat bordered class="function-card">
          <q-card-section>
            <q-icon name="mdi-cloud-download" size="40px" color="primary" />
            <div class="text-h6 q-mt-sm">Download</div>
            <div class="text-subtitle2">
              Provide downloadable files of data used in the database.
            </div>
          </q-card-section>
        </q-card>

        <q-card flat bordered class="function-card">
          <q-card-section>
            <q-icon name="mdi-help-rhombus-outline" size="40px" color="primary" />
            <div class="text-h6 q-mt-sm">Help</div>
            <div class="text-subtitle2">Provide methods on how to use the database website.</div>
          </q-card-section>
        </q-card>

        <q-card flat bordered class="function-card">
          <q-card-section>
            <q-icon name="mdi-account-circle-outline" size="40px" color="primary" />
            <div class="text-h6 q-mt-sm">About us</div>
            <div class="text-subtitle2">Find more information about web builders here.</div>
          </q-card-section>
        </q-card>
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

// Lightbox 状态管理
const lightboxVisible = ref(false)
const lightboxIndex = ref(0)
const lightboxImgs = ['picture/dataimg.jpg']

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
</style>
