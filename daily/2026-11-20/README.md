# 晨報 2026-11-20（星期五）｜摘要

**今天最需要注意的一件事**：nginx 的 NGINX2Root 漏洞（CVE-2026-123007 等 5 個）Red Hat 評為 Critical、PoC 已公開、尚無 errata，3scale APIcast 被列為直接受影響，客戶叢集上的 NGINX Ingress Controller 與含 nginx 的映像要先盤點並套緩解。 → [產品動態](products.md)

## 產品動態

26 項：有更新 10、無更新 14、無法確認 1、無公開來源 1。→ [完整內容](products.md)｜[26 項產品現況](../../products/README.md)

| 產品 | 更新 | 要不要動作 |
|---|---|---|
| [MQ](../../products/mq.md) | 安全公告 CVE-2026-18142（High，CVSS 7.1，阻斷服務） | 依版本排修補（9.2.0.46 CSU／9.3.0.43 CSU／9.4.0.30／10.0.0.6／10.0.1.0） |
| [Coverity](../../products/coverity.md) | 2026.9.1：用戶端不再內建 ca-certs.pem | 升級前在 lab 驗證私有 CA 憑證設定 |
| [JBoss EAP](../../products/jboss-eap.md) | RHSA-2026:100682（Important），EAP XP 6.0 Update 7.1，10 個 CVE | 有裝 EAP XP 6 的環境排更新到 XP 6.0 Update 7.1 |
| [CI/CD/GitLab](../../products/cicd.md) | 19.6 月度版，內建 NGINX 升到 1.31.7 | 升級前讀 upgrade notes；留意 GitLab 對 NGINX2Root 的後續公告 |
| [CI/CD/GitHub Actions](../../products/cicd.md) | RHEL 9／10 larger runner 映像 GA | 不需要動作 |
| [CI/CD/Argo CD](../../products/cicd.md) | v3.6.2、v3.5.8、v3.4.14（含 CVE-2026-77299 相依套件修正） | 照一般 patch 流程安排 |
| [CI/CD/Sonatype Nexus Repository](../../products/cicd.md) | 3.98.3，一項搜尋索引修正 | 不急，視需要升級 |
| [OpenShift](../../products/openshift.md) | RHSB-2026-019：nginx 5 個漏洞（NGINX2Root，Critical），尚無 errata | 盤點含 nginx 的映像與 ingress，先套緩解，等 errata |
| [OpenShift](../../products/openshift.md) | RHSB-2026-018 更新：Java4Shell 的 OpenJDK 修正版 errata 開始釋出 | Java 映像排更新；尚無修正的產品先加 JVM 參數緩解 |
| [OpenShift](../../products/openshift.md) | RHSB-2026-020：PHP 7 個漏洞（6 個 Critical），尚無 errata | 有 PHP 工作負載的客戶先套緩解，等 errata |
| [OpenShift](../../products/openshift.md) | 4.12 EUS Term 3 於 2027-01-17 結束 | 4.12 客戶現在排升級，2027-01-17 前完成 |
| [OpenShift](../../products/openshift.md) | 5 筆容器映像更新 errata（RHBA） | 用 ubi8 OpenJDK 映像的應用重新 build |
| [3scale](../../products/3scale.md) | RHSB-2026-019 列 3scale 2 為直接受影響，尚無修補 | 開 support case 確認 APIcast 的緩解做法，等 errata |
| [JBCS httpd](../../products/jbcs-httpd.md) | 2.4.62 SP7，含 Critical 修補（RHSA-2026:100552／100550） | 排升級到 2.4.62 SP7（Critical） |
| [Rancher / RKE2](../../products/rancher-rke2.md) | RKE2 v1.37.2+rke2r1（2026-11-05） | 照一般升級流程；留意 SUSE 對 NGINX2Root 的公告 |
| [Rancher / RKE2](../../products/rancher-rke2.md) | RKE2 v1.35.10+rke2r1（2026-11-05），Traefik chart v40 破壞性變更 | 升級前檢查 Traefik provider 名稱 |
| [Confluent Platform](../../products/confluent-platform.md) | CONFSA-2026-37：Java4Shell，CP 映像尚無修補版 | 先加 JVM 參數緩解（Java 8 不要加），等修補版映像 |
| [Confluent Platform](../../products/confluent-platform.md) | NGINX 漏洞通知：自管 CP 不受影響 | 不需要動作 |
| [Palsys One](../../products/palsys-one.md) | AppScan on Cloud 2026-11-19 更新，static analysis client 8.0.1761 | 不需要動作 |

無法確認：Software Risk Manager (SRM)（文件集沒有 release notes 章節，找不到版本來源）。

## CVE 重大新聞

5 則。其中 2 則（Java4Shell 後續、NGINX2Root）併入產品動態。→ [完整內容](cve.md)

- CVE-2026-114938（Java4Shell）（後續）：開始出現攻擊嘗試，Red Hat 釋出第一張 errata，Keycloak 映像已更新【與我們的產品線相關】
- NGINX2Root：F5 緊急修補 nginx 十個漏洞，其中五個可能遠端執行程式碼（CVE-2026-123007 等），Red Hat 評為 Critical【與我們的產品線相關】
- CVE-2026-123890：VMware vCenter 驗證繞過漏洞，9 月起已被當成 zero-day 利用
- CVE-2026-129448：Apache Roller 反序列化漏洞，Apache 表示正遭實際攻擊
- CVE-2026-76466：Cisco Expressway 在 PoC 公開後遭實際攻擊

## 新知識

6 則。→ [完整內容](knowledge.md)

- NIST IR 8547 定案：量子脆弱的公鑰演算法 2030 年後 deprecated、2035 年後 disallowed
- eMudhra 弱金鑰事件：中繼 CA 的私鑰可以從公開憑證直接算出來
- AI 滲透測試 orchestrator：把入侵流程拆給多個 AI agent 平行執行的開源框架
- kube-proxy 的 ipvs 模式排定移除，建議改用 nftables 模式
- Vault Client 正式推出：只含 Agent、Proxy 與部分 CLI 的用戶端專用版本
- Cloudflare 選用 QuePaxa：不必先偵測 leader 失效就能繼續前進的共識演算法

## 台灣 IT 重大事件

4 則。→ [完整內容](taiwan.md)

- 富邦媒（momo，8454）「mo店+」出貨資料遭未經授權存取，將預防性通知約 35 萬名顧客
- 鳳凰旅遊遭駭，部分訂單個資外洩，已出現冒名詐騙
- 大車隊（2640）子公司全球商務科技資訊系統遭未經授權存取，部分客戶資料遭擷取
- 路透：美國先進晶片出口新規 11-19 生效，台積電暫停中國客戶 16 奈米以下訂單

## 全世界 AI 新功能及重大事件

4 則。→ [完整內容](ai.md)

- Google 發表 Gemini 4 Neon：定位在 Carbon 與 Hydrogen 之間，主打軟體工程與複雜分析
- 美國多家大型銀行修改條款：客戶讓第三方 AI agent 操作帳戶，後果由客戶自負
- Anthropic 在 Nasdaq 掛牌，首日收在 97.17 美元，比發行價高約 17%
- 川普稱與習近平對 AI 監管有共識，將共同制定安全規範

## 清單維護

來源清單今天有修正（確認既有來源、換網址 8 筆、新增來源 4 筆），已送出並合併。→ [清單維護](maintenance.md)
