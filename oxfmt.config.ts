import { defineConfig } from 'oxfmt'

export default defineConfig({
  printWidth: 80,
  tabWidth: 2,
  // 使用单引号
  singleQuote: true,
  // 不要分号
  semi: false,
  // 关键：让>和最后一个属性同行，不单独换行
  bracketSameLine: true,
})
