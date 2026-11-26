# 全世界 AI 新功能及重大事件｜2026-11-25

[← 今日摘要](README.md)｜[產品動態](products.md)｜[新知識](knowledge.md)｜[CVE](cve.md)｜[台灣 IT](taiwan.md)｜[AI](ai.md)｜[清單維護](maintenance.md)｜[26 項產品現況](../../products/README.md)

### Google DeepMind：Humanity's First Exam，測模型做簡單任務穩不穩

- 發生什麼事：Google DeepMind 於 2026-11-24 發表基準測試 Humanity's First Exam（HFE），放在 Kaggle 上，共 544 道文字與影像題目、20 類基礎能力，例如數物件、辨識顏色、判斷位置。iThome 的報導寫題目分成 136 組，每組一道原題加三道變化題，主要指標是同一組 4 題各答 4 次、16 次全對的機率；18 款受測模型中最好的 5 款單次正確率 96% 到 98%，但這個可靠性指標平均只有 85.6%；約四分之三的錯誤和視覺感知有關。
- 影響：這個測試點出的是「單次答對」和「每次都答對」的差距。客戶把模型放進自動化流程（例如讓 agent 讀畫面、數筆數、核對欄位）時，要用的是後者。POC 的驗收方式可以參考它的做法：同一個題目換幾種問法、重複跑幾次，全部正確才算通過。
- 來源：Google，Humanity's First Exam（2026-11-24）：https://blog.google/innovation-and-ai/models-and-research/google-deepmind/humanitys-first-exam/ ；iThome 報導（2026-11-25）：https://www.ithome.com.tw/news/180797

### AWS：開源 Strands Decider v2，用小模型替 agent 做選擇題

- 發生什麼事：AWS 於 2026-11-23 發表 Strands Decider v2，是專門處理「有明確選項的決策」的開源模型，共 5 款（E2B、E4B、12B、26B-A4B、31B），以 Google 的 Gemma 4 為基礎，Apache 2.0 授權。開發者給輸入、問題與選項，模型一次運算回傳各選項的機率，不用產生文字再解析。iThome 的報導寫訓練資料增加到 1,748 萬筆，最大的 31B 模型在 6 項公開文字評測的平均分數是 82.1；用它在兩個大小不同的模型之間分派任務，成功完成的任務數仍有原本的 94%。
- 影響：agent 的成本有一大塊花在「選哪個工具、交給誰、答案可不可信」這種選擇題上，用可以在本機跑的小模型來做，成本和延遲都低，而且資料不用送出去。離線環境的客戶想做 agent 時，這類可自架、授權寬鬆的決策模型是可以評估的零件；模型的信心分數校準過，可以設門檻決定要不要轉給人看。
- 來源：Strands Agents Blog，Introducing Strands Decider v2（2026-11-23）：https://strandsagents.com/blog/introducing-strands-decider-v2/ ；iThome 報導（2026-11-25）：https://www.ithome.com.tw/news/180761
