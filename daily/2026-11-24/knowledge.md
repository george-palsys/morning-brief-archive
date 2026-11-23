# 新知識｜2026-11-24

[← 今日摘要](README.md)｜[產品動態](products.md)｜[新知識](knowledge.md)｜[CVE](cve.md)｜[台灣 IT](taiwan.md)｜[AI](ai.md)｜[清單維護](maintenance.md)｜[26 項產品現況](../../products/README.md)

### RFC 10070：OAuth 的 JWT 用戶端驗證，`aud` 只能填授權伺服器的 issuer identifier，不能再填 token endpoint 網址

- 這是什麼：IETF 於 2026 年 11 月發布的 Standards Track RFC（RFC Editor 列的日期是 2026-11-07），更新 RFC 7521、RFC 7522、RFC 7523 與 RFC 9126，收緊「送給授權伺服器的 token」裡 audience 值的寫法。背景：`private_key_jwt` 這類用戶端驗證，是用戶端自己簽一張 JWT 給授權伺服器證明身分，JWT 的 `aud` claim 說明這張 JWT 是給誰看的。
- 原理：
  - 起因是斯圖加特大學的 Pedram Hosseyni、Ralf Küsters、Tim Würtele 在分析 OpenID Federation 草案時發現的弱點，2025 年 1 月向 OAuth 工作組揭露，論文稱為 Audience Injection。舊規範允許 `aud` 用 token endpoint 網址等多種值；RFC 指出，用戶端只會驗證 metadata 裡的 issuer 值，其他 endpoint 的值無法直接驗證，拿來當 audience 再送到別的 endpoint 就可能成為攻擊途徑。
  - 新規定（更新 RFC 7523）：用於用戶端驗證時，`aud` 必須（MUST）以授權伺服器的 issuer identifier（RFC 8414）作為唯一的值，不可（MUST NOT）使用 token endpoint 網址；授權伺服器必須拒絕 `aud` 不是只含自己 issuer identifier 的 JWT。
  - 用於 authorization grant 時較寬：授權伺服器可以用 issuer identifier 或 token endpoint 網址來識別。
  - 另外註冊了明確的型別 `client-authentication+jwt`（media type `application/client-authentication+jwt`），用來區分照新舊規範產生的 token。
  - 更新 RFC 7522 的部分：新的應用不可（MUST NOT）再用 SAML Bearer Assertion 做用戶端驗證。
- 用在哪裡：客戶用 `private_key_jwt` 讓應用程式向身分提供者（Entra ID、Keycloak 這類）取 token 的地方都會碰到。身分提供者升級到照 RFC 10070 實作的版本後，`aud` 還填 token endpoint 網址的用戶端會被拒絕，所以這是升級前要先盤點的相容性項目。各產品（Liberty 的 OIDC client、3scale、Vault 的 JWT auth）目前的行為這次沒有查。
- 原文：RFC 10070「Updates to OAuth 2.0 JSON Web Token (JWT) Client Authentication and Assertion-Based Authorization Grants」（2026-11-07）：https://www.rfc-editor.org/info/rfc10070/

### CVE-2026-119618 的機制：mod_http2 的工作執行緒寫進連線執行緒的記憶體，RHEL 9 與 10 因為每個 stream 各用一個 allocator 而較難利用

- 這是什麼：Apache HTTP Server 的 HTTP/2 模組 mod_http2 在 `assign_headers()` 的執行緒同步缺陷，可造成堆積記憶體毀損與遠端執行程式碼。漏洞的利用現況與修補寫在今天的 [CVE](cve.md)，這裡依 Red Hat 的 CVE 頁（2026-11-11 公開）與 Apache 的公告補它怎麼運作。
- 原理：
  - HTTP/2 讓用戶端在一條連線上同時送出多個請求（stream），mod_http2 用多個工作執行緒同時處理這些請求。
  - 根本原因（Red Hat 的說明）：工作執行緒透過一個共用、沒有鎖的 allocator，寫進屬於連線執行緒的記憶體，一個執行緒因此改到另一個執行緒的資料，破壞伺服器內部的記憶體。Apache 把它歸類為「Concurrent Execution using Shared Resource with Improper Synchronization」。
  - 觸發條件：用 `Protocols` 指令啟用了 HTTP/2（`h2` 或 `h2c`）。只提供 HTTP/1.1 的伺服器不受影響。
  - 為什麼同一個漏洞在不同產品嚴重度不同：利用方式依賴「stream 的工作執行緒與連線共用 allocator」。RHEL 9 與 RHEL 10 出貨的 mod_http2 套件讓每個 HTTP/2 stream 從各自獨立的 allocator 配置，利用難度大幅提高，所以 Red Hat 對 RHEL 9 與 RHEL 10 評為 Important 而不是 Critical。
  - mod_http2 2.0.8 之前的版本沒有這段程式碼，RHEL 8 與更早的版本不受影響；Apache 列的受影響範圍是 HTTP Server 2.4.55 到 2.4.70，以及 GitHub 上的 mod_h2 2.0.8 到 2.0.42。
  - Apache 的致謝欄列出兩組發現者：Anthropic 的 OSS Scanner（2026-10-26 回報）與 Google Cloud Vulnerability Research 的 Anthony Weems、Simon Scannell（2026-11-03 回報）。
- 用在哪裡：兩個可以帶走的重點。第一，判斷客戶的 httpd 有沒有風險，先看有沒有啟用 HTTP/2，再看 mod_http2 的版本與來源（上游與 RHEL 套件的配置方式不同）。第二，同一個 CVE 在不同發行版的評級可以不同，原因是編譯與封裝方式不同，回答客戶時要引用該產品自己的評級。
- 原文：
  - Red Hat CVE 頁 CVE-2026-119618（2026-11-11 公開）：https://access.redhat.com/security/cve/CVE-2026-119618
  - Apache HTTP Server 2.4 vulnerabilities（2.4.71，2026-11-11）：https://httpd.apache.org/security/vulnerabilities_24.html

### phpAfterShell（CVE-2026-126714）的機制：session 檔寫到一半被中斷，新資料的開頭接上舊資料的結尾，下一次 `session_start()` 把它反序列化

- 這是什麼：Cloudflare 部落格 2026-11-20 的文章，說明 depthfirst 於 2026-11-19 揭露的 phpAfterShell。它是 PHP 預設的檔案型 session handler 的漏洞，可導致遠端執行程式碼，文章寫 CVSS 4.0 為 9.2；PHP 在同一天以 8.2.36、8.3.37、8.4.28、8.5.13 與 8.6.0 修正。修補版本的消息 11-21 晨報的 CVE 段寫過，這裡補機制。
- 原理：
  - PHP 預設把 session 資料存成檔案。應用程式呼叫 `session_start()` 時，PHP 讀檔並把內容反序列化成 `$_SESSION` 陣列；請求結束時再把更新後的 session 寫回同一個檔。
  - 漏洞在這次寫入被中斷時觸發：檔案裡會是「新 session 資料的開頭」接上「舊資料的結尾」。下一個請求的 `session_start()` 會反序列化這份混合內容；如果舊資料是攻擊者控制的，PHP 就可能反序列化出攻擊者指定的物件。
  - 攻擊者要先把可控制的資料放進 session，PHP 的公告點名兩條路：session upload progress（把進行中的檔案上傳資訊寫進 session 的功能，遠端用戶端可以藉它塑造儲存的內容），以及把大量使用者可控字串存進 session 的應用程式。
  - 依 PHP 的說法，要執行程式碼還需要寫入剛好在有用的位置被中斷，以及應用程式裡有合適的反序列化 gadget chain。depthfirst 表示它另外串接一個尚未公開、位於 PHP 原生類別的記憶體毀損問題，不靠應用程式的 gadget 就達成執行程式碼；Cloudflare 寫它看到的來源無法確定第二個問題是否已在 11 月 19 日的版本修掉。
  - WAF 的部分：Cloudflare 2026 年 10 月為 php2shell 部署的 PHP 遠端執行程式碼規則，在漏洞揭露前就偵測得到一部分攻擊樣式，11 月 19 日更新後涵蓋 phpAfterShell。文章自己寫明 WAF 是多一層防護，不能取代修補，完整的修正是升級 PHP 並重啟每一個 worker。
  - 攻擊現況（文章的說法）：到 2026-11-19 為止沒有被利用的跡象，同批 17 個漏洞沒有一個列入 CISA KEV。
- 用在哪裡：PHP 不是我們的產品線，但這個機制是通用的教訓：「寫入不是原子操作，讀的一方又會反序列化」的儲存都可能有同一類問題，檢視客戶自行開發的 session 或快取儲存時可以拿來問。客戶有 PHP 系統的，升級之後要確認 worker 都重啟過。
- 原文：How Cloudflare WAF helps protect against phpAfterShell and other critical PHP flaws（2026-11-20）：https://blog.cloudflare.com/phpaftershell-waf-protection/

### Kubernetes v1.38 預告：kubelet 不再接受自行設定的 cgroup driver，改由容器執行環境透過 CRI 回報

- 這是什麼：Kubernetes 官方部落格 2026-11-23 的「Kubernetes v1.38 Sneak Peek」，列出 v1.38 預定的移除、破壞性變更與主要功能。文章寫明內容依目前的狀態，正式釋出前可能改變。
- 原理：
  - 破壞性變更一，cgroup driver：v1.37 以前可以在 kubelet 設定檔用 `cgroupDriver` 指定；新的做法是 kubelet 透過 CRI 的 RuntimeConfig RPC 向容器執行環境詢問該用哪一種。v1.38 預設不允許舊做法，kubelet 會拒絕 `cgroupDriver` 欄位，除非開啟暫時性的 feature gate `LegacyCgroupDriverFallback`。結果是容器執行環境必須比 kubelet 先啟動；重試後仍拿不到 cgroup driver，kubelet 會在註冊節點之前就以錯誤結束。kubeadm 也不再預設把 `cgroupDriver` 設成 `systemd`（KEP-4033）。
  - 破壞性變更二，swap：節點是 cgroup v2 且設定 `LimitedSwap` 時，v1.38 的 kubelet 會依 Pod 層級的記憶體設定套用 swap 上限；Pod 層級的記憶體 request 等於 limit 的 Pod 完全拿不到 swap（KEP-2837）。
  - 移除：`KUBECTL_REMOTE_COMMAND_WEBSOCKETS` 與 `KUBECTL_PORT_FORWARD_WEBSOCKETS` 兩個環境變數，kubectl 之後一律先試 WebSocket、需要時退回 SPDY。kuberc 預計升到 stable，新的 `kubectl.config.k8s.io/v1` API 的 credential plugin allowlist 不再有 `name` 欄位，要改用 `command`。
  - 持續中的變更：cgroup v1 的支援預定在未來版本移除，`failCgroupV1: false` 在 v1.38 仍可用；v1.37 起 admission webhook 預設不再收到 TokenReview、SubjectAccessReview 這類審查請求（feature gate `ExcludeAdmissionWebhookVirtualResources`）。
  - 預計納入的功能：Pod-level resources 升到 stable；DRA 的 partitionable devices 升到 stable（一張 GPU 可以整張或切成較小的分割區宣告）；新的 EvictionRequest API（alpha），讓應用程式在 Pod 被驅逐前有時間收尾，不取代 PodDisruptionBudget。
- 用在哪裡：對 OpenShift 與 RKE2 的客戶，這些會在對應 Kubernetes 1.38 的發行版出現，各發行版的時程這次沒有查。現在可以先做兩件事：檢查 kubelet 設定與安裝腳本有沒有寫死 `cgroupDriver`；檢查有沒有 admission webhook（包含安全產品的）規則寫到 TokenReview 或 SubjectAccessReview。
- 原文：Kubernetes v1.38 Sneak Peek（2026-11-23）：https://kubernetes.io/blog/2026/11/23/kubernetes-v1-38-sneak-peek/

### Cloudflare 怎麼測 DNS：把端對端測試框架 Flamingo 擴充到 DNS，從每個資料中心對正式環境持續探測，結果決定版本要不要繼續上線

- 這是什麼：Cloudflare 部落格 2026-11-23 的工程文章。起因是一次事故：把 DNS 紀錄發布到邊緣節點的服務在某次上線時有排程的 bug，部分紀錄變更好幾個小時沒有發布；服務本身一直是健康的，但新的主機名稱解析很慢，憑證也簽發不出來。
- 原理：
  - 文章的判斷：DNS 的故障慢、分散在整個網路、而且只影響一部分地方，單元測試與服務的健康狀態看不出來，所以要用客戶實際經歷的方式測：持續地、從每個資料中心、對正式環境測。
  - 做法是擴充既有的端對端測試框架 Flamingo（文章寫它每天對 Cloudflare 邊緣跑數億次測試）。測試用自訂的 DSL 寫，固定是「設定、請求、斷言」三段，例如 `GET` 一個網址後 `ASSERT STATUS IS 301`；用 DSL 而不用一般程式語言，是為了測試失敗時不必連測試本身一起除錯。
  - 把中間的「請求」一般化成「動作」，框架就不限於 HTTP。Flamingo 用 Rust 寫，動作是強型別的列舉，DNS 支援就是新增一種 `DnsQuery` 動作（查詢名稱、查詢類型與參數）。
  - 控制面與排程器可以指定環境、資料中心或一定比例的機器來跑測試。
  - 文章說這些量測現在用來決定一次發布要繼續還是回滾。傳播時間實際怎麼量、門檻怎麼訂，在文章後半，我這次沒有讀完，不寫。
- 用在哪裡：這是「服務健康不等於結果正確」的實例，和客戶談 Instana 這類可觀測性工具時可以用：指標都綠但使用者端壞了怎麼辦。做法是加上從使用者角度持續執行的合成測試，並把結果接進發布流程當成放行條件。事故裡「憑證簽發不出來」也提醒，憑證自動化會被 DNS 發布延遲卡住。Instana 的對應是我自己的類比，不是文章內容。
- 原文：Probing DNS at Cloudflare（2026-11-23）：https://blog.cloudflare.com/probing-dns-at-cloudflare/
