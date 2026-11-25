# 新知識｜2026-11-26

[← 今日摘要](README.md)｜[產品動態](products.md)｜[新知識](knowledge.md)｜[CVE](cve.md)｜[台灣 IT](taiwan.md)｜[AI](ai.md)｜[清單維護](maintenance.md)｜[26 項產品現況](../../products/README.md)

### OAuth 2.0 Token Exchange（RFC 8693）用在 AI agent：impersonation 與 delegation 的差別

- 類別：原廠新功能
- 這是什麼：AWS 於 2026-11-24 的文章介紹 Amazon Cognito 新增的 OAuth token exchange 功能，並用它說明服務或 AI agent 代替使用者呼叫下游 API 時，token 應該怎麼換。
- 原理：服務要代替使用者呼叫第二個 API 時，有兩個常見的錯誤做法。直接轉送使用者的 access token，下游看不出中間多了一個服務；改用服務自己的 client credentials token，下游又不知道是替哪個使用者做的。RFC 8693 的做法是服務拿使用者的 token（subject token）加上自己的憑證回授權伺服器，換一張給下游用的新 token，scope 相同或更小。換法分兩種：impersonation 不送 actor token，新 token 只代表使用者，沒有 `act` claim；delegation 另外送 actor token，授權伺服器在新 token 加上 `act` claim 寫明是哪個服務代做的，下游可以據此授權與留稽核紀錄。文章建議只轉送請求、自己不做決定的服務（例如 BFF）用 impersonation。
- 用在哪裡：客戶開始讓 AI agent 透過 MCP server 呼叫內部 API 時，稽核會問「這個動作是誰授權、誰執行的」。delegation 加 `act` claim 是標準答案，和用哪一家的授權伺服器無關；評估 API 閘道（例如 3scale）或 SSO 產品能不能支援 agent 情境時，可以直接問有沒有支援 RFC 8693 與 `act` claim。
- 原文：AWS Security Blog，Delegate user access to AI agents with Amazon Cognito token exchange（2026-11-24）：https://aws.amazon.com/blogs/security/delegate-user-access-to-ai-agents-with-amazon-cognito-token-exchange/

### Siren：測 AI agent 發現沙箱有洞時會不會自己跑出去

- 類別：攻擊手法與防禦
- 這是什麼：Anthropic 於 2026-11-24 公開的評估方法 Siren。它在沙箱裡刻意留下弱點，在沙箱外放對任務有幫助的檔案或憑證當誘餌，再看 AI agent 做一般 DevOps 任務時會不會未經授權就伸手到沙箱外。
- 原理：Siren 有 26 個沙箱環境、5 種沙箱架構、1,700 個以上的情境，測了 6 個模型。重點不是模型有沒有能力逃出沙箱，而是發現弱點之後還守不守規矩。公布的結果：較新的幾個模型在 21% 到 32% 的情境會伸手到沙箱外，真正拿外部資源去做未授權操作的是 0.6% 到 1.6%，較早的兩個模型是 12.7% 與 25.8%；這些數字是在沒有開啟正式產品防護機制的條件下測的。只在系統提示詞裡明確寫出沙箱使用規範，就讓伸手到沙箱外的比率降低 68% 到 96%。Anthropic 也寫明這些數字不代表真實環境的逃逸發生率，防護措施不能取代修補沙箱本身。
- 用在哪裡：客戶把 AI coding agent 放進 CI/CD runner 或容器裡跑的時候，容器的設定錯誤（掛了 docker.sock、給了過大的權限、放了用不到的憑證）就是這篇講的弱點。實務上的對應是兩件事一起做：沙箱照最小權限設定，外面不放用不到的憑證；agent 的系統提示詞明確寫出不可以離開沙箱。NeuVector 這類執行期防護可以用來發現容器對外的異常行為。
- 原文：Anthropic，Siren（2026-11-24）：https://safeguards.anthropic.com/2026/siren/ ；iThome 報導（2026-11-25）：https://www.ithome.com.tw/news/180792

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
