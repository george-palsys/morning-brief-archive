# 全世界 AI 新功能及重大事件｜2026-11-22

[← 今日摘要](README.md)｜[產品動態](products.md)｜[新知識](knowledge.md)｜[CVE](cve.md)｜[台灣 IT](taiwan.md)｜[AI](ai.md)｜[清單維護](maintenance.md)｜[26 項產品現況](../../products/README.md)

### Signal 預設擋下作業系統內建 AI 代理的螢幕擷取，並坦承這個防護不完整

- 發生什麼事：Signal 基金會主席 Meredith Whittaker 在 2026-11-20 發文宣布，Signal 會在 iOS 27 上阻擋 App 內的螢幕截圖，在 Android 上則是偵測到 AI 助理試圖擷取畫面時阻擋。對象是內建在作業系統裡的代理功能，文中點名 Google Gemini 的 Gemini Intelligence 與 Siri AI 的 Onscreen Awareness。Signal 去年已經用同樣的方式擋過 Windows 11 的 Microsoft Recall。
- Signal 的理由：這些代理靠「掃描」螢幕內容取得使用者資訊，Signal 的訊息一旦被擷取，就會進到代理當下使用的本機資料庫或遠端伺服器，脫離 Signal 的控制，也危及對話中其他人的隱私。文中稱這是對 Signal 的「existential threat」。
- 限制（Signal 自己列的）：
  - 使用者可以在 Signal 的設定裡關掉這個保護，但訊息內容可能因此暴露給 AI 代理。
  - 擋截圖擋不了其他途徑，例如代理直接從檔案系統讀取裝置上已有的內容。
  - Google、Apple、Microsoft 沒有提供讓開發者限制 AI 存取又不犧牲使用體驗的方法；macOS 上目前做不到這項保護。
  - 這些代理實際怎麼運作缺少文件，Signal 是靠自己在 Android 與 iOS 上做鑑識調查才弄清楚。
- 影響：對金融與公部門客戶是一個現成的提醒：行動銀行 APP、內部通訊與公文系統的畫面，同樣可能被作業系統層級的 AI 代理讀到。客戶的行動裝置管理政策與 APP 的畫面保護值得重新檢視；這和 11-21 晨報四家銀行網銀盜轉案裡「手機被控制後驗證失效」是同一類風險。
- 來源：Signal 官方部落格「Signal is Serious About Protecting Your Privacy」（2026-11-20）：https://signal.org/blog/protecting-your-privacy/

### Anthropic 數學家宣稱與 Claude 合作證明黎曼猜想，尚未經獨立驗證

- 發生什麼事：The Verge 2026-11-20 報導，Anthropic 的數學家 Levent Alpöge 在個人網站發表聲明，表示他與 Claude 合作找到黎曼猜想（Riemann hypothesis）的證明，方法還能延伸到廣義黎曼猜想，並且已經把論證形式化（報導寫是以 Lean 呈現）。他說自己在「週日深夜」傳訊息給執行長 Dario Amodei，並暗示是等到公司週四 IPO 之後才公開。
- 目前的狀態：這個證明還沒有經過獨立驗證。Anthropic 沒有評論，也沒有參與這次發表；The Verge 詢問後沒有立即得到回覆。Anthropic 在今年 8 月曾表示正用 Claude 研究黎曼猜想，但當時寫的是不預期 Claude 用的技巧能導出證明。
- 背景：黎曼猜想在 1859 年提出，內容是質數分布與某個函數零點的關係，是七個千禧年大獎難題之一。
- 影響：在獨立驗證出來之前，這只能當成「有人宣稱」。如果成立，是 AI 輔助研究能力的重大里程碑；對我們的業務沒有直接影響，客戶問起時照實說明目前未經驗證即可。
- 注意：這一則只讀到 The Verge 的報導，Alpöge 網站上的原始文件我沒有打開。
- 來源：The Verge「Anthropic mathematician claims to have solved prestigious Millennium Prize problem with Claude」（2026-11-20）：https://www.theverge.com/ai-artificial-intelligence/1010051/anthropic-riemann-hypothesis-millennium-prize-problem

### 川普揚言對把 AI 資料中心蓋在美國境外的企業課「tremendous tax」

- 發生什麼事：The Verge 2026-11-20 報導，美國總統川普在與中國國家主席習近平、俄羅斯總統普丁的峰會後的記者會（美國時間週五）上說：「We're not going to allow our companies to build data centers outside of our country」，並表示要對在美國境外蓋資料中心的企業課重稅；理由是過去晶片外移對美國傷害很大，如果放任資料中心外移，「China will take them all」。
- 目前的狀態：川普沒有提出細節，並說這是他第一次公開講，連自己的團隊都還沒聽過。The Verge 指出，新的民主黨多數國會將在兩個月內就任，這項主張不容易實現；同時美國各州與城市正在對新建資料中心設下限制。
- 影響：目前只是口頭宣示，沒有法案或行政命令。要追蹤的是它會不會變成正式政策：美國雲端業者在台灣與亞洲的資料中心投資如果受影響，會牽動本地的 AI 算力供給。
- 來源：The Verge「Trump threatens 'tremendous tax' for moving AI data centers outside the US」（2026-11-20）：https://www.theverge.com/policy/1038892/trump-foreign-data-centers-tax
