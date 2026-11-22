# 全世界 AI 新功能及重大事件｜2026-11-23

[← 今日摘要](README.md)｜[產品動態](products.md)｜[新知識](knowledge.md)｜[CVE](cve.md)｜[台灣 IT](taiwan.md)｜[AI](ai.md)｜[清單維護](maintenance.md)｜[26 項產品現況](../../products/README.md)

### OpenRouter 下架三家推論供應商、取消 125 個端點的 Zero Data Retention 資格：研究者發現提示內容被竊取與留存

- 發生什麼事：AI 模型閘道服務 OpenRouter 在 2026-11-22 發布公告，表示資安研究者本週回報部分推論供應商（inference provider）的資料遭入侵，或有跡象顯示資料政策沒有被遵守。OpenRouter 表示這些發現沒有顯示 OpenRouter 本身遭入侵或未經授權存取。
- OpenRouter 已採取的動作：
  - 下架三家供應商。
  - 把 125 個端點移出 Zero Data Retention（ZDR）資格，包含研究者點名的供應商，以及預防性移除的其他端點。
  - 通知所有可能受影響的客戶。
  - 進行中：把研究者的測試方法改成持續執行的檢查；查核網路路徑，找出請求與回應被轉送給第三方的情形；被移除的端點要提出保證並通過驗證才能恢復 ZDR 資格。
- 研究內容（The Hacker News 2026-11-22 轉述 Dragos 的研究，Dragos 原文發布於 2026-11-19）：
  - 研究者在 7 月到 11 月間，把約兩百萬則帶有唯一網址與憑證（canary token）的提示送進各家推論服務，觀察誰使用了這些誘餌。
  - 三家推論供應商遭攻擊者入侵數個月而不自知，最早的一起從 7 月中開始；被竊取的請求有一部分標了 Zero Data Retention。
  - 最大的一起：10 月下旬數個時段內送往某供應商的請求全部被竊，其中約兩百把誘餌 AWS 金鑰被拿去測試，攻擊者列出 S3 bucket、搜尋 Secrets Manager 與 Parameter Store，並嘗試建立 Bedrock API 金鑰與 IAM 使用者。
  - 不需要入侵的情形：某個 AI 推論市集上的賣家以最低價掛出模型，開啟請求紀錄後收集流經的內容。
  - 一家未具名的中國 AI 實驗室：7 月到 10 月間送往其模型的誘餌提示，超過一半的秘密連結被抓取，其中包含約三分之二標示為不收集資料或 ZDR 的請求。
- 已公開說明的供應商（The Hacker News 轉述，OpenRouter 公告列出這三家的連結）：
  - Phala：攻擊者控制了一台推論伺服器，可在處理時看到請求資料，事件於 11 月 8 日控制住；經 OpenRouter 送到 DeepSeek V4 Flash 0731 模型、時間在 10 月 21 日 00:00 UTC 到 11 月 8 日 05:35 UTC 之間的請求應視為已外洩，其中的金鑰、token、密碼都要更換。
  - Together AI：一個 AI 程式開發代理把憑證提交到公司的公開 GitHub repository，未經授權者因此下載了 6 月與 7 月留存的客戶提示樣本。
  - Novita：OpenRouter 公告列出的標題是「Privacy notice regarding MiniMax requests on Novita」，內容我沒有讀到。
- 影響：
  - 「供應商承諾不留存資料」不等於資料不會外流。客戶評估生成式 AI 時，如果經過模型閘道或第三方推論服務，請求實際流經哪些公司要查清楚。
  - 金融與公部門客戶如果有開發人員把程式碼、金鑰或客戶資料貼進這類服務，現在就該盤點；曾經出現在提示裡的憑證要當成已外洩來更換。
  - 這是客戶選擇地端或自管模型時會用到的實例，介紹時引用 OpenRouter 的公告即可，不要引申到公告沒有寫的範圍。
- 注意：研究細節讀自 The Hacker News 的轉述；Dragos 原文我只確認了標題與發布日期，Phala、Together AI、Novita 三家的公告頁我沒有打開。
- 來源：
  - OpenRouter 公告「Data Processing Incidents on Inference Providers」（2026-11-22）：https://openrouter.ai/blog/announcements/data-processing-incidents-on-inference-providers/
  - The Hacker News「OpenRouter Drops 3 Providers After Researchers Catch Months of Prompt Theft at AI Hosting Firms」（2026-11-22）：https://thehackernews.com/2026/11/openrouter-drops-3-providers-after.html
  - Dragos「AI Supply Chain Security: What Canary Tokens Found」（2026-11-19）：https://www.dragos.com/blog/ai-supply-chain-security-canary-tokens

### 黎曼猜想證明（後續）：Lean 與 Mathlib 社群聲明已完成檢查，確認敘述與證明都正確

- 發生什麼事：這是 11-22 晨報「Anthropic 數學家宣稱與 Claude 合作證明黎曼猜想，尚未經獨立驗證」的後續。Lean 與 Mathlib 社群在 2026-11-21 發表聯合聲明（Lean FRO 與 Mathlib Initiative 背書），表示對 Levent Alpöge 的證明正確「have full confidence」，並寫明「We hereby certify that both the statement and the proof of the Riemann Hypothesis are correct」。
- 聲明寫的檢查內容：
  - Alpöge 在 2026-11-20 釋出的證明是一個 Lean 函式庫，共 1700 萬行程式碼，直接相依的只有 Mathlib。
  - 黎曼猜想的敘述正確：這個敘述是 Mathlib 的一部分（`RiemannHypothesis`），經 Lean 與數論專家審視。
  - 函式庫可以正確編譯：已有數十人回報編譯成功，並重現相同的原始證明匯出檔。
  - 證明的是正確的敘述：社群另外加了一個只匯入 Mathlib 的檔案來隔離敘述，並用兩個獨立工具（comparator 與 con-leche）比對，確認證明的定理就是 Mathlib 的敘述。
  - Lean 證明有效：匯出的原始證明已由多個證明檢查器檢查，包含 Lean 官方 kernel、con-leche、con-ron，以及第三方用不同程式語言寫的獨立檢查器。
- 還沒有的部分：聲明講的是形式化證明通過機器檢查。聲明最後寫，期待數學界接下來協助解釋這個證明裡的新想法。期刊審查或克雷數學研究所（千禧年大獎）的認定，這份聲明沒有提到。
- 影響：11-22 晨報寫「在獨立驗證出來之前只能當成有人宣稱」，這一點現在要更新：形式化證明已由 Lean 與 Mathlib 社群檢查通過。對我們的業務沒有直接影響；客戶問起時，可以說明這是 AI 協助產出、再由機器檢查的證明。
- 注意：這份聲明的頁面時間是 2026-11-21 13:55（頁面沒有寫時區），早於 11-22 晨報的蒐集時間，11-22 晨報沒有收到，今天補上。
- 來源：Lean community blog「Lean verification of the Riemann Hypothesis」（2026-11-21）：https://leanprover-community.github.io/blog/posts/riemann-hypothesis/

### OpenAI 首席科學家公開內部 perplexity 數字，提議各家以它訂出共同的開發上限

- 發生什麼事：OpenAI 首席科學家 Jakub Pachocki 在 2026-11-22 於 OpenAI 官網發表文章「Perplexity and Intelligence」，主張把 perplexity（也就是 cross-entropy loss，衡量模型預測下一個 token 的準確度，越低越好）當成各家模型開發商之間可以比較的指標，並用來訂共同的安全標準。文章同時公開 OpenAI 內部的預訓練數字。
- 文章公開的數字（log-perplexity，量測資料取自 OpenAI 內部程式碼庫的固定快照）：
  - GPT-3.5：約 0.99。
  - GPT-4：約 0.91。
  - 目前已低於 0.8；文章說到了這個區間，在資安與數學領域出現了「transformative capabilities」。
  - 升級到約 0.76 的模型後，開始在數學未解問題上產出突破性結果。
  - 預期進入約 0.68 到 0.7 的區間時，還會出現新的重大能力，文章說不知道會是哪些。
- 文章的提議：
  - 前沿模型開發商共同建立評估規範與透明標準。
  - 訂出以 perplexity 與其他量測為依據的共同上限：在理解與監控 AI 行為的能力達到某個具體里程碑之前，各家承諾不越過。
  - 文章認為最快 2027 年可能出現由 AI 推動的預訓練演算法快速進展。
- 文章自己列的限制：各家的評估資料集與訓練資料不同，難以直接比較；perplexity 不直接對應實際任務；chain-of-thought 推理不會降低 perplexity，卻大幅提升能力；perplexity 的下限不明。
- 影響：這是一家廠商的提議，不是法規或業界協議，其他廠商有沒有回應未查到。對我們目前的產品與交付沒有直接影響；它說明前沿模型的資安能力還會繼續快速提升，和台灣 IT 段落 TeamT5 講的「修補要更快」是同一件事的兩面。
- 來源：OpenAI「Perplexity and Intelligence」（2026-11-22）：https://openai.com/index/perplexity-and-intelligence

### 金融時報：亞馬遜接近以約 75 億美元收購 AI 新創 Decart，交易尚未確定

- 發生什麼事：中央社 2026-11-22 轉述金融時報的報導，亞馬遜（Amazon）即將達成以約 75 億美元（約新台幣 2470 億元）收購 AI 新創公司 Decart 的交易。消息人士表示談判已進入後期，最快下週初可望達成，但仍可能破局。亞馬遜沒有回應置評請求，Decart 拒絕置評。
- 背景（中央社報導內容）：
  - Decart 由 3 名以色列工程師於 2023 年創辦，美國總部在舊金山；今年 5 月募得 3 億美元後估值達 40 億美元，投資人包含 Radical Ventures、Sequoia Capital、Benchmark 與 Nvidia。
  - Decart 的主力軟體能讓 AI 模型更有效率地運行，釋出晶片的運算容量；它也是 Lucy 與 Oasis 的開發者，並且是亞馬遜 Trainium3 晶片的早期採用者。
  - 報導認為這筆收購有助 Amazon Web Services 與 Nvidia 競爭。
- 影響：還沒有成交，也沒有官方公告。成交的話是 AWS 在自家晶片上補強推論效率軟體；對我們的產品線與客戶沒有直接影響，等亞馬遜正式公告再看。
- 注意：
  - 這一則只讀到中央社的轉述，金融時報的原文我沒有打開。
  - 中央社這篇的發布時間是 2026-11-22 08:44，比 11-22 晨報的蒐集時間早 30 分鐘，11-22 晨報沒有收到，今天補上。
- 來源：中央社「亞馬遜抗衡輝達 傳砸2470億收購AI新銳Decart」（2026-11-22）：https://www.cna.com.tw/news/afe/202611220015.aspx
