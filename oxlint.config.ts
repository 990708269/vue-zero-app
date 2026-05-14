// oxlint.config.ts
import { defineConfig } from 'oxlint'

export default defineConfig({
  // 新版 oxlint 不支持 extends 字符串！直接删掉！
  // plugins: ['typescript'],

  categories: {
    correctness: 'warn',
  },

  env: {
    browser: true,
    node: true,
    es2021: true,
  },

  ignorePatterns: ['node_modules/', 'dist/', 'build/', 'public/', 'coverage/'],

  rules: {
    // ======================================
    // ✅ 核心：彻底关闭 未使用变量 报错（你要的！）
    // ======================================
    'no-unused-vars': 0,

    // ======================================
    // 其他基础质量规则（可选）
    // ======================================
    // 'ellint/no-debugger': 'off',
    // 'no-undef': 'error',
    // 'prefer-const': 'warn',
    // 'no-var': 'error',
    // 'eqeqeq': ['warn', 'always'],

    // ======================================
    // ✅ 一键关闭所有格式检查（给 oxfmt 用）
    // ======================================
    // 缩进、引号、分号、空格、逗号、换行 全部关闭
    indent: 'off',
    quotes: 'off',
    semi: 'off',
    'comma-dangle': 'off',
    'object-curly-spacing': 'off',
    'array-bracket-spacing': 'off',
    'key-spacing': 'off',
    'space-infix-ops': 'off',
    'arrow-spacing': 'off',
    'no-trailing-spaces': 'off',
    'eol-last': 'off',
    'linebreak-style': 'off',
    'padded-blocks': 'off',
    'func-call-spacing': 'off',
  },
})
