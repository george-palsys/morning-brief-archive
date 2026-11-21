# Visual kit r4：合併後小修

基準是本次實際讀取的 origin/main：88e855b47b73faa6d8704cf6501c49a4fb8c69ee。工作分支 feat/visual-kit-r4。本次只做本機交付，沒有推送、合併或更新 main。

| 問題 | 修正 | 本機 Browser 深色量測 |
|---|---|---|
| CVE 內頁第 2 則編號在連字號斷行 | item-title code 設定 white-space:nowrap、overflow-wrap:normal、word-break:normal；保留 code 語意及編號原文 | 390px 的 CVE-2026-90436 原有 2 個文字行座標，修正後 1 個；360、768、1181px 亦為 1 行 |
| 首頁 hero 右括號孤字落行 | 完整全形括號與編號包 mb-cve-group，整組 inline-block nowrap；含該組的 hero 標題採 clamp(24px,2.4vw,34px)，避免整組超出欄寬 | 1181px 編號與右括號同列；整組 290.09375px，標題欄寬 338.85419px。360、390、1024、1179、1180、1181、1182、1200、1366px 全部容納整組，桌面監測間距仍為 60px |
| 深色選取 chip 太接近底色 | 選取 chip 使用已經過對比檢查的 selected-bg、selected-ink、selected-border；沿用 aria-pressed／aria-current | 390px 全部 26：border rgb(157,179,255)，background rgb(29,43,92)；其餘 360、768、1181px 一致 |
| 每日摘要第 5 張數量卡較高 | v4-counts li 的 align-items 改為 stretch，使卡片填滿同一列高度 | 1366px 修正前 100.625、100.625、100.625、100.625、125.125px；修正後五張均 125.125px。1181、1280px 五張亦等高 |
| 歸檔標題欄過窄，分隔符孤立 | 桌面改兩個彈性欄，標題欄最小 260px；演練版本分隔符與說明包同一個 nowrap span；窄版允許整組換行 | 1181px 的 2026-11-19 演練列標題欄 220→440px，標題文字由 2 行變 1 行；360、390、768px 版本說明整組均容納 |
| hero 圖位置 | 沿用現況，不修改圖的插入位置、來源或素材 | 摘要與歸檔圖仍在麵包屑上方；CVE 頁本次未移動任何圖 |

依據為程式差異、本機 Chromium 158 同源 iframe CSS viewport、字型載入後每次 resize 等待兩個 animation frames 的實測；不是手機裝置模擬。深色測量明確設 data-theme=dark。共 24 個頁面／寬度組合，scrollWidth 均等於 clientWidth。原始量測及前後差異隨交付附上，不將本機路徑寫入公開頁面。

| 驗證指令（repo 根目錄） | 預期／已觀察結果 |
|---|---|
| `npm ci --ignore-scripts` | 8 packages；0 vulnerabilities；exit 0 |
| `npm test` | 全部既有 67 tests 通過；0 fail；0 skipped |
| `npm run check:contrast` | 42 pairs × 2 themes 通過 |
| `npm run build -- --output ../r4-clean-build --base-path /morning-brief-archive/` | 使用新的空目錄，54 HTML pages、26/26 product pages、4 daily editions、66 search items、0 warnings |
| `git diff --check origin/main..HEAD` | 無輸出，exit 0 |
| `git diff --exit-code origin/main -- daily products items.jsonl state` | 無輸出，exit 0，正式資料未改 |

套用交付 patch 應在獨立副本的上述基準執行 `git am ../visual-kit-r4.patch`，完成後以 `git status --porcelain` 驗證無輸出、以 `git log -1 --format=fuller` 驗證作者及 committer 均為 Palsys docs <noreply@example.invalid>。若套用中斷，`git am --abort` 可回到試套前，並以 `git status --porcelain` 驗證無新異動。本次沒有部署，沒有破壞性變更或公開歷史改寫。

- 真機：未驗證。
- Safari：未驗證。
- Firefox：未驗證。
- Node 24：未驗證；本機使用 Node v25.8.2。
- 螢幕閱讀器：未驗證。
- 列印：未驗證。
- 深色模式截圖：未驗證；本次已完成深色 DOM、色值與幾何量測。
- 首幀閃爍：未驗證。

遠端 CI、部署與獨立複審未執行。既有 hero 位置維持原樣，不把本次 CSS 量測稱為完整視覺或無障礙驗收。
