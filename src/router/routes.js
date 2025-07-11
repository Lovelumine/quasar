// src/router/routes.js

import HomePage from 'src/pages/home/HomePage.vue'
import SigePage from 'src/pages/Sigs/SigePage.vue'
import HigsPage from 'pages/higs/HigsPage.vue'
import MigsPage from 'src/pages/MigsAndVigs/MigsPage.vue'
import VigsPage from 'src/pages/MigsAndVigs/VigsPage.vue'
import PotentialTargetGenesPage from 'src/pages/PotentialTargetGenes/PotentialTargetGenesPage.vue'
import AboutPage from 'src/pages/About/AboutPage.vue'
import HelpPage from 'src/pages/Help/HelpPage.vue'

import VigsDetail from 'src/pages/MigsAndVigs/VigsDetail.vue'

const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '/',
        component: HomePage,
        meta: {
          title: 'Home',
          showMenu: true,
        },
      },

      // SIGS page
      {
        path: 'sigs',
        name: 'sigs',
        component: SigePage,
        meta: {
          title: 'SIGS',
          showMenu: true,
        },
      },

      // HIGS page
      {
        path: 'higs',
        name: 'higs',
        component: HigsPage,
        meta: {
          title: 'HIGS',
          showMenu: true,
        },
      },

      // MIGS page
      {
        path: 'migs',
        name: 'migs',
        component: MigsPage,
        meta: {
          title: 'MIGS',
          showMenu: true,
        },
      },

      //VIGS Page
      {
        path: 'vigs',
        name: 'vigs',
        component: VigsPage,
        meta: {
          title: 'VIGS',
          showMenu: true,
        },
      },
      {
        path: 'vigs/:key',
        name: 'vigs-detail',
        component: VigsDetail,
        meta: { title: 'VIGS Detail', showMenu: false },
      },

      // Potential Target Genes page
      {
        path: 'potential-target-genes',
        name: 'potential-target-genes',
        component: PotentialTargetGenesPage,
        meta: {
          title: 'Potential Target Genes',
          showMenu: true,
        },
      },

      // Potential Target Genes page
      {
        path: 'about',
        name: 'about',
        component: AboutPage,
        meta: {
          title: 'About',
          showMenu: true,
        },
      },

      // Potential Target Genes page
      {
        path: 'help',
        name: 'help',
        component: HelpPage,
        meta: {
          title: 'Help',
          showMenu: true,
        },
      },
    ],
  },

  // Catch-all 404
  {
    path: '/:catchAll(.*)*',
    name: 'not-found',
    component: () => import('src/components/ErrorNotFound.vue'),
    meta: {
      title: 'Page Not Found',
      showMenu: false,
    },
  },
]

export default routes
