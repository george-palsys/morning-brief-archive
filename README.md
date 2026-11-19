# 晨報歸檔（morning-brief-archive）

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
| `SPEC.md` | 晨報產生規則 v3：段落、每則的寫法、來源規則、歸檔格式 | 供晨報產生流程遵循 |
| `products.yaml` | 26 個追蹤產品，以及每個產品的 release note 與安全公告來源網址 | 供每日來源逐一檢查，網址各自標示是否已確認 |
| `daily/YYYY-MM-DD/README.md` | 當天摘要：最需要注意的一件事、有更新的產品、各段落的標題，約一個畫面 | 每天先看這一份，再點進需要的段落 |
| `daily/YYYY-MM-DD/products.md` | 當天的產品動態 | 給人讀，也可作為 LLM Wiki 的原始資料 |
| `daily/YYYY-MM-DD/knowledge.md` | 當天的新知識 | 給人讀，也可作為 LLM Wiki 的原始資料 |
| `daily/YYYY-MM-DD/cve.md` | 當天的 CVE 重大新聞 | 給人讀，也可作為 LLM Wiki 的原始資料 |
| `daily/YYYY-MM-DD/taiwan.md` | 當天的台灣 IT 重大事件 | 給人讀，也可作為 LLM Wiki 的原始資料 |
| `daily/YYYY-MM-DD/ai.md` | 當天的全世界 AI 新功能及重大事件 | 給人讀，也可作為 LLM Wiki 的原始資料 |
| `daily/YYYY-MM-DD/maintenance.md` | 當天的清單維護：改版的網址、新來源、新建立的基準 | 追蹤 `products.yaml` 需要修改的地方 |
| `daily/YYYY-MM-DD/meta.yaml` | 當天的固定欄位（日期、星期、蒐集時間、CVE 編號清單、產品清單、關鍵字） | 給程式讀 |
| `daily/2026-11-19.md` | 第一份晨報，舊版面（整份一個檔），保留原樣 | 給人讀 |
| `products/README.md` | 26 項產品現況總表：當天狀態、目前最新版本、最後檢查日期，每晚重寫 | 一眼看完所有產品 |
| `products/<產品>.md` | 單一產品頁，共 26 個：各來源的最新一筆，以及逐日累加的最近動態 | 查單一產品的歷史，不必逐天翻 |
| `items.jsonl` | 每一則新聞一行，欄位固定，只往後附加 | 給程式讀，可匯入向量資料庫做 RAG |
| `state/sources.json` | 每個來源網址上次看到的最新一筆（版號、公告編號或標題）與檢查日期，每晚覆寫 | 供判斷哪些內容是上一份晨報之後才出現的 |

## 注意

- 本 repo 為 public(公開)。內容是從線上公開來源彙整的晨報,不放密碼、token、私鑰或客戶資料。
- 舊資料不修改，只新增（`state/sources.json` 與 `products/` 例外：前者與產品現況總表每晚覆寫，產品頁的「最近動態」只往上加、不刪）。
- `products.yaml` 的網址失效或改版時，維護流程會直接送 PR，合併後回報 PR 連結。
- 第一份晨報：2026-11-19。
