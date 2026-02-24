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

## 待做

### 优先级 1：SEO 基础优化（参考哥飞教程清单）
- [ ] 首页正文补充到 800 字以上，核心关键词密度 2%-3%
- [ ] 各 Arena 页和 Card 页补充描述性文字，增加关键词覆盖
- [x] 添加结构化数据（JSON-LD：BreadcrumbList、FAQ schema、WebSite）
- [x] 图片本地化并转 WebP 格式
- [ ] 跑 PageSpeed 测试并优化分数

### 优先级 2：外链建设（教程核心，新站每天 10 条）
- [ ] Reddit r/ClashRoyale 发帖分享工具
- [ ] SuperCell 官方社区、游戏论坛发帖
- [x] GitHub 建开源仓库，README 放网站链接
- [ ] Product Hunt 提交
- [ ] V2EX / Hacker News 发帖
- [ ] 注意锚文本多样化，避免同一锚文本过多被惩罚

### 优先级 3：接入真实对战数据
- [ ] 调研数据源（RoyaleAPI / Clash Royale 官方 API / 第三方统计站）
- [ ] 替换硬编码的 META_DECKS，改为从 API 获取真实卡组、胜率、使用率
- [ ] 设置定时更新机制（ISR 或定时构建），保持数据新鲜

### 优先级 4：扩展更多长尾页面
- [ ] HOT_CARDS 扩展到 15 张卡（Golem / Lava Hound / Goblin Barrel / Miner / Royal Giant / X-Bow / Mega Knight / Sparky / Valkyrie / Prince / Electro Giant），预计 200+ 页面
- [ ] 按卡组类型分类页面（beatdown / cycle / siege / bridge spam）
- [ ] 卡牌详情页（每张卡的属性和推荐卡组）
- [ ] 多语言版本（西班牙语、葡萄牙语、日语等，切其他市场）

### 优先级 5：页面美化
- [ ] 改进卡牌展示样式（稀有度颜色区分）
- [ ] Arena 页面加 arena 图标/背景
- [ ] 首页加简单的介绍和使用引导
- [ ] 移动端适配优化

### 优先级 6：变现
- [ ] 流量达标后申请 Google AdSense
- [ ] 广告位布局规划
- [ ] 备选：接入其他广告商（教程提到 AdSense 可能判定无效流量限制展示）
