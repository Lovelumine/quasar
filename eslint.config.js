import js from '@eslint/js'
import globals from 'globals'
import pluginVue from 'eslint-plugin-vue'
import pluginQuasar from '@quasar/app-vite/eslint'
import prettierSkipFormatting from '@vue/eslint-config-prettier/skip-formatting'

// 引入实际的解析器对象
import vueEslintParser from 'vue-eslint-parser'
import tsParser from '@typescript-eslint/parser'

export default [
  // 顶层配置：支持 TSX/JSX 并使用 vue-eslint-parser + @typescript-eslint/parser
  {
    ignores: [],
    languageOptions: {
      parser: vueEslintParser,
      parserOptions: {
        parser: tsParser,
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
  },

  // Quasar 推荐配置
  ...pluginQuasar.configs.recommended(),
  // JS 推荐配置
  js.configs.recommended,

  // Vue flat essential
  ...pluginVue.configs['flat/essential'],

  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
        process: 'readonly',
        ga: 'readonly',
        cordova: 'readonly',
        Capacitor: 'readonly',
        chrome: 'readonly',
        browser: 'readonly',
      },
    },
    rules: {
      'prefer-promise-reject-errors': 'off',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    },
  },

  {
    files: ['src-pwa/custom-service-worker.js'],
    languageOptions: {
      globals: {
        ...globals.serviceworker,
      },
    },
  },

  // 跳过 Prettier 格式化
  prettierSkipFormatting,
]
