import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetTypography,
  // presetWebFonts,
  presetWind3,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'
// loader helpers
import { FileSystemIconLoader } from '@iconify/utils/lib/loader/node-loaders'
// 预设了用于边框和文本的渐变效果。 https://unocss-preset-advance-gradients.itsmnthn.dev/
import { presetAdvanceGradients } from 'unocss-preset-advance-gradients'
// 渐变动画效果
import { presetEasingGradient } from 'unocss-preset-easing-gradient'
// 一组辅助过渡效果的实用类目，方便地为项目添加流畅且逼真的动画效果。
import presetEase from 'unocss-preset-ease'
// 动画实用类 https://unocss-preset-animations.aelita.me/
import { presetAnimations } from 'unocss-preset-animations'
// 提供类名简写及额外一些样式(包含动画类) https://unocss-preset-extra.moomfe.com/rules/size
import { presetExtra } from 'unocss-preset-extra'
// 动画库 https://docs.rombo.co/tailwind
// @ts-ignore
import { presetTailwindMotion } from 'unocss-preset-tailwindcss-motion'
// 滚动条预设 https://github.com/unocss-community/unocss-preset-scrollbar/blob/HEAD/README.zh-CN.md
import { presetScrollbar } from 'unocss-preset-scrollbar'

export default defineConfig({
  shortcuts: [
    // key-value形式
    {
      'navbar-bg-hover': 'dark:text-white dark:hover:bg-[#242424]!',
      // flex
      'flex-c': 'flex justify-center items-center',
      'flex-ac': 'flex justify-around items-center',
      'flex-bc': 'flex justify-between items-center',
      // 滚动条样式
      'custom-scrollbar': `scrollbar scrollbar-rounded scrollbar-w-6px
      [&::-webkit-scrollbar-thumb]:hidden [&::-webkit-scrollbar-thumb]:hover:[display:inherit]
      scrollbar-thumb:(bg-[var(--el-border-color-light)]! cursor-pointer)
      hover:scrollbar-thumb:(bg-[var(--el-border-color-dark)]!)`,
      // 背景base：覆盖+居中+不重复（最常用的背景图基础样式）
      'bg-base': 'bg-[length:100%_100%] bg-no-repeat bg-fixed',
      // 边框base
      'border-base': 'border border-solid border-pink-500',
      'border-chart': 'border-base border-violet-700',
      // grid base
      'grid-base': 'grid content-start gap-2',
      // 定位居中
      'absolute-center':
        'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
      // 定位横向居中
      'absolute-x-center': 'absolute left-1/2 -translate-x-1/2',
    },
    // 数组形式
    [
      'btn',
      'px-4 py-1 rounded inline-block bg-teal-600 text-white cursor-pointer hover:bg-teal-700 disabled:cursor-default disabled:bg-gray-600 disabled:opacity-50',
    ],
    [
      'icon-btn',
      'text-[0.9em] inline-block cursor-pointer select-none opacity-75 transition duration-200 ease-in-out hover:opacity-100 hover:text-teal-600',
    ],
  ],
  rules: [
    [
      'animate-scale-bounce',
      { animation: 'pure-scale-bounce 0.3s ease-in-out' },
    ],
    // 能完美匹配 border-(--pure-border-color)、border-(--main-color) 等任意带横线的变量
    // vue中，会把 border-(--pure-border-color) 转换成 border---pure-border-color
    [
      /^border---([\w-]+)$/,
      ([, name]) => ({ 'border-color': `var(--${name})` }),
    ],
    [/^text---([\w-]+)$/, ([, name]) => ({ color: `var(--${name})` })],
    [
      /^bg---([\w-]+)$/,
      ([, name]) => ({ 'background-color': `var(--${name})` }),
    ],
  ],
  theme: {
    colors: {
      bg_color: 'var(--el-bg-color)',
      primary: 'var(--el-color-primary)',
      text_color_primary: 'var(--el-text-color-primary)',
      text_color_regular: 'var(--el-text-color-regular)',
    },
  },
  presets: [
    presetWind3(),
    presetAttributify({
      // 强制前缀使用，避免和组件、html元素属性冲突(https://unocss.dev/presets/attributify#options)
      prefix: 'un-',
      prefixedOnly: true, // <--
    }),
    presetIcons({
      // https://unocss.nodejs.cn/presets/icons
      extraProperties: {
        display: 'inline-block',
        'vertical-align': 'middle',
        // ...
      },
      // 自定义图标加载器
      collections: {
        // 若需要使用该路径下的shop.svg，则对应的类名为 i-custom-icons:shop
        // key为集合的名字，格式为：i-集合名:图标名
        'custom-icons': FileSystemIconLoader('src/assets/svg'),
      },
      // 全局自定义图标转换
      customizations: {
        transform(svg) {
          // ?mask模式下，图表颜色跟随当前字体颜色
          // return svg.replace(/fill\s*=\s*["']?#?[0-9a-fA-F]+["']?/g, 'fill="currentColor"');
          // 进替换白色
          return svg.replace(/#fff/, 'currentColor')
        },
        // 图标/集合定制
        iconCustomizer(collection, icon, props) {
          // customize all icons in this collection
          // if (collection === "custom-icons") {
          //   props.width = "2em";
          //   props.height = "2em";
          // }
        },
      },
    }),
    presetTypography(),
    presetAdvanceGradients(),
    presetEasingGradient({
      // optional: add custom easing functions
      // customFunctions: {
      //   myCustomEasing: t => t * t * (3 - 2 * t)
      // },
      // // optional: change default number of steps (default is 4)
      // defaultSteps: 6
    }),
    presetEase(),
    presetAnimations(/* options */),
    presetExtra(),
    presetTailwindMotion(),
    presetScrollbar({
      scrollbarTrackColor: 'transparent',
    }),
  ],
  // 配置别名解析
  // alias: {
  //   "@": path.resolve(__dirname, "src") // 把 @ 映射到 src 目录
  // },
  transformers: [transformerDirectives(), transformerVariantGroup()],
  // 全局样式,原始 CSS 注入（对应 Tailwind 的 @layer base 中的 border-color 重置）
  preflights: [
    // {
    //   // 集成daisyUI的CSS文件
    //   getCSS: () => `
    //     @layer base {
    //       @import "daisyui/daisyui.css";
    //     }
    //   `,
    // },
  ],
  // 把hover-3d、用到的工具类加入白名单，强制打包样式
  // safelist: ['hover-3d'],
})
