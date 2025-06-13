<!-- src/layouts/MainLayout.vue -->
<template>
  <q-layout view="hHh Lpr lFf">
    <!-- 可选：顶部导航栏 -->
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title>
          RNA农药数据库
        </q-toolbar-title>

        <!-- 导航菜单 -->
        <q-btn flat label="首页" to="/" exact />
        <q-btn flat label="数据库" to="/database" exact />
        <q-btn flat label="测试" to="/test" exact />
      </q-toolbar>
    </q-header>

    <!-- 页面内容容器 -->
    <q-page-container>
      <!-- 这里是路由内容渲染的地方 -->
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'MainLayout'
});
</script>


