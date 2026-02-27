# CR Deck Builder TODO

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
- [x] 全站部署上线（104 个静态页面）
- [x] HOT_CARDS 扩展到 14 张卡（260 个静态页面）
- [x] 首页加 How It Works 引导区、数据统计区、FAQ 区块（含 JSON-LD schema）
- [x] 各 Arena 页和 Card 页补充描述性文字

- [x] 页面标题加入 "Clash Royale" 关键词，匹配搜索词

## 待做

### 优先级 1：验证流量模型（当务之急）
- [ ] 外链建设：Reddit、Product Hunt、SuperCell 社区、V2EX/HN
- [ ] 等 1-2 个月观察 Search Console 数据，确认长尾词能否带来流量
- [ ] 首页正文补充到 800 字以上，核心关键词密度 2%-3%

### 优先级 2：提升内容质量（避免被判低质量站）
- [ ] 按卡牌解锁 arena 过滤卡组，让每个 arena 页面内容真正不同
- [ ] 设置定时更新机制（定时构建），保持数据新鲜

### 优先级 3：扩展覆盖面
- [ ] 多语言版本（西语、葡语、日语，非英语市场竞争更小）
- [ ] 按卡组类型分类页面（beatdown / cycle / siege / bridge spam）
- [ ] 卡牌详情页（每张卡的属性和推荐卡组）

### 优先级 4：页面美化
- [ ] 改进卡牌展示样式（稀有度颜色区分）
- [ ] Arena 页面加 arena 图标/背景
- [ ] 移动端适配优化

### 优先级 5：变现
- [ ] 流量达标后申请 Google AdSense
- [ ] 广告位布局规划

### 长期目标
- 目标：2027 年底前矩阵站总收入 $500/月
- 策略：CR 站验证成功后，模板化建站流程，复制到其他游戏/领域
- 预计需要 10-20 个站，每站 $30-100/月

## 关键发现（2026-02-27）
- "clash royale arena X deck" 类长尾词有真实搜索量（单词 12K-14.8K/月）
- 数据采集使用 Bayesian Average + 使用率加权排名，避免小样本偏差
- 当前 20 个 arena 页内容重复（同一批卡组），存在被 Google 判重复内容的风险
- 单站 AdSense 预估收入 $10-50/月，取决于排名和流量
