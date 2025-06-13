import DatabasePage from 'pages/DatabasePage.vue'

const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      // 首页指向数据库页面
      {
        path: '',
        name: 'home',
        component: DatabasePage,
      },

      // 数据库页面也可以有单独的路由
      {
        path: 'database',
        name: 'database',
        component: DatabasePage,
      },

      // 测试页面
      {
        path: 'test',
        name: 'test',
        component: () => import('pages/TestPage.vue'),
      },
    ],
  },

  // 通配路由必须放在最后（捕获所有未匹配的路由）
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
