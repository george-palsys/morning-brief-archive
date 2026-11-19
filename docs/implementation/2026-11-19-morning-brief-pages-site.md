# 實作紀錄：晨報 GitHub Pages 靜態網站（PR #7，含後續 PR #8–#13 與 Pages 啟用）

- 紀錄日期：2026-11-19（Asia/Taipei）
- 撰寫：Quill（文件撰寫）。這是團隊「每次實作都要留文件」新規則的第一份紀錄。
- 對象：`george-palsys/morning-brief-archive` 的 PR #7（分支 `feat/static-morning-brief-site`）；後續修正為 PR #8（分支 `fix/site-design-review-r1-r9`）；PR #9 為本文件第一版的文件 PR；PR #10 為本文件第二版的文件 PR；PR #11 為低風險小修（已合併）；PR #12 為本文件第三版的文件 PR（已合併）；PR #13 為關於頁與無障礙小修（三方審查通過，尚未合併）。
- 紀錄狀態（2026-11-19 19:49 更新，全部為各人回報、Ada 轉達，我沒有自行重跑或連線）：PR #11 已合併（merge commit `4aa9df967884d0c2271eb60505ee9ab1fc76f92b`）、PR #12（本文件第三版）已合併（merge commit `7016ff829185042332ec72124908bac14f2b200c`，GeorgeAI 回報）；Rigel 對 PR #11 的驗證與對 PR #12 的審查皆通過；首次自動部署成功（run `44516322502`，19:36:46 deploy success，GeorgeAI 回報）；`github-pages` environment 的 `can_admins_bypass` 已於 19:36 改為 false（George 裁示「關掉」，GeorgeAI 操作並讀回）；PR #13（關於頁與無障礙小修）三方審查通過、尚未合併；仍未驗證的項目見第 8 章。以下是 19:19 版的狀態，保留作為歷史，其中「PR #11 尚未合併」「Rigel 的審查尚未回報」已被上述內容取代：
- 紀錄狀態（2026-11-19 19:19 更新）：GitHub Pages 已於 19:06–19:08 由 GeorgeAI 啟用（George 於 19:06 核准「開」），網址 `https://george-palsys.github.io/morning-brief-archive/`；PR #10 已於 18:58:24 合併；PR #11 尚未合併。19:18 起自動部署已開（repo 變數 `PAGES_DEPLOY_ENABLED` 讀回值為 true，GeorgeAI 回報；首次自動部署尚未實際跑過，**未驗證**）；Vega 對 PR #11 的安全審查已完成，四項全通過（Vega 回報，未自行重查），Iris 對 PR #11 的設計審查已回報：設計上可合併、無擋合併項目（Iris 回報，Ada 轉達）；Rigel 對 PR #11 的審查尚未回報。以下是 18:48 版的狀態，保留作為歷史：PR #7 已於 18:18 由 GeorgeAI 合併（依 Leader 自行合併規則）；PR #9 於 18:47:00、PR #8 於 18:47:14 合併（由 Lin 以連線的 GitHub 操作，見第 4 章）；Pages 當時尚未開啟。本文件第一版撰寫時 PR #7 仍是 open。合併資訊與 PR #8 的三方審查結果都是 Ada 轉達（Lin 讀回、各審查者自述），我沒有另外查詢，也沒有讀到 PR #8 審查者的原始報告。本文件只記錄已發生的事，沒有新增任何實測（19:15 更新增補的 Pages 啟用與上線驗證，也全部來自 Ada 轉達 GeorgeAI、Rigel、Vega、Iris 的回報，我沒有自行查詢）；未驗證的部分都列在第 8 章。
- 資料來源：實作交接（Lin）、獨立驗證報告（Rigel）、設計規格（Iris）、設計審查（Iris）、安全基線（Vega）、安全審查（Vega），共六份文件；19:15 更新另引用 Rigel、Vega、Iris 對真實網址的驗證結果（Ada 轉達，我沒有讀到原始報告）。本文件第 1–5.6 節的數字與指令來自這六份文件；撰寫時我另外對照了 repo 上的 PR 內容（workflow、`package.json`、`site/build.mjs`），有出入的地方列在第 5.5 節，沒有自行挑一邊。PR #8、PR #9 的事實來自 Ada 的轉達（見上）。

---

## 1 目的與範圍

**目的**：把每天產生的晨報（Markdown）轉成一個純靜態網站，之後可以發布到 GitHub Pages，讓讀者用瀏覽器看每日晨報、26 項產品現況與搜尋。

**範圍內**：

- 純靜態網站產生器（Node.js），輸入是 repo 內的 `README.md`、`daily/`、`products/`、`products.yaml`、`items.jsonl`。
- 每日晨報導覽、26 個產品頁、舊版單檔（`daily/2026-11-19.md`）提示、缺資料狀態、按月搜尋、系統深淺色。
- 安全設計：Markdown 內的原始 HTML 一律跳脫、連結過濾、內容安全政策（CSP，meta 形式）、不載入任何外部資源、套件版本固定並附 lockfile。
- GitHub Actions workflow：建置、測試、上傳 Pages 產出；部署預設關閉。

**範圍外（這次沒有做，且被明確禁止）**：

- PR #7 當時沒有開啟 GitHub Pages；實作者（Lin）沒有合併 PR #7，合併由 Leader 在審查後另行執行（見第 4 章）。截至 2026-11-19 18:48，Pages 仍未開啟；後來 GeorgeAI 於 19:06–19:08 啟用（George 19:06 核准「開」，Ada 轉達；見第 4 章與 5.8）。
- PR #8（設計審查 R1–R9 修正）是 PR #7 合併後才做的後續修正，範圍見第 4 章；R10 維持現狀。
- 沒有修改 repo 可見度、分支保護、Actions 設定。
- 沒有修改 `SPEC.md` 與三個晨報排程（02:00、07:30、08:00）。
- 沒有把正式的 `daily/` 或 `products/` 內容放進 PR；演練資料只放在 `site/fixtures/preview.json`。
- 手動三態主題切換、列印樣式是選配，沒有實作；網站目前只跟隨系統深淺色。

**與本文件相關的邊界**：本文件放在 `docs/implementation/`，網站產生器只讀 `README.md`、`daily/`、`products/`、`products.yaml`、`items.jsonl`，不讀 `docs/`，所以本文件不會被發布到網站。這是我對照 PR #7 的 `site/build.mjs` 讀碼確認的，沒有實際建置驗證。

---

## 2 環境與版本

| 項目 | 內容 | 來源 |
| --- | --- | --- |
| Repo | `george-palsys/morning-brief-archive`，公開（public） | Vega 安全基線（2026-11-19 17:28 查詢） |
| PR | #7，分支 `feat/static-morning-brief-site`；第一版撰寫時為 open、未合併，之後已合併（見第 4 章） | 撰寫時我匿名查詢 GitHub API；合併資訊見第 4 章 |
| PR #8 | 分支 `fix/site-design-review-r1-r9`，已於 2026-11-19 18:47:14 合併；鎖定 head `ca47117c6b2ac9452a18cd88d071bfa14219dcf5` | Ada 轉達（Lin 讀回）；詳見第 4 章 |
| PR #9 | 本文件第一版的文件 PR，已於 2026-11-19 18:47:00 合併；鎖定 head `60a39525ee966cee0c249007cc4dabd659cc9bf4` | Ada 轉達（Lin 讀回）；詳見第 4 章 |
| PR commit | `b2ed6f63d76c5ac3ddd8c11c57a2f922fae1dab2` | Lin 交接、Rigel、Vega、Iris 一致；撰寫時 API 回傳的 head 相同 |
| base（main） | `1238c9f294cb9276f3d422abd96d67092ced267f` | Lin 交接；撰寫時 API 回傳的 base 相同 |
| PR 規模 | 14 個新增檔、847 行新增、0 行刪除 | Lin 交接；Rigel 逐檔行數加總為 847；撰寫時 API 回傳相同 |
| Lin 本機環境 | Windows PowerShell，Node.js v25.8.2，npm 11.11.1 | Lin 交接 |
| `package.json` 的 `engines` | `node >=22` | 我讀 PR 內 `package.json` |
| CI 環境 | `runs-on: ubuntu-24.04`，`setup-node` 的 `node-version: '24'` | 我讀 PR 內 `.github/workflows/pages.yml`；Rigel 報告的 CI 描述與此一致 |
| 直接相依套件 | `markdown-it` 15.0.3、`yaml` 2.9.1（版本固定，無 `^`、`~`） | Vega 第 3 項；我讀 PR 內 `package.json` |
| lockfile | `package-lock.json`，`lockfileVersion` 3，8 個套件，皆有 `sha512` integrity | Vega 第 3 項 |
| 設計審查瀏覽器 | 本機 Chrome 157（headless） | Iris 設計審查 |
| 360px 驗證瀏覽器 | 本機 Headless Chrome（Playwright，360 x 800） | Rigel 驗證報告 |

8 個套件逐一列出（Vega 第 3 項）：

| 套件 | 版本 |
| --- | --- |
| argparse | 3.0.4 |
| entities | 8.1.0 |
| linkify-it | 6.1.0 |
| markdown-it | 15.0.3 |
| mdurl | 2.1.0 |
| punycode.js | 2.3.1 |
| uc.micro | 3.0.0 |
| yaml | 2.9.1 |

workflow 內四個第三方 action 都用完整 commit SHA 釘選（Vega 第 2 項以 `git ls-remote` 對照 tag，逐項相符）：

| action | 釘選的 SHA | 註解版本 | 目前最新版本（Vega 查詢時） |
| --- | --- | --- | --- |
| actions/checkout | `d23441a48e516b6c34aea4fa41551a30e30af803` | v6.1.0 | v7.0.1 |
| actions/setup-node | `249970729cb0ef3589644e2896645e5dc5ba9c38` | v6.5.0 | v7.1.0 |
| actions/upload-pages-artifact | `7b1f4a764d45c48632c6b24a0339c27f5614fb0b` | v4.0.0 | v5.0.0 |
| actions/deploy-pages | `d6db90164ac5ed86f2b6aed7e0febac5b3c0c03e` | v4.0.5 | v5.0.1 |

---

## 3 實際步驟與完整指令

本章的指令來自 Lin 交接與 Rigel 驗證報告，是他們實際執行過的指令；我沒有重新執行。指令一行一個。

### 3.1 設計與規格（Iris）

1. 讀 `main` 的 `SPEC.md`、`README.md`、`daily/2026-11-19.md`、`products.yaml`，以及分支 `preview-v2-2026-11-19` 的 v3 演練資料。
2. 產出設計規格（頁面清單與網址、首頁與導覽、手機優先版面、淺深色、設計 token、狀態標示、無障礙），並附「Iris 設計審查清單」37 項，供實作後逐項檢查。
3. 規格的前提：網站掛在子路徑 `/morning-brief-archive/` 下，所以站內連結一律用相對路徑；不引入外部 CDN、字型、追蹤腳本。

### 3.2 實作（Lin）

1. 以 Node.js 寫靜態網站產生器 `site/build.mjs`，搭配 `site/assets/`（CSS、搜尋、目錄 JS）。
2. 寫 11 項自動測試 `site/test.mjs`、36 組色彩對比檢查 `site/contrast.mjs`。
3. 寫 workflow `.github/workflows/pages.yml`：頂層只有 `contents: read`；只有 `deploy` job 取得 `pages: write`、`id-token: write`；部署預設關閉。
4. 發佈 PR #7，沒有觸發互動式 git 登入，發布使用已連結的 GitHub 帳號（Lin 交接）。

### 3.3 同一 commit 的本機驗證（Lin 實跑，Windows PowerShell）

```powershell
npm ci --ignore-scripts
```

```powershell
npm test
```

```powershell
npm run check:contrast
```

```powershell
npm run build -- --output _site-delivery
```

```powershell
(Get-ChildItem -LiteralPath _site-delivery/products -Filter *.html -File | Where-Object Name -ne index.html).Count
```

Lin 回報的實際輸出摘要：

```text
added 8 packages, and audited 9 packages in 2s
found 0 vulnerabilities
tests 11
pass 11
fail 0
CONTRAST OK: 36 CSS color pairs (light + dark)
BUILD OK: 33 HTML pages; 26/26 product pages; 1 daily editions; 9 search items; 0 warnings; mode=production
26
```

### 3.4 獨立驗證（Rigel 實跑，匿名 clone）

```powershell
$env:GCM_INTERACTIVE = "never"
```

```powershell
$env:GIT_TERMINAL_PROMPT = "0"
```

```powershell
git clone --no-tags https://github.com/george-palsys/morning-brief-archive.git clean-clone-pr7
```

```powershell
git -C clean-clone-pr7 fetch origin feat/static-morning-brief-site preview-v2-2026-11-19 main
```

```powershell
git -C clean-clone-pr7 checkout b2ed6f63d76c5ac3ddd8c11c57a2f922fae1dab2
```

```powershell
npm --prefix clean-clone-pr7 ci --ignore-scripts
```

```powershell
npm --prefix clean-clone-pr7 test
```

```powershell
npm --prefix clean-clone-pr7 run check:contrast
```

```powershell
npm --prefix clean-clone-pr7 run build -- --output clean-clone-pr7\_site-run1
```

```powershell
npm --prefix clean-clone-pr7 run build -- --output clean-clone-pr7\_site-run2
```

之後 Rigel 比對兩次建置的 40 個產出檔 SHA-256，差異為 0；並用自寫稽核腳本與 Playwright 做連結與 360px 驗證（腳本沒有進 repo）。

### 3.5 設計審查（Iris）與安全審查（Vega）

- Iris：匿名 clone、`npm ci --ignore-scripts`、演練建置與正式建置各一次，用本機靜態伺服器（掛在 `/morning-brief-archive/` 子路徑，找不到的路徑回 `404.html`，模擬 Pages）與 headless Chrome 157，在 360 x 800、1280 x 900、淺色與深色下共 88 次載入，逐項檢查 37 項。
- Vega：先設 `GCM_INTERACTIVE=never`、`GIT_TERMINAL_PROMPT=0`，git 一律加 `-c credential.helper=` 匿名操作；八項審查包含 workflow、SHA 釘選、相依套件、內容過濾（自造 40 種惡意輸入）、外部資源、CSP、機密掃描（gitleaks v8.30.1）、repo 設定。

### 3.6 PR 之後尚未執行的步驟（啟用 Pages 前）

這些都是 Vega 與 Iris 的建議，**沒有任何一項已經做**。順序依 Vega 審查報告：

| 順序 | 設定 | 對應發現 |
| --- | --- | --- |
| 1 | 開 secret scanning 與 push protection | 8-M1 |
| 2 | Actions：`sha_pinning_required` 設為 true；`allowed_actions` 改為 `selected`，只允許 `actions/*`；fork PR 核准改為 `all_external_contributors` | 8-M2、1-L5 |
| 3 | 先決定 07:30 備份的走法（方案 A 或 B），再替 `main` 建 ruleset | 8-H1 |
| 4 | 合併 PR #7（走 PR，由 Leader 合併） | — |
| 5 | Pages publishing source 設為 GitHub Actions；`github-pages` environment 的 Deployment branches 只允許 `main`；開啟 Enforce HTTPS | 1-F |
| 6 | 手動執行 `workflow_dispatch` 並設 `deploy=true` 做第一次部署，確認網站正常後再設 `PAGES_DEPLOY_ENABLED=true` | 1 |

（更新 19:15：第 4 步「合併 PR #7」已完成；第 5 步中的 Pages 來源 GitHub Actions、Enforce HTTPS、`github-pages` environment 僅允許 `main` 已完成（GeorgeAI 操作；environment 為 Vega 匿名讀回）；第 1 步的 secret scanning 與 push protection 已開（GeorgeAI 讀回，Vega 無認證讀不到，標未驗證）；第 6 步的手動部署已做（run `44511889159` 成功），`PAGES_DEPLOY_ENABLED` 已於 19:18 設為 true（GeorgeAI 回報讀回值），因此第 6 步的「設定 `PAGES_DEPLOY_ENABLED=true`」也已完成，但首次自動部署尚未實際跑過，結果**未驗證**，要等下一次有內容推上 `main` 才知道（19:49 更新：首次自動部署已於 19:36 成功，run `44516322502`，GeorgeAI 回報；PR #12 觸發的 run `44516338006` 當時結果未確認，維持未驗證；線上頁面未重檢）。第 2、3 步（Actions 限制、`main` 的 ruleset）沒有收到完成的回報，視為未做。Iris 的 R1 已於 PR #8 修正，見 5.7。）另外，Iris 的 R1（404 頁在深層網址下失去樣式與連結）原本要在開 Pages 前修。這一項沒有出現在 Vega 的 6 步裡，兩份清單要合併使用（見 5.5 節與第 7 章）。

---

## 4 產出清單與位置

| 項目 | 位置 | 說明 |
| --- | --- | --- |
| PR | `https://github.com/george-palsys/morning-brief-archive/pull/7` | 2026-11-19 18:18 由 GeorgeAI 合併（依 Leader 自行合併規則）；鎖定 head `b2ed6f6`，非 squash |
| merge commit | `d87a3d4ed15fbb00ebcc14e0af2c5e3a369c053c` | 來源：Ada 轉達 GeorgeAI 的回報；我沒有自行重查 |
| main 上的 CI | `https://github.com/george-palsys/morning-brief-archive/actions/runs/44504392224` | Static site，success（來源：Ada 轉達 GeorgeAI 回報，未自行重查）；當時 Pages 沒開、repo 設定沒動、`PAGES_DEPLOY_ENABLED` 沒設 |
| commit | `b2ed6f63d76c5ac3ddd8c11c57a2f922fae1dab2` | PR 最後一個 commit |
| 分支 | `feat/static-morning-brief-site` | |
| CI run | `https://github.com/george-palsys/morning-brief-archive/actions/runs/44499192164` | Static site #1，見 5.1 節 |
| PR #9（文件） | `https://github.com/george-palsys/morning-brief-archive/pull/9` | 2026-11-19 18:47:00 合併；merge commit `8ebfb4fb1ca783e612a31e0ff51a828e155aa065`，鎖定 head `60a39525ee966cee0c249007cc4dabd659cc9bf4`（來源：Ada 轉達 Lin 讀回；我沒有自行重查） |
| main 上的 CI（PR #9） | `https://github.com/george-palsys/morning-brief-archive/actions/runs/44508844375` | success（Ada 轉達 Lin 讀回，未自行重查） |
| PR #8（修正） | `https://github.com/george-palsys/morning-brief-archive/pull/8` | 分支 `fix/site-design-review-r1-r9`；2026-11-19 18:47:14 合併；merge commit `60afd0ce17a4d59a98ff4a364adf4040453034eb`，鎖定 head `ca47117c6b2ac9452a18cd88d071bfa14219dcf5`（Ada 轉達 Lin 讀回，未自行重查） |
| main 上的 CI（PR #8） | `https://github.com/george-palsys/morning-brief-archive/actions/runs/44508880363` | Static site completed／success（2026-11-19 18:47:33 完成，build success、deploy skipped；Rigel 以匿名 API 核實，Ada 轉達） |
| PR #10（文件） | `https://github.com/george-palsys/morning-brief-archive/pull/10` | 本文件第二版；2026-11-19 18:58:24 由 GeorgeAI 合併；merge commit `4dc0e1e95b5a367a5ddb8d90b53a0b185c89357f`（Ada 轉達 GeorgeAI 回報，未自行重查） |
| main 上的 CI（PR #10） | `https://github.com/george-palsys/morning-brief-archive/actions/runs/44510546695` | success（18:58:48 完成，deploy skipped；GeorgeAI 回報） |
| GitHub Pages 啟用 | repo 設定（Pages） | 2026-11-19 19:06–19:08，操作者 GeorgeAI，George 於 19:06 核准「開」；Pages 來源 GitHub Actions、Enforce HTTPS 開；secret scanning 與 push protection 開（GeorgeAI 讀回；Vega 無認證讀不到，**未驗證**）；`github-pages` environment 分支政策僅 `main`（Vega 匿名讀回，並指出 `can_admins_bypass=true`；19:36 已改為 false，見下方 `can_admins_bypass` 列） |
| 手動部署 | `https://github.com/george-palsys/morning-brief-archive/actions/runs/44511889159` | head `4dc0e1e`；build 19:07:38、deploy 19:07:58 success（Ada 轉達） |
| 公開網址 | `https://george-palsys.github.io/morning-brief-archive/` | 驗證結果見 5.8；驗證的是手動部署那一次的內容 |
| 自動部署開關 | repo 變數 `PAGES_DEPLOY_ENABLED` | 2026-11-19 19:18，操作者 GeorgeAI，讀回值為 true（GeorgeAI 回報）；George 於 19:06 已核准開 Pages，依據是 Rigel、Vega、Iris 三份線上驗證都通過；首次自動部署已於 19:36 成功（見下方「首次自動部署」列，GeorgeAI 回報） |
| PR #11（小修） | `https://github.com/george-palsys/morning-brief-archive/pull/11` | 分支 `fix/site-low-risk-n1-n4`，head `841556ed27e18832ce33275d7d7b8bb0315945d3`，Lin 開立，**已合併**（merge commit `4aa9df967884d0c2271eb60505ee9ab1fc76f92b`，GeorgeAI 回報）；處理 N1–N4，改 4 檔（`site/README.md` +23、`site/assets/site.css` +2、`site/build.mjs` +7／−1、`site/test.mjs` +5）；Lin 回報 `npm test` 16 pass、對比 48 組、33 HTML／26 產品頁、連建兩次一致、CI #11 success（皆轉達，未自行重查）。Vega 安全審查已完成：四項全通過，無新風險，可合併（白名單與 CSP 未變、無新依賴、README 無不安全指引、gitleaks 無發現；Vega 回報）。Vega 同時更正他在 PR #8 報告的敘述：實際寫死的是 workflow 傳入的 `--base-path` 字串，404 頁本身由參數產生，不是 404 頁寫死 base-path。Iris 設計審查已回報（Iris 回報，Ada 轉達；我沒有讀到原始報告）：設計上可合併、無擋合併項目。N1 在 360／640／768／1280 寬度、淺色與深色下，麵包屑各項目皆 44px 高，目前頁面與連結同高（原差約 11px 已消除）；N4 卡片外框與多餘的 Tab 停點已移除、表格不裁切、無對比或焦點退步（72 次載入溢位 0、`h1` 恰 1 個、外部請求 0）；`npm test` 16 pass、對比 48 組 OK。Iris 評估搜尋頁空的 `<ol id="results">` 不併入此 PR，列為可選的獨立小修；順帶觀察日報頁 `.tabs-scroll` 在 1280px 不需捲動時仍是 Tab 停點（低風險、非本 PR 範圍）。Iris 未驗證：螢幕閱讀器、Firefox、Safari、真實手機、200% 縮放、卡片 hover、線上網址、CI；v3 正式資料產出後要再看線上卡片表。Rigel 對 PR #11 的驗證已全數通過（只改 4 檔 +37／−1、`npm test` 16 pass、對比 48 組、33 HTML／26 產品頁、0 warnings、連建兩次 40 檔雜湊一致、434 條站內連結斷鏈 0、N1–N4 達成、CI #11 run `44512999987` success；Rigel 回報，Ada 轉達）；Rigel 另有未驗證項：實機手機、螢幕閱讀器。 |
| PR #12（文件） | `https://github.com/george-palsys/morning-brief-archive/pull/12` | 本文件第三版；已合併，merge commit `7016ff829185042332ec72124908bac14f2b200c`（GeorgeAI 回報）；Rigel 審查通過：1 檔 577 行 +98／−21、SHA-256 相符、事實對照無誤、CI #12 run `44514069919` success（Rigel 回報，Ada 轉達） |
| 首次自動部署 | `https://github.com/george-palsys/morning-brief-archive/actions/runs/44516322502` | push 觸發，head `4aa9df9`；build 19:36:33、deploy 19:36:46 success（GeorgeAI 回報）；PR #12 觸發的 run `44516338006` 當時結果未確認，**維持未驗證**；線上頁面在這次部署後未重檢 |
| `can_admins_bypass` | `github-pages` environment 設定 | 2026-11-19 19:36 改為 false（George 裁示「關掉」，GeorgeAI 操作並讀回 false）；部署分支政策仍僅 `main`（GeorgeAI 回報，我沒有自行讀回） |
| GitHub 連線授權 | Ada 與 George-palsys 的 GitHub 連線 | George 裁示「給」，連線已開；範圍為 George 本人帳號下所有 repo；使用規則：僅晨報 repo、一律走 PR、不直推 `main`、合併由 GeorgeAI 處理。Lin 使用的 ChatGPT GitHub 連接器可寫哪些 repo，只有 George 能在 GitHub Settings → Applications 查，**未驗證**；George 對此「沒看懂有什麼影響」，已白話說明：不改也不影響現在工作，要限縮只有 George 能改（Ada 轉達） |
| 模型暫換 | Rigel、Scout 的模型 | 暫換為 Claude Opus 5.5；原因是 Gemini 4 Argon 每週額度用完，11/25 10:19 重置後換回；可還原（Ada 轉達） |
| PR #13（關於頁與無障礙小修） | `https://github.com/george-palsys/morning-brief-archive/pull/13` | 分支 `fix/site-about-and-a11y`，head `28d2b2bedd4e126e0b50c4fd031beaf7b29c57e7`，Lin 開立，6 檔 +65／−11，CI #15 run `44517398962` success；**三方審查通過、尚未合併**（待 GeorgeAI 合併，合併後再回填）；審查結果見 5.9 |

PR #8 只修改 6 個檔，合計 +110／−21（Ada 轉達；逐檔行數沒有提供，所以不列）：

| 序號 | 路徑 |
| --- | --- |
| 1 | `.github/workflows/pages.yml` |
| 2 | `site/README.md` |
| 3 | `site/assets/site.css` |
| 4 | `site/build.mjs` |
| 5 | `site/contrast.mjs` |
| 6 | `site/test.mjs` |

PR #7 的 14 個新增檔案（Rigel 逐檔列出，行數加總 847）：

| 序號 | 路徑 | 新增行數 | 用途 |
| --- | --- | --- | --- |
| 1 | `.gitattributes` | 1 | 行尾設定 `* text=auto eol=lf` |
| 2 | `.github/workflows/pages.yml` | 54 | 建置與預設關閉的 Pages 部署 workflow，沒有 `schedule` 觸發 |
| 3 | `.gitignore` | 4 | 忽略 `node_modules/`、`_site*/`、`.site-test/`、`*.log` |
| 4 | `package-lock.json` | 127 | 鎖定相依套件版本與 integrity |
| 5 | `package.json` | 15 | `build`、`test`、`check:contrast` 腳本與兩個直接相依套件 |
| 6 | `site/README.md` | 85 | 建置、測試、部署條件與未驗證事項說明 |
| 7 | `site/assets/search.js` | 51 | 按月延遲載入的前端搜尋，只用 `textContent` |
| 8 | `site/assets/site.css` | 97 | 響應式樣式、系統深淺色、表格轉卡片、焦點樣式 |
| 9 | `site/assets/toc.js` | 5 | 寬度 840px 以上自動展開「本頁目錄」 |
| 10 | `site/build.mjs` | 222 | 產生器核心；內含 `about.html` 的角色分工段 |
| 11 | `site/capture-fixture.mjs` | 10 | 維護者擷取演練快照的工具腳本 |
| 12 | `site/contrast.mjs` | 22 | 36 組色彩對比自動檢查 |
| 13 | `site/fixtures/preview.json` | 42 | 演練資料快照，不會複製到正式 `daily/` 或 `products/` |
| 14 | `site/test.mjs` | 112 | 11 項自動測試 |

建置產出（正式建置 33 個 HTML 頁）：

| 序號 | 類別 | 頁數 |
| --- | --- | --- |
| 1 | 非產品頁：`index.html`、`404.html`、`about.html`、`daily/index.html`、`daily/2026-11-19.html`、`products/index.html`、`search/index.html` | 7 |
| 2 | 產品頁 `products/<slug>.html` | 26 |
| 3 | 合計 | 33 |

演練建置（`mode=rehearsal`）再多 7 頁 v3 每日頁（摘要、產品動態、新知識、CVE、台灣 IT、AI、清單維護），共 40 頁。

26 個產品頁（Rigel 與 Lin 各自逐項列出，兩邊一致）：

| 序號 | 產品頁路徑 |
| --- | --- |
| 1 | `products/websphere-application-server.html` |
| 2 | `products/websphere-liberty.html` |
| 3 | `products/mq.html` |
| 4 | `products/instana.html` |
| 5 | `products/turbonomic.html` |
| 6 | `products/black-duck-sca.html` |
| 7 | `products/coverity.html` |
| 8 | `products/seeker.html` |
| 9 | `products/srm.html` |
| 10 | `products/neuvector.html` |
| 11 | `products/appscan.html` |
| 12 | `products/jboss-eap.html` |
| 13 | `products/cicd.html` |
| 14 | `products/concert.html` |
| 15 | `products/gcm.html` |
| 16 | `products/qse.html` |
| 17 | `products/vault.html` |
| 18 | `products/bob.html` |
| 19 | `products/openshift.html` |
| 20 | `products/3scale.html` |
| 21 | `products/jbcs-httpd.html` |
| 22 | `products/rancher-rke2.html` |
| 23 | `products/nkp.html` |
| 24 | `products/confluent-platform.html` |
| 25 | `products/palsys-one.html` |
| 26 | `products/cmc.html` |

網站網址：`https://george-palsys.github.io/morning-brief-archive/`。這是依 Iris 規格引用 GitHub Docs〈About GitHub Pages〉的專案站台網址形式推得（`https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages`）；Iris 報告說該頁由 JavaScript 渲染，只確認到網址形式字樣，整段文案未逐字核對。19:06–19:08 啟用後，這個網址已可連線（Rigel、Vega、Iris 對真實網址的驗證結果見 5.8；我沒有自行連線）。

---

## 5 驗證與審查結果

### 5.1 Rigel 獨立驗證（2026-11-19 17:46–17:51，結論：8 項全數通過）

| 項次 | 項目 | 結論 | 證據摘要 |
| --- | --- | --- | --- |
| 1 | 乾淨 clone 重建、11 項測試、36 組對比 | 通過 | 連建兩次，40 個產出檔 SHA-256 差異 0；`npm test` 11/11；對比 36/36 |
| 2 | 正式 33 頁、演練 40 頁、各含 26 個產品頁 | 通過 | 逐一列出 26 個產品頁 |
| 3 | 全站相對連結與子路徑相容 | 通過 | 正式站站內連結 435 條、演練站 798 條、雙日演練站 1022 條；斷鏈 0、跳出子路徑 0、缺錨點 0 |
| 4 | 逐產品狀態來源、不一致警告、壞資料失敗 | 通過 | 自造三種壞資料，行為符合預期 |
| 5 | 舊版單檔發布與提示 | 通過 | frontmatter 未外露，有「舊版格式」提示 |
| 6 | 360px 排版 | 通過 | 40 頁橫向溢出 0；產品總表表格轉卡片 |
| 7 | PR 變更檔案與邊界 | 通過 | 14 個新增檔；未動 `SPEC.md` 與三個排程 |
| 8 | GitHub Actions CI | 通過 | run `44499192164`：`completed`、`success`；`build` job 全部步驟 success；`deploy` job `skipped`（17:47 匿名 API 查詢） |

### 5.2 Iris 設計審查（2026-11-19；結論：設計上可以合併，沒有擋合併項目）

- 37 項逐項結果：通過 30、不通過 6、不適用 1。
- 不通過 6 項（全為「建議」）：第 4 項（404 頁，對應 R1）、第 7 項（上一天／下一天，R6）、第 17 項（CVE 標籤，R3）、第 19 項（清單維護沒內容時的單句，R7）、第 21 項（表格卡片堆疊，R2）、第 30 項（觸控目標 44px，R8）。
- 不適用 1 項：第 27 項（主題切換按鈕，實作未做）。
- 建議項目 R1–R10：

| 編號 | 嚴重度 | 摘要 |
| --- | --- | --- |
| R1 | 建議（高）：不擋本 PR，但開 Pages 前必修 | 404 頁在兩層以上的深層不存在網址下沒有 CSS，連結壞掉。修法：建置參數加 `--base-path`，只有 404 頁用絕對路徑；不要用 `<base>`（CSP 已設 `base-uri 'none'`）；上線後用真實 Pages 網址驗證 |
| R2 | 建議（中） | 每日摘要表格在 640px 以下沒有一列一卡的視覺邊界，且錯誤地顯示「可左右捲動」 |
| R3 | 建議（低） | CVE 頁的「與我們的產品線相關」標籤沒有出現（`build.mjs` 第 98 行的比對被 `<code>` 擋住） |
| R4 | 建議（低） | 淺色 `--color-border-strong:#8c959f` 對 `#f6f8fa` 底只有 2.85:1；Iris 說這是她規格 6.5 的疏漏 |
| R5 | 建議（低） | 「本頁目錄」直接用原始 Markdown，顯示出反引號 |
| R6 | 建議（低） | 只有一個日期時輸出兩個空的「相鄰日期」導覽地標 |
| R7 | 建議（低） | 清單維護沒內容時沒有單句「今天沒有清單維護項目」 |
| R8 | 建議（低） | 麵包屑 17px、頁尾連結 19px 高，未達 44px 設計值 |
| R9 | 建議（低） | 首頁「今天最需要注意的一件事」標題與內文開頭重複 |
| R10 | 資訊（需 Ada、George 知悉） | 缺 `meta.yaml` 或缺段落檔時整個建置失敗（不是頁面佔位）；代價是某一天資料壞掉，整個網站（含前一天）都無法更新。Iris 傾向維持現狀 |

- Iris 另外獨立重算 Lin 的 36 組對比，全部達標；補算 24 組 Lin 沒涵蓋的組合，其中 1 組低於 3:1（即 R4）。

### 5.3 Vega 安全審查（2026-11-19 17:53–18:10；結論：PR #7 程式碼可以合併；啟用 Pages 前 repo 設定必須先完成）

| 項次 | 項目 | 結論 |
| --- | --- | --- |
| 1 | workflow 權限與觸發條件 | 通過；但部署關卡要靠 `github-pages` environment（1-F，條件式通過） |
| 2 | 第三方 action 釘完整 SHA | 通過 |
| 3 | 相依套件與 lockfile | 通過（`npm audit`：`found 0 vulnerabilities`，npm 11.11.1，17:55） |
| 4 | 內容過濾 | 通過（自造 40 種惡意輸入，40 頁、5,930 個標籤中危險元素與屬性 0 個） |
| 5 | 沒有外部資源 | 通過 |
| 6 | CSP | 通過（meta 形式無法設定 `frame-ancestors`，沒有 clickjacking 防護，列為低） |
| 7 | 機密與敏感資訊 | 通過（gitleaks 三處皆 no leaks found）；`about.html` 角色分工是否公開由 George 決定（低） |
| 8 | 分支保護與 repo 設定 | **不通過**（沿用 17:28–17:35 基線，本次未重查） |

擋合併的項目：無。擋上線的項目：8-H1（`main` 無保護，高）、1-F（environment 尚未設，中）、8-M1（secret scanning 與 push protection 未開，中）、8-M2（Actions 未限制與未強制釘 SHA，中）。

repo 設定的基線值（17:28–17:35 查詢，**之後沒有重查**）：

| 設定 | 基線值 |
| --- | --- |
| `main` branch protection | 404 `Branch not protected` |
| rulesets 與 `rules/branches/main` | `[]` |
| secret scanning／push protection | `disabled`／`disabled` |
| Dependabot alerts／security updates | 關閉／關閉 |
| CodeQL default setup | `not-configured` |
| `allowed_actions`／`sha_pinning_required` | `all`／`false` |
| 預設 `GITHUB_TOKEN` | `read`、不能核准 PR |
| fork PR 核准 | `first_time_contributors` |
| environments | `total_count: 0` |

07:30 備份直推 `main` 的處理（Vega 第 8 項）：共同的 ruleset 為禁止刪除、禁止強制推送、要求 PR 且 Required approvals 設為 0（因為只有一個帳號，設 1 會永遠合不了 PR）、要求 `build` 狀態檢查通過。備份二選一：

| 方案 | 做法 | 代價 |
| --- | --- | --- |
| A（Vega 建議） | 備份改成推到 `archive/YYYY-MM-DD` 分支，開 PR，等 `build` 通過後合併 | 要改備份排程與 SPEC 第 463 行，需另外指派，且要在 2026-11-20 07:30 前完成，否則 ruleset 晚一點再開 |
| B（過渡） | ruleset 照上述設定，bypass list 只加一把專給備份用、有寫入權限的 deploy key | 個人帳號 repo 能不能把 deploy key 加進 bypass list，Vega 沒有實際打開設定頁確認；bypass list 不可以加 `Repository admin` 角色 |

### 5.4 角色分工頁（`about.html`「製作與審查角色」段）

- 內容：`site/build.mjs` 第 192–193 行寫死 8 個名稱與角色（GeorgeAI、Ada、Lin、Iris、Rigel、Vega、Quill、Scout），並附註「以下為角色分工，不代表本次變更已通過審查」。
- 這段是 Lin 超出原指派範圍加的（Ada 指出）。
- Vega：沒有機密；是公司對外揭露的決策，不是漏洞；列為低；不擋合併。
- Iris：以目前寫法不建議照現狀公開。
- **是否公開：George 已答「可以公開」（repo 與晨報內容）；角色分工段已於 PR #8 移除（GeorgeAI 的決定，見 D8；Ada 轉達 Lin 的結果，Iris 複審通過）。**以上是第一版與 PR #7 合併當時的內容描述，`main` 上目前已不含該段。
- George 的原話「要補角色，也要補 security code review 角色」，Vega 與 Iris 都表示無法判斷是指「網站補角色說明」還是「團隊補成員」，他們沒有確認。

### 5.5 報告之間對不上的地方（不自行挑一邊，並列）

| 編號 | 項目 | 說法 A | 說法 B | 狀態 |
| --- | --- | --- | --- | --- |
| D1 | Iris 不通過項數 | Iris 逐項表與結論第一段：不通過 6 項（第 4、7、17、19、21、30 項） | Iris 結論段另一句寫「不通過的 7 項沒有任何一項造成資料錯誤…」 | 逐項表只有 6 項；7 是否為筆誤，需 Iris 確認 |
| D2 | Iris 的「全為建議」與 R1 | Iris 說 6 項不通過「全為建議」，沒有擋合併項目 | 其中第 4 項同時標「上線前必修」，R1 也寫「開 Pages 前必修」 | 兩者可同時成立（不擋合併、但擋開 Pages）；是否把 R1 列入「啟用 Pages 前必須完成」清單，Vega 的 6 步沒有它，需 Ada 決定。更新：R1 已於 PR #8 修正（見 5.7），此項在實作面已不再卡關，但真實 Pages 上的 404 行為仍未驗證 |
| D3 | 設計審查清單的節次 | Ada 的指派訊息寫第 10 節 | Iris 規格實際在 9.6，第 10 節是未驗證項目 | 以 Iris 規格實際內容為準（9.6）；Iris 報告已更正 |
| D4 | Rigel 360px 截圖張數 | Ada 的指派訊息寫三張 | Rigel 工作資料夾實際有六張；Iris 只逐張開啟其中 2 張，其餘 4 張只依報告文字對照 | 以六張為準；其中 4 張 Iris 未目視 |
| D5 | CSP 的 `img-src` | Iris 規格 9.5 建議 `img-src 'self' data:` | PR 內 `site/build.mjs` 第 139 行是 `img-src 'self'`（沒有 `data:`），Vega 審查的也是這個值 | 實作比規格更嚴；Iris 規格寫明該值「交 Vega 審」，Vega 通過的是實作值。是否需要把規格改回來，需 Iris 與 Ada 確認 |
| D6 | CI 狀態 | Lin 交接（17:44）：CI 為 `in_progress`，未宣告通過 | Rigel（17:47）：`completed`、`success` | 時間先後造成，不是矛盾；以較晚的 Rigel 結果為準，仍是一次匿名 API 查詢，我沒有重查 |
| D7 | Node.js 版本 | Lin 本機 v25.8.2 | `package.json` `engines` 為 `>=22`；CI 為 `node-version: '24'` | 三個版本不同，沒有報告說明這是否有意；Lin 本機版本沒有在 CI 環境重跑（CI 只證明 24 可以建置） |
| D8 | 角色分工頁的處理建議 | Vega：若保留，名單從 `build.mjs` 搬到資料檔（例如 `site/roles.yaml`） | Iris：若公開，標題改「製作團隊」、每個名字註明 AI 助理或人員、移到頁面最下方、**不寫 Security Code Review 以免被讀成安全保證** | **更新**：GeorgeAI 判斷 George 的話（「要補角色，也要補 security code review 角色」）指**團隊新增成員**，不是網站內容；`about.html` 的角色分工段**已於 PR #8 移除**（2026-11-19 18:47:14 合併；Ada 轉達，Iris 複審通過）。這是 GeorgeAI 的判斷，我沒有向 George 另外確認。 |
| D9 | 角色分工附註措辭 | Lin 交接：「不代表已完成他人的審查」 | 網站實際文字：「不代表本次變更已通過審查」 | 措辭不同；Iris 指出網站上的句子用了 PR 內部語言，讀者看不懂 |
| D10 | 表格卡片堆疊 | Rigel：已轉卡片堆疊（通過，驗證 DOM 的 `display:block`） | Iris：DOM 正確但視覺上沒有一列一卡的邊界（不通過，R2） | Iris 已在報告中說明兩者驗證層級不同；以 R2 列為待改 |
| D11 | Dependabot 對本 repo 的效用 | Vega 基線（17:28）：repo 沒有 manifest，開了也不會有結果 | Vega 審查（之後）：PR 加入 `package.json` 與 lockfile，開了才有意義 | 因 PR 內容改變，不是矛盾 |

**一致的項目**（我逐項對照過）：commit SHA 與 base SHA 四份報告一致；PR 14 檔、847 行新增、0 行刪除與 Rigel 逐檔加總一致；4 個 action 的 SHA 在 Vega、Rigel 與 workflow 檔三處相同；8 個相依套件、36 組對比、33 頁／40 頁、26 個產品頁、11 項測試、外部連結 57 條（Rigel 與 Vega 的正式建置數字相同）。

### 5.6 George 的決定與限定

- repo 與晨報內容可以公開（Vega 基線引用 George「可以公開」的決定）。
- 角色分工頁：GeorgeAI 判斷應移除，已於 PR #8 移除（見 5.4、D8）。

### 5.7 PR #8 的三方審查結果（2026-11-19；全部為 Ada 轉達各審查者的報告，我沒有讀到原始報告）

PR #8 修正 Iris 設計審查的 R1–R9；R10 維持現狀。

| 審查者 | 結論 | 轉達的證據摘要 |
| --- | --- | --- |
| Rigel（驗證） | 通過 | `npm test` 16 項；對比 48 組；正式建置 33 頁、演練建置 40 頁，各含 26 個產品頁；連建兩次雜湊一致；R1 以本機伺服器模擬 `/morning-brief-archive/` 下兩層不存在網址，CSS 與連結皆回 200 |
| Vega（安全） | 通過 | CSP 未變；`--base-path` 白名單為 `^/(?:[A-Za-z0-9_-]+/)*$`，22 個值測試、18 個惡意值被擋；40 種惡意輸入重跑無退步；沒有新增相依套件 |
| Iris（設計複審） | R1–R9 全通過 | R4 淺色 `--color-border-strong` 改為 `#7d8690`，對 bg、surface、surface-hover 的對比為 3.69、3.47、3.17；`about.html` 角色段已移除；R10 維持現狀 |

PR #8 審查後新增的低風險建議（不擋合併，**未處理**）：

| 編號 | 內容 | 提出者 |
| --- | --- | --- |
| N1 | 麵包屑「目前頁面」項比連結高約 11px；建議 `.breadcrumbs li{display:flex;align-items:center;min-height:var(--tap-min)}` | Iris |
| N2 | 在 Git Bash 執行 `--base-path /morning-brief-archive/` 會被路徑轉換，需設 `MSYS_NO_PATHCONV=1`；建議 `site/README.md` 補一句 | Vega |
| N3 | 404 頁寫死 base-path；repo 改名或換網域時要同步修改（**Vega 後來更正**：實際寫死的是 workflow 傳入的 `--base-path` 字串，404 頁本身由參數產生；repo 改名或換網域時要同步修改的是 workflow 的字串） | 審查者轉達（提出者未註明）；更正來自 Vega 回報 |
| N4 | 手機版表格卡片堆疊的外層仍是可用 Tab 聚焦的捲動容器 | 審查者轉達（提出者未註明） |

與 5.5 的關係：D1–D11 沒有因 PR #8 產生新的不一致；D8 已結案（角色段已移除），D2 的 R1 已修正。

### 5.8 真實網址驗證（2026-11-19 Pages 啟用後；全部為 Ada 轉達各審查者的報告，我沒有讀到原始報告，報告檔名與路徑不寫入本文件）

網址：`https://george-palsys.github.io/morning-brief-archive/`；驗證的部署為 run `44511889159`（head `4dc0e1e`）。

**Rigel（驗證）：六項全通過**

| 項目 | 結果 |
| --- | --- |
| 首頁遞迴爬行 | 7 個 URL、74 條引用 |
| 全站站內引用 | 33 頁、434 條站內引用；斷鏈 0、缺錨點 0 |
| 產品頁 | 26 個產品頁 26／26 為 HTTP 200 |
| 深層 404 | 3 層、5 層不存在網址皆回 404；`site.css` 與導覽連結皆 200 |
| http→https | 皆 301 |
| 線上與建置一致 | 線上 33 個 HTML 加 6 個公開非 HTML 檔的 SHA-256 與 `main` 建置 100% 一致（`.nojekyll` 不對外伺服） |
| 外部連結 | 28 個唯一外部連結，只列出、未跟隨 |

附註：目前 `main` 沒有 `products/README.md`，首頁與產品索引只顯示空狀態、不連到 26 個產品頁，v3 首份晨報產生後才會出現；Rigel 的選配建議是無資料時仍依 `products.yaml` 輸出清單。

**Vega（安全）**

| 項目 | 結果 |
| --- | --- |
| CSP 位置 | 每頁僅 meta 一份；`default-src 'none'`、`base-uri 'none'`，無 `unsafe-`；回應標頭沒有 CSP |
| 外部資源 | 無 `<base>`、無外部資源 |
| 瀏覽器實測 | Chrome 實測 inline script、inline style、外部 fetch 皆被擋 |
| HSTS | `max-age=31556952` |
| 缺少的標頭 | `X-Frame-Options`、`nosniff`、`Referrer-Policy`、`Permissions-Policy` 皆沒有 |
| meta CSP 的限制 | `frame-ancestors`、`report-uri`、`sandbox` 在 meta 中不生效（依據 W3C CSP3 §3.3 與 MDN）；github.com 官方文件找不到明寫「Pages 不支援自訂標頭」的頁面，所以這一點只能如實寫「官方文件未說明」 |
| 404 頁與敏感路徑 | 404 頁通過；`/.git/config` 回 404 |
| 低風險 | 網站可被 iframe 嵌入；缺安全標頭 |
| 建議 | 決定是否關閉 `can_admins_bypass`；`/favicon.ico` 回 404 |

**Iris（設計）**：能在線上驗的都通過，沒有擋上線的項目。

| 項目 | 結果 |
| --- | --- |
| R1 | 通過 |
| R4 | 通過 |
| R6 | 通過 |
| R8 | 通過 |
| R5 | 部分通過 |
| R2 | 未驗證：線上只有舊版單檔 2026-11-19、沒有 v3 資料，需 2026-11-20 02:00 首份 v3 後補驗 |
| R3 | 未驗證：線上沒有 v3 資料，需首份 v3 後補驗 |
| R7 | 未驗證：線上沒有 v3 資料，需首份 v3 後補驗 |
| R9 | 未驗證：線上沒有 v3 資料，需首份 v3 後補驗 |
| 卡片表 O2 | 未驗證：線上沒有 v3 資料，需首份 v3 後補驗 |
| N1 | 麵包屑差約 11px 仍在；Lin 已開 PR #11 修，未合併 |
| O1 | `about.html` 仍寫「由 GeorgeAI 每天半夜 2:00 …產生」，是否公開由 George 決定 |
| 新觀察 | 搜尋頁空的 `<ol id="results">` 螢幕閱讀器可能讀成空清單 |

與 5.5 的關係：上述結果沒有與 D1–D11 衝突；D2 的 R1 已在真實網址上通過。


### 5.9 PR #11、PR #12、自動部署與 PR #13 的後續結果（2026-11-19 19:36–19:49；全部為各人回報、Ada 轉達，我沒有讀到原始報告）

**Rigel 對 PR #11 的驗證（結論：全數通過）**

- 只改 4 檔，+37／−1。
- `npm test` 16 pass。
- 對比 48 組通過。
- 33 個 HTML、26 個產品頁，0 warnings。
- 連建兩次，40 個檔案雜湊一致。
- 434 條站內連結，斷鏈 0。
- N1–N4 達成。
- CI #11，run `44512999987`，success。
- Rigel 未驗證：實機手機、螢幕閱讀器。

**Rigel 對 PR #12（本文件第三版）的審查（結論：通過）**

- 1 個檔，577 行，+98／−21。
- SHA-256 相符。
- 事實對照無誤。
- CI #12，run `44514069919`，success。

**PR #13 的三方審查（分支 `fix/site-about-and-a11y`，head `28d2b2bedd4e126e0b50c4fd031beaf7b29c57e7`，6 檔 +65／−11，CI #15 run `44517398962` success；尚未合併）**

- Rigel 驗證通過：18 pass、對比 48 組、33 HTML／26 產品頁、0 warnings、連建兩次 40 檔一致、建置後全站「GeorgeAI」0 筆、434 條連結斷鏈 0、G2（空清單）與 G3（Tab 停點）達成。
- Vega 安全審查通過：無 `innerHTML`、`eval`、外部資源；CSP 與 `--base-path` 白名單未變；22 個 base-path 值接受 4 個、拒絕 18 個，與 PR #11 相同；gitleaks v8.30.1 無發現；無新依賴。
- Iris 設計審查通過：G1 關於頁通順；G2 三種狀態下空清單皆隱藏、`aria-live` 仍在；G3 在 1280 為 `tabindex=-1`、在 360 為 0 且有 3px solid 焦點外框、ArrowRight 可捲動；36 次載入溢位 0、`h1` 恰 1 個、外部請求 0。
- Vega 低風險發現（不擋合併，另案）：repo 內 `docs/implementation` 紀錄、`SPEC.md`、`products.yaml` 仍含 GeorgeAI 與成員名稱、排程時間（無機密），是否中性化待 George 決定。
- Iris 低風險建議：無 JS 時 360 寬度的分頁列沒有 Tab 停點（未驗證，可於 README 註明）；關於頁頁首與頁尾各有一句重複的「內容為彙整，以原廠頁面為準。」。
- Vega、Iris 未驗證：螢幕閱讀器、Firefox、Safari、實機、200% 縮放、關閉 JS、線上頁面。

**George 於 2026-11-19 的裁示（Ada 轉達）**

- 「去掉」：公開網站上的 GeorgeAI 字樣（PR #13 的 G1）。
- 「關掉」：`github-pages` environment 的 `can_admins_bypass`（19:36 已由 GeorgeAI 改為 false 並讀回）。
- 「修掉」：搜尋頁空 `<ol>` 與日報頁 `.tabs-scroll` 的 Tab 停點（PR #13 的 G2、G3）。
- 對 ChatGPT 連接器範圍「沒看懂有什麼影響」：已白話說明，不改也不影響現在工作，要限縮只有 George 能改。
- 「給」：Ada 與 George-palsys 的 GitHub 連線已開，範圍與使用規則見第 4 章。

---

## 6 如何套用到別的專案

以下是依這次經驗整理的做法，**我沒有在別的專案實際套用過，屬待驗證**。

1. **先寫規格，再實作，再兩種審查**：設計規格附可逐項檢查的審查清單；實作交接寫明 commit、指令與輸出；驗證、設計審查、安全審查由不同人各做一次。
2. **網站掛在子路徑**：專案站台網址是 `https://<帳號>.github.io/<repo 名稱>/`，站內連結一律用相對路徑；上線前用「掛在子路徑的本機伺服器」測連結（本專案做法）。404 頁是例外，見 Iris R1。
3. **內容管線預設安全**：Markdown 轉換時關閉原始 HTML、圖片不輸出 `<img>`、連結白名單（只放 `http(s)`）、所有手寫拼接的 HTML 都跳脫；每頁加 meta CSP（`default-src 'none'` 為底）；不載入外部字型、CDN、追蹤腳本。
4. **相依套件固定**：直接相依不用 `^`、`~`；附 lockfile；CI 用 `npm ci --ignore-scripts`；上線前跑 `npm audit`。
5. **workflow 最小權限**：頂層只給 `contents: read`；`pages: write`、`id-token: write` 只給部署 job；`actions/checkout` 設 `persist-credentials: false`；第三方 action 全用完整 SHA 釘選並用 `git ls-remote` 核對；不用 `pull_request_target`。
6. **部署預設關閉，並用 repo 設定而不是 `if:` 當關卡**：workflow 內的 `if:` 條件可以被有寫入權限的分支在自己的 PR 裡改掉（Vega 1-F），真正的關卡是 `github-pages` environment 只允許 `main` 部署、`main` 有 ruleset。
7. **啟用 Pages 的順序**：照第 3.6 節的 6 步；先決定備份排程走法再開 ruleset。
8. **每次實作都寫一份這種紀錄**：九個章節固定，第 9 章只往後加。

官方來源（這些連結來自 Lin 與 Vega 的報告，Vega 報告自己也註明沒有逐頁打開；我撰寫時也沒有重新打開，**未逐頁核對**）：

- 自訂 workflow 部署 Pages：`https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages`
- Actions 安全強化：`https://docs.github.com/en/actions/security-for-github-actions/security-guides/security-hardening-for-github-actions`
- 管理部署環境：`https://docs.github.com/en/actions/managing-workflow-runs-and-deployments/managing-deployments/managing-environments-for-deployment`
- Rulesets：`https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/creating-rulesets-for-a-repository`
- Push protection：`https://docs.github.com/en/code-security/secret-scanning/introduction/about-push-protection`
- CSP（MDN）：`https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy`
- markdown-it 安全說明：`https://github.com/markdown-it/markdown-it/blob/master/docs/security.md`
- WCAG 2.2：`https://www.w3.org/TR/WCAG22/`（Iris 報告：規格引用的 SC 編號與標題、等級經她逐一開啟核對相符；WCAG 技術編號 SCR39／H 技術沒有查證）

---

## 7 後續維護方式

1. **晨報內容更新**：每天 02:00 排程產生內容、07:30 備份到 repo、08:00 排程（三個排程本次都沒動）。網站會在下一次 `main` 的 build 時讀到新內容；部署是否自動，取決於第 3.6 節第 6 步的 `PAGES_DEPLOY_ENABLED`，2026-11-19 19:18 起 `PAGES_DEPLOY_ENABLED` 為 true（GeorgeAI 回報讀回值），首次自動部署已於 19:36 成功（run `44516322502`，push、head `4aa9df9`，build 19:36:33、deploy 19:36:46 success，GeorgeAI 回報）；PR #12 觸發的 run `44516338006` 當時結果未確認，維持未驗證；自動部署後線上頁面未重檢；首份 v3 晨報（2026-11-20 02:00 之後的備份）推上 `main` 後的部署結果仍未驗證。若要暫停自動部署，要把該變數改回非 true（官方操作方式沒有查證，未驗證）。
2. **資料壞掉時**：缺 `meta.yaml`、缺段落檔、`meta.yaml` 欄位無效、缺產品頁時，建置會失敗並停止（不會公開不完整的一天）；`meta.yaml` 與產品總表不一致，或總表少於 26 列時，建置成功但首頁與總表頂端顯示警示。**失敗即停、整站停更、不發布壞資料，是 GeorgeAI 的決定（寧可停更，也不公開壞資料）**，也就是 Iris R10 的取捨已決定維持現狀。處理方式：
   - 誰看：晨報 repo 的 Leader（GeorgeAI、Ada、George-palsys）看 `main` 的 Static site workflow 結果；失敗時 `build` job 的紅燈與錯誤訊息會指出缺哪個檔或欄位。
   - 怎麼修：依錯誤訊息補齊該日 `meta.yaml` 欄位或缺少的段落檔，或修正該日資料夾，再走 PR 合併；合併後 `main` 會重新建置。
   - 目前沒有設計排程失敗的主動通知，所以只靠有人看 Actions 結果（未驗證是否有 GitHub 預設的失敗通知信，沒有查）。
   - 停更期間網站（若已啟用 Pages）會維持上一次成功部署的內容；Pages 已啟用，但沒有人實測過停更時線上內容是否維持上一次成功部署，所以此行為未實測。
3. **修改本站時的檢查**：`npm test`（PR #7 為 11 項；PR #8 審查時 Rigel 回報 16 項）、`npm run check:contrast`（PR #7 為 36 組；PR #8 審查時為 48 組）、`npm run build`；修改 `search.js` 時不得改用 `innerHTML`（Vega 4-I1）。
4. **套件與 action 升級**：Vega 建議另開 PR 升級四個 action 的大版本並重新核對 SHA，加 `dependabot.yml`（`npm` 與 `github-actions`），並開 Dependabot alerts、security updates 與 CodeQL default setup。
5. **角色分工名單**：該段已於 PR #8 移除，不再需要維護（原本寫死在 `site/build.mjs`，Vega 7 曾指出成員異動時會過時）。
6. **PR #8 後新增的 4 項低風險建議（見 5.7；Lin 開 PR #11 處理，PR #11 已合併，Rigel 驗證、Vega 安全審查、Iris 設計審查皆通過；N1–N4 達成，Rigel 回報，Ada 轉達）**：
   - N1：麵包屑「目前頁面」項高度，建議 `.breadcrumbs li{display:flex;align-items:center;min-height:var(--tap-min)}`（Iris）。
   - N2：Git Bash 執行 `--base-path /morning-brief-archive/` 會被路徑轉換，需 `MSYS_NO_PATHCONV=1`，建議 `site/README.md` 補一句（Vega）。
   - N3：repo 改名或換網域時要同步修改 workflow 傳入的 `--base-path` 字串（Vega 更正：404 頁本身由參數產生，不是寫死在 404 頁）。
   - N4：手機版表格卡片堆疊外層仍是可 Tab 聚焦的捲動容器。
7. **repo 設定重查**：Vega 的 repo 設定數值是 17:28–17:35 的基線，Pages 啟用後只有 `github-pages` environment 由 Vega 匿名讀回；其餘（secret scanning、push protection、Actions 限制、`main` 保護）要有認證才讀得到，目前沒有重查證據（`can_admins_bypass` 改為 false 只有 GeorgeAI 讀回）。需要 George 登入或提供只對這個 repo 有唯讀權限的 token。
   - 已決定：`github-pages` environment 的 `can_admins_bypass` 已於 19:36 改為 false（George 裁示「關掉」，GeorgeAI 操作並讀回）；Vega 當時的匿名讀回是 true，改後沒有人獨立重查，**未驗證**。
8. **上線後與 PR #11、PR #13 審查後的低風險建議（Vega、Iris、Rigel 提出）**：搜尋頁空 `<ol id="results">` 與日報頁 `.tabs-scroll` 的 Tab 停點，George 裁示「修掉」，已由 PR #13 處理（三方審查通過、尚未合併）；以下仍未處理：缺安全標頭（Pages 是否能設標頭，官方文件未說明）、`/favicon.ico` 回 404、無資料時是否仍依 `products.yaml` 輸出產品清單（Rigel 選配）、首份 v3 晨報（2026-11-20 02:00）產生後補驗 R2、R3、R5、R7、R9、O2；Vega 低風險發現（不擋合併，另案）：repo 內 `docs/implementation` 紀錄、`SPEC.md`、`products.yaml` 仍含 GeorgeAI 與成員名稱、排程時間（無機密），是否中性化待 George 決定；Iris 低風險建議：無 JS 時 360 寬度的分頁列沒有 Tab 停點（未驗證，可於 `site/README.md` 註明）、關於頁頁首與頁尾各有一句重複的「內容為彙整，以原廠頁面為準。」。George 裁示「去掉」公開網站的 GeorgeAI 字樣，PR #13 建置後全站「GeorgeAI」0 筆（Rigel 回報）；PR #13 合併前，線上頁面仍是舊內容。
9. **這份文件本身**：新增的實作請另寫新檔 `docs/implementation/<日期>-<主題>.md`；本檔只往第 9 章往後加紀錄，不改寫過去的記載。

---

## 8 未驗證項目

| 編號 | 項目 | 為什麼未驗證 | 出處 |
| --- | --- | --- | --- |
| U1 | GitHub Pages 實際部署、公開網址行為、深層 404 在 Pages 上的真實行為 | 已部分解決：真實網址的 404、連結、http→https 已由 Rigel、Iris 驗證（見 5.8，轉達）。仍未驗證：我沒有自行連線；自動部署（`PAGES_DEPLOY_ENABLED`）19:18 已開，首次自動部署 run `44516322502` 於 19:36 成功（GeorgeAI 回報）；PR #12 觸發的 run `44516338006` 結果未確認，自動部署後線上頁面未重檢 | Lin、Rigel、Iris U1 |
| U2 | CSP 與 HTTPS 在瀏覽器與 Pages 上是否實際生效、有無違規 | 已部分解決：Vega 於真實網址以 Chrome 實測 CSP 擋下 inline script／style／外部 fetch，HSTS `max-age=31556952`，Enforce HTTPS 已開（5.8，轉達）。仍未驗證：HSTS 預載；meta CSP 無法設定的 `frame-ancestors` 等指令與缺少的安全標頭（官方文件未說明 Pages 是否能自訂標頭） | Vega 第 6 項 |
| U3 | repo 設定的目前值（`main` 保護、secret scanning、Actions 限制、environments） | 17:28–17:35 基線之後，只有 `github-pages` environment（Vega 匿名讀回）與 GeorgeAI 的讀回（secret scanning、push protection、Pages 設定）；Vega 無認證讀不到 secret scanning、push protection、Actions 限制與 `main` 保護，沒有獨立重查；`can_admins_bypass` 已於 19:36 改為 false（GeorgeAI 讀回），沒有獨立重查 | Vega 第 8 項 |
| U4 | 首份正式 v3 晨報（預計 2026-11-20 02:00 產生）的內容與網站建置 | v3 結構只以固定 commit 的演練快照驗證 | Lin、Rigel |
| U5 | `github-pages` environment 在 Pages 來源設為 Actions 時會不會自動建立並限制分支 | 部分解決：Vega 匿名讀回該 environment 的分支政策僅 `main`（轉達）；自動建立與否的行為沒有實測 | Vega 1-F |
| U6 | fork PR 能不能取得 OIDC `id-token`；PR 的 cache 會不會影響 `main` | 依官方文件推論，沒有實測 | Vega 1-F、1-G |
| U7 | 個人帳號 repo 的 ruleset 能不能把 deploy key 加進 bypass list（方案 B） | Vega 沒有打開設定頁確認 | Vega 第 8 項 |
| U8 | 螢幕閱讀器朗讀、真實手機（實機）、Firefox、Safari 等其他瀏覽器、真實 200% 縮放、深色模式逐頁目視、搜尋錯誤分支 | 沒有該些工具與裝置；200% 以 180px 視窗模擬；PR #8 的審查也沒有涵蓋這些 | Iris U2–U6 |
| U9 | CSS 總量 ≤ 30 KB、16px 狀態圖示可辨度、行寬 40em 的閱讀舒適度 | 設計目標，沒有量測或使用者測試 | Iris U7–U9 |
| U10 | WCAG 技術編號（SCR39／H 技術）；GitHub Docs 專案站台頁整段文案 | 沒有逐條查證 | Iris U10、U11 |
| U11 | Vega 報告列出的 GitHub Docs、MDN、W3C、npm、OWASP、markdown-it 連結內容 | Vega 沒有逐頁打開核對；我撰寫時也沒有 | Vega 未驗證第 8 點；本文件第 6 章 |
| U12 | gitleaks 只用預設規則；客戶資訊的結論是「沒有發現跡象」，不等於保證沒有 | 工具與關鍵字無法列舉所有客戶名稱 | Vega 未驗證第 9 點 |
| U13 | `actions/*` 的程式碼本身；`node20` 在 runner 的淘汰時程 | 只核對 SHA 與 tag 對應；沒有查淘汰時程 | Vega 未驗證第 10、11 點 |
| U14 | Iris 與 Rigel 的審查腳本（自寫爬蟲、CDP、Playwright 腳本） | 沒有進 repo，別人要重現需另外取得 | Iris U12、Rigel 3 |
| U15 | 手動三態主題切換、列印樣式 | 選配，沒有實作 | Lin |
| U16 | commit 作者資訊：PR 的 commit 作者仍是公司網域的個人信箱（公開可見） | 不是機密，改寫歷史是破壞性操作；Vega 不建議為此改寫，之後的 commit 建議改用 GitHub noreply 位址，由 George 決定 | Vega 基線 L1、審查第 7 項 |
| U17 | 角色分工段已於 PR #8 移除 | 結果來自 Ada 轉達；GeorgeAI 對 George 原話的解讀（指團隊新增成員）沒有向 George 另外確認；我沒有檢查 `main` 上 `about.html` 的實際內容 | GeorgeAI、Ada |
| U18 | Iris R1–R10 的處理 | R1–R9 已於 PR #8 修正並經 Iris 複審通過（轉達，我沒有讀到複審報告）；R10 維持現狀；PR #8 後新增的 N1–N4 已由 PR #11 處理並合併（Rigel、Vega、Iris 審查通過，轉達） | Iris、Ada |
| U19 | 本文件第 5.5 節 D1–D11 的對不上項目 | 未有人確認，我沒有自行選邊 | 本文件 |
| U20 | 本文件第 6 章「套用到別的專案」 | 依本專案經驗整理，沒有在別的專案實際套用 | 本文件 |
| U21 | 本文件第 3 章指令 | 為他人實跑過的指令，我沒有重新執行 | 本文件 |
| U22 | PR #7、#8、#9 的合併資訊與 PR #8 審查結果：PR #7 18:18、merge commit `d87a3d4`、run `44504392224` success；PR #9 18:47:00、merge commit `8ebfb4f`、run `44508844375` success；PR #8 18:47:14、merge commit `60afd0c`、run `44508880363`；PR #8 的 Rigel、Vega、Iris 結論；18:48 時 Pages 未開、repo 設定未動、`PAGES_DEPLOY_ENABLED` 未設（之後的變化見 U23） | 全部來自 Ada 轉達，我沒有自行查詢，也沒有讀到 PR #8 審查者的原始報告。run `44508880363` 已有結果：Static site completed／success（18:47:33 完成，build success、deploy skipped；Rigel 匿名 API 核實，Ada 轉達）；Pages 啟用後的狀態見 U23 | Ada、GeorgeAI、Lin、Rigel、Vega、Iris |
| U23 | PR #10 合併（merge commit `4dc0e1e`、18:58:24、run `44510546695` success）；Pages 啟用（19:06–19:08）、手動部署 run `44511889159`（head `4dc0e1e`，build 19:07:38、deploy 19:07:58 success）；`PAGES_DEPLOY_ENABLED` 於 19:18 設為 true（讀回值，GeorgeAI 回報） | 來自 Ada 轉達 GeorgeAI 回報與 Rigel、Vega 的讀回，我沒有自行查詢 | Ada、GeorgeAI、Rigel、Vega |
| U24 | secret scanning 與 push protection 已開 | 只有 GeorgeAI 讀回；Vega 無認證讀不到，沒有獨立驗證 | GeorgeAI、Vega |
| U25 | 自動部署後線上頁面的狀態，以及真實網址上仍未驗證的項目：R2、R3、R5（部分通過）、R7、R9、卡片表 O2；實機、Firefox、Safari、螢幕閱讀器；HSTS 預載 | 首次自動部署 run `44516322502` 成功（GeorgeAI 回報），但 run `44516338006` 結果未確認、線上頁面未重檢；線上只有舊版單檔 2026-11-19、沒有 v3 資料，需 2026-11-20 02:00 首份 v3 後補驗；其餘沒有工具與裝置 | Iris、Vega、GeorgeAI |
| U26 | PR #11 與 PR #12 的審查結果（已通過）與仍未驗證的部分 | PR #11（head `841556ed27e18832ce33275d7d7b8bb0315945d3`）已合併；Rigel 驗證全數通過、Vega 安全審查四項全通過、Iris 設計審查通過、Rigel 審查 PR #12 通過，全部為各人回報、Ada 轉達，我沒有讀到原始報告；Iris 未驗證螢幕閱讀器、Firefox、Safari、真實手機、200% 縮放、卡片 hover、線上網址、CI，v3 正式資料產出後要再看線上卡片表；Rigel 未驗證實機手機、螢幕閱讀器；合併後線上頁面未重檢 | Rigel、Vega、Iris、Ada |
| U27 | 5.8 的真實網址驗證結果 | 全部是 Ada 轉達 Rigel、Vega、Iris 的報告，我沒有自行連線，也沒有讀到原始報告 | Rigel、Vega、Iris、Ada |
| U28 | Ada 與 George-palsys 的 GitHub 連線範圍；Lin 使用的 ChatGPT GitHub 連接器可寫哪些 repo | 連線已開（George 裁示「給」），範圍為 George 本人帳號下所有 repo，使用規則另訂；連接器可寫範圍只有 George 能在 GitHub Settings → Applications 查，沒有人查過 | Ada、George |
| U29 | PR #13 的三方審查與尚未合併的狀態 | Rigel、Vega、Iris 審查結果皆為 Ada 轉達；PR #13 尚未合併，合併後線上頁面是否如預期（關於頁、空清單隱藏、Tab 停點）沒有人驗證；Vega 與 Iris 未驗證螢幕閱讀器、Firefox、Safari、實機、200% 縮放、關閉 JS、線上頁面；Iris 的「無 JS 時 360 分頁列無 Tab 停點」未驗證 | Rigel、Vega、Iris、Ada |
| U30 | `can_admins_bypass` 改為 false 的結果 | 只有 GeorgeAI 於 19:36 讀回 false；Vega 沒有獨立重查 | GeorgeAI |
| U31 | repo 內文件對 GeorgeAI 與成員名稱的敘述是否中性化 | Vega 回報 `docs/implementation` 紀錄、`SPEC.md`、`products.yaml` 仍含 GeorgeAI 與成員名稱、排程時間（無機密）；George 尚未決定 | Vega、George |
| U32 | 本版（第四版）的內容 | 全部是各人回報、Ada 轉達，我沒有自行重跑、連線或讀原始報告 | Ada、Quill |

---

## 9 變更紀錄

只往後加，不改寫過去的記載。

| 日期 | 內容 | 相關 PR | 撰寫 |
| --- | --- | --- | --- |
| 2026-11-19 | 建立本文件：記錄晨報 GitHub Pages 靜態網站（PR #7，commit `b2ed6f63d76c5ac3ddd8c11c57a2f922fae1dab2`）的實作、驗證與審查結果。當時 PR #7 open、未合併、Pages 未開啟。 | PR #7 | Quill |
| 2026-11-19 | 合併 PR #7（18:18，merge commit `d87a3d4ed15fbb00ebcc14e0af2c5e3a369c053c`），依 Leader 自行合併規則 | PR #7 | GeorgeAI |
| 2026-11-19 | 補記合併結果、失敗即停為 GeorgeAI 的決定與處理方式、D8 角色分工段改為移除（進行中）、第 8 章更正 | 本文件 PR | Quill |
| 2026-11-19 | 合併 PR #9、PR #8（由 Lin 以連線的 GitHub 操作，審查見第 5 章）：PR #9 18:47:00、merge commit `8ebfb4fb1ca783e612a31e0ff51a828e155aa065`；PR #8 18:47:14、merge commit `60afd0ce17a4d59a98ff4a364adf4040453034eb` | PR #8、PR #9 | Ada |
| 2026-11-19 | 文件更新（18:48）：補 PR #8、#9 合併與 CI 狀態；第 4 章補 PR #8 的 6 個檔；新增 5.7（PR #8 三方審查與 N1–N4）；5.4、D2、D8 改為已於 PR #8 移除／修正；第 7 章補 N1–N4；第 8 章更新並修正兩處（資料來源改為六份文件、U22 移到 U21 之後）；舊列不動 | 本文件下一個文件 PR | Quill |
| 2026-11-19 | 合併 PR #10（本文件第二版，18:58:24，merge commit `4dc0e1e95b5a367a5ddb8d90b53a0b185c89357f`，main run `44510546695` success） | PR #10 | GeorgeAI |
| 2026-11-19 | 啟用 GitHub Pages（19:06–19:08；George 於 19:06 核准「開」）：來源 GitHub Actions、Enforce HTTPS、secret scanning 與 push protection、`github-pages` environment 僅 `main`；手動部署 run `44511889159` | 無（repo 設定） | GeorgeAI |
| 2026-11-19 | 更新 run `44508880363` 結果為 success（18:47:33 完成，Rigel 匿名 API 核實） | PR #8 | Rigel（核實）、Ada（轉達） |
| 2026-11-19 | 真實網址驗證：Rigel 六項全通過；Vega 的 CSP、HSTS、標頭與敏感路徑檢查；Iris 的設計項目（R1、R4、R6、R8 通過，R5 部分通過，其餘待 v3） | 無（網址驗證） | Rigel、Vega、Iris |
| 2026-11-19 | 開立 PR #11（`fix/site-low-risk-n1-n4`，head `841556ed27e18832ce33275d7d7b8bb0315945d3`，N1–N4 小修，未合併、審查中） | PR #11 | Lin |
| 2026-11-19 | 文件更新（19:15）：補 PR #10 合併、run `44508880363` 結果、Pages 啟用與手動部署、PR #11；新增 5.8 真實網址驗證；更新第 1、3.6、4、7、8 章（U1、U2、U3、U5、U22 更新，新增 U23–U27）；舊列不動 | 本文件下一個文件 PR | Quill |
| 2026-11-19 | 開啟自動部署：repo 變數 `PAGES_DEPLOY_ENABLED` 於 19:18 讀回值為 true（George 於 19:06 已核准開 Pages；依據是 Rigel、Vega、Iris 三份線上驗證都通過）；首次自動部署尚未實際跑過，結果未驗證 | 無（repo 設定） | GeorgeAI |
| 2026-11-19 | Vega 完成 PR #11 安全審查：四項全通過、無新風險、可合併（白名單與 CSP 未變、無新依賴、README 無不安全指引、gitleaks 無發現）；更正 PR #8 報告的 N3 敘述：寫死的是 workflow 傳入的 `--base-path` 字串，404 頁本身由參數產生；Rigel、Iris 審查未回報 | PR #11 | Vega |
| 2026-11-19 | 文件更新（19:18）：補自動部署已開（第 3.6 第 6 步、第 4 章、第 7 章第 1 項、U1、U23、U25）；PR #11 補 Vega 審查結果與 N3 更正（第 4 章、5.7 的 N3、第 7 章、U26）；舊列不動 | 本文件下一個文件 PR | Quill |
| 2026-11-19 | Iris 完成 PR #11（head `841556ed27e18832ce33275d7d7b8bb0315945d3`）設計審查：設計上可合併、無擋合併項目；N1 麵包屑各項目在 360／640／768／1280、淺深色下皆 44px 高，N4 卡片外框與多餘 Tab 停點已移除；搜尋頁空 `<ol id="results">` 不併入此 PR；新觀察日報頁 `.tabs-scroll` 在 1280px 仍是 Tab 停點（低風險）；來源為 Iris 回報、Ada 轉達；Rigel 審查未回報 | PR #11 | Iris（回報）、Ada（轉達） |
| 2026-11-19 | 文件更新（19:19）：PR #11 補 Iris 設計審查結果（第 4 章、第 7 章第 8 項、U26）；舊列不動 | 本文件下一個文件 PR | Quill |
| 2026-11-19 | 合併 PR #11（merge commit `4aa9df967884d0c2271eb60505ee9ab1fc76f92b`）與 PR #12（本文件第三版，merge commit `7016ff829185042332ec72124908bac14f2b200c`） | PR #11、PR #12 | GeorgeAI（回報）、Ada（轉達） |
| 2026-11-19 | Rigel 驗證 PR #11 全數通過（4 檔 +37／−1、`npm test` 16 pass、對比 48 組、434 條站內連結斷鏈 0、CI #11 run `44512999987` success）；審查 PR #12 通過（1 檔 577 行 +98／−21、SHA-256 相符、CI #12 run `44514069919` success）；實機手機、螢幕閱讀器未驗證 | PR #11、PR #12 | Rigel（回報）、Ada（轉達） |
| 2026-11-19 | 首次自動部署成功：run `44516322502`（push，head `4aa9df9`），build 19:36:33、deploy 19:36:46 success；run `44516338006` 當時結果未確認，維持未驗證；線上頁面未重檢 | 無（部署） | GeorgeAI（回報）、Ada（轉達） |
| 2026-11-19 | `github-pages` environment 的 `can_admins_bypass` 於 19:36 改為 false（George 裁示「關掉」），部署分支政策仍僅 `main` | 無（repo 設定） | GeorgeAI（操作）、Ada（轉達） |
| 2026-11-19 | Ada 與 George-palsys 的 GitHub 連線已開（George 裁示「給」）；範圍為 George 本人帳號下所有 repo，規則：僅晨報 repo、一律走 PR、不直推 `main`、合併由 GeorgeAI 處理；ChatGPT 連接器範圍未驗證 | 無（授權） | Ada（轉達） |
| 2026-11-19 | Rigel、Scout 暫換 Claude Opus 5.5（Gemini 4 Argon 每週額度用完，11/25 10:19 重置後換回，可還原） | 無（模型設定） | Ada（轉達） |
| 2026-11-19 | George 裁示：「去掉」公開網站的 GeorgeAI 字樣、「關掉」`can_admins_bypass`、「修掉」搜尋頁空 `<ol>` 與日報頁 `.tabs-scroll` Tab 停點、對 ChatGPT 連接器範圍「沒看懂有什麼影響」（已白話說明）、「給」Ada 與 George-palsys GitHub 連線 | 無（裁示） | George（裁示）、Ada（轉達） |
| 2026-11-19 | 開立 PR #13（`fix/site-about-and-a11y`，head `28d2b2bedd4e126e0b50c4fd031beaf7b29c57e7`，6 檔 +65／−11，CI #15 run `44517398962` success）；Rigel、Vega、Iris 三方審查通過，尚未合併；Vega、Iris 的低風險發現與建議見第 7 章第 8 項 | PR #13 | Lin（開立）、Rigel、Vega、Iris（審查）、Ada（轉達） |
| 2026-11-19 | 文件更新（19:49，第四版）：PR #11、#12 已合併、Rigel 審查通過、首次自動部署成功、`can_admins_bypass` 改為 false、GitHub 連線授權、模型暫換、George 裁示、PR #13 三方審查（第 1、3.6、4 章；新增 5.9；第 7 章第 1、6、7、8 項；第 8 章 U1、U3、U18、U25、U26 更新，新增 U28–U32）；舊列不動 | 本文件下一個文件 PR | Quill |
