# 新知識｜2026-11-27

[← 今日摘要](README.md)｜[產品動態](products.md)｜[新知識](knowledge.md)｜[CVE](cve.md)｜[台灣 IT](taiwan.md)｜[AI](ai.md)｜[清單維護](maintenance.md)｜[26 項產品現況](../../products/README.md)

今天 5 則，五個類別各一則。今天是星期五，最後有本週回顧與本週動手題。

### AWS-LC：把所有服務收斂到同一個密碼函式庫，後量子演算法就變成例行升級

- 類別：架構與實務
- 這是什麼：AWS 說明它怎麼靠「全公司用同一個密碼函式庫 AWS-LC」取得密碼敏捷性（crypto agility），讓導入 ML-KEM、ML-DSA 這些後量子演算法，變成升級相依套件就能完成的事。
- 原理：AWS-LC 源自 BoringSSL，提供和 OpenSSL 相容的 API，是 s2n-tls、aws-lc-rs（rustls 的預設 provider）、Amazon Corretto Crypto Provider 的底層；LTS 版本維持穩定的 ABI，所以上層程式不用改就能換到新版。ML-KEM 與 ML-DSA 的程式碼來自 mlkem-native 與 mldsa-native，附有機器檢查的證明。文章寫 AWS-LC FIPS 3.0 是第一個把 ML-KEM 納入 FIPS 140-3 驗證的函式庫；ML-DSA 在 FIPS 4.0 模組，FIPS 5.0 納入 mldsa-native，兩者已經送交 NIST。
- 用在哪裡：客戶規劃後量子轉換時，可以參考這個順序：先把分散各處的密碼函式庫收斂、盤點清楚，再換演算法；這也是 QSE 與 GCM 這類盤點工具要先回答的問題。Java 應用可以經由 Amazon Corretto Crypto Provider 用到 AWS-LC。文章舉的數字：Graviton4 上 ML-KEM-768 金鑰交換的耗時降低超過 50 percent。
- 原文：Make post-quantum cryptography updates routine with AWS-LC（AWS Security Blog，2026-11-26） https://aws.amazon.com/blogs/security/make-post-quantum-cryptography-updates-routine-with-aws-lc/

### RFC 10069：QUIC 多路徑擴充，一條連線同時走好幾條網路路徑

- 類別：新標準與規範
- 這是什麼：IETF 在 November 2026 發布的 Standards Track 文件「Managing Multiple Paths for a QUIC Connection」，是 QUIC version 1 的擴充，讓單一連線可以同時使用多條路徑。
- 原理：新增 path ID，用它管理每條路徑各自的 connection ID 與封包編號空間；每條路徑的封包編號都從 0 開始，所以既有的遺失偵測與壅塞控制可以逐條路徑沿用。使用這個擴充要用非零長度的 connection ID，AEAD 的計算要把 path ID 算進去，雙方用新的 transport parameter 表示支援。路徑由用戶端發起，伺服器只做驗證。位址探索與「封包要排到哪一條路徑」的排程演算法不在這份文件的範圍。
- 用在哪裡：行動裝置同時走 Wi-Fi 與行動網路、或需要線路備援與頻寬聚合的情境。HTTP/3 跑在 QUIC 上，之後負載平衡設備與 ingress 的 HTTP/3 支援會碰到它。今天只讀了 Abstract 與 Introduction，細節沒有讀完。
- 原文：RFC 10069（RFC Editor，November 2026） https://www.rfc-editor.org/info/rfc10069/

### ruby2shell（CVE-2026-132825）的機制：一個字元轉成大寫後變成兩個位元組，Ruby 只留了一個位元組的空間

- 類別：新攻擊手法與防禦技術
- 這是什麼：Ruby 字串大小寫轉換的 heap buffer overflow，Ruby 團隊在 November 19, 2026 揭露。這個 CVE 在 2026-11-21 的晨報以產品事件寫過（GitLab 的修補版與 Red Hat 的 RHSB-2026-021），今天寫的是它的成因。
- 原理：在 14 種 ISO-8859 與 Windows-125x 編碼裡，字元 ß 的大寫是「SS」，要兩個位元組，但 Ruby 只預留一個位元組；輸入裡有 21 個 ß 就會溢位一個位元組。受影響的方法是 `upcase`、`swapcase`、`downcase(:fold)`、`casecmp?`；UTF-8 不受影響。會被外部打到的原因在 Rack：它的 MethodOverride 會在驗證之前，把請求的 `_method` 參數轉成大寫，所以 Rails 的預設設定與 classic-style 的 Sinatra 都暴露在外。
- 用在哪裡：判斷自己有沒有受影響要看 Ruby 的版本，不是看應用程式的版本。受影響的是 3.3.13 與更舊、3.4.0 到 3.4.12、4.0.0 到 4.0.9（問題從 Ruby 2.4.0 就在）；修正在 Ruby 3.3.14、3.4.13、4.0.10。GitLab 這類產品內含 Ruby，要跟著產品的修補版升級。這也是「合法的字元轉換讓長度改變」這一類錯誤的例子，程式碼審查時值得留意。
- 原文：How Cloudflare WAF protects against ruby2shell (CVE-2026-132825)（Cloudflare Blog，2026-11-20） https://blog.cloudflare.com/ruby2shell-waf-protection/

### Zarf 1.0：把 Kubernetes 應用和它要的映像檔打包帶進隔離網路的開源工具

- 類別：新工具與開源專案
- 這是什麼：Zarf 是 Defense Unicorns 開發、放在 OpenSSF 底下的 air-gap 軟體交付工具，November 9, 2026 發布 1.0。
- 原理：把容器映像檔、manifest 等東西打包成一個可以離線搬運的套件，帶進隔離網路後再部署。1.0 強化了套件的簽章與驗證流程，推出 v1beta1 的套件 schema，並把原本的變數寫法（`###ZARF_VAR_*###`）改成用 Go templating 處理的 values，官方附了遷移指南。
- 用在哪裡：金融與公部門常見的實體隔離環境，要把 Kubernetes 上的應用與相依映像檔帶進內網時，它是手動 `skopeo copy`、`oc mirror` 之外的另一種做法。今天只讀了發布文章，沒有實際裝過，它和 OpenShift、RKE2 的搭配方式要另外查官方文件。
- 原文：Announcing Zarf 1.0: Security and Stability for Airgap Software Delivery（OpenSSF Blog，2026-11-09） https://openssf.org/blog/2026/11/09/announcing-zarf-1-0-security-and-stability-for-airgap-software-delivery/

### Vault 在 Kubernetes 上的三項更新：etcd 加密用的 KMS、cert-manager 的 Vault issuer、機密即時更新

- 類別：原廠新功能
- 這是什麼：HashiCorp 在 Nov 18, 2026 的文章整理 Vault 在 Kubernetes 上三項和金鑰、憑證、機密有關的功能。
- 原理：第一項是 Vault Kubernetes Key Management：vault-kube-kms 實作 Kubernetes 的 KMS v2 介面，用 Vault 的 Transit engine 包裝 etcd 資料的加密金鑰，文章寫它隨 Vault 2.2 進入完整支援。第二項是 cert-manager 的外部 Vault issuer：Vault Secrets Operator（VSO）2.0 把已核准的 cert-manager Certificate 請求送到 Vault PKI 簽發。第三項是 VSO 1.6 透過 Vault 的 event notifications 即時更新機密，涵蓋動態、自動輪替與手動輪替的 database、KV、Azure、LDAP 機密，不用等下一次輪詢。
- 用在哪裡：已經有 Vault 與 Kubernetes 或 OpenShift 的客戶，可以用第一項做 etcd 的靜態加密、用第二項讓叢集內的憑證由 Vault PKI 簽發。這三項在 OpenShift 上的支援情形文章沒有寫，要另外查 HashiCorp 與 Red Hat 的文件。
- 原文：Building a secure foundation for AI on Kubernetes with HashiCorp Vault（HashiCorp Blog，2026-11-18） https://www.hashicorp.com/blog/building-a-secure-foundation-for-ai-on-kubernetes-with-hashicorp-vault

## 本週回顧

2026-11-21 到 2026-11-27 這七天的新知識共 30 則，逐則列出：

- NIST 決定改版 SP 800-52 Rev. 2：TLS 1.2 降為「可以支援」，並加入後量子演算法（2026-11-21）
- nginx2root 的機制：HTTP/2 流量控制視窗退款沒有上限，加上四個 use-after-free（2026-11-21）
- Argo CD 的 sync window 關閉後，self-heal 可能跳過 Sync hook：資料庫 migration 沒跑卻顯示 Synced（2026-11-21）
- Open Liberty 26.0.0.11：停機寬限時間可以設定了，`quiesceTimeout` 放在 `<server>` 上（2026-11-21）
- Kyverno 1.19.2：CEL 准入政策的成本原來花在重複轉換物件，不是花在 CEL 運算（2026-11-21）
- 後量子的盲簽章：用 VOLE-in-the-Head 零知識證明加多變數簽章，取代 Privacy Pass 的 RSA 盲簽章（2026-11-21）
- 量子位置驗證（QPV）：NIST 首次以無漏洞的 Bell test 證明「人真的在那個地點」（2026-11-22）
- CVE-2026-99312 的機制：KVM 在 AMD 巢狀虛擬化下模擬 INIT 時沒有重設 MMU，guest 可以碰到 host 的記憶體（2026-11-22）
- OpenTelemetry Collector 的五個常見耗能設定：批次、屬性、輪詢、取樣、記憶體保護的順序（2026-11-22）
- PostgreSQL 19 的 `REPACK (CONCURRENTLY)`：資料表重整時不再擋讀寫（2026-11-22）
- 產品跑在客戶自管的 Kubernetes 上，支援範圍要怎麼訂（2026-11-22）
- RFC 10073：Composite ML-DSA，把 ML-DSA 與 RSA 或 ECDSA 綁成「一個」簽章演算法放進 X.509 憑證（2026-11-23）
- Upload2Shell 的機制：Ghostscript 字型載入程式的一次型別錯誤，怎麼變成繞過 -dSAFER 的記憶體寫入（2026-11-23）
- PyPI 新的 Security 分頁：把套件的來源證明（attestation）歸成六種狀態，並標出「來源改變」與「來源消失」（2026-11-23）
- OpenShell 在 Kubernetes 上怎麼關住 AI agent：workload Pod 完全不能對外，每個請求都回到 supervisor 檢查（2026-11-23）
- 裝了執行期防護工具不等於有安全基準：基準是跨團隊要一起回答的六個問題（2026-11-23）
- RFC 10070：OAuth 的 JWT 用戶端驗證，`aud` 只能填授權伺服器的 issuer identifier，不能再填 token endpoint 網址（2026-11-24）
- CVE-2026-119618 的機制：mod_http2 的工作執行緒寫進連線執行緒的記憶體，RHEL 9 與 10 因為每個 stream 各用一個 allocator 而較難利用（2026-11-24）
- phpAfterShell（CVE-2026-126714）的機制：session 檔寫到一半被中斷，新資料的開頭接上舊資料的結尾，下一次 `session_start()` 把它反序列化（2026-11-24）
- Kubernetes v1.38 預告：kubelet 不再接受自行設定的 cgroup driver，改由容器執行環境透過 CRI 回報（2026-11-24）
- Cloudflare 怎麼測 DNS：把端對端測試框架 Flamingo 擴充到 DNS，從每個資料中心對正式環境持續探測，結果決定版本要不要繼續上線（2026-11-24）
- Sigstore Rekor 公共實例只收 5 種紀錄類型（2026-11-25）
- Agent Host Protocol：讓 AI agent 的工作階段可以跨裝置接續（2026-11-25）
- RFC 10097：RPKI 信任錨憑證同時有好幾張有效時，該用哪一張（2026-11-25）
- OAuth 2.0 Token Exchange（RFC 8693）用在 AI agent：impersonation 與 delegation 的差別（2026-11-26）
- Siren：測 AI agent 發現沙箱有洞時會不會自己跑出去（2026-11-26）
- AWS-LC：把所有服務收斂到同一個密碼函式庫，後量子演算法就變成例行升級（2026-11-27）
- RFC 10069：QUIC 多路徑擴充，一條連線同時走好幾條網路路徑（2026-11-27）
- ruby2shell（CVE-2026-132825）的機制：一個字元轉成大寫後變成兩個位元組，Ruby 只留了一個位元組的空間（2026-11-27）
- Zarf 1.0：把 Kubernetes 應用和它要的映像檔打包帶進隔離網路的開源工具（2026-11-27）
- Vault 在 Kubernetes 上的三項更新：etcd 加密用的 KMS、cert-manager 的 Vault issuer、機密即時更新（2026-11-27）

## 本週動手題

題目：盤點一個 lab 環境裡所有的 Ruby 版本，判斷哪些落在 ruby2shell（CVE-2026-132825）的受影響範圍。對應今天的「ruby2shell 的機制」一則。

- 目標：練習「漏洞在語言執行環境、不在應用程式」時的盤點方式：應用程式版本看起來沒問題，裡面帶的 Ruby 可能是舊的。
- 需要的環境：
  - 一個 lab 環境，裡面至少有一台裝了 Ruby 的 Linux 主機，以及一兩個內含 Ruby 的容器映像（例如內部 registry 裡的 GitLab 或其他 Ruby 應用的映像）。
  - 可以進主機與容器執行指令的權限。
  - 不要在正式環境做任何變更；這一題只看版本，不升級、不重啟服務。
- 步驟概要：
  - 列出環境裡有 Ruby 的地方：主機上系統自帶的 Ruby、應用程式自帶的 Ruby（有些產品把 Ruby 包在自己的安裝目錄裡，和系統的不是同一份）、容器映像裡的 Ruby。
  - 逐一查出每一份 Ruby 的版本號，記成一張表：位置、版本號、屬於哪個應用。
  - 對照受影響範圍：3.3.13 與更舊、3.4.0 到 3.4.12、4.0.0 到 4.0.9 受影響；3.3.14、3.4.13、4.0.10 是修正版。
  - 對受影響的每一份，再回答兩個問題：這個應用有沒有接外部來的 HTTP 請求；它是不是 Rails 預設設定或 classic-style 的 Sinatra（這兩種會在驗證前把 `_method` 參數轉大寫）。
- 預期看到的結果：
  - 一張逐項列出的表，每一份 Ruby 都標上「受影響」或「已修正」。
  - 通常會發現同一台主機上不只一份 Ruby，而且版本不同。
  - 受影響而且對外的項目，下一步是查那個產品自己的修補版（例如 GitLab 在 2026-11-21 晨報寫的 Critical Patch Release），不是自己換掉產品裡的 Ruby。
- 出處：受影響與修正版本、受影響的方法與 Rack 的行為都出自 Cloudflare 的文章 https://blog.cloudflare.com/ruby2shell-waf-protection/ 。這一題沒有附指令：查版本號的指令依安裝方式而不同，今天沒有從原廠文件逐一核對，請照各產品的官方文件查。
