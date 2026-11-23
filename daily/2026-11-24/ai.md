# 全世界 AI 新功能及重大事件｜2026-11-24

[← 今日摘要](README.md)｜[產品動態](products.md)｜[新知識](knowledge.md)｜[CVE](cve.md)｜[台灣 IT](taiwan.md)｜[AI](ai.md)｜[清單維護](maintenance.md)｜[26 項產品現況](../../products/README.md)

### Nvidia 調查案（後續）：董事會一致決議讓黃仁勳回任總裁、執行長與董事，立即生效

- 發生什麼事：這是 11-21 晨報「加州檢察總長對 Nvidia 發出調查傳票」的後續。Nvidia 在 2026-11-23 發布新聞稿，宣布黃仁勳（Jensen Huang）回任總裁、執行長與董事，立即生效。
- 新聞稿寫的內容：
  - 董事會在與黃仁勳進行一連串討論與會議後一致表決通過，表示對他的坦誠與領導 Nvidia 的能力感到滿意。
  - 董事會在決策過程中聽取了美國政府高層的意見，並據此認為黃仁勳回任不構成國家安全風險。
  - Harvey C. Jones 續任董事長；財務長 Colette Kress 卸下代理執行長，繼續擔任財務長。
  - 新聞稿提到，先前因為有報導指黃仁勳是外國情報行動的目標，董事會已成立全由獨立董事組成的委員會進行調查。這一段之後的內容我沒有讀到，委員會的調查是否結束，未查到。
- TechCrunch 2026-11-23 的報導補充：
  - 黃仁勳辭職到回任不到兩週。
  - 幾天前的第三季財報電話會議上，Harvey C. Jones 還表示沒有打算讓黃仁勳回任，公司並已委託獵才公司 Heidrick & Struggles 尋找正式接任人選。
  - 美國總統川普在 Truth Social 發文表示董事會做了正確決定，並表示美國司法部長確認政府沒有黃仁勳從事任何非法行為的證據。
  - Nvidia 股價開盤上漲 30%；美東時間上午 9:51 報 159.95 美元，上漲 27%。
- 影響：
  - 對我們的產品與交付沒有直接影響。客戶如果有 GPU 伺服器或 AI 基礎建設的採購案，供應商經營階層的不確定性暫時解除。
  - 11-21 晨報寫的加州檢察總長傳票，以及 SEC 的民事調查，在回任之後是否繼續，新聞稿與 TechCrunch 的報導都沒有寫，未查到。
- 來源：
  - Nvidia 新聞稿「NVIDIA Board Reinstates Jensen Huang as President, CEO and Board Director」（2026-11-23）：https://nvidianews.nvidia.com/news/nvidia-board-reinstates-jensen-huang-as-president-ceo-and-board-director
  - TechCrunch「Nvidia reverses course and brings Jensen Huang back as CEO」（2026-11-23）：https://techcrunch.com/2026/11/23/nvidia-reverses-course-and-brings-jensen-huang-back-as-ceo/

### 亞馬遜與 Decart（後續）：亞馬遜正式公告買下 Decart 的 AI 最佳化技術並延攬創辦團隊，官方沒有公布金額

- 發生什麼事：這是 11-23 晨報「金融時報：亞馬遜接近以約 75 億美元收購 AI 新創 Decart，交易尚未確定」的後續。亞馬遜在 2026-11-23 於官網公告，已簽署協議買下 Decart Optimization Stack（DOS）背後的專有技術，並延攬 Decart 的三位共同創辦人 Dean Leitersdorf、Moshe Shalev、Orian Leitersdorf 與其 AI 研究及工程團隊。
- 亞馬遜公告寫的內容：
  - Decart 的技術用來進一步最佳化亞馬遜的推論與自研晶片效能，讓客戶以更快的速度、更低的成本訓練與執行 AI 模型。
  - 雙方從 2025 年開始合作，Decart 團隊在 Trainium 晶片上做出效能成果。
  - 交易完成須符合慣常的交割條件，包含主管機關核准。
  - 公告沒有寫交易金額。
- 金額與交易範圍（TechCrunch 2026-11-23）：
  - TechCrunch 引用 Bloomberg 的報導，寫亞馬遜支付 75 億美元。
  - TechCrunch 的寫法是亞馬遜取得 Decart 的「a good chunk」，也就是技術與團隊，不是整間公司。Decart 的世界模型 Oasis 與影片生成工具之後歸誰，亞馬遜的公告沒有寫。
  - TechCrunch 寫亞馬遜正準備把 Trainium 晶片賣給客戶，與 Nvidia 競爭；Decart 的技術可以讓客戶更容易把工作負載放到亞馬遜的晶片上。
- 影響：11-23 晨報寫「等亞馬遜正式公告再看」，現在公告出來了：這是技術與人才的收購，還要等主管機關核准。對我們的產品線與客戶沒有直接影響。
- 注意：75 億美元這個數字出自媒體（TechCrunch 引用 Bloomberg，以及 11-23 晨報中央社轉述的金融時報），亞馬遜官方沒有證實；Bloomberg 的原文我沒有打開。
- 來源：
  - Amazon「Amazon to purchase Decart's AI optimization technology to advance chip and model innovation for customers」（2026-11-23）：https://www.aboutamazon.com/news/company-news/amazon-decart-ai-optimization
  - TechCrunch「Amazon snaps up Decart's AI optimization tech for $7.5B as it prepares to sell Trainium chips」（2026-11-23）：https://techcrunch.com/2026/11/23/amazon-snaps-up-decarts-ai-optimization-tech-for-7-5b-as-it-prepares-to-sell-trainium-chips/

### 印度 CERT-In 示警：AI 輔助的網路攻擊已在銀行、金融服務業與支付服務商造成未經授權的金融交易

- 發生什麼事：The Hacker News 2026-11-23 報導，印度電腦緊急應變小組（CERT-In）上週發布公告，表示攻擊者正以 AI 輔助的網路攻擊鎖定該國的資通訊資產，已在銀行與金融服務業者、支援政府相關支付的技術服務商，以及處理供應商或合作夥伴付款的平台造成未經授權的金融交易。CERT-In 沒有公布被盜金額與受害單位，也沒有指明攻擊者。
- CERT-In 描述的手法（The Hacker News 轉述）：
  - 攻擊者濫用業務應用程式與服務供應商代為操作的流程，不是直接攻擊支付 API。
  - 先竄改業務紀錄或簽核關係，再走合法的付款流程，交易經由受信任的系統與既有簽核程序處理，沒有觸發告警。
  - 利用的是獨立驗證、對帳、業務紀錄異動審查這幾處的盲點。
  - 在這波以金錢為目的的攻擊中，代理式工具把初始入侵到最終造成損害的時間從數天壓縮到數小時。
- 同一篇報導整理的相關警示：
  - CERT-In 本月稍早警告，名為 Crafty Falcon 的組織使用 ARTEX、PentAGI、CAIRN、CyberStrikeAI 等工具自動化入侵金融業者。
  - 印度網路犯罪協調中心（I4C）表示，攻擊者利用未修補的軟體或設定錯誤的對外伺服器入侵，再鎖定自動撥款系統或支付與轉帳用的 API，把錢匯到人頭帳戶後經 IMPS/NEFT 快速移轉或提領。
  - 美國聯邦調查局（FBI）的警示寫，ARTEX 大幅縮短串接攻擊手法所需的時間，部分入侵從鎖定目標到取得高權限不到三小時。
- CERT-In 的建議：檢視業務應用程式、關鍵紀錄、使用者身分與第三方介面的安全；監控與事件應變要把「受信任的業務流程遭濫用」與「自動化入侵」納入。
- 影響：
  - 這是金融業客戶最該看的一則。攻擊走的是合法的付款流程，傳統以支付 API 為中心的監控看不到；要回頭檢查的是「誰能改簽核關係與受款資料、改了有沒有獨立覆核」。
  - 入侵的起點仍然是未修補的軟體與設定錯誤的對外伺服器。這和 11-23 晨報 TeamT5 講的「修補要更快」是同一件事，客戶問修補優先順序時可以引用。
  - 台灣的銀行有沒有出現同樣手法，這篇報導沒有寫，未查到；11-21 晨報四家銀行的網銀盜轉，金管會初步認定是客戶手機被植入惡意程式，是不同的手法。
- 注意：這一則讀的是 The Hacker News 的轉述，CERT-In、I4C 與 FBI 的公告原文我沒有打開；CERT-In 公告的確切日期報導只寫「上週」。
- 來源：The Hacker News「AI-Assisted Cyber Attacks Trigger Unauthorized Payments at Indian Banks and Fintech Firms」（2026-11-23）：https://thehackernews.com/2026/11/ai-assisted-cyberattacks-trigger.html

### Amazon 威脅情報：攻擊者的 AI 代理約 11 分鐘自行找到並利用醫療影像 AI 軟體 MONAI Label 的零時差漏洞，目標是東亞多所大學

- 發生什麼事：iThome 2026-11-23 報導，Amazon Threat Intelligence 在 11 月 20 日揭露，與中國相關的攻擊者濫用 AI 自動化攻擊框架 Cairn，鎖定東亞地區多所大學。其中 AI 代理程式自行發現並利用開放原始碼醫療影像 AI 軟體 MONAI Label 的路徑遍歷漏洞，取得大學伺服器的 root 權限。
- 經過（iThome 轉述 Amazon 的報告）：
  - 研究人員在 9 月 10 日發現一台未啟用身分驗證的 Cairn 伺服器，因此看到其中的專案設定、攻擊指令與 AI 代理程式的操作紀錄；攻擊活動發生在 9 月 8 日至 10 日。
  - 攻擊者只提供目標 IP 位址及「取得 Shell 存取權限」等簡單指令，AI 代理程式自行分析環境、選擇方法、調整策略。
  - AI 代理程式分析目標應用程式的 API 端點，發現檔案上傳功能可以把檔案寫到預定目錄之外；從分析 API 到成功利用漏洞約 11 分鐘。之後植入 Python 反向 Shell，取得 root 權限。
  - 漏洞被利用時沒有修補程式、安全公告或公開紀錄，Amazon 因此認定是 AI 代理程式自行發現的零時差漏洞。
  - 沒有成功的兩項攻擊：針對大學 Redis 伺服器的攻擊持續約 16 小時、執行 148 項操作；針對 GPU 伺服器的攻擊測試了超過 3 萬組帳密。
  - 歸因：Amazon 依據簡體中文操作指令、中國標準時間的時間設定與攻擊目標，研判攻擊者可能與中國有關，尚未確認所屬組織。
- 修補：MONAI Label 開發團隊 11 月 18 日發布安全公告，影響 0.8.5 及更早版本；11 月 22 日推出 0.8.6，修補 CVE-2026-133968 及另一項路徑遍歷漏洞。
- 影響：
  - 被攻擊的大學是哪幾所、有沒有台灣的學校，報導沒有寫，未查到。
  - MONAI Label 不是我們代理的產品。客戶如果有醫療影像或 AI 研究環境用到它，請升級到 0.8.6。
  - 可以帶給客戶的重點是時間：不需要已知漏洞清單，AI 代理對一個冷門的對外服務約 11 分鐘就能找到洞並打進去；失敗時會連續嘗試十幾個小時。內部研究用、沒有列入資產清單的對外服務，是最容易被這樣打進去的地方。
- 注意：
  - 這一則讀的是 iThome 的報導，Amazon 的報告與 MONAI Label 的安全公告原文我沒有打開。
  - The Hacker News 在 2026-11-21 已有一篇標題相符的報導（我只看到標題，內文沒有打開），早於 11-23 晨報的蒐集時間，11-23 晨報沒有收到，今天補上。
- 來源：
  - iThome「東亞多所大學遭鎖定，中國駭客用AI攻擊框架Cairn發動攻擊，11分鐘內發現並利用醫療影像AI軟體零時差漏洞」（2026-11-23）：https://www.ithome.com.tw/news/180697
  - The Hacker News「Attackers' AI Agents Found a Zero-Day in Medical-Imaging Software and Gained Root Access」（2026-11-21）：https://thehackernews.com/2026/11/attackers-ai-agents-found-zero-day-in.html
