# 全世界 AI 新功能及重大事件｜2026-11-20

[← 今日摘要](README.md)｜[產品動態](products.md)｜[新知識](knowledge.md)｜[CVE](cve.md)｜[台灣 IT](taiwan.md)｜[AI](ai.md)｜[清單維護](maintenance.md)｜[26 項產品現況](../../products/README.md)

### Google 發表 Gemini 4 Neon：定位在 Carbon 與 Hydrogen 之間，主打軟體工程與複雜分析

- 發生什麼事：Google 在 2026-11-18 發表 Gemini 4 Neon。在 Gemini 4 系列中，Carbon 負責最困難的長時間專案，Hydrogen 負責快速的日常工作，Neon 取兩者之間。context window 為 100 萬 token；API 價格每百萬 token 輸入 3 美元、快取輸入 0.15 美元、輸出 15 美元。當天開始在 Gemini API（Google AI Studio 與付費層）、Android Studio、Google Antigravity 與 Gemini app（Pro 與 Ultra 訂閱者）陸續開放；另有資安用途的版本，在之後幾天提供給符合資格的 Fairwind Program 成員。Google 表示在預設的 high 思考等級下，每個任務的成本比 Carbon 低 32%。官方文章沒有提到 Vertex AI。
- Google 自己公布的資安相關成績（都是 Google 的說法，沒有第三方驗證）：
  - AutoBaxBench hard tier 76%。
  - WebExploitBench v1.2 51.26%。
  - SEC-bench Pro 90.5%。
  - CWE-bench v2 70.7%。
  - Gray Swan 的 prompt injection 測試在最高思考等級下攻擊成功率 0.0%。
- 影響：輸入 3 美元、輸出 15 美元的價位，落在 OpenAI 本週推出的 GPT-6.2 Sol（2 美元、10 美元）與 GPT-6.2 Astra（8 美元、40 美元）之間，中價位模型的選擇又多一個。Google 特別拿「寫出較安全的程式碼」和找漏洞的成績當賣點，模型廠商持續往程式碼安全靠攏，和 Coverity、Black Duck 所在的市場有關，值得持續追蹤。
- 來源：Google 官方部落格（2026-11-18）：https://blog.google/innovation-and-ai/models-and-research/gemini-models/introducing-gemini-4-neon/

### 美國多家大型銀行修改條款：客戶讓第三方 AI agent 操作帳戶，後果由客戶自負

- 發生什麼事：TechCrunch 2026-11-18 報導：
  - Citibank：本週更新 Online User Agreement，客戶把帳戶存取權交給第三方 AI agent 後，agent 的行為由客戶負責；如果 AI 工具洩漏帳密或被駭，駭客用該帳戶做的事也算客戶的。使用 Citi 自家的 AI agent 不會增加責任。
  - JPMorgan：10 月已宣布類似政策。
  - Bank of America：10 月已宣布類似政策。
  - PNC：2026-11-18 修改條款，報導沒有提供細節。
  - Citizens：本週寄信提醒客戶，AI 助理做的任何事都由客戶負責。
  - 報導沒有寫各家條款的生效日期。
- 影響：這是美國銀行的條款，台灣金融業是否跟進，我沒有查到資料。對金融客戶有參考價值的地方在於：金管會資訊服務處 11-17 提出的精進方向已把「零信任驗證擴及 AI 代理、系統帳號與 API 金鑰」列進去（見 11-19 晨報），客戶端透過 AI agent 登入網銀的身分辨識與責任歸屬，會是接下來要面對的問題。
- 來源：TechCrunch（2026-11-18）：https://techcrunch.com/2026/11/18/more-banks-says-customers-using-ai-agents-are-on-their-own-even-if-they-get-hacked/

### Anthropic 在 Nasdaq 掛牌，首日收在 97.17 美元，比發行價高約 17%

- 發生什麼事：Anthropic 在 2026-11-18 公告 IPO 定價，每股 83 美元，發行 980,000,000 股 Class A 普通股，其中 956,351,354 股由公司發行、23,648,646 股由既有股東出售，承銷商另有 30 天內加購最多 147,000,000 股的選擇權；股票代號 ANT，在 Nasdaq Global Select Market 掛牌，預計 2026-11-20 完成交割。2026-11-19 首日交易，中央社報導開盤後幾分鐘內股價就超過 110 美元，收盤 97.17 美元，漲幅超過 17%，市值一度超過 2 兆美元；同一天美股四大指數都下跌超過 2%。Stock Titan 的即時紀錄寫第一筆成交在美東時間上午 11:48，價格 111.50 美元。
- 注意：募資總額 Anthropic 的新聞稿沒有寫。用 83 美元乘以 9.8 億股算是約 813 億美元（含既有股東出售的部分，那部分公司拿不到），中央社寫「超過 800 億美元」。
- 影響：Anthropic 成為上市公司後要定期揭露財報，企業客戶評估 Claude 的供應商風險時多了公開資訊可看。另外 Drupal 在 2026-11-18 修補的重大漏洞 CVE-2026-132165（公告 SA-CORE-2026-017，https://www.drupal.org/sa-core-2026-017 ）就是 Anthropic 的 OSS Scanner 找到的，AI 找漏洞的速度會讓修補節奏更緊。
- 來源：
  - Anthropic 新聞稿（2026-11-18）：https://www.anthropic.com/news/anthropic-prices-initial-public-offering
  - 中央社「美股收挫　Anthropic漲逾17%未能帶動大盤」（2026-11-20）：https://www.cna.com.tw/news/afe/202611200012.aspx
  - Stock Titan 首日交易即時紀錄（2026-11-19）：https://www.stocktitan.net/articles/anthropic-ipo-live-ant-first-trading-day-2026

### 川普稱與習近平對 AI 監管有共識，將共同制定安全規範

- 發生什麼事：中央社 2026-11-20 綜合外電報導，美國總統川普 11-19 接受 Fox News 專訪時表示，他與中國國家主席習近平都希望基於安全考量監管 AI，將共同制定合理的 AI 管理規範。中國駐美國大使館同一天發表聲明，主張中美應「加強溝通與協調，防範AI帶來的安全風險，並確保AI始終處於人類控制之下」。兩人本週在深圳 APEC 峰會期間會面。
- 注意：目前只有雙方的口頭表態，沒有查到任何正式文件、時程或規範內容。
- 影響：短期對客戶沒有實際影響。如果之後真的出現美中共同的 AI 安全規範，各國（包括台灣）的 AI 法規與金融業 AI 指引可能會拿來參照，屬於後續追蹤的項目。
- 來源：中央社「川普稱與習近平對AI監管有共識　將合作制定安全規範」（2026-11-20）：https://www.cna.com.tw/news/aopl/202611200027.aspx
