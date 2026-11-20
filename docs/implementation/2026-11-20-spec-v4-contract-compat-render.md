# 實作紀錄：晨報 SPEC v4 欄位契約（PR #19）、build 版本相容（PR #20）與 v4 畫面渲染（PR #21）

- 紀錄日期：2026-11-20
- Repository：george-palsys/morning-brief-archive
- 紀錄狀態：PR #19、#20、#21、#22、#25 皆已合併；#25 於 2026-11-20 15:13（Asia/Taipei，UTC 07:13:36）合併，main 為 `8f16064511e8fcc2411c0ce80b92fdca83431369`，push 觸發的 run 44693398104 build 與 deploy 皆 success（Quill 以匿名 GitHub API 讀取，見第 9、10 章）。本版新增 PR #22 合併結果、PR #25 與當天兩次 main 建置失敗
- 撰寫：Quill（文件撰寫）。本文件只整理成員報告與公開 API 讀到的內容，Quill 沒有重跑任何建置或測試；未重跑的數字一律標「Rigel 回報」或「Vega 回報」。
- 本文件未驗證、尚未上傳；上傳方式見第 7 章。

---

## 1 目的與範圍

**目的**：晨報 SPEC 從 `spec_version: 3` 升到 4（新增顯示欄位契約），讓網站產生器 `site/build.mjs` 能接受 3 與 4 兩種版本，避免 02:00 排程依新 SPEC 產出 v4 日報後，07:30 推上 main 的 CI 因版本檢查失敗而整站停更；最後由 PR #21 讓 build 把 v4 欄位實際渲染成摘要頁與段落頁畫面。

| 項目 | 內容 |
|---|---|
| PR #19 | 把 SPEC v4 顯示欄位契約併入 `SPEC.md`，並新增範例檔 `site/fixtures/meta.example.yaml`。只改文件與範例，不改產生器 |
| PR #20 | `site/build.mjs` 的版本檢查由只接受 3 改為接受 3 與 4；`site/test.mjs` 新增對應測試 |
| PR #21 | 新增 `site/display-v4.mjs`、`site/display-v4-copy.mjs`，改 `site/build.mjs`、`site/assets/site.css`、`site/assets/toc.js`、`site/contrast.mjs`、`site/test.mjs`、`SPEC.md`（固定文案補充 5 行），讓 `spec_version: 4` 的日報以結構化畫面渲染；舊格式日期（無 `display`）仍走文字標題版面 |
| 不在範圍 | `daily/`、`products/`、`.github/workflows/`、`package.json`、`package-lock.json`、排程設定（PR #21 對前五者 0 diff，Rigel 回報） |
| 不在範圍 | 02:00 收集流程如何產出 v4 資料（見第 8 章 U1） |

---

## 2 環境與版本

| 項目 | 值 | 來源 |
|---|---|---|
| 基準（base）commit | `30b89e49104542633673b58b10c0dea8851385f4`（main） | 兩份 Rigel 報告；匿名 API 讀回兩個 PR 的 base 皆為此值 |
| PR #20 head | `125facf088e4168e7cb863a2fbd878aa072b5c7b`（分支 `fix/accept-spec-v4-metadata`） | Rigel 報告；匿名 API 讀回相符 |
| PR #19 head（合併時） | `576c6392e03ece43dd568e113b26deb3aa9c4bdc`（分支 `docs/morning-brief-spec-v4`） | Rigel 報告；匿名 API 讀回相符 |
| PR #19 先前被審的 head | `eb1f5df1ef503ef9924370ef99f838a4a523b51b` | Rigel 第一份報告（已被 576c639 取代） |
| PR #21 base | `ad993affe8235409c758a25d979f4f98da4ef275`（PR #19、#20 合併後的 main） | Rigel 報告；Vega 報告；匿名 API 讀回相符 |
| PR #21 head（合併前） | `6b582b96bbb780f5ddc39cc124067d10fe2dfa1e`（分支 `feat/render-spec-v4`），共 4 個 commit | Rigel 報告；匿名 API 讀回相符 |
| PR #21 的 4 個 commit | `a69286c0d6572892d265a981b99e67097d42400d`、`29082676cc98ec33e1b9832ec9b662b3e759731a`、`c249a38ba38ff18b99622711d97c15c6aeab1a8e`、`6b582b96bbb780f5ddc39cc124067d10fe2dfa1e` | 匿名 API 讀回；與 Vega 報告列出的短 SHA 相符 |
| PR #21 merge commit | `f99d84c0ca0541fdaa8292ad74f019ea199d77ea` | 匿名 API 讀回；與 Ada 提供值相符 |
| 相依套件 | `markdown-it 15.0.3`、`yaml 2.9.1`；PR #21 沒有新增依賴 | Vega 回報 |
| Rigel 視覺量測環境 | Chromium 1208（playwright-core）、本機 HTTP 伺服器；首屏另以 Chrome Headless 經 CDP 量測 | Rigel 回報（兩份波形複驗報告與 PR #21 驗證報告） |
| 產生器 | Node.js 靜態網站產生器 `site/build.mjs` | 既有 |
| Node.js 版本 | 本機與 CI 的 Node.js 版本未在報告中載明 | 未驗證 |
| 部署 | GitHub Pages，`pages.yml` | 既有 |

---

## 3 實際步驟與完整指令

### 3.1 時間軸

| 順序 | 事件 | 時間（Asia/Taipei） | 來源 |
|---|---|---|---|
| 1 | Atlas 整理 SPEC v4 欄位草案（取代先前被標「已作廢」的舊草案） | 未載明 | SPEC-v4-欄位草案.md |
| 2 | PR #19（head eb1f5df）開立為 Draft | 未載明 | Rigel 報告 |
| 3 | Rigel 第一輪審查 PR #19（head eb1f5df）：契約核對通過，但判定相容性不通過，不可合併 | 2026-11-20 11:15 | pr19-verification-report-rigel.md |
| 4 | 開立 PR #20 修 `site/build.mjs`；PR #19 改為 head 576c639（`digest` 上限補為建議值 ≤ 24、範例值縮短） | 未載明 | Rigel 第二份報告 |
| 5 | Rigel 第二輪複驗 PR #20 與 PR #19 新 head，建議先合 #20 再合 #19 | 2026-11-20 11:25 | pr20-and-pr19-verification-report-rigel.md |
| 6 | PR #20 合併為 `6f6759dab63350281bef0da0c20ec2d41d006899` | 11:18:50（API 為 03:18:50Z） | 匿名 API，Quill 讀取 |
| 7 | PR #19 合併為 `ad993affe8235409c758a25d979f4f98da4ef275` | 11:20:22（API 為 03:20:22Z） | 匿名 API，Quill 讀取 |
| 8 | Iris 完成設計規格 v5（`morning-brief-build-design-spec-v5.md`），main 已含 SPEC v4 | 檔案時間 11:29 | Iris 規格檔 |
| 9 | PR #21 開立為 Draft（base 為 `ad993af`），共 4 個 commit | 未載明 | Rigel 報告、Vega 報告 |
| 10 | Rigel 對 c249a38 做波形補驗（發現 A：E2 跳第 11 則標成第 12 峰；發現 B：程式找 `h3`、實際標題是 `h2`） | 未載明 | pr21-wave-reverify-c249a38-rigel.md |
| 11 | Rigel 對 6b582b9 做第三輪波形補驗（上述兩項發現消失） | 未載明 | pr21-wave-reverify-6b582b9-rigel.md |
| 12 | Vega 安全審查 PR #21（head 6b582b9） | 12:03–12:15 | pr21-security-review-vega.md |
| 13 | Rigel 驗證 PR #21（head 6b582b9），結論通過、建議合併 | 12:15 | pr21-verification-report-rigel.md |
| 14 | PR #21 合併為 `f99d84c0ca0541fdaa8292ad74f019ea199d77ea` | 12:20:03（API 為 04:20:03Z） | 匿名 API，Quill 讀取 |

註：第 6、7 列的合併時間早於 Rigel 第二份報告上標示的審查時間 11:25，兩者時間先後原因未查明，兩個時間各依來源照錄，不推測（見 5.7 的 D1）。

### 3.2 合併順序與原因

| 順序 | PR | 原因 |
|---|---|---|
| 先 | #20 | 讓 main 的 `build.mjs` 先具備接受 spec_version 3 與 4 的能力 |
| 後 | #19 | #19 併入後，02:00 排程會依新 SPEC 產出 `spec_version: 4` 日報；若 #19 先合而 #20 未合，07:30 推上 main 時 `npm run build` 會在版本檢查拋出「meta.yaml 日期、版本或檢查數無效」，整站發布失敗（Rigel 第一份報告以原始碼與本機建置實測推導，未實際跑排程） |

| 最後 | #21 | #21 把 build 改成渲染 v4 欄位，base 必須已含 SPEC v4（#19）與版本相容（#20）；Rigel 驗證報告以 `ad993af` 為 base，並明寫 #19、#20 已先在 main |

#19 與 #20 變更檔案互不重疊，Rigel 模擬依序合併 0 衝突。#21 與 #19 都改 `SPEC.md`，#21 以 `ad993af`（已含 #19）為 base，匿名 API 讀回 PR #21 `mergeable_state` 為 clean（Vega 回報）。

### 3.3 `build.mjs` 修改內容（來源：Rigel 報告）

| 項目 | 修改前 | 修改後 |
|---|---|---|
| 版本檢查（約第 130 行） | `meta.spec_version !== 3` 即拋錯 | 改為 `![3, 4].includes(meta.spec_version)` 才拋錯 |
| 接受 | 3 | 3、4（數字） |
| 拒絕 | 3 以外所有值 | 2、5、字串 `"4"` |

### 3.4 複驗指令（Rigel 在乾淨 clone 執行；以下為指令本身，Quill 未重跑）

在 Windows PowerShell 或 Git Bash 執行；Git Bash 需先設 `MSYS_NO_PATHCONV=1`，否則 `--base-path` 會被路徑轉換。

安裝依賴：

```
npm ci --ignore-scripts
```

對比度檢查：

```
npm run check:contrast
```

測試：

```
npm test
```

建置：

```
npm run build -- --base-path /morning-brief-archive/
```

版本相容實驗（Rigel 暫時把 `daily/2026-11-19/meta.yaml` 的 `spec_version` 改為 4，建置後以 git 還原）：

```
node site/build.mjs --base-path /morning-brief-archive/
```

還原實驗用的暫改：

```
git checkout -- daily/2026-11-19/meta.yaml
```

---

### 3.5 PR #21 的複驗指令（Rigel 與 Vega 在乾淨 clone 執行；Quill 未重跑）

Rigel 對 PR #21 執行與 3.4 相同的四項指令，指令本身見 3.4。Vega 另外執行下列兩項：

稽核依賴：

```
npm audit
```

以 gitleaks 掃描 PR 範圍的 git 歷史：

```
gitleaks git ad993af..6b582b9
```

Rigel 的視覺量測使用 Chrome Headless 與 DevTools Protocol，量測腳本不在本紀錄範圍，未收錄；Vega 的證據檔（注入腳本、輸出與掃描結果）在其工作資料夾 `pr21-evidence`，本紀錄不引用其路徑。

---

## 4 產出清單與位置

### 4.1 PR 與 commit

| 項目 | PR #20 | PR #19 |
|---|---|---|
| 標題 | fix: 讓晨報網站接受 v3 與 v4 日報 | docs: 併入晨報 SPEC v4 顯示欄位契約 |
| 分支 | `fix/accept-spec-v4-metadata` | `docs/morning-brief-spec-v4` |
| head | `125facf088e4168e7cb863a2fbd878aa072b5c7b` | `576c6392e03ece43dd568e113b26deb3aa9c4bdc` |
| merge commit | `6f6759dab63350281bef0da0c20ec2d41d006899` | `ad993affe8235409c758a25d979f4f98da4ef275` |
| 合併時間 | 2026-11-20 11:18:50（Asia/Taipei） | 2026-11-20 11:20:22（Asia/Taipei） |
| 合併後 main 的 workflow run | 44666870294，success | 44667045006，success |
| 合併者 | 未查證 | 未查證 |

### 4.1.1 PR #21 的 PR 與 commit

| 項目 | PR #21 |
|---|---|
| 標題 | feat: 以 SPEC v4 資料建置晨報摘要與段落頁 |
| 分支 | `feat/render-spec-v4` |
| head（合併前） | `6b582b96bbb780f5ddc39cc124067d10fe2dfa1e` |
| merge commit | `f99d84c0ca0541fdaa8292ad74f019ea199d77ea` |
| 合併時間 | 2026-11-20 12:20:03（Asia/Taipei） |
| commit 數 | 4 |
| 合併後 main 的 workflow run | 44673700126，completed／success；build job 與 deploy job 皆 success（匿名 API，Quill 讀取） |
| 合併者 | 未查證 |

### 4.2 變更檔案

| PR | 檔案 | 變更 | 行數 | 來源 |
|---|---|---|---|---|
| #20 | `site/build.mjs` | 版本檢查改接受 3 與 4 | 與 test.mjs 合計 +15／−1 | Rigel 回報 |
| #20 | `site/test.mjs` | 新增測試「daily metadata accepts numeric v3 and v4, rejects unsupported versions」 | 新增 14 行（Rigel 回報） | Rigel 回報 |
| #19 | `SPEC.md` | 併入 v4 欄位契約 | +131／−5（head eb1f5df 時的數字） | Rigel 第一份報告 |
| #19 | `site/fixtures/meta.example.yaml` | 新增範例檔 | +198／−0（head eb1f5df 時的數字） | Rigel 第一份報告 |

PR #21 的 8 個變更檔（行數來自匿名 API 的逐檔讀回，Quill 讀取；Rigel 報告逐檔數字與此相同）：

| PR | 檔案 | 變更 | 行數 |
|---|---|---|---|
| #21 | `SPEC.md` | 新增「固定文案補充」段落 5 行（重點警示標籤、分數條標籤兩項，標「預設值，待 George 確認」） | +5／−0 |
| #21 | `site/assets/site.css` | 新增 v4 摘要頁與段落頁樣式 | +183／−0 |
| #21 | `site/assets/toc.js` | 新增標題帶波形與頂列迷你波形的捲動同步、錨點處理 | +86／−0 |
| #21 | `site/build.mjs` | v4 日期改走新的渲染路徑；v4 段落頁、`<body class="spec-v4">` | +59／−6 |
| #21 | `site/contrast.mjs` | 新增 v4 色彩配對 11 組檢查（淺、深色各一次，對比門檻 4.5） | +3／−0 |
| #21 | `site/display-v4-copy.mjs` | 新檔：畫面固定文案集中於此，與呈現程式分開 | +16／−0 |
| #21 | `site/display-v4.mjs` | 新檔：讀取並驗證 `display`、組出 v4 面板與項目 HTML | +145／−0 |
| #21 | `site/test.mjs` | 新增 v4 fixture 測試與 E1 至 E8 極端資料測試 | +132／−0 |

逐檔相加：新增 629 行、刪除 6 行，與 API 對整個 PR 的 +629／−6 相同。Rigel 先前摘要的 +444 是彙整標題筆誤，已查明，見 5.12。

註：PR #19 在 head 改為 576c639 後，兩檔實際行數未重新量測；Ada 指派的數字與 eb1f5df 相同，改版後是否變動為未驗證（見 U6）。

### 4.3 Rigel 確認未動到的項目

| 項目 | PR #20 | PR #19 |
|---|---|---|
| `site/assets/site.css` | 0 diff | 0 diff |
| `site/assets/search.js`、`site/assets/toc.js` | 0 diff | 0 diff |
| `daily/`、`products/` | 0 diff | 0 diff |
| `.github/workflows/` | 0 diff | 0 diff |
| `site/build.mjs` | 有改 | 0 diff |

PR #21 確認未動到的項目（Rigel 回報 `git diff ad993af..6b582b9` 為空；Vega 回報依賴與 workflow 差異為 0）：

| 項目 | PR #21 |
|---|---|
| `daily/` | 0 diff |
| `products/` | 0 diff |
| `.github/` | 0 diff |
| `package.json` | 0 diff |
| `package-lock.json` | 0 diff |
| `items.jsonl` | 0 diff |
| `state/` | 0 diff |

---

## 5 驗證與審查結果

### 5.1 SPEC v4 新增與沿用欄位（依 Rigel 對 SPEC.md 的核對與 Atlas 草案整理）

| 欄位／規則 | 必填 | 限制 | 缺值時 | 來源編號 |
|---|---|---|---|---|
| `spec_version` | 必填 | 值為 4 | 不適用 | — |
| `attention.title` | 必填（`attention` 存在時） | 字串，顯示寬度 ≤ 40 | 建置失敗 | E-1 |
| `attention.summary` | 必填（`attention` 存在時） | 字串，顯示寬度 ≤ 200，須取自指定段落原文 | 建置失敗 | E-1 |
| `display.cve[].exploited_detail` | 選填 | 字串，無上限 | 使用固定文案表 | E-2 |
| `display.cve[].patch_detail` | 選填 | 字串，無上限 | 使用固定文案表 | E-2 |
| `display.ai_summary` | 選填 | 字串，顯示寬度 ≤ 60 | AI 頁導言只顯示「今天 N 則。」 | E-6 |
| `drill` | 選填 | 布林，預設 false | 視為正式資料，不顯示演練免責聲明 | E-7 |
| `display.<段落>[].caveat` | 選填 | 字串，無上限，所有段落共用 | 隱藏注意區塊 | E-9 |
| `display.<段落>[].digest` | 選填 | 字串，長度上限建議值 ≤ 24，待 George 確認 | 摘要頁顯示 Markdown 完整標題 | E-12、E-14 |

### 5.2 不新增欄位、只調整產生器或規格文字的決定

| 決定 | 內容 | 來源編號 |
|---|---|---|
| CVE 分數條缺值 | `cvss` 為空時，分數條灰色，右側寫「未提供」 | E-3 |
| KEV | 逐筆顯示「產品（CVE 編號）YYYY-MM-DD 到期」，不產生跨筆到期摘要；清單缺少或為空則隱藏 | E-4 |
| 頂層產品欄位 | `products_updated`、`products_unconfirmed` 等 v3 既有頂層欄位名稱與算法沿用 | E-5 |
| 蒐集時間 | 每天從 `collected_at` 顯示台灣時間時:分；免責聲明只在 `drill: true` 顯示 | E-7 |
| 段落頁 `<title>` | 「{段落名}－{date} 晨報」 | E-8 |
| 前一天連結 | 前一天資料夾不存在就隱藏 | E-10 |
| 清單維護、搜尋連結 | 連到當天 `maintenance.html` 與全站 `search/index.html` | E-11 |
| 影響標籤 | 「影響：」與「對我們的影響：」視為同一條目標籤；只辨識已定義結構化標籤，不用正規表示式猜自由文字；CSP 不變 | E-13 |
| 產品副標單位 | 「3 項產品」副標以 `products_updated` 陣列長度（產品數）計，不用版本更新筆數 | E-15 |

固定文案對照表（`exploited_detail`／`patch_detail` 缺值時使用，來源為 Atlas 草案，標示為建議值）：

| enum | 固定文案 |
|---|---|
| `exploited: confirmed` | 已遭利用 |
| `exploited: poc` | PoC 已公開 |
| `exploited: none_seen` | 未見攻擊 |
| `exploited: unknown` | 攻擊現況未寫明 |
| `patch: released` | 有修補 |
| `patch: hotfix` | 只有 hotfix |
| `patch: pending` | 修補準備中 |
| `patch: none` | 無修補 |
| `patch: unknown` | 修補狀況未寫明 |

### 5.3 驗證與審查結果

| 項目 | 結果 | 證據與來源 | Quill 是否重跑 |
|---|---|---|---|
| PR #19 E-1 至 E-15 共 15 項逐條核對 | 全數通過 | Rigel 第一份報告（head eb1f5df） | 否 |
| PR #19 範例檔與 SPEC.md 一致、`spec_version` 為 4、無密碼或金鑰字串 | 通過 | Rigel 第一份報告 | 否 |
| PR #19 新 head 576c639：`digest` 上限一致訂為建議值 ≤ 24，範例值改為 20 顯示寬度；仍為 Draft；只改 2 檔 | 通過 | Rigel 第二份報告 | 否 |
| PR #19 第一輪相容性 | 不通過：現行 `build.mjs` 只接受 3，v4 日報會讓 build 失敗，不可先合 | Rigel 第一份報告；以原始碼與暫改 `spec_version` 的本機建置實驗推導 | 否 |
| PR #20 `npm ci --ignore-scripts` | added 8 packages，0 vulnerabilities | Rigel 回報 | 否 |
| PR #20 `npm run check:contrast` | CONTRAST OK，48 組色彩配對（淺色與深色） | Rigel 回報 | 否 |
| PR #20 `npm test` | 27 項，pass 27，fail 0 | Rigel 回報 | 否 |
| PR #20 `npm run build` | 40 HTML 頁；26/26 產品頁；2 份日報；9 筆搜尋項；1 個既有警告；mode=production | Rigel 回報 | 否 |
| `spec_version` 暫改為 4 後建置 | 建置通過：40 HTML 頁；26/26 產品頁；2 份日報；9 筆搜尋項；1 個既有警告；mode=production | Rigel 回報 | 否 |
| `spec_version` 為 2、5、字串 `"4"` | 拋出預期例外而失敗 | Rigel 回報 | 否 |
| 兩個 PR 模擬依序合併 | 0 衝突；合併後 `npm test` 27 項通過、`npm run build` 40 頁 | Rigel 回報 | 否 |
| PR #20 合併後 main 的 workflow run 44666870294 | completed／success | 匿名 GitHub API，Quill 讀取 | 是（只讀取） |
| PR #19 合併後 main 的 workflow run 44667045006 | completed／success | 匿名 GitHub API，Quill 讀取 | 是（只讀取） |
| 兩個 PR 的合併狀態、merge commit、head SHA | 與 Ada 提供的數字一致 | 匿名 GitHub API，Quill 讀取 | 是（只讀取） |

### 5.4 審查者與結論

| 階段 | 審查者 | 對象 | 結論 |
|---|---|---|---|
| 1 | Rigel | PR #19 head eb1f5df | 契約核對通過；相容性不通過，需先修 `build.mjs` |
| 2 | Rigel | PR #20 head 125facf | 通過 |
| 3 | Rigel | PR #19 head 576c639 | 通過；建議合併順序為先 #20 再 #19 |
| — | Vega、Iris | PR #19、PR #20 | 本次提供的資料中沒有這兩位對這兩個 PR 的審查報告，未驗證 |

### 5.5 規劃文件的角色

Atlas 的欄位草案是 Lin 併入 SPEC.md 的依據。草案載明：E-1 至 E-11、E-13 為 George 逐字同意；E-12、E-14、E-15 以及各欄位的長度上限、欄位名稱、固定文案表等，是 GeorgeAI 依 George 指示（「併入合併，趕快做」）先採用的建議值，不是 George 逐字指定的內容，日後可改。

### 5.6 與先前記錄的差異

Rigel 第一份報告寫 `digest` 上限為「長度上限待定」，第二份（head 576c639）改為「建議值 ≤ 24，待 George 確認」。本文件以第二份為準，並在第 8 章保留待確認狀態。

### 5.7 報告間不一致與未能解釋之處

| 編號 | 內容 | 處理 |
|---|---|---|
| D1 | API 顯示兩個 PR 合併於 11:18:50 與 11:20:22，Rigel 第二份報告標示審查時間 11:25，且報告內寫「PR #20 尚未於遠端點擊合併」 | 兩個時間各依來源照錄；先後原因未查明，可能是報告時間標示與實際撰寫時間不同，未驗證 |
| D2 | Rigel 第一份報告寫 `ai_summary` 範例為 24 字元，Atlas 草案範例句更長 | 兩者引用的版本可能不同，未比對，未驗證 |
| D3 | `npm test` 數量：PR #19 第一輪在 main 基準上為 26 項，PR #20 加了 1 項測試後為 27 項 | 差異來自新增測試，不矛盾 |
| D4 | 兩個 PR 的 +行數來自報告，PR #19 head 更新後未重量 | 見 U6 |
| D5 | PR #21 行數：API 與 Vega 為 +629／−6，Rigel 先前摘要寫 +444／−6，但 Rigel 的逐檔數字相加為 +629／−6 | 已查明：+444 為彙整標題筆誤，實際 +629／−6，見 5.12 |
| D6 | `digest` 適用段落：SPEC.md 寫「新知識、台灣 IT、AI」，Iris 規格 6.2 寫「全部」，Lin 程式為 `['knowledge','taiwan','ai']` | 見 5.13，待 George 決定，Quill 不選邊 |
| D7 | Rigel 的 Chromium 首屏量測 26 格底部 785.77px，Iris 規格預算 798px；首屏餘裕 14px | 已查明：14px 出處為 Iris 設計審查 A1（26 格最後一格底緣 786px，限額 800px，餘裕 14px，預算 798px）；Rigel 實測 785.77px，兩者為不同量測，見 5.11、U18 |

### 5.8 v4 欄位與畫面對應（PR #21）

依據：Iris 設計規格 v5 第 4 至 7 節（設計目標）、Rigel 與 Vega 對程式與建置結果的回報。「是否已驗證」欄只填有人實際量測或測試過的內容。

| 欄位 | 摘要頁（index.html） | 段落頁 | 是否已驗證 |
|---|---|---|---|
| `attention.title`、`attention.summary` | 重點警示的標題與摘要，兩欄版面左側主欄 | 不顯示 | Rigel：v4 fixture 測試通過；首屏量測重點警示高 139.11px |
| `attention.facts[]`（label、value、選填 source） | 重點警示右側 facts 格，0 至 4 項 | 不顯示 | Rigel：E7 通過 |
| `attention.section` | 重點警示連到該段落頁 | 不顯示 | 只有 Vega 的負面測試（`../x` 被拒）；畫面連結未另列驗證 |
| `display.cve[].short`、`cve_ids`、`cvss[]` | CVE 面板：項目名、CVE 編號 chip、每個來源一條分數條 | CVE 頁：CVSS 區 | Rigel：E6 三個來源分數條保留標籤與寬度，通過 |
| `display.cve[].exploited`、`patch` | 兩個狀態 chip，文字取固定文案表 | 兩個狀態列 | Vega：列舉值外與 `__proto__` 等輸入被拒；Rigel：建置通過 |
| `display.cve[].exploited_detail`、`patch_detail` | 不顯示 | 狀態 chip 旁的說明行 | 本紀錄沒有對應的畫面量測，未驗證 |
| `display.cve[].kev[]` | 不顯示 | KEV 列：「產品（CVE 編號）YYYY-MM-DD 到期」逐筆一列 | 本紀錄沒有對應的畫面量測，未驗證 |
| `display.ai_summary` | AI 面板一行摘要 | AI 頁導言 | Rigel：E1 空 AI 段落通過；有值畫面未另列驗證 |
| `display.<段落>[].digest` | 新知識、台灣 IT、AI 面板第二行（程式依 SPEC 範圍） | 不顯示（段落頁一律完整標題） | 範圍有差異，見 5.13 |
| `display.<段落>[].caveat` | 不顯示 | 注意區塊 | 本紀錄沒有對應的畫面量測，未驗證 |
| `display.<段落>[].figures[]` | 不顯示 | 關鍵數字區，0 至 3 項 | 本紀錄沒有對應的畫面量測，未驗證 |
| `display.<段落>[].keyword` | 不顯示 | 背景浮水印字；Vega 確認限制為 `^[a-z0-9]{1,8}$` 並跳脫輸出 | Vega 負面測試通過 |
| `display.taiwan[].kind` | 台灣 IT 面板的類型標籤 | 標籤列 | Vega：列舉外被拒；畫面未另列驗證 |
| `drill` | 演練聲明（僅 `true`） | 同左 | 本紀錄沒有對應的畫面量測，未驗證 |
| `products_updated`、`products_unconfirmed` | 26 項產品格的狀態 | 不顯示 | Rigel：E3、E4 通過；首屏量測 26 格底部 785.77px |

### 5.9 缺值行為（PR #21 的實測）

| 情況 | 預期畫面 | 實測 | 來源 |
|---|---|---|---|
| E1：某段落 0 則 | 該段則數顯示 0，段落頁顯示「今天沒有」，無波形 | 通過；另 Rigel 實測 E1 無迷你波形 | Rigel 回報 |
| E2：CVE 12 則 | 段落頁 12 張卡片與 12 個錨點，摘要頁 CVE 面板只列 4 則 | 通過；另測依序跳 #item-1 至 #item-12，大波形與迷你波形的峰都依序為 1 至 12，1280 與 390 兩種寬度皆然（6b582b9） | Rigel 回報 |
| E3：26 項產品全部有更新 | 26 格全部標示 updated | 通過 | Rigel 回報 |
| E4：26 項產品全部無更新 | 無 updated 標示、版面完整 | 通過 | Rigel 回報 |
| E5：標題 80 字 | 長標題完整保留，不破版 | 通過 | Rigel 回報 |
| E6：3 個不同來源的 CVSS | 三條分數條各自保留標籤與比例寬度 | 通過 | Rigel 回報 |
| E7：沒有 `attention.facts` | 警示區不留空欄，佔滿整列 | 通過；`with-facts` class 移除 | Rigel 回報 |
| E8：`display` 整段缺少（v3 舊格式） | 退回文字標題版面，不報錯 | 通過（不阻擋合併）；沒有 26 格產品格，見 5.11 | Rigel 回報 |
| `exploited` 為 `__proto__`、`constructor`、`patch` 為 `toString` | 建置失敗 | 皆被拒 | Vega 回報 |
| `keyword` 含引號、`score` 為 1e308、`kind` 不在列舉、`attention.section` 為 `../x` | 建置失敗 | 皆被拒 | Vega 回報 |
| 關閉 JavaScript | 內容完整可讀 | 通過：`main`、重點警示與則數列可見，5 個段落面板完整渲染 | Rigel 回報 |
| `prefers-reduced-motion: reduce` | 無動畫 | 通過：動畫執行中元素 0 個；迷你波形無過場（transition 0s） | Rigel 回報 |
| 390 寬手機 | 無橫向溢位 | 通過：`scrollWidth` 390，橫向溢位元素 0 個 | Rigel 回報（Chromium 模擬，非實機） |
| 淺色與深色切換 | 背景色正確 | 通過：淺色 `rgb(255, 255, 255)`，深色 `rgb(13, 17, 23)` | Rigel 回報 |

### 5.10 四關審查結論（PR #21，head 6b582b9）

| 關 | 審查者 | 對象 | 結論 | 內容摘要 | 來源 |
|---|---|---|---|---|---|
| 驗證 | Rigel | head 6b582b9 | 通過，建議可以合併 | 四項指令全通過：`npm ci --ignore-scripts`（0 vulnerabilities）、`check:contrast` 70 組、`npm test` 36 項 pass、`npm run build` 40 頁 HTML、26/26 產品頁、2 份日報、9 筆搜尋項、1 個既有警告；E1 至 E8 通過；首屏、390 寬、深淺色、reduced motion、無 JS 通過；Lin 的 6 張截圖檔存在 | Rigel 驗證報告，審查時間 12:15 |
| 驗證（波形補驗） | Rigel | c249a38、6b582b9 | 6b582b9 通過 | c249a38 的發現 A、B 在 6b582b9 消失；`npm test` 36/36 | Rigel 兩份波形複驗報告 |
| 安全 | Vega | head 6b582b9，範圍 `ad993af..6b582b9`，4 個 commit、8 檔 | 通過，高、中、低風險發現皆 0；2 項參考事項不影響合併 | XSS 與跳脫、CSP 不變、`toc.js` 的 DOM 寫入、路徑與檔案處理、供應鏈、機密（gitleaks v8.30.1 無發現）、ReDoS 七項皆通過；40 頁含 v4 注入測試建置成功；`npm audit` 0 | Vega 安全審查報告，12:03 至 12:15 |
| 設計 | Iris | 規格 v5；對 PR #21 的設計審查 | 不擋合併；L1 至 L7 皆為後續項目 | 驗收 A1、A2、A3、A4、A5、A8、A10 通過，A6 未驗證，A7、A9 部分通過；斜切為選做。L1 至 L7 內容見 5.11 | Iris 回報，由 Ada 轉述（Quill 未直接取得 Iris 原報告），見 U13 |

### 5.11 後續項目逐項

#### Vega 的兩項參考事項（不影響合併；Vega 回報）

| 編號 | 位置 | 內容 | Vega 建議 | 狀態 |
|---|---|---|---|---|
| R1 | `site/display-v4.mjs` 第 99 行 | 輸出 `copy[field][value]` 時未經 `esc()`。目前安全，因為第 66 行以 `Object.hasOwn` 把值限制為固定列舉；`renderEntry` 是 export 出去的函式，安全性依賴「呼叫前一定已執行 `readDisplay` 驗證」 | 改成 `esc(copy[field][value])`，class 也套用 `esc()`，作為縱深防禦 | 合併時未處理；後續是否修改未驗證 |
| R2 | `site/build.mjs` 第 106 至 115 行 | 來源連結的顯示文字被前面的說明文字取代：寫成「來源：官方公告 [https://x](https://x)」時，畫面只顯示「官方公告」，讀者點擊前看不到網域。不是注入問題（文字仍跳脫、href 仍經 markdown-it 協定檢查） | 若之後匯入外部來源，保留網域（例如「官方公告（nginx.org）」）或在連結加 `title` | 合併時未處理；晨報內容由團隊自己產生，Vega 評估風險很低 |

#### Iris 的 L1 至 L7

| 編號 | 內容 | 狀態 |
|---|---|---|
出處：Iris 對 PR #21 的設計審查回報，由 Ada 轉述；結論不擋合併，皆為後續項目。Quill 未直接讀到 Iris 原報告。

| 編號 | 內容 | 狀態 |
|---|---|---|
| L1 | 「影響」標籤沒套用 `--impact-label`（`build.mjs` 的 display 分支未包 `.field`）；淺色應為 `#ff5a4c`、深色應為 `#cf2010` | 後續項目；PR #22 處理（見第 9 章） |
| L2 | 摘要頁 CVE 面板只列 2 項，其餘折進 details，summary 寫「5 則」但內含 3 項，與旁邊「完整內容 5 則」重複；規格 4.2 要列 4 項 | 後續項目；PR #22 只改折疊文案，不改列出數量（見第 9 章） |
| L3 | 狀態 chip 缺符號 ● ▲ ○ ✓ ？（規格 6.3、X1，`aria-hidden`） | 後續項目；PR #22 處理 |
| L4 | 兩處文字缺出處：「回到今日摘要」「N 項產品」 | 後續項目；PR #22 處理 |
| L5 | E8（v3 無 `display`）舊格式頁缺 26 格 | 待 George 決定（G4）；PR #22 不動 |
| L6 | 摘要頁標題偏小：1280 寬時 h2 約 19px、390 寬時 24px，規格為 28 至 46px；為擠進首屏的取捨，Iris 接受 | Iris 接受；PR #22 不動 |
| L7 | `toc.js` 在 reduced motion 下仍建立 IntersectionObserver，規格 R3 要求不建立 | 後續項目；PR #22 處理 |

#### Iris 驗收 A1 至 A10（Iris 回報，由 Ada 轉述）

| 編號 | 結果 | 備註 |
|---|---|---|
| A1 | 通過 | 首屏：26 格最後一格底緣 786px，限額 800px，餘裕 14px，預算 798px；Rigel 實測 785.77px |
| A2 | 通過 | 各項內容未取得 |
| A3 | 通過 | 各項內容未取得 |
| A4 | 通過 | 各項內容未取得 |
| A5 | 通過 | 各項內容未取得 |
| A6 | 未驗證 | 各項內容未取得 |
| A7 | 部分通過 | 各項內容未取得 |
| A8 | 通過 | 各項內容未取得 |
| A9 | 部分通過 | 各項內容未取得 |
| A10 | 通過 | 各項內容未取得 |

斜切（段落頁項目帶 24px 接合）為選做，未做。

#### 已知偏差（Rigel 與 Iris 規格對照；來源 Rigel 回報，首屏餘裕另見 U18）

| 編號 | 偏差 | 說明 | 是否阻擋合併 |
|---|---|---|---|
| K1 | E8（v3 無 `display`）沒有 26 格產品格 | Iris 規格 4.4 期待舊格式日期也補 26 格；`SPEC.md`「缺值時的顯示」規定整個 `display` 缺少時退回只顯示文字標題；舊演練分檔沒有產品來源快照；Lin 依現行 SPEC 實作，測試 `v4 E8: v3 without display retains the legacy text view` 通過。Rigel 判定不阻擋合併；待 George 決定（見 5.13） | 否 |
| K2 | 段落頁項目帶之間的 24px 斜切接合未做 | Iris 規格 5.1 寫條與條之間以 24px 斜切接合。此項來自 Ada 的說明，Quill 沒有在 Rigel 或 Vega 報告中找到對應敘述，細節未驗證 | 否（Ada 說明為已知偏差） |
| K3 | 首屏餘裕 14px | 出處為 Iris 設計審查 A1：26 格最後一格底緣 786px，限額 800px，餘裕 14px，預算 798px；Rigel 實測 785.77px（對 798px 預算相差 12.23px），兩者為不同基準的量測，見 U18 | 否 |

### 5.12 行數差異：+629／−6 與 +444／−6

| 來源 | 新增 | 刪除 | 說明 |
|---|---|---|---|
| 匿名 GitHub API（Quill 讀取） | 629 | 6 | 8 檔逐檔相加為 5、183、86、59、3、16、145、132，合計 629 |
| Vega 報告 | 629 | 6 | 與 API 相同 |
| Rigel 先前摘要的總計 | 444 | 6 | 與 API 不同；已查明為彙整標題筆誤 |
| Rigel 報告的逐檔數字 | 629 | 6 | 逐檔數字（5、183、86、59／−6、3、16、145、132）相加為 629，與 API 相同 |

已查明：PR #21 實際為 +629／−6，與 GitHub API、Vega 一致；Rigel 先前摘要的 +444 是彙整標題筆誤。出處：Rigel 報告，來源為 GitHub API `pulls/21/files` 與 `git diff`（Quill 未自行重跑 `git diff`）。

### 5.13 待 George 決定的四項

| 編號 | 項目 | 現況與差異 | 來源 |
|---|---|---|---|
| G1 | `digest` 適用段落 | SPEC.md 第六節 v4 補充表格逐字：「`display.<段落>[].digest` … **新知識、台灣 IT、AI** 的摘要清單顯示段落檔完整 `###` 標題。段落頁一律顯示完整標題」。Iris 設計規格 6.2 節逐字：該欄位「適用段落」為「**全部**」。Lin 程式 `site/display-v4.mjs` 為 `['knowledge','taiwan','ai'].includes(key) ? ... : ''`，符合 SPEC.md 範圍。Quill 不選邊 | Rigel 報告第 7 項；Iris 規格 |
| G2 | `digest` 長度上限 ≤ 24 | 目前只是建議值，SPEC 標明待 George 確認 | SPEC.md；Rigel；Iris 規格 U8 |
| G3 | 兩個固定文案 | SPEC.md 新增「固定文案補充」，兩條都標「預設值，待 George 確認」：重點警示標籤「今天最需要注意的一件事」；分數條標籤「CVSS {version}（{source}）」，版本為 null 時「CVSS（{source}）」。這兩條對應 Iris 規格第 12 節 T9、T12 標示的「缺出處」項目（Quill 的對應是依內容比對，Ada 的說明未逐條列出是哪兩個） | 匿名 API 讀回 SPEC.md diff；Iris 規格 T9、T12 |
| G4 | E8 是否要補 26 格 | 見 K1：Iris 設計稿要補，SPEC 現行規定不補，Lin 依 SPEC 實作 | Rigel 報告第 4 節 |

### 5.14 PR #21 合併前的審查缺口

| 項目 | 狀況 |
|---|---|
| Rigel 與 Vega 的審查對象都是 head 6b582b9，與合併前 head 相同 | 匿名 API 讀回 head 為 6b582b9 |
| Iris 對 PR #21 的設計審查 | 有結論（不擋合併，L1 至 L7 為後續項目），但只有 Ada 轉述，Quill 未直接取得 Iris 原報告（U13） |
| Rigel 驗證報告寫 PR 為 Draft | 合併時 API 讀回 `draft: false`、`merged: true`；Draft 何時轉為 Ready 未查，未驗證 |

---

## 6 如何套用到別的專案

這份做法適用於「靜態網站產生器讀取一份有版本號的資料契約，資料由排程自動產生」的專案。

| 步驟 | 做法 |
|---|---|
| 1 | 把規格（SPEC）與產生器的版本檢查視為兩個獨立變更，分開成兩個 PR |
| 2 | 先讓產生器同時接受新舊版本（本案接受 3 與 4），再把規格升版；順序反過來，排程一產出新版資料就會讓 CI 失敗 |
| 3 | 版本檢查用嚴格比對：只接受列舉的數字，並加測試拒絕不在列舉內的數字與字串型別（本案測 2、5、`"4"`） |
| 4 | 範例檔（fixture）放進 repo，欄位逐項寫必填、選填、長度上限、缺值時的顯示 |
| 5 | 新欄位若只是先定契約、畫面尚未渲染，要在文件與 PR 說明中明寫，避免誤以為已上線 |
| 6 | 審查者先在乾淨 clone 重跑安裝、對比度、測試、建置四項，再做版本相容實驗並還原 |
| 7 | 長度上限等未經決策者逐字確認的數值，一律標「建議值，待確認」 |
| 8 | 畫面固定文案集中成單一檔案（本案 `site/display-v4-copy.mjs`），與呈現程式分開，並在規格文件寫明來源，避免文字寫死在程式中 |
| 9 | 渲染 PR 要有一組「極端資料」測試（本案 E1 至 E8），涵蓋 0 筆、極多筆、極長標題、缺欄位與舊格式 |
| 10 | 設計稿與規格文件對同一欄位的範圍不一致時（本案 `digest` 適用段落），在紀錄中逐字並列、交決策者決定，不由實作者自行挑一邊 |

---

## 7 後續維護

### 7.1 日常

| 項目 | 做法 | 備註 |
|---|---|---|
| 新增 spec 版本（例如 5） | 先改 `site/build.mjs` 的接受列舉與 `site/test.mjs`，合併後再升 SPEC | 照第 3.2 的順序 |
| 資料壞掉（缺欄位、版本不在列舉內、日期或檢查數無效） | 建置失敗、整站停更、不發布壞資料；這是既有的設計取捨 | 由看 CI 的人讀 build 錯誤訊息，修正該日 `meta.yaml` 後重新推上 main |
| `digest` 長度上限與適用段落 | 待 George 確認後，視決定修改 SPEC.md、範例檔與 `site/display-v4.mjs` | 見 U2、5.13 |
| 畫面固定文案 | 修改 `site/display-v4-copy.mjs`，並同步 SPEC.md 的固定文案說明 | 兩個預設值待 George 確認，見 5.13 |
| 修改色彩 | 新增或調整色彩變數後執行 `npm run check:contrast`（目前 70 組） | Rigel 回報 |
| 修改 `--base-path` 處理 | 白名單 `^/(?:[A-Za-z0-9_-]+/)*$` 不可放寬 | Vega 回報 PR #21 未改動該行 |

### 7.2 後續待辦

| 項目 | 說明 |
|---|---|
| v4 欄位渲染 | 已由 PR #21 實作並合併（見 5.8）；正式 v4 資料的線上結果尚未看到，見 U4、U15 |
| 待 George 決定 | `digest` 適用段落與上限、兩個固定文案、E8 是否補 26 格，見 5.13 |
| Vega 參考事項 | R1（縱深防禦，`esc()`）與 R2（來源連結顯示網域），見 5.11；是否排程由負責人決定 |
| 02:00 首份 v4 資料產出後 | 以真實資料補驗線上畫面（摘要頁、段落頁、26 格、波形），並確認 CI build 通過；在此之前 PR #21 的畫面只用 fixture 驗證 |
| 上傳本文件 | 本文件為本機檔案，需開文件 PR 上傳，base 為最新 main；撰寫者沒有 GitHub 寫入連線，請有連線的成員（例如 Lin）執行並由 Rigel 審查 |

---

## 8 未驗證項目

| 編號 | 項目 | 說明 |
|---|---|---|
| U1 | 02:00 收集流程是否自動照新 SPEC 產出 v4 日報 | 沒有人在排程端實際觸發；Rigel 第一份報告明列「未實際執行 02:00 排程產生器」。至 2026-11-21 02:00 後的第一份資料才能確認 |
| U2 | `digest` 長度上限 ≤ 24 | 待 George 確認，目前只是建議值 |
| U3 | v4 欄位的線上畫面 | PR #21 合併後 build 已渲染 v4 欄位，但線上頁面未檢；目前 main 的真實資料沒有 `spec_version: 4` 的日期（Vega 回報），畫面只用 fixture 與注入資料驗證 |
| U4 | 版本 4 的真實排程資料能否通過建置 | 只用暫改 `spec_version` 的 fixture 實驗，沒有真實 v4 日報 |
| U5 | 合併後 Pages 部署的線上結果 | 只讀到 workflow run 為 success，是否有 deploy job 成功與線上頁面是否更新，Quill 未查；`PAGES_DEPLOY_ENABLED` 現況未查；2026-11-20 15:13 之後 run 44693398104 的 deploy job 為 success，見第 10 章 |
| U6 | PR #19 head 576c639 的兩檔實際行數 | 報告與指派皆沿用 eb1f5df 的數字 |
| U7 | Vega 與 Iris 對這兩個 PR 的審查 | 本次資料沒有，未驗證 |
| U8 | Node.js 版本 | 報告未載明 |
| U9 | 合併者 | 公開 API 讀取時未記錄，未查證 |
| U10 | Rigel 的測試與建置數字 | 全部為 Rigel 回報，Quill 未重跑 |
| U11 | 11:18／11:20 合併與 Rigel 報告時間 11:25 的先後（D1） | 原因未查明 |
| U12 | PR #21 合併後 Pages 線上結果 | 只讀到 run 44673700126 的 build 與 deploy 皆 success，線上頁面是否更新、內容是否正確，Quill 未查 |
| U13 | Iris 對 PR #21 的設計審查原報告 | L1 至 L7 與 A1、A6、A7、A9 等結論已記入 5.11，來源為 Iris 回報由 Ada 轉述；A2 至 A10 各項具體內容、A6 未驗證的原因、A7 與 A9 部分通過的缺口，Quill 未取得 |
| U14 | 真實裝置與其他瀏覽器、波形的深色模式與其他寬度 | Rigel 回報未驗證：實機觸控（PR #21 驗證只用 Chromium 模擬 390x844）；波形補驗另列深色模式、Safari、Firefox、實機慣性捲動、1280 與 390 以外的寬度、視窗縮放與旋轉、使用者真的點擊 `#item-N` 連結。螢幕閱讀器與 200% 縮放在本次三份報告都沒有驗證紀錄，一併標未驗證 |
| U15 | 正式 v4 日報通過 build | 目前 main 沒有 `spec_version: 4` 的真實日期（Vega 回報）；v4 只用測試資料驗證 |
| U16 | 瀏覽器中 CSP 的實際阻擋結果、波形與 IntersectionObserver 的實際行為（Vega 範圍） | Vega 回報沒有啟動伺服器，只做靜態分析、Node 建置、HTML 解析與 repo 內 vm 模擬測試；Rigel 另以 Chromium 量測波形，兩者範圍不同 |
| U17 | Rigel 先前摘要 +444／−6 與逐檔 +629／−6 不符的原因 | 已查明（Rigel 報告，來源 GitHub API `pulls/21/files` 與 `git diff`）：+444 為彙整標題筆誤，實際 +629／−6，見 5.12；Quill 未自行重跑 |
| U18 | 首屏餘裕 14px 的出處 | 已查明：Iris 設計審查 A1，26 格最後一格底緣 786px，限額 800px，餘裕 14px，預算 798px；Rigel 實測 785.77px。兩份量測的瀏覽器與方法是否相同未驗證 |
| U19 | `site/assets/site.css` 新增的 183 行逐條審查 | Vega 只搜尋外部資源與危險語法，沒有逐條審查；視覺與對比屬 Rigel、Iris 範圍 |
| U20 | repo 設定（分支保護、secret scanning 等）在本次是否變動 | Vega 回報本次沒有重查 |
| U21 | `exploited_detail`、`patch_detail`、`caveat`、`figures`、`kev`、`drill` 的畫面量測 | 本紀錄沒有對應的畫面量測或 Rigel 逐項結果，5.8 已逐列標「未驗證」 |
| U22 | 合併時 PR 狀態 | Rigel 報告寫 Draft，API 讀回合併時為 `draft: false`；Draft 何時轉為 Ready 與是否有人確認，未查 |
| U23 | Vega R1、R2 後續是否已處理 | 合併當下未處理；之後是否修改未查 |

---

## 9 後續 PR #22

來源：Ada 轉述的 Lin 自報，加上 2026-11-20 Quill 以匿名 GitHub API 讀回的 PR 中繼資料（狀態、合併時間、合併者、檔案清單、PR 內文）。Quill 沒有讀 PR #22 的原始碼逐行內容，也沒有重跑任何指令。

### 9.1 基本資料

| 項目 | 內容 |
|---|---|
| PR | #22 |
| 作者 | Lin |
| 狀態 | 已合併（匿名 API 讀回：2026-11-20T05:04:36Z，即台北 13:04:36，合併者 george-palsys） |
| head | `8fbf76ba51a9c50c04c0b1f6a3e1f5d3b65b8cf5` |
| merge commit | `da4087b783ccd48e0883ea066cba7a8313f21801` |
| 規模 | 1 個 commit、6 個檔案、+67／−6（匿名 API 讀回）；檔案為 `SPEC.md`、`site/assets/toc.js`、`site/build.mjs`、`site/display-v4-copy.mjs`、`site/display-v4.mjs`、`site/test.mjs` |
| PR 上的 CI | run 44674260900（head 8fbf76b，pull_request）conclusion 為 success |
| 合併後 main 的 CI | run 44678588675（commit da4087b，push）conclusion 為 failure，deploy 被跳過，原因見第 10 章 |
| 目的 | 處理 Iris 設計審查 L1、L2、L3、L4、L7，以及 Vega 參考事項 R1、R2 |

### 9.2 處理範圍逐項

| 編號 | 項目 | PR #22 的處理 |
|---|---|---|
| L1 | 「影響」標籤沒套 `--impact-label` | 處理 |
| L2 | 摘要頁 CVE 面板只列 2 項 | 只改折疊文案；維持先顯示兩則。原因：四則全展開時產品格底為 879.05px，超出 798px 預算 |
| L3 | 狀態 chip 缺符號 | 處理 |
| L4 | 兩處文字缺出處 | 處理；新增「再顯示 N 則」固定文案 |
| L5 | E8 舊格式頁缺 26 格 | 不動，待 George 決定 |
| L6 | 摘要頁標題偏小 | 不動，Iris 已接受 |
| L7 | `toc.js` 在 reduced motion 仍建立 IntersectionObserver | 處理 |
| R1 | `display-v4.mjs` 輸出 `copy[field][value]` 未經 `esc()` | 處理 |
| R2 | 來源連結顯示文字被說明文字取代 | 處理 |
| 斜切 | 段落頁 24px 斜切接合（選做） | 不動 |
| digest | `digest` 適用段落與長度上限（G1、G2） | 不動 |

### 9.3 Lin 自報結果

| 項目 | Lin 自報 | 驗證狀態 |
|---|---|---|
| `npm test` | 37／37 通過 | Lin 自報；PR 內文同載 37/37；合併後 main 的 `npm test` 在 CI 失敗（見第 10 章） |
| `npm run check:contrast` | 70 組 | Lin 自報，Rigel 與 Vega 驗證中 |
| `npm run build` | 40 頁 | Lin 自報，Rigel 與 Vega 驗證中 |
| 首屏產品格底 | 785.84px（預算 798px） | Lin 自報，Rigel 與 Vega 驗證中 |

### 9.4 PR #22 未驗證項目

| 項目 | 說明 |
|---|---|
| 上表四項數字 | 皆為 Lin 自報，Rigel 與 Vega 尚未回報 |
| 「四則全展開產品格底 879.05px」 | Lin 自報的量測，未驗證 |
| R1、R2 的實際修法 | 只知道 PR #22 宣稱處理，修法內容未取得 |
| 新增固定文案「再顯示 N 則」 | 是否已寫入 SPEC.md 並標註待 George 確認，未查 |
| 合併後的線上結果 | 合併後 main 的建置失敗，未部署；由 PR #25 修正後才部署成功，見第 10 章 |

---

## 10 PR #25 與 2026-11-20 兩次 main 建置失敗

來源：匿名 GitHub API 讀回（PR #25 內文與檔案清單、workflow run 與 job 的 step 結果、check-run 標註、commit 清單）。Actions 完整 log 的下載端點回 HTTP 403（需登入），所以**沒有讀到 `npm test` 的失敗輸出本文**；失敗原因以 PR #25 作者在 PR 內文寫的根因為依據，並標明哪些是推論。

### 10.1 PR #25 基本資料

| 項目 | 內容 |
|---|---|
| PR | #25「fix: 恢復 11/20 v4 晨報正式建置」 |
| 作者與合併者 | george-palsys（作者）、george-palsys（合併者），匿名 API 讀回 |
| 分支 | `fix/isolate-daily-tests` |
| head commit | `60418896b743808c520d3a2321f9bae7de74ccf5`（訊息：fix: restore production build for the Friday v4 edition） |
| 建立時間 | 2026-11-20T05:08:22Z（台北 13:08） |
| 合併時間 | 2026-11-20T07:13:36Z（台北 15:13） |
| merge commit | `8f16064511e8fcc2411c0ce80b92fdca83431369`（main） |
| 規模 | 1 個 commit、4 個檔案、+39／−10 |
| 變更檔案 | `site/build.mjs`（+7／−5）、`site/display-v4-copy.mjs`（+1／−0）、`site/display-v4.mjs`（+9／−3）、`site/test.mjs`（+22／−2） |
| PR 上的 CI | run 44679010544（head 6041889，pull_request）conclusion 為 success，build 為 success、deploy 為 skipped |
| Codex 自動審查 | `chatgpt-codex-connector[bot]` 留言：code review 已完成，`has_any_findings` 為 false |
| 合併後 main 的 CI | run 44693398104（commit 8f16064，push）build success（07:13:50Z 完成）、deploy success（07:14:05Z 完成） |

### 10.2 兩次建置失敗

| 項目 | 第一次失敗 | 第二次失敗 |
|---|---|---|
| workflow run | 44677242319 | 44678588675 |
| 觸發 commit | `91917ad`「Archive morning brief 2026-11-20 (7)」 | `da4087b`（合併 PR #22） |
| 時間（UTC／台北） | 2026-11-20T04:52:09Z／12:52 | 2026-11-20T05:04:38Z／13:04 |
| 觸發事件 | push 到 main | push 到 main |
| 失敗 job 與 step | build job 的 step 6「Run npm test」failure | build job 的 step 6「Run npm test」failure |
| 之後的 step | step 7 build 與 step 8 upload-pages-artifact 皆 skipped；deploy job skipped | 同左（逐項：step 7 build skipped、step 8 upload-pages-artifact skipped、deploy job skipped） |
| 先前通過的 step | step 4「npm ci --ignore-scripts」與 step 5「npm run check:contrast」success | 同左（逐項：step 4 success、step 5 success） |
| check-run 標註（第 980／981 行） | 「Process completed with exit code 1.」 | 「Process completed with exit code 1.」（第 981 行） |
| 網站是否更新 | 沒有（deploy skipped） | 沒有（deploy skipped） |

**證據可支持的結論**：兩次都在 `npm test` 失敗、都以 exit code 1 結束，網站建置與部署因此被跳過。`npm ci` 與 `check:contrast` 兩次都通過。

**根因（來源：PR #25 內文，作者自述；Quill 沒有重跑）**：測試 fixture 只建立 11/19 的資料，卻讀入全站搜尋索引；main 有 11/20 的正式資料後，測試多出 36 筆 11/20 的缺頁警告，與預期的警告數（0 與 1）不符。PR #25 的 `site/test.mjs` 改為只把 fixture 日期的搜尋資料帶進測試。

**PR #25 另修兩處 SPEC 相容問題（來源：PR #25 內文）**：`site/display-v4.mjs` 與 `site/display-v4-copy.mjs` 保留原有 N 則格式並支援產品盤點摘要，盤點總項與更新列分開，更新列仍須與段落標題、display 一致；`site/build.mjs` 保留週五回顧與動手題的小節，僅原始三級標題對應 v4 文章。另新增回歸測試。

**PR #25 作者回報的驗證（來源：PR #25 內文；Quill 未重跑）**：依賴安裝 8 套件、0 漏洞；`npm test` 38/38；`check:contrast` 70 組通過；以未修改的正式 11/20 資料建置成功，47 HTML、26 個產品頁、3 份日報、45 筆搜尋項目、0 警告。PR 內文當時寫「GitHub Pages 部署尚未驗證」，之後 run 44693398104 的 deploy job 為 success。

### 10.3 時間軸（匿名 API 讀回，台北時間）

| 時間 | 事件 |
|---|---|
| 12:20 | main `f99d84c`（合併 PR #21）push 的 run 44673700126，build 與 deploy success |
| 12:25 | PR #22 開啟（head 8fbf76b），run 44674260900 success |
| 12:20 之後至 12:52 | main 上有 7 個 `Archive morning brief 2026-11-20` commit（無編號、(2) 至 (7)：aafde78、2a06100、7ee7a57、856a81c、5c628e3、a77c540、91917ad），最後一個為 91917ad（12:52:00）；前面各 commit 的精確時間 Quill 只讀到 7ee7a57 起（12:41:27 起） |
| 12:52 | run 44677242319（91917ad）：`npm test` 失敗，部署被跳過 |
| 13:04 | PR #22 合併為 `da4087b`；run 44678588675：`npm test` 失敗，部署被跳過 |
| 13:08 | PR #25 開啟（head 6041889），run 44679010544 success（deploy skipped） |
| 15:13 | PR #25 合併為 `8f16064`；run 44693398104：build 與 deploy success |

### 10.4 未驗證與推論

| 編號 | 項目 | 說明 |
|---|---|---|
| U24 | 兩次失敗的 `npm test` 輸出本文 | Actions log 下載回 403，Quill 沒有讀到；只看到 step 結果與「exit code 1」標註 |
| U25 | 第一次失敗（91917ad）也是 11/20 搜尋索引警告造成 | **推論**：兩次失敗發生在同一 step，且發生在 11/20 資料進 main 之後，上一次 main 的 run（04:20，f99d84c）success，與 PR #25 內文的根因相符；但沒有失敗輸出可直接證明，標待驗證 |
| U26 | 第二次失敗（da4087b）是否另含 PR #22 本身造成的測試失敗 | PR #25 內文只說明 fixture 與搜尋索引、v4 顯示兩處修正；PR #22 合併後的失敗是否同時涉及 PR #22 的變更，Quill 未能區分，標待驗證 |
| U27 | 11/20 的 6 個 archive commit（(2) 至 (6)）是否各自觸發 run | 匿名 API 的 run 清單中，04:20 到 04:52 之間只有 91917ad 一筆 push run；其餘是否被取消、合併或未觸發，未查 |
| U28 | 部署後線上網站內容 | 只讀到 deploy job success，線上頁面是否已更新到 11/20 v4 畫面，Quill 未檢查 |
| U29 | PR #25 的 `npm test` 38/38、47 HTML 等數字 | 來自 PR 內文，Quill 未重跑；PR 的 CI 只能確認 build 成功，step 內的測試數字未讀 |
| U30 | PR #22 內文 Lin 自報的 37/37 與 PR #25 的 38/38 | 差 1 筆為 PR #25 新增的回歸測試（PR #25 內文寫「新增回歸測試」；數量是否剛好 1 筆，未逐項確認） |

---

## 11 變更紀錄

只往後加，舊列不改。

| 日期 | 作者 | 內容 |
|---|---|---|
| 2026-11-20 | Quill | 建立本紀錄：PR #19（SPEC v4）與 PR #20（build 接受 spec_version 3 與 4）；資料來源為 Rigel 兩份驗證報告、Atlas 欄位草案與匿名 GitHub API 讀回 |
| 2026-11-20 | Quill | 新增 PR #21（v4 畫面渲染，merge commit f99d84c）：變更檔 8 項、v4 欄位對應畫面、缺值行為、四關審查（Rigel、Vega 已有報告；Iris 報告未取得）、Vega R1 與 R2、已知偏差、待 George 決定四項、行數差異；資料來源為 Rigel 驗證報告與兩份波形複驗報告、Vega 安全審查報告、Iris 設計規格 v5 與匿名 GitHub API 讀回。檔名由「spec-v4-and-version-compat」改為「spec-v4-contract-compat-render」 |
| 2026-11-20 | Quill | 更新 PR #21 章節：5.12 行數差異改為已查明（+629／−6，+444 為 Rigel 彙整標題筆誤）；U18 首屏餘裕 14px 出處為 Iris 設計審查 A1；5.11 補入 Iris L1 至 L7 與驗收 A1 至 A10（Iris 回報，由 Ada 轉述）；新增第 9 章後續 PR #22（Lin 自報，驗證中）；原第 9 章變更紀錄改為第 10 章；兩處用語改為金鑰字串與色彩變數 |
| 2026-11-20 | Quill | 補 PR #22 合併結果（merge commit da4087b，台北 13:04）、新增第 10 章 PR #25（merge commit 8f16064，台北 15:13，run 44693398104 build 與 deploy success）與當天兩次 main 建置失敗（run 44677242319、44678588675，皆為 npm test 失敗、部署跳過；log 讀不到，根因引自 PR #25 內文並標推論）；原第 10 章變更紀錄改為第 11 章；新增 U24 至 U30；U5、U12 的部署狀況見第 10 章 |
