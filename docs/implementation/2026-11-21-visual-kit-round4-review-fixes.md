# 第四輪審查修正

基準改為遠端 f7a9daed7004e2dfa5d137821d7c302c9406870e；舊本機 8601e30 不再作為交付基準。原五個實作 commit 重新建立在此基準，作者及 committer 全部使用 Palsys docs <noreply@example.invalid>，共同作者註記保留。舊產物保留，不推送、不強制覆寫遠端。

| 項目 | 實作／依據 |
|---|---|
| 1 首頁標題拆欄 | .mb-news-card h3 a 改 display:block，保留 min-height:44px。CVE span 仍 inline、nowrap，前後文字不再變成 flex 子項 |
| 2 搜尋標題拆欄與溢出 | .d14 #results>li>a 改 display:block，保留 44px 最小高度與原始標題、來源及安全 DOM 寫法 |
| 3 深色選取膠囊 | 目前分頁與已勾選分類共用 selected-bg／selected-ink／selected-border。深色為 #1d2b5c／#9db3ff／#9db3ff；亮色為 #151c2b／#ffffff／#7c8797。新增文字／底色 4.5:1 及邊框／底色 3:1 兩組，不刪原 40 組、不放寬門檻 |
| 4 作者 | 原五個 commit 重新以中性作者建立；本輪修正 commit 同樣使用中性作者與指定 Co-Authored-By |
| 5 1181px 間距 | 判斷為 hero 增高的連帶效果，詳見下節；未將 A4 的 max-width:1180px 延伸到 1181px，也未新增超出範圍的縮距規則 |
| R2 HTML 切割前提 | wrapCveText 註明只接收 builder 已跳脫的 HTML，不是任意 HTML parser；標籤切割改為可辨識引號，並補雙／單引號屬性內含原始 > 與 CVE，以及 &gt; 的精確測試 |
| R3 交付報告本機路徑 | repo 外舊 round4-delivery-report.md 的工作根目錄那一行已移除；新版報告不含本機路徑，產物位置另於交付訊息提供 |

## 1181px 原因判斷與限制

獨立審查既有同環境量測：基準 panel 高 548.03px、legend→link 間距 59.66px；第四輪高 592.55px、間距 104.17px。高度差為 44.52px，間距差為 44.51px，僅差 0.01px。

程式依據：site.css 的 .hero-grid 為 grid 且 align-items:stretch；metric panel 為 column flex；.metric-link 使用 margin-top:auto。visual.css 的 A4 媒體條件明確為 min-width:1024px 且 max-width:1180px；1181px 不在其範圍。頭條 CVE span 的 nowrap 將編號視為完整片段，可能增加標題一行，使同列 panel 拉高，額外高度由 auto margin 吸收。

以上數字取自獨立審查，因果判斷為「符合既有量測與 CSS 機制的預期連帶效果」，不是本輪已做瀏覽器隔離實驗的結論。本輪未重新量測 1181px，也沒有聲稱已恢復 59.66px。若要要求不論 hero 高度都維持舊 gap，需另行調整 stretch／面板高度或放寬 A4 範圍；本輪依要求先說明原因，不擅自改動該規則。

## 實跑與未做

修正期間 check:contrast 輸出 42 pairs × 2 themes。selected-ink／selected-bg 亮色 17.03:1、深色 6.65:1；selected-border／selected-bg 亮色 4.68:1、深色 6.65:1。乾淨 clone 的最終 npm test、build、正式資料 diff 等原始輸出另附交付報告。

未進行實作者視覺驗收、截圖或宣稱獨立驗證通過；未推送、未合併、未改正式資料、PR、main 或正式站。新版本仍待獨立功能與安全複審。原 A5 的「面板本體在首屏」未實作、面板未插入新聞卡之間；其餘既有未驗證項維持原狀。
