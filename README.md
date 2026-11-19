# 晨報歸檔（morning-brief-archive）

每日晨報的歸檔，由 GeorgeAI 每天半夜 2:00（台灣時間）產生後自動上傳。

## 內容範圍

1. 產品動態：`products.yaml` 中 26 個產品的 release note、安全公告、生命週期公告（v2 新增）
2. 新知識：每天 5 到 6 則（v2 新增）
3. CVE 重大新聞
4. 台灣 IT 重大事件
5. 全世界 AI 新功能及重大事件

產生規則見 `SPEC.md`。

## 檔案結構

| 路徑 | 內容 | 用途 |
|---|---|---|
| `SPEC.md` | 晨報產生規則 v2：段落、每則的寫法、來源規則、歸檔格式 | 給 GeorgeAI 產生晨報時遵循 |
| `products.yaml` | 26 個追蹤產品，以及每個產品的 release note 與安全公告來源網址 | 給 GeorgeAI 逐一檢查，網址各自標示是否已確認 |
| `daily/YYYY-MM-DD.md` | 當天完整晨報，最上方有固定欄位（日期、星期、CVE 編號清單、產品清單、關鍵字），每一則為獨立小節並附來源連結 | 給人讀，也可作為 LLM Wiki 的原始資料 |
| `items.jsonl` | 每一則新聞一行，欄位固定，只往後附加 | 給程式讀，可匯入向量資料庫做 RAG |
| `state/sources.json` | 每個來源網址上次看到的最新一筆（版號、公告編號或標題）與檢查日期，每晚覆寫 | 給 GeorgeAI 判斷哪些內容是上一份晨報之後才出現的 |

## 注意

- 本 repo 為 private。
- 舊資料不修改，只新增（`state/sources.json` 例外，每晚覆寫）。
- `products.yaml` 的網址失效或改版時，GeorgeAI 會直接送 PR 並自行合併，合併後回報 PR 連結。
- 第一份晨報：2026-11-19。
