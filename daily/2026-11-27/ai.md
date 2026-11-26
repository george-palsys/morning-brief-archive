# 全世界 AI 新功能及重大事件｜2026-11-27

[← 今日摘要](README.md)｜[產品動態](products.md)｜[新知識](knowledge.md)｜[CVE](cve.md)｜[台灣 IT](taiwan.md)｜[AI](ai.md)｜[清單維護](maintenance.md)｜[26 項產品現況](../../products/README.md)

今天 3 則。

### Anthropic：Claude 桌面版可以把 artifact 安裝成獨立的 App（beta），權限分三級

- 發生什麼事：Anthropic 的說明文章寫，Claude 的 Mac 與 Windows 桌面版開始推出 beta 功能：artifact 可以安裝成有自己圖示與視窗的 App，可以分享給別人，App 裡可以使用 Claude 與 connectors，artifact 修改後 App 會自動更新；App 發出的請求算進方案的用量上限。權限分三級：預設（等同瀏覽器的層級）、App permissions、Full computer access（只限自己做的 App，或 Team、Enterprise 組織內做的 App）；每次更新後會重新詢問權限。Team 與 Enterprise 的管理員可以開關 App permissions 與 full access。文章寫明 Anthropic 不審查這些 App。文章頁面上的日期是 November 24, 2026（是不是發布日沒有確認）；iThome 在 2026-11-26 報導。
- 影響：使用者自己用 AI 做的小工具，從「聊天視窗裡的一段內容」變成「裝在電腦上、可以分享、可以要到整台電腦權限的程式」，而且沒有人審查。企業端要先決定管理員那兩個開關的預設值；金融與公部門客戶的端點管理也要把這一類 App 算進去。
- 來源：https://claude.com/resources/articles/install-as-app ；https://www.ithome.com.tw/news/180804

### OpenAI 傳出要合併 ChatGPT 的 Chat 與 Work 分頁，額度改成共用（只有媒體報導）

- 發生什麼事：iThome 在 2026-11-26 引述 TechCrunch 報導：OpenAI 從 11 月下旬起先對少數 Pro 用戶合併 ChatGPT 的 Chat 與 Work 兩個分頁，12 月擴大到 Plus、Pro、Business，兩邊的額度改成共用。OpenAI 的官方頁面今天沒有找到這則消息，內容只有媒體報導，沒有向原廠確認。
- 影響：如果屬實，一般對話和代理式的工作會吃同一份額度，用量大的團隊要重新估。現在不用動作，等 OpenAI 的正式說明。
- 來源：https://www.ithome.com.tw/news/180807

### AWS Sign-In 支援 Enterprise-Managed Authorization：由企業的身分提供者決定 AI agent 能不能連進 AWS

- 發生什麼事：AWS Security Blog 在 2026-11-25（UTC）的文章寫，AWS Sign-In 支援以 Identity Assertion JWT Authorization Grant（ID-JAG）實作的 Enterprise-Managed Authorization：Okta 這類企業身分提供者（IdP）可以授權 AI agent 連到 AWS MCP Server。流程是 IdP 發出短效、已簽章的 ID-JAG；agent 拿它到 AWS Sign-In 的 OAuth token endpoint 交換；STS 依 IAM role 的 trust policy 判斷；最後 agent 拿到綁定該 IAM role 的 OAuth access token。
- 影響：agent 能連哪個雲端服務，改成由企業的 IdP 集中決定，不是由每個使用者自己按同意。這和昨天新知識寫的 Token Exchange（RFC 8693）是同一條脈絡：agent 的授權逐步回到企業既有的身分系統裡。客戶評估 agent 存取控管時，IdP 有沒有支援 ID-JAG 會是一個檢查項目。
- 來源：https://aws.amazon.com/blogs/security/secure-agentic-access-to-aws-with-enterprise-managed-authorization/
