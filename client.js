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
      // 深色模式的链接取自 400 档；深蓝底会把 #5684ff 压到 4.6:1 以下，
      // 所以只有这一档在深色下单独提亮，其余档两模式共用。
      TOKENS[`--dsw-static-deepseek-${step}`] = {
        light: hex,
        dark: step === '400' ? '#7aa3ff' : hex,
      }
    }

    // ② 字面量别名：纸面、墨色、边框、代码块、侧栏
    Object.assign(TOKENS, {
      // 纸面：底色是暖白纸，卡片留在纯白，于是卡片像压在纸上
      '--dsw-alias-bg-base': { light: '#f6f8fd', dark: '#0f1a35' },
      '--dsw-alias-bg-layer-1': { light: '#ffffff', dark: '#15213f' },
      '--dsw-alias-bg-layer-2': { light: '#ffffff', dark: '#15213f' },
      '--dsw-alias-bg-layer-3': { light: '#e9eef9', dark: '#1e2b4b' },
      '--dsw-alias-bg-overlay': { light: '#e9eef9', dark: '#1e2b4b' },
      '--dsw-alias-bg-module-platform': { light: '#e9eef9', dark: '#1e2b4b' },
      '--dsw-alias-bg-multi-select': { light: '#e9eef9', dark: '#1e2b4b' },
      '--dsw-alias-bg-skeleton': { light: 'rgba(18, 26, 48, 0.06)', dark: 'rgba(232, 236, 248, 0.08)' },

      // 墨色文字：主文墨黑，次级与三级灰各让出一档
      '--dsw-alias-label-primary': { light: '#0b0d12', dark: '#e8ecf8' },
      '--dsw-alias-label-primary-bluish': { light: '#0b0d12', dark: '#e8ecf8' },
      '--dsw-alias-label-primary-dimmed': { light: '#0b0d12', dark: '#e8ecf8' },
      '--dsw-alias-label-secondary': { light: '#4a5160', dark: '#a8b0cc' },
      '--dsw-alias-label-tertiary': { light: '#646b7e', dark: '#7c86a8' },
      '--dsw-alias-label-caption': { light: '#646b7e', dark: '#7c86a8' },
      '--dsw-alias-label-dimmed': { light: 'rgba(10, 10, 10, 0.45)', dark: 'rgba(232, 236, 248, 0.45)' },

      // 品牌黑：主按钮与强调文字仍是墨色，蓝色只做标记
      '--dsw-alias-brand-primary': { light: '#0b0d12', dark: '#e8ecf8' },
      '--dsw-alias-brand-primary-invert': { light: '#0b0d12', dark: '#e8ecf8' },
      '--dsw-alias-brand-text': { light: '#0b0d12', dark: '#e8ecf8' },
      '--dsw-alias-button-primary-fill': { light: '#0b0d12', dark: '#e8ecf8' },
      '--dsw-alias-button-primary-hover': { light: '#1f2330', dark: '#d3daee' },
      '--dsw-alias-button-info-fill': { light: '#1b3bff', dark: '#1b3bff' },
      '--dsw-alias-button-info-hover': { light: '#1428e1', dark: '#3564ff' },

      // 发丝线：暖灰，不用纯黑半透明，否则暖纸底上会发脏
      '--dsw-alias-border-l1': { light: 'rgba(18, 26, 48, 0.08)', dark: 'rgba(232, 236, 248, 0.08)' },
      '--dsw-alias-border-l2': { light: 'rgba(18, 26, 48, 0.12)', dark: 'rgba(232, 236, 248, 0.12)' },
      '--dsw-alias-border-l2-darkmode-thin': { light: 'rgba(18, 26, 48, 0.12)', dark: 'rgba(232, 236, 248, 0.08)' },
      '--dsw-alias-border-l3': { light: 'rgba(18, 26, 48, 0.18)', dark: 'rgba(232, 236, 248, 0.18)' },
      '--dsw-alias-border-l4': { light: 'rgba(18, 26, 48, 0.26)', dark: 'rgba(232, 236, 248, 0.26)' },

      // 代码块：比纸面再沉一档，仍属同一族暖灰
      '--dsw-alias-markdown-code-block': { light: '#f2f4fa', dark: '#0a132b' },
      '--dsw-alias-markdown-code-block-banner': { light: '#e8ecf6', dark: '#121c38' },
      '--dsw-alias-markdown-inline-code': { light: '#f2f4fa', dark: '#0a132b' },
      '--dsw-alias-markdown-code-segment-selected': { light: '#e8ecf6', dark: '#121c38' },
      '--dsw-alias-markdown-code-segment-unselected': { light: '#f2f4fa', dark: '#0a132b' },

      // 业务状态色：这里就是信号蓝出现的地方
      '--dsw-alias-state-business-primary': { light: '#1b3bff', dark: '#7aa3ff' },
      '--dsw-alias-state-business-tertiary': { light: 'rgba(27, 59, 255, 0.10)', dark: 'rgba(122, 163, 255, 0.14)' },

      // 侧栏、菜单、气泡：跟纸面同族，避免蓝色系的中性色混进来
      '--dsw-specific-sidebar-fill': { light: '#e8edf8', dark: '#0b142d' },
      '--dsw-specific-sidebar-nav-item-active': { light: 'rgba(18, 26, 48, 0.06)', dark: 'rgba(232, 236, 248, 0.06)' },
      '--dsw-specific-sidebar-nav-item-active-accent': { light: 'rgba(27, 59, 255, 0.12)', dark: 'rgba(122, 163, 255, 0.14)' },
      '--dsw-specific-sidebar-nav-item-hover': { light: 'rgba(18, 26, 48, 0.05)', dark: 'rgba(232, 236, 248, 0.05)' },
      '--dsw-specific-menu': { light: '#ffffff', dark: '#15213f' },
      '--dsw-specific-bubble': { light: '#f2f4fa', dark: '#15213f' },
      '--dsw-specific-input-major': { light: '#ffffff', dark: '#15213f' },
      '--dsw-specific-selector': { light: '#f0eee9', dark: '#1e2b4b' },
      '--dsw-specific-tip': { light: '#f0eee9', dark: '#1e2b4b' },
      '--dsw-alias-interactive-bg-hover': { light: 'rgba(18, 26, 48, 0.06)', dark: 'rgba(232, 236, 248, 0.06)' },
      '--dsw-alias-interactive-bg-active': { light: 'rgba(18, 26, 48, 0.10)', dark: 'rgba(232, 236, 248, 0.10)' },
      '--dsw-alias-interactive-bg-hover-accent': { light: 'rgba(27, 59, 255, 0.10)', dark: 'rgba(122, 163, 255, 0.12)' },

      // 滚动条：纸面里的低对比灰
      '--dsw-alias-scrollbar-bg-l1': { light: 'rgba(18, 26, 48, 0.12)', dark: 'rgba(232, 236, 248, 0.12)' },
      '--dsw-alias-scrollbar-bg-l2': { light: 'rgba(18, 26, 48, 0.12)', dark: 'rgba(232, 236, 248, 0.12)' },
      '--dsw-alias-scrollbar-hover-l1': { light: 'rgba(18, 26, 48, 0.22)', dark: 'rgba(232, 236, 248, 0.22)' },
      '--dsw-alias-scrollbar-hover-l2': { light: 'rgba(18, 26, 48, 0.22)', dark: 'rgba(232, 236, 248, 0.22)' },
    })

    /**
     * 质感层。圆角、阴影、字体这些是 `:root` 级 token，不在 alias 层，
     * overrideTokens 够不着，用一层注入样式覆盖。
     *
     * 瑞士风的骨架是硬边：圆角收到 2–7px，卡片靠一圈发丝线立起来而不是投阴影，
     * 字体西文在前、中文在后（和发布页同一套栈）。
     */
    const SURFACE_CSS = `
body {
  --dsw-radius-xs: 2px;
  --dsw-radius-sm: 3px;
  --dsw-radius-md: 5px;
  --dsw-radius-lg: 7px;
  --dsw-radius-xl: 9px;
  --dsw-radius-panel: 12px;
  --dsw-corner-shape: normal;

  --dsw-shadow-lv1: 0 0 0 1px rgba(26, 22, 16, 0.05);
  --dsw-shadow-lv2: 0 1px 2px 0 rgba(26, 22, 16, 0.05), 0 0 0 1px rgba(26, 22, 16, 0.05);
  --dsw-shadow-lv3: 0 2px 8px 0 rgba(26, 22, 16, 0.08), 0 0 0 1px rgba(26, 22, 16, 0.06);
  --dsw-elevation-panel: 0 0 0 1px var(--dsw-alias-border-l2);
  --dsw-elevation-prominent: 0 2px 8px 0 rgba(26, 22, 16, 0.08), 0 0 0 1px var(--dsw-alias-border-l2);
  --dsw-elevation-soft: 0 1px 4px 0 rgba(26, 22, 16, 0.05), 0 0 0 1px var(--dsw-alias-border-l1);

  --dsw-font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI',
    'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Noto Sans SC', sans-serif;

  /* 焦点环换成信号蓝 */
  --dsw-focus-ring-color: var(--dsw-alias-state-business-primary);
}

/* 当前项：对照发布页那张 SVG —— 3px 直角竖条 + 蓝字，没有灰底胶囊。
   box-shadow: inset 会跟着元素自身的 border-radius 走，所以必须先把圆角归零，
   否则竖条两端会变成圆的，跟设计稿的 rect 对不上。 */
nav [aria-current="page"] {
  border-radius: 0 !important;
  background: transparent !important;
  color: var(--dsw-alias-state-business-primary) !important;
  box-shadow: inset 3px 0 0 var(--dsw-alias-state-business-primary) !important;
}

/* 悬停链接走信号蓝 */
a:hover {
  color: var(--dsw-alias-link);
}

body[data-ds-dark-theme] {
  --dsw-shadow-lv1: 0 0 0 1px rgba(200, 212, 255, 0.06);
  --dsw-shadow-lv2: 0 1px 2px 0 rgba(0, 0, 0, 0.40), 0 0 0 1px rgba(200, 212, 255, 0.06);
  --dsw-shadow-lv3: 0 2px 8px 0 rgba(0, 0, 0, 0.50), 0 0 0 1px rgba(200, 212, 255, 0.08);
  --dsw-elevation-panel: 0 0 0 1px var(--dsw-alias-border-l2);
  --dsw-elevation-prominent: 0 2px 8px 0 rgba(0, 0, 0, 0.50), 0 0 0 1px var(--dsw-alias-border-l2);
  --dsw-elevation-soft: 0 1px 4px 0 rgba(0, 0, 0, 0.40), 0 0 0 1px var(--dsw-alias-border-l1);
}
`

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
        ctx.effect(() => {
          const el = document.createElement('style')
          el.setAttribute('data-dsh-signal-blue', '')
          el.textContent = SURFACE_CSS
          document.head.appendChild(el)
          return () => el.remove()
        })
      },
    }
  },
})
