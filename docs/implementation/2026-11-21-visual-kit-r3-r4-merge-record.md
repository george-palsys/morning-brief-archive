# 實作紀錄：視覺升級第三、四輪與 PR #34 合併經過

- 位置：`docs/implementation/2026-11-21-visual-kit-r3-r4-merge-record.md`（`george-palsys/morning-brief-archive`）。
- 性質：內部晨報歸檔站的實作紀錄，不是對客戶交付的成果。朋昶數位科技（Palsys）是 IBM 代理商，不提供顧問服務，本文件不是顧問案紀錄。
- 紀錄日期：2026-11-21（Asia/Taipei）。基準：`main` `88e855b47b73faa6d8704cf6501c49a4fb8c69ee`（PR #34 合併後）。
- 角色用語：人員一律以角色稱呼：「設計規格／設計審查」「實作」「獨立驗證」「安全審查」「文件撰寫」「交付團隊」「專案負責人」。
- 標示規則：**已驗證**＝文件撰寫在 2026-11-21 晚間以匿名方式讀取 GitHub 公開 API 與 repo 公開內容，自行核對；**引用**＝取自各角色的報告，文件撰寫沒有重跑；**未驗證**＝沒有證據。
- 本文件不寫「全部通過」。各審查者的結論只涵蓋其報告列出的範圍，範圍外見第 9 章。
- 與其他紀錄的關係：
  - `2026-11-21-visual-kit-v1.md`（PR #34 的實作紀錄，含第二、三輪）：第三輪的內容仍以該檔第 C 章為準；它寫「草稿、尚未合併」的段落已成為歷史，頂端另加一行狀態說明指向本文件。
  - `2026-11-21-visual-kit-round4.md`、`2026-11-21-visual-kit-round4-review-fixes.md`、`2026-11-21-visual-kit-round4-r3.md`：實作角色隨 PR #34 帶入的第四輪三份紀錄，本文件不取代，只補上來源與驗證對照。
  - `2026-11-21-visual-kit-r4.md`：PR #35 帶入，見第 6 章；PR #35 尚未合併，合併前它不在 main。
  - `2026-11-21-d14-content-alignment.md`：PR #32 的 D14 紀錄，其中「尚未推送、尚未合併」的說法已過時，更正見第 8 章。

## 1 PR #34 實際合併經過

以下事實由文件撰寫以匿名 GitHub API 在 2026-11-21 晚間讀取（已驗證），並與交付團隊查自 GitHub 公開紀錄的說明一致。時間為 Asia/Taipei；API 原值為 UTC。

| # | 事實 | 值 | 來源 |
|---|---|---|---|
| 1 | PR | #34，標題 `Integrate visual kit in three preview templates`，分支 `feat/visual-kit-v1`，目標 `main` | GitHub API `pulls/34`（已驗證） |
| 2 | 建立時間 | 2026-11-21 15:14:11（UTC 07:14:11），開立時為草稿 | GitHub API `pulls/34`；草稿狀態為開立時的約定（引用），API 只回傳現況（已驗證其現況 `draft=false`） |
| 3 | 轉為正式並合併 | 2026-11-21 23:16:51（UTC 15:16:51） | GitHub API `pulls/34` 的 `merged_at`（已驗證） |
| 4 | 合併者 | repo 擁有者帳號（`merged_by` 欄位） | GitHub API `pulls/34`（已驗證） |
| 5 | 合併時的分支 head | `2caa26c9509fb0cc8ec64ee0e60dc78c704e2ec1` | GitHub API `pulls/34`（已驗證） |
| 6 | 合併後 `main` | `88e855b47b73faa6d8704cf6501c49a4fb8c69ee`（`Merge pull request #34 from george-palsys/feat/visual-kit-v1`） | GitHub API `commits/main`（已驗證） |
| 7 | 合併前 `main` | `26e43aab86d93b7fda04849562d09561f4694f15`（PR #32 的合併 commit） | GitHub API `pulls/34` 的 `base.sha` 與 `pulls/32`（已驗證） |
| 8 | PR 範圍 | 17 個 commit、47 個檔、+1530／−83 | GitHub API `pulls/34`（已驗證） |
| 9 | 合併後的 CI | `Static site`，事件 push、分支 main、head `88e855b`，結論 success，run `44918332699`，23:16:53 | GitHub API `actions/runs`（已驗證）；只讀到 run 的結論，沒有讀 step 日誌 |
| 10 | 合併前最後一次 PR 的 CI | `Static site`，事件 pull_request，head `2caa26c`，結論 success，run `44916498206`，22:56:15 | GitHub API `actions/runs`（已驗證） |
| 11 | 合併與公開站驗證的先後 | 合併早於公開站驗證。原先的約定是：維持草稿，公開站驗證後由交付團隊的 Leader 合併 | 交付團隊說明（引用）；公開站驗證報告的時間文件撰寫沒有讀到，**未驗證** |
| 12 | 合併者對操作依據的說法 | 合併者表示依其對話中專案負責人的指示操作，且沒有收到「維持草稿、由 Leader 合併」的限制 | 合併者自述，經交付團隊轉述（引用）；**未驗證**，文件撰寫沒有讀到該段對話 |

本章只記錄事實，不推測動機，也不判斷責任歸屬。

### 1.1 PR #34 的 17 個 commit

| # | commit | 日期時間（Asia/Taipei） | 標題 | 屬於 |
|---|---|---|---|---|
| 1 | `b8b84b9` | 11-21 15:13:52 | Integrate visual assets in three opt-in preview templates | 第一輪 |
| 2 | `8180805` | 11-21 15:29:34 | Address visual preview layout and asset review | 第一輪 |
| 3 | `c94f60f` | 11-21 15:32:55 | Restore Proposal A product initials in visual preview | 第一輪 |
| 4 | `fb57c64` | 11-21 15:48:14 | Reject linked site assets and restore product row layout | 第一輪（三模板核准的驗證版本） |
| 5 | `06f3774` | 11-21 16:12:57 | Add implementation record for visual kit v1 preview | 第一輪實作紀錄 |
| 6 | `6d54374` | 11-21 17:17:34 | Improve preview story navigation and compact mobile reading | 第二輪 |
| 7 | `19efbc7` | 11-21 17:37:00 | Hide empty preview product group headings | 第二輪 |
| 8 | `c8f72d5` | 11-21 18:01:07 | Add round 2 change log | 第二輪紀錄 |
| 9 | `0d98c51` | 11-21 18:45:22 | Bring mobile preview news into the first screen | 第三輪 |
| 10 | `f7a9dae` | 11-21 20:07:00 | docs: add round 3 record and rewrite garbled paragraph in UTF-8 | 第三輪紀錄 |
| 11 | `ae37f5c` | 11-21 20:44:55 | Refine mobile labels and signal navigation | 第四輪（A1、A5 的 r2 版） |
| 12 | `ed8e7ef` | 11-21 20:44:55 | Apply visual templates across all content page types | 第四輪（B 頁型） |
| 13 | `f3c2126` | 11-21 20:44:55 | Add persistent system-aware light and dark themes | 第四輪（C 深色模式） |
| 14 | `5b11954` | 11-21 20:44:56 | Document round four scope and retain readable themed actions | 第四輪紀錄 |
| 15 | `2ec907a` | 11-21 20:44:56 | Keep dynamic search CVE labels unbroken with safe DOM nodes | 第四輪（搜尋頁 CVE 標籤） |
| 16 | `31f0ee2` | 11-21 20:46:05 | Fix mixed CVE title flow and dark selected controls | 第四輪（審查修正） |
| 17 | `2caa26c` | 11-21 22:37:33 | fix: apply round 4 decisions and harden CVE text boundaries | 第四輪 r3（裁示實作） |

- 來源：GitHub API `pulls/34/commits`（已驗證）；「屬於」欄是文件撰寫依標題與各角色報告歸類（引用）。
- 與交付團隊說明的差異：說明寫 `f7a9dae` 之後有 6 個 commit（`ed8e7ef` 起），API 實際是 7 個，多了 `ae37f5c`（第 11 列）。以 API 為準。
- 第 11–16 列的雜湊與實作角色本機的雜湊不同（獨立驗證報告記載本機為 `3526358…`、`d696983…` 等）：patch 經 `git am` 套用，committer 時間不同所致，內容以 tree 比對，見 4.3。

## 2 第三輪（摘要與合併後的狀態）

第三輪的完整紀錄在 `2026-11-21-visual-kit-v1.md` 的第 C 章，這裡不重寫，只列三項與其後續。

| # | 第三輪項目 | 第三輪結果（引用該檔第 C 章） | 合併後的狀態 |
|---|---|---|---|
| 1 | 手機首屏看得到第一則新聞標題 | 產品監測面板移到 THE SIGNAL 之後，頭條區塊壓縮 | 已被第四輪 r3 的裁示取代：手機面板改放在第 2 與第 3 則新聞之間（見 4.4），首屏仍須看得到第一則標題；獨立驗證沒有對 `2caa26c` 重新量測首屏，**未驗證** |
| 2 | 手機卡片高度驗收上限 302px | 驗收上限 302px | 第四輪 r2 起新聞卡改單欄並隱藏圖示欄（設計規格 A5），卡高量測值改變；302px 上限在 `2caa26c` 之後是否仍成立，**未驗證** |
| 3 | 產品總覽手機版 5 個 KPI 方塊縮成一列 | 5 個 KPI 方塊縮成一列 | 第四輪 A1 另在該列的標籤插入 `<wbr>`，避免單字孤行（見 4.2） |

## 3 第四輪的依據與範圍

| # | 依據 | 識別 | 說明 |
|---|---|---|---|
| 1 | 設計規格（第四輪） | SHA-256 `d1669709daac5c1e6e587f4c950de5b878e47a2d7aa9e72a6403d679c3289036` | 第 A 節五項、第 B 節其餘 51 頁、第 C 節深色模式、第 D 節 16 項驗收；規格內量測標「實測」「推論」「未驗證」 |
| 2 | 實作 r2 patch | SHA-256 `da6f2b268283932d2eea52be4e72b4fb0b6a0ae8671d0c179756bded97437db2`，基準 `f7a9daed7004e2dfa5d137821d7c302c9406870e`，6 個 commit，26 個檔，+354／−86 | 作者與 committer 使用 `Palsys docs <noreply@example.invalid>` |
| 3 | 獨立驗證 r2 報告 | SHA-256 `bcadadd199b28f44f5bd8c1c842841433dba173fe5cc146475b71815e205f4b4` | 本機乾淨 clone 重跑；Node v25.8.2、Chromium headless；16 項驗收 |
| 4 | 安全審查 r2 報告 | SHA-256 `05f2d6a5a11bfa7d5b67ebe0a3492474dd3d1ba50ccf156219e65f55c9592065` | 增量複查；高 0、中 0、低 0、資訊事項 3 項 |
| 5 | 實作 r3 紀錄 | repo 內 `docs/implementation/2026-11-21-visual-kit-round4-r3.md` | 裁示實作（`2caa26c`）；數字為實作角色的本機量測 |

- 設計規格要求：實作者不得自我驗收，驗收由獨立驗證角色做（規格第 D 節）。
- 本章三份報告與 r2 patch 的 SHA-256 由文件撰寫現場重算（已驗證），與交付時提供的前綴一致。

## 4 第四輪實作紀錄

### 4.1 設計規格的五項（A1–A5）與 r2 結果

| # | 項目 | 規格要求（引用設計規格） | r2 實作 | r2 獨立驗證結果（引用） | 狀態 |
|---|---|---|---|---|---|
| A1 | 產品總覽手機 KPI 標籤孤字 | 在「項追蹤產品」「無公開來源」的語意詞界插入 `<wbr>`；≤640px 設 `word-break:keep-all`、`line-break:strict` | 已依規格實作 | 390、360 × 亮色／系統深色／手動深色共 6 組，標籤皆「項追蹤／產品」「無公開／來源」，孤字 0 個 | 完成 |
| A2 | 標題 CVE 編號不在連字號斷行 | 符合 `CVE-\d{4}-\d{4,}` 的字串包 `<span class="cve-id">`，`white-space:nowrap`；表格內不鎖 | 已實作；其後搜尋頁與混合標題另有兩次修正（第 15、16 列，見 1.1） | 首頁頭條 CVE 在 390、360、1366 × 3 模式共 9 組，皆 1 行 | 完成（有已知副作用，見 4.5） |
| A3 | 1024 寬「PoC 已公開」不折行 | 1024–1180px `facts` 三欄、`dd` nowrap | 已依規格實作 | 1024 寬亮色與深色皆 1 行，寬 81.53px | 完成 |
| A4 | 1024 寬桌機面板拉伸、清單與底部連結間空白 | 1024–1180px 面板 `space-between`、連結 `margin-top:0` | 已依規格實作 | 1024 寬間距 29.69px（驗收 ≤30px）、1100 寬 19px、1180 寬 20.81px；1366 寬 68.59px 與基準相同 | 完成；但 1181–1210px 有已知偏差，見 4.5 |
| A5 | 手機產品監測面板要捲 4 則新聞才到 | 規格自己標明「部分做到」：縮短距離並加跳轉連結；「首屏直接看到面板」做不到 | 新聞卡 ≤640px 單欄並隱藏圖示欄；THE SIGNAL 標題列加「產品監測 ↓」錨點（≤1023px 顯示），指向 `id="product-watch"` | 390×844：第 1 則標題 top 637.72px（在首屏內）、連結 74.48×44px、面板 top 1561.66px（360 寬 1635.58px）、點連結後 `#product-watch` 面板距視窗頂 95.66px | **部分完成**：面板本體不在首屏，只縮短距離並加跳轉連結 |

來源：設計規格第 A 節；獨立驗證 r2 報告第 7 節（A1–A5）。數字為引用，文件撰寫沒有重跑。

A5 為部分完成的原因（引用設計規格 A5）：面板須維持在 THE SIGNAL 之後、第一則新聞標題須在手機首屏，兩項條件同時成立時，面板最早出現在最後一張卡之後，實測 y=1562，遠超過 844px 的首屏。規格把「是否接受面板移到第 2 則卡片之後」列為待專案負責人決定，r2 不實作；此項決定在 r3 實作（見 4.4）。

### 4.2 B 其餘頁面套用（共 54 頁，3 頁已升級、51 頁待升級）

設計規格第 B 節的頁型盤點（規格以 repo 內 `<main class="content d14 d14-*">` 計數）與 r2 獨立驗證的頁面盤點一致，54 頁。

| # | 頁型 | class | 頁數 | 規格要求的套用與例外（引用設計規格 B2） | r2 獨立驗證的盤點 |
|---|---|---|---|---|---|
| 1 | 首頁 | （home） | 1 | 已升級（三模板之一） | 與產品總覽合計 2 頁（無 d14 類型） |
| 2 | 產品總覽 | products/index | 1 | 已升級（三模板之一） | 同上 |
| 3 | 每日摘要 | d14-overview | 3 | CVE 內頁模板的標題區與章節導覽；規格原寫不放 hero（推論，待專案負責人確認） | 3 |
| 4 | 內容頁 | d14-reading | 18 | 已核准的 CVE 內頁模板；無 CVE 的頁不放 CVE 徽章；hero 用既有三組 webp 之一 | 18 |
| 5 | 歸檔 | d14-archive | 1 | 標題區加清單；規格原寫不放 hero（待確認）；清單順序不變 | 1 |
| 6 | 舊版 | d14-legacy | 1 | 只套顏色 token 與字級，不改版面結構，加文字標示「舊版」 | 1 |
| 7 | 產品頁 | d14-product | 26 | 標題區、狀態標籤（顏色加文字）、事實盒；「無公開來源」維持虛線框；不放 hero 與 KPI 列 | 26 |
| 8 | 搜尋 | d14-search | 1 | 輸入框沿用 `--line-strong` 邊框；無 hero；空結果文字不變 | 1 |
| 9 | 關於 | d14-about | 1 | 標題區加內文；無 hero；不放成員名字 | 1 |
| 10 | 找不到 | d14-notfound | 1 | 標題區加回首頁按鈕；無 hero | 1 |
| | 合計 | | 54 | 3 頁已升級、51 頁待升級（規格） | 54 頁；inline script 0、style 屬性 0、style 標籤 0 |

- 「每日摘要與歸檔是否放 hero」：規格列為待專案負責人決定；r3 紀錄載明裁示後這 5 個摘要／歸檔／舊版頁各加 1 個 hero（見 4.4）。
- 逐頁的版面視覺驗收：獨立驗證 r2 以 135 組截圖覆蓋；文件撰寫沒有逐張檢視，**未驗證**。
- 與 `2026-11-21-d14-content-alignment.md`（PR #32）的關係：D14 處理八種內容頁型的內容區版面；第四輪 B 在其上套用視覺模板，兩者都改 `site/site.css`，合併順序為 PR #32 在先、PR #34 在後（第 1 章第 7 列）。

### 4.3 C 深色模式與 r2 的 6 個 commit

規格要點（引用設計規格第 C 節）：預設跟隨系統 `prefers-color-scheme`；手動切換存 `localStorage` 的 `mb-theme`（`light`、`dark`、未設＝跟隨系統）；外部非 defer 腳本 `assets/theme-init.js` 防閃爍，不需 inline script、不改 CSP；深色 token 38 項，40 組對比（規格計算值）全數通過。

| # | r2 commit（獨立驗證報告記載的實作角色本機雜湊） | 標題 | 對應 |
|---|---|---|---|
| 1 | `3526358602118198e362f990f6a45ff3ae9e73a6` | Refine mobile labels and signal navigation | A1、A5 |
| 2 | `d6968839736c506d712dd9d63c3a574cf7380013` | Apply visual templates across all content page types | B |
| 3 | `89c53d7079086d8dea2238cf59197e2def0a198c` | Add persistent system-aware light and dark themes | C |
| 4 | `c0da902bf5703b1f075006fdc039d50db4f852b7` | Document round four scope and retain readable themed actions | 紀錄 |
| 5 | `287d94529c23029e3fa14d35120f855d981daaa0` | Keep dynamic search CVE labels unbroken with safe DOM nodes | A2、搜尋頁 |
| 6 | `e7d48e05ab07478593204e47752aaa34d2bf5579` | Fix mixed CVE title flow and dark selected controls | A2、深色選取 |

r2 的建置與測試結果（引用獨立驗證 r2 報告第 3 節，本機乾淨 clone）：

| # | 項目 | 結果 | 來源 |
|---|---|---|---|
| 1 | `git apply --check` 與 `git apply` | 皆 exit 0 | 獨立驗證 r2 第 3 節 |
| 2 | `npm ci --ignore-scripts` | exit 0 | 同上 |
| 3 | `npm test` | 65 tests、65 pass、0 fail | 同上；安全審查 r2 另自行重跑得同樣的 65/65 |
| 4 | `npm run check:contrast` | `CONTRAST OK: 42 pairs × 2 themes`；獨立重算 84 列，不合格 0 列 | 同上 |
| 5 | `npm run build`（`--base-path /morning-brief-archive/`） | 54 HTML pages、26/26 product pages、4 daily editions、66 search items、0 warnings | 同上；安全審查 r2 兩種 build 結果相同 |
| 6 | 正式資料 diff（`daily products items.jsonl state`） | exit 0 | 同上；安全審查 r2 同為 exit 0 |
| 7 | `git diff --check` | exit 0 | 獨立驗證 r2 第 3 節 |
| 8 | 與實作角色 build 逐檔比對 | 94 檔，相同 94、不同 0 | 獨立驗證 r2 第 4 節 |
| 9 | 套用後 tree | 與實作角色 HEAD 的 tree 相同（`5c10a43cb43da9a655fb273467e6355bf98aca6f`） | 獨立驗證 r2 第 2 節 |
| 10 | 測試檔 r1→r2 | 刪除行 0（`d14.test.mjs` 9→11 個 test；`test.mjs` 47、`weekly-guards.test.mjs` 1 不變） | 獨立驗證 r2 第 3b 節 |

r1 的 4 個不通過項（第 6、7、15、16 項）在 r2 皆已修正（引用獨立驗證 r2 第 14c 節）：

| # | r1 項次 | 問題 | r2 結果 |
|---|---|---|---|
| 1 | 6 | 搜尋頁水平捲動（全頁寬 541px） | 135 組截圖橫向溢出 0 組；全頁寬 390／390／360／360px |
| 2 | 7 | 深色下目前分頁與已勾選類別為淺色膠囊 | 底色 `rgb(29, 43, 92)`；對比 4.5:1 與 3:1 兩組新增並通過 |
| 3 | 15 | commit 作者為成員名字 | 6 個 commit 的 author 與 committer 皆為 `Palsys docs <noreply@example.invalid>` |
| 4 | 16 | 首頁與搜尋結果 CVE 標題拆欄 | `a` 改 `display:block`；54 頁拆欄掃描命中 0 頁 |

### 4.4 r3（`2caa26c`）：專案負責人裁示的實作

來源是 repo 內 `2026-11-21-visual-kit-round4-r3.md`（實作角色的自述與本機量測）。獨立驗證與安全審查對 `2caa26c` 的報告文件撰寫沒有讀到，下表的「驗證」欄一律是實作角色的本機量測，**不是獨立驗證**。

| # | 裁示 | 實作內容（引用 r3 紀錄） | 實作角色的本機量測（引用） | 獨立驗證 |
|---|---|---|---|---|
| 1 | 1181px 間距修正 | 桌面面板 `align-self:start`，legend 到連結 `margin-top:60px`；取消 1024–1180px 的 `space-between` 例外 | 1179、1180、1181、1182、1199、1200、1201px 皆為 60px | 未驗證 |
| 2 | 手機產品監測 | DOM 拆成前兩則清單、stack 面板、剩餘清單；桌面保留 hero 右欄面板；移除「產品監測 ↓」跳轉連結 | 360、390、768、1023px 面板位於第 2 與第 3 則之間 | 未驗證 |
| 3 | 跟隨系統與手動切換 | 保留既有主題實作，未改 `theme-init.js` 與切換邏輯 | — | 未驗證 |
| 4 | 每日摘要與歸檔 hero | overview、archive、legacy 容器加入既有 hero 圖與概念插畫說明；既有 reading 圖保留 | 5 個摘要／歸檔／舊版頁各 1 個 hero，測試通過 | 未驗證 |
| 5 | `wrapCveText` 加固 | 略過註解、`title`、`script`、`style`、`textarea`；保留 `code`／`pre` 與既有 `cve-id` span；加 token 邊界，重複執行不重複包；builder-owned HTML 的契約不變 | 測試涵蓋大小寫、帶空白結束標籤、未結束註解與 raw element、引號內 `>` | 安全審查 r2 的資訊事項 I1 正是這幾項邊界；`2caa26c` 是否已收斂，安全審查沒有重查，**未驗證** |
| 6 | 預覽與歷史 | 沒有遠端操作；沒有刪除預覽 repo；早期公開 commit author 未重寫 | — | — |
| 7 | 窄版補修 | 360px 搭配傳統捲軸可用寬度 345px，頁首原溢出 12px；品牌文字可縮排換行，兩個操作按鈕保持原尺寸 | 補修後 `scrollWidth`＝`clientWidth`＝345px | 未驗證 |

r3 的指令結果（引用 r3 紀錄，實作角色本機，Node v25.8.2）：

| # | 指令 | 結果 |
|---|---|---|
| 1 | `npm ci --ignore-scripts` | 8 packages，0 vulnerabilities |
| 2 | `npm test` | 67 tests，67 pass，0 fail，0 skipped |
| 3 | `npm run check:contrast` | `CONTRAST OK: 42 pairs × 2 themes` |
| 4 | `npm run build`（`--base-path /morning-brief-archive/`，全新空目錄） | 54 HTML pages、26/26 product pages、4 daily editions、66 search items、0 warnings |
| 5 | `git diff --check` | exit 0 |
| 6 | `git diff --exit-code f7a9dae -- daily products items.jsonl state` | exit 0 |

- 合併前一次 PR 的 CI（head `2caa26c`，run `44916498206`）結論為 success（已驗證，第 1 章第 10 列）。
- r3 是否改變 r2 的 A5 結論：改變。r2 的 A5 為「部分完成」且有跳轉連結；r3 依裁示把面板放在第 2 與第 3 則之間、移除連結。因此 4.1 的 A5 列描述的是 r2 的狀態，r3 之後的狀態以本節第 2 列為準。

### 4.5 已知偏差：1181–1210px 面板間距（r2 的發現，r3 的處置）

| # | 項目 | 內容 | 來源 |
|---|---|---|---|
| 1 | 現象（r2） | 1181–1210px 的首頁頭條卡變高，面板 legend 到底部連結的間距由基準 59.66px 變為 104.17px；規格「範圍外不變：1181＝60px」未做到 | 獨立驗證 r2 第 14b 節；量測檔 `a4-1181.json`（SHA-256 `ce1c57f02b487131bca5cfc0f079f72d331632664234828ae89b0148a95cffcd`） |
| 2 | 量測（r2，1181px） | 頭條標題由 2 行變 3 行，頭條卡高 548.03→592.55px（+44.52px），間距 59.66→104.17px（+44.51px） | 同上 |
| 3 | 原因（r2 的隔離實驗） | 不是 A4 規則外漏（1181px 時 A4 媒體查詢不成立），而是全域規則 `.cve-id{white-space:nowrap}`；把它抵銷後 1181px 間距回到 59.66px | 同上 |
| 4 | 影響範圍（r2） | 逐 1px 掃描 1024–1440px：1024–1210px 共 187 個寬度頭條卡高度不同，1211–1440px 共 230 個相同；1181–1210px 的 30 個寬度在 A4 範圍之外 | 同上 |
| 5 | r2 的判定 | 獨立驗證判定為「規格偏差、非驗收項不通過」，不擋預覽，是否接受由 Leader 與專案負責人決定 | 獨立驗證 r2 第 1、14b 節 |
| 6 | r3 的處置 | 依裁示改 A4：桌面面板 `align-self:start`、`margin-top:60px`；實作角色本機量測 1179–1201px 7 個寬度皆 60px | r3 紀錄（引用） |
| 7 | r3 是否消除偏差 | 獨立驗證沒有對 `2caa26c` 重新量測；實作角色的量測只含 7 個寬度，沒有逐 1px 掃描；**未驗證** | — |
| 8 | 另一個 r2 觀察（非驗收項） | 每日摘要頁 1366px 的 KPI 標籤有單字孤行（「全世界AI新功能及重大事／件」）；沒有和基準比對，是否為第四輪新增 | 獨立驗證 r2 第 7 節、第 17 節第 10 項；**未驗證** |

### 4.6 r2 的安全審查結論（引用安全審查 r2 報告）

| # | 項目 | 結果 |
|---|---|---|
| 1 | 高、中、低風險 | 各 0 |
| 2 | R2（`wrapCveText` 的 HTML 切割前提） | 已解決：引號感知切割，單／雙引號屬性內含 `>` 的情境有精確測試 |
| 3 | R3（舊交付報告含本機路徑） | 已解決 |
| 4 | CSP | 54 頁同一字串；`unsafe-` 0；`theme-init.js` 為外部載入 |
| 5 | inline script／style、`on*=`、`javascript:`、外部資源 | 皆 0 |
| 6 | 外部連結 | 631 個外部 `<a>`，631 個皆帶 `rel="noopener noreferrer"` |
| 7 | 依賴 | `npm audit`：found 0 vulnerabilities；`package.json`、`package-lock.json`、`.github` 無差異 |
| 8 | 資訊事項 I1 | `wrapCveText` 殘留邊界：未閉合引號、`</title >`、`<textarea>`；目前產出觸發不到，不產生可執行內容 |
| 9 | 資訊事項 I2 | 大量未閉合 `<` 時為平方級（新版約為舊版 2 倍）；只在 build 時執行 |
| 10 | 資訊事項 I3 | committer 身分無法由 patch 證明，推送後須在遠端再查 |

文件撰寫補查（已驗證）：PR #34 的 17 個 commit 中，第 10–17 列的 author 在 GitHub API 顯示為 `Palsys docs`；committer 欄位文件撰寫沒有逐一讀取，I3 仍為**未驗證**。

## 5 設計規格的深色模式取捨與決定

| # | 項目 | 規格的取捨 | 決定（引用 r3 紀錄） |
|---|---|---|---|
| 1 | 是否要手動切換深色 | 手動切換需多一個外部 JS 與一顆按鈕；不要的話只做跟隨系統 | r3 紀錄載明「跟隨系統與手動切換：保留既有主題實作」，即保留手動切換 |
| 2 | A5 是否接受面板移到第 2 則之後 | 須同時改 A4 規則與 18:36 的結論 | r3 實作為面板位於第 2 與第 3 則之間 |
| 3 | 每日摘要與歸檔是否放 hero | 規格原寫不放，待確認 | r3 實作為加入 hero（5 頁各 1 個） |

這三項的原始裁示對話文件撰寫沒有讀到；上表「決定」欄來自實作角色 r3 紀錄的描述，**未驗證**為專案負責人的原話。

## 6 PR #35：合併後小修（尚未合併）

| # | 項目 | 值 | 來源 |
|---|---|---|---|
| 1 | PR | #35，標題 `Visual kit r4: small visual fixes from design review`，分支 `feat/visual-kit-r4` | GitHub API `pulls/35`（已驗證） |
| 2 | 狀態 | open，未合併；`draft=false` | 同上（已驗證）。交付團隊說明稱「未合併」，與此相符；草稿與否 API 讀到的是非草稿 |
| 3 | head 與範圍 | `7380a5342e2797e1ce97c8a9494297bb1cc0cb15`，1 個 commit、4 個檔、+54／−2 | GitHub API `pulls/35`（已驗證） |
| 4 | 目標 | `main`，基準 `88e855b`（PR #34 合併後） | 同上（已驗證） |
| 5 | 開立時間 | 2026-11-21 23:25:08 | 同上（已驗證） |
| 6 | CI | `Static site`，事件 pull_request，head `7380a53`，success，run `44919079276` | GitHub API `actions/runs`（已驗證）；沒有讀 step 日誌 |

PR #35 的 4 個檔（GitHub API `pulls/35/files`，已驗證）：

| # | 檔案 | 新增 | 刪除 |
|---|---|---|---|
| 1 | `docs/implementation/2026-11-21-visual-kit-r4.md` | 36 | 0 |
| 2 | `site/assets/visuals/visual.css` | 15 | 0 |
| 3 | `site/build.mjs` | 1 | 1 |
| 4 | `site/round3.mjs` | 2 | 1 |

PR #35 的 5 項小修（引用其 `2026-11-21-visual-kit-r4.md`，實作角色的本機量測；文件撰寫只讀了該檔，沒有重跑）：

| # | 問題 | 修正 | 實作角色的本機量測 |
|---|---|---|---|
| 1 | CVE 內頁第 2 則編號在連字號斷行 | `item-title code` 設 `white-space:nowrap` 等 | 390px 的 CVE-2026-90436 由 2 個文字行座標變 1 個 |
| 2 | 首頁 hero 右括號孤字落行 | 完整全形括號與編號包 `mb-cve-group`，整組 `inline-block nowrap`；hero 標題 `clamp(24px,2.4vw,34px)` | 1181px 編號與右括號同列 |
| 3 | 深色選取 chip 太接近底色 | 使用 `selected-bg`、`selected-ink`、`selected-border` | 390px 26 個皆 border `rgb(157,179,255)`、background `rgb(29,43,92)` |
| 4 | 每日摘要第 5 張數量卡較高 | `v4-counts li` 的 `align-items:stretch` | 1366px 修正前 100.625×4、125.125px；修正後五張皆 125.125px |
| 5 | 歸檔標題欄過窄，分隔符孤立 | 桌面兩個彈性欄，標題欄最小 260px；分隔符與說明包同一個 `nowrap` span | 1181px 標題欄 220→440px |

- PR #35 紀錄載明：遠端 CI、部署與獨立複審「未執行」（撰寫當時）；本文件只確認 CI 結論為 success，獨立複審結果見第 7 章。
- PR #35 的 `npm test` 為「既有 67 tests 通過」（引用），測試數量沒有增加；是否新增針對這 5 項的測試，**未驗證**。

## 7 驗證章節

以下三項驗證正在進行或尚未回報。**結果以各自報告為準**，本文件不填結果，也不代為判斷通過與否；報告收到後再回填路徑與結論。

| # | 驗證項目 | 對象 | 狀態（撰寫當下） | 報告路徑 | 結論 |
|---|---|---|---|---|---|
| 1 | 獨立驗證：公開站驗證 | 合併後的公開站（`main` `88e855b`） | 進行中 | （待填） | （待填） |
| 2 | 安全審查：PR #35 複查 | PR #35 head `7380a53` | 進行中 | （待填） | （待填） |
| 3 | 設計審查：設計複審 | 第四輪結果（範圍待報告載明） | 進行中 | （待填） | （待填） |

## 8 PR #32 紀錄的更正：「尚未推送、尚未合併」

### 8.1 事實（已驗證）

| # | 項目 | 值 | 來源 |
|---|---|---|---|
| 1 | PR #32 | 分支 `feat/design-a-phase2`，目標 `main`，已合併 | GitHub API `pulls/32` |
| 2 | 合併時間 | 2026-11-21 14:21:44（UTC 06:21:44） | 同上 |
| 3 | 合併 commit | `26e43aab86d93b7fda04849562d09561f4694f15` | 同上；也是 PR #34 的合併前 `main` |
| 4 | 合併時的 head | `dfde9e41562a0d7eeea83ef588ea1266b4af7da8`（9 個 commit、16 個檔） | 同上 |
| 5 | D14 紀錄檔在 main 的內容 | `docs/implementation/2026-11-21-d14-content-alignment.md` 與 PR #32 head 所帶的版本相同（SHA-256 `6d71390d3b6efc3e214f7b9f44545974537d66f349c938e65888e5dbdf9173e1`） | 在 `origin/main` 讀取並比對（已驗證） |
| 6 | 合併後 CI | `Static site`，push、main、head `26e43aa`，success，run `44875179526` | GitHub API `actions/runs`（已驗證）；沒有讀 step 日誌 |

### 8.2 舊句與新句

檔案：`docs/implementation/2026-11-21-d14-content-alignment.md`，行號為更正前（`main` `88e855b`）。

| # | 行號 | 舊句 | 新句 |
|---|---|---|---|
| 1 | 4 | `- 狀態：v3 已通過三方複審（獨立驗證通過、安全審查通過且高／中／低風險各 0 項、設計審查通過）。尚未推送、尚未合併、尚未部署。` | `- 狀態：v3 已通過三方複審（獨立驗證通過、安全審查通過且高／中／低風險各 0 項、設計審查通過）。更正（2026-11-21）：D14 已隨 PR #32 合併進 main（2026-11-21 14:21:44，merge commit 26e43aab86d93b7fda04849562d09561f4694f15），合併後 CI（run 44875179526）結論為 success；下文「尚未推送、尚未合併、尚未部署」是撰寫當時的狀態，保留作為歷史。部署後的公開站是否如預期，未驗證。` |
| 2 | 16 | `- 本增量不另開 PR、不推送、不合併；不修改 main、正式歸檔資料、repo 能見度。…` | 句尾加：`（撰寫當時的範圍；之後已隨 PR #32 合併，見第 4 行更正。）` |
| 3 | 385 | `\| U5 \| 部署後結果 \| 尚未部署；GitHub Pages 的絕對路徑、HTTP CSP header、快取與發佈結果未驗證 \|` | 「尚未部署」改為 `撰寫當時尚未部署；之後 PR #32 合併後 CI 成功（run 44875179526），公開站結果`，其餘不變 |
| 4 | 427 | `\| 動作 \| 未推送、未改 repo、未合併、未動 main \|` | 句尾加：`（撰寫當時；之後已隨 PR #32 合併）` |

- 更正的範圍只有上列四處，文件其餘內容不動；`2026-11-21-d14-content-alignment.md` 內的測試、量測與審查結論沒有重查。
- 該檔其他提到「PR #32」的行（第 5、24、201、228、246 行）指的是基準或既有缺陷，不是推送／合併狀態，沒有更動。
- 與 PR #34 紀錄（`2026-11-21-visual-kit-v1.md`）的關係：該檔頂端的「PR #34（草稿）」「尚未合併」（第 354、359、537、636 行）同樣已成為歷史；本次不逐行改寫，只在頂端加一行狀態說明並在變更紀錄加第 4 版，指向本文件第 1 章。
- 更正的依據是 GitHub 公開紀錄，不是紀錄撰寫者的推測；「為何撰寫當時寫尚未合併」不在本文件範圍。

## 9 未驗證清單

| # | 項目 | 原因 |
|---|---|---|
| 1 | 合併早於公開站驗證的先後、合併者的操作依據（第 1 章第 11、12 列） | 只有交付團隊轉述，沒有讀到公開站驗證報告的時間與對話原文 |
| 2 | `2caa26c` 的獨立驗證與安全審查 | 沒有找到對應報告；第 4.4 節的量測是實作角色自述 |
| 3 | 1181–1210px 間距偏差在 r3 之後是否消除 | 只有實作角色 7 個寬度的量測，沒有逐 1px 掃描 |
| 4 | A5 在 r3 之後手機首屏、面板位置與跳轉行為 | r3 移除連結並改面板位置，沒有獨立量測 |
| 5 | 第三輪的 302px 卡高上限在第四輪之後是否成立 | 新聞卡改單欄並隱藏圖示欄，沒有重新對帳 |
| 6 | Node 24（CI 版本）下的 `npm test`、build | 本機只用 Node v25.8.2；CI 結論只讀到 success，沒讀 step 日誌 |
| 7 | 真機（iOS Safari、Android Chrome） | 只用 headless Chromium 與內建 Browser |
| 8 | Safari | 只測 Chromium；含 `img{content:var(--icon-x)}` 換圖與 `:has()` 選取膠囊 |
| 9 | Firefox | 同上 |
| 10 | 螢幕閱讀器 | 未測 |
| 11 | 列印樣式 | 未測 |
| 12 | 防閃爍的人工肉眼觀察 | 只做了自動量測（第一個 rAF 已是 dark） |
| 13 | 12 個圖示中 6 個未被頁面使用的深色渲染 | 只驗檔案色值 |
| 14 | GitHub Pages 合併後的公開站 | 見第 7 章第 1 項，驗證進行中 |
| 15 | 每日摘要頁 1366px KPI 孤字是否為第四輪新增 | 沒有和基準比對 |
| 16 | CVE 內頁對 `f7a9dae` 的手機差異 | r2 沒有重新並排目視，沿用 r1 的人工判讀（推論） |
| 17 | committer 身分（I3） | patch 無法證明；遠端 committer 欄位沒有逐一讀取 |
| 18 | PR #35 的 5 項小修的獨立驗證與是否新增測試 | 見第 6、7 章 |
| 19 | 桌面有捲軸時全頁高 3079px（獨立驗證）與 3076px（設計審查）差 3px | 第三輪遺留，原因沒有解釋 |
| 20 | 專案負責人對第四輪各項裁示的原話 | 只有 r3 紀錄的轉述 |

## 10 回復

| # | 範圍 | 步驟 | 狀態 |
|---|---|---|---|
| 1 | PR #34 已合併 | 以 `git revert -m 1 88e855b47b73faa6d8704cf6501c49a4fb8c69ee` 產生還原 commit，走 PR，不直接推 main，不強制覆寫 | 步驟為標準 git 作法；沒有實際演練，**未驗證** |
| 2 | 只回復第四輪 | PR #34 的 17 個 commit 中第四輪的第 11–17 列為獨立 commit，可個別 revert；先確認各 commit 之間的相依 | 沒有演練，**未驗證** |
| 3 | PR #35 | 尚未合併；放棄 PR 即可，不需回復 main | 依 PR 現況（open） |
| 4 | 預覽 repo | 保留不刪，待專案負責人另行指示 | 引用團隊紀錄 |

## 11 變更紀錄

| 日期 | 版本 | 內容 | 依據 |
|---|---|---|---|
| 2026-11-21 | 1 | 新增：PR #34 合併經過、第三輪摘要、第四輪（r2 與 r3）、PR #35、PR #32 紀錄更正、驗證章節占位 | GitHub 公開 API 讀取、設計規格、獨立驗證 r2 報告、安全審查 r2 報告、repo 內 r3 與 PR #35 紀錄 |
