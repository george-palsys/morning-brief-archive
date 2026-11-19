# 靜態網站建置與交付

本網站使用 Node.js、markdown-it 15.0.3、yaml 2.9.1。直接依賴鎖版本，完整相依樹與 integrity 在根目錄 package-lock.json。CI 使用 Node.js 24；本機驗證使用 Node.js 25.8.2、npm 11.11.1。系統字型、本站 CSS 與 JS，無 CDN、第三方分析或遠端圖片。

## 本機建置

1. 在 repository 根目錄安裝依賴：

   ```powershell
   npm ci --ignore-scripts
   npm ls --depth=0
   ```

   驗證預期：exit code 0，列出 markdown-it@15.0.3、yaml@2.9.1。

2. 執行驗證（測試使用 site/fixtures/preview.json，不需要 Git 分支、網路或登入）：

   ```powershell
   npm test
   npm run check:contrast
   ```

   驗證預期：16 tests、16 pass、0 fail；CONTRAST OK: 48 CSS color pairs。測試中兩種故意製造的不一致會印 WARNING，該警告是測試證據。對比包含兩種模式的 border-strong／bg、surface、surface-hover，低於 3:1 會停止；另逐項印出此六組實算值。不代表完整 WCAG 合規審查。

3. 建置正式內容到尚不存在或空的輸出資料夾：

   ```powershell
   npm run build -- --base-path /morning-brief-archive/
   Get-Content -Encoding UTF8 _site/build-report.json
   (Get-ChildItem -LiteralPath _site/products -Filter *.html -File | Where-Object Name -ne index.html).Count
   ```

   驗證預期：BUILD OK、mode=production、26/26 product pages；報告列出 26 個產品頁；最後指令為 26。main 尚無 products/ 時，產品頁是清楚的無資料佔位頁，首頁與總表不展示虛構狀態格。

   為避免誤刪既有資料，建置器拒絕非空輸出資料夾。重跑時明確換新輸出資料夾：

   ```powershell
   npm run build -- --output _site-review-2
   Get-Content -Encoding UTF8 _site-review-2/build-report.json
   ```

   驗證預期：exit code 0、mode=production。產出不含原始 meta.yaml、products.yaml、items.jsonl、state/ 或測試資料，僅 HTML、本站資源、搜尋 JSON 與建置報告。

### Windows Git Bash

Git Bash 會將 `--base-path /morning-brief-archive/` 轉成 Windows 路徑；使用 `MSYS_NO_PATHCONV=1` 避免路徑轉換。以下每行是一個完整指令：

```bash
MSYS_NO_PATHCONV=1 npm run build -- --base-path /morning-brief-archive/
node -p "JSON.parse(require('node:fs').readFileSync('_site/build-report.json','utf8')).basePath"
```

驗證預期：建置 exit code 0，第二行輸出 `/morning-brief-archive/`。輸出目錄仍須不存在或為空；若已建過，改用新的 `--output` 路徑。這是 Git Bash 用法，PowerShell 不使用此前綴。

### 站台路徑與 404

404 的 CSS 與站內連結已由建置參數 `--base-path` 產生，沒有另一份固定網址。repo 改名或改掛載路徑時，請更新 `.github/workflows/pages.yml` 建置步驟的 `--base-path`，本機建置也傳同一值；若省略參數，`site/build.mjs` 預設為 `/morning-brief-archive/`。只換網域且路徑不變時不用改參數；改掛網域根目錄時傳 `/`。

```powershell
npm run build -- --output _site-renamed --base-path /renamed-repo/
Select-String -LiteralPath _site-renamed/404.html -SimpleMatch '/renamed-repo/assets/site.css'
```

驗證預期：建置 exit code 0，404 HTML 命中 `/renamed-repo/assets/site.css`，導覽也使用同一路徑；一般頁面仍用相對連結。不使用 base 元素，CSP 與路徑白名單維持。

## 演練資料與證據

fixture 來源：george-palsys/morning-brief-archive 分支 preview-v2-2026-11-19，commit e1944ffbc1626e02e5f127360bdacadac6ee8fae 的 preview/daily/、preview/products/，合計 35 個檔案。快照只在 site/fixtures/preview.json。site/capture-fixture.mjs 記載擷取方式與固定 commit；不屬正式建置步驟。

測試把 fixture 展開到忽略的 .site-test/input-*，產出在 .site-test/output-*，測試紀錄列出實際位置。演練必須明確加 --allow-rehearsal 才能建置，且每頁顯示「演練資料，非正式晨報」；production 遇到 rehearsal/preview type 一律失敗。fixtures 不會自動複製到 daily/ 或 products/。

## 內容與導覽

- README.md 轉 index.html，其他 .md 轉同名 .html；一般頁面站內使用相對連結，支援 /morning-brief-archive/ 子路徑。只有 404 頁使用 --base-path 指定的絕對站內路徑（預設 /morning-brief-archive/），避免深層錯誤網址使資源解析錯誤；不使用 base 元素、404 不載入腳本，CSP base-uri 'none' 維持。base-path 只接受 /，或以 / 開頭及結尾、由英數字、底線與連字號組成的路徑。
- daily/2026-11-19.md 保留原樣，轉 daily/2026-11-19.html，剝除 frontmatter，顯示「舊版格式」提示；不拿演練摘要取代舊版。
- v3 日期資料夾需有 README.md、products.md、knowledge.md、cve.md、taiwan.md、ai.md、maintenance.md、meta.yaml，缺任何一個立即失敗；meta 欄位及型別也檢查。
- 逐產品狀態取 products/README.md，與最新 v3 meta 的 products_updated、products_unconfirmed 交叉比對，不一致則印警告且在首頁與總表顯示。總表列數錯誤顯示實際列數；個別產品檔缺失會失敗。
- 原始 HTML 轉義，來源圖片只顯示替代文字；拒絕危險 URL 協定與根路徑。來源外部連結加 noopener noreferrer，不另開視窗。
- 每頁 CSP meta 禁止 inline script/style；搜尋以 textContent 建立結果。搜尋索引按月拆分，聚焦後才載入最近三個月，另可搜尋全部。
- 關於頁只呈現站台用途、來源、內容範圍與產生規則。
- 摘要表在手機以每列卡片呈現，外層不另加框、不提供捲動焦點；桌面恢復自動換行的表格。需要橫向捲動的來源寬表保留外框、具名 region 與 tabindex=0，沿用全站 3px focus-visible 外框，方便鍵盤使用者捲動。
- R4 依 Iris 更正規格，淺色 border-strong 改 #7d8690，對 bg／surface／surface-hover 分別為 3.69／3.47／3.17:1；深色 #8b949e 維持。實際值從 CSS 讀取並在對比檢查中驗證。

## CI 與部署（本 PR 不啟用）

PR 與 main push 都跑建置、資料測試、對比檢查並封裝 Pages artifact。部署 job 僅在 main，且手動執行 deploy=true，或 main push 且 repository variable PAGES_DEPLOY_ENABLED=true 時執行。未設定該變數時自動部署關閉。不使用 configure-pages 的自動啟用功能。

頂層 contents: read；只有部署 job 有 pages: write、id-token: write。checkout 不保留憑證；所有 action 釘完整 SHA，旁註 tag，SHA 於 2026-11-19 用官方 repository 的 git ls-remote 核對。

以下只是設定建議，本次沒有執行：由 Leader 審查後將 Pages publishing source 設為 GitHub Actions、建立並限制 github-pages environment 只允許 main、啟用部署開關；另建議 main 要求 PR、禁止強推與刪除，開啟 secret scanning/push protection、Dependabot，限制允許的 actions 並要求 SHA。這些設定不在本 PR 執行範圍，也沒有改動排程或 SPEC 產生規則。

## 未驗證

- GitHub Actions 遠端執行、GitHub Pages 真正部署與公開網址。
- 第一份正式 v3 排程產出；目前只有固定演練快照。
- Iris 的完整 37 項瀏覽器設計審查（320px、360px、200% 文字、深色、鍵盤、螢幕閱讀器、網路請求）。
- Rigel 的獨立內容／連結／產出驗證與 Vega 的獨立 Security Code Review。
- 手動三態主題切換、列印樣式為設計規格選配，未實作；目前跟隨系統深淺色。
- 摘要卡片無宣告則數時以「小節」數顯示，未把結尾輔助清單猜成新聞數。新聞標題錨點以 item-N 編號，重排後不保證原分享網址仍指向同一則。
- 404 已用本機 HTTP 測試模擬三種 base-path 與三種深度，確認錯誤網址回 404、其 CSS 與站內導覽回 200；真正 Pages 部署仍未驗證。

## 官方依據

- [GitHub Pages 自訂 workflow 與部署權限](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)
- [actions/deploy-pages 官方 repository](https://github.com/actions/deploy-pages)
- [markdown-it 官方使用文件](https://markdown-it.github.io/markdown-it/)
- [WCAG 相對亮度公式](https://www.w3.org/TR/WCAG22/#dfn-relative-luminance)

設計數值依 Iris 2026-11-19 morning-brief-site-design-spec.md；安全邊界依 Vega 同日 morning-brief-archive-security-baseline-2026-11-19.md。這是實作來源，並不代表其審查已通過。
