# 實作紀錄：晨報歸檔站視覺改版 Phase 2（方案 C 套用，PR #27）

- 檔名日期：2026-11-20（依 Ada 指派）。
- 撰寫：Quill（文件撰寫）。本文件是整理，不是驗收；不是顧問服務紀錄。
- 對象：`george-palsys/morning-brief-archive` 的 PR #27「feat: 將方案 C 套用到晨報網站」，分支 `feat/design-c-phase2`，base 為 `main` 的 `aa18f7d`（PR #26 合併後）。
- 紀錄狀態：PR #27 **未合併**（Quill 以匿名 GitHub API 讀取：state open、draft false、merged false、mergeable_state clean）。目前 head 為 `e741e0e682f0ba016011d25b047aa659525e1b58`。本文件寫的是合併前的狀態；合併後要補第 4、9 章。
- 審查狀態：驗證（Rigel）、安全審查（Vega）、設計審查（Iris）各兩輪。第一輪 head `f1dd64ccc3728b82c41d9e932e42f8ab4bcf4f40`，Iris 阻擋 2 項（B1、B2）；Lin 修成 `e741e0e`；第二輪三關皆無阻擋項。這不是「全部通過」，仍有已知限制與未驗證項目（第 8 章）。
- 資料來源（只寫檔名，不寫路徑）：
  - Rigel：`rigel-verification-pr27.md`（第一輪，針對 `f1dd64c`）、`rigel-verification-pr27-r2.md`（第二輪，針對 `e741e0e`）。
  - Vega：`vega-security-pr27.md`（第一輪）、`vega-security-pr27-r2.md`（第二輪）。
  - Iris：`iris-design-review-pr27.md`（第一輪）、`iris-design-review-pr27-r2.md`（第二輪）、`design-spec.md` 第 9、11 節、`report.md`（第一輪設計提案）。
  - 各報告引用的量測腳本、截圖、原始 JSON 只存在各成員的工作資料夾，不在本 repo。
- 我自己做的事（有證據）：用匿名方式 clone repo 並 fetch `pull/27/head`，核對 head SHA；用 `git diff --numstat`、`git diff` 讀變更；讀 `site/build.mjs` 與 `site/assets/design-c.css` 原始碼；在 `e741e0e` 重跑 `npm ci --ignore-scripts`、`npm test`、`npm run check:contrast`、`npm run build`；用匿名 API 讀 PR 與 CI run；用 Python 自算幾組對比值。其他數字都是成員回報，我沒有重跑，各列在「來源」欄標明。
- 不含：token、密碼、作者 email、本機絕對路徑、客戶資訊。

---

## 1 目的與範圍

**目的**：把晨報歸檔站套用 Iris 在第一輪設計提案中、經 George 選定的「方案 C」（以 B 為骨架、頭條用深色焦點塊、日報頁保留規格欄並加窄閱讀欄、手機首頁四分頁且不支援 `:has()` 時全部展開）。George 的決定是「採用方案 C」，經 Ada 轉達；我沒有讀到原始訊息。

**範圍內（PR #27 實際改的 4 個檔，head `e741e0e` 對 `aa18f7d`，Quill 用 `git diff --numstat` 讀到）**：

| # | 檔案 | 狀態 | 新增行 | 刪除行 | 內容 |
| --- | --- | --- | --- | --- | --- |
| 1 | `site/assets/design-c.css` | 新增 | 141 | 0 | 淺深色 token、手機漸進增強、閱讀欄、狀態配色、頭條與事實欄樣式、手機頁籤 |
| 2 | `site/build.mjs` | 修改 | 38 | 10 | 共用桌面側欄與手機底部導覽（dock）、首頁四區、廠商分組與產品狀態篩選；在 `<head>` 加入 `design-c.css` |
| 3 | `site/contrast.mjs` | 修改 | 20 | 0 | 保留原本 70 組檢查，新增 Proposal C 色彩配對（第一輪 12 組、第二輪 13 組，各乘淺色與深色兩種模式） |
| 4 | `site/display-v4.mjs` | 修改 | 14 | 1 | 首頁深色焦點、CVE 首頁列表、段落頁規格欄的 HTML 產生 |

合計 +213／−11（GitHub API 的 `additions`、`deletions`，與上表四列相加一致）。

**範圍外（這次沒有動）**：

- `daily/`、`products/`、`products.yaml`、`README.md`、`items.jsonl`：Vega 兩輪都確認資料檔無 diff（Vega 回報）。
- `.github/` workflow（含 02:00、07:30、08:00 的排程）、`package.json`、`package-lock.json`：Vega 兩輪 `git diff --stat` 為空（Vega 回報）。
- `site/test.mjs`、`site/weekly-guards.test.mjs`：沒有改（Vega 與 Rigel 都回報；Rigel 第一輪另說明 45 項測試原樣保留）。
- `site/assets/toc.js`、`site/assets/search.js`：沒有改（Vega 回報）。
- CSP meta 字串、`--base-path` 白名單、markdown-it 的 `html: false`：Vega 兩輪確認 `build.mjs` 的 CSP 字串前後相同。
- repo 設定、分支保護、GitHub Pages 部署：未動。

**與網站發布的關係**：網站產生器 `site/build.mjs` 只讀 `README.md`、`daily/`、`products/`、`products.yaml`、`items.jsonl`，不讀 `docs/`（Quill 讀 `build.mjs` 第 200–213 行與第 402 行，`fs.readdirSync` 只用在 `daily/` 與輸出資料夾檢查）。Quill 並在 `e741e0e` 實際建置，輸出資料夾只有 `404.html`、`about.html`、`assets`、`build-report.json`、`daily`、`index.html`、`products`、`search`，沒有 `docs`。所以本文件不會被發布成網頁，也不影響 47 頁的頁數。repo 本身是公開的，因此本文件不放 token、作者 email、本機絕對路徑。

---

## 2 環境與版本

| 項目 | 值 | 來源 |
| --- | --- | --- |
| PR | https://github.com/george-palsys/morning-brief-archive/pull/27 | Quill 讀匿名 API |
| 分支 | `feat/design-c-phase2` | Quill 讀匿名 API |
| base | `main` 的 `aa18f7dd0179c137fbf242a795330218b3df4c52` | Quill 讀匿名 API；Rigel、Vega 回報相同 |
| 第一輪 head | `f1dd64ccc3728b82c41d9e932e42f8ab4bcf4f40`，2026-11-20 19:32:05（+08:00） | Quill 用 `git log` 讀到 |
| 目前 head（第二輪） | `e741e0e682f0ba016011d25b047aa659525e1b58`，2026-11-20 19:48:13（+08:00），訊息 `fix: restore hero fact contrast and full-width mobile tabs` | Quill 用 `git log` 讀到 |
| PR 內 commit 數 | 2 | Quill 讀匿名 API |
| CI | 對 `e741e0e` 有 1 個 run：Static site，id 44730565445，event pull_request，completed／success | Quill 讀匿名 API |
| Node.js（Quill） | 以 repo 要求 `engines.node >= 22`；Quill 本機實際版本未另外記錄 | 未驗證版本字串 |
| 相依套件 | markdown-it 15.0.3、yaml 2.9.1，PR 沒有新增相依 | `package.json`；Vega 回報 `npm ci` 8 套件、`npm audit` 0 漏洞 |
| Rigel 環境（第一輪） | Chromium Headless（他寫 Chrome 120+）、Node.js v25.8.2 | Rigel 回報 |
| Rigel 環境（第二輪） | Google Chrome 133.0.6943.142 Headless、Node.js v22.14.0 | Rigel 回報；與第一輪不同，兩輪未說明原因 |
| Iris 環境 | headless Chromium（CDP）；深色模式為瀏覽器模擬，不是系統設定；經本機靜態伺服器 | Iris 回報 |
| Vega 環境 | 匿名 clone；`npm ci --ignore-scripts`；gitleaks v8.30.1（先用官方 `checksums.txt` 跑 `sha256sum -c`，結果 OK） | Vega 回報 |
| 對比標準 | WCAG 2.2 的 1.4.3（文字 4.5:1）與 1.4.11（非文字 3:1），https://www.w3.org/TR/WCAG22/ | Iris 自述「本次未重新開啟原文」；Quill 也沒有重新開啟，**標準原文未重新查證** |
| `:has()` 官方說明 | 本紀錄沒有查證瀏覽器對 `:has()` 的支援版本；Iris 規格寫 Firefox 121 以下、Safari 15.4 以下不支援，該數字未經 Quill 查證 | 未驗證 |

---

## 3 實際步驟與完整指令

### 3.1 時間線（2026-11-20，Asia/Taipei）

| # | 時間 | 事件 | 來源 |
| --- | --- | --- | --- |
| 1 | 11:32（UTC 欄位 `11:32:24Z`，即 19:32 +08:00） | PR #27 建立，head `f1dd64c` | Quill 讀匿名 API 的 `created_at` 與 `git log` |
| 2 | 19:33–19:40 | Vega 第一輪安全審查，0 阻擋、2 項資訊（I1、I2） | Vega 回報 |
| 3 | 19:42（報告自寫時間） | Rigel 第一輪驗證，結論「通過、建議合併」，退修清單 0 項 | Rigel 回報 |
| 4 | 約 19:42（檔案時間） | Iris 第一輪設計審查，阻擋 B1、B2，退回 Lin | Iris 回報；時間為報告檔案的修改時間，報告內文沒有寫時間 |
| 5 | 19:48:13 | Lin 推 `e741e0e`，修 B1、B2 | Quill 用 `git log` 讀到 |
| 6 | 19:48–19:52 | Vega 第二輪安全審查，0 阻擋、0 新增建議、0 新增資訊 | Vega 回報 |
| 7 | 約 19:52（檔案時間） | Iris 第二輪設計複審，B1、B2 解除，無阻擋；新增建議 S11 | Iris 回報；時間為檔案修改時間 |
| 8 | 19:56（檔案時間） | Rigel 第二輪驗證，B1、B2 修正達標 | Rigel 回報；時間為檔案修改時間，報告內文只寫日期 |

### 3.2 PR #27 的變更重點

- `build.mjs`：新增 `primary` 主導覽、桌面側欄（`design-rail`）、手機底部 dock（`design-dock`）；首頁新增 `design-home` 結構，含 `homeViews = ['焦點', 'CVE', '產品', '其他']` 的四個 radio 頁籤；產品總覽新增廠商分組與狀態篩選（全部、有更新、無更新、無法確認、無公開來源）；段落頁加 `data-section` 屬性。
- `display-v4.mjs`：`renderHomeLead`（深色焦點）、`renderHomeCves`（首頁 CVE 列表）、段落頁把 CVE 徽章與狀態移到 `<aside>` 規格欄。
- `design-c.css`：淺色與深色兩組 `--design-*` token，映射到既有的 `--color-*`、`--v-*`；手機頁籤與產品篩選用 `<input type="radio">` 加 CSS 完成，不需要 JS；整段收合規則放在 `@supports selector(:has(*))` 內。
- 第二輪的修正內容（`f1dd64c..e741e0e`，Quill 用 `git diff` 讀到，只改 2 個檔、共 5 行新增 5 行刪除）：
  - `design-c.css`：新增 `--design-hero-fact-bg`（淺色 `#0f1724`、深色 `#141a22`）；`.design-lead .v4-facts > div` 加上 `background:var(--design-hero-fact-bg); color:var(--design-hero-ink);`；`.design-home-controls label` 加上 `display:grid; margin:0; min-inline-size:0;`。
  - `contrast.mjs`：在 pairs 中插入一組 `['hero-muted', 'hero-fact-bg', 4.5]`。

### 3.3 本機重現指令（Quill 在 `e741e0e` 實際執行，每行一個）

```
git clone https://github.com/george-palsys/morning-brief-archive.git
git fetch origin pull/27/head:pr27
git checkout -b feat/design-c-phase2 pr27
git rev-parse HEAD
npm ci --ignore-scripts
npm test
npm run check:contrast
npm run build -- --output ../design-c-preview
```

- 建置的目的資料夾必須為空或不存在（`build.mjs` 第 402 行檢查，否則中止）。
- 在 Git Bash 若要加 `--base-path`，需先設 `MSYS_NO_PATHCONV=1`，避免路徑被轉換（沿用先前紀錄的結論；這次沒有用到 `--base-path`）。

### 3.4 Quill 本機重跑結果（head `e741e0e`）

| # | 指令 | 實際輸出摘要 | 結論 |
| --- | --- | --- | --- |
| 1 | `npm ci --ignore-scripts` | `found 0 vulnerabilities` | 通過 |
| 2 | `npm test` | `tests 45`、`pass 45`、`fail 0`、`skipped 0` | 通過 |
| 3 | `npm run check:contrast` | `CONTRAST OK: 70 CSS color pairs (light + dark)`；`CONTRAST OK: 26 Proposal C color pairs (light + dark)` | 通過 |
| 4 | `npm run build -- --output <空資料夾>` | `BUILD OK: 47 HTML pages; 26/26 product pages; 3 daily editions; 45 search items; 0 warnings; mode=production` | 通過 |
| 5 | 檢視輸出資料夾 | 只有 `404.html`、`about.html`、`assets`、`build-report.json`、`daily`、`index.html`、`products`、`search`，沒有 `docs` | docs 不會被發布 |

新增本文件之後，Quill 會在同一分支再跑一次上列 2–4 項並把結果寫在第 5.7 節；本文件只新增一個 md，不改任何其他檔案。

---

## 4 產出清單與位置

| # | 項目 | 位置 | 狀態 |
| --- | --- | --- | --- |
| 1 | PR #27 | https://github.com/george-palsys/morning-brief-archive/pull/27 | 未合併 |
| 2 | 第一輪 commit | `f1dd64ccc3728b82c41d9e932e42f8ab4bcf4f40` | 已被第二輪取代 |
| 3 | 第二輪 commit | `e741e0e682f0ba016011d25b047aa659525e1b58` | PR 目前 head |
| 4 | 新增樣式檔 | `site/assets/design-c.css` | 在 PR 內 |
| 5 | 修改檔 | `site/build.mjs`、`site/display-v4.mjs`、`site/contrast.mjs` | 在 PR 內 |
| 6 | 本實作紀錄 | `docs/implementation/2026-11-20-design-c-rollout.md` | 加在 PR #27 同一分支，只新增這一份 |
| 7 | CI | Static site，run 44730565445，對 `e741e0e` success | Quill 讀匿名 API；該 run 只涵蓋 PR 內容，不含本文件 |
| 8 | 合併後部署 | 未發生 | 見第 8 章 |

### 4.1 首頁四個頁籤的正式名稱（資料不一致查證結果）

| # | 來源 | 頁籤 1 | 頁籤 2 | 頁籤 3 | 頁籤 4 |
| --- | --- | --- | --- | --- | --- |
| 1 | PR 原始碼 `site/build.mjs` 第 378 行（`homeViews`），Quill 讀 | 焦點 | CVE | 產品 | 其他 |
| 2 | Quill 在 `e741e0e` 建置後 `index.html` 的實際輸出（`<span>` 內文字，前三個已逐字核對，第四個與原始碼一致） | 焦點 | CVE | 產品 | （原始碼為其他） |
| 3 | 任務書（Ada） | 焦點 | CVE | 產品 | 其他 |
| 4 | Iris 第二輪報告 | 焦點 | CVE | 產品 | 其他 |
| 5 | Rigel 第二輪報告第 4 節表格 | 今日焦點 | 重大弱點 | 追蹤動態 | 資安時事 |

**結論**：正式名稱是「焦點／CVE／產品／其他」。Rigel 第二輪表格的四個名稱與原始碼、建置輸出都不同，是 Rigel 報告內自己的描述，不是網站上實際出現的字；其量測的版位與數字不受影響（四個頁籤各 4 格，Rigel 以位置索引 Tab 0–3 記錄）。本文件一律使用正式名稱。這項我沒有另外請 Rigel 更正報告。

---

## 5 驗證與審查結果

### 5.1 四關結論總表

| # | 關卡 | 對象 head | 誰 | 結論 | 阻擋項 | 備註 |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | 驗證第一輪 | `f1dd64c` | Rigel | 通過、建議合併；退修 0 項 | 0 | 沒有量到頭條事實欄（見 5.5），所以不是對 B1 的反證 |
| 2 | 安全第一輪 | `f1dd64c` | Vega | 安全面可合併 | 0 | 資訊 2 項（I1、I2）；明說不代表全部安全 |
| 3 | 設計第一輪 | `f1dd64c` | Iris | **退回修正** | 2（B1、B2） | 建議 S1–S10 |
| 4 | 修正 | `e741e0e` | Lin | 修 B1、B2 | — | 見 3.2 |
| 5 | 驗證第二輪 | `e741e0e` | Rigel | B1、B2 修正達標；回歸通過 | 0 | 補量事實欄與頁籤 |
| 6 | 安全第二輪 | `e741e0e` | Vega | 安全面可合併 | 0 | 建議 0、資訊 0 新增；I1、I2 仍成立 |
| 7 | 設計第二輪 | `e741e0e` | Iris | B1、B2 解除；無阻擋 | 0 | 新增 S11（既有問題）；S1–S10 多數未重驗 |

### 5.2 Iris 第一輪阻擋項與修正

| 編號 | 問題（Iris 回報） | 修法（Lin，Quill 讀 diff） | 第二輪結果 |
| --- | --- | --- | --- |
| B1 | 淺色模式頭條（hero）的事實欄沒有深色底，標籤字 `#b8c2d4` 落在淺色面 `#f5f7fa` 上，約 1.7:1，且失去「深色頭條」外觀（1440 與 390 皆是） | `.design-lead .v4-facts > div` 加 `background:var(--design-hero-fact-bg)` 與 `color:var(--design-hero-ink)`；新增 token `--design-hero-fact-bg`（淺 `#0f1724`、深 `#141a22`）；`contrast.mjs` 新增 `['hero-muted','hero-fact-bg',4.5]` | Iris 與 Rigel 皆實測：標籤 10.02:1（淺）、7.08:1（深）；內容 17.97:1（淺）、14.86:1（深）。Quill 另用 Python 以 WCAG 公式算 `#b8c2d4` 對 `#f5f7fa` 為 1.67:1、對 `#0f1724` 為 10.02:1，與 Iris 原述「約 1.7:1」一致 |
| B2 | 手機首頁四個頁籤選取態只填滿文字寬度、貼左邊緣，與原型「等分四格」不同 | `.design-home-controls label` 加 `display:grid; margin:0; min-inline-size:0` | 見 5.4 |

### 5.3 B1 事實欄對比實測（第二輪）

誰量：Rigel 與 Iris 各自以 `getComputedStyle` 取實際文字色與實際繪製背景，再用 WCAG 相對亮度公式計算；兩人數字完全一致。

| # | 模式 | 視窗寬度 | 元素 | 前景 | 背景 | 對比 | 誰量 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 淺色 | 1440 | `dt` 標籤 | `rgb(184,194,212)` | `rgb(15,23,36)` | 10.02:1 | Rigel、Iris |
| 2 | 淺色 | 1440 | `strong` 內容 | `rgb(255,255,255)` | `rgb(15,23,36)` | 17.97:1 | Rigel、Iris |
| 3 | 淺色 | 1440 | `small`（來源） | `rgb(184,194,212)` | `rgb(15,23,36)` | 10.02:1 | Rigel |
| 4 | 淺色 | 390 | `dt` 標籤 | `rgb(184,194,212)` | `rgb(15,23,36)` | 10.02:1 | Rigel、Iris |
| 5 | 淺色 | 390 | `strong` 內容 | `rgb(255,255,255)` | `rgb(15,23,36)` | 17.97:1 | Rigel、Iris |
| 6 | 淺色 | 360 | `dt` 標籤、`strong` 內容 | `rgb(184,194,212)`、`rgb(255,255,255)` | `rgb(15,23,36)` | 10.02:1、17.97:1 | Iris |
| 7 | 深色 | 1440 | `dt` 標籤 | `rgb(154,166,182)` | `rgb(20,26,34)` | 7.08:1 | Rigel、Iris |
| 8 | 深色 | 1440 | `strong` 內容 | `rgb(232,237,243)` | `rgb(20,26,34)` | 14.86:1 | Rigel、Iris |
| 9 | 深色 | 1440 | `small`（來源） | `rgb(154,166,182)` | `rgb(20,26,34)` | 7.08:1 | Rigel |
| 10 | 深色 | 390 | `dt` 標籤 | `rgb(154,166,182)` | `rgb(20,26,34)` | 7.08:1 | Rigel、Iris |
| 11 | 深色 | 390 | `strong` 內容 | `rgb(232,237,243)` | `rgb(20,26,34)` | 14.86:1 | Rigel、Iris |
| 12 | 深色 | 360 | `dt` 標籤、`strong` 內容 | `rgb(154,166,182)`、`rgb(232,237,243)` | `rgb(20,26,34)` | 7.08:1、14.86:1 | Iris |

### 5.4 B2 手機頁籤等分實測（第二輪）

| # | 視窗寬度 | 控制列寬 | 單格寬 x 高 | 選取態 `span` 寬 x 高 | 寬度差／高度差 | 高度 ≥44px | 誰量 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 390 | 358px | 89.00 x 44.00 | 89.00 x 44.00 | 0／0 | 是 | Rigel、Iris |
| 2 | 360 | 328px | 81.50 x 44.00 | 81.50 x 44.00 | 0／0 | 是 | Rigel、Iris |

- 四個頁籤各測一次，四格的 x 位置：390 為 17／106／195／284，360 為 17／98.5／180／261.5（Iris 回報）。
- 選取態填色：淺色背景 `rgb(15,23,36)`、字 `rgb(255,255,255)`；深色背景 `rgb(232,237,243)`、字 `rgb(13,17,23)`（Iris 回報；Rigel 只列淺色）。
- 窗格切換：焦點、CVE、產品、其他各自只顯示對應一個窗格；Iris 在 390、360、淺色、深色共 16 次，每次 1 個 block、3 個 none；Rigel 在 390 逐一切換並確認。
- 360px 的數字出現落差：Lin 報告（Rigel 轉述）寫單格 85.33 x 44；Rigel 與 Iris 實測皆為 81.5 x 44。Rigel 推測 Lin 以未扣邊距的 360/4 計算，這個推測未經 Lin 確認。**以實測 81.5 為準。**

### 5.5 第一輪 Rigel 為何沒有發現 B1

- Rigel 第一輪的對比表只量了頭條標題 h2、頭條摘要 p、kicker、按鈕、焦點框與頭條外框；其中「頭條摘要 p」的 10.02:1 是量 `p` 對頭條底色，**沒有量 `.design-lead .v4-facts > div` 內的 `dt`、`small`**。事實欄的標籤字色與摘要同為 `#b8c2d4`，所以 10.02 這個數字被誤用成整個頭條區的結論。
- 第二輪 Rigel 補量事實欄的 `dt`、`strong`、`small`（見 5.3）。
- 這是來自報告內容的比對（Quill 讀 Rigel 第一輪第 3.1 節與第二輪第 3 節），Rigel 本人沒有另外說明漏量的原因，所以「為何漏量」只是 Quill 的推讀，標「推論」。Ada 的任務書也寫了「第一輪漏量事實欄」。

### 5.6 其他 Rigel 實測（成員回報，Quill 未重跑）

| # | 項目 | 第一輪（`f1dd64c`） | 第二輪（`e741e0e`） | 來源 |
| --- | --- | --- | --- | --- |
| 1 | `npm test` | 45 pass、0 fail、9.57s | 45 passed、0 failed、12,288ms | Rigel 回報 |
| 2 | `npm run check:contrast` | 70 組＋24 組 Proposal C | 70 組＋26 組 Proposal C | Rigel 回報；Quill 重跑與第二輪一致（26 組） |
| 3 | `npm run build` | 47 頁、26/26 產品頁、3 份日報、45 筆搜尋、0 警告 | 同樣 47 頁、26/26 產品頁、3 份日報、45 筆搜尋、0 警告 | Rigel 回報；Quill 重跑一致 |
| 4 | 水平溢位 | 54 組（9 頁，每頁 1440、768、390、360、320 與 1280 的 200% 縮放）0 項溢位 | 同樣 54 組 0 項溢位 | Rigel 回報 |
| 5 | 站內連結 | 2,198 條、斷鏈 0 | 2,590 條、斷鏈 0 | Rigel 回報；兩輪條數不同，見 5.8 |
| 6 | 外部網路請求 | 0 | 0 | Rigel 回報 |
| 7 | CSP 違規（Console） | 0 | 0（只有預設的 `/favicon.ico` 404 一次） | Rigel 回報 |
| 8 | 成員名稱出現在公開頁（排除英文字 Adapting） | 0 | 0 | Rigel 回報；Vega 也回報 0 |
| 9 | 資料相符（日期、CVE 編號、26 項產品與狀態 10／14／1／1、新知識 6 則標題等 20 項） | 全部相符 | 未重做 | Rigel 回報 |
| 10 | 深色頭條外框對頁面背景 | 4.34:1（外框 `rgb(109,122,140)` 對 `rgb(13,17,23)`）；對卡片底色 4.01:1 | 未重做；Iris 第二輪確認外框 1px `rgb(109,122,140)` 無退步 | Rigel、Iris 回報 |
| 11 | 頭條 h2、摘要、kicker、按鈕、焦點框 | 淺／深：17.97／14.86、10.02／7.08、8.41／7.10、17.97／17.97 等，全數 ≥4.5（文字）或 ≥3（非文字） | 未重做 | Rigel 回報 |
| 12 | 狀態徽章（有更新、無更新、無法確認、無公開來源） | 淺色 6.68、6.64、6.58、6.48；深色 8.52、9.58、8.95、7.15 | 深色重量：8.52、9.58、8.95、7.15 | Rigel 回報 |
| 13 | CVE 標籤「已遭利用」 | 淺 5.70、深 7.76 | 未重做 | Rigel 回報 |
| 14 | 產品總覽「有更新」篩選 | 點選後 10 項 | 10 項；「全部」26 項 | Rigel 回報 |

### 5.7 本文件新增後的重跑（Quill）

於 `e741e0e` 之上新增本文件並在本機 commit 後，Quill 重跑下列三個指令，確認新增 docs 不影響「45/45、70＋26 組、47 頁、0 警告」。輸出資料夾仍沒有 `docs`：

| # | 指令 | 預期 | Quill 實際（加入本文件後） |
| --- | --- | --- | --- |
| 1 | `npm test` | 45/45 | 45 pass、0 fail |
| 2 | `npm run check:contrast` | 70＋26 組 | 70 組＋26 組 OK |
| 3 | `npm run build` | 47 頁、0 警告 | 47 頁、26/26、3 份日報、45 筆、0 警告 |

### 5.8 Vega 安全審查重點

| # | 項目 | 第一輪 | 第二輪 | 來源 |
| --- | --- | --- | --- | --- |
| 1 | XSS 與輸出編碼 | 逐一檢查新增 HTML 插入點，未發現；注入夾具（`"><svg onload=alert(1)>`、`<script>`、`<img onerror>`、引號、`javascript:`、`data:`）建置後全被編碼；7 種負面輸入（`__proto__`、`constructor`、`toString`、含引號 keyword、`1e308`、不在清單的 kind、`attention.section=../x`）全被拒絕 | 因 `build.mjs`、`display-v4.mjs` 差異為 0，沒有重跑注入測試，沿用第一輪 | Vega 回報 |
| 2 | CSP、外部資源 | CSP 字串前後相同；47 頁都有 CSP 且只有 1 種寫法；`unsafe-` 0 次；`target="_blank"` 0 個；指向 `http(s)://` 的 link、script、img、iframe、source 為 0；`design-c.css` 的 `url(`、`@import`、`http(s)://` 為 0 | `grep` 檢查 `design-c.css` 整份為 0 筆；`git diff f1dd64c pr27r2 -- site/build.mjs` 為 0 行 | Vega 回報 |
| 3 | 供應鏈 | `.github`、`package.json`、lockfile、測試檔無 diff；`npm audit` 0 漏洞；gitleaks 掃 commit、`site/`、`.github/`、建置產出皆 no leaks found | 同樣 3 個範圍 no leaks found；`contrast.mjs` 只新增一組、沒有放寬門檻 | Vega 回報 |
| 4 | 洩漏內部資訊 | 公開頁面與 diff 新增行搜尋成員名稱 0 筆；`administrator@vsphere.local`、`10.0.0.5` 等為晨報資料本身的公開內容，非 PR 新增 | 建置產出搜尋成員名稱 0 筆 | Vega 回報 |
| 5 | 純靜態與 inline | inline `style=`、`<style>`、`on*=` 為 0；`<script>` 只有既有的同源 `toc.js`（每頁一個）與 `search.js`（只在搜尋頁） | inline、事件屬性、外部資源皆 0 | Vega 回報；Quill 在建置輸出的首頁看到 `<script src="assets/toc.js" defer>` |
| 6 | 既有測試 | `test()` 與 `assert` 數量在 main 與 PR 都是 229；`npm test` 45/45 | `npm test` 45/45 | Vega 回報 |
| 7 | 資訊 I1 | 「無 JS」不完全成立：仍載入既有同源 `toc.js`、`search.js`，PR 之前就有，PR 沒有增加 JS | 仍成立 | Vega 回報 |
| 8 | 資訊 I2 | 404 頁根相對連結從 16 筆增加到 30 筆，因 rail、dock 與 `design-c.css` 連結；路徑來自 `--base-path` 白名單 | 仍成立（HTML 解析器結果 `PROBLEMS 30`，404 頁以外 0 筆） | Vega 回報 |

### 5.9 Iris 設計審查重點

| # | 項目 | 結論 | 來源 |
| --- | --- | --- | --- |
| 1 | 深色模式頭條有邊框 | 通過：深色 1px `rgb(109,122,140)`（= `--design-strong`）；淺色邊線與頭條同底色，不另畫（與原型一致） | Iris 回報 |
| 2 | 手機四頁籤；不支援 `:has()` 時全部展開 | 功能通過；第二輪確認 390、360 皆四窗格全部 block、頁籤控制 `display:none`、產品篩選亦隱藏；為把選擇器改名的模擬，不是真實舊瀏覽器 | Iris 回報 |
| 3 | 「有更新」不用警示紅 | 無退步（目視；第二輪 probe 沒抓到元素，computed 值未取得，數值未驗證） | Iris 回報 |
| 4 | 狀態不只靠顏色 | 通過：徽章皆圖示加文字 | Iris 回報 |
| 5 | 26 個同尺寸方塊不再是主角 | 首頁通過；11/20 摘要頁未通過（S1，列為已知限制） | Iris 回報 |
| 6 | 水平溢位 | 第二輪 19 頁、1440 與 390、淺與深共 76 次載入皆無；首頁 360 另測也無 | Iris 回報 |
| 7 | 外部請求 | 76 次載入皆無 | Iris 回報 |
| 8 | 第一輪觸控目標 | 導覽、dock、頁籤、狀態條、篩選、規格欄連結 ≥44px；內文行內連結與「← 26 項產品現況」（21px）低於 44，列 S10 | Iris 回報 |

---

## 6 如何套用到別的專案

1. 先讓設計方有「可對照的原型」與「token 表」；實作的 token 一律用 `--design-*` 映射到既有 token，不直接覆蓋既有名稱（本 PR 的做法）。
2. 頁籤與篩選優先用「`<input type="radio">` 加 CSS」並把收合規則整段放進 `@supports selector(:has(*))`；不支援時預設全部展開，不讓內容消失。這樣不增加 JS，也不違反 `script-src 'self'`。
3. 新增的每一組前景／背景配色，同時加進 `contrast.mjs`；本案 B1 因事實欄那一對沒有被腳本涵蓋而漏網（Iris 回報），之後新增色對時，要涵蓋「實際繪製背景」而不只是「頭條底色」。
4. 驗證方要量 `getComputedStyle` 的實際前景與實際繪製背景，並明列每一個「量過的元素」；只量部分元素，就不要寫成整區通過。
5. 修正輪要明寫兩個 head 的 SHA，並用 `git diff <舊head> <新head>` 確認只改了預期的檔。
6. 紀錄中凡是成員回報、自己沒重跑的數字，一律標來源；兩個來源數字不同時並列，不自行擇一。

---

## 7 後續維護方式

| # | 事項 | 負責 | 說明 |
| --- | --- | --- | --- |
| 1 | 合併 PR #27 | Leader（GeorgeAI、Ada、George-palsys） | 依晨報 repo 規則由 Leader 自行合併；合併後回報 PR 連結、改了什麼、哪些仍未驗證 |
| 2 | 合併後補第 4、9 章 | 文件撰寫 | 記合併 commit、合併者、main 的 CI／部署 run 結果；結果不要先寫成功 |
| 3 | PR 說明與實際不符 | Lin | PR 說明寫「24 組」配色，head `e741e0e` 實際為 26 組（12 組變 13 組，各乘淺深）；說明文字未更新，建議合併前補一句，或接受以本文件為準 |
| 4 | 後續獨立 PR：S2 | Lin、Iris | CVE 規格欄桌面版 float 改 grid，需包文章容器，風險高於 CSS 微調，Iris 建議另開 PR，以 `d1120-cve-1440.png` 作驗收對照 |
| 5 | 後續獨立 PR：S1 | Lin、Iris | 日報摘要頁仍是 26 格同尺寸方塊；建議改用首頁狀態條或縮為次要區塊 |
| 6 | token 記錄：S5 | Iris | 5 個新 token 補進 `shared/tokens.css` 或改用既有名稱 |
| 7 | 既有問題：S11 | Lin、Iris | 11/20 AI 頁「影響」區塊行內 `code` 對比約 1.07:1，另開 PR |
| 8 | 同源 JS | George 決定 | 若目標是完全無 JS，要另開工作處理 `toc.js` 與 `search.js`（Vega I1） |
| 9 | 資料壞掉的處理 | 沿用既有決定 | meta.yaml 缺欄位或某天資料夾不完整時建置會失敗、整站停更、不發布壞資料（GeorgeAI 決定）；PR #27 沒有改這個行為（`build.mjs` 內相關檢查維持） |
| 10 | 部署 | 合併後 | 合併到 main 會觸發既有的 Pages 工作流程；本 PR 沒改 workflow；合併後的線上結果要另行驗證 |

---

## 8 未驗證項目

### 8.1 Quill 的未驗證

| # | 項目 | 說明 |
| --- | --- | --- |
| U1 | 瀏覽器實際渲染 | Quill 沒有開瀏覽器看畫面，所有視覺與量測數字都是成員回報 |
| U2 | Rigel、Iris、Vega 的量測數字 | Quill 只重跑 `npm ci`、`npm test`、`npm run check:contrast`、`npm run build`，以及用 Python 自算 1.67、10.02、7.08、17.97、14.86 五組；其餘數字均未重跑 |
| U3 | Node.js 版本 | Quill 本機版本字串沒有另外記錄 |
| U4 | WCAG 2.2 原文 | 兩位成員與 Quill 都沒有重新開啟原文，標準數值依既有認知 |
| U5 | 審查時間 | Iris 兩輪與 Rigel 第二輪報告內文沒有寫時間，3.1 時間線用檔案修改時間，可能與實際審查時間有落差 |
| U6 | 本文件推送 | Quill 沒有 GitHub 寫入認證；以免提示模式嘗試推送一次，被拒（需要帳號）；本文件在 Quill 本機 commit，是否已推到 PR #27 分支以 Ada 後續回報為準 |

### 8.2 各關共同的未驗證

| # | 項目 | 誰回報 | 說明 |
| --- | --- | --- | --- |
| U7 | Firefox 實體執行 | Rigel | Windows 宿主機沒有 Firefox；僅在 Chromium 以 `@supports` 改寫模擬 |
| U8 | Safari 實體執行 | Rigel、Iris | 無環境 |
| U9 | 真實手機（iOS、Android）觸控 | Rigel、Iris | 只用 Chromium 模擬視窗；Iris 說深色為模擬 |
| U10 | 螢幕閱讀器（NVDA、VoiceOver、JAWS） | Rigel | 未驗證 `:has()` 頁籤切換的朗讀；Rigel 只確認 DOM 的 `sr-only` legend、`aria-hidden`、`tabindex` 宣告 |
| U11 | GitHub Pages 部署與線上頁面 | Vega、Iris | PR 未合併，沒有部署；線上實際 CSP、radio 加 CSS 互動、部署後頁面均未驗證 |
| U12 | 真實舊瀏覽器上的 `:has()` 後備 | Rigel、Iris | 只用「選擇器改名」或「`@supports not selector(*)`」模擬 |
| U13 | Iris 未逐張看的截圖 | Iris | 第一輪：`d1120-ai-*`、`d1120-maint-*`、`d1120-taiwan-1440*`、`d1119-index-*`、`d1119-cve-*`、`product-openshift-*`、`notfound-*`、`about-1440*`、各頁深色多數張、`search-results-1440-dark.png`、`home-390-tab-other.png`。第二輪另有：11/20 AI 頁 390 與深色、清單維護 1440／390 淺／1440 深、11/19 摘要 390 與深色、11/19 CVE 1440 與淺色、404 390 與淺色、OpenShift 1440 與淺色，皆標「未驗證」；第二輪重拍的 101 張只部分逐張看過 |
| U14 | 真實 Tab 鍵順序與 hover | Iris | 只量過 `.design-lead a` 的 focus 外框 |
| U15 | 「有更新」徽章的 computed 色值 | Iris | probe 沒抓到元素，只有目視為藍；Rigel 第一輪量到 6.68（淺）／8.52（深），可交叉參考，兩人方法不同 |
| U16 | 真實 OS 深色切換 | Iris、PR 說明 | 深色為瀏覽器模擬 |
| U17 | Vega 的瀏覽器行為驗證 | Vega | CSP 實際阻擋、radio 加 CSS 的互動、手機分頁寬度均未驗證 |
| U18 | PR 留言與 review 內容 | Vega | 只讀 PR 說明，沒讀留言；第二輪未重讀說明 |
| U19 | repo 設定、分支保護、Dependabot、secret scanning | Vega | 需認證，兩輪皆未重查 |
| U20 | 第二輪注入測試 | Vega | 第二輪沒重跑；以 `build.mjs`、`display-v4.mjs` 差異 0 為由沿用第一輪；第一輪注入只針對 2026-11-19 的 v4 資料，2026-11-20 正式資料只做建置與解析器掃描 |
| U21 | 首頁 `#item-N` 錨點是否都對得到 id | Vega 交給 Rigel | Rigel 回報站內連結斷鏈 0，但報告沒有逐項說明 `#item-N` 錨點 |
| U22 | 正式 v3 資料的建置 | 全體 | 驗證多以現有 11/20 資料與 11/19 演練資料進行 |
| U23 | 200% 縮放以外的縮放 | Rigel | 只測 1280px 下 200% |

### 8.3 已知限制（建議項與既有問題，未修）

| # | 限制 | 誰回報 | 等級／處置 |
| --- | --- | --- | --- |
| K1 | CVE 規格欄在桌面版（≥720px）用 `float:inline-start`：規格欄寬 244px、標題寬 672px，第一則段落被擠成 218px；前兩則（Java4Shell、NGINX2Root）內文只有一句；長文章第一個清單項目繞排在規格欄旁、之後的清單回到全寬、左緣不齊。內容無遺失、不溢位。手機 390 為單欄無此問題 | Iris 第二輪實測（`d1120-cve-1440.png`） | 建議（S2），可延後，不擋合併；建議另開獨立 PR |
| K2 | 日報摘要頁仍是 26 格同尺寸方塊與白框事實格，與新首頁語彙不同 | Iris 第一輪（S1）；第二輪「未重驗，沿用」 | 建議；第二階段處理 |
| K3 | 新 token 未記入 `shared/tokens.css`：`--design-confirmed`、`--design-on-confirmed`、`--design-readable`（= 42rem，對應 `--w-read`）、`--design-display`（clamp，對應 `--fs-display`）、`--design-hero-fact-bg`（第二輪新增）。共 5 個 | Iris 第一輪列 4 個，第二輪補第 5 個 | 建議（S5） |
| K4 | 11/20 AI 頁「影響」黑底區塊內行內 `code`（例：`CVE-2026-132165`）對比不足：淺色文字 `rgb(255,255,255)` 在底 `rgb(245,247,250)`，約 1.07:1；深色文字 `rgb(21,24,27)` 在底 `rgb(20,26,34)`，約 1.0x:1，等於看不見。Iris 以同一腳本建置合併基底 `aa18f7d`，行內 code 顏色幾乎相同，所以是**既有問題**，不是本 PR 造成 | Iris 第二輪（S11） | 建議；可另開 PR；Iris 建議 `code` 設 `color:inherit; background:transparent` 或用有對比的底色 |
| K5 | 網站仍載入既有同源 `toc.js`（每頁）與 `search.js`（搜尋頁），「無 JS」不完全成立；PR 之前就有，PR 沒有新增 JS | Vega（I1） | 資訊；若目標是完全無 JS，需另開工作 |
| K6 | 404 頁根相對連結 30 筆，來自 `--base-path` 白名單 | Vega（I2） | 資訊 |
| K7 | S3：關鍵字浮水印與標題重疊、CVE 標題藍色底線太像連結 | Iris | 建議；第二輪在 `d1120-ai-1440.png` 看到重疊 |
| K8 | S4：頁首、側欄、dock 導覽重複；dock 無搜尋入口，搜尋頁無 active 項 | Iris | 建議；第二輪未重驗 |
| K9 | S6：新知識頁缺 h3 小標 | Iris | 建議；未重驗 |
| K10 | S7：產品總覽 390 兩欄卡片間距不均 | Iris | 建議；未重驗 |
| K11 | S8：產品頁來源表窄欄逐字折行（「版本」「類別」「工／具」） | Iris | 建議；第二輪仍看到 |
| K12 | S9：搜尋頁標籤、下拉、按鈕貼近 | Iris | 建議；未重驗 |
| K13 | S10：「← 26 項產品現況」連結僅 21px 高，低於 44px 觸控區 | Iris | 建議；第二輪仍是文字連結 |

---

## 9 變更紀錄

只往後加，不改舊列。

| 日期 | 誰 | 變更 | 來源 |
| --- | --- | --- | --- |
| 2026-11-20 | Quill | 新增本文件：PR #27（方案 C Phase 2）實作紀錄；兩輪三關審查、B1／B2 與 Lin 的修正、已知限制、未驗證項目、資料不一致列表 | Ada 轉達 George「採用方案 C」；數字與結論來源見各章 |

---

## 附錄 A：成員報告之間的資料不一致（未自行抹平）

| # | 項目 | 說法 A | 說法 B | Quill 的處理 |
| --- | --- | --- | --- | --- |
| D1 | `:has()` 失效時首頁高度（390px） | Rigel 第一輪：5549px（`f1dd64c`） | Rigel 第二輪：4806px（`e741e0e`）；Iris 設計規格（原型）另寫 4802px | 三個數字並列。兩輪 Rigel 都沒說明差異。兩輪的四個窗格頂部 Y 座標幾乎相同（177、1224、2353、3454，第二輪為 177.00、1224.75、2353.89、3454.28），所以最後一個窗格的高度可能是差異來源，但這是推測。第二輪 `e741e0e` 的差異只在 CSS，沒有明顯理由讓高度少 743px，**原因未驗證**，已回報 Ada |
| D2 | 首頁頁籤名稱 | Rigel 第二輪：今日焦點／重大弱點／追蹤動態／資安時事 | 原始碼、建置輸出、任務書、Iris：焦點／CVE／產品／其他 | 以原始碼為準，見 4.1 |
| D3 | `<script>` 標籤數 | Rigel 第二輪：0（含外部 script 0）；第一輪：0 個內嵌、僅有本機外連 `toc.js`／`search.js` | Vega：既有同源 `toc.js`（每頁）與 `search.js`（搜尋頁）；Quill 在建置輸出看到 `<script src="assets/toc.js" defer>` | Rigel 第二輪的「0」與事實不符，可能是只算內嵌；以 Vega 與 Quill 讀到的為準 |
| D4 | 360px 頁籤單格寬 | Lin（Rigel 轉述）：85.33 x 44 | Rigel、Iris 實測：81.5 x 44 | 以實測為準，見 5.4 |
| D5 | Proposal C 配色組數 | PR 說明、Rigel／Vega／Iris 第一輪：24 組（12 組乘 2） | 第二輪：26 組（13 組乘 2），Quill 重跑也是 26 | 兩輪各自正確；PR 說明未更新 |
| D6 | 站內連結條數 | Rigel 第一輪：2,198 條 | Rigel 第二輪：2,590 條 | 兩輪都斷鏈 0；PR 差異只有 2 個檔 5 行，不該造成條數增加近 400，**原因未說明、未驗證**（可能是爬取範圍不同） |
| D7 | 頁型數 | Rigel 第一輪摘要寫「7 類頁型 x 5 寬度及 200% 縮放，共 54 組」 | Rigel 第一輪表格與第二輪皆列 9 頁（9 x 6 = 54） | 54 組不變；「7 類」是摘要敘述的筆誤，以 9 頁為準 |
| D8 | `build.mjs` 行數 | Vega 第一輪：+37／−11 | Quill 用 `git diff --numstat aa18f7d f1dd64c` 與 `aa18f7d e741e0e` 皆讀到 +38／−10；GitHub API 也是 +38／−10 | 以 Quill 與 API 為準；Vega 的數字差 1 行，原因未驗證 |
| D9 | Rigel 驗證環境 | 第一輪：Node.js v25.8.2、Chrome 120+ | 第二輪：Node.js v22.14.0、Chrome 133.0.6943.142 | 如實並列；兩輪結果一致，但環境不同 |
| D10 | 第一輪 Rigel 結論與 Iris 結論 | Rigel：通過、建議合併、退修 0 項 | Iris：阻擋 2 項、退回 | 不是矛盾而是範圍不同：Rigel 沒量事實欄與頁籤等分（5.5）。第二輪兩人數字一致 |
