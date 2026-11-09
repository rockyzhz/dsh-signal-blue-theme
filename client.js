/**
 * dsh-signal-blue-theme —— 浏览器半边。
 *
 * 做法：不注册新主题、不写 ThemeRuntime 的 preference，而是用
 * `ctx.theme.overrideTokens()` 在官方主题之上叠一层 token 覆盖。
 * 明暗仍由官方「外观」行控制（light / dark / system），我们只换颜色，
 * 两个轴互不干扰。
 *
 * 覆盖策略与 dsh-theme-palette 同源：
 *   1. 先改「品牌色阶」`--dsw-static-deepseek-*`。官方别名几乎都是
 *      `var(--dsw-static-deepseek-500)` 这类引用，色阶一换，link、
 *      按钮填充、业务状态色整族自动跟随，不会出现半套颜色。
 *   2. 再补字面量别名：纸面、墨色文字、边框、代码块底、侧栏。
 *      这些在官方样式表里是硬编码值，改色阶带不动。
 *
 * 色阶在 OKLCH 空间重建：色相固定 265.9°（信号蓝自身的色相），
 * 明度按档位阶梯排，彩度向两端递减，并做了 sRGB 色域夹取。
 * 关键档位实测（WCAG 2.1）：
 *   500 #1b3bff 在纸色 #fafaf8 上 6.45:1；白字压 500 上 6.74:1
 *   400 #5684ff 在深底 #121110 上 5.51:1
 */
window.__ModuleLoader__.load({
  id: 'dsh-signal-blue-theme',
  factory() {
    'use strict'

    /** 覆盖层的来源标识；同一来源重复调用会整体替换。 */
    const SOURCE = 'dsh-signal-blue-theme'

    /**
     * 信号蓝色阶。500 是锚点（#1B3BFF），其余档按 OKLCH 明度阶梯生成。
     * 浅色下的 link 走 500，深色下的 link 走 400。
     */
    const SCALE = {
      50: '#f0f5ff',
      100: '#e0eaff',
      200: '#c3d6ff',
      300: '#9dbbff',
      400: '#5684ff',
      450: '#3564ff',
      500: '#1b3bff',
      600: '#1428e1',
      800: '#091795',
      900: '#061374',
    }

    /** token → { light, dark }；overrideTokens 要求两种模式都给值。 */
    const TOKENS = {}

    // ① 品牌色阶：link / 按钮 / 业务状态色整族跟随
    for (const [step, hex] of Object.entries(SCALE)) {
      TOKENS[`--dsw-static-deepseek-${step}`] = { light: hex, dark: hex }
    }

    // ② 字面量别名：纸面、墨色、边框、代码块、侧栏
    Object.assign(TOKENS, {
      // 纸面：底色是暖白纸，卡片留在纯白，于是卡片像压在纸上
      '--dsw-alias-bg-base': { light: '#fafaf8', dark: '#121110' },
      '--dsw-alias-bg-layer-1': { light: '#ffffff', dark: '#1c1a17' },
      '--dsw-alias-bg-layer-2': { light: '#ffffff', dark: '#1c1a17' },
      '--dsw-alias-bg-layer-3': { light: '#efece5', dark: '#262320' },
      '--dsw-alias-bg-overlay': { light: '#efece5', dark: '#262320' },
      '--dsw-alias-bg-module-platform': { light: '#efece5', dark: '#262320' },
      '--dsw-alias-bg-multi-select': { light: '#efece5', dark: '#262320' },
      '--dsw-alias-bg-skeleton': { light: 'rgba(26, 22, 16, 0.06)', dark: 'rgba(242, 239, 232, 0.08)' },

      // 墨色文字：主文墨黑，次级与三级灰各让出一档
      '--dsw-alias-label-primary': { light: '#0a0a0a', dark: '#f2efe8' },
      '--dsw-alias-label-primary-bluish': { light: '#0a0a0a', dark: '#f2efe8' },
      '--dsw-alias-label-primary-dimmed': { light: '#0a0a0a', dark: '#f2efe8' },
      '--dsw-alias-label-secondary': { light: '#4f4f4f', dark: '#b5afa3' },
      '--dsw-alias-label-tertiary': { light: '#6e6e6e', dark: '#857f73' },
      '--dsw-alias-label-caption': { light: '#6e6e6e', dark: '#857f73' },
      '--dsw-alias-label-dimmed': { light: 'rgba(10, 10, 10, 0.45)', dark: 'rgba(242, 239, 232, 0.45)' },

      // 品牌黑：主按钮与强调文字仍是墨色，蓝色只做标记
      '--dsw-alias-brand-primary': { light: '#0a0a0a', dark: '#f2efe8' },
      '--dsw-alias-brand-primary-invert': { light: '#0a0a0a', dark: '#f2efe8' },
      '--dsw-alias-brand-text': { light: '#0a0a0a', dark: '#f2efe8' },
      '--dsw-alias-button-primary-fill': { light: '#0a0a0a', dark: '#f2efe8' },
      '--dsw-alias-button-primary-hover': { light: '#262626', dark: '#dcd7cc' },
      '--dsw-alias-button-info-fill': { light: '#1b3bff', dark: '#1b3bff' },
      '--dsw-alias-button-info-hover': { light: '#1428e1', dark: '#3564ff' },

      // 发丝线：暖灰，不用纯黑半透明，否则暖纸底上会发脏
      '--dsw-alias-border-l1': { light: 'rgba(26, 22, 16, 0.08)', dark: 'rgba(242, 239, 232, 0.08)' },
      '--dsw-alias-border-l2': { light: 'rgba(26, 22, 16, 0.12)', dark: 'rgba(242, 239, 232, 0.12)' },
      '--dsw-alias-border-l2-darkmode-thin': { light: 'rgba(26, 22, 16, 0.12)', dark: 'rgba(242, 239, 232, 0.08)' },
      '--dsw-alias-border-l3': { light: 'rgba(26, 22, 16, 0.18)', dark: 'rgba(242, 239, 232, 0.18)' },
      '--dsw-alias-border-l4': { light: 'rgba(26, 22, 16, 0.26)', dark: 'rgba(242, 239, 232, 0.26)' },

      // 代码块：比纸面再沉一档，仍属同一族暖灰
      '--dsw-alias-markdown-code-block': { light: '#f2f0eb', dark: '#0c0b0a' },
      '--dsw-alias-markdown-code-block-banner': { light: '#e9e6df', dark: '#151311' },
      '--dsw-alias-markdown-inline-code': { light: '#f2f0eb', dark: '#0c0b0a' },
      '--dsw-alias-markdown-code-segment-selected': { light: '#e9e6df', dark: '#151311' },
      '--dsw-alias-markdown-code-segment-unselected': { light: '#f2f0eb', dark: '#0c0b0a' },

      // 业务状态色：这里就是信号蓝出现的地方
      '--dsw-alias-state-business-primary': { light: '#1b3bff', dark: '#5684ff' },
      '--dsw-alias-state-business-tertiary': { light: 'rgba(27, 59, 255, 0.10)', dark: 'rgba(86, 132, 255, 0.14)' },

      // 侧栏、菜单、气泡：跟纸面同族，避免蓝色系的中性色混进来
      '--dsw-specific-sidebar-fill': { light: '#efece5', dark: '#171512' },
      '--dsw-specific-sidebar-nav-item-active': { light: 'rgba(26, 22, 16, 0.06)', dark: 'rgba(242, 239, 232, 0.06)' },
      '--dsw-specific-sidebar-nav-item-active-accent': { light: 'rgba(27, 59, 255, 0.12)', dark: 'rgba(86, 132, 255, 0.14)' },
      '--dsw-specific-sidebar-nav-item-hover': { light: 'rgba(26, 22, 16, 0.05)', dark: 'rgba(242, 239, 232, 0.05)' },
      '--dsw-specific-menu': { light: '#ffffff', dark: '#1c1a17' },
      '--dsw-specific-bubble': { light: '#f2f0eb', dark: '#1c1a17' },
      '--dsw-specific-input-major': { light: '#ffffff', dark: '#1c1a17' },
      '--dsw-specific-selector': { light: '#f0eee9', dark: '#262320' },
      '--dsw-specific-tip': { light: '#f0eee9', dark: '#262320' },
      '--dsw-alias-interactive-bg-hover': { light: 'rgba(26, 22, 16, 0.06)', dark: 'rgba(242, 239, 232, 0.06)' },
      '--dsw-alias-interactive-bg-active': { light: 'rgba(26, 22, 16, 0.10)', dark: 'rgba(242, 239, 232, 0.10)' },
      '--dsw-alias-interactive-bg-hover-accent': { light: 'rgba(27, 59, 255, 0.10)', dark: 'rgba(86, 132, 255, 0.12)' },

      // 滚动条：纸面里的低对比灰
      '--dsw-alias-scrollbar-bg-l1': { light: 'rgba(26, 22, 16, 0.12)', dark: 'rgba(242, 239, 232, 0.12)' },
      '--dsw-alias-scrollbar-bg-l2': { light: 'rgba(26, 22, 16, 0.12)', dark: 'rgba(242, 239, 232, 0.12)' },
      '--dsw-alias-scrollbar-hover-l1': { light: 'rgba(26, 22, 16, 0.22)', dark: 'rgba(242, 239, 232, 0.22)' },
      '--dsw-alias-scrollbar-hover-l2': { light: 'rgba(26, 22, 16, 0.22)', dark: 'rgba(242, 239, 232, 0.22)' },
    })

    return {
      inject: ['theme'],
      apply(ctx) {
        const theme = ctx.get('theme')
        if (!theme || typeof theme.overrideTokens !== 'function') {
          console.warn('[dsh-signal-blue-theme] ctx.theme.overrideTokens 不可用，配色未生效')
          return
        }
        // ctx.effect 持有 disposer：插件卸载或热重载时这一层会被干净移除
        ctx.effect(() => theme.overrideTokens(SOURCE, TOKENS))
      },
    }
  },
})
