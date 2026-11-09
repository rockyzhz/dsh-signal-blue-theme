/**
 * 一条命令重建整页：生成标注 → 渲染 → 把设置面板里的「品牌色」改成主题名。
 * 用法：node build.mjs
 */
import { execFileSync } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const here = dirname(fileURLToPath(import.meta.url));
const SKILL = '/home/rocky/.dsh/profiles/web/node_modules/dsh-guizang-design/skills/guizang-page-skill';
const OUT = 'dsh-signal-blue.html';

execFileSync('node', ['make-annotations.mjs'], { cwd: here, stdio: 'inherit' });
execFileSync('node', [resolve(SKILL, 'scripts/render.mjs'), 'index.md', 'annotations.json', OUT,
  '--style', 'swiss', '--brand', '#1B3BFF'], { cwd: here, stdio: 'inherit' });

// 品牌主题默认叫「品牌色」，这里换成主题名，只改显示，不动 data-theme 与色值
let html = readFileSync(resolve(here, OUT), 'utf-8');
const before = html;
html = html.replace('title="品牌色 Brand"', 'title="信号蓝 Signal Blue"')
           .replace('aria-label="品牌色"', 'aria-label="信号蓝"');
if (html === before) console.warn('⚠ 设置面板里没找到「品牌色」按钮，跳过改名');
writeFileSync(resolve(here, OUT), html);
console.log(`✓ ${OUT} 已重建`);
