# 全世界 AI 新功能及重大事件｜2026-11-26

[← 今日摘要](README.md)｜[產品動態](products.md)｜[新知識](knowledge.md)｜[CVE](cve.md)｜[台灣 IT](taiwan.md)｜[AI](ai.md)｜[清單維護](maintenance.md)｜[26 項產品現況](../../products/README.md)

### Google：Workspace MCP 伺服器與 Workspace CLI 正式上線，Agent Gateway 管 agent 的連線

- 發生什麼事：Google Cloud 的文章（頁面日期 November 25, 2026）公布一組給 AI agent 用的控管介面。Workspace MCP 伺服器（Gmail、Drive、Docs、Sheets、Slides、Calendar、Chat、Tasks）與 Workspace CLI 已正式上線（generally available）；Agent Gateway 是給 LLM、MCP 與 Agent2Agent 流量用的閘道，依 Agent Registry 驗證 agent 身分、套用 IAM 政策與預設拒絕的輸出規則。文章列出兩個日期：February 1, 2027 與 April 1, 2027；iThome 的報導沒有說明這兩個日期，細節以 Google 的原文為準。
- 影響：大廠開始把「agent 走的路」和「一般應用程式走的 REST API」分開管，agent 這條路上每個請求都過政策檢查、有獨立身分與稽核紀錄。客戶用 Google Workspace 又想讓 agent 讀信、讀文件的，之後會被引導走 MCP 伺服器這條路。對我們的啟發是評估 agent 方案時，把「agent 的身分怎麼註冊、輸出連線是不是預設拒絕」列進檢查項目。
- 來源：Google Cloud Blog，Deploying agents safely in your enterprise（2026-11-25）：https://cloud.google.com/blog/products/identity-security/deploying-agents-safely-in-your-enterprise ；iThome 報導（2026-11-25）：https://www.ithome.com.tw/news/180788
