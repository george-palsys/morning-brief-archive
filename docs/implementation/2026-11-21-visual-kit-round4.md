# 第四輪實作紀錄

基準：8601e30b72d449ded4106836f53ddcda8bef25ce。規格檔 SHA-256：d1669709daac5c1e6e587f4c950de5b878e47a2d7aa9e72a6403d679c3289036。本輪只做本機增量與 patch，不推送、不修改 PR、main、正式資料或正式站。本文記錄實作與指令輸出，不代替獨立驗收。

## A 五項

| 項目 | 實作 |
|---|---|
| A1 | 產品總覽 KPI 的「項追蹤／產品」「無公開／來源」插入 wbr；手機標籤 keep-all、normal overflow-wrap、strict line-break |
| A2 | 產出 HTML 的文字節點包裝 CVE 編號，cve-id nowrap；表格 td 內允許換行；不改屬性、title/script/style 的 raw text |
| A3 | 1024–1180 facts 採三個 auto 欄、space-between、12px 欄距；dd nowrap |
| A4 | 同寬度範圍 wide panel 採 space-between、底部連結 margin-top=0 |
| A5 | 640 以下新聞卡單欄並隱藏圖示；新增 44px 的「產品監測 ↓」跳轉。只有 stack panel 帶 product-watch id，原本整個 THE SIGNAL 列表與監測面板次序保留 |

未做「首屏直接顯示監測面板」，未將面板插入新聞卡之間。第一則標題位置、卡高與跳轉效果沒有由實作者做視覺驗收，交由獨立角色量測。

## B 頁型

| 頁型 | 實作 |
|---|---|
| 首頁 | 正式 v4 資料使用已核定視覺模板與 A 修正；沒有 display-v4 的歷史資料仍保留原本資料 fallback，避免產生虛假的新聞錨點警告；全站視覺 CSS 仍載入 |
| 產品總覽 | 視覺分組、KPI、基礎設施圖與手機卡模板成為預設 |
| 每日摘要 | 共用視覺 CSS、D14 標題與段落導覽；依決策不加 hero |
| 內容頁 | 所有 reading 頁有三組既有圖片之一，CVE 頁套用原 CVE 模板的 patch 圖示與利用狀態；其他類別不新增 CVE 徽章 |
| 歸檔 | 共用視覺 CSS、保留清單順序；依決策不加 hero |
| 舊版 | 共用顏色與字級、保留既有版面；增加「舊版」文字 |
| 產品單頁 | 保留標題狀態徽章、事實盒與來源表，不加 hero 或 KPI；無公開來源保留虛線 |
| 搜尋 | 保留 line-strong 邊框、空結果文案；沒有 hero |
| 關於 | 共用標題與內文、沒有 hero；不新增人員資訊 |
| 404 | 共用標題、回首頁按鈕、沒有 hero；資產沿用 base-path 的絕對路徑保護 |

visual-preview 參數保留為相容入口與 noindex 控制；預設建置也複製視覺資產及載入 visual.css，不再限制三個頁面。

## C 主題

- 預設由 CSS prefers-color-scheme 決定；手動按鈕依序「自動→亮色→深色→自動」。localStorage 使用 mb-theme；自動模式刪除儲存值。storage 事件同步同源其他頁，儲存被封鎖時仍能使用當頁選擇。
- theme-init.js 為 CSS 前的同源非 defer 外部腳本，只接受 light/dark；app.js 處理互動。meta CSP 原字串未改，沒有新增 inline script/style。
- CSS 兩個深色 token 區塊完全同值，由 check:contrast 比對防漂移；meta 與基礎 token 宣告 light dark。JS 停用仍有系統媒體查詢。
- 12 個 SVG 另存深色版；CSS 自訂圖示 URL 同時支援系統與手動主題。stroke=#9db3ff、fill=#1d2b5c。既有圖片不換圖，深色加 line 邊框；選單深色取消陰影。保留深底裝飾的半透明白／萊姆綠。
- 淺底寫死色依語境改為 paper、wash、accent-soft、factbox-bg、directory-head-bg、ink-2 與狀態 token；深底白字保留 on-dark。移除深色模式待決註解；選取色加入主題 token。
- 原 40 組對比及門檻完整保留，light/dark 各跑一次；不刪色對、不放寬門檻。

## 測試預期修改說明

1. 正式建置原先應無視覺資產的斷言改為必須有 visual.css、資產目錄與視覺動態程式，noindex 仍只在預覽出現；這是 B 的預設行為變更。
2. 每頁腳本精確數量由 1 改 2，另強制檢查新增的同源 theme-init.js 位於 CSS 前，CSP 原字串仍相同。
3. 首頁八個標題的 regex 允許唯一新增的 cve-id span；仍檢查八則、原始標題文字、來源 URL 與真實錨點。panel regex 接受唯一 product-watch id，另加「id 僅一個」斷言，保留順序與兩個 panel 內容相同的斷言。
4. 新增 CVE 屬性／raw head 不被重寫、主題初始化白名單與儲存例外、手動循環與跨頁 storage 同步測試。未修改任何正式資料。

本機修改階段實跑 npm test：62 tests、62 pass、0 fail、0 skipped；check:contrast：40 pairs × 2 themes。乾淨 clone 的最終指令與完整輸出另附交付報告。

## 未做與待驗證

沒有推送、修改 PR 狀態、合併或部署。未自行進行規格 D 的視覺驗收、截圖、實體手機、其他瀏覽器、螢幕閱讀器、列印、首幀閃爍與無 JS 的實際瀏覽器測試；交由獨立驗證。未採 ≤360 的備援兩欄 KPI，因規格指定只在獨立驗證仍發現孤字後才啟用。沒有更動新聞面板順序。每日摘要與歸檔無 hero、手動切換已依決策實作。
