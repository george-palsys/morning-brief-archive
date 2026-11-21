# 第四輪 r3：裁示實作與本機驗證

以 f7a9dae 為整組 patch 基準，承接 r2 六筆 commit；本次新增一筆 commit。作者與 committer 採 Palsys docs <noreply@example.invalid>。沒有推送、合併、刪除 repo 或改寫公開歷史。

| 裁示 | 實作與驗證 |
|---|---|
| 1181px 間距修正 | desktop 面板 align-self:start，legend→link margin-top:60px；取消 1024–1180px 的 space-between 例外。1179、1180、1181、1182、1199、1200、1201px 皆實測 60px。1180→1181 面板高度皆 546.7292px，hero 高度 591.7709→591.9271px，沒有原先額外 44px 的突變。 |
| 手機產品監測 | DOM 分為前兩則清單、stack 面板、剩餘清單；桌面保留 hero 右欄面板。移除跳轉連結。360、390、768、1023px 量測面板位於第 2 與第 3 則之間。 |
| 跟隨系統與手動切換 | 保留既有主題實作，未修改 theme-init.js 或主題切換邏輯。 |
| 每日摘要與歸檔 hero | overview、archive、legacy 容器加入既有 hero 圖與概念插畫說明；既有 reading 圖保留。5 個摘要／歸檔／舊版頁各 1 個 hero，測試已通過。 |
| wrapCveText | builder-owned HTML 合約不變。整段略過註解、title、script、style、textarea；保留 code/pre 與既有 cve-id span；加 token 邊界，重複執行不重複包 span。涵蓋大小寫、帶空白結束標籤、未結束註解與 raw element、引號內 >。不是通用 HTML sanitizer。 |
| 預覽與歷史 | 沒有遠端操作；PR draft 狀態本次未讀回；沒有刪除預覽 repo；早期公開 commit author 未重寫。 |
| 窄版補修 | 360px 與傳統捲軸使可用寬度為 345px，頁首原溢出 12px；品牌文字允許縮排換行，兩個操作按鈕保持原尺寸。補修後 scrollWidth=clientWidth=345px。 |

量測來源是內建 Browser 的 Chromium 158，使用同源 iframe CSS viewport，字型載入後每次 resize 等待兩個 animation frames。這是 CSS 響應式量測，不是真機或完整裝置模擬。量測的 94 個網站檔案與最終 build 逐檔 bytes 相同；量測 harness 不列入 ZIP。原始 JSON 與檢查輸出隨交付留存。

| 寬度 | legend→link | 第2則 bottom | 面板 top | 面板 bottom | 第3則 top |
|---|---|---|---|---|---|
| 1180 | 60px | 1678.30 | 387.29 | 934.02 | 1694.30 |
| 1181 | 60px | 1678.58 | 387.42 | 934.15 | 1694.58 |
| 1200 | 60px | 1682.50 | 389.21 | 936.60 | 1698.50 |
| 360 | 0px | 1112.32 | 1124.32 | 1371.49 | 1383.49 |
| 390 | 0px | 1087.68 | 1099.68 | 1322.84 | 1334.84 |

桌面面板在 hero 右欄，故其座標不與新聞排序比較。手機面板不是放到首屏內，裁示是放在第 2 則之後。

| 檢查指令（repo 根目錄） | 預期與本次實際結果 |
|---|---|
| `npm ci --ignore-scripts` | 8 packages，0 vulnerabilities |
| `npm test` | 67 tests，67 pass，0 fail，0 skipped |
| `npm run check:contrast` | CONTRAST OK: 42 pairs × 2 themes |
| `npm run build -- --output ../build-output --base-path /morning-brief-archive/` | 使用全新空目錄；54 HTML pages、26/26 product pages、4 daily editions、66 search items、0 warnings |
| `git diff --check` | exit 0，無 whitespace error |
| `git diff --exit-code f7a9dae -- daily products items.jsonl state` | exit 0，正式資料未改 |

建置使用 Node v25.8.2。不宣稱所有瀏覽器、裝置、輔助技術已驗收。以下逐項未驗證：

- 真機：未驗證。
- Safari：未驗證。
- Firefox：未驗證。
- Node 24：未驗證。
- 螢幕閱讀器：未驗證。
- 列印：未驗證。
- 深色模式截圖：未驗證；對比程式雙主題檢查已通過。
- 首幀閃爍：未驗證。

交付不涉及部署。若後續本機試套 patch 尚未完成，可用 `git am --abort` 退出，驗證 `git status --short` 回到試套前狀態。已完成套用時，可切回事先保留的基準分支，驗證 `git rev-parse HEAD` 是 f7a9daed7004e2dfa5d137821d7c302c9406870e。不要以 reset/force 改寫公開分支。
