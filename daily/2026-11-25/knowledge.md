# 新知識｜2026-11-25

[← 今日摘要](README.md)｜[產品動態](products.md)｜[新知識](knowledge.md)｜[CVE](cve.md)｜[台灣 IT](taiwan.md)｜[AI](ai.md)｜[清單維護](maintenance.md)｜[26 項產品現況](../../products/README.md)

### Sigstore Rekor 公共實例只收 5 種紀錄類型

- 類別：工具
- 這是什麼：Sigstore 於 2026-11-16 公告，公共的 Rekor 透明日誌即日起只接受 hashedrekord、dsse、intoto（v0.0.1 與 v0.0.2）、rekord、helm 這幾種紀錄類型，其他類型停用。
- 原理：Rekor 是軟體簽章的透明日誌，Cosign 簽映像或簽檔案時會把簽章紀錄寫進去，驗證時再查。公共實例過去接受多種紀錄類型，被停用的類型在過去 90 天的上傳量都是個位數，留著只增加被濫用的面積。公告寫用 Cosign 與各語言 Sigstore SDK（Go、Python、JavaScript、Rust、Ruby）的人不受影響；自己架的 Rekor 可以繼續開這些類型；新的整合請直接用 Rekor v2。
- 用在哪裡：客戶在 OpenShift 或 Rancher 上用 Cosign 簽映像並設准入驗證的，這次不用改。要留意的是自己寫工具直接呼叫公共 Rekor API、上傳冷門紀錄類型的情況。離線環境本來就連不到公共 Rekor，用的是自架的透明日誌或離線驗證，這次也不受影響。
- 原文：Sigstore Blog，Rekor public instance hardening（2026-11-16）：https://blog.sigstore.dev/rekor-public-instance-hardening/

### Agent Host Protocol：讓 AI agent 的工作階段可以跨裝置接續

- 類別：標準
- 這是什麼：GitHub 於 2026-11-17 發表的開放協定 Agent Host Protocol（AHP），定義 AI agent 的執行端（host）與各種用戶端之間怎麼溝通，同一個工作階段可以在編輯器、終端機、手機之間接續。
- 原理：協定以 URI 識別的 channel 為單位。每個 server 一定要實作 root、session、chat 三個 channel，另外可以加上終端機、MCP、OTel 回報等 channel。每個 channel 裡有一個 reducer 式的狀態物件，server 是狀態的仲裁者，用戶端送出一連串 action 去改變狀態或觸發動作。這樣斷線重連很單純：用戶端把排隊中的 action 重送，等 server 對帳確認。文章寫 VS Code 為此把原本超過 400,000 行的 Copilot Chat extension 拆出獨立的 agent host，目前有五個用戶端與兩個 host；`code agent host` 可以單獨啟動 VS Code 的 agent host。
- 用在哪裡：它和 MCP 處理的是不同層：MCP 是 agent 怎麼接工具，AHP 是使用者介面怎麼接 agent。客戶評估把 coding agent 放在遠端主機或容器裡執行、開發人員從自己的電腦連進去時，這是可以參考的架構；也代表 agent host 會變成一個要管的長駐服務，要列入連線、身分與稽核的範圍。
- 原文：GitHub Blog，Building the Agent Host Protocol for sessions that continue across devices（2026-11-17）：https://github.blog/engineering/engineering-principles/building-the-agent-host-protocol-for-sessions-that-continue-across-devices/

### RFC 10097：RPKI 信任錨憑證同時有好幾張有效時，該用哪一張

- 類別：標準
- 這是什麼：2026-11-18 的 RFC 10097「Tiebreaking Resource Public Key Infrastructure (RPKI) Trust Anchors」，更新 RFC 8630，規定驗證端（Relying Party）手上有同一個信任錨的多張有效憑證時的挑選順序。
- 原理：RPKI 的信任錨（Trust Anchor）憑證是自簽的，沒有上層可以撤銷它，有些效期長達一個世紀。信任錨換發新憑證之後，舊的那張仍然有效，位在傳輸路徑上的攻擊者可以重送舊憑證，讓驗證端退回舊的資源範圍。RFC 10097 規定的順序是：先選簽發時間較新的；notBefore 相同時選效期最短的；notBefore 與 notAfter 都相同時選最近一次取得的。
- 用在哪裡：這是路由安全（BGP 來源驗證）的基礎設施，直接相關的是電信業者與自己管 AS 的大型機構。對我們比較有用的是觀念：根憑證效期很長、又不能撤銷的時候，「換發」本身不會讓舊憑證失效，必須另外有規則讓驗證端優先採用新的。客戶規劃內部 PKI（例如 Vault PKI）的 root CA 輪替時，會遇到同樣的問題。
- 原文：RFC Editor，RFC 10097（2026-11-18）：https://www.rfc-editor.org/info/rfc10097/
