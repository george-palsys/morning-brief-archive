# 實作紀錄：SPEC v4 產品摘要與週五新知識小節（PR #24）

- 對象：[PR #24](https://github.com/george-palsys/morning-brief-archive/pull/24)，分支 `fix/spec-v4-products-friday`，本次不合併。
- 依據：main `f99d84c0ca0541fdaa8292ad74f019ea199d77ea` 的 `SPEC.md`、實際程式 diff、乾淨 checkout 測試與正式歸檔副本建置。
- 本文件由原始實作紀錄 patch 套用後更新，包含後續程式與設計審查修正。日期：2026-11-20（台灣時間）。

## 1 問題與決策

`SPEC.md` 第六節產品摘要使用「26 項:有更新 <N>、無更新 <N>、無法確認 <N>、無公開來源 <N>。」；原程式一律要求「N 則」，把產品總數與更新條目數混為一談。

`SPEC.md` 第三節要求週五在新知識最後增加「本週回顧」「本週動手題」。原程式把這兩個二級標題也對應到 display 條目，導致建置失敗。

本次改程式，不改 SPEC 或日報文字。保留舊「N 則」格式相容性；產品摘要的總項數與更新條目數分開驗證。兩個週五小節在所有條目之後顯示，不占用 display 索引。

初版排除小節時留下狀態旗標，後面的三級標題可能被併入週回顧卡而沒有報錯（審查代號 K6）。本次對錯誤順序明確報錯，並在渲染結束後比對實際條目數與 display 項數。

## 2 改動檔案

| 檔案 | 改動 |
| --- | --- |
| `site/display-v4.mjs` | 接受產品摘要的全形與半形冒號；驗證四種狀態加總；保留標題數與 display 數量檢查 |
| `site/build.mjs` | 週五小節不占 display 索引；拒絕小節出現在條目前或小節後還有條目；檢查輸出條目數；小節使用 `news-card v4-entry` |
| `site/test.mjs` | 產品格式、加總、條目數、週五小節順序及卡片結構回歸測試 |
| `docs/implementation/2026-11-20-spec-v4-products-friday-fix.md` | 實作、驗證、審查修正與後續事項紀錄 |

未提交正式歸檔的 `daily/2026-11-20/`、`products/`、`items.jsonl`、`state/`。未變更 SPEC、workflow、套件版本或 CSS，沒有新增外部資源。

## 3 保留的檢查與新增防護

| 編號 | 檢查 | 結果 |
| --- | --- | --- |
| C1 | 非產品段落的摘要「N 則」必須等於三級標題數 | 保留 |
| C2 | 各段落 display 項數必須等於三級標題數 | 保留，產品動態也適用 |
| C3 | 摘要必須連結該段落完整內容 | 保留 |
| C4 | 產品四種狀態加總必須等於摘要總項數 | 新增 |
| C5 | 格式不符產品摘要規則也不符舊「N 則」格式時失敗 | 保留 |
| C6 | 只有 knowledge 的二級標題「本週回顧」「本週動手題」視為附錄小節 | 保留 |
| C7 | 渲染完成的條目數必須等於 display 項數；過少時明確 throw | K6 修正新增 |
| C8 | 週五小節出現在第一個條目前時明確 throw | K6 修正新增 |
| C9 | 週五小節後再出現三級或更深標題時明確 throw；中間其他二級標題也不會清除順序限制 | K6 修正新增 |
| C10 | renderEntry 缺少對應 display 時仍 throw，防止輸出多於 display | 保留 |

週五兩節輸出 `<article class="news-card v4-entry">`，標題維持 h2，不產生 `.v4-keyword` 或空白 span。套用既有內距、行長與交替底色；兩節是附錄卡片，仍不計為六則新知識。

## 4 測試案例

原有 36 項測試保留，本 PR 共新增 9 項，合計 45 項。

| 編號 | 測試 | 預期結果 |
| --- | --- | --- |
| T1 | 產品摘要使用半形冒號，總數 26、狀態 10、14、1、1；接著改成 10、13、1、1 | 前者成功，後者因加總不符失敗 |
| T2 | 產品摘要使用全形冒號，總數 26、狀態 10、14、1、1；接著改成 10、13、1、1 | 前者成功，後者因加總不符失敗 |
| T3 | 產品摘要合法，但移除一筆 display.products | 標題數與 display 不符，失敗 |
| T4 | 星期五不含兩節附錄 | 成功，六張條目卡 |
| T5 | 星期五在六則之後包含兩節附錄 | 成功，八張卡、六個 item-title、六個 keyword、兩個 weekly-title；兩節 h2 與內容保留 |
| T6 | 週五小節放在所有條目前 | 明確失敗 |
| T7 | 週回顧插在第三與第四則之間 | 明確失敗，不吞掉第四則 |
| T8 | 直接渲染時，display 一筆但沒有輸出條目 | 明確失敗，錯誤為 display.knowledge 項目數與輸出條目數不一致 |
| T9 | 週回顧後經過另一個二級標題，再出現第四則 | 明確失敗，順序限制不會被重設 |

## 5 實際驗證輸出

環境：Node.js v25.8.2。測試在未混入正式歸檔的乾淨 checkout 執行。正式建置在另一個暫存 clone 執行，僅該 clone 加入歸檔副本。

乾淨 checkout 的 `npm test`：

```text
ℹ tests 45
ℹ suites 0
ℹ pass 45
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
```

`npm run check:contrast`：

```text
CONTRAST OK: 70 CSS color pairs (light + dark)
```

歸檔來源是本機晨報歸檔的 `daily/2026-11-20/`、`products/`、`items.jsonl`、`state/sources.json`，原樣複製，不變更文字。在暫存 clone 執行 `node site/build.mjs --output ../revision-site-final`：

```text
BUILD OK: 47 HTML pages; 26/26 product pages; 3 daily editions; 45 search items; 0 warnings; mode=production
```

複製前建立 SHA-256 清單，建置後逐檔比較來源與副本：

```text
SHA256 OK: 37 files; original and copied bytes unchanged
```

正式 knowledge HTML 結構驗證：八個 `news-card v4-entry`、六個 `item-title`、六個 `v4-keyword`、兩個 `weekly-title` h2；兩個附錄卡沒有 keyword，頁首仍為「6 則」。所有產出 HTML 均未出現指定團隊成員名稱。

### 輸入資料差異的說明

測試須在乾淨 checkout 跑；既有測試有固定資料筆數假設，混入正式歸檔後執行可能失敗。建置頁數取決於 `daily/` 內容，搜尋筆數取決於 `items.jsonl`。初次紀錄的乾淨 clone 得到 40 頁、2 期、9 筆、1 個警告；加入正式日報與產品快照的本次暫存 clone 得到 47 頁、3 期、45 筆、0 個警告。兩組輸入不同，不能把頁數差異當成測試失敗。

## 6 重現與預期結果

1. 取得分支，確認所在分支與 commit。

```sh
git clone --branch fix/spec-v4-products-friday https://github.com/george-palsys/morning-brief-archive.git
cd morning-brief-archive
git branch --show-current
git rev-parse HEAD
```

預期：分支為 `fix/spec-v4-products-friday`；HEAD 與 PR 當前 head 一致。

2. 安裝鎖定套件並確認直接相依套件。

```sh
npm ci --ignore-scripts
npm ls --depth=0
```

預期：安裝 exit 0，markdown-it 15.0.3、yaml 2.9.1。

3. 在乾淨 checkout 跑測試與對比檢查。

```sh
npm test
npm run check:contrast
```

預期：45 pass、0 fail；70 組色彩對比通過。

4. 在另一個暫存 clone 複製歸檔副本並記錄 SHA-256，執行建置。

```sh
node site/build.mjs --output ../verification-output
```

預期：BUILD OK；輸出目錄須事先不存在或為空。只有輸入同於本次歸檔副本時才預期 47 頁、3 期、45 筆、0 警告。複製後與建置後的 SHA-256 均須與來源一致。

## 7 審查狀態與待驗證

| 項目 | 狀態 |
| --- | --- |
| 程式審查 K6 | 已修正，新增順序限制與輸出條目數檢查；回歸測試通過 |
| 設計審查附錄卡片樣式 | 已修正為 news-card v4-entry，無 keyword；正式 HTML 結構檢查通過 |
| 安全審查 | 審查回報通過；本次未改 URL、HTML 安全設定或外部資源政策 |
| 瀏覽器視覺呈現 | 待驗證 |
| 部署後公開頁面 | 待驗證 |

## 8 後續（本 PR 不處理）

| 項目 | 後續決策 |
| --- | --- |
| N4：產品摘要總數尚未固定限制為 26 | 由專案負責人與使用者決定政策 |
| N5：產品狀態加總尚未逐項核對 products/README.md 表格 | 由專案負責人與使用者決定政策 |
| K1：星期五是否強制必有兩節附錄 | 由專案負責人與使用者決定政策 |
| K2：非星期五是否禁止兩節附錄 | 由專案負責人與使用者決定政策 |
| 手機 pre 指令區塊被截斷 | 既有樣式問題，另行處理 |

上述政策問題與手機樣式不是本 PR 引入；本次未放寬或修改其政策。
