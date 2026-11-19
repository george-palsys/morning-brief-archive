# 實作紀錄：晨報歸檔站閱讀版型改版（PR #16，Material 風格重整）

- 檔名日期：2026-11-20（依 Ada 指派）；實際事件發生在 2026-11-19 23:19–23:56（Asia/Taipei），本文件撰寫於 2026-11-19 深夜。
- 撰寫：Quill（文件撰寫）。
- 對象：`george-palsys/morning-brief-archive` 的 PR #16（分支 `redesign/material-reading-layout`），已 squash 合併為 `main` 上的 commit `9ec6f5c76907ff418dc3492fc980b92eea6ef178`。
- 紀錄狀態：合併當下 Rigel 對最後一個 commit（`c3f9a37`）的補驗尚未完成，是 George 指示先合併（Ada 轉達，我沒有讀到原始指示）。之後 Rigel 的補驗已完成，結論通過（報告 `pr16-head3-verification-report-rigel.md`，審查時間 2026-11-19 23:58）；合併後他又對 `main` 的 `9ec6f5c` 以乾淨 clone 重跑四項指令，全數通過，並確認 `9ec6f5c` 與 `c3f9a37` 的 git tree 相同（`2862502761863165828a6c518eddfec10997a964`，`git diff 9ec6f5c c3f9a37` 為 0），報告 `pr16-postmerge-verification-report-rigel.md`（2026-11-20 00:02）。以上是 Rigel 回報（Ada 轉達）；兩個 tree 相同我另外用 `git rev-parse` 自己讀過，結果相同。其餘 Rigel 的數字我未重跑，標「Rigel 回報」。
- 資料來源（共 8 份文件，只寫檔名，不寫路徑）：
  - Iris：`morning-brief-site-redesign-spec-v4.md`（設計規格）、`pr16-early-design-check.md`（對 `ee4ccdf` 的早期設計檢查，F1–F9 的出處）、`pr16-design-review-9ab77e8.md`、`pr16-g1-recheck-ae0f8bf.md`、`pr16-h1-recheck-c3f9a37.md`。
  - Rigel：`pr16-verification-report-rigel.md`（只針對 `9ab77e8`）。
  - Vega：`pr16-security-review-vega.md`（針對 `9ab77e8`）、`pr16-c3f9a37-security-review-vega.md`（針對 `9ab77e8..c3f9a37`）。
- 我自己做的事（有證據）：2026-11-19 深夜在乾淨 clone 的 `9ec6f5c` 重跑 `npm ci`、`npm run check:contrast`、`npm test`、`npm run build`；用匿名 GitHub API 讀 PR #16 與部署 run `44560328541` 的狀態；用 curl 讀線上首頁。其他數字都是成員回報，我沒有重跑，各列在「來源」欄標明。

---

## 1 目的與範圍

**目的**：把晨報歸檔站從「單欄卡片」改成 Material for MkDocs 風格的文件閱讀版型：固定頁首、左側站樹、右側頁內目錄、提示框（admonition）、小螢幕選單，讓手機與桌面都好讀。

**範圍內（PR #16 實際改的 5 個檔）**：

- `site/assets/site.css`：版面、字級、斷點、提示框、收合標籤。
- `site/assets/toc.js`：小螢幕選單的外點關閉與 Esc 關閉、首頁重點收合的斷點切換。
- `site/assets/search.js`：搜尋結果加摘錄段落。
- `site/build.mjs`：頁面骨架、頁內目錄、CVE 標籤、維護頁包裝、首頁重點預覽。
- `site/test.mjs`：新增與調整測試。

**範圍外（這次沒有動）**：

- `daily/`、`products/`、`SPEC.md`、`.github/` workflow、`package.json`、`package-lock.json`、`items.jsonl`、`state/`。Rigel 對 `9ab77e8` 比對 `main` 為 0 diff（Rigel 回報）；Vega 對 `9ab77e8..c3f9a37` 比對 `package*.json` 與 `.github` 為 0 diff（Vega 回報）。
- CSP meta、`--base-path` 白名單、markdown-it 的 `html: false`（Vega 兩輪皆確認未動）。
- 正式 v3 資料：2026-11-20 02:00 的首份正式 v3 晨報尚未產生，所以全部驗證用 2026-11-19 的演練資料（見第 8 章）。

**與網站發布的關係**：網站產生器只讀 `README.md`、`daily/`、`products/`、`products.yaml`、`items.jsonl`，不讀 `docs/`，所以本文件不會被發布（沿用既有紀錄的結論，來源：`docs/implementation/2026-11-19-morning-brief-pages-site.md` 第 1 章；我沒有另外重驗）。

---

## 2 環境與版本

| 項目 | 內容 | 來源 |
| --- | --- | --- |
| Repo | `george-palsys/morning-brief-archive`，公開 | 匿名 API 可讀（我自己讀） |
| base（改版前 `main`） | `85901f22815a4a3aabfde5c705e658b8e8da927e` | Iris、Rigel、Vega 報告一致；我 clone 後 `git log` 相符 |
| 合併後 `main` | `9ec6f5c76907ff418dc3492fc980b92eea6ef178` | 匿名 API `merge_commit_sha`（我自己讀） |
| 套件 | markdown-it 15.0.3；`npm ci --ignore-scripts` 安裝 8 個套件，0 vulnerabilities | Vega 回報 15.0.3；Rigel 回報 8 套件；我重跑 `npm ci` 結果 0 vulnerabilities |
| Node.js | 本 clone 使用的版本未記錄 | 官方 workflow 的版本以 `.github/workflows/pages.yml` 為準；本次我沒有讀，標未驗證 |
| 部署 | GitHub Pages，來源 GitHub Actions，網址 `https://george-palsys.github.io/morning-brief-archive/` | 既有紀錄第 4 章（成員回報） |
| 測試資料 | 2026-11-19 的 26 則演練資料（2 份日報：v3 分檔與舊版單檔；9 筆搜尋索引） | Iris 回報；Rigel 同一份 |
| 驗證環境 | Windows；headless Chrome（Iris）；乾淨 clone（Rigel、Vega、我） | 各人報告 |

---

## 3 實際步驟與完整指令

### 3.1 改版經過（以 commit 為單位）

| 順序 | commit | 標題 | 做了什麼 | 來源 |
| --- | --- | --- | --- | --- |
| 1 | `ee4ccdfd5683ee47c1dfea5718a694228b73634d` | feat: draft document reading layout with responsive navigation | 第一版 Material 風格改版；對 base 改 5 檔，+151／−15 | 我用 `git diff --stat 85901f2 ee4ccdf` 自己讀 |
| 2 | `9ab77e8040ead4727947d6c157dc5c587315068c` | fix: address reading layout review feedback | 修 Iris 早期檢查的 F1–F9；相對 `ee4ccdf` 改 4 檔，+67／−9 | Iris 回報；我用 `git diff --stat` 讀到對 base 為 +212／−18、5 檔，與 Rigel 與 Vega 相同 |
| 3 | `ae0f8bf6bf212555e720faaf93efce761edabc76` | fix: keep homepage priority visible across screen sizes | 修 G1：首頁重點標籤帶出重點句；640px 以上展開、以下收合；相對 `9ab77e8` 改 4 檔，+46／−1 | 我用 `git diff --stat 9ab77e8 ae0f8bf` 自己讀 |
| 4 | `c3f9a37ee5cd73450553adeece26b84613bb3545` | fix: truncate homepage previews at safe text boundaries | 修 H1：預覽截斷避開版本號與 CVE 編號；相對 `ae0f8bf` 改 3 檔，+31／−3 | 我用 `git diff --stat ae0f8bf c3f9a37` 自己讀 |
| 合併 | `9ec6f5c76907ff418dc3492fc980b92eea6ef178` | Draft: 重整晨報閱讀版型與分層導覽（待正式 v3 資料驗證） (#16) | squash 合併，4 個 commit 變成一個；合併時間 2026-11-19 23:55:45 | 我讀匿名 API（`merged_at` 為 15:55:45Z，換算 23:55:45） |

squash commit 標題仍帶「Draft:」與「待正式 v3 資料驗證」，因為 PR 當時是草稿標題；歷史不改，本文件照實註明。標題的意思是：改版已進 `main` 並已部署，但正式 v3 資料還沒驗證過。

### 3.2 重現驗證的指令（我在乾淨 clone 的 `9ec6f5c` 實際執行）

```
git clone https://github.com/george-palsys/morning-brief-archive.git
```

```
git checkout 9ec6f5c76907ff418dc3492fc980b92eea6ef178
```

```
npm ci --ignore-scripts
```

```
npm run check:contrast
```

```
npm test
```

```
npm run build -- --base-path /morning-brief-archive/
```

- 在 Windows 的 Git Bash 執行最後一行，路徑參數會被轉成 Windows 路徑，建置會失敗並顯示「base-path 必須是 / 或以 / 開頭、結尾的站台路徑」。我自己遇到了，改成在指令前加 `MSYS_NO_PATHCONV=1` 後成功：

```
MSYS_NO_PATHCONV=1 npm run build -- --base-path /morning-brief-archive/
```

- 這與既有紀錄第 7 章 Vega 建議「README 補一句」是同一件事；是否已補，我沒有查。

### 3.3 我自己重跑的結果（`9ec6f5c`）

| 指令 | 結果 | 來源 |
| --- | --- | --- |
| `npm ci --ignore-scripts` | found 0 vulnerabilities | 我自己重跑 |
| `npm run check:contrast` | `CONTRAST OK: 48 CSS color pairs (light + dark)` | 我自己重跑 |
| `npm test` | tests 26、pass 26、fail 0 | 我自己重跑 |
| `npm run build -- --base-path /morning-brief-archive/`（加 `MSYS_NO_PATHCONV=1`） | `BUILD OK: 40 HTML pages; 26/26 product pages; 2 daily editions; 9 search items; 1 warnings; mode=production`；警告內容為「歷史演練分檔未附 26 項產品來源快照，產品總表未建立；不能視為目前產品現況。」 | 我自己重跑 |

這 1 個警告是演練資料本來就有的（Rigel、Vega、Iris 在改版前後皆見到），不是改版造成。

---

## 4 產出清單與位置

| 項目 | 內容 | 來源 |
| --- | --- | --- |
| PR | #16，分支 `redesign/material-reading-layout`，開啟時為草稿，已合併 | 匿名 API：`state=closed`、`merged=true` |
| 合併方式 | squash | 匿名 API：`merge_commit_sha` 等於 `9ec6f5c`，且 PR 的 4 個 commit 在 `main` 上只剩一個 |
| 合併時間 | 2026-11-19 23:55:45（Asia/Taipei） | 匿名 API |
| 部署 run | `44560328541`（event=push，head `9ec6f5c`）：`https://github.com/george-palsys/morning-brief-archive/actions/runs/44560328541` | 我讀匿名 API |
| 部署結果 | build job success（23:56:05 完成）、deploy job success（23:56:20 完成） | 我讀匿名 API；與 Ada 轉達一致 |
| PR 分支上的 CI | `9ab77e8`：run `44553458140` success；`c3f9a37`：build 成功、deploy skipped（PR 預期行為） | Rigel 讀 API（9ab77e8）；Vega 讀 API（c3f9a37，job 連結在其報告） |
| 變更檔 | `site/assets/search.js` +6／−1；`site/assets/site.css` +104／−0；`site/assets/toc.js` +26／−1；`site/build.mjs` +50／−11；`site/test.mjs` +99／−5。合計 5 檔、+285／−18 | 我讀 `git diff --numstat 85901f2 9ec6f5c` |
| 本文件 | `docs/implementation/2026-11-20-site-redesign-v4.md` | 本檔 |

`site.css` 對 base 刪除 0 行（只加不刪），原因與後續清理見第 7 章。

---

## 5 驗證與審查結果

### 5.1 F1–F9：早期設計檢查（`ee4ccdf`）的問題與 `9ab77e8` 的修法

來源：問題欄出自 Iris 的 `pr16-early-design-check.md`；修法與結論欄出自 Iris 的 `pr16-design-review-9ab77e8.md` 第七節與 Rigel 的報告。結論欄標「Iris」是她的量測，標「Rigel」是他讀碼或實跑。

| 編號 | 問題（`ee4ccdf`） | 修法（`9ab77e8`） | 結論與證據 |
| --- | --- | --- | --- |
| F1 | 維護頁「查看維護紀錄」的 `<summary>` 只是一行純文字，看不出能展開 | `.maintenance-record>summary` 加最小高度、框線、粗體與展開記號 | Iris：高 46px、框線 `rgb(125,134,144)`、字重 600，360 與 1280 相同，通過。Rigel：`min-height:var(--tap-min)`（44px）通過 |
| F2 | 表格 `th` 沒有底色；360 的 6 張表格卡片共高 1,359px，比 main 的 1,266px 多 93px | 大螢幕 `th` 加 `--color-surface` 底色與字重 600；小螢幕卡片儲存格上下內距降為 .375rem | Iris：1280 `th` 背景 `rgb(246,248,250)`、字重 600；360 卡片 6 張共 1,021px。她註明這輪日報資料量不同，不能與上輪 1,359px 直接比。Rigel 讀 CSS 判定通過，沒有量高度 |
| F3 | 首頁有 2 個提示（頂部歸檔說明與頁尾 `p.notice`） | 合併成 1 個提示框，並把首頁入口連結放在重點之前 | Iris：首頁 admonition 1 個、`p.notice` 0 個，測試斷言單一提示框。Rigel：`class="notice"` 為 0，通過 |
| F4 | 360 巢狀第 3 層清單寬度未驗證（CVE 頁沒有第 3 層清單，只有推算 268px） | 新增縮排變數 `--indent` 與測試；Iris 另以測試資料實量 | Iris：第 3 層文字寬 256px、每層縮 20px、內容欄 328px，通過。限制：資料是她在本機輸入複本附加，不在 repo |
| F5 | 首頁 360 首屏被「今天最需要注意的一件事」大卡片佔滿 | 改為 `<details>` 預設收合，無需 JS | Iris：360 收合框 52px，「今日摘要」h2 由 732 上移到 502；判斷「有條件可接受」，條件見 5.2 的 G1 |
| F6 | 選單點外面不會關、沒有 Esc | `toc.js` 新增 `click` 與 `keydown(Escape)` 監聽，關閉時焦點回「選單」 | Iris：Esc 關閉且焦點回 summary；點外面關閉（模擬滑鼠）。Rigel 讀 `toc.js` 第 17–31 行判定通過 |
| F7 | 右側目錄項被截斷後看不到全文 | `<a>` 加 `title`，內容與文字相同 | Iris：5 項 `title` 與文字長度一致（61、50、75、66、76）；Rigel：`title` 與 `span` 純文字 100% 相符；Vega：`esc()` 跳脫後寫入，惡意標題無法跳出屬性 |
| F8 | 頁首「目前項」測試只涵蓋 `daily/2026-11-19/` 開頭頁面 | 測試改為涵蓋所有 `daily/`、`products/` 與首頁的 `aria-current` | Iris：通過。Rigel：首頁無目前項；每日各頁為「每日」；產品各頁為「產品」；關於頁為「關於」 |
| F9 | 沒有保護 CSS 行為的測試 | 新增 `reading CSS retains…` 測試：h2 1.5rem、960px 以上隱藏分頁列、目錄兩行截斷、`--indent`、第 3 層清單 | Iris：通過，並註明是字串斷言，只防誤刪，不證明畫面正確。Rigel：暫時移除 `font-size:1.5rem` 與 `--indent:1.25rem`，`npm test` 如預期失敗，還原後工作目錄乾淨 |

**編號不一致（兩位審查者的對照）**：Rigel 報告裡 F1–F9 的順序與 Iris 不同（他的 F4 是選單關閉、F5 是目錄 `title`、F6–F8 合併為頁首目前項，F2 的描述是「卡片總高 ≤1,266px」）。這可能是他依 Lin 自述的編號，我沒有讀到 Lin 的自述原文，無法確認。本文件一律以 Iris 的 F1–F9 為準，Rigel 的證據依內容對應到 Iris 的編號。

### 5.2 G1：首頁「今天最需要注意的一件事」收合後看不到重點（`9ab77e8` 的問題，`ae0f8bf` 的修法）

| 項目 | 內容 | 來源 |
| --- | --- | --- |
| 問題 | 收合標籤是固定標題，不點開就看不到任何內容，讀者可能直接略過；1280px 也收合，只省 117px，沒有必要 | Iris，`pr16-design-review-9ab77e8.md` 第五、六節 |
| 修法 | 標籤後面帶出重點句預覽（取第一句、最多 48 字）；640px 以上預設展開，640px 以下由 `toc.js` 收合，並用 `matchMedia('(min-width:640px)')` 的 change 事件即時切換；沒有 JS 時 HTML 預設 `open`，預覽被 CSS 隱藏，不會重複顯示 | Iris 複驗報告第二節；Vega 讀 `toc.js` 第 32–38 行 |
| 複驗結論 | 有條件通過：1a 標籤帶出產品與 CVE 編號通過；1b 截字**不通過**（40 字截斷落在版本號中間，輸出「…影響 1.9…」，原文是 1.9.5，會讓讀者看成錯的版本）；其餘 6 項通過 | Iris，`pr16-g1-recheck-ae0f8bf.md` |
| 代價 | 360 收合時「今日摘要」h2 由 502 變 558（多 56px），Iris 判斷可接受 | Iris，`pr16-g1-recheck-ae0f8bf.md` 第三節 |

### 5.3 H1：預覽截斷截壞版本號（`ae0f8bf` 的問題，`c3f9a37` 的修法）

| 項目 | 內容 | 來源 |
| --- | --- | --- |
| 問題 | 40 字截斷落在版本號中間，語意被改（`1.9.5` 變 `1.9`），是錯誤資訊 | Iris，`pr16-g1-recheck-ae0f8bf.md` 的 H1 |
| 修法 | 截斷改為在 48 字內往回找最後一個 `，`、`、`、`；` 或空白當斷點；版本號與 CVE 編號包成 `.attention-id`（不換行）；預覽用 `-webkit-line-clamp:2` 限兩行；截斷先於跳脫，再包 span | Iris 複驗報告；Vega 讀 `site/build.mjs` 第 225–241 行與 `site.css` 第 201–208 行 |
| 複驗結論 | 通過（附 1 項建議，不擋）：17 組自造句沒有切壞版本號或 CVE 編號；639／640px 斷點、無 JS、觸控高度、溢位、CVE 頁 360 第一個 h2 y=468 皆通過 | Iris，`pr16-h1-recheck-c3f9a37.md` |
| 安全性 | 通過：13 種預覽專用惡意輸入（含 `<script>`、屬性注入、跨截斷邊界的 entity）解析後沒有 script、img、iframe、事件屬性或危險連結；10 萬字輸入建置 215 ms，無 ReDoS 跡象 | Vega，`pr16-c3f9a37-security-review-vega.md` |

### 5.4 各關審查者、版本與結論

| 審查者 | 對象版本 | 結論 | 時間與依據 | 來源 |
| --- | --- | --- | --- | --- |
| Iris | `ee4ccdf` | 早期設計檢查，列出 F1–F9 | 時間未在報告標示 | `pr16-early-design-check.md` |
| Iris | `9ab77e8` | 有條件通過（設計上，不是合併結論）；F1–F9 已修 8 項，F5 有條件；待處理 G1（必修）、G2（待決定）；G3、G4 可不處理 | 報告未標時間 | `pr16-design-review-9ab77e8.md` |
| Iris | `ae0f8bf` | 有條件通過；條件是 H1 | 報告未標時間 | `pr16-g1-recheck-ae0f8bf.md` |
| Iris | `c3f9a37` | 通過（附建議 H2，不擋） | 報告未標時間 | `pr16-h1-recheck-c3f9a37.md` |
| Rigel | `9ab77e8` | 通過（全數） | 2026-11-19 23:36；四項指令全綠、受保護檔案 0 diff、改版前後 40 頁來源網址相符率 100%、982 條站內連結斷鏈 0、連續兩次建置 47 檔雜湊一致、F1–F9 逐項複驗 | `pr16-verification-report-rigel.md` |
| Rigel | `c3f9a37` | 合併當下補驗尚未完成（George 指示先合併，Ada 轉達）；補驗已完成，**通過**：四項指令（26 項測試通過）、受保護檔案對 base 0 diff、40 頁正文與外部來源網址相符 100%、982 條站內連結 0 斷鏈、連續兩次建置 47 檔雜湊一致，並確認首頁預覽截斷不切壞 CVE 編號與版本號 | 2026-11-19 23:58；Rigel 回報（Ada 轉達），我未重跑；報告 `pr16-head3-verification-report-rigel.md` |
| Rigel | `main` 的 `9ec6f5c`（合併後） | **通過**：乾淨 clone 重跑四項指令全數通過（26 項測試、對比 48 組、建置 40 頁、1 個預期警告）；`9ec6f5c` 與 `c3f9a37` 的 git tree 相同（`2862502761863165828a6c518eddfec10997a964`）；Ada 另用 GitHub API 查到兩個 tree 相同，我也用 `git rev-parse` 讀到相同 | 2026-11-20 00:02；Rigel 回報（Ada 轉達），四項指令我在 `9ec6f5c` 另外自己重跑過（見 3.3）；報告 `pr16-postmerge-verification-report-rigel.md` |
| Vega | `9ab77e8` | 通過，高中低風險皆無 | 2026-11-19 23:31–23:40；8 項審查加 gitleaks | `pr16-security-review-vega.md` |
| Vega | `9ab77e8..c3f9a37` | 通過，高中低風險皆無；2 項參考事項 R1、R2（非安全問題） | 2026-11-19 23:46–23:55；9 項審查 | `pr16-c3f9a37-security-review-vega.md` |

合併發生在 2026-11-19 23:55:45，Vega 的第二輪審查在 23:55 前後完成；我沒有 Iris 三份報告的完成時間，所以無法判斷 Iris 對 `c3f9a37` 的結論是否早於合併，標未驗證。

### 5.5 引用的數字與來源

| 數字 | 對象 | 來源 | 我是否重跑 |
| --- | --- | --- | --- |
| `npm test` 24 項通過 | `9ab77e8` | Rigel、Iris、Vega 各自回報 | 沒有 |
| `npm test` 25 項通過 | `ae0f8bf` | Iris 回報 | 沒有 |
| `npm test` 26 項通過 | `c3f9a37` | Iris、Vega 回報 | 在合併後的 `9ec6f5c` 重跑，26 通過 |
| 對比檢查 48 組 | `9ab77e8` | Rigel、Iris 回報 | 在 `9ec6f5c` 重跑，48 組 OK |
| 40 頁、26/26 產品頁、2 份日報、9 筆搜尋索引、1 個警告 | `9ab77e8`（Rigel 的演練資料建置） | Rigel 回報；Vega 在 `c3f9a37` 的演練建置為 10 筆搜尋索引與 3 個警告（含惡意輸入測試資料，與正式建置不同） | 在 `9ec6f5c` 以正式模式重跑：40 頁、26/26、2 份、9 筆、1 個警告 |
| 站內連結 982 條、斷鏈 0、斷錨點 0 | `9ab77e8` | Rigel 回報 | 沒有（標未驗證） |
| 連續兩次建置 47 檔雜湊一致 | `9ab77e8` | Rigel 回報 | 沒有（標未驗證） |
| 外部請求 0 | `9ab77e8`、`c3f9a37` | Iris（32 組載入）、Vega（靜態掃描） | 沒有 |
| gitleaks v8.30.1 無發現 | `85901f2..9ab77e8`、`9ab77e8..c3f9a37` | Vega 回報 | 沒有 |
| 40 種惡意輸入重跑，PROBLEMS 16 筆，全在 404 頁 | `9ab77e8`、`c3f9a37` | Vega 回報 | 沒有 |
| 線上首頁沒有「GeorgeAI」字樣 | 部署後線上首頁 | 我用 curl 讀線上首頁，計數為 0 | 是（只查首頁，沒查全站） |

### 5.6 線上首頁的實際收合預覽（Ada 轉達，我重驗一項）

| 項目 | 內容 | 來源 |
| --- | --- | --- |
| 線上首頁預覽文字 | 「：NGINX 的 HTTP/2 記憶體毀損漏洞…」 | 我用 curl 讀線上首頁 HTML，`attention-preview` 內容相符 |
| 觀察 | 斷在 CVE 編號前的空白；沒有錯誤資訊，但 CVE 編號沒有露出 | Ada 轉達；我對照 HTML 後確認編號不在預覽內 |
| 與 Iris 驗證時的差別 | Iris 看到的預覽是「…漏洞 CVE-2026-123007 影響 1.9.5 到…」，線上是「…記憶體毀損漏洞…」；差別是資料內容不同（線上的 11-19 重點句文字與她的演練資料不同），原因我沒有查證 | 兩份來源比對，原因標未驗證 |

### 5.7 報告之間對不上的地方（不自行選邊）

| 編號 | 內容 | 兩邊說法 | 處理 |
| --- | --- | --- | --- |
| D1 | F1–F9 編號與內容 | Iris：F4 是 360 第 3 層清單、F5 是首頁重點、F6 選單、F7 目錄 `title`、F8 頁首測試、F9 CSS 測試；Rigel：F4 選單、F5 目錄 `title`、F6–F8 頁首目前項、F9 CSS 負向測試 | 本文以 Iris 為準，見 5.1 |
| D2 | 360 數字 | Iris：同一份資料前後比，F2 卡片 1,021px、首頁收合 h2 502／558；Lin 自述（Iris 引用）為 632.5／917.8／707.4 與 604.5 | Iris 說明差異來自輸入內容與視窗高度不同，我沒有 Lin 的原始資料，不採用 Lin 的數字 |
| D3 | 測試項數 | 同一 PR 不同 commit：24、25、26 | 不是矛盾，是每個 commit 新增測試；見 5.5 |
| D4 | 警告數 | Rigel 建置 1 個；Vega 在惡意輸入測試資料下 3 個 | 輸入資料不同，不是矛盾 |
| D5 | 預覽內容 | Iris 看到「…CVE-2026-123007 影響 1.9.5 到…」，線上為「…記憶體毀損漏洞…」 | 見 5.6，原因未驗證 |

---

## 6 如何套用到別的專案

這個改版有三個可帶到別的靜態網站專案的做法：

1. **一個 PR 分多個 commit 逐關審查，再 squash**：先實作，再讓設計、正確性、安全三種審查者各看一輪，有問題以新 commit 修，審查報告對應 commit 版本。本次 `ee4ccdf`、`9ab77e8`、`ae0f8bf`、`c3f9a37` 就是四個審查版本。代價是 squash 後 commit 訊息只剩一個標題，所以要把各版本與審查結論寫進像本文件這樣的紀錄。
2. **把視覺要求寫成可執行的字串斷言**：本次 F9 把 h2 字級、斷點隱藏、目錄截斷、縮排變數寫成 `site/test.mjs` 的斷言。Iris 與 Rigel 都註明這只防誤刪，不證明畫面正確，畫面仍要人工量測。
3. **截斷文字前先想語意邊界**：H1 的問題是在版本號中間截字會變成錯誤資訊。做法是先找斷點，再把版本號與 CVE 編號整個包成不換行的單位。沒有斷點時的行為見第 7 章 R1。

不適用本次做法的情況：repo 沒有 CI 或沒有三種審查者時，第 1 項要縮減；網站若需要比 meta CSP 更嚴的標頭，需另外處理（Pages 自訂標頭，官方文件未說明，沿用既有紀錄第 8 章的判斷）。

---

## 7 後續維護方式

### 7.1 資料壞掉時

沿用既有紀錄第 7 章：`meta.yaml` 缺欄位或某天資料夾不完整時，建置失敗、整站停更、不發布壞資料，這是 GeorgeAI 的決定。本次改版不改變這個行為（`site/test.mjs` 中的失敗測試仍在，Rigel 與我重跑皆通過）。

### 7.2 後續清理 PR 待辦（Ada 轉達；除第 5 項外都對應審查報告）

| 編號 | 內容 | 說明 | 出處 |
| --- | --- | --- | --- |
| H2 | 手機收合時，預覽第二行以全形「：」開頭 | 預覽因 `display:-webkit-box` 變成區塊，標籤獨占一行，冒號掉到下一行。修法：把冒號放進標籤文字，預覽文字不帶冒號。純外觀，不影響語意與 aria | Iris，`pr16-h1-recheck-c3f9a37.md` 第四節 |
| R1 | 第一句前 48 字內沒有斷點時，HTML 會放整句 | `build.mjs` 第 232–236 行，`end` 退到 0 時 `short` 變成整句；畫面上由 2 行 line-clamp 擋住，但 HTML 多一份完整句，報讀軟體會唸兩次。修法：改在第 48 字硬切，或用 `Intl.Segmenter`。不是注入問題 | Vega，`pr16-c3f9a37-security-review-vega.md` |
| G2 | 每日摘要頁 360 的第一個 h2 y=833 | 上方有 h1、提示框、分頁列。George 原要求「≤520」針對 360 內容頁卡片，CVE 頁 468 通過；是否把此頁也算進，待 Ada 或 George 決定。修法選項：提示框摘要一行、分頁列緊接 h1，或縮減提示框內距 | Iris，`pr16-design-review-9ab77e8.md` |
| CSS | `site.css` 只加不刪 | 對 base 刪除 0 行，舊 840px 規則靠後面覆蓋；Iris 實測 959／960／1279／1280 覆蓋有效，是可維護性問題而非畫面問題。建議另開清理 PR，刪掉被蓋掉的舊規則並跑 `npm test` | Iris，`pr16-design-review-9ab77e8.md` 第九節 |
| 預覽 | 線上收合預覽停在 CVE 編號前 | 見 5.6；不是錯誤資訊，但編號沒露出 | Ada 轉達；我讀線上首頁確認 |

### 7.3 其他參考事項（非阻擋，Vega 回報）

- R2：雙向控制字元（U+202E 等）會原樣輸出，預覽與內文皆然；內文行為在本次之前就存在，不是新引入。若之後匯入外部來源原文，可考慮建置時移除 U+202A–U+202E 與 U+2066–U+2069。
- 搜尋框有 `autofocus`，屬可及性議題，Vega 交給 Iris 或 Rigel 判斷；本次我沒有看到兩位對這點的結論。

### 7.4 之後的檢查節奏

- 2026-11-20 02:00 的首份正式 v3 晨報產生後，補驗第 8 章列出的「正式 v3 資料」與「其他天重點句」。
- 清理 PR 合併前，維持既有紀錄的流程：CI 通過、三種審查、由 Leader 合併。

---

## 8 未驗證項目

| 編號 | 項目 | 為什麼沒驗證 |
| --- | --- | --- |
| U1 | 正式 v3 資料建置與線上顯示 | 首份正式 v3 晨報要到 2026-11-20 02:00 才有；所有驗證用 2026-11-19 的演練資料 |
| U2 | Rigel 對 `c3f9a37` 的補驗 | 已完成，結論通過（Rigel 回報，Ada 轉達；我未重跑他的 982 條連結與 47 檔雜湊）。合併當下尚未完成，是 George 指示先合併，此事實保留。本列由「未驗證」改為「已完成」，其餘未驗證項不變 |
| U3 | 螢幕閱讀器（NVDA、VoiceOver）對 `details` 收合、目錄 `title`、隱藏預覽、選單焦點的實際朗讀 | Iris、Vega、Rigel 都未驗證 |
| U4 | Firefox、Safari；`-webkit-line-clamp` 在這兩者的表現 | Iris 只用 headless Chrome；Vega 沒開瀏覽器 |
| U5 | 實體手機與真實鍵盤 | Rigel 與 Iris 都只用 CSS 與模擬（Iris 用 CDP 模擬按鍵） |
| U6 | 200% 縮放 | 沒人驗證 |
| U7 | 載入時閃爍（CLS）：640px 以下預設 `open`，要等 `toc.js` 執行後才收合，首次繪製若早於腳本，手機會先看到展開再收起 | Iris 兩輪都明說沒量 |
| U8 | 其他天的重點句 | 只有 11-19 一則；其他天只用自造句測試，沒有真實資料 |
| U9 | `ae0f8bf` 的 CI 結果 | 沒有任何報告提到 |
| U10 | Iris 三份報告的完成時間與是否早於合併 | 報告未標時間 |
| U11 | 線上預覽與 Iris 演練資料預覽不同的原因 | 見 5.6，我沒有查證 |
| U12 | 合併後線上全站的外觀、連結與雜湊 | 我只讀了首頁一個 HTML；Rigel 對 `9ab77e8` 的驗證在合併前 |
| U13 | `repo` 設定（分支保護、secret scanning 等）在本次之後是否變動 | Vega 兩輪都說沒重查 |
| U14 | Rigel 的 982 條連結與 47 檔雜湊一致等數字 | 我沒有重跑 |
| U15 | `-webkit-line-clamp`、`<details>` 等瀏覽器行為的官方文件出處 | 我沒有另外查官方文件；Vega 引用過的來源見 `https://developer.mozilla.org/en-US/docs/Web/API/MediaQueryList/change_event` 與 `https://github.com/markdown-it/markdown-it#init-with-presets-and-options`，我沒有重讀 |
| U16 | Node.js 版本 | 本文件沒有讀 workflow，未記錄 |
| U17 | squash 標題仍帶「Draft:」是否要在後續修正 | 歷史不改；是否之後在 repo 其他地方說明，沒有人決定 |
| U18 | Vega 報告兩份只列檔名，我沒有逐項重驗其 22 值 base-path 測試與 gitleaks 結果 | 沒有重跑 |

---

## 9 變更紀錄

只往後加，不改舊列。

| 日期 | 誰 | 變更 | 來源 |
| --- | --- | --- | --- |
| 2026-11-19 | Quill | 新增本文件：PR #16 改版紀錄、F1–F9、G1、H1、各關審查、未驗證項目與清理待辦 | 本次指派（Ada 轉達 George「先合併啊」）；數字與結論來源見各章 |
| 2026-11-20 | Quill | 狀態更新：Rigel 對 `c3f9a37` 的補驗與合併後對 `9ec6f5c` 的補驗皆通過；更新開頭狀態、5.4 審查表、U2，其餘未動 | Rigel 回報，Ada 轉達；tree 相同為我另外用 `git rev-parse` 讀到 |
