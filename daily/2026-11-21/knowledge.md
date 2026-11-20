# 新知識｜2026-11-21

[← 今日摘要](README.md)｜[產品動態](products.md)｜[新知識](knowledge.md)｜[CVE](cve.md)｜[台灣 IT](taiwan.md)｜[AI](ai.md)｜[清單維護](maintenance.md)｜[26 項產品現況](../../products/README.md)

### NIST 決定改版 SP 800-52 Rev. 2：TLS 1.2 降為「可以支援」，並加入後量子演算法

- 這是什麼：SP 800-52 Rev. 2 是 NIST 在 2019 年發布的 TLS 選用、設定與使用指引，美國聯邦機關與許多稽核基準都拿它當 TLS 設定依據。NIST 於 2026-11-19 公告決定改版；這次只是決定與方向，草案還沒有出來。
- 原理：NIST 的 Crypto Publication Review Board 在 2026 年 5 月徵求過意見，收到的意見與原本的改版規劃一致，所以直接進入改版，草案發布前不再另外徵求意見。公告列出的改版方向如下：
  - 伺服器對 TLS 1.2 從「should 支援」改為「may 支援」。
  - TLS 1.0 與 TLS 1.1 原則上不允許。
  - TLS 1.2 的 cipher suite 中，使用 SHA-1、DSA、靜態金鑰交換或 RSA 金鑰交換的，改為 deprecated 或 disallowed。
  - TLS 1.3 的內容對齊 RFC 9846，並補充在 extension 中協商的演算法。
  - 加入後量子演算法的支援。
  - 最低安全強度提高到 128 bits。
  - 加密與驗證必須使用 AEAD 模式。
  - 憑證 profile、session resumption 與 early data、憑證撤銷、支援的 extension 清單一併更新。
- 用在哪裡：公告沒有給任何日期，只說 CMVP（密碼模組驗證計畫）會另訂時間表，過了之後模組要保留 TLS 1.2 需要「強力理由」，非政府伺服器要保留 TLS 1.0 或 1.1 需要「例外理由」。這和 11-20 寫過的 NIST IR 8547 是同一條線：盤點客戶 Liberty、MQ、JBoss EAP、OpenShift router 上仍啟用的 TLS 1.2 RSA 金鑰交換與 CBC 類 cipher suite 時，可以先用這份清單當預告。
- 原文：TLS | NIST Will Revise SP 800-52 Rev. 2（2026-11-19）：https://csrc.nist.gov/News/2026/nist-will-revise-tls-guidelines

### nginx2root 的機制：HTTP/2 流量控制視窗退款沒有上限，加上四個 use-after-free

- 這是什麼：nginx2root 是研究團隊 Xint 對 nginx 五個記憶體破壞漏洞的統稱，F5 與 nginx.org 於 2026-11-18（UTC）揭露，Cloudflare 於 2026-11-20 發表技術分析。背景：nginx 是 F5 旗下的開源 Web 伺服器與反向代理，商用版叫 nginx Plus，OpenShift 與 3scale 等產品內含它。11-20 晨報的產品動態已寫過 Red Hat 的 RHSB-2026-019，這裡補的是漏洞怎麼運作。
- 原理：
  - CVE-2026-123007（啟用 HTTP/2 即受影響，自 2015 年的 1.9.5 起）：nginx 收到 WINDOW_UPDATE 時會把連線的傳送視窗限制在 2^31 − 1，但排隊中的 DATA frame 被取消時，`ngx_http_v2_filter_cleanup()` 把長度退回 `h2c->send_window` 卻沒有上限。用戶端在排隊之後、stream 被 reset 之前先放大視窗，退款就會超過上限，之後的 WINDOW_UPDATE 不再受限；視窗超過 2^63 後，`ngx_http_v2_send_chain()` 裡以有號 `off_t` 做的比較變成負值，產生 `last` 指標在 `pos` 之前的無效 buffer，在 TLS 下會走到長度受攻擊者影響的 `memcpy()`。要走到這個狀態需要 2^33 個 frame（約 112 GB）；Rapid7 的概念驗證估計總共約 128 GB 的 HTTP/2 流量。
  - CVE-2026-123633（HTTP/2 加 `proxy_pass`，worker 的 `worker_connections` 不足時，自 1.19.7 起）：連線槽不夠時 nginx 會關掉標記為 reusable 的閒置連線；一條只收到部分 HEADERS frame 的連線在已有 stream 的情況下仍被標成 reusable，被關掉後 request 的記憶體已釋放，upstream 程式碼還在用。
  - CVE-2026-121810（HTTP/3 加 `proxy_pass`，自 1.25.0 起）：同一類問題發生在 QUIC stream。
  - CVE-2026-123634（resolver，`proxy_pass` 帶變數再加 `mirror` 或 SSI subrequest，自 0.6.18 起）：resolver 迴圈先存好 `next` 再呼叫 handler，但 handler 可能釋放同一串列裡的另一個 context。
  - CVE-2026-113425（mail proxy 開啟 `proxy on` 與 `auth_http`，自 0.5.33 起）：對已 reset 的用戶端寫入失敗後 session 被釋放，驗證連線的下一個事件用到已釋放的記憶體，不需要有效帳密。
  - F5 對每個 CVE 的評分是 CVSS 3.1 8.1（High）、CVSS 4.0 9.2（Critical）；要做到程式碼執行必須先關閉或繞過 ASLR。
- 用在哪裡：修補版本是 nginx Open Source 1.30.7 或 1.31.9、nginx Plus 37.0.8.1 或 37.3.0.1（R34 到 R36 受影響但沒有修補版，要升到 37.x）；修補後要重啟或做 binary upgrade，只 reload 設定不會換掉執行檔。還不能修補時，`http2 off;` 可擋 CVE-2026-123007 與 CVE-2026-123633，移除 QUIC listener 或 `http3 off;` 可擋 CVE-2026-121810。盤點用 `nginx -V` 與 `nginx -T`，並注意發行版可能 backport 修補而不改版號。可觀察的跡象是一條長時間的 HTTP/2 連線收進數十 GB 卻幾乎沒有回傳，以及錯誤記錄中的 `worker process <pid> exited on signal 11`。原文是 Cloudflare 官方部落格，防護建議中有一部分以它自家服務為主。
- 原文：nginx2root: Five new nginx vulnerabilities, and how Cloudflare protects origins from the worst of them（2026-11-20）：https://blog.cloudflare.com/nginx2root/

### Argo CD 的 sync window 關閉後，self-heal 可能跳過 Sync hook：資料庫 migration 沒跑卻顯示 Synced

- 這是什麼：CNCF Ambassador Afzal Ansari 於 2026-11-20 發表的事故分析。一個服務分五個區域、每區一個 Argo CD Application，開啟 automated sync、prune 與 self-heal，並設了非上班時間的 deny sync window，資料庫 migration 做成 Sync hook Job。在 deny window 期間推了新版，window 關閉後五個 Application 同步到同一個 commit，其中兩個沒有跑 migration，新程式對著舊 schema 跑了 36 到 44 分鐘，而這兩個 Application 都顯示 Synced 與 Healthy。文章沒有寫受影響的 Argo CD 版本。
- 原理：Argo CD 有兩種 refresh。level-2 由 reconciliation 計時器觸發（約每二到三分鐘），會拿 Application 和 Git 比對；level-1 由受管理物件的變動觸發，沿用 controller 已知的資訊。window 期間計時器 refresh 會把新 commit 寫進 `status.sync.revision`，但實際上一次 sync 還停在舊 commit。window 關閉後如果先來的是 level-1 refresh，它拿這個已記錄的 revision 當比對目標，`evaluateRevisionChanges` 判定沒有變更，`alreadyAttemptedSync` 又只比對 source，於是 controller 認為這個 revision 已經 sync 過，只由 self-heal 對 out-of-sync 的資源做 partial sync。partial sync 不跑任何 hook，也不寫 history。作者的結論是：在 level-1 路徑上，「上次比對的 revision」被當成「上次 sync 的 revision」。作者在 lab 用四分鐘的 deny window 重現，六次中出現五次。
- 用在哪裡：同時使用 sync window、self-heal 與 hook 型 migration 的 GitOps 環境都要檢查，OpenShift GitOps 的底層就是 Argo CD。作者建議把 migration 改成一般受管理資源：拿掉 hook annotation，加 `argocd.argoproj.io/sync-wave: "-1"`，Job 名稱每次發版都變（例如 `db-migration-v11`），保留 `prune`，不要設 `ttlSecondsAfterFinished`（Job 被 Kubernetes 刪掉後 self-heal 會把它補回來，migration 會重跑），並保持 migration 可重複執行。替代做法是在有 migration 的 Application 上設 `selfHeal: false`。作者依程式碼判斷、但沒有實測的是：把 hook 改成 `PreSync`、開啟 `RunHooksOnPartialSync` 或縮短 window 都沒有用。
- 原文：When a sync window closes: How Argo CD self-heal skipped the migration hook（2026-11-20）：https://www.cncf.io/blog/2026/11/20/when-a-sync-window-closes-how-argo-cd-self-heal-skipped-the-migration-hook/

### Open Liberty 26.0.0.11：停機寬限時間可以設定了，`quiesceTimeout` 放在 `<server>` 上

- 這是什麼：Open Liberty 26.0.0.11（2026-11-03）在 `server.xml` 的 `<server>` 元素新增 `quiesceTimeout` 屬性，用來設定伺服器停止時等待進行中工作完成的時間。以前這段寬限時間寫死為 30 秒。
- 原理：預設值與最小值都是 30 秒；低於 30 秒或無法解析的值會退回 30 秒並記錄 `CWWKG0111W`。單位可用 `h`、`m`、`s`、`ms` 並可組合，例如 `<server quiesceTimeout="1m30s">`；只寫整數時當作秒。停機分兩段：pre-phase listener（例如 channel framework，負責停止接收新連線）可以用掉完整的設定時間；default-phase listener 與執行緒排空（等進行中的應用程式工作與 executor 執行緒）用剩下的時間。如果 pre-phase 用掉超過一半，default-phase 會拿到一段等於設定值一半的新時間，所以整體停機時間最長可能是設定值的 1.5 倍。伺服器執行中修改這個值，不必重啟，下一次停機就生效。
- 用在哪裡：長交易、批次或 MQ 訊息處理在 30 秒內收不完的應用程式，例如 OpenShift 上 rolling update 時被終止的 Pod。在容器環境要把 Pod 的 `terminationGracePeriodSeconds` 設得比 `quiesceTimeout` 的 1.5 倍更長，否則 Liberty 還沒排空就會被強制終止；這一點是我們依上述機制推論的，原文沒有寫 Kubernetes 的設定。記錄中出現 `CWWKE1102W` 代表時間到了伺服器仍然停止，應調高設定值；`CWWKE1107W` 會列出沒有完成的執行緒數。從 26.0.0.11-beta 升上來的要注意，beta 時這個屬性在 `<executor>` 上，正式版移到 `<server>`。
- 原文：Configurable quiesce timeout and security enhancements in Open Liberty 26.0.0.11（2026-11-03）：https://openliberty.io/blog/2026/11/03/26.0.0.11.html

### Kyverno 1.19.2：CEL 准入政策的成本原來花在重複轉換物件，不是花在 CEL 運算

- 這是什麼：Kyverno 是 CNCF 的 Kubernetes 政策引擎，以 admission webhook 的形式驗證與修改資源。Nirmata 的 Raunak Madan 於 2026-11-18 在 CNCF 部落格說明對 ValidatingPolicy 引擎做 profiling 的結果，修正隨 Kyverno 1.19.2 釋出。
- 原理：profiling 顯示約 86.8% 的記憶體配置量花在 `ConvertObjectToUnstructured`，也就是把被准入的物件轉成 CEL 可用格式的步驟，CEL 運算本身幾乎看不到。原因是這個轉換放在逐條政策的迴圈裡：套用 Pod Security Standards 時，一次 Pod 建立大約會符合 16 條政策，同一個 Pod 就被解析 16 次，成本隨政策數線性成長。修正的做法是在迴圈之前只建一次 CEL request 值，所有符合的政策共用。以約 50 KB 的 Pod 直接呼叫引擎的 benchmark，結果如下：
  - 符合 1 條政策：配置次數從 2,327 降到 854，引擎時間從 0.31 ms 降到 0.10 ms。
  - 符合 16 條政策：配置次數從 37,055 降到 2,718，引擎時間從 4.91 ms 降到 0.16 ms。
  - 符合 64 條政策：配置次數從 148,131 降到 8,672，引擎時間從 20.01 ms 降到 0.36 ms。
  - 這些數字不含 webhook 來回、API server 與 etcd，是單機測試，作者說明只能看相對趨勢。
- 用在哪裡：政策條數多的叢集升到 1.19.2 最有感；舊的 ClusterPolicy 引擎在 1.16.4 到 1.17.0 之間出現的 12% 到 23% 效能退步，也只在 1.19.2 修正。文章另外拿 Kyverno 1.19.0（修正前）和 Kubernetes 原生的 ValidatingAdmissionPolicy 比較同樣 16 條政策：延遲是 Kyverno 約 20 ms、原生約 29 ms，CPU 是 Kyverno 約 3.2 核、原生約 8.2 核，而且原生的負載落在無法水平擴充的 control plane 上；只有 1 條政策時則是原生較快（約 9.2 ms 對 12.8 ms）。在 OpenShift 或 RKE2 上評估「用原生 VAP 還是 Kyverno」時，這是可以引用的量測，但作者是 Kyverno 的商業支援廠商員工，建議在自己的環境重測，測試工具在 Kyverno repository 的 `docs/perf-testing/`。
- 原文：Optimizing Kubernetes admission control: Where Kyverno's CEL admission cost actually goes（2026-11-18）：https://www.cncf.io/blog/2026/11/18/optimizing-kubernetes-admission-control-where-kyvernos-cel-admission-cost-actually-goes/

### 後量子的盲簽章：用 VOLE-in-the-Head 零知識證明加多變數簽章，取代 Privacy Pass 的 RSA 盲簽章

- 這是什麼：Privacy Pass 是讓網站不用 CAPTCHA 或帳號就能對用戶端做速率限制的匿名權杖協定，底層是用 RSA 與橢圓曲線做的盲簽章（簽發者簽了卻不知道簽的內容，事後也無法把權杖連回簽發當下）。Cloudflare 於 2026-11-06 說明這類隱私協定的量子風險，以及它實作的後量子替代方案。
- 原理：量子攻擊者能偽造權杖、繞過速率限制；但 Privacy Pass 的不可連結性是無條件成立的，量子攻擊者也破不了，所以受威脅的是真實性而不是隱私。直接換成 ML-DSA 的障礙是大小，ML-DSA-44 簽章 2,420 bytes，ECDSA-P256 只有 64 bytes。文中介紹的 PoMFRIT（Baum 等人，USENIX Security 2026）分三步：用戶端送出對訊息 m 的承諾 c = H(m, r)；簽發者用多變數簽章 MAYO 或 UOV 對 c 簽名，看不到 m；用戶端出示的不是簽章本身，而是一份零知識證明，證明自己知道 s 與 r 使得 Verify(pk, H(m, r)) = 1，這份證明就是盲簽章。零知識證明用 VOLE-in-the-Head（Baum 等人，Crypto 2023）：證明者在本機模擬兩方用 VOLE 產生的關聯亂數，先承諾，再用 Fiat-Shamir 決定驗證者檢查哪些部分，適合表示成小型二元體上方程式的敘述。
- 用在哪裡：這提醒我們盤點 PQC 遷移範圍時不能只看 TLS 與 PKI，匿名權杖、匿名憑證這類協定也在用量子脆弱的密碼學。Cloudflare 實作的數字是 PoMFRIT 搭配 UOV 時簽發不到 1 KB、兌換 4.3 KB，公鑰 46.6 KB，每個操作數毫秒，程式碼在 github.com/cloudflareresearch/vole-mole。限制原文寫得很清楚：多變數密碼學近年有數組參數被攻破，UOV 與 MAYO 目前撐住但參數可能再調整；縮小證明用到的 one-more-UOV 假設可能過於樂觀；部分最佳化還沒有安全性證明。目前屬於研究階段，沒有對應的 IETF 草案。
- 原文：The post-quantum future of web privacy（2026-11-06）：https://blog.cloudflare.com/vole-mole/
