# 🧂 心理盐排版

一个把 **Markdown 转成公众号排版 HTML** 的网页小工具，带封面生成、查找替换、自动保存等功能。写完直接一键复制，粘贴到公众号后台即可。

## 在线地址

- 自定义域名（日常用这个）：<https://mdnice.doudou.fun/>
- GitHub Pages 源站：<https://lxymomo.github.io/momo_mdnice/>

> 两个地址是同一份代码。域名走了 Cloudflare，更新后可能有缓存延迟，见下方「更新代码后线上不生效怎么办」。

---

## 功能一览

| 功能 | 说明 |
|------|------|
| 实时预览 | 左边写 Markdown，右边即时看到公众号排版效果 |
| 两套风格 | 🍵 观夏·留白 / 🏔 晴山·烟青，顶栏「风格」下拉切换，选择会记住 |
| 封面生成 | 自动取正文第一个标题当封面字，可改背景图 / 字色 / 字号，支持下载 |
| 一键复制 | 「📋 复制到公众号」把带样式的内容复制到剪贴板，直接粘贴进公众号 |
| 查找替换 | 类似 Word，支持替换全部 / 逐个替换 / 撤销，查找和替换词都有历史记录可复用 |
| Markdown 工具栏 | 编辑区上方一排按钮：标题 / 粗体 / 引用 / 列表 / card，选中文字点一下即可套用 |
| 字数统计 | 编辑区底部显示当前字数 |
| 自动保存 | 输入后自动存到浏览器本地，刷新 / 关页面不丢稿，下次打开自动恢复 |

## 快捷键

| 按键 | 作用 |
|------|------|
| `Ctrl + F` | 打开查找替换面板 |
| `Esc` | 关闭查找替换面板 |

---

## 支持的 Markdown 语法

```markdown
# 01 章节          → 章节标题（带序号样式）

普通段落文字

> 引用一段话        → 引用块

- 列表项一          → 无序列表
- 列表项二

**加粗文字**        → 加粗（主题色高亮）

[card]
卡片里的内容
[/card]            → 高亮卡片块（本工具自定义语法）
```

`[card]...[/card]` 是这个工具特有的语法，会渲染成一个带背景的高亮卡片。

---

## 文件结构

```
index.html              页面结构 + 内联样式（查找替换面板、工具栏样式）
style.css               全局样式（三栏布局、顶栏、封面控件等）
app.js                  主逻辑：预览、封面、复制、查找替换、工具栏、自动保存、主题切换
parser.js               Markdown 解析器（saltParser 函数）
templates.js            主题定义（THEMES 对象，两套风格）
cover.js                封面 canvas 生成（CoverGen 对象）
logo.js                 logo 图片（base64）
assets/
  cover-bg-b64.js       默认封面背景图（base64）
  fonts/                封面用的中文字体
gen-b64.js              把图片转 base64 的小工具（开发用）
```

> 带 `copy` 的文件（如 `app copy.js`）是旧备份，可忽略。

### 想改样式 / 加主题？

- 改**排版样式**（段落、标题、卡片长什么样）→ 看 `templates.js` 里的 `THEMES`，每套风格是一个对象。
- 改**Markdown 解析规则**（支持新语法）→ 看 `parser.js` 的 `saltParser`。
- 改**封面**（默认背景、字体、布局）→ 看 `cover.js`。

---

## 本地预览

不用装任何东西，直接双击 `index.html` 用浏览器打开就能用。

如果要用本地服务器（比如测试复制功能，`file://` 下剪贴板 API 受限）：

```bash
npx serve .
# 然后打开 http://localhost:3000
```

---

## 更新代码后线上不生效怎么办 ⚠️

这是最容易踩的坑。改完代码 push 到 GitHub 后，`mdnice.doudou.fun` 可能还是旧的，因为中间隔了**两层缓存**：

```
push 代码 → GitHub Pages（源站，已更新）
              ↓ ① Cloudflare 边缘缓存（可能还存旧文件）
              ↓ ② 浏览器缓存（约 10 分钟）
            你看到的页面
```

**每次更新后，让线上立刻生效的步骤：**

1. **提交并推送**（GitHub Desktop：Commit → Push origin）
2. **清 Cloudflare 缓存**：登录 Cloudflare → 选 `doudou.fun` → **Caching → Configuration → Purge Everything**
3. **浏览器硬刷新**：`Ctrl + Shift + R`，或直接开无痕窗口

**嫌麻烦想一劳永逸**：Cloudflare → **Caching → Cache Rules** 加一条规则，匹配 `*.html` 和 `*.js`，动作设为 **Bypass cache**。这样 HTML/JS 永远实时回源，push 完刷新就见效。

> 排查小技巧：想确认线上到底是不是最新的，可以对比源站和域名的文件是否一致：
> ```bash
> curl -s https://lxymomo.github.io/momo_mdnice/app.js | md5sum
> curl -s https://mdnice.doudou.fun/app.js | md5sum
> ```
> md5 一样就说明域名已经是最新版，剩下的就是清你自己浏览器的缓存。
