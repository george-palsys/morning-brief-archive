# 實作紀錄：SPEC v4 產品動態摘要行與週五新知識小節的建置修正（PR #24）

- 對象：`george-palsys/morning-brief-archive` 的 PR #24（分支 `fix/spec-v4-products-friday`，尚未合併）。
- 紀錄基準：分支 HEAD `5c05167fa547629fc7f0df54ccb07a4ef3c53973`（內含修正 commit `189e11dd94afde4d4a7881586c58b877d04e629f` 與換行修正 commit `5c05167`）。
- 撰寫依據：先讀 `git diff origin/main...HEAD` 的實際內容，再對照 `SPEC.md`；「驗證輸出」一節分成「Ops 回報」與「撰寫者在乾淨 clone 重跑」兩種來源，兩者沒有對上的地方照實並列（見第 6 章）。
- 紀錄狀態：審查結果（程式審查、安全審查、設計審查）尚未回報，列在第 8 章，標「待驗證」。

---

## 1 問題

晨報 SPEC v4 有兩處與建置程式不一致，會讓依 SPEC 寫出的合格晨報建置失敗，或讓版面出錯。

### 1.1 產品動態摘要行：「N 項」對「N 則」

- `SPEC.md` 第六節（歸檔格式）的摘要範本，產品動態那一行寫成 `26 項:有更新 <N>、無更新 <N>、無法確認 <N>、無公開來源 <N>。→ [完整內容](products.md)｜[26 項產品現況](../../products/README.md)`（`SPEC.md` 第 255 行）。
- 其他三個段落（CVE 重大新聞、新知識、台灣 IT 重大事件）的摘要行寫成 `<N> 則。→ [完整內容](…)`（`SPEC.md` 第 267、273、279 行）。
- 修正前的 `site/display-v4.mjs` 對所有段落都只用 `/^(\d+)\s*則/u` 解析摘要行，並要求該數字等於段落檔內的條目標題數。
- 結果：產品動態摘要行照 SPEC 寫成「26 項：…」時，`display-v4.mjs` 認不出，會報「摘要則數、段落標題與 display 則數不一致」；若為了通過改成「N 則」，又違反 SPEC 範本。

### 1.2 週五「本週回顧」「本週動手題」被當成新聞條目

- `SPEC.md` 第三節「每週五加碼」規定：週五的晨報在新知識段落最後多兩個小節，「本週回顧」與「本週動手題」（`SPEC.md` 第 197–202 行）。
- 這兩個小節在 `knowledge.md` 裡是 `##` 層級標題，與每則新知識的標題同層。
- 修正前的 `site/build.mjs` 把所有 `##` 標題都標成 `item-title`，再依序對應 `meta.display` 的條目；週五多出的兩個標題會被當成第 7、8 則條目，造成條目數與 `display` 對不上，或把一般內容套成新聞卡片。

---

## 2 決策：改程式，不改 SPEC

| 項目 | 決策 | 理由 |
| --- | --- | --- |
| 產品動態摘要行 | 程式接受 SPEC 範本的「N 項：有更新…」格式 | SPEC 的範本本身前後一致：產品動態是「26 項」總表（4 種狀態計數），其餘三段才是「則」。SPEC 範本沒有寫錯，是 `display-v4.mjs` 的解析規則比 SPEC 窄。 |
| 週五兩個小節 | 程式把它們從「條目」排除，另渲染為一般卡片 | `SPEC.md` 第三節已明文要求這兩個小節，要求存在、不是新聞條目；改 SPEC 去掉週五加碼會刪掉原本要求的內容。 |
| 條目計數 | 摘要宣告的「N 項」不再要求等於段落標題數 | 產品動態的「26 項」是產品總數，段落檔內的標題數是「今天有動態的產品條目數」，兩者本來就是不同的數字。 |
| 範圍 | 只動 `site/` 底下 3 個檔案 | 不碰 `SPEC.md`、`daily/`、`products/`、`.github/` workflow、`package*.json`。 |

---

## 3 改動檔案

以 `git diff origin/main...HEAD` 為準，3 個檔案，+48／−6。

### 3.1 `site/display-v4.mjs`（+7／−2）

1. 產品動態（`key === 'products'`）改用新規則解析摘要行：`/^(\d+)\s*項\s*[：:]\s*有更新\s*(\d+)、\s*無更新\s*(\d+)、\s*無法確認\s*(\d+)、\s*無公開來源\s*(\d+)。/u`；冒號接受半形 `:` 與全形 `：`。
2. 其他段落仍用原本的 `/^(\d+)\s*則/u`。
3. 新增檢查：產品動態四種狀態計數加總必須等於「N 項」，否則丟出 `產品狀態項數加總與總項數不一致`。
4. 原本的「摘要數字等於段落標題數」檢查，改成只對非產品動態段落生效（`!productCount && Number(count[1]) !== titles.length`）。

### 3.2 `site/build.mjs`（+12／−4）

1. 在 `section === 'knowledge'` 且標題層級為 2 時，判斷標題文字是否為「本週回顧」或「本週動手題」；是的話，標題加上 `weekly-title` 的 class，而不是 `item-title`。
2. 一般條目計數改用獨立的 `entryIndex`，只在渲染一般條目時遞增，所以週五小節不會佔用 `meta.display` 的索引。
3. 渲染時，`weekly-title` 區塊直接輸出為一個 `<article class="news-card">`，內含該小節的標題與內文，不經 `renderEntry`。

### 3.3 `site/test.mjs`（+29／−0）

新增 5 個測試案例，見第 5 章。

### 3.4 另一個 commit：`5c05167 chore: preserve repository LF line endings`

把 `build.mjs`、`display-v4.mjs`、`test.mjs` 的換行還原成 LF（`189e11d` 把它們寫成 CRLF，造成整檔 diff）。此 commit 內容只有換行，`site/test.mjs` 為 +1／−1。對照 `git diff HEAD~2 HEAD --stat`：整體三檔淨變更維持 +48／−6，確認沒有多餘內容變動。

---

## 4 保留的檢查（沒有放寬）

| 編號 | 檢查 | 位置 | 狀態 |
| --- | --- | --- | --- |
| K1 | CVE、新知識、台灣 IT、AI 等其他段落：摘要「N 則」必須等於段落標題數 | `site/display-v4.mjs` | 保留，行為不變 |
| K2 | 所有段落：`meta.display` 的條目數必須等於段落標題數（`entries.length !== titles.length`） | `site/display-v4.mjs` | 保留，產品動態也適用 |
| K3 | 所有段落：必須有「完整內容」連結（`more < 0` 即報錯） | `site/display-v4.mjs` | 保留 |
| K4 | 產品動態：四種狀態計數加總必須等於「N 項」 | `site/display-v4.mjs` | 新增（比修正前更嚴） |
| K5 | 週五小節只在 `knowledge` 段落、`##` 層級、標題文字完全等於「本週回顧」或「本週動手題」時才排除 | `site/build.mjs` | 新增（只認這兩個標題，其他標題仍視為條目） |
| K6 | 產品動態摘要行格式不符新規則、也不符「N 則」時，仍報錯 | `site/display-v4.mjs` | 保留 |

---

## 5 測試案例清單

本次在 `site/test.mjs` 新增 5 個測試案例（兩組 `for` 迴圈各展開成 2 個案例，加 1 個單獨案例）。全部列出如下。

| 編號 | 測試名稱（`npm test` 實際輸出） | 做什麼 | 預期結果 |
| --- | --- | --- | --- |
| T1 | `SPEC v4 product summary accepts : and independent article count` | 把 README 的產品動態摘要行改成半形冒號的 `26 項:有更新 10、無更新 14、無法確認 1、無公開來源 1。`；再把「無更新 14」改成「無更新 13」 | 前者建置成功且 `products` 頁含「26 項」；後者丟出 `產品狀態項數加總與總項數不一致` |
| T2 | `SPEC v4 product summary accepts ： and independent article count` | 同 T1，但冒號為全形 `：` | 同 T1 |
| T3 | `SPEC v4 product summary still rejects display/title mismatch` | 產品動態摘要行改為合格的「26 項:…」，但從 `meta.display.products` 移除最後一筆 | 丟出含 `products：摘要則數` 的錯誤（K2 仍有效） |
| T4 | `SPEC v4 knowledge has six entries with weekly sections=false` | `weekday` 設為星期五，`knowledge.md` 不加週五小節 | `knowledge` 頁恰有 6 張 `class="news-card v4-entry"` |
| T5 | `SPEC v4 knowledge has six entries with weekly sections=true` | `weekday` 設為星期五，`knowledge.md` 末尾加上 `## 本週回顧` 與 `## 本週動手題` | `knowledge` 頁仍恰有 6 張 `v4-entry` 卡片；含「本週回顧」「本週動手題」的 `<h2>` 與各自內文；`class="item-title"` 恰有 6 個（兩個小節未被計為條目） |

其餘既有測試共 36 項（`npm test` 總數 41 減本次新增 5），沒有修改邏輯；既有測試的名稱與內容不在本次範圍，不逐項重列。

---

## 6 驗證輸出

### 6.1 Ops 回報（原樣引用，撰寫者未重跑這一組）

```
BUILD OK: 47 HTML pages; 26/26 product pages; 3 daily editions; 45 search items; 0 warnings; mode=production
```

```
tests 41 / pass 41 / fail 0
```

說明：這組輸出使用的資料集（3 份日報、45 筆搜尋索引）與下方撰寫者重跑的不同；Ops 當時使用的資料來源與指令未附在回報，因此標「待驗證」。

### 6.2 撰寫者在乾淨 clone 重跑（HEAD `5c05167`，Node.js v25.8.2，`npm ci --ignore-scripts` 為 0 vulnerabilities）

`npm test`：

```
ℹ tests 41
ℹ suites 0
ℹ pass 41
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
```

`npm test` 輸出中，本次新增的 5 個測試皆為通過（✔）：

```
✔ SPEC v4 product summary accepts : and independent article count
✔ SPEC v4 product summary accepts ： and independent article count
✔ SPEC v4 product summary still rejects display/title mismatch
✔ SPEC v4 knowledge has six entries with weekly sections=false
✔ SPEC v4 knowledge has six entries with weekly sections=true
```

`npm run build`（此分支 checkout 內的資料）：

```
WARNING: 歷史演練分檔未附 26 項產品來源快照，產品總表未建立；不能視為目前產品現況。
BUILD OK: 40 HTML pages; 26/26 product pages; 2 daily editions; 9 search items; 1 warnings; mode=production
```

### 6.3 兩組輸出對不上的地方（不自行選邊）

| 項目 | Ops 回報 | 撰寫者重跑 |
| --- | --- | --- |
| 測試 | 41 pass、0 fail | 41 pass、0 fail（一致） |
| HTML 頁數 | 47 | 40 |
| 日報期數 | 3 | 2 |
| 搜尋索引 | 45 | 9 |
| warnings | 0 | 1（歷史演練資料缺 26 項產品來源快照） |

可能原因是兩邊建置時 `daily/` 的內容不同（例如 Ops 使用含正式日報的資料）；這是推測，沒有證據，標「待驗證」。測試結果一致，建置數字差異來自輸入資料，與本次程式修改的關係未驗證。

---

## 7 如何驗收（重現指令）

在乾淨 clone 的分支 `fix/spec-v4-products-friday`：

```
git clone --branch fix/spec-v4-products-friday https://github.com/george-palsys/morning-brief-archive.git
```

```
cd morning-brief-archive
```

```
npm ci --ignore-scripts
```

```
npm test
```

```
npm run build
```

預期：`npm test` 為 41 pass、0 fail；`npm run build` 顯示 `BUILD OK`，且 `26/26 product pages`。建置頁數、日報期數、搜尋筆數取決於 `daily/` 的資料內容（見第 6.3 節）。

---

## 8 未驗證項目

| 編號 | 項目 | 狀態 |
| --- | --- | --- |
| U1 | 瀏覽器視覺呈現：產品動態頁與週五新知識頁的實際畫面，含「本週回顧」「本週動手題」卡片外觀 | 待驗證 |
| U2 | 部署後公開頁面：合併並部署到 GitHub Pages 後，線上頁面是否正常 | 待驗證 |
| U3 | 程式審查結果 | 待驗證（審查結果尚未回報） |
| U4 | 安全審查結果 | 待驗證（審查結果尚未回報） |
| U5 | 設計審查結果 | 待驗證（審查結果尚未回報） |
| U6 | Ops 回報的建置數字（47 頁、3 期、45 筆、0 warnings）的資料來源 | 待驗證 |
| U7 | 以真實的週五晨報資料（非測試 fixture）建置 | 待驗證；T4、T5 使用測試 fixture |
| U8 | 產品動態摘要行含其他全形或半形標點變化（例如句號用半形 `.`）時的行為 | 待驗證；新規則的句尾只接受全形 `。` |

---

## 9 變更紀錄

| 日期 | 內容 |
| --- | --- |
| 2026-11-20 | 初版：依 PR #24 的實際 diff 撰寫；審查結果待回，補上後更新同一份文件 |
