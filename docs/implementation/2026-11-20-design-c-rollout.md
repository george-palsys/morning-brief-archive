# 實作紀錄：晨報歸檔站視覺改版 Phase 2（方案 C 套用，PR #27）

- 檔名日期：2026-11-20（依 Ada 指派）。
- 撰寫：Quill（文件撰寫）。本文件是整理，不是驗收；不是顧問服務紀錄。
- 對象：`george-palsys/morning-brief-archive` 的 PR #27「feat: 將方案 C 套用到晨報網站」，分支 `feat/design-c-phase2`，base 為 `main` 的 `aa18f7d`（PR #26 合併後）。
- 紀錄狀態：PR #27 **未合併**（Quill 以匿名 GitHub API 讀取：state open、draft false、merged false、mergeable_state clean）。目前 head 為 `e741e0e682f0ba016011d25b047aa659525e1b58`。本文件寫的是合併前的狀態；合併後要補第 4、9 章。
- **後續狀態（2026-11-20 補記）**：上一行「未合併」是撰寫當時的狀態。PR #27 已於 2026-11-20 20:07:22（台灣時間）以 squash 合併為 `ef7c1ce358c48effeb576f76e9a8d12d87d71335`（Quill 用 `git log` 讀到 commit 時間與 parent `aa18f7d`；合併 commit 含本文件，370 行）。Static site 第 60 次部署成功、線上複驗見 5.10（部署次數與線上結果來自 Rigel 報告與 Ada 轉達，Quill 未獨立查證）。後續 PR #28（分支 `fix/design-c-followup`，從 `ef7c1ce` 開出）處理 Iris 的後續建議，經兩輪設計審查（第一輪退修 B1、B2）後，已於 2026-11-20 20:51:40（台灣時間）以 squash 合併為 `2166673b6091861f1f45fc07fc32ad3c3bd0f29f`（Quill 用 `git log` 讀到 commit 時間與 parent `ef7c1ce`；Quill 另確認 PR #28 最終 head `77b913b7d172311697e80b8e32fe6f1d5ea8d87a` 與 `2166673` 的檔案內容相同，`git diff` 為空）。Static site 第 64 次部署成功（約 21:00，來自 Ada 轉達，Quill 未獨立查證）。PR #28 的審查經過見 5.14，合併後線上複驗見 5.15（Rigel 自報，未由第二人重跑；Chromium 範圍）。本文件於 PR #28 內已隨同合併，目前為 440 行；本次更新在 `2166673` 之上再補內容。
- **後續狀態（PR #30 補記）**：`main` 目前為 `3955780`（含 PR #29 的本文件更新）。George 於 2026-11-20 21:18 裁示補值（原話「補起來，之後 build 吧」，Ada 轉達）；PR #30（head `e7fd94ab01c7065c9390bb3a39a2980282598b84`，base `3955780`，Lin 開）補 `daily/2026-11-20/meta.yaml` 的 NGINX2Root 與 Java4Shell 後續兩項的 `cvss` 與 `exploited`，並在 `SPEC.md` 加一條規則。**撰寫當時 PR #30 為 open、未合併，Rigel 驗證中**；建置後頁面與部署結果未驗證。內容見 5.16、K21。
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

### 4.2 新增 token（`site/assets/design-c.css`，Quill 讀 `main` `2166673` 原始碼）

PR #27 新增 5 個 token，PR #28 另新增 2 個，共 7 個。值與用途都是 Quill 讀 CSS 原始碼的結果，沒有看畫面。

**記載位置（Iris 的 S5 建議）**：Quill 在 `2166673` 用 `git ls-files` 與全文搜尋，本 repo 內**沒有** `shared/tokens.css`（也沒有任何 `shared/` 資料夾；唯一提到該檔名的是本文件），所以那份共用 token 檔不在這個 repo，Quill 沒有建立它，也沒有查證它在哪裡。因此這 7 個 token 的定義與用途以本節為準，**尚未同步到 `shared/tokens.css`**，待維護該檔的人處理。

| # | token | 淺色值 | 深色值 | 用途（CSS 位置） | 所屬 PR | 來源 |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | `--design-confirmed` | `#b42318` | `#ff6b5e` | `.v4-confirmed` 的背景（「已確認」徽章） | #27 | Quill 讀 CSS |
| 2 | `--design-on-confirmed` | `#ffffff` | `#14080a` | `.v4-confirmed` 的文字色；與 `confirmed` 配對在 `contrast.mjs` 以 4.5 為門檻檢查 | #27 | Quill 讀 CSS 與 `contrast.mjs` |
| 3 | `--design-readable` | `42rem` | `42rem`（深色區塊沒有另設） | 日報段落頁 `.prose` 的 `max-width`，以及 1200px 以上閱讀欄 grid 的第一欄寬 | #27 | Quill 讀 CSS；Iris 回報它對應既有 `--w-read`，Quill 在 `2166673` 的 `site/` 全部檔案搜尋 `w-read` 為 0 筆，該對應**仍未驗證** |
| 4 | `--design-display` | `clamp(1.875rem,4vw,2.75rem)` | `clamp(1.875rem,4vw,2.75rem)`（深色區塊沒有另設） | `h1` 與 `.design-lead h2` 的字級；Iris 回報它對應既有 `--fs-display`，Quill 在 `2166673` 的 `site/` 搜尋 `fs-display` 同樣 0 筆，**仍未驗證** | #27 | Quill 讀 CSS |
| 5 | `--design-hero-fact-bg` | `#0f1724` | `#141a22` | 頭條事實欄 `.design-lead .v4-facts > div` 的背景；兩種模式的值都與 `--design-hero` 相同（Quill 逐值比對）；為修 B1 而於 `e741e0e` 新增 | #27（第二輪） | Quill 讀 CSS |
| 6 | `--design-impact-code-fg` | `#ffffff` | `#15181b` | `.v4-impact code` 的文字色（處理 K4） | #28（已合併） | Quill 讀 `2166673` 的 CSS |
| 7 | `--design-impact-code-bg` | `#27303b` | `#d5dbe0` | `.v4-impact code` 的背景（處理 K4） | #28（已合併） | Quill 讀 `2166673` 的 CSS |

第 3、4 列「深色區塊沒有另設」的意思：深色模式的區塊沒有重新宣告這兩個名稱，所以沿用淺色區塊的宣告值（Quill 讀 CSS 的深色區塊，找不到這兩個名稱）。

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

### 5.10 合併後線上複驗（Rigel 自報、未由第二人重跑）

來源：Rigel 的 `rigel-live-verification.md`。受測對象是 GitHub Pages 線上站，部署 commit `ef7c1ce`，Rigel 寫「第 60 次部署」。環境：Google Chrome 133.0.6943.142（headless、連公開網路）、Node.js v22.14.0。**以下全部是 Rigel 自己的報告，沒有第二人重跑，Quill 也沒有開線上站驗證；有 Quill 自行查證的項目在 5.12。**

| # | 項目 | Rigel 自報結果 | 備註 |
| --- | --- | --- | --- |
| 1 | 橫向溢位 | 12 頁、5 種寬度（1440、768、390、360、320），共 60 項，溢位 0 項（`scrollWidth` 等於 `clientWidth`） | 12 頁：首頁、11/20 日報摘要、11/20 新知識、11/20 CVE、產品總覽、OpenShift、3scale、Vault、搜尋頁、關於頁、11/19 演練歸檔、404 |
| 2 | 頭條事實欄對比（淺色） | 標籤 10.02:1、內容 17.97:1（背景 `rgb(15,23,36)`） | 與 5.3 兩位成員在 PR 分支量到的數字相同；此處是線上站 |
| 3 | 頭條事實欄對比（深色） | 標籤 7.08:1、內容 14.86:1（背景 `rgb(20,26,34)`） | 同為線上站 |
| 4 | 手機頁籤 390 寬 | 單格 89.00 x 44.00；四個頁籤切換各只顯示對應一個窗格 | 控制列寬 358px |
| 5 | 手機頁籤 360 寬 | 單格 81.50 x 44.00；切換正確 | 控制列寬 328px |
| 6 | 產品總覽篩選 | 「全部」可見 26 項；「有更新」可見 10 項 | |
| 7 | CSP 違規（Console） | 0 處（只有 `favicon.ico` 404） | |
| 8 | 外部非同源請求 | 0 個 | |
| 9 | 站內連結 | 掃 47 頁，連結 2,590 條，失效 0 | 統計範圍見附錄 A 的 D12 |
| 10 | 與本機建置比對 | 抽驗 5 頁（首頁、11/20 日報摘要、11/20 新知識、產品總覽、OpenShift）與 `main` 的 `ef7c1ce` 本機建置 byte-for-byte 相符 | 只抽 5 頁，其餘 42 頁未比對 |

Rigel 報告中的截圖（16 張）與腳本只存在他的資料夾，不在本 repo。Rigel 自述未驗證：Firefox、Safari、實體手機、螢幕閱讀器（見第 8 章）。

### 5.11 PR #28 head 重跑（Quill，PR #28 審查中）

在 PR #28 head `f89ef0f` 上，Quill 實際執行：

| # | 指令 | 實際輸出摘要 |
| --- | --- | --- |
| 1 | `npm ci --ignore-scripts` | `found 0 vulnerabilities` |
| 2 | `npm test` | tests 45、pass 45、fail 0、skipped 0 |
| 3 | `npm run check:contrast` | `CONTRAST OK: 70 CSS color pairs (light + dark)`；`CONTRAST OK: 28 Proposal C color pairs (light + dark)`（70＋28 共 98 組；Proposal C 由 26 組增為 28 組，因 PR #28 的 diff 新增 1 組 impact code 配對，乘淺深兩種模式） |
| 4 | `npm run build -- --output <空資料夾>` | `BUILD OK: 47 HTML pages; 26/26 product pages; 3 daily editions; 45 search items; 0 warnings; mode=production` |

這只證明測試、對比腳本與建置通過；PR #28 的畫面結果（CVE 規格欄 grid、行內 code 對比、浮水印）Quill 沒有看。（這是撰寫當時對 `f89ef0f` 的狀態；PR #28 後來經退修與兩輪審查，見 5.14。5.11、5.12 的數字是 `f89ef0f` 的結果，不是最終合併版。）

### 5.12 Quill 自行查證的項目（在 PR #28 head 的建置輸出上）

| # | 項目 | Quill 實際結果 | 說明 |
| --- | --- | --- | --- |
| 1 | `href` 總數 | 2,590 條（其中 `http:`、`https:`、`mailto:` 開頭 392 條；`#` 開頭純錨點 350 條；其餘相對路徑 1,848 條） | 建置輸出 47 頁，用 Python 正則 `href="..."` 計算。這是 PR #28 head 的建置，不是 `ef7c1ce`；PR #28 只改 CVE 頁的 HTML 結構，連結數預期不變，但未另外對 `ef7c1ce` 重算 |
| 2 | 「排除外連」的連結數 | 2,590 減 392 等於 2,198 | 與 Rigel 第一輪 2,198 相同，支持 Rigel 的「兩輪統計範圍不同」說明；但 2,198 包含 350 條純錨點，Rigel 寫「392 條外部/錨點」不精確（392 全是外部協定，錨點在 2,198 之內） |
| 3 | `<script>` 標籤 | 47 頁共 48 個，全部是同源 `toc.js`（47 個，每頁 1 個，含 404 頁以 `/morning-brief-archive/` 根相對路徑的 1 個）與 `search.js`（1 個，搜尋頁），全部帶 `defer`；沒有行內 script、沒有 `http(s)` 外部 script | 支持 Rigel 的「指的是無行內與外部 script」說明 |
| 4 | NGINX2Root 來源資料 | `daily/2026-11-20/meta.yaml` 的 `display.cve` 該項 `cvss: []`、`exploited: unknown` | 見 K14 |

### 5.13 `main` `2166673` 重跑（Quill 自行執行）

在 PR #28 合併後的 `main` `2166673`（本機 clone，`git fetch` 取得）上，Quill 實際執行：

| # | 指令 | 實際輸出摘要 |
| --- | --- | --- |
| 1 | `npm test` | tests 45、pass 45、fail 0、skipped 0 |
| 2 | `npm run check:contrast` | `CONTRAST OK: 70 CSS color pairs (light + dark)`；`CONTRAST OK: 28 Proposal C color pairs (light + dark)`（70＋28 共 98 組） |
| 3 | `npm run build -- --output <空資料夾>` | `BUILD OK: 47 HTML pages; 26/26 product pages; 3 daily editions; 45 search items; 0 warnings; mode=production`；輸出資料夾只有 `404.html`、`about.html`、`assets`、`build-report.json`、`daily`、`index.html`、`products`、`search`，沒有 `docs` |

另外 Quill 用 Node 以 WCAG 相對亮度公式自算 impact code 兩組配色：淺色 `#ffffff` 對 `#27303b` 為 13.36:1；深色 `#15181b` 對 `#d5dbe0` 為 12.76:1，與 5.14 引用的 Iris、Rigel 實測值相同（這是 token 值的計算，不是畫面量測）。這些只證明測試、對比腳本與建置通過，不代表畫面結果。

### 5.14 PR #28 的退修經過與審查結果

來源說明：除標「Quill」者外，以下數字與結論都是 Iris、Rigel、Vega、Lin 的回報，經 Ada 轉達；**Quill 沒有開瀏覽器量測，也沒有重跑這些量測**。

**退修經過（Iris 第一輪，針對最初的 PR #28 head `f89ef0f`）**

| # | 編號 | 問題（Iris 回報，Ada 轉達） | Lin 的修法 | 來源 |
| --- | --- | --- | --- | --- |
| 1 | B1 | 雙欄從 720px 就啟用，VMware 那則 CVE 的內容欄在 1280／1024／720 三種寬度分別只有 441／182／127px；`main`（`ef7c1ce`，float 版）為 669／410／355px。內容欄比修改前更窄 | 雙欄門檻改為 ≥1360px 才啟用（Quill 讀 `2166673` 的 CSS：`@media (min-width:1360px)`，`grid-template-columns:13rem minmax(0,1fr)`，`column-gap:1.25rem`） | Iris 回報、Ada 轉達；CSS 為 Quill 讀 |
| 2 | B2 | 手機規格欄被移到內文之後（文末）：390 寬時規格欄離標題 2,904px，`main` 為 111px | 單欄時順序為標題、規格欄、內文（Quill 讀 `display-v4.mjs`：產生順序為 `heading`、`<aside class="design-cve-rail">`、`<div class="design-cve-content">`） | Iris 回報、Ada 轉達；順序為 Quill 讀原始碼 |

退修的 commit（`98c8fe3` 之後的 `77b913b`，訊息 `fix: preserve CVE reading width and mobile score order`，2026-11-20 20:35:27，Quill 用 `git log` 讀到）改了 `design-c.css` 與 `display-v4.mjs` 兩個檔。行數：Quill 用 `git diff --numstat 98c8fe3 77b913b` 讀到 `design-c.css` +17／−5、`display-v4.mjs` +1／−1，與 Ada 轉達的 GitHub compare 一致；Rigel 曾寫 +22／+2，與兩者都不符，**不正確**（原因未說明，見附錄 A 的 D16）。

**最終數值（Iris 與 Rigel 各自量，Ada 轉達；VMware 那則 CVE，Chrome 渲染）**

| # | 視窗寬度 | 量測項目 | 數值 | 與 `main`（`ef7c1ce`）比較 |
| --- | --- | --- | --- | --- |
| 1 | 1440 | 內容欄寬 | 584px | 回報未附 main 數值 |
| 2 | 1440 | 規格欄寬 | 208px（Quill 驗算：`13rem` ＝ 208px，與 CSS 相符） | 回報未附 |
| 3 | 1440 | 規格欄左緣 | x＝556.5 | 回報未附 |
| 4 | 1360 | 內容欄寬 | 521px | 回報未附 |
| 5 | 1359 | 單欄內容欄寬 | 748px | 回報未附 |
| 6 | 1280 | 內容欄寬 | 669px | 與 main 的 669px 相同 |
| 7 | 1024 | 內容欄寬 | 410px | 與 main 的 410px 相同 |
| 8 | 單欄 | 規格欄距標題 | 12px | main 為 111px（390 寬）；退修前 2,904px |

**其他項目**

| # | 項目 | 結果 | 來源 |
| --- | --- | --- | --- |
| 1 | AI 頁「影響」區塊行內 code 對比（對應 K4） | 淺色 13.36:1、深色 12.76:1；`main` 為 1.07:1、1.02:1 | Iris 與 Rigel 各自量（Ada 轉達）；Quill 以 token 值自算 13.36、12.76 相符 |
| 2 | S12：「(Broadcom)」折行 | 整列一行 | Iris 回報、Ada 轉達 |
| 3 | S13：行內 code 內距與圓角 | 已加內距與圓角（Quill 讀 CSS：`padding:.1em .3em; border-radius:.25rem`） | Iris 回報；CSS 為 Quill 讀 |
| 4 | 關鍵字浮水印（對應 K7） | 定案為隱藏：Iris 的理由是它是 `aria-hidden` 的純裝飾，識別資訊已在規格欄與日期標籤。Quill 讀 CSS：`.v4-page .v4-keyword { display:none; }` | Iris 回報、Ada 轉達；CSS 為 Quill 讀 |
| 5 | 安全審查 | Vega 兩輪，阻擋項 0 | Vega 回報、Ada 轉達；Quill 沒有讀 Vega 報告 |
| 6 | CVE 規格欄 float 改 grid（對應 K1） | 已改：≥1360px 為 grid，以下為單欄 | 見上表與 K1 |

**關卡總表（PR #28）**

| # | 關卡 | 對象 | 誰 | 結論 | 阻擋項 |
| --- | --- | --- | --- | --- | --- |
| 1 | 設計第一輪 | `f89ef0f` | Iris | 退回（B1、B2） | 2 |
| 2 | 修正 | `77b913b` | Lin | 修 B1、B2 | — |
| 3 | 設計複驗 | 退修後版本（`77b913b` 起） | Iris | 最終數值如上（Ada 轉達）；Ada 的指派沒有寫 Iris 複驗的結論字樣，**結論措辭未驗證** | 未註明 |
| 4 | 驗證 | 退修後版本 | Rigel | 最終數值與 Iris 各自量測（Ada 轉達）；但內容欄 720／390 的量測與 Lin、Iris 不同，見 D15 | 未註明 |
| 5 | 安全審查 | 兩輪（Ada 轉達，未註明各輪對象 commit） | Vega | 阻擋 0 | 0 |

這**不是**「全部通過」：Firefox、Safari、實體手機、螢幕閱讀器仍未驗證（U7–U10 適用於 PR #28 的畫面），Quill 沒有讀各報告原檔，結論都是轉達。

### 5.15 合併後線上複驗（PR #28，`2166673`）

**Rigel 自報，未由第二人重跑。** 對象：約 21:00 部署的線上站（Static site 第 64 次部署，部署次數為 Ada 轉達，Quill 未查證）。以下數字來自 Rigel 的線上複驗，經 Ada 轉達；Quill 沒有開線上站、沒有讀 Rigel 報告原檔，只有第 4 項的本機側有自己核對（見該項）。量測環境：Chromium（Rigel 說明用 mobile emulation 的量測見 D15）。

**1. `cve.html`（VMware 那則）版面量測**（單位 px；「欄距」水平者為雙欄間距，垂直者為規格欄距標題；溢位為橫向溢位）

| # | 視窗寬度 | 內容欄寬 | 規格欄寬 | 規格欄距標題 | 標題左緣 | 清單左緣 | 溢位 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 1440 | 584 | 208 | 水平欄距 20 | 556.5 | 556.5 | 0 |
| 2 | 1360 | 521 | 208 | 水平欄距 20 | 548 | 548 | 0 |
| 3 | 1359 | 748 | 672 | 垂直 12 | 320 | 320 | 0 |
| 4 | 1280 | 669 | 669 | 垂直 12 | 320 | 320 | 0 |
| 5 | 1024 | 410.28 | 410.28 | 垂直 12 | 318.72 | 318.72 | 0 |
| 6 | 720 | 370.41 | 370.41 | 垂直 12 | 309.59 | 309.59 | 0 |
| 7 | 390 | 326 | 326 | 垂直 12 | 32 | 32 | 0 |

淺色與深色各量一次，數值相同；7 個寬度的規格欄皆在內文之前。720、390 的內容欄寬與 Lin、Iris 的量測不同，見 D15。

**2. `ai.html` 行內 code 與浮水印**

| # | 項目 | Rigel 自報結果 |
| --- | --- | --- |
| 1 | 淺色行內 code | 文字 `#ffffff` 於 `#27303b`，13.36:1（Quill 以 token 值自算相符，見 5.13） |
| 2 | 深色行內 code | 文字 `#15181b` 於 `#d5dbe0`，12.76:1（Quill 自算相符） |
| 3 | `.v4-keyword` 的 `display` | `none` |

**3. 溢位抽驗**（`innerWidth`／`clientWidth`／`scrollWidth`；溢位 0）

| # | 頁面 | 1440 寬 | 390 寬 |
| --- | --- | --- | --- |
| 1 | 首頁 | 1440／1425／1425 | 390／390／390 |
| 2 | 日報摘要 | 1440／1425／1425 | 390／390／390 |
| 3 | 產品總覽 | 1440／1425／1425 | 390／390／390 |
| 4 | OpenShift 產品頁 | 1440／1425／1425 | 390／390／390 |

**4. 線上與 `main` `2166673` 本機建置的位元組比對**

| # | 檔案 | 大小 | SHA-256 前 8 碼 | Rigel 自報比對結果 | Quill 本機建置側核對 |
| --- | --- | --- | --- | --- | --- |
| 1 | `cve.html` | 19,798 B | `c2de35c7` | 相符 | Quill 在 `2166673` 本機建置的 `daily/2026-11-20/cve.html`：19,798 B、`c2de35c7`，與 Rigel 回報相同 |
| 2 | `ai.html` | 14,090 B | `fad3beb1` | 相符 | Quill 本機建置：14,090 B、`fad3beb1`，相同 |
| 3 | `design-c.css` | 12,643 B | `7bc4409b` | 相符 | Quill 本機建置：12,643 B、`7bc4409b`，相同 |

Quill 只核對了「本機建置的大小與雜湊與 Rigel 回報一致」；**線上檔案本身 Quill 沒有下載比對**，所以「線上與本機相符」仍是 Rigel 自報。

**5. 截圖**：Rigel 回報 6 張（`cve.html` 在 1440、1359、390 各淺色、深色一張）；截圖只存在 Rigel 的工作資料夾，不在本 repo，Quill 沒有看過，本文件不放檔案路徑。

**範圍**：只涵蓋上列 Chromium 量測。Firefox、Safari、實體手機、螢幕閱讀器仍未驗證（U7–U10）。

### 5.16 PR #30：補 11/20 的 CVSS 與利用現況（open、未合併，Rigel 驗證中）

- 範圍（Quill 用 `git diff 3955780 e7fd94a` 自行讀取）：2 個檔，+27／−4。`daily/2026-11-20/meta.yaml` +25／−4；`SPEC.md` +2。本文件不動這兩個檔。
- 決定來源：George 於 2026-11-20 21:18 裁示「補起來，之後 build 吧」（Ada 轉達）。
- 值的查證來源：Scout 開原廠、CVE.org、NVD 頁面查證（Scout 自報，Quill 沒有重新開這些頁面）。Quill 只核對 PR 內 `meta.yaml` 的值與下表相同。

#### 5.16.1 NGINX2Root（CVE-2026-123007）補入的值

| # | 欄位 | 補入值 | 來源（Scout 自報） | Quill 核對 PR 內檔案 |
| --- | --- | --- | --- | --- |
| 1 | `cvss` 第 1 項 | 8.1，version `3.1`，source Red Hat | Red Hat | 相符 |
| 2 | `cvss` 第 2 項 | 8.1，version `3.1`，source F5 | F5 | 相符 |
| 3 | `cvss` 第 3 項 | 9.2，version `4.0`，source F5 | F5 | 相符 |
| 4 | `cvss` 第 4 項 | 8.1，version `3.1`，source SUSE | SUSE | 相符 |
| 5 | `cvss` 第 5 項 | 9.2，version `4.0`，source SUSE | SUSE | 相符 |
| 6 | `exploited` | `poc`（原為 `unknown`） | Scout 自報；頭條 `attention.facts` 原本即寫「PoC 已公開」 | 相符 |

#### 5.16.2 Java4Shell 後續（CVE-2026-114938）補入的值

| # | 欄位 | 補入值 | 來源（Scout 自報） | Quill 核對 PR 內檔案 |
| --- | --- | --- | --- | --- |
| 1 | `cvss` 第 1 項 | 9.8，version `null`，source Red Hat | Red Hat；來源向量為 CVSS 3.0，而 SPEC 只允許 `3.1`、`4.0`、`null`，所以 version 填 `null` | 相符 |
| 2 | `cvss` 第 2 項 | 8.1，version `3.1`，source Oracle | 以 CVE.org 紀錄為準；Scout 沒有逐列讀 Oracle Risk Matrix | 相符 |
| 3 | `exploited` | `poc`（原為 `unknown`） | Scout 自報 | 相符 |
| 4 | `exploited_detail` | 保留原值「開始出現攻擊嘗試」，未改 | 「攻擊嘗試」只出自 SecurityWeek 報導；原廠與 CISA 未確認，所以 `exploited` 不填 `confirmed` | 相符（該行未出現在 diff 內） |

#### 5.16.3 Scout 查證的限制（逐項，皆為 Scout 自報、Quill 未獨立查證）

| # | 項目 | 狀況 |
| --- | --- | --- |
| 1 | CISA KEV（2026-11-18 版） | 兩個 CVE 都未列入 |
| 2 | 日報寫的「Calif 自評 4.0 9.2」 | Scout 沒有開頁面核對，未列入 `cvss` |
| 3 | 日報寫的「F5 表示沒有實際攻擊的報告」 | Scout 在 F5 頁面找不到此句，出處未確認 |
| 4 | 日報 `products.md` 寫 F5 的 9.2「取自 Tenable」 | F5 自己的 K000163926 即有此分數，所以 `cvss` 的 source 寫 F5 |
| 5 | Java4Shell 的 Oracle 8.1 | 以 CVE.org 紀錄為準，沒有逐列讀 Oracle Risk Matrix |
| 6 | Java4Shell 的 `exploited` 為何不是 `confirmed` | 只有 SecurityWeek 一個來源，見 5.16.2 第 4 列 |

#### 5.16.4 `SPEC.md` 新增規則

- 位置：`display.cve` 欄位表之後（Quill 讀 diff：第 377 行附近）。
- 內容摘要：同一 CVE 同時列入頭條與 CVE 清單時，已查證的 CVSS 與利用現況要同步填入清單的 `display.cve[].cvss`、`display.cve[].exploited`，以及頭條的 `attention.facts` 或 `attention.summary`；逐一保留分數來源；只有來源未提供對應資訊時，才使用 `[]` 或 `unknown`。
- 限制：02:00 排程實際使用的 prompt 不在本 repo 內，Quill 沒有核對。**「排程是否照此規則產出」未驗證**。

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
| 6 | token 記錄：S5 | Iris | 7 個新 token（5 個來自 PR #27、2 個來自 PR #28）尚未同步到 `shared/tokens.css`；該檔不在本 repo，Quill 未建立；定義暫記於 4.2 |
| 7 | 既有問題：S11 | Lin、Iris | 已於 PR #28 處理（淺 13.36:1、深 12.76:1，見 5.14）；S2（第 4 列）亦已於 PR #28 改為 grid |
| 8 | 同源 JS | George 決定 | 若目標是完全無 JS，要另開工作處理 `toc.js` 與 `search.js`（Vega I1） |
| 9 | 資料壞掉的處理 | 沿用既有決定 | meta.yaml 缺欄位或某天資料夾不完整時建置會失敗、整站停更、不發布壞資料（GeorgeAI 決定）；PR #27 沒有改這個行為（`build.mjs` 內相關檢查維持） |
| 10 | 部署 | 合併後 | 合併到 main 會觸發既有的 Pages 工作流程；本 PR 沒改 workflow；合併後的線上結果要另行驗證 |
| 11 | PR #30 驗證與合併 | Rigel 驗證；Leader 合併 | PR #30（head `e7fd94a`）撰寫當時 open、未合併，Rigel 驗證中；合併後要補本文件 5.16、K21、第 9 章，並驗證建置後 CVE 清單與日報頁的顯示與部署結果；現在都未驗證 |
| 12 | 日報摘要頁 26 格產品磚（K17） | George 決定 | 本輪不動，George 尚未回覆；回覆前不排工作 |
| 13 | 排程規則同步 | George 決定、排程維護者 | `SPEC.md` 新規則是否要同步到 02:00 排程的 prompt；prompt 不在本 repo，未核對 |

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
| U24 | 線上站實測（5.10） | Rigel | 全部為 Rigel 自報、未由第二人重跑；Quill 沒有開線上站。U11 的「GitHub Pages 部署與線上頁面」因此變成「有 Rigel 單人自報，未獨立驗證」，不是「已驗證」 |
| U25 | 附錄 A 的 D11（`:has()` 高度） | Rigel | Rigel 說第二輪 4806px 是誤記、兩個 head 重跑都是 5549px；Quill 本機有 Chrome，但未重跑此量測，**未驗證** |
| U26 | PR #28 的畫面結果 | Iris、Rigel、Vega（Ada 轉達） | CVE 規格欄 grid、行內 code 對比、浮水印隱藏：已合併；畫面數值為 Iris、Rigel 回報，Quill 只讀 diff、自算 token 對比值並重跑 `main` 的測試，**沒有看畫面**（5.13、5.14）。Firefox、Safari、實體手機、螢幕閱讀器仍未驗證 |
| U28 | PR #28 合併後線上複驗（5.15） | Rigel | Rigel 自報，未由第二人重跑；Quill 沒有開線上站、沒有下載線上檔案比對，只核對本機建置的大小與雜湊與 Rigel 回報相同；第 64 次部署成功為 Ada 轉達，Quill 未查證；僅限 Chromium，6 張截圖 Quill 未看 |
| U29 | Rigel、Iris、Vega 對 PR #28 的報告原檔 | Quill | 5.14 的數字與結論都是 Ada 轉達，Quill 沒有讀報告原檔 |
| U27 | 抽驗以外 42 頁的線上內容與本機建置是否一致 | Rigel | 只抽 5 頁 |
| U30 | PR #30 補入的 CVSS 與利用現況是否正確（5.16） | Scout（自報） | 值由 Scout 查證原廠、CVE.org、NVD；Quill 只核對 PR 內檔案與回報相同，沒有開這些來源頁面。Oracle 8.1 沒逐列讀 Risk Matrix；Java4Shell 的「攻擊嘗試」只有 SecurityWeek 一個來源；Calif 4.0 9.2 與 F5 的「沒有實際攻擊的報告」出處未確認 |
| U31 | PR #30 建置後的頁面、驗證與部署 | Rigel、Quill | Rigel 驗證中；Quill 未在 `e7fd94a` 重跑建置，建置後的 CVE 清單顯示與部署都未驗證。PR 未合併 |
| U32 | 02:00 排程是否照 `SPEC.md` 新規則產出 | Quill | 排程 prompt 不在 repo 內，未核對，未驗證 |

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
| K14 | NGINX2Root（CVE-2026-123007）在首頁與日報的 CVE 清單顯示「CVSS 未提供」與「攻擊現況未寫明」，但同頁頭條事實欄寫 CVSS 3.1 8.1 與「PoC 已公開」。原因是來源資料：`daily/2026-11-20/meta.yaml` 的 `display.cve` 該項為 `cvss: []`、`exploited: unknown`，頭條事實來自另一個區塊 `attention.facts`（兩處各自獨立填寫）。這不是顯示程式的問題；內容檔沒有改 | Lin 與 Rigel 各自查到相同結論（Ada 轉達）；Rigel 報告附行號；Quill 讀 `meta.yaml` 確認該項 `cvss: []`、`exploited: unknown`，Quill 沒有重做顯示程式邏輯的追查 | 原為「待 George 決定」；George 已裁示補值，PR #30 已開（open、未合併、Rigel 驗證中），見 K21、5.16 |
| K15 | 同檔 `display.cve` 的另一項「Java4Shell 後續」（CVE-2026-114938）也是 `cvss: []`、`exploited: unknown`（另有 `exploited_detail`）。Quill 讀 `meta.yaml` 時看到，沒有人報告過 | Quill 觀察；顯示效果未在畫面上確認 | 與 K14 同一類來源資料問題；原為併入 George 的決定，現併入 PR #30（open、未合併），見 K21、5.16 |
| K16 | PR #28 處理三項，已於 `2166673` 合併（原先標「審查中」，現更新為實際結果）：(1) CVE 規格欄由 float 改 grid（對應 K1）：≥1360px 為雙欄，以下單欄、順序為標題、規格欄、內文；經 B1、B2 退修後，最終數值見 5.14。(2) AI 頁「影響」區塊行內 code（對應 K4）：淺色 13.36:1、深色 12.76:1（Iris、Rigel 各自量；Quill 以 token 值自算相符），原 `main` 為 1.07:1、1.02:1。(3) 關鍵字浮水印（對應 K7）：定案為隱藏（`.v4-page .v4-keyword { display:none; }`），Iris 理由為 `aria-hidden` 純裝飾、識別資訊已在規格欄與日期標籤。Iris 的 S12、S13 也已處理 | Iris、Rigel、Vega 回報（Ada 轉達）；Quill 讀 `2166673` 的 CSS 與 diff、重跑測試 | 已合併；**Chromium 線上已由 Rigel 自報驗證（5.15，未由第二人重跑）；Firefox、Safari、實機、螢幕閱讀器仍未驗證**（U7–U10、U26、U28）；K1、K4、K7 的原文是合併前狀態，以本列為準 |
| K17 | 日報摘要頁仍是 26 格同尺寸方塊（K2）；PR #28 沒有處理 | Quill 讀 `2166673` 對 `ef7c1ce` 的檔案清單（只動 `design-c.css`、`contrast.mjs`、`display-v4.mjs` 與本文件） | 未處理；PR #30 這一輪同樣不動，列為待決（George 尚未回覆，Ada 轉達） |
| K18 | S14：長 CVE 編號在窄欄於連字號處折行 | Iris（Ada 轉達） | 已知限制，本輪不做 |
| K19 | S15：1200–1359px 為單欄，規格欄寬 672px，比內文欄 748px 窄 | Iris（Ada 轉達） | 已知限制，本輪不做 |
| K20 | S16：1360–1439px 雙欄時內容欄 521px 偏緊，門檻可改為 1440 | Iris（Ada 轉達）；521px 為 1360 寬實測 | 已知限制，本輪不做 |
| K21 | NGINX2Root 與 Java4Shell 後續的 `meta.yaml` 內容（K14、K15） | Quill、Lin、Rigel（原列）；George 裁示（Ada 轉達） | 原為「待 George 決定」，現更新：George 已於 2026-11-20 21:18 裁示補值，PR #30（head `e7fd94a`）已開。**撰寫當時 PR #30 為 open、未合併，Rigel 驗證中；建置後頁面與部署均未驗證**。補入的值與查證限制見 5.16。本文件仍不動 `daily/`、`SPEC.md`、`site/`（變更在 PR #30 內） |

---

## 9 變更紀錄

只往後加，不改舊列。

| 日期 | 誰 | 變更 | 來源 |
| --- | --- | --- | --- |
| 2026-11-20 | Quill | 新增本文件：PR #27（方案 C Phase 2）實作紀錄；兩輪三關審查、B1／B2 與 Lin 的修正、已知限制、未驗證項目、資料不一致列表 | Ada 轉達 George「採用方案 C」；數字與結論來源見各章 |
| 2026-11-20 | Quill | 補記：PR #27 於 20:07:22 以 squash 合併為 `ef7c1ce`，Static site 第 60 次部署成功（部署次數為 Rigel 報告與 Ada 轉達，Quill 未獨立查證）；PR #27 說明寫 24 組配色，head 實際 26 組，說明未更新。新增 4.2（token）、5.10（線上複驗，Rigel 自報）、5.11（PR #28 head 重跑）、5.12（Quill 自查）、K14–K17、U24–U27、附錄 A 的 D11–D13。PR #28 審查中 | Ada 轉達；`git log`；Rigel 的 `rigel-live-verification.md` |
| 2026-11-20 | Quill | PR #28 後續補記：PR #28 於 20:51:40 以 squash 合併為 `2166673`，第 64 次部署成功（Ada 轉達，Quill 未查證）；記 Iris 第一輪 B1、B2 退修、Lin 改為 ≥1360px 才雙欄、最終數值與 Vega 兩輪阻擋 0（皆回報、Ada 轉達，見 5.14）；新增 5.13（Quill 在 `2166673` 重跑 45/45、98 組、47 頁、0 警告）、5.15（線上複驗，待 Rigel 回報，未驗證）；更新 4.2（`shared/tokens.css` 不在本 repo，7 個 token 定義記於本文件）、K16（由審查中改為已合併）、K18–K21、U26、U28、U29、附錄 A 的 D14–D16；第 7 章第 6、7 列同步 | Ada 轉達；Quill 讀 `git log`、`git diff`、CSS 與重跑輸出 |
| 2026-11-20 | Quill | PR #28 線上複驗補記（接續上一列，不改上一列）：5.15 由「待複驗」改為 Rigel 自報的線上複驗結果（cve.html 七個寬度版面量測、ai.html 行內 code 與浮水印、溢位抽驗、位元組比對，標「Rigel 自報，未由第二人重跑」）；D15 補 Rigel 的捲軸說明（標未獨立驗證）；K16、U28 與第 1 列後續狀態同步；上一列中「線上複驗（待 Rigel 回報，未驗證）」之處以本列為準。S14–S16、K21 與 `daily/` 未動 | Ada 轉達 Rigel；Quill 核對本機建置的大小與雜湊 |
| 2026-11-20 | Quill | PR #30 補記：George 於 21:18 裁示補值（「補起來，之後 build 吧」，Ada 轉達）；PR #30（head `e7fd94a`，base `3955780`，Lin 開）補 `daily/2026-11-20/meta.yaml` 的 NGINX2Root（CVE-2026-123007）與 Java4Shell 後續（CVE-2026-114938）的 `cvss`、`exploited`，並在 `SPEC.md` 加一條規則。新增 5.16、第 7 章第 11–13 列、U30–U32；K14、K15、K21 由「待決」改為實際結果，K17 標待決；PR #30 撰寫當時 open、未合併、Rigel 驗證中，建置後頁面與部署未驗證。S14–S16、`daily/`、`SPEC.md`、`site/` 在本文件的提交中未動 | Ada 轉達；Scout 自報（值的查證）；Quill 讀 `git diff 3955780 e7fd94a` |

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
| D11 | D1 的更新：`:has()` 失效時首頁高度 | Rigel（線上複驗報告）：第二輪的 4806px 是誤記，重跑 `f1dd64c` 與 `e741e0e` 的本機建置，兩者實測都是 5549px；原因是第二輪腳本漏傳 `scrollHeight`，表格誤填歷史草稿值 | Rigel 原報告檔仍並列 5549、4806；設計規格原型另寫 4802 | **Rigel 說明，未獨立驗證。** Quill 沒有重跑；若說法成立，4806 應作廢，但他的第二輪報告原檔沒有更正。4802（原型）仍是另一個獨立數字，沒有人說明 |
| D12 | D6 的更新：站內連結 2,198 對 2,590 | Rigel：第一輪只計排除外連的內部連結（2,198），第二輪計全部 `href`（2,590，含 392 條外部/錨點） | Quill 在 PR #28 head 建置輸出自算：全部 `href` 2,590、`http(s):`／`mailto:` 392、排除外連 2,198（含純錨點 350 條） | **兩個總數 Quill 查證相符**，「統計範圍不同」成立；Rigel 對 392 的描述不精確（392 全是外部，錨點在 2,198 內）。查證對象是 PR #28 head 的建置，不是 `ef7c1ce` |
| D13 | D3 的更新：「script 0」 | Rigel：他指的是「無行內 script、無外部 http script」，同源 `toc.js`、`search.js` 本來就在 | Quill 在 PR #28 head 建置輸出：48 個 script 標籤，皆為同源、帶 `defer` 的 `toc.js`（47）與 `search.js`（1），無行內、無外部 | **Quill 查證：Rigel 的說明與事實相符**；他第二輪報告原文寫「0」的措辭仍不精確，這是他自己承認的表述問題 |
| D14 | D11 的再更新：`:has()` 失效時首頁（390 寬）高度 5549px 的原因 | Rigel 在 PR #27 第二輪（線上複驗說明）：4806px 是漏回傳 `scrollHeight`、誤填舊草稿數值。Rigel 在 PR #28 審查時：是推算 section top 偏移的中間數值誤植 | Rigel 在 PR #28 head 重跑，`:has()` 失效首頁 390 寬 `scrollHeight` 為 5549px（Ada 轉達）；原型 4802px 仍無人說明 | **原因不明，5549px 為實測值。** Rigel 前後兩種說法不同，兩種都沒有證據（Quill 沒有讀到腳本或原始輸出），也沒有重跑。以 5549px 為準，4806px 視為不可採信 |
| D15 | 內容欄寬：720 與 390 寬 | Rigel 線上量（`div.design-cve-content`，`getBoundingClientRect` 與 `clientWidth`，border-box、無 padding）：720 為 370.41px、390 為 326px | Lin 與 Iris：355.1px、310.7px（Ada 轉達） | 兩者差在 720、390 皆為 15.3px。Rigel 說明：他用 Chromium mobile emulation（浮動捲軸不佔版面），Lin 與 Iris 用桌面視窗（15.3px 實體捲軸）。**Rigel 說明；差值與捲軸寬度吻合，但沒有人在同一環境切換捲軸驗證，仍標未獨立驗證**，不寫成已確認。Quill 沒有重跑，不自行擇一。其餘寬度（1440、1360、1359、1280、1024）的數字不受影響 |
| D16 | `98c8fe3..77b913b` 的行數 | Rigel 曾寫：`design-c.css` +22、`display-v4.mjs` +2（Ada 轉達） | GitHub compare（Ada 轉達）：`design-c.css` +17／−5、`display-v4.mjs` +1／−1；Quill 用 `git diff --numstat 98c8fe3 77b913b` 讀到相同的 17／5 與 1／1 | **Quill 查證：GitHub 的數字正確，Rigel 的 +22／+2 不正確。** 原因未說明 |
