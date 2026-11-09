import { writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const here = dirname(fileURLToPath(import.meta.url));

const MONO = 'font-family:var(--font-mono)';
const SANS = 'font-family:var(--font-sans)';

// 候选色卡：四块真实颜色 + 名称 + 色值，第三块（电蓝）被框起来
const swatches = [
  { x: 0, name: '荧光紫蓝', hex: '#7C5CFF', picked: false },
  { x: 150, name: '克莱因蓝', hex: '#002FA7', picked: false },
  { x: 300, name: '电蓝', hex: '#1B3BFF', picked: true },
  { x: 450, name: '终端青', hex: '#0E7C86', picked: false },
];

const swatchSvg = `<svg viewBox="0 0 600 182" role="img" aria-label="四个候选强调色：荧光紫蓝、克莱因蓝、电蓝、终端青">
${swatches.map((s) => {
  const y = s.picked ? 8 : 20;
  const h = s.picked ? 108 : 96;
  const stroke = s.picked ? ';stroke:currentColor;stroke-width:2' : '';
  return `  <rect x="${s.x}" y="${y}" width="138" height="${h}" rx="3" style="fill:${s.hex}${stroke}"/>
  <text x="${s.x}" y="140" style="${SANS};font-size:13px;${s.picked ? 'font-weight:600;fill:var(--accent)' : 'fill:currentColor;opacity:.72'}">${s.name}</text>
  <text x="${s.x}" y="158" style="${MONO};font-size:10px;fill:currentColor;opacity:.45">${s.hex}</text>`;
}).join('\n')}
</svg>`;

// 界面示意：600 宽，与正文列宽接近，缩放后仍可读
const uiSvg = `<svg viewBox="0 0 600 360" role="img" aria-label="dsh Web 界面示意：左侧 profile 列表，右侧运行状态与工具调用">
  <rect x="0.5" y="0.5" width="599" height="359" rx="10" style="fill:var(--paper);stroke:var(--line)"/>
  <path d="M150 14V346" style="stroke:var(--line);fill:none"/>

  <text x="14" y="26" style="${MONO};font-size:8.5px;letter-spacing:.16em;fill:currentColor;opacity:.42">PROFILES</text>

  <rect x="0" y="40" width="3" height="24" style="fill:var(--accent)"/>
  <text x="18" y="57" style="${MONO};font-size:11.5px;font-weight:600;fill:var(--accent)">web</text>
  <circle cx="132" cy="53" r="2.8" style="fill:var(--accent)"/>

  <text x="18" y="89" style="${MONO};font-size:11.5px;fill:currentColor;opacity:.60">headless</text>
  <text x="18" y="121" style="${MONO};font-size:11.5px;fill:currentColor;opacity:.60">sdk</text>
  <text x="18" y="153" style="${MONO};font-size:11.5px;fill:currentColor;opacity:.60">sdk-minimal</text>
  <text x="18" y="185" style="${MONO};font-size:11.5px;fill:currentColor;opacity:.60">acp</text>

  <text x="14" y="336" style="${MONO};font-size:8.5px;fill:currentColor;opacity:.38">2 patches · hmr on</text>

  <text x="168" y="26" style="${MONO};font-size:10.5px;fill:currentColor;opacity:.55">session 3f9c</text>
  <circle cx="492" cy="22" r="3.2" style="fill:var(--accent)"/>
  <text x="502" y="26" style="${MONO};font-size:10px;fill:var(--accent)">running</text>
  <path d="M150 44H594" style="stroke:var(--line);fill:none"/>

  <text x="168" y="68" style="${MONO};font-size:8.5px;letter-spacing:.14em;fill:currentColor;opacity:.40">YOU</text>
  <text x="168" y="88" style="${SANS};font-size:13px;fill:currentColor">加一个 memory 插件，然后跑测试。</text>

  <text x="168" y="122" style="${MONO};font-size:8.5px;letter-spacing:.14em;fill:currentColor;opacity:.40">DSH</text>

  <rect x="168" y="132" width="406" height="40" rx="5" style="fill:var(--paper-2)"/>
  <rect x="168" y="132" width="3" height="40" style="fill:var(--accent)"/>
  <text x="182" y="150" style="${MONO};font-size:10.5px;fill:currentColor">dsh plugin --profile web add dsh-memory</text>
  <text x="182" y="165" style="${MONO};font-size:8.5px;fill:currentColor;opacity:.45">ok · 3.2s</text>

  <rect x="168" y="180" width="406" height="40" rx="5" style="fill:var(--paper-2)"/>
  <rect x="168" y="180" width="3" height="40" style="fill:var(--line-strong)"/>
  <text x="182" y="198" style="${MONO};font-size:10.5px;fill:currentColor">pnpm test</text>
  <text x="182" y="213" style="${MONO};font-size:8.5px;fill:currentColor;opacity:.45">128 passing · 0 failing</text>

  <text x="168" y="250" style="${SANS};font-size:13px;fill:currentColor">装好了，测试全绿。</text>

  <rect x="168" y="286" width="406" height="44" rx="7" style="fill:none;stroke:var(--line)"/>
  <text x="184" y="313" style="${MONO};font-size:10px;fill:currentColor;opacity:.38">继续输入，或按 ⌘K 换 profile</text>
</svg>`;

const annotations = {
  meta: {
    title: '信号蓝',
    subtitle: '给 dsh 的单一强调色方案',
    author: 'dsh',
    date: '2026.11.10',
    reading_time: '约 5 分钟',
    tags: ['主题', '配色', '瑞士风', 'dsh'],
    hero_image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1400&h=600&fit=crop',
    lang: null,
  },
  upgrades: [
    { type: 'pullquote', line: 10, accent: '一眼之内可读' },
    { type: 'checklist', lines: [26, 27, 28] },
    { type: 'embed', line: 34, label: 'CANDIDATES', svg: swatchSvg },
    { type: 'checklist', lines: [83, 84, 85, 86, 87] },
    { type: 'embed', line: 91, label: 'UI', svg: uiSvg, caption: '界面示意：侧栏 profile、运行状态点、工具调用行。颜色全部取自变量。' },
    { type: 'highlight', line: 113, label: '结论' },
  ],
};

writeFileSync(resolve(here, 'annotations.json'), JSON.stringify(annotations, null, 2) + '\n');
console.log('✓ annotations.json — upgrades:', annotations.upgrades.map((u) => u.type).join(', '));
