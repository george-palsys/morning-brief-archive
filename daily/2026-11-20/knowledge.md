# 新知識｜2026-11-20

[← 今日摘要](README.md)｜[產品動態](products.md)｜[新知識](knowledge.md)｜[CVE](cve.md)｜[台灣 IT](taiwan.md)｜[AI](ai.md)｜[清單維護](maintenance.md)｜[26 項產品現況](../../products/README.md)

### NIST IR 8547 定案：量子脆弱的公鑰演算法 2030 年後 deprecated、2035 年後 disallowed

- 這是什麼：NIST 於 2026-10-27 發布 IR 8547「Transition to Post-Quantum Cryptography Standards」定案版，取代 2024-11-12 的初始公開草案。這份報告是 NIST 把現行公鑰演算法換成後量子演算法的正式路線與時程。
- 原理：報告把 ECDSA、EdDSA、RSA 簽章，以及 Finite Field DH/MQV、Elliptic Curve DH/MQV、RSA 金鑰建立，一律訂為 2030 年後 deprecated（仍可用，但資料擁有者要自行評估風險）、2035 年後 disallowed（不得再用於該用途）。替代的演算法是簽章用 ML-DSA（FIPS 204）、SLH-DSA（FIPS 205）、LMS/HSS 與 XMSS（SP 800-208），金鑰建立用 ML-KEM（FIPS 203），預設建議 ML-KEM-768；HQC 已選定、待標準發布後才算核准。混合（hybrid）金鑰建立採 SP 800-56C 的通用組合方式，把兩個 shared secret 串接成 Z'=Z||T 再做金鑰衍生，只要其中一個輸入來自核准的方案，整個組合就可以通過 FIPS 140 驗證，即使另一個輸入來自已 disallowed 的演算法。
- 用在哪裡：美國聯邦機關依 Executive Order 14412 與 OMB M-26-15，高價值資產與 high impact 系統必須在 2030-12-31 前把金鑰建立換成 PQC、2031-12-31 前把數位簽章換成 PQC，並在 2030-01-02 前支援 TLS 1.3；2030 到 2035 的 deprecated 期間不會放寬這些較早的期限。對我們來說，這是盤點客戶 TLS、PKI、程式碼簽章中 RSA 與 ECC 用量，以及規劃 Vault PKI、Guardium Cryptography Manager、Quantum Safe Explorer 導入順序時可以直接引用的時間表。
- 原文：NIST IR 8547, Transition to Post-Quantum Cryptography Standards（2026-10-27）：https://csrc.nist.gov/pubs/ir/8547/final

### eMudhra 弱金鑰事件：中繼 CA 的私鑰可以從公開憑證直接算出來

- 這是什麼：公開信任的 CA eMudhra 有 8 張中繼 CA 憑證的金鑰強度不足，Cloudflare 於 2026-10-30 發表事件後的量測與修補追蹤報告。原文未提到 CVE 編號，也沒有說明金鑰的演算法種類。
- 原理：Cloudflare 的說法是，這些中繼 CA 的私鑰「任何人都能從公開憑證本身幾乎立即還原」；eMudhra 稱原因是金鑰產生腳本的錯誤，但尚未公開該腳本。拿到私鑰的人可以替任何網域簽發憑證，尚未修補、又不強制檢查 Certificate Transparency 的用戶端會接受這些憑證；和 DigiNotar 這類過去的 CA 入侵不同，這次能偽造憑證的不限於少數攻擊者。Cloudflare 在一週內看到約 22,000 次出示弱金鑰憑證的 TLS handshake，其中約 160 次的憑證 SAN 寫的是不相干組織的網域，最早一張偽造憑證的時間是 2026-10-20 18:19 UTC，距離 Mozilla 的 bug 報告公開不到一小時。
- 用在哪裡：這是「信任庫更新速度」的實例。Cloudflare 約 5,000 萬次探測顯示，更新到最新版的瀏覽器大多已修補，但機器人、舊版瀏覽器仍接受這條憑證鏈，Android WebView 約有 30% 到 40% 仍接受。內部系統要盤點的是瀏覽器以外的信任庫，例如容器 base image、語言執行環境與用戶端軟體；Cloudflare 自己就是修補共用信任庫、base image 與用戶端軟體，並在四小時內用 AI 輔助的原始碼分析找出其他仍信任這些金鑰的系統。
- 原文：4 real? Tracking exploitation and patching of eMudhra's weak keys（2026-10-30）：https://blog.cloudflare.com/emudhra-patching/

### AI 滲透測試 orchestrator：把入侵流程拆給多個 AI agent 平行執行的開源框架

- 這是什麼：AI penetration testing orchestrator 是開源的 agentic 框架，協調多個 AI agent 走完 Cyber Kill Chain 的各個階段。Cloudflare 於 2026-11-13 發表對這類工具的觀測，以及它稱為 Modern Security Model 的六項防禦做法。
- 原理：框架把既有的 MCP（Model Context Protocol）server 與獨立的滲透測試工具串起來，將資產與環境畫成圖，再平行跑多個 agent 做列舉、驗證、製作利用程式與攻擊；每一步的結果可以被驗證後餵給下一步，由框架自己跑觀察、判斷、決定、行動的迴圈。原始框架 ARTEX 於 2026-10-08 被作者從 GitHub 移除後反而擴散，Cloudflare 統計有超過 12,000 個 repository，三天內看到 50 個以上的框架家族從數千個 IP 掃描它的客戶，這類工具的每日請求量自 2026-10-01 起成長約 30 倍。
- 用在哪裡：Cloudflare 記錄的一起事件中，攻擊者用的是外洩的 CI/CD API token，這個 token 靜態、不會過期、沒有 IP 限制也沒有 rate limiting，之後每分鐘發出超過 69 個請求、一小時內發出 400 次資料庫 dump 請求。對應的防禦是六項：WAF 與 rate limiting、Web 應用程式異常偵測、機器人行為偵測、把管理介面與診斷端點收到 Zero Trust 存取之後並做微分段、API 用 OpenAPI schema 驗證加 mutual TLS 並在規則最後放 default-deny、用威脅情資提早封鎖已知來源。原文是 Cloudflare 的官方部落格，建議的做法以它自家服務為主。
- 原文：Adapting to AI penetration testing orchestrators: The Modern Security Model（2026-11-13）：https://blog.cloudflare.com/adapting-to-ai-penetration-testing-orchestrators/

### kube-proxy 的 ipvs 模式排定移除，建議改用 nftables 模式

- 這是什麼：Kubernetes SIG Network 於 2026-11-16 公告 kube-proxy `ipvs` 後端的移除計畫。`ipvs` 模式從 Kubernetes 1.35 起已是 deprecated；部落格寫「計畫在 Kubernetes 1.40 移除」，Kubernetes 官方文件則寫「v1.40 起預設停用（可用 `KubeProxyIPVS` feature gate 重新開啟），v1.43 完全移除」，兩個說法並列，以 KEP-5495 為準。
- 原理：`ipvs` 當初是為了解決 `iptables` 模式的兩個問題：每個 Service 一條規則造成新連線要做 O(n) 比對，以及任何 Service 或 endpoint 變動就重寫整份規則。但核心的 IPVS API 沒有批次更新，大量變更時反而可能比 `iptables` 慢；功能也不夠，`ipvs` 模式仍要靠 iptables 與 ipset 補足部分 Service 功能，所以從未完整實作所有邊界情況。`nftables` 模式改用 verdict map：`service-ips` 這個 map 以（目的 IP、協定、連接埠）為鍵直接對到該 Service 的 chain，整個分派只要一條規則，查詢時間不隨 Service 數量成長；更新也只和有變動的 Service 與 endpoint 成正比。
- 用在哪裡：還在用 `mode: ipvs` 的叢集要排入遷移。官方建議 Kubernetes 1.36 以上、節點核心 5.13 以上就改成 `nftables`，條件不符的改回 `iptables`（這種情況官方建議改完設定後重開每個節點，而不是只重啟 kube-proxy）。另一個推力是 Red Hat 計畫把 iptables API 從 RHEL 完全移除，屆時 RHEL 上也無法使用 `ipvs` 後端。改用 `nftables` 後要注意 NodePort 預設只在節點的 primary IP 上可連（`--nodeport-addresses primary`），而且 kube-proxy 不再替 NodePort 加防火牆放行規則。
- 原文：Scheduling the removal of the kube-proxy IPVS backend（2026-11-16）：https://kubernetes.io/blog/2026/11/16/ipvs-removal/

### Vault Client 正式推出：只含 Agent、Proxy 與部分 CLI 的用戶端專用版本

- 這是什麼：Vault Client 是 Vault Enterprise 的 client-only 版本，執行檔名稱為 `vault-client`，包含 Vault Agent、Vault Proxy、TPM 驗證與一部分 Vault CLI，不含 Vault server。它在 Vault 2.2.0（2026-10-15）是 public beta，在 Vault 2.2.2（2026-11-11）成為 generally available。
- 原理：做法是把 server 程式碼從執行檔中拿掉。官方文件的數字是執行檔大小約為完整 `vault` 的十分之一、相依套件約為一半。Agent 與 Proxy 的功能和設定檔與完整版相同，遷移時把啟動指令的 `vault` 換成 `vault-client` 即可（`vault-client agent`、`vault-client proxy`）。CLI 拿掉了 `server`、`audit`、`debug`、`events`、`license`、`monitor`、`pki`、`plugin`、`policy`、`transform`、`transit`、`version-history`，`operator` 只留 `key-status`、`rotate`、`unseal`；執行被拿掉的指令會印出錯誤並以狀態碼 1 結束，但任何 API 端點仍可用 `read`、`write`、`list`、`delete`、`patch` 呼叫。
- 用在哪裡：適合大量部署在應用程式主機與容器裡、只負責取用 secret 的那一端：要掃描與修補的程式碼變少，用戶端也可以比 server 更常升級。限制是只能從 IBM Passport Advantage Online 下載執行檔，或從 IBM Entitled Registry（`cp.icr.io`）取得容器映像，HashiCorp releases 網站、Docker Hub、Red Hat Ecosystem Catalog 與套件管理工具都沒有；下載需要 Vault Enterprise 授權，執行不需要 license key；Vault Client 2.x 搭配 Vault Enterprise 2.x 以上或 HCP Vault Dedicated。
- 原文：Vault Client（Vault 2.2.2 release notes 列為 2026-11-11 正式推出；文件頁本身未標示發布日期）：https://developer.hashicorp.com/vault/docs/client

### Cloudflare 選用 QuePaxa：不必先偵測 leader 失效就能繼續前進的共識演算法

- 這是什麼：QuePaxa 是 2023 年由 Tennage、Băsescu 等人發表的隨機化共識演算法，屬於 Paxos 家族，角色分為 proposer 與 recorder，leader 是選用的。Cloudflare 於 2026-11-11 說明為何在實驗性的共識服務 Meerkat（供內部全球控制平面使用）選它而不是 Raft。
- 原理：Raft 這類以 leader 為核心的協定只有 leader 能提案，leader 當掉或變慢時，要等逾時、選出新 leader 才能繼續；而在非同步網路上，逾時無法分辨「當掉」與「變慢」，Raft 的選舉逾時常設為網路來回時間的五到十倍，跨洲連線下偵測很慢。QuePaxa 每一輪分四個階段：非 leader 的 proposer 抽隨機優先權、leader 固定拿最高優先權，各 proposer 一律採納自己從多數 recorder 看到的最高優先權提案，再散布、檢查並決定，未決定的帶到下一輪。因為大家是往同一個提案收斂而不是互相競爭，leader 正常時一個來回就能決定；leader 失效時其他 proposer 在 hedge timeout 之後直接提案，這個 timeout 不是故障偵測器，不必跟著網路延遲放大。
- 用在哪裡：適合跨洲、走 Internet、延遲變動大的控制平面。Cloudflare 的量測是 95% 以上的決定由 leader 在第一階段完成；leader 失效期間決定速率降到平常的約 65%，沒有完全停住；需要三個來回才決定時，吞吐量最多只有平常的三分之一。代價是同時提案變多、頻寬用量增加。原文也說明 QuePaxa 的實戰驗證不如 Raft 與 Paxos，原始設計是 crash-stop，Cloudflare 正在擴充為支援 crash recovery，數字是它的內部量測，正式 benchmark 與形式化驗證留待後續文章。
- 原文：Choosing QuePaxa, an unusual consensus algorithm（2026-11-11）：https://blog.cloudflare.com/choosing-quepaxa/

## 本週回顧

正式存檔的「新知識」段落從今天開始；2026-11-14 到 2026-11-19 這六天在正式存檔中沒有新知識項目。今天寫的六則如下：

- NIST IR 8547 定案：量子脆弱的公鑰演算法 2030 年後 deprecated、2035 年後 disallowed（2026-11-20）
- eMudhra 弱金鑰事件：中繼 CA 的私鑰可以從公開憑證直接算出來（2026-11-20）
- AI 滲透測試 orchestrator：把入侵流程拆給多個 AI agent 平行執行的開源框架（2026-11-20）
- kube-proxy 的 ipvs 模式排定移除，建議改用 nftables 模式（2026-11-20）
- Vault Client 正式推出：只含 Agent、Proxy 與部分 CLI 的用戶端專用版本（2026-11-20）
- Cloudflare 選用 QuePaxa：不必先偵測 leader 失效就能繼續前進的共識演算法（2026-11-20）

## 本週動手題

題目：把一座 kubeadm lab 叢集的 kube-proxy 從 `ipvs`（或 `iptables`）模式換成 `nftables` 模式，並確認 NodePort 行為的差異。對應今天的「kube-proxy 的 ipvs 模式排定移除」一則。

- 目標：實際走一次官方建議的遷移步驟，並親眼看到 `nftables` 模式下 NodePort 預設只在節點 primary IP 上可連。
- 需要的環境：
  - 一座用 kubeadm 建的 lab 叢集，Kubernetes 1.36 以上。
  - 節點的 Linux 核心 5.13 以上。
  - 一個 `type: NodePort` 的測試 Service，以及一台有多個 IP 位址的節點（方便比較）。
  - 不要用正式環境；切換模式期間 Service 連線可能受影響。
- 步驟概要：
  - 先記錄切換前的狀態：從節點的每一個 IP 位址連測試 Service 的 NodePort，記下哪些連得到。
  - 編輯 kube-proxy 的 ConfigMap，把 `mode: ipvs`（或 `mode: iptables`、空值）改成 `mode: nftables`：

    ```
    kubectl edit cm -n kube-system kube-proxy
    ```

  - 刪除 kube-proxy 的 Pod，讓 DaemonSet 用新設定重建：

    ```
    kubectl delete po -n kube-system -l k8s-app=kube-proxy
    ```

  - 如果原本有覆寫 IPVS 專用的 kube-proxy 選項，改成 KubeProxyNFTablesConfiguration 裡對應的選項。
  - 再從節點的每一個 IP 位址連一次同一個 NodePort，和切換前比較。
  - 在節點上用 `nft` 工具檢視名為 `kube-proxy` 的 table（本次開啟的官方文件沒有列出確切的 `nft` 指令，請自行查 nftables 文件）。
- 預期看到的結果：
  - kube-proxy 的 Pod 重建後回到 Running，ClusterIP 與 NodePort Service 仍然可連。
  - NodePort 只在節點的 primary IPv4 與 IPv6 位址上可連，其他本機 IP 連不到；這是因為 `nftables` 模式預設 `--nodeport-addresses primary`。要恢復成所有本機 IPv4 位址都可連，官方文件的做法是指定 `--nodeport-addresses 0.0.0.0/0`。
  - 節點上如果有本機防火牆，NodePort 可能被擋，因為 `nftables` 模式不會替 NodePort 加放行規則，要自己放行整段 NodePort 範圍。
  - `kube-proxy` table 裡有 `service-ips` 這個 verdict map，每個 Service 是 map 的一個元素，而不是各自一條規則。
- RKE2 lab 的差異：RKE2 的 kube-proxy 參數是在 `/etc/rancher/rke2/config.yaml` 用 `kube-proxy-arg` 傳入；RKE2 官方文件的設定參考頁沒有給這個欄位的範例寫法，所以這裡不列指令。
- 指令與行為的出處：
  - 遷移步驟：https://kubernetes.io/blog/2026/11/16/ipvs-removal/
  - 兩個 kubectl 指令：https://kubernetes.io/docs/tasks/administer-cluster/kubeadm/kubeadm-reconfigure/
  - NodePort 與防火牆的行為差異、核心版本需求：https://kubernetes.io/docs/reference/networking/virtual-ips/
  - verdict map 的結構：https://kubernetes.io/blog/2025/02/28/nftables-kube-proxy/
  - RKE2 設定欄位：https://docs.rke2.io/reference/server_config
