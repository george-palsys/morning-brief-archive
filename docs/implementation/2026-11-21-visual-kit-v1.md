# 實作紀錄：晨報歸檔站視覺素材與動畫 v1（PR #34，草稿）

- 位置：`docs/implementation/2026-11-21-visual-kit-v1.md`（`george-palsys/morning-brief-archive`，分支 `feat/visual-kit-v1`）。
- 性質：這是內部晨報歸檔站的實作紀錄，不是對客戶交付的成果。朋昶數位科技（Palsys）是 IBM 代理商，不提供顧問服務，本文件不是顧問案紀錄。
- 對象：PR #34（草稿）。基底為 main `26e43aab86d93b7fda04849562d09561f4694f15`。本文件撰寫時，分支的最新實作 head 為 `fb57c6450bd23d4cd661e71ce557387c00922191`；本文件是接在其後的獨立 commit，不改變實作內容。
- 角色用語：本文件在公開 repo 內，人員一律以角色稱呼：「設計」（出規格與素材、做設計審查）、「實作」（改程式、補 commit）、「驗證」（獨立重跑與瀏覽器實測）、「安全審查」、「文件撰寫」。
- 依據：設計規格、設計審查報告（三輪）、驗證報告、安全審查報告（`fb57c64`），以及文件撰寫自己重跑的項目（第 5.6 節標明）。報告檔含人員名稱與本機路徑，不放進公開 repo，所以本文件只引用章節內容，不引用檔名。沒有依據的寫「未驗證」。
- 本文件不寫「全部通過」。各審查者的「通過」只涵蓋該報告列出的範圍，範圍外見第 8 章。
- 本文件不宣稱驗收。專案負責人尚未確認視覺效果（見 1.2）。

## 1 背景與核准

### 1.1 起因與核准

1. 專案負責人提供《Morning Brief 視覺素材與動畫交付包 v1》，要求網站視覺升級，並要求「先完成首頁、CVE 內頁和產品總覽三種模板，讓我確認視覺效果」（由 Chief of Staff 轉達；文件撰寫沒有看到原始對話）。
2. 視覺基準仍是專案負責人已核准的方案 A：僅淺色、CSP 只用 meta。本 PR 沒有改變方案 A 的色彩、字型與元件。
3. 素材共 18 個檔：6 張 WebP 橫幅與 12 個 SVG 圖示（第 3.1 節逐項列出）。

### 1.2 目前狀態

1. PR #34 是草稿，沒有合併。確認視覺效果的人是專案負責人，確認尚未發生。
2. 這個 PR 的目的是讓專案負責人看預覽。預覽公開網址見第 4.5 節。

## 2 範圍與不動項目

### 2.1 範圍（只有 3 個模板）

1. 首頁：`index.html`。
2. CVE 內頁：`daily/2026-11-21/cve.html`（只有這一天的這一頁）。
3. 產品總覽：`products/index.html`。

**其餘 51 頁沒有做。** 一般建置共 54 頁 HTML，3 頁套用視覺素材，其餘 51 頁不套用。預覽版本的其餘 51 頁與一般建置的差別只有 `<meta name="robots" content="noindex, nofollow">`（4.2 說明）。

### 2.2 預設建置不動

1. 不加 `--visual-preview` 的建置，輸出與 main 逐檔位元組相同（61 個檔，SHA-256 相同）。驗證與安全審查各自驗過；文件撰寫也重做一次（5.6）。
2. 一般建置不含 `<meta name="robots">`，不含 `assets/visuals/` 資料夾，`assets/app.js` 也不含視覺動畫段落。

### 2.3 受保護路徑（相對 main 0 變更）

1. `.github/workflows/`：0 變更。
2. `daily/`：0 變更。
3. `products/`：0 變更。
4. `SPEC.md`：0 變更。
5. `products.yaml`：0 變更。
6. `items.jsonl`：0 變更。
7. `package.json`、`package-lock.json`：0 變更。

來源：驗證與安全審查各自檢查；文件撰寫也以 `git diff --stat 26e43aa HEAD` 針對上列路徑重查，結果為空。

### 2.4 內容不動

1. CSP 不變：`default-src 'none'; style-src 'self'; script-src 'self'; img-src 'self'; font-src 'self'; connect-src 'self'; base-uri 'none'; form-action 'none'`。素材都由本站同源載入，沒有新增外部資源。
2. 日報與產品內容不改。唯一的資料推導是首頁與 CVE 頁的狀態文字，改用已存在的結構化欄位（見 4.3）。

## 3 設計規格與原型

### 3.1 素材（6 張 WebP、12 個 SVG，逐項列出）

| 編號 | 檔名 | 用途 | 尺寸／大小 |
|---|---|---|---|
| 1 | `hero-cybersecurity.webp` | 首頁主視覺與 CVE 內頁橫幅、桌面 | 1440×320 |
| 2 | `hero-cybersecurity-mobile.webp` | 首頁主視覺與 CVE 內頁橫幅、手機 | 640×320 |
| 3 | `hero-infrastructure.webp` | 產品總覽橫幅、桌面 | 1440×320 |
| 4 | `hero-infrastructure-mobile.webp` | 產品總覽橫幅、手機 | 640×320 |
| 5 | `hero-ai.webp` | 本輪 3 個模板沒有引用（只被複製進預覽輸出） | 1440×320 |
| 6 | `hero-ai-mobile.webp` | 本輪 3 個模板沒有引用（只被複製進預覽輸出） | 640×320 |
| 7 | `icon-ai.svg` | 圖示 | 358–489 B 之間 |
| 8 | `icon-archive.svg` | 圖示 | 358–489 B 之間 |
| 9 | `icon-book.svg` | 圖示 | 358–489 B 之間 |
| 10 | `icon-cloud.svg` | 圖示 | 358–489 B 之間 |
| 11 | `icon-document.svg` | 圖示 | 358–489 B 之間 |
| 12 | `icon-layers.svg` | 圖示 | 358–489 B 之間 |
| 13 | `icon-network.svg` | 圖示 | 358–489 B 之間 |
| 14 | `icon-patch.svg` | 圖示 | 358–489 B 之間 |
| 15 | `icon-radar.svg` | 圖示 | 358–489 B 之間 |
| 16 | `icon-search.svg` | 圖示 | 358–489 B 之間 |
| 17 | `icon-shield.svg` | 圖示 | 358–489 B 之間 |
| 18 | `icon-spark.svg` | 圖示 | 358–489 B 之間 |

補充：

1. 用途欄是文件撰寫從原始碼（`round3.mjs`、`build.mjs`）與預覽輸出的 `<picture>` 讀回：首頁與 CVE 內頁都用 `hero-cybersecurity`，產品總覽用 `hero-infrastructure`，`hero-ai` 兩檔沒有被任何頁面引用。設計規格原先的對應是否如此，文件撰寫沒有逐項核對，**差異未驗證**。
2. 6 張 WebP 的檔案大小介於 10.8 KB 到 27 KB（`git diff --stat` 的位元組數：15,302／27,082／11,750／17,236／10,820／16,246）。
3. 另有 `blank.svg`（空白替代圖，給 `prefers-reduced-data: reduce` 使用）與 `visual.css`，所以預覽輸出的 `assets/visuals/` 共 20 個檔。
4. 12 個 SVG 單檔大小介於 358 B 到 489 B：這是設計規格與驗證列出的範圍；逐檔位元組數文件撰寫沒有逐一抄錄，需要時看 repo 檔案。

### 3.2 載入與動態規則（設計規格）

1. 載入方式：裝飾圖用 `<img alt="">`，橫幅用 `<picture>`（手機載入 640 寬、桌面載入 1440 寬、`prefers-reduced-data: reduce` 載入空白圖）。
2. 文字永遠不被隱藏、不被移動。動態只作用在圖上（淡入、呼吸）。
3. 脈動最多 2 次；呼吸最多 2 輪；比例條只播一次且不超過 550ms。
4. `prefers-reduced-motion` 與列印一律關閉動畫。
5. 手機首屏順序：先今日重點文字，再橫幅圖；摘要要用完整句子擷取，不可從中間硬切（設計規格要求，實作為 `fullSentences()`，見 4.3）。
6. CVE 橫幅要加半透明遮罩（α ≥ .75）並附說明文字「概念插畫，非事件現場」。

### 3.3 設計規格與實作的差異

1. 規格原寫手機橫幅上下間距 16px、桌面 20px；實作桌面也是 16px，差 4px。設計審查判為可接受，不要求修。
2. 規格寫「產品總覽圖示依類別」。實作沒有照做，原因見第 4.4 節。

## 4 實作內容

### 4.1 變更檔（相對 main，26 個檔，238 行新增、21 行刪除）

| 編號 | 檔案 | 說明 |
|---|---|---|
| 1 | `site/build.mjs` | 新增 `--visual-preview` 與 `SITE_BASE_PATH`；視覺資源複製；3 頁套用 |
| 2 | `site/visual-kit.mjs`（新增） | 資源讀取白名單 `readSiteAsset`、`visualPicture`、`visualIcon`、`fullSentences` |
| 3 | `site/round3.mjs` | 首頁與產品總覽的視覺元件（僅在 `visuals` 為真時輸出） |
| 4 | `site/display-v4.mjs` | CVE 頁狀態圖示與標籤（僅在 `visualStatus` 為真時輸出） |
| 5 | `site/assets/app.js` | 新增「Visual preview motion」段落；一般建置會截掉此段 |
| 6 | `site/assets/visuals/visual.css`（新增） | 預覽專用樣式 |
| 7 | `site/test.mjs` | 新增測試 |
| 8 | `site/assets/visuals/*.webp`（新增 6 檔） | 見 3.1 |
| 9 | `site/assets/visuals/*.svg`（新增 13 檔：12 圖示加 `blank.svg`） | 見 3.1 |

### 4.2 `--visual-preview` 旗標

1. 指令：`node site/build.mjs --visual-preview --base-path /morning-brief-preview/ --output <輸出資料夾>`。
2. 旗標開啟時：
   - 所有頁面加 `<meta name="robots" content="noindex, nofollow">`。
   - 輸出 `assets/visuals/` 資料夾（含 `visual.css`）。
   - 只有首頁、`products/index.html`、`daily/2026-11-21/cve.html` 三頁載入 `visual.css` 並輸出視覺元件。
3. 旗標關閉（預設）時：不輸出上述任何一項，輸出與 main 相同（2.2）。
4. `--base-path` 必須是 `/` 或以 `/` 開頭、以 `/` 結尾，只允許英數字、底線、連字號，否則建置失敗（`build.mjs` 原有檢查）。
5. 環境變數 `SITE_BASE_PATH`：命令列沒有給 `--base-path` 時，使用它（`build.mjs` 的 `value('--base-path') ?? process.env.SITE_BASE_PATH`）。兩者都沒給時用預設 `/morning-brief-archive/`。CI 目前使用的是 `npm run build -- --base-path /morning-brief-archive/`，沒有設定 `SITE_BASE_PATH`（安全審查看過 CI 步驟）。
6. 在 Windows 的 Git Bash 下，`/morning-brief-preview/` 會被改寫成本機路徑而使建置失敗；需要先設 `MSYS_NO_PATHCONV=1`，或改用 PowerShell。這是文件撰寫重建時實際遇到的（5.6），不影響 Linux 與 CI。

### 4.3 頁面內容

| 編號 | 頁面 | 實作內容 |
|---|---|---|
| 1 | 首頁 | 主視覺橫幅（`hero-cybersecurity`，桌面與手機版）；今日重點用完整句子擷取摘要；PoC／修補狀態改用結構化欄位（`exploited`、`patch`），不再依賴文字解析；THE SIGNAL 卡片不被拉高；TECH RADAR 標題靠左、「N 則」靠右 |
| 2 | CVE 內頁 | 橫幅（`hero-cybersecurity`）加說明「概念插畫，非事件現場」；右側狀態欄加「PoC／利用現況」「修補」標籤與 `icon-patch`；麵包屑「首頁」觸控區 44×44px |
| 3 | 產品總覽 | 橫幅（`hero-infrastructure`）；狀態比例條（只播一次）；橫幅上下各 16px 間距；產品列維持方案 A 的兩字縮寫方塊 |

### 4.4 產品圖示為何改回兩字縮寫

1. 原實作（`b8b84b9`）用 `product.category` 對應圖示，但 `products.yaml` **沒有類別欄位**。結果 26 列全部取得 `icon-document`，圖示失去區分功能（設計審查第一輪 F3）。
2. 設計規格明寫「只用資料中已有的類別欄位，不憑產品名稱猜」。因此**沒有自行替產品分類**，也沒有用名稱關鍵字推測。
3. 處理：`c94f60f` 改回方案 A 原本的兩字縮寫（WA、WL、MQ、IN、TU、BD、CO、SE、SR、NE、AP、JE、CC、CO、GC、QS、VA、BO、OP、3S、JH、RR、NK、CP、PO、CM，共 26 列，與 main 逐列相同）。
4. 若日後要用圖示區分類別，需要先由專案負責人確認產品類別並加進資料來源（`products.yaml` 屬受保護路徑，本 PR 不動）。這件事目前**未決**。

### 4.5 預覽 repo `george-palsys/morning-brief-preview`

**建立方式（依指派說明；建立過程文件撰寫沒有參與）：**

1. 公開 repo（`george-palsys/morning-brief-preview`）。
2. GitHub Pages 來源：`main` 分支的根目錄；建置類型為 legacy（分支部署，不是 GitHub Actions 部署）。
3. 預覽網址：`https://george-palsys.github.io/morning-brief-preview/`。

**文件撰寫撰寫時的實查（匿名讀取，2026-11-21）：**

1. repo 存在、公開、預設分支 `main`、`has_pages` 為真。
2. 兩個 commit：`Initial commit`、`Publish visual preview from fb57c6450bd23d4cd661e71ce557387c00922191`。
3. 根目錄有 `.nojekyll`（0 位元組）、`404.html`、`about.html`、`assets`、`build-report.json`、`daily`、`index.html`、`products`、`search`；共 81 個檔，其中 `assets/visuals/` 20 個。
4. 預覽網址回應 HTTP 200。
5. 預覽 repo 的 81 個檔與文件撰寫以 `fb57c64` 重建的預覽輸出，逐檔位元組相同（81／81；比對對象是 git 內的 blob）。

**公開風險：** 預覽 repo 是公開的，內容含 26 項產品追蹤與日報；這些內容本來就在公開的歸檔站。所有頁面帶 `noindex, nofollow`，但那只是請搜尋引擎不要收錄，不是存取控制。

### 4.6 重新發布預覽（republish）步驟

1. 在要發布的 commit 上建置預覽：`node site/build.mjs --visual-preview --base-path /morning-brief-preview/ --output <輸出資料夾>`。
2. 與 SHA-256 基準逐檔比對：用驗證提供的預覽輸出清單（路徑、大小、SHA-256；本版 81 個檔）核對建置輸出，有任何一檔不符就停止，不發布。該清單是內部檔，格式有瑕疵（含字面換行跳脫字元與反斜線路徑，標頭有本機路徑），**不得放進公開預覽 repo**。
3. 只把建置輸出放進預覽 repo 的根目錄，包含 `.nojekyll`（建置已自動產生）；不要放入基準清單、建置腳本、截圖、報告。
4. commit 訊息寫來源 head，格式：`Publish visual preview from <40 字元 SHA>`。
5. push 到 `main`。Pages 會自動重新部署；完成時間與 CDN 快取效果**未驗證**。
6. 發布後再核對：網址回應 200、首頁原始碼有 `noindex`、`.nojekyll` 存在、檔案數與預期相同（本版為 81）。

### 4.7 審查後移除預覽（remove）

1. 審查結束後，刪除整個 repo `george-palsys/morning-brief-preview`。
2. 刪除 repo 需要 repo 擁有者權限（文件撰寫與其他角色沒有）。
3. 只關閉 Pages 而不刪 repo 也能下線網站，但 repo 與內容仍公開；若要完全移除，應刪 repo。
4. PR #34 本身沒有部署流程（CI 的部署工作被略過，見 5.5），因此移除預覽不影響 PR 與 main。

## 5 驗證結果

### 5.1 指令結果（`fb57c64`）

| 編號 | 指令 | 結果 | 誰跑的 |
|---|---|---|---|
| 1 | `npm ci --ignore-scripts` | 8 個套件，0 個漏洞 | 驗證；文件撰寫也跑過，0 漏洞 |
| 2 | `npm test` | 57 個測試，通過 57，失敗 0 | 驗證與設計審查；文件撰寫重跑，57／57 通過 |
| 3 | `npm run check:contrast` | `CONTRAST OK: 40 Proposal A color pairs (light)` | 驗證；文件撰寫重跑，結果相同 |
| 4 | `npm run build`（一般建置） | 54 頁 HTML、26／26 產品頁、4 份日報、66 筆搜尋項目、0 警告 | 驗證；文件撰寫重跑，相同 |
| 5 | `node site/build.mjs --visual-preview --base-path /morning-brief-preview/` | 同上，0 警告 | 設計審查、驗證、安全審查各自跑；文件撰寫重跑 |

說明：安全審查報告的測試數字是 main 38、`c94f60f` 41、`fb57c64` 43（斷言數 216／232／236），驗證與設計審查的 57 是 `npm test` 的總數。兩者的計數口徑不同，文件撰寫沒有逐一對齊兩者，**差異原因未驗證**；57 是文件撰寫重跑的數字。

### 5.2 預設建置與 main 相同

1. 驗證：61 個檔，與 main 基準逐檔 SHA-256 相同。
2. 安全審查：`diff -rq` 無差異。
3. 文件撰寫：在 main（`26e43aa`）與 `fb57c64` 各以 `--base-path /morning-brief-archive/` 建置，`diff -rq` 無差異，兩邊各 61 個檔。

### 5.3 預覽輸出

1. 預覽輸出 81 個檔、1,114,302 位元組（安全審查與驗證）。
2. 與 `c94f60f` 的預覽輸出相比，`fb57c64` 只有 `visual.css` 1 個檔不同（刪 10 行），其餘 80 個檔 SHA-256 相同（安全審查）。
3. 其餘 51 頁：50 頁與一般建置只差 `noindex`；`404.html` 另外差預覽的 base path（資產網址），本文內容相同（驗證）。

### 5.4 瀏覽器實測（驗證與設計審查，Chrome headless、淺色、390×844、360×800、1366×768、1440×900）

| 編號 | 項目 | 結果 | 來源 |
|---|---|---|---|
| 1 | 產品總覽手機列高（390、360） | 26 列皆 146.4px，與 main 相同 | 設計審查、驗證 |
| 2 | 產品總覽桌面列高（1366、1440） | 85.9px，與 main 相同 | 設計審查、驗證 |
| 3 | 產品總覽整頁高（390／360） | 5,416px，main 為 5,234px（差 182px，來自新增橫幅與比例條） | 設計審查、驗證 |
| 4 | 產品總覽整頁高（1366／1440） | 3,399／3,401px，main 為 3,193／3,195px | 設計審查 |
| 5 | 橫向溢位（3 頁 × 4 寬，共 12 組） | 皆無 | 設計審查、驗證 |
| 6 | 篩選按鈕高度（390） | 5 個，皆 44px | 設計審查、驗證 |
| 7 | 麵包屑「首頁」觸控區 | 4 個寬度皆 44×44px | 設計審查、驗證 |
| 8 | 狀態徽章「有更新」對比 | 7.54:1（≥ 4.5:1）；「無更新」6.93:1；「無法確認」6.45:1 | 設計審查（WCAG 公式自算） |
| 9 | 手機首屏順序 | 先標籤與標題，橫幅圖在首屏之外（390：圖頂 y=937.2，視窗高 844） | 設計審查 |
| 10 | 側欄圖示 | 桌面 8 項皆 16×16、文字左緣一致 | 設計審查 |

### 5.5 效能與退化（驗證，1440×900、關閉快取）

| 編號 | 頁面 | 請求數（前→後） | 圖片 | 總傳輸量（前→後） |
|---|---|---|---|---|
| 1 | 首頁 | 5 → 12 | 6 個、20,619 B | 92,331 → 119,869 B（+27,538 B） |
| 2 | CVE 內頁 | 5 → 8 | 2 個、18,131 B | 106,181 → 130,287 B（+24,106 B） |
| 3 | 產品總覽 | 5 → 7 | 1 個、16,468 B | 101,402 → 122,931 B（+21,529 B） |

退化測試（驗證）：

1. 關閉 JavaScript：頁面內容仍可讀（本文長度 2,848 字元）。
2. 開啟「減少動態」：10 個動畫元素的動畫皆為 `none`。
3. 封鎖圖片：CVE 頁仍有 5 則 CVE 與 9,067 字元的文字。

### 5.6 文件撰寫自己重跑了什麼

1. `npm ci --ignore-scripts`、`npm test`、`npm run check:contrast`、一般建置與預覽建置（Windows，本機）。
2. main 與 `fb57c64` 的預設建置比對（5.2 第 3 點）。
3. 預覽 repo 81 個檔與重建輸出逐檔比對（4.5 第 5 點）。重建時 Git Bash 改寫路徑造成一次失敗（4.2 第 6 點），已改用 `MSYS_NO_PATHCONV=1` 重跑。
4. 預覽 repo 的 Windows 檢出因換行轉換，檔案位元組與重建輸出不同；改以 git blob 比對才是位元組相同。這是檢出方式的假象，不是內容差異。
5. 沒有重跑瀏覽器實測；第 5.4、5.5 節的數字是驗證與設計審查的，不是文件撰寫的。

### 5.7 CI

1. `fb57c64` 的 CI：workflow「Static site」，run 44881930494，事件 `pull_request`，結果 completed／success（2026-11-21T07:48:20Z，ubuntu-24.04）；文件撰寫以公開 API 讀回，狀態相同。
2. 步驟（安全審查查看）：`npm ci --ignore-scripts`、`npm run check:contrast`、`npm test`、`npm run build -- --base-path /morning-brief-archive/`、upload-pages-artifact。部署工作依預期被略過。
3. 較早的兩次 run（44880491528、44880761898）在 `npm test` 失敗（安全審查記載）；失敗原因與對應的 head，文件撰寫沒有查，未驗證。完整 CI 記錄需登入，文件撰寫沒有查看。

## 6 安全審查

範圍：`fb57c64`；結論（安全審查）：可發布預覽、可合併；高 0、中 0、低 0（未解決）；資訊項 4 項。

### 6.1 資源複製白名單

1. `site/visual-kit.mjs` 的 `readSiteAsset(siteRoot, name, visual)`：
   - 視覺模式只接受符合 `^[-a-z]+\.(?:webp|svg|css)$` 的檔名。
   - 一般模式只接受 `site.css`、`design-tokens.css`、`app.js`。
   - 對 `assets` 與 `assets/visuals` 兩層用 `lstatSync(...).isDirectory()` 檢查，對檔案用 `lstatSync(...).isFile()` 檢查，因此資料夾連結與檔案連結都會被拒絕。
2. `build.mjs` 的三個站台資源與視覺資源，都經由這個函式讀取。

### 6.2 審查發現與處理

| 編號 | 嚴重度 | 內容 | 狀態 |
|---|---|---|---|
| 1 | 低（L1） | 在 Linux 上，路徑尾端的斜線會讓 `lstat` 跟隨資料夾連結，使 `assets/` 或 `assets/visuals/` 若是資料夾連結即可繞過檢查 | 已在 `fb57c64` 修正（資料夾路徑去掉尾端斜線） |
| 2 | 低（L1b） | `site.css`、`design-tokens.css`、`app.js` 會跟隨檔案連結 | 已在 `fb57c64` 修正（一般模式也走 `readSiteAsset`） |
| 3 | 資訊（I1） | 硬連結會被當成一般檔案發布（git 本身無法儲存硬連結） | 不處理 |
| 4 | 資訊（I2） | commit 沒有簽章 | 不處理 |
| 5 | 資訊（I3） | `daily/`、`products/` 等內容檔若是連結，建置會讀取；main 就存在，不在本 PR 範圍 | 不處理 |
| 6 | 資訊（I4） | 連結類測試在 Windows 需要開發人員模式或系統管理員權限 | 不處理 |

### 6.3 其他檢查

1. CSP 與 main 相同，且只有一種版本。
2. 內嵌 script／style／`on*` 事件與外部資源：0。
3. `target="_blank"` 共 632 處，全部帶 `rel="noopener noreferrer"`。
4. 受保護路徑：0 變更。
5. `npm audit`：0 個漏洞。
6. gitleaks v8.30.1：5 個範圍，無洩漏。
7. repo 內 106 個檔皆為模式 100644（沒有連結或子模組）。
8. 預覽輸出掃描：成員名稱 0；類似電子郵件的字串 2 個（出自 VMware 公開公告的內文，main 已有）；本機路徑 0；沒有 source map。
9. 連結攻擊矩陣：Windows Server 2025（Node v25.8.2）與 WSL2 Ubuntu 24.04.4（Node v24.22.3）皆被拒絕；其中硬連結與內容檔連結為資訊項。
10. 突變測試：把尾端斜線改回去（M1）在 Linux 上有 2 個測試失敗，在 Windows 仍全過。因此這個漏洞只在 Linux 出現，要靠 Linux CI 才能證明修正有效；本次 CI 成功是此點的佐證。

## 7 設計審查

### 7.1 第一輪（`b8b84b9`）：有條件通過，合併前必修 4 項

| 編號 | 項目 | 處理 |
|---|---|---|
| F1 | 桌面 THE SIGNAL 卡片被拉高（`.headline-area .mb-news-list` 需 `align-content:start`） | `8180805` 修正；複審實測卡內多餘空白 0px |
| F2 | TECH RADAR 標題要靠左、「N 則」靠右 | `8180805` 修正；複審實測計數右緣等於標題列右緣（四個寬度） |
| F3 | 產品總覽 26 列全是 `icon-document` | `c94f60f` 改回兩字縮寫（4.4） |
| F4 | 側欄「歷史歸檔」「搜尋」圖示需回到 16px 線條圖 | `8180805` 修正；複審實測 8 項皆 16×16、文字左緣一致 |
| F5 | 產品橫幅與說明文字間距約 5px | `8180805` 修正；複審實測上下各 16px |

另有三項建議：R1 麵包屑「首頁」觸控區 34×44（已在後續改為 44×44）、R2 TECH RADAR 雙層邊框、R3 空白磚的替代顯示。R2、R3 文件撰寫沒有看到處理紀錄，**狀態未驗證**。

### 7.2 第二輪（`c94f60f`）：F1–F5 通過，新發現 N1

1. N1：手機產品總覽每列高度 228px（main 為 146px），整頁 7,548px。
2. 原因：`visual.css` 內有一段 `@media(max-width:640px){ .directory-wrap … }`（8 條規則），覆蓋了 `site.css` 原有的手機卡片排法。
3. 這段在第一輪就已存在，設計審查承認第一輪漏看。
4. 驗證修法：整段刪除後，每列 146px、整頁 5,416px。

### 7.3 第三輪（`fb57c64`）：N1 解除

1. `fb57c64` 刪除該整段（`visual.css` 減 10 行）。
2. 複審實測：390 與 360 的 26 列皆 146.4px，與 main 相同；整頁 5,416px；沒有橫向溢位。
3. 實作自己量到 143.7px，設計審查在同環境量不到（After 與 Before 都是 146.4px）；差異原因**未驗證**（沒有在實作的機器上量）。
4. F1、F2、F4、F5、麵包屑皆沒有回歸。

### 7.4 驗證報告的補充

1. 全部 21 則日報項目（產品 6、新知識 6、CVE 4、AI 2、台灣 IT 3）與來源核對；摘要皆為以「。」「！」「？」結尾的完整句子。
2. 首頁顯示 8 則、規格寫 18 則、日報共 21 則，三個數字的差異由驗證的算式說明（核心類別 18、全部 21），不是衝突。
3. 手機首屏、觸控目標、橫向溢位等由 24 張截圖（3 個模板 × 4 個寬度 × 2 種截法）佐證；截圖存放在審查者的工作區，**不在本 repo**。

## 8 已知限制與未驗證項

### 8.1 未驗證清單

| 編號 | 項目 | 原因 |
|---|---|---|
| 1 | 真機（iOS、Android）觸控與渲染 | 只用 Chrome headless 的裝置模擬 |
| 2 | 深色模式 | 站台只做淺色（`color-scheme: light`），沒有測深色 |
| 3 | 螢幕閱讀器 | 沒有實測 |
| 4 | 列印 | 沒有實測；規格要求列印關閉動畫，沒有在實體或預覽列印中確認 |
| 5 | GitHub runner 上連結的真實行為 | 安全審查用 WSL2 Ubuntu 驗證，WSL 不是 GitHub runner，兩者等價是推論；CI 成功只能佐證，不能證明 |
| 6 | 預覽網址在 CDN 上的完整行為 | 文件撰寫只確認首頁回應 200；其餘頁面、快取、404 行為沒有逐一測 |
| 7 | 預覽 repo 的 Pages 設定（來源分支、legacy 建置）細節 | 文件撰寫只確認 `has_pages` 為真與網址有回應；設定頁沒有看（需要權限） |
| 8 | 其餘 51 頁的視覺 | 沒有套用；差異只有 `noindex`（5.3） |
| 9 | 產品篩選的實際操作 | 只量靜態尺寸，沒有逐項點擊篩選 |
| 10 | 首頁 Before 量測 | 一般建置首頁的量測腳本出錯，不回歸比對沿用上一輪（`c94f60f`）的數值 |
| 11 | 瀏覽器內 CSP 違規事件 | 沒有在瀏覽器中看違規事件；CSP 以原始碼比對 |
| 12 | 完整 CI 記錄 | 需登入；只讀到 run 的狀態與步驟名稱 |
| 13 | 測試數 57 與 43 的差異 | 計數口徑不同，原因未對齊（5.1） |
| 14 | 12 個 SVG 與 6 張 WebP 的內容安全 | 沿用先前的檢查，本輪沒有重做 |
| 15 | 視覺好看與否 | 驗證與安全審查都不判斷美感；設計審查只檢查規格符合度。最終確認由專案負責人看預覽 |
| 16 | R2、R3 建議的處理狀態 | 7.1 |
| 17 | Windows 非管理員身分的連結測試 | 沒有測 |

### 8.2 已知限制

1. 只有 3 個模板；其餘 51 頁維持原樣。
2. 預覽站是公開的，`noindex` 不是存取控制。
3. 產品類別圖示尚未做：資料沒有類別欄位，且沒有人決定類別（4.4）。
4. 預覽網址與 PR 分支各自獨立：預覽的內容是某一個 head 的快照，PR 再有新 commit 時，預覽不會自動更新，需要照 4.6 重新發布。
5. 所有 commit 沒有簽章（I2）。

## 9 Rollback

### 9.1 回復範圍

1. 這個 PR 尚未合併，所以 main 沒有任何變動；放棄 PR 即可，不需要回復 main。
2. 預覽站是獨立 repo，不屬於 main 的一部分。

### 9.2 回復步驟（未實際執行）

1. 尚未合併：關閉 PR #34（不合併），刪除分支 `feat/visual-kit-v1`。需要有 repo 寫入權限者執行。
2. 預覽下線：依 4.7 刪除 `george-palsys/morning-brief-preview`（需 repo 擁有者）。
3. 若日後已合併：對合併 commit 做 `git revert`，以新的 PR 回復；不要強制改寫 main。因為預設建置與 main 位元組相同（5.2），一般建置在合併後對正式站沒有可見差異，只有 `--visual-preview` 的輸出才有視覺元件，所以合併本身不會改變已部署站台的外觀。這一點是依 5.2 的比對推論，**合併後的實際部署結果未驗證**。
4. 回復後確認：一般建置與 main 的 `diff -rq` 無差異。

## 變更紀錄（只往後加）

| 日期 | 版本 | 內容 | 依據 |
|---|---|---|---|
| 2026-11-21 | 1 | 初版：PR #34 `fb57c64` 的實作紀錄，九章齊全；預覽 repo 與預設建置由文件撰寫重做比對 | 設計規格、三輪設計審查、驗證報告、安全審查報告、文件撰寫重跑（5.6） |
