# dsh-signal-blue-theme

给 [dsh](https://github.com/deepseek-ai/deepseek-harness) 设计的一套瑞士风配色主题，代号**信号蓝**（Signal Blue，`#1B3BFF`）。

瑞士风（Swiss Style）的骨架固定：纸色、墨色、四档中性灰承担全部层次，留给主题的空间只有一个强调色。信号蓝就落在这个位置上——它像电流，不像灯光；它只在需要说话的地方出现。

## 文件

| 文件 | 说明 |
|---|---|
| `dsh-signal-blue.html` | 主题发布页，单文件，浏览器直接打开 |
| `dsh-signal-blue.png` | 同一页的整页长图，1440 × 6878 |
| `index.md` | 页面正文（Markdown 源） |
| `make-annotations.mjs` | 标注文件生成器，含两张内联 SVG 图 |
| `annotations.json` | 渲染用的标注（由上面的脚本生成） |
| `build.mjs` | 一条命令重建整页 |

## 色板

| 令牌 | 色值 | 用在哪 |
|---|---|---|
| `--paper` | `#FAFAF8` | 页面纸色 |
| `--paper-2` | `#F0F0EE` | 卡片底、侧栏 |
| `--ink` | `#0A0A0A` | 标题与正文 |
| `--muted` | `#737373` | 元信息、图注 |
| `--accent` | `#1B3BFF` | 链接、编号、选中态、状态点 |
| `--accent-bright` | `#6691FF` | 暗底上的强调 |
| `--accent-deep` | `#0C00B2` | 悬停、按下 |
| `--accent-soft` | `#D7E4FD` | 淡底块 |

纸色与灰阶沿用瑞士风骨架，只有强调色是新的。

## 重建

```bash
node build.mjs
```

渲染器来自歸藏 Page skill，路径写死在 `build.mjs` 的 `SKILL` 常量里，换机器时改这一行。

## 用法

套到别的文档上，给渲染器传一个品牌色即可：

```bash
node scripts/render.mjs doc.md annotations.json out.html --style swiss --brand "#1B3BFF"
```
