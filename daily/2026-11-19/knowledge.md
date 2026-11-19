# 新知識｜2026-11-19

[← 今日摘要](README.md)｜[產品動態](products.md)｜[新知識](knowledge.md)｜[CVE](cve.md)｜[台灣 IT](taiwan.md)｜[AI](ai.md)｜[清單維護](maintenance.md)

> 歷史演練分檔：2026-11-19 13:19 蒐集（台灣時間）。僅搬移原文，未重新蒐集或查證；產品來源快照本次未建立，不代表目前產品狀態。

### APAS 1.0：AI 自主滲透測試的結果要怎樣才能採信

- 這是什麼：Cloud Security Alliance（CSA）發布的 Autonomous Pentest Assurance Standard 1.0 核心標準，規範用 AI 代理做的自主滲透測試要提供哪些證據，第三方才能判斷測試結果可不可信。
- 原理：標準從 7 個面向各自評定，不給單一總分：測試範圍是否如實揭露、漏洞是否經過驗證、證據能否追溯、資訊是否有助修補、修補後能否再驗證、是否符合授權與安全要求、AI 代理能否防範惡意操弄。品質保證分 Q1 到 Q4，測試結果可以被拿來做什麼分 R1 到 R3；涵蓋率必須與獨立確認的受測資產比對，不能只算工具自己找到的資產。另外要求有獨立於 AI 代理決策流程的緊急停止機制，監控、日誌或停止指令的管道中斷時要暫停攻擊性操作。
- 用在哪裡：評估或採購 AI 滲透測試工具時當檢核表；金融客戶被問到「AI 測的算不算數」時有一份可以引用的標準。目前只有核心標準，評估指南與認證配套還沒發布，不能核發認證（這一句引自 iThome 的報導，CSA 頁面我只讀到摘要）。
- 原文：Autonomous Pentest Assurance Standard (APAS)（CSA，2026-11-04）：https://cloudsecurityalliance.org/artifacts/autonomous-pentest-assurance-standard-apas

### 回放 fTPM 的儲存狀態，繞過 Windows Hello 與 BitLocker PIN 的鎖定

- 這是什麼：柏林工業大學研究人員發表的實體攻擊，能把韌體 TPM 的「猜錯次數」倒回去，讓短 PIN 可以被暴力嘗試。
- 原理：韌體 TPM（fTPM）內建在處理器裡，沒有自己的安全儲存，狀態（含錯誤次數）加密後存在主機板的 SPI flash。把舊的狀態寫回去，次數就跟著回到從前；新機種用 flash 晶片內只能遞增的計數器 RPMC 來偵測這種回放。AMD 處理器韌體沒有驗證計數器是否真的遞增，夾在處理器與 flash 之間的小電路板可以攔下更新並回報成功；Winbond 的 RPMC 晶片則可以用電壓 glitch 取出替計數器簽章的金鑰。研究人員估算四位數 Hello PIN 最壞 40 小時可猜完（鎖定正常時是 69 天），預設六位數的 BitLocker PIN 從 19 年降到 20 天。
- 用在哪裡：評估筆電遺失或遭竊時磁碟加密的實際強度。攻擊者要能打開機殼；AMD 已確認並計畫釋出韌體更新，研究人員建議先把 PIN 至少加長兩位數。
- 原文：Hello Again: Exploiting Replay Protected Monotonic Counters to Brute-Force Windows Hello PINs（arXiv 2611.18126，2026-11-13）：https://arxiv.org/abs/2611.18126v1 ；AMD 公告 Replay Protected Monotonic Counters (RPMC) Increment Suppression Vulnerability（頁面標示 AMD-SN-7079，發布日期未查到）：https://www.amd.com/en/resources/product-security/bulletin/amd-sb-7079.html

### Python 的 .pth 檔被拿來當供應鏈攻擊的自動執行點：agent-framework 事件

- 這是什麼：2026-11-17 PyPI 上的 Microsoft Agent Framework 套件 agent-framework 出現惡意版本 1.26.1 與 1.26.2，Wiz 分析它用 .pth 檔讓竊取憑證的程式在每次 Python 啟動時執行。
- 原理：Python 直譯器啟動時會處理 site-packages 根目錄下的 .pth 檔，其中以 import 開頭的行會被執行。惡意版本安裝時在那裡放了一個 .pth 檔（1.26.1 是 agent_framework_meta.pth，1.26.2 是 af_runtime_diag.pth），所以即使程式從來沒有 import agent-framework，只要在同一個環境啟動 Python 就會觸發。程式會蒐集環境變數與開發工具的憑證檔、嘗試取得 Azure 受控識別的 token；1.26.2 還會擷取 GitHub Actions 的 OIDC token，鎖定有 `id-token: write` 權限的工作流程。
- 用在哪裡：檢查 CI/CD 的 runner、Python 虛擬環境與容器映像有沒有裝到這兩個版本（最近的安全版本是 1.26.0）；也說明為什麼只掃 import 關係不夠，套件安裝時落地的檔案也要看。這類檢查對應 Black Duck SCA 的相依元件盤點。攻擊者怎麼拿到發布權限，Wiz 的文章說還沒查明。
- 原文：Microsoft agent-framework Compromised: Credential Stealer Targets Azure and CI Pipelines（Wiz，2026-11-17）：https://www.wiz.io/blog/malicious-version-of-microsofts-agent-framework-published-to-pypi

### NuGet.org 的 staged publishing：套件先上傳驗證，核准後才公開

- 這是什麼：NuGet.org 在 2026-11-17 開放給所有發布者的新功能，套件可以先上傳並通過驗證但不對外，等有權限的維護者在網站上按下 promote 才公開。
- 原理：一般的 `dotnet nuget push` 一上傳就進入公開流程；staging 模式下，套件照樣跑 NuGet.org 的驗證管線（惡意程式掃描、簽章檢查、repository signing），但不會出現在公開頁面，使用者也還原不到。它和 unlist 不同：unlist 的套件用確切版號仍然還原得到，staged 的完全拿不到。多個相關套件可以放進同一個 staging group 一起放行。這是選用功能，既有的 push 流程不變。
- 用在哪裡：把「pipeline 跑完」和「決定發布」拆成兩個步驟，等於在套件庫這一端加一道人工核准；也可以在協調揭露之前先把安全修補版上傳備妥。前一則的 agent-framework 事件正是惡意版本被直接上傳到套件庫的情境。
- 原文：Introducing staged publishing on NuGet.org（.NET Blog，2026-11-17）：https://devblogs.microsoft.com/dotnet/nuget-staged-publishing/

### Codex sandbox 的做法：AI 代理執行指令時，用作業系統機制限制檔案與網路

- 這是什麼：OpenAI 在 2026-11-18 公開說明 Codex 如何在使用者的電腦上執行指令時，把檔案系統與網路存取限制在使用者設定的範圍內。
- 原理：限制寫在 permission profile 裡。內建的 `:workspace` 設定允許在工作目錄內寫入，但 `.git` 與 `.codex` 維持唯讀（避免代理改掉 Git hooks 或自己的設定檔）、允許大範圍讀取、預設關閉網路。實際的強制執行交給各作業系統的機制：macOS 用 Seatbelt（透過 `/usr/bin/sandbox-exec`，政策以 SBPL 撰寫）；Linux 用 bubblewrap 建立隔離環境，加上 seccomp-bpf 過濾系統呼叫。文章自己指出兩個取捨：大範圍讀取代表機器上其他含 API key 的設定檔仍讀得到；放寬的萬用字元規則或允許 DNS 仍可能讓資料經由 DNS 外流。
- 用在哪裡：評估 AI 程式開發代理（包含 IBM Bob 這類工具）能不能進客戶環境時，可以用同一組問題檢查：寫入範圍、讀取範圍、網路預設值、由誰強制執行。Windows 的做法文章也有寫，我沒有讀到那一段。
- 原文：Inside the Codex sandbox（OpenAI，2026-11-18）：https://openai.com/index/inside-the-codex-sandbox

### IBM Bob 的 model router：第一個請求先分類，再依路由表挑模型

- 這是什麼：IBM Bob 官方部落格在 2026-11-04 說明 Bob 如何替每個任務自動選模型。Bob 把可用的模型分成三個層級，層級決定一個任務花多少 Bobcoin。
- 原理：路由只發生在任務的第一個請求：先由一組用 IBM 內部使用資料訓練的分類模型判斷任務類型，路由引擎再依路由表挑出品質、成本與效能最合適的模型。之後任務通常固定在同一個模型上，目的是保住 prompt cache，換模型會讓快取失效，影響速度與成本。新模型要進路由表得先過離線評測（文章說跑 40 多個公開 benchmark，另有用實際使用情境建立的 BobBench，Z、i、Java、DevOps 的 premium 套件各有專屬評測），再做線上評測；Bob 的 system prompt 與 harness 會針對每個模型調整。
- 用在哪裡：向客戶說明 Bob 的計費（Bobcoin）為什麼每個任務不同，以及為什麼同一個任務中途不會換模型。產品動態方面 Bob 今天沒有新版本（IDE 2.3.0、Shell 2.0.9），這則只講原理。
- 原文：How the Bob model router works（IBM Bob Blog，2026-11-04）：https://bob.ibm.com/blog/how-the-model-router-works
