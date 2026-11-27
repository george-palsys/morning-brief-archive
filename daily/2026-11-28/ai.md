# 全世界 AI 新功能及重大事件｜2026-11-28

[← 今日摘要](README.md)｜[產品動態](products.md)｜[新知識](knowledge.md)｜[CVE](cve.md)｜[台灣 IT](taiwan.md)｜[AI](ai.md)｜[清單維護](maintenance.md)｜[26 項產品現況](../../products/README.md)

今天 3 則。昨天到今天是美國感恩節假期，Anthropic、OpenAI、Google、Microsoft、AWS、IBM 的官方頁面在 2026-11-27 之後都沒有新的產品發布；下面三則的原始日期是 11/24 到 11/26，媒體在 11/27 報導，先前的晨報沒有寫過。

### 瑞士國家網路安全中心：首次確認用 AI agent 發動的攻擊成功入侵關鍵基礎設施營運者

- 發生什麼事：瑞士國家網路安全中心（NCSC）在 24 November 2026 發布公告，說近日第一次接到這一類通報，受害者包含至少兩個部門的關鍵基礎設施營運者；公告寫，在 NCSC 已知的所有案例裡，AI agent 都成功入侵了受害者的 IT 系統。攻擊者用的是所謂的 Agentic Offensive Frameworks，公告舉的例子是 ARTEX 與 CyberStrikeAI，並說從網際網路連得到的這類 AI agent 數量從 2026 年 10 月以來幾乎翻倍。The Hacker News 在 Nov 27, 2026 報導，另外引述 NCSC 主任受訪的說法「5 起確認案例中 4 起成功」；這個數字只在這篇報導看到，而且和公告寫的「全部成功」不一致，報導自己也指出了這一點。
- 影響：這是政府機關第一次把「AI agent 自己完成入侵」寫成已經發生的事。這類工具不帶新的攻擊技術，是用機器的速度把已知的弱點一個一個試過去，所以對外的管理介面、預設密碼、沒修的已知漏洞會更快被打到。客戶端該做的事沒有變，只是時間變短：收斂對外曝險、已遭利用的漏洞優先修。
- 來源：https://www.bacs.admin.ch/en/26-ki-agenten-1-en ；https://thehackernews.com/2026/11/switzerland-confirms-ai-assisted.html

### Microsoft 公開 AI 攻擊框架 ARTEX 的拆解：六個威脅組織已經把它納入自己的工具

- 發生什麼事：Microsoft Threat Intelligence 在 2026-11-25 的文章說，ARTEX 從 2026 年 7 月釋出之後，Storm-0940、Storm-3358、Onyx Sleet、Pearl Sleet、Crystal Typhoon、Salt Typhoon 都已經把它整合進自己的工具，可以在幾分鐘內從偵察走到取得持久的高權限存取。它的做法是多個 agent 分工：planner 持續看一張記錄已發現資產與結果的知識圖，發出簡短的攻擊指示；worker 用真的 shell 與工具（nmap、nc、telnet 等）去執行，把新發現寫回圖裡；最後由 reporter 為每個確認的弱點寫出重現步驟。它可以接任何 LLM，某個模型額度用完或被限速就換下一個。
- 影響：因為它能接任何模型（包含拿掉防護的開放權重模型），單一模型供應商的安全控制擋不住它。Microsoft 寫最可靠的訊號是行為（短時間內大量而多樣的請求），不是來源 IP 或 User-Agent。防守建議是先收斂對外曝險、對 Web 與 API 做速率限制與 WAF、保護憑證與應用程式的機密。對我們的客戶，對外的 Jenkins、Rancher、OpenShift console 這類管理介面要先收起來。文章後半的偵測特徵與查詢語法今天沒有讀。
- 來源：https://www.microsoft.com/en-us/security/blog/2026/11/25/what-defenders-need-to-know-artex-agentic-ai-framework-threat-actors-abuse/

### OpenAI 修正 GPT-6.2 的計費錯誤，Astra 與 Sol 的額度會更快用完（只有媒體報導）

- 發生什麼事：iThome 在 2026-11-27 報導：OpenAI 於 11 月 26 日通知，先前的錯誤讓 GPT-6.2 Astra 與 Sol 少算了用量，修正後 Astra 用完配額的速度加快 40%、Sol 加快 25%；不追討先前的差額，並給 Go、Plus、Pro、Business 方案一次配額重置。iThome 引用的原始出處是一則 X 貼文，今天沒有打開；OpenAI 的官方頁面沒有找到這則消息，內容沒有向原廠確認。
- 影響：如果屬實，用這兩個模型的人做同樣的工作會更早碰到上限，用量大的團隊要重新估。現在不用動作。
- 來源：https://www.ithome.com.tw/news/180853
