# MISYO Deltarune Navigation

一个基于 **Undertale / Deltarune** 美术风格的 Microsoft Edge 浏览器新标签页扩展，将你的新标签页替换为充满像素复古风情的导航页面。

---

## 功能特性

### 主页
- **多引擎搜索栏** — 支持百度、Bing、Google、GitHub 四种搜索引擎，一键切换
- **搜索联想词** — 输入关键词时自动展示搜索建议，支持键盘上下键选择、回车确认
- **动态视频背景** — 全屏循环播放的背景视频，营造沉浸式氛围
- **实时时钟** — 页面中央显示当前时间
- **快捷导航网格** — 5 列网格布局展示常用网站链接，悬停时卡片上浮并显示决心（DETERMINATION）图标
- **彩虹渐变动画标题** — 页面标题带有循环色彩变幻效果
- **回到顶部按钮** — 固定悬浮的决心图标，点击返回页面顶部

### 设置页
- **自定义导航链接** — 添加、编辑、删除常用网站快捷方式
- **预设图标选择** — 提供 Toby（小狗）、Sans、Flowey（小花）、Ralsei（R羊）、Chara 五种 Deltarune/Undertale 风格图标
- **UI排序** — 通过上移/下移按钮调整导航项顺序
- **分页浏览** — 超过 10 个链接时自动分页，支持翻页
- **恢复默认** — 一键恢复预设的默认导航列表
- **数据持久化** — 所有设置自动保存至浏览器 localStorage

### 社区页
- **官方与社区链接** — 收录 Undertale/Deltarune 官网、Toby Fox 社交账号、汉化组、Wiki 等资源
- **内置音乐播放器** — 嵌入四首 Deltarune 相关音乐，支持在线播放

### 维基页（开发中）
- 角色档案卡片布局，计划展示 Kris、Frisk 等角色信息

---

## 技术栈

| 类别 | 技术 |
|------|------|
| 前端 | HTML5 / CSS3 / Vanilla JavaScript |
| 扩展框架 | Microsoft Edge Extension API（Manifest V3） |
| 数据存储 | localStorage |
| 搜索联想 | JSONP（百度/Google）+ Fetch API（Bing/GitHub） |
| 字体 | Determination Mono / Determination Sans / 方正像素 / HYPixel |

---

## 项目结构

```
deltarune-style-edge-browser-nav-page/
├── manifest.json          # Edge 扩展清单文件
├── README.md
├── src/
│   ├── main.html          # 新标签页主页
│   ├── main.js            # 搜索引擎逻辑、联想词、链接渲染
│   ├── setting.html       # 设置页面（管理导航链接）
│   ├── dogcode.js         # 导航链接 CRUD 核心逻辑
│   ├── news.html          # 社区与资讯页面
│   └── wiki.html          # 角色维基页面（开发中）
├── CSS/
│   ├── css.css            # 主样式表（布局、动画、组件样式）
│   └── uistyle.css        # UI 组件样式（表单、按钮、预设图标选择器）
├── font/
│   ├── DeterminationMonoWebRegular-Z5oq.ttf   # 英文字体（等宽）
│   ├── DeterminationSansWebRegular-369X.ttf   # 英文字体（无衬线）
│   ├── HYPixel11pxU-2.ttf                     # 中文字体（像素）
│   └── 方正像素14.ttf                          # 中文字体（像素）
├── image/                 # 图标、角色立绘、网站 Logo 等图片资源
├── mus/                   # 背景音乐与音效文件
│   ├── defaultBackMus/    # 默认背景音乐
│   └── shortMus/          # 短音效（点击、悬停）
└── vid/                   # 主页背景视频
```

---

## 安装方法

1. 将整个项目文件夹下载到本地
2. 打开 Microsoft Edge 浏览器，在地址栏输入 `edge://extensions/` 并回车
3. 打开左侧的「**开发人员模式**」开关
4. 点击「**加载解压缩的扩展**」
5. 选择本项目所在的文件夹，点击「选择文件夹」
6. 打开一个新标签页，即可看到效果

---

## 使用说明

### 搜索
- 在主页搜索栏左侧下拉框中选择搜索引擎
- 输入关键词后会自动弹出联想词列表
- 使用 **↑ ↓** 键选择联想词，**Enter** 确认搜索，**Esc** 关闭联想列表

### 管理导航链接
- 点击顶部导航栏的「**设置**」进入管理页面
- 左侧表单填写网站名称、链接并选择图标后，点击「确认添加」
- 右侧列表可对已有链接进行编辑、删除、上移、下移操作
- 点击「**恢复默认导航列表**」可重置为预设链接

---

## 浏览器兼容性

| 浏览器 | 支持情况 |
|--------|----------|
| Microsoft Edge | 完全支持 |
| Google Chrome | 理论兼容（同为 Chromium 内核，Manifest V3） |
| 其他 Chromium 浏览器 | 理论兼容 |

---

## 已知限制

- 因 W3C 标准限制，音效功能（点击音效、悬停音效、背景音乐自动播放）暂不可用
- GitHub 搜索联想 API 存在频率限制，频繁请求可能暂时不可用
- 因未知原因，baidu搜索引擎联想词不可用

---

## 版权声明

- 插件作者：**Binling-Misyo**
- 美术风格与素材参考自 **Toby Fox** 的作品 *UNDERTALE* 与 *DELTARUNE*
- 部分图片素材由 AI 生成
- 本项目版权公开，欢迎分享及二次创作，**禁止商用**

---

## 联系方式

- GitHub：[Binling-Misyo](https://github.com/Binling-Misyo)
- 邮箱：2862177018@qq.com