# CR Deck Builder TODO

## 当前策略（2026-04-18 更新）

> **核心转变**：从"外链优先冲排名"转为"先修漏桶再灌水"。
> dbs 商业诊断 + Gemini 交叉验证结论：arena 页跳出率 67%、停留 6 秒，说明页面缺乏留住用户的工具功能。把一个漏桶推上第1页，用户秒退，Pogo-sticking 信号反而伤排名。
>
> **4/18 数据复盘结论**：
> - 排名大幅改善：arena-14 位置 7.7、arena-17 位置 9.4（从 23）、arena-18 位置 10.7（从 26），说明工具功能 + 内容差异化策略生效
> - 但 CTR 仅 0.35%（展示量 400/天，点击 ~1.4/天），title/meta 优化是当前最高 ROI 动作
> - 真实日均访客约 4 人（GA4 Direct 流量 72% 为 bot，需排除）
> - **新增长渠道**：ChatGPT 引荐 7 个会话/周，Bing 用户质量最高（停留 128 秒）
> - **发现同名竞品**：crdeckbuilder.com（Yogesh Singh），已有 AdSense + 更完整功能，品牌冲突风险
> - 停留时间数据因样本量太小（日均 <20 会话）暂无统计意义，不作为判断依据
>
> **新优先级**：
> - P0：AdSense 前置条件（About + Contact 页面）
> - P1：让页面能被 AI 引用（arena 页顶部加答案摘要块）+ 标题优化（冲首页）
> - P2：工具功能（排序/筛选）
> - P3：低强度外链维持（每天 10 分钟）+ Quora/Medium 各发一篇
> - Adsense：P0 做完后立即申请
>
> **AI 搜索评估（GPT-5 Pro 调研 2026-04-18）**：
> - ChatGPT 已开始引荐本站（7 会话/周），但在通用 query（"best deck for arena 15"）候选池里未出现
> - 关键瓶颈：页面缺少"可直接被 AI 抽取为答案"的摘要块
> - OAI-SearchBot / PerplexityBot 未被 robots.txt 屏蔽（✅ 已确认）
> - 竞品天花板很高：RoyaleAPI ~9M/月、Deck Shop ~3M/月
> - FAQ rich result 对游戏站无效，不再优化；重点做 BreadcrumbList

## 每天 1 小时执行清单（从 3/22 开始）

> 原则：每天只做 1 件事，做完打勾关电脑。不跳层，不建新站，先验证 CR 站。
> ~~阶段性目标：4 月中观察停留时间是否从 6 秒提升到 30 秒+~~（2026-04-18 结论：日均 <20 会话时停留时间无统计意义，改为观察 GSC 排名和 CTR）
> 新阶段性目标：**5 月中前 arena-14/17/18 进入 Google 首页 + CTR 提升到 1%+**
> 什么时候考虑新站：① CTR 改善 + 3 个 arena 页进首页，验证了 SOP；② 发现爆发中的新词机会，当天上线。

### 每日固定动作（前 10 分钟）

- [x] Day 1-3：打开 GSC，提交剩余索引 URL（已完成）
- Day 4 起：看一眼 GSC arena-15 排名趋势（2 分钟），排名涨就继续推，停滞就分析原因

### 第 1 周：外链集中打 arena-15（后 50 分钟）

> ⚠️ 所有外链的链接目标：优先指向 `/arena/arena-15`，不要指向首页

- [ ] **Day 1**：Quora 发帖 — 写 "What are the best Clash Royale decks for Arena 15 (Miner's Mine)?"，链接指向 arena-15 页面
- [ ] **Day 2**：Medium 发文 — 写一篇 Arena 15 卡组攻略，链接指向 arena-15 页面
- [ ] **Day 3**：Pinterest — 做 6 张 Arena 15 热门卡组图，描述带 arena-15 链接
- [ ] **Day 4**：竞品外链分析 — Google 搜 `intext:"deckshop.pro" -site:deckshop.pro`，找到的外链机会优先给 arena-15
- [ ] **Day 5**：Product Hunt 上线 — 发布 + 社交媒体转发
- [ ] **Day 6**：Ahrefs 查竞品外链 — 查 deckshop.pro 外链，找 5 个能提交的，链接指向 arena-15
- [ ] **Day 7**：高权重外链 — ① Dev.to 写项目介绍带 arena-15 链接 ② 开源项目赞助 $5-10 带链接

### 第 2 周：arena-15 页面优化 + 继续外链（后 50 分钟）

- [ ] **Day 8**：arena-15 标题优化 — 关键词前置，如 "Best Arena 15 Decks - Clash Royale Miner's Mine Deck Builder 2026"
- [ ] **Day 9**：arena-15 H1 + 内链优化 — H1 含核心关键词 + 从首页和 arena-14/16 加内链指向 arena-15
- [ ] **Day 10**：arena-15 加数据时间戳 + 样本量 — "Data updated: March 2026" + sample size
- [ ] **Day 11**：继续发外链 — 竞品外链分析找到的站，提交 2-3 个，链接指向 arena-15
- [ ] **Day 12**：继续发外链 — 同上

### 第 3 周：观察排名 + 补充外链（后 50 分钟）

- [ ] **Day 13**：GSC 数据复盘 — arena-15 排名是否进入前 5？曝光和点击是否在涨？
- [ ] **Day 14**：根据复盘结果决定下一步：
  - 排名在涨 → 继续发外链，保持节奏
  - 排名停滞 → 分析原因（内容不够？外链质量不行？），调整策略
- [ ] **Day 15-17**：继续发外链 / 页面微调（视复盘结果定）

### 第 4 周：二次复盘 + 决定是否扩展到 arena-19

- [ ] **Day 18**：GSC 数据复盘 — arena-15 排名趋势确认
- [ ] **Day 19-21**：
  - arena-15 稳定前 5 → 开始用同样方法推 arena-19
  - arena-15 还没进前 5 → 继续推，不分散精力

### 4 月底检查点

- [ ] arena-15 是否稳定在 Google 前 5？
  - ✅ 稳了 → SOP 验证通过。开始推 arena-19，同时考虑其他页面优化
  - ❌ 没稳 → 分析原因：外链不够？页面质量？关键词竞争度判断错了？对症调整
- [ ] 不再以月 PV 1000 为目标（dbs 诊断结论：该目标对上线 2 个月的新站不现实，改为 6 月底评估）

---

## 已完成
- [x] Next.js 项目搭建
- [x] Clash Royale API 接入，卡牌数据本地化
- [x] 首页 + 20 个 Arena 页面
- [x] 域名绑定 crdeckbuilder.top
- [x] Vercel 部署上线
- [x] sitemap.xml + robots.txt
- [x] Google Search Console 验证 + 提交 sitemap
- [x] 每个 Arena 扩充到 12-45 套卡组，附带胜率和使用率
- [x] Arena + Card 组合长尾页面（78 个页面，覆盖 Hog Rider / P.E.K.K.A / Giant / Balloon × 20 个 Arena）
- [x] Arena 页面添加 "Browse Decks by Card" 内链区块
- [x] sitemap 包含所有 arena+card 页面 URL
- [x] 面包屑导航
- [x] 全站部署上线（原 104 个静态页面）
- [x] HOT_CARDS 扩展到 14 张卡（去重后实际 135 页：1 首页 + 20 Arena + 114 Arena+Card）
- [x] 首页加 How It Works 引导区、数据统计区、FAQ 区块（含 JSON-LD schema）
- [x] 各 Arena 页和 Card 页补充描述性文字（数据驱动：arena-content.ts + card-content.ts，135 页全部覆盖）
- [x] 页面标题加入 "Clash Royale" 关键词，匹配搜索词
- [x] 按卡牌解锁 arena 过滤卡组，让每个 arena 页面内容真正不同
- [x] Arena 1-8 添加 24 套新手入门卡组（低 arena 卡牌组成）
- [x] 卡组池去重（1124→79 条唯一卡组），消除重复内容
- [x] 空 Arena 页面 UX 优化：友好提示 + 动态 CTA 跳转
- [x] Google Analytics 4 接入（GA4 埋点上线，实时数据已验证）
- [x] sitemap `<lastmod>` 改为基于内容修改时间（非构建时间）
- [x] 复制卡组链接按钮（给用户行动路径）
- [x] **「我有哪些卡」勾选过滤**（2026-03-31）— 核心工具功能上线，用户勾选已有卡牌过滤卡组，完美匹配/差1张/差2张分组，localStorage 持久化，hydration-safe
- [x] **Arena 12-20 恢复独立页面**（2026-03-31）— 撤销合并，每个 arena 独立 URL + sitemap 收录。用 middleware rewrite 绕过 Vercel CDN 旧 301 缓存
- [x] **每个 Arena 页内容差异化**（2026-03-31）— 添加"New Cards Unlocked"和"New Decks at Arena X"区块，每个页面有独特内容
- [x] **过滤器位置优化**（2026-03-31）— Filter by My Cards 移到 evidence block 下方，用户进页面即可看到
- [x] **AdSense 前置页面**（2026-04-19）— About + Contact 页面上线，Footer 加导航链接，Privacy Policy 补 AdSense 声明，Cookie Consent 弹窗
- [x] **AI 答案摘要块**（2026-04-19）— ArenaSummary 组件，自然语言模板，20 个 arena 页自动生成，数据更新时自动刷新
- [x] **FAQ Schema 数据驱动**（2026-04-19）— 注入 top deck 胜率/卡牌名 + 热门卡牌，喂 Google 和 AI 搜索
- [x] **标题结果导向优化**（2026-04-19）— arena 名字替换为胜率数据（如 "80%+ Win Rate"），差异化竞品
- [x] **品牌冲突决策**（2026-04-19）— 选方案 B（强化差异化定位），不换域名

## 月度 & 周目标路线图

### 2026 年 3 月 — 外链建设 + CR 站完善 ✅
- W1：完成外链前置条件（收录确认、Clarity、Bing、Privacy Policy）✅
- W2：导航站外链完成 ✅，内容平台外链（Quora/Medium/Pinterest）
- W3-W4：外链集中指向 arena-15，推排名进前 5
- **月底重大调整（3/31）**：dbs 诊断后从"外链优先"转为"工具功能优先"
  - ✅ 上线「我有哪些卡」过滤功能
  - ✅ Arena 12-20 恢复独立页面
  - ✅ 每个 Arena 页添加内容差异化区块

### 2026 年 4 月 — 观察数据 + 继续强化工具
- W1：GSC 重新提交 arena 12-20 URL + 申请 Adsense
- W2：观察停留时间是否改善（目标：6 秒 → 30 秒+）
- W3-W4：根据数据决定下一步工具功能（排序/筛选 or 卡组对比）
- 低强度外链维持（每天 10 分钟）
- 月底目标：停留时间改善 + Adsense 审核通过
- **4/18 进展**：
  - ✅ 排名大幅改善（arena-14: 7.7, arena-17: 9.4, arena-18: 10.7）
  - ✅ ChatGPT 开始引荐（7 会话/周）
  - ❌ AdSense 未申请（缺 About + Contact 页面）
  - ❌ 停留时间数据无法判断（样本量不足）
  - ⚠️ 发现同名竞品 crdeckbuilder.com（品牌冲突风险）
  - ~~剩余本月任务：① 加 About + Contact 页 → ② 申请 AdSense → ③ arena 页加答案摘要块 → ④ 标题优化~~
- **4/19 进展**：
  - ✅ About + Contact 页面上线，Footer 加导航链接
  - ✅ Privacy Policy 补充 AdSense 广告 Cookie 声明 + Cookie Consent 弹窗
  - ✅ 每个 arena 页顶部加自然语言 AI 答案摘要块（ArenaSummary 组件）
  - ✅ FAQ Schema 升级为数据驱动（注入 top deck 胜率 + 热门卡牌）
  - ✅ 标题优化：arena 名字替换为胜率数据（结果导向）
  - ✅ 品牌冲突决策：选方案 B（差异化定位），不换名
  - 剩余：① 申请 AdSense → ② 检查 Bing AI Performance → ③ 两周后观察 CTR 变化

### 2026 年 5-6 月 — 根据验证结果决定方向
- 停留时间改善 → 放大外链投入，用同样 SOP 推其他页面
- 停留时间没改善 → 继续强化工具功能
- Adsense 已通过 → 开始广告收入
- 月底目标：明确 CR 站 SEO SOP 是否可行 + 首笔广告收入

### 2026 年 6-8 月 — 矩阵扩张（Adsense 变现启动后）
- 每月上线 2-3 个新站
- 每个站复用 Next.js + API + Vercel 模板
- 持续做外链（每个新站上线后第一周集中发）
- 月底目标：累计 5-8 个站上线

### 2026 年 9-10 月 — 优化增长（原"变现启动"提前到 4 月）
- 流量达标的站申请 Google AdSense
- 规划广告位布局
- 砍掉没流量的站，集中精力在有效果的站
- 月底目标：开始产生广告收入，预估 $50-100/月

### 2026 年 11-12 月 — 优化增长
- 对有流量的站做内容深化和页面扩展
- 继续上新站（目标累计 10-15 个活跃站）
- 月底目标：$100-200/月

### 2027 上半年 — 规模化
- 持续优化有效站点，扩展多语言
- 新站上线节奏保持每月 1-2 个
- 目标：$200-350/月

### 2027 下半年 — 冲刺目标
- 矩阵站总数 15-20 个
- 目标：$500/月

## 待做

### 优先级 0：AdSense 前置条件 + 品牌问题（~~本周做完~~ ✅ 2026-04-19 完成）

**必须做（挡 AdSense 审核）**
- [x] 添加 **About 页面**（/about）：介绍网站、数据来源、开发者信息（2026-04-19）
- [x] 添加 **Contact 页面**（/contact）：联系邮箱（2026-04-19）
- [x] Footer 添加 About · Contact · Privacy Policy 导航链接（2026-04-19）
- [x] Privacy Policy 补充 Google AdSense 广告 Cookie 声明（2026-04-19）
- [x] 接入 Cookie Consent 弹窗（GDPR/CCPA 合规，localStorage 记忆用户选择）（2026-04-19）
- [ ] 可选：添加 Terms of Service 页面
- [ ] **立即申请 AdSense**（前置条件已全部满足）

**品牌冲突（已决策 ✅）**
- [x] crdeckbuilder.com 同名竞品 → 选择方案 B：在 title 里强化差异化（"80%+ Win Rate" + "Filter by Your Cards"），不换品牌名
  - 排除方案 A（不管）：需要主动差异化，否则品牌搜索永远排他后面
  - 排除方案 C（换名）：已有 GSC 排名积累 + ChatGPT 引荐，换域名代价太大

### 优先级 0.3：AI 搜索引荐优化（~~4/18 GPT-5 Pro 调研结论~~ ✅ 2026-04-19 完成）

> 来源：GPT-5 Pro 调研 + GA4 数据（7 个 chatgpt.com 引荐/周）
> 核心发现：页面缺少"可被 AI 直接抽取为答案"的摘要块，在通用 query 候选池里未出现

- [x] **每个 arena 页顶部加答案摘要块**（2026-04-19）：ArenaSummary 组件，自然语言模板，从 generated-decks.json 自动生成 Top 3 牌组 + 高频卡牌 + 费用 + trophy 区间 + 更新时间。"为什么强/怕什么/替代卡"暂不做（需游戏领域知识，性价比低）
- [x] **标题优化**（2026-04-19）：`Best Arena X Decks (80%+ Win Rate) — Filter by Your Cards | 2026`，用胜率数据替换 arena 名字，结果导向吸引点击
- [x] **FAQ Schema 升级为数据驱动**（2026-04-19）：注入 top deck 卡牌名/胜率 + 热门卡牌，同时喂 Google 传统搜索和 AI 搜索
- [ ] 检查 Bing Webmaster Tools 的 AI Performance 面板（看哪些页面被 AI answers 引用）

### ~~优先级 0（旧）：外链建设前置条件~~（已全部完成 ✅）

**收录确认**
- [x] `site:crdeckbuilder.top` 检查 Google 当前收录了多少页面（结果：仅 2 页，135 页待收录）
- [x] GSC 手动请求关键页面索引（第一批 11 个已提交，每天继续提交下一批）

**分析工具补全**
- [x] 配置 Microsoft Clarity（Project ID: vqg57f7mn5，已接入 layout.tsx）
- [x] 提交 Bing Webmaster Tools（可直接从 GSC 导入，5 分钟完成，等 48h 数据准备好后做）

**网站基础信任度**
- [x] 添加 Privacy Policy 页面（/privacy，含 GA4 + Clarity 说明，联系邮箱已填入）
- [x] 首页添加 "How We Rank Decks" 段落（Bayesian Average + 使用率加权说明，替代纯凑字数方案）
- [x] 修复 jsonld.ts 中 SITE_URL 混用 www 问题（统一为非 www）
- [x] www.crdeckbuilder.top 301 重定向配置（vercel.json 已部署，等待 Vercel SSL 签发完成）

**外链策略准备**
- [x] 检查 Reddit 账号 karma 值（karma = 1，需先养号）
- [ ] 用搜索语法分析竞品外链来源：`intext:"deckshop.pro" -site:deckshop.pro` / `intext:"statsroyale.com" site:reddit.com`
- [ ] 在 Ahrefs 免费版查竞品外链，照着提交（ahrefs.com/backlink-checker）

### 优先级 0.5：HN 发帖前页面质量修复（Codex 审核 4/10，需先修到 6+）

> 来源：Codex 网站质量审核（2026-03-19）
> 核心判断：当前页面"产品可信度和完整性没过线"，不适合发 HN/Reddit 等有社区互动的平台。
> 导航站外链、GSC 索引提交、Quora/Medium/Pinterest 不受影响，继续推进。

**P0：页面完整性（致命问题，必须先修）**
- [ ] 排查所有 20 个 Arena 页面和 card 页面，确保 100% 可访问（低 Arena 页面疑似不稳定）
- [ ] 隐藏或修复所有无数据/不稳定的页面入口

**P1：数据可信度（严重问题）**
- [ ] 每个卡组展示 `样本量 / 时间窗口 / 最近更新时间`（当前 79%-80% 胜率无样本量，看起来不可信）
- [ ] 添加方法论说明页或首页板块：数据来源、Bayesian Average 公式、数据局限性说明（兑现"official API / Bayesian average"的承诺）

**P2：内容质量（明显问题）**
- [ ] 砍掉或重写 SEO 味重的模板文案（Arena 说明、FAQ 等，当前像内容农场）
- [ ] 文案改为真实的产品洞察，而非 AI 模板填充

**P3：基本工具能力（加分项，可选）**
- [ ] 排序/筛选功能
- [x] Copy deck / Import 功能 ← **进行中**
- [ ] 按时间范围切换数据

> 修完 P0-P1 后即可发 HN，P2-P3 可以发帖后持续迭代。

### 优先级 1：外链建设（前置条件完成后）

**第一波点火 — HN（需先完成页面质量修复）**
- [ ] **Hacker News 发帖**：`Show HN: Clash Royale deck recommendations based on unlocked cards`
  - ⚠️ **前置条件**：必须先完成下方「优先级 0.5：HN 发帖前页面质量修复」
  - 教程原文："第一波外链可能就是要靠它了，很多内容网站会去抓取 HN 最新内容然后报道"
  - 发帖时间：周二到周四，北京时间 20:00-23:00
- [x] Product Hunt 提交（已排期 3/24 发布）

**内容平台（各发一篇，用 AI 重写，一次性完成 — 无需等页面修复）**
- [ ] Quora：用 AI 重写一篇产品介绍发布（教程定位：发一次内容即可，不需要每天回答问题）
- [ ] Medium：用 AI 重写一篇 Clash Royale 攻略文章，带链接
- [ ] Pinterest：上传卡组图/卡牌图，设置链接回网站（教程原文："图片外链，低成本引流，对 SEO 有加成"）

**社区运营（需养号，中长期）**
- [ ] Reddit r/ClashRoyale：先养号，不发营销文，只回答问题看帖子（教程原文："IP不干净太容易封号，被封了5个号"）
- [ ] SuperCell 官方社区发帖
- [ ] Discord：加入 Clash Royale 官方 Discord 及攻略社群，适时分享

**导航站提交类（已完成 ✅）**
- [x] mkdollar.com/backlinks
- [x] ~~egolinks.online/@backlinks~~（网站 bug，跳过）
- [x] ~~directories.bestaitools.com~~（不是目录站，跳过）
- [x] ~~sopilot.net/zh/submitdir~~（批量提交工具，跳过）
- [x] AlternativeTo
- [x] uneed
- [x] Launching Next
- [x] Pitchwall
- [x] ~~F6S~~（被拒，不符合 ToS，跳过）
- [x] ~~Crunchbase~~（跳过，不适合）
- [x] SideProjectors
- [x] Startup Buffer
> 教程原文："如果让我现在重新做一个站，我可能只会提交那几个头部的导航站就行了"——导航站已够，不再追加。

**高质量 dofollow（免费注册即得）**
- [ ] 开源项目赞助：找高权重开源项目赞助 $5-10，留言带网址（教程原文：这是"一般人想不到的发外链方式"）
- [ ] 核查 Stripe Climate 自定义页面是否仍提供可索引官网外链

**数据观察**
- [ ] 等 1-2 个月观察 Search Console 数据，确认长尾词能否带来流量
- [ ] **品牌词检查**：发 HN/Reddit 后，Google 搜索 `CR Deck Builder` 确认自己排第一

**外链核心原则（来自教程原文）**
> - "质量为先，在做好质量的情况下多发外链"
> - "新站外链：每天 10 个"，持续匀速推进，不暴冲
> - "10 个高质量外链 > 1000 个垃圾外链"
> - "外链建设是长期工程，3-6 个月才能看到明显变化"
> - "只做有收录的外链，连续不收录就放弃"

### 优先级 2：SEO 机会页优化（有展现无点击，优先冲排名）

> 数据来源：GSC 2026-02-16 ~ 2026-03-15
> 核心认知（哥飞教程）：有曝光没点击的主要原因是排名不够靠前，不是页面质量差。提升排名靠两条腿：外链提权重 + 页面信息增量。

**第一步：继续推外链（最重要，直接提排名）**
- [ ] 外链建设不要停，这是新站提升排名最直接的手段
- 哥飞原话："即使再低KD的词，新站也不可能立马拿到靠前排名，需要外链提升权重"

**第二步：逐页优化以下 6 个机会页**

| 页面 | 展现 | 排名 | 优先级 |
|------|------|------|--------|
| `/arena/arena-17` | 87 | 23.1 | 🔥 最优先 |
| `/arena/arena-18` | 96 | 26.8 | 🔥 |
| `/arena/arena-16` | 73 | 24.3 | 🔥 |
| `/arena/arena-13` | 27 | 19.7 | 排名最靠前，强化内链即可 |
| `/arena/arena-11` | 61 | 39.8 | ⚠️ 排名深，需更大力度 |
| `/arena/arena-12` | 37 | 34.7 | ⚠️ 同上 |

每个页面的优化 checklist：
- [ ] **标题 (Title)**：关键词放前面，覆盖多种搜索表达（如 "Best Arena 17 Decks - Clash Royale Arena 17 Deck Builder 2026"）
- [ ] **H1 标签**：当作"第二个标题"，含核心关键词，用 AITDK 插件对标竞品 heading 结构
- [ ] **关键词密度**：核心词密度 3%，总字数 600+，注意按钮等重复文字的干扰
- [ ] **内链**：从首页和相邻 arena 页加内链指向这些机会页（参考 Toolify.ai 的内链设计）
- [ ] **内容信息增量**：提供竞品没有的内容（arena meta 变化、卡组克制关系、段位攻略建议），Google 首页内容平均约 1400 字
- [ ] **canonical**：检查是否正确

**千万别犯的错（哥飞教程）：**
- 别堆关键词，要自然使用
- 别过度优化，自然平衡最重要
- 质量永远比字数重要

### 优先级 2.5：工具功能强化（Office Hours 诊断 2026-03-20）

> 来源：Office Hours 诊断 + Codex 需求调研 + GA4/GSC 数据验证
> 核心发现：arena-17 跳出率 67%、停留 6 秒；用户搜牌单词进来但页面太薄无法留住人
> 策略调整：不做攻略/打法指南内容（站长不玩 CR，无领域知识），走纯工具站路线
> 哥飞教程验证：成功案例几乎全是工具站，工具站不需要领域知识，靠功能服务用户
> **2026-03-31 更新**：dbs 商业诊断 + Gemini 交叉验证 → 工具功能提升为 P0，先修漏桶再灌水。「我有哪些卡」已上线。

**已完成**
- [x] 复制卡组链接按钮（给用户行动路径）
- [x] 验证灰块问题 → 不严重，不需要修
- [x] **「我有哪些卡」勾选过滤**（完美匹配 / 差1张 / 差2张分组 + 空状态兜底 + localStorage 持久化）

**下一步工具功能（P1）**
- [ ] 卡组排序/筛选功能（按胜率、费用、使用率排序）
- [ ] 卡组类型标签（beatdown / cycle / siege / bridge spam，基于费用和卡牌自动判定）
- [ ] 卡组对比功能（选两套卡组对比费用/卡牌差异）

**数据信任度（P1）**
- [x] 添加数据更新时间戳（"Updated: March 2026"）— 已有 evidence block，需确认每个页面都显示
- [x] 展示样本量，增强数据可信度 — DeckCard 已显示 sample size，确认覆盖率
- [x] 修正 arena 页面措辞，不再暗示"为该杯段优化"，明确说明数据来自高水平对局、按卡牌可用性分配
- [x] 扩大采样：TOP_PLAYERS_PER_REGION 50→200，地区 10→25，双榜采样（Path of Legend + Trophy Road），MIN_DECK_COUNT 5→15

**数据管线升级（P2 — 未来）**
- [ ] **按杯段 Clan 采样**：通过 CR API 搜索不同杯段的公会（如 4000-5000、5000-6000 杯），取成员列表，抓战斗日志，获取真正的中低段数据。API 调用量较大，需评估配额
- [ ] **数据累积策略**：每次跑脚本不覆盖旧数据，而是合并（存 raw-deck-stats.json 保留原始 wins/losses/total），让数据越跑越厚
- [ ] **觉醒（Evolutions）信息**：CR API battle log 返回觉醒数据，可标注卡组中哪些卡应觉醒
- [ ] **皇家塔部队（Tower Troops）**：独立于 8 卡卡组的机制，考虑是否值得覆盖

**工具体验优化（P2）**
- [ ] 可替换卡牌建议（基于数据：同 arena 可用的相似费用/定位卡牌）
- [ ] 按时间范围切换数据（本周/本月 meta）

### 优先级 2.8：Google Trends 热词抓取（pytrends）

> 来源：哥飞教程推荐 + 社群分享（2026-04-09）
> 工具：[pytrends](https://github.com/GeneralMills/pytrends) — 模拟浏览器请求 Google Trends 的 Python 开源库
> 状态：待做，当前 CTR 优化优先级更高，后续再集成

**用途**：
- 输入 CR 相关词根，抓取最近 7 天 rising queries，发现新的页面机会
- 验证 programmatic SEO 选题是否有真实搜索需求
- 捕捉新赛季/新卡发布带来的爆发性搜索，提前发布内容抢排名

**待做**：
- [ ] 安装 pytrends，写独立 Python 脚本抓取 CR 相关 rising queries
- [ ] 测试词根：`clash royale deck 2026`, `clash royale best cards`, `clash royale arena`, `clash royale tier list`, `cr deck builder`
- [ ] 做好限流（请求间隔 10-30 秒），避免 429
- [ ] 评估是否值得做成定期任务（cron job）
- [ ] 如 pytrends 不稳定，评估付费替代方案（DataForSEO API）

### 优先级 3：提升内容质量
- [x] 按卡牌解锁 arena 过滤卡组，让每个 arena 页面内容真正不同
- [ ] 设置定时更新机制（定时构建），保持数据新鲜

### 优先级 4：扩展覆盖面
- [ ] 多语言版本（西语、葡语、日语，非英语市场竞争更小）
- [ ] 按卡组类型分类页面（beatdown / cycle / siege / bridge spam）
- [ ] 卡牌详情页（每张卡的属性和推荐卡组）

### 优先级 4：页面美化
- [ ] 改进卡牌展示样式（稀有度颜色区分）
- [ ] Arena 页面加 arena 图标/背景
- [ ] 移动端适配优化
- [ ] **收藏资源**：[designprompts.dev](https://www.designprompts.dev/) — AI 驱动的设计风格浏览器（31+ 种 UI 风格 + 提示词）。等流量稳定（500+ UV/天）且工具功能完善后，可用作 UI 重构的灵感参考。

### 优先级 5：变现
- [ ] **立即申请 Google AdSense**（2026-03-31 决定提前申请，审核 2-4 周，不影响其他工作）
- [ ] 流量达标后申请 Microsoft Advertising（覆盖 Bing 流量）
- [ ] 广告位布局规划

### CR 站流量 & 收益目标
- 目标 PV：5000/月
- 预估收益：$20/月（Google AdSense $12 + Microsoft Advertising $5-8）
- RPM 参考：游戏类 $2-8（Google）/ $2-5（Bing）
- 天花板：英语版 5000-15000 PV/月，加西语版可突破

### 长期目标
- 目标：2027 年底前矩阵站总收入 $500/月
- 策略：CR 站验证成功后，模板化建站流程，复制到其他游戏/领域
- 预计需要 10-20 个站，每站 $20-30/月

## 出海收入门槛参考

- **月入 $1,000**：证明你知道如何做一个可以持续收钱的产品
- **稳定日入 $100**（月入 ~$3,000）：证明你能获取稳定且持续的流量
- **月入 $10,000**（日入 $333）：不仅能持续流量，还能知道如何继续提升流量
- **月入 $100,000**（日入 $3,333）：精神面貌和思想境界提升，容易冲向日入万刀
- **月入 $300,000**（日入 $10,000）：通常已有小团队，需要解放自己，把重复工作交给成员
- **月入 $500,000**：很多小团队卡在这个门槛；简单多做几个站没用，要盯一个大方向做透做深
- **月入 $1,000,000**：过了 $500K 后相对容易到达
- **日入 $100,000**：业务要么付费用户多，要么客单价高

> 当前阶段目标：月入 $1,000（验证 CR 站模型）→ 模板化复制

- "clash royale arena X deck" 类长尾词有真实搜索量（单词 12K-14.8K/月）
- 数据采集使用 Bayesian Average + 使用率加权排名，避免小样本偏差
- ~~当前 20 个 arena 页内容重复（同一批卡组），存在被 Google 判重复内容的风险~~ ✅ 已解决：arena 过滤 + 去重 + 新手卡组
- 单站 AdSense 预估收入 $10-50/月，取决于排名和流量


