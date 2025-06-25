<!-- src/layouts/MainLayout.vue -->
<template>
  <q-layout view="hHh Lpr lFf">
    <!-- Top toolbar -->
    <q-header elevated>
      <q-toolbar>
        <!-- Constant title -->
        <q-toolbar-title>
          <q-avatar> <img src="/picture/logo.png" /> </q-avatar>RNA Pesticide Database
        </q-toolbar-title>

        <!-- Dynamic nav menu -->
        <div v-if="menuRoutes.length" class="row items-center">
          <q-btn
            v-for="r in menuRoutes"
            :key="r.name"
            flat
            :label="r.meta.title || capitalize(r.name)"
            :to="`/${r.path}`"
            exact
          />
        </div>
      </q-toolbar>
    </q-header>

    <!-- Main content area -->
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'

// Grab the router instance
const router = useRouter()

// We assume your routes are structured under the top-level "/" route:
const topRoute = router.options.routes.find((r) => r.path === '/')

// Filter only those children you want in the menu:
const menuRoutes = computed(() => {
  if (!topRoute || !Array.isArray(topRoute.children)) return []
  return topRoute.children.filter((r) => r.meta?.showMenu !== false)
})

// Simple helper to Capitalize fallback labels
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}
</script>

<style scoped>
/* optional spacing */
.q-toolbar-title {
  min-width: 250px;
}
.q-toolbar .row {
  gap: 8px;
}
</style>
