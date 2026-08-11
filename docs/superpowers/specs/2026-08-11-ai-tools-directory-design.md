# 简阳笔记 · AI 图像工具导航站 — 设计文档

**日期：** 2026-08-11  
**状态：** 已确认需求，待实现  
**技术选型：** 纯静态 HTML + CSS + 少量 JS（方案 1）

---

## 1. 目标

做一个**简单、可被搜索引擎抓取**的 AI 图像工具推荐页，灵感来自 [xs2021 储物间](https://xs2021-github-io.vercel.app/locker/) 的干净导航感，但采用**卡片网格**而非文件夹树。

用户打开页面即可浏览 13 个推荐站点，阅读中英简介与标签，并一键跳转。

### 成功标准

- 内容写在初始 HTML 中，Google 等爬虫无需执行复杂 JS 即可抓取标题、简介、链接
- 每张卡片含：站点名、域名、中英简介、中英标签、访问按钮
- 桌面与手机均可正常浏览
- 无后端、无构建步骤，可直接部署到 GitHub Pages / Vercel 等静态托管

---

## 2. 范围

### 包含

- 单页静态站点：`index.html`、`styles.css`、`script.js`
- 13 个站点的卡片列表（不分组、平铺）
- 中英简介与标签并排展示
- 顶栏站点品牌与副标题
- 搜索过滤（按名称 / 简介 / 标签）
- 外链新窗口打开

### 不包含

- 后端、数据库、登录
- 分类折叠树、多级导航
- 语言一键切换（采用并排展示，非切换）
- SPA / React / 构建工具
- 访问统计、评论、公告栏

---

## 3. 技术架构

```
jianyang-Notes/
├── index.html      # 语义化 HTML，卡片内容内嵌（SEO）
├── styles.css      # 布局与视觉
├── script.js       # 仅搜索过滤
└── docs/superpowers/specs/
    └── 2026-08-11-ai-tools-directory-design.md
```

### SEO 策略

- 所有推荐内容以真实 DOM 文本存在于 `index.html`（非 AJAX 懒加载）
- 使用语义标签：`header`、`main`、`article`、`footer`、`h1`/`h2`
- `<title>` 与 `<meta name="description">` 写明站点用途
- 外链：`target="_blank"` + `rel="noopener noreferrer"`
- `script.js` 仅做客户端过滤；关闭 JS 时仍能看到完整列表

### 为何不用 SPA

纯前端 CSR 不利于搜索引擎抓取正文。本项目用静态 HTML 满足「前端页面 + 可抓取」双重目标。

---

## 4. 页面结构

```
[顶栏]
  标题：简阳笔记 · Jianyang Notes
  副标题：精选 AI 图像工具导航 / Curated AI Image Tools

[工具栏]
  搜索框：按名称、简介、标签过滤

[主内容 · 卡片网格]
  13 × article 卡片（见第 6 节字段）

[页脚]
  简短版权 / 更新日期
```

布局：桌面 2～3 列；窄屏单列。

---

## 5. 视觉设计

参考储物间浅色、干净的感觉，避免常见 AI 模板风（紫渐变、奶油底衬线字、报纸栏）。

| 角色 | 取值 |
|------|------|
| 背景 | `#E8F0F6`，极淡网格纹理 |
| 卡片 | 白底、细边框、轻微圆角 |
| 主色 | `#1A6FDB`（按钮、链接、悬停强调） |
| 标题色 | `#1A2332` |
| 简介色 | 中灰 |
| 标题字体 | DM Sans（Google Fonts） |
| 正文字体 | Source Sans 3 |
| 悬停 | 边框变蓝、轻微上浮 |
| 入场 | 卡片轻微依次出现；尊重 `prefers-reduced-motion` |

不做：大英雄图、统计条、过多徽章、深色模式。

---

## 6. 卡片字段

每张卡片（`<article>`）包含：

| 字段 | 规则 |
|------|------|
| 站点名 | 由域名提炼可读名称（如 `yevideo.io` → YeVideo） |
| 域名 | 小号展示，可点击 |
| 中文简介 | 1 句，约 20～40 字 |
| 英文简介 | 1 句，语义对应中文 |
| 中文标签 | 2～3 个 |
| 英文标签 | 2～3 个 |
| 访问按钮 | 「访问网站 / Visit」→ `https://{域名}` |

---

## 7. 推荐站点清单与文案

文案按域名功能推断；实现后可再微调。URL 统一为 `https://` + 域名。

| # | 域名 | 显示名 | 中文简介 | English intro | 中文标签 | EN tags |
|---|------|--------|----------|---------------|----------|---------|
| 1 | yevideo.io | YeVideo | 在线 AI 视频相关工具，帮你快速生成或处理视频内容。 | Online AI video tools for generating and processing video content. | AI视频, 在线工具 | AI Video, Online Tool |
| 2 | kirkify.info | Kirkify | 把照片变成 Kirk 风格趣味图片，轻松做出梗图效果。 | Turn photos into Kirk-style fun images and meme looks. | 趣味图, 梗图 | Fun Image, Meme |
| 3 | memepicture.info | Meme Picture | 快速制作与分享梗图、表情包风格图片。 | Create and share meme-style pictures quickly. | 梗图, 表情包 | Meme, Emote |
| 4 | pictureenhancer.info | Picture Enhancer | 一键增强图片清晰度与观感，适合修复模糊照片。 | Enhance image clarity and quality in one click. | 图片增强, 画质修复 | Enhance, Upscale |
| 5 | phototoexcel.info | Photo to Excel | 将照片或表格截图转为可编辑的 Excel 数据。 | Convert photos or table screenshots into editable Excel data. | 图片转表格, OCR | Photo to Excel, OCR |
| 6 | mergetwophotos.info | Merge Two Photos | 把两张照片合成为一张，适合对比图或拼图。 | Merge two photos into one for collages or comparisons. | 图片合并, 拼图 | Merge, Collage |
| 7 | isthisaiimage.info | Is This AI Image | 检测图片是否可能由 AI 生成，辅助辨别真伪。 | Check whether an image may be AI-generated. | AI检测, 鉴伪 | AI Detect, Verify |
| 8 | aiimageexpander.info | AI Image Expander | 用 AI 向外扩展画面，补全构图与背景。 | Expand images outward with AI to complete the scene. | AI扩图, 构图 | Outpaint, Expand |
| 9 | aiforimagegeneration.com | AI for Image Generation | 面向创意的 AI 图像生成入口，文字或提示即可出图。 | AI image generation for creative prompts and ideas. | AI生图, 文生图 | Text to Image, Generate |
| 10 | ai-image-remover.com | AI Image Remover | 用 AI 去除图片中的物体、文字或多余元素。 | Remove objects, text, or unwanted elements with AI. | 去物体, 擦除 | Object Remove, Erase |
| 11 | bestaitogenerateimages.com | Best AI to Generate Images | 汇集/提供优质 AI 生图能力，帮你找到合适的生成方式。 | Discover strong AI image generation options and workflows. | AI生图, 推荐 | AI Generate, Best Of |
| 12 | imagetoimageai.live | Image to Image AI | 基于已有图片做 AI 图生图变换与风格迁移。 | Transform existing images with AI image-to-image tools. | 图生图, 风格迁移 | Img2Img, Style |
| 13 | ai-image-cleaner.com | AI Image Cleaner | 清理与修复图片瑕疵，让画面更干净清晰。 | Clean and repair image flaws for a clearer result. | 图片清理, 修复 | Clean, Repair |

---

## 8. 交互行为

1. **访问网站**：点击按钮或域名链接，新标签页打开对应 HTTPS 地址。
2. **搜索**：输入关键词，实时过滤卡片（匹配站点名、域名、中英简介、中英标签，大小写不敏感）。
3. **无结果**：显示「未找到匹配的工具 / No tools matched」。
4. **清空搜索**：恢复显示全部 13 张卡片。

---

## 9. 无障碍与兼容

- 搜索框带可见 `<label>` 或 `aria-label`
- 键盘可聚焦链接与按钮，有可见 `:focus` 样式
- 尊重 `prefers-reduced-motion`
- 目标浏览器：现代 Chrome / Edge / Firefox / Safari

---

## 10. 测试要点

- [ ] 关闭 JS 仍能看到全部卡片文案与链接
- [ ] 13 个外链均可打开（`https://` 正确）
- [ ] 搜索「生图」「meme」「OCR」等能正确过滤
- [ ] 手机宽度下单列可读、按钮可点
- [ ] 页面 `title` / `description` 含「简阳笔记」与工具导航语义

---

## 11. 已确认决策摘要

| 项 | 决策 |
|----|------|
| 布局 | 卡片列表（非树形） |
| 技术 | 纯静态 HTML/CSS/JS |
| 语言 | 中英并排 |
| 站名 | 简阳笔记 · Jianyang Notes |
| 分组 | 不分组，全部平铺 |
| SEO | 内容内嵌 HTML，避免 CSR SPA |
