# dsh-signal-blue-theme

给 [dsh](https://github.com/deepseek-ai/deepseek-harness) 设计的一套瑞士风配色主题，代号**信号蓝**（Signal Blue，`#1B3BFF`）。

瑞士风（Swiss Style）的骨架固定：纸色、墨色、四档中性灰承担全部层次，留给主题的空间只有一个强调色。信号蓝就落在这个位置上——它像电流，不像灯光；它只在需要说话的地方出现。

这个仓库有两种形态：**一个可安装的 DSH 主题插件**，和**一页讲这套配色的发布页**。

## 安装到 DSH

```sh
dsh plugin --profile web add /path/to/dsh-signal-blue-theme
```

也可以从远端装：

```sh
dsh plugin --profile web add "github:rockyzhz/dsh-signal-blue-theme"
```

装完刷新页面即生效，不用重启。卸载：

```sh
dsh plugin --profile web remove dsh-signal-blue-theme
```

界面上没有开关——插件在，配色就在；卸掉，配色回到默认。明暗仍由「设置 → 通用 → 外观」控制，主题和明暗是两个独立的轴。

## 它改了什么

插件走官方 `ThemeRuntime` 的 `ctx.theme.overrideTokens()`，在官方主题之上叠一层 token。覆盖分两步：

1. **品牌色阶** `--dsw-static-deepseek-*` 十档全部换成信号蓝色阶。官方别名几乎都是 `var(--dsw-static-deepseek-500)` 这类引用，色阶一换，链接、按钮填充、业务状态色整族自动跟随。
2. **字面量别名**单独补：纸面、墨色文字、边框、代码块底、侧栏。这些在官方样式表里是硬编码值，改色阶带不动。
3. **质感层**（额外注入一层 CSS）：圆角从 4–28px 收到 2–12px、卡片阴影换成发丝线、字体换成 Inter 优先的栈、焦点环与当前项标记（`aria-current="page"`）换成信号蓝。

第 1、2 步受 `overrideTokens` 管，第 3 步是插件注入的 `<style>`，卸载时一并移除。

色阶在 OKLCH 空间重建：色相固定 265.9°，明度按档位阶梯排，彩度向两端递减，并做了 sRGB 色域夹取。关键档位实测（WCAG 2.1）：

| 组合 | 对比度 |
|---|---|
| 500 `#1b3bff` 在纸色 `#fafaf8` 上 | 6.45:1 |
| 白字压在 500 上 | 6.74:1 |
| 400 `#5684ff` 在深底 `#121110` 上 | 5.51:1 |

共覆盖 60 个 token，全部校验过在官方样式表里真实存在（不存在的会被静默忽略）。

## 文件

| 文件 | 说明 |
|---|---|
| `package.json` | 插件清单：`dsh.bundle.patch` + `dsh.client` |
| `cordis.patch.yml` | 往 profile 配置树插入一行 |
| `index.js` | Host 半边，无行为 |
| `client.js` | 浏览器半边，真正干活的地方 |
| `icon.svg` | 插件图标 |
| `dsh-signal-blue.html` | 主题发布页，单文件，浏览器直接打开 |
| `dsh-signal-blue.png` | 同一页的整页长图，1440 × 6878 |
| `index.md` | 发布页正文（Markdown 源） |
| `make-annotations.mjs` | 标注文件生成器，含两张内联 SVG 图 |
| `annotations.json` | 渲染用的标注（由上面的脚本生成） |
| `build.mjs` | 一条命令重建发布页 |

## 色板

| 令牌 | 色值 | 用在哪 |
|---|---|---|
| `--paper` | `#FAFAF8` | 页面纸色 |
| `--paper-2` | `#EFECE5` | 侧栏、平台底 |
| `--ink` | `#0A0A0A` | 标题与正文 |
| `--muted` | `#737373` | 元信息、图注 |
| `--accent` | `#1B3BFF` | 链接、编号、选中态、状态点 |
| `--accent-bright` | `#5684FF` | 暗底上的强调（深色模式的链接） |
| `--accent-deep` | `#1428E1` | 悬停、按下 |

纸色与灰阶沿用瑞士风骨架，只有强调色是新的。

## 重建发布页

```bash
node build.mjs
```

渲染器来自歸藏 Page skill，路径写死在 `build.mjs` 的 `SKILL` 常量里，换机器时改这一行。

## 许可证

MIT
