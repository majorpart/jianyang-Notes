# 简扬笔记 AI 工具导航站 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 用纯静态 HTML/CSS/JS 实现「简扬笔记」AI 图像工具推荐页，卡片平铺、中英并排、可被搜索引擎抓取。

**Architecture:** 三文件静态站。`index.html` 内嵌全部 13 张卡片文案（SEO）；`styles.css` 负责浅灰蓝网格背景与响应式卡片；`script.js` 仅做搜索过滤，关闭 JS 仍可读全站内容。

**Tech Stack:** HTML5、CSS3、原生 JS；Google Fonts（DM Sans + Source Sans 3）；无构建工具。

**Spec:** `docs/superpowers/specs/2026-08-11-ai-tools-directory-design.md`

## Global Constraints

- 内容必须写在初始 HTML DOM 中，禁止用 JS 注入卡片列表
- 外链一律 `https://` + 域名，`target="_blank"` + `rel="noopener noreferrer"`
- 中英简介与标签并排显示；不分组；不使用 SPA/React
- 站名：简扬笔记 · Jianyang Notes
- 视觉：背景 `#E8F0F6`，主色 `#1A6FDB`，标题色 `#1A2332`；字体 DM Sans + Source Sans 3
- 搜索无结果文案：未找到匹配的工具 / No tools matched

---

## File Structure

| 文件 | 职责 |
|------|------|
| `index.html` | 语义结构、meta/SEO、13 张卡片、搜索框、页脚 |
| `styles.css` | 布局、网格、卡片、标签、动效、响应式 |
| `script.js` | 搜索过滤与空结果提示 |

---

### Task 1: 搭建 HTML 骨架与 13 张卡片

**Files:**
- Create: `index.html`

**Interfaces:**
- Produces: `#search-input`、`#tool-grid`、`.tool-card`（每张含 `data-search` 全量小写文本）、`#empty-state`（默认隐藏）

- [ ] **Step 1: 创建 `index.html`**

包含：`lang="zh-CN"`；`<title>简扬笔记 · Jianyang Notes — AI 图像工具导航</title>`；meta description；引入 Google Fonts、`styles.css`、文末 `script.js`。

结构要点：
- `header.site-header`：`h1` 简扬笔记 · Jianyang Notes；副标题双语
- `div.toolbar`：`<label for="search-input">` + `<input id="search-input" type="search">`
- `main#tool-grid`：13 个 `<article class="tool-card">`
- `p#empty-state`：未找到匹配的工具 / No tools matched（`hidden`）
- `footer`：© 2026 简扬笔记 · Jianyang Notes · 更新 2026-08-11

每张卡片模板：

```html
<article class="tool-card" data-search="yevideo ye video 在线 ai 视频...全部可搜索小写文本">
  <h2 class="tool-name">YeVideo</h2>
  <a class="tool-domain" href="https://yevideo.io" target="_blank" rel="noopener noreferrer">yevideo.io</a>
  <p class="tool-desc-zh">在线 AI 视频相关工具，帮你快速生成或处理视频内容。</p>
  <p class="tool-desc-en">Online AI video tools for generating and processing video content.</p>
  <ul class="tool-tags">
    <li>AI视频</li><li>在线工具</li><li>AI Video</li><li>Online Tool</li>
  </ul>
  <a class="tool-visit" href="https://yevideo.io" target="_blank" rel="noopener noreferrer">访问网站 / Visit</a>
</article>
```

文案与域名严格按 spec 第 7 节表格填写全部 13 站。`data-search` 拼接：显示名、域名、中英简介、中英标签（转小写）。

- [ ] **Step 2: 核对 SEO 与链接**

确认：页面源码中可直接搜到「简扬笔记」「YeVideo」「phototoexcel.info」等；13 个 `https://` 链接与 spec 一致。

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "Add static HTML with 13 bilingual tool cards for SEO"
```

---

### Task 2: 样式与响应式布局

**Files:**
- Create: `styles.css`
- Modify: `index.html`（若需微调 class，保持最小改动）

**Interfaces:**
- Consumes: Task 1 的 class 名
- Produces: 桌面 2～3 列、手机单列；悬停上浮；`prefers-reduced-motion` 关闭动画

- [ ] **Step 1: 创建 `styles.css`**

实现：
- CSS 变量：`--bg #E8F0F6`、`--primary #1A6FDB`、`--text #1A2332`、`--muted`、`--card #fff`、`--border`
- `body`：背景色 + 极淡网格（`linear-gradient` 交叉线即可）
- 字体：`h1/h2` 用 DM Sans，正文 Source Sans 3
- `.tool-grid`：`display: grid; gap: 1.25rem; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr))`
- `.tool-card`：白底、圆角、边框；`:hover` 边框主色 + `translateY(-2px)`
- 标签：浅底小胶囊，勿过度圆角 pill 堆砌
- `.tool-visit`：主色按钮
- `:focus-visible` 清晰描边
- `@keyframes` 入场 stagger（用 `animation-delay` 或 nth-child）；`@media (prefers-reduced-motion: reduce)` 禁用
- `#empty-state[hidden]` 不显示；无 `[hidden]` 时居中提示

- [ ] **Step 2: 浏览器目测**

用本地打开或静态服务检查桌面/窄屏布局与悬停。

- [ ] **Step 3: Commit**

```bash
git add styles.css index.html
git commit -m "Style tool cards with light blue directory look"
```

---

### Task 3: 搜索过滤

**Files:**
- Create: `script.js`

**Interfaces:**
- Consumes: `#search-input`、`#tool-grid .tool-card[data-search]`、`#empty-state`
- Produces: `filterTools(query: string): void` — 匹配则移除 `hidden`，否则加 `hidden`；若可见数为 0 则显示 empty-state

- [ ] **Step 1: 创建 `script.js`**

```javascript
(function () {
  const searchInput = document.getElementById("search-input");
  const cards = Array.from(document.querySelectorAll(".tool-card"));
  const emptyState = document.getElementById("empty-state");

  function filterTools(query) {
    const normalized = query.trim().toLowerCase();
    let visibleCount = 0;

    cards.forEach((card) => {
      const haystack = card.getAttribute("data-search") || "";
      const match = !normalized || haystack.includes(normalized);
      card.hidden = !match;
      if (match) visibleCount += 1;
    });

    emptyState.hidden = visibleCount > 0;
  }

  searchInput.addEventListener("input", () => {
    filterTools(searchInput.value);
  });
})();
```

- [ ] **Step 2: 手测搜索**

输入 `meme` → 应只剩 Kirkify / Meme Picture 相关；输入 `OCR` → Photo to Excel；清空 → 13 张全显；乱码 → 显示空状态。

- [ ] **Step 3: Commit**

```bash
git add script.js
git commit -m "Add client-side search filter for tool cards"
```

---

### Task 4: 验收对照 spec

**Files:** 无新增（只验证）

- [ ] **Step 1: 对照 spec 第 10 节清单**

- 关闭 JS（或读源码）可见全部卡片文案与链接
- 13 个外链 `https://` 正确
- 搜索「生图」「meme」「OCR」过滤正确
- 窄屏单列可读
- `title` / `description` 含简扬笔记与导航语义

- [ ] **Step 2: 若有问题则修复并追加 commit**

---

## Spec Coverage Check

| Spec 要求 | Task |
|-----------|------|
| 静态 HTML 内嵌内容 / SEO | Task 1 |
| 卡片字段与 13 站文案 | Task 1 |
| 视觉与响应式 | Task 2 |
| 搜索与空状态 | Task 3 |
| 无障碍 focus / reduced-motion | Task 2 |
| 测试要点 | Task 4 |
