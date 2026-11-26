# 產品動態｜2026-11-27

[← 今日摘要](README.md)｜[產品動態](products.md)｜[新知識](knowledge.md)｜[CVE](cve.md)｜[台灣 IT](taiwan.md)｜[AI](ai.md)｜[清單維護](maintenance.md)｜[26 項產品現況](../../products/README.md)

上一份晨報是 2026-11-26，這一份是那之後的變化；其中 Quantum Safe Explorer (QSE) 一則是先前漏掉、今天補列的。26 項：有更新 3、無更新 21、無法確認 1、無公開來源 1。

### NKP：Nutanix 發布 Critical 公告 #0066（NGINX HTTP/2 兩個漏洞），NKP 2.17.x 到 2.19.x 受影響，修正版待公布

→ [產品頁](../../products/nkp.md)

- 類別：安全公告
- 內容：Nutanix Security Advisory #0066（Advisory ID nutanix-sa-066，Version 1.0），公告 PDF 寫 Published: November 25, 2026，公告清單上的日期是 Nov 26, 2026，兩處不一致，照實列出。內容是 NGINX 的兩個 HTTP/2 漏洞：CVE-2026-123007（HTTP/2 流量控制的 heap-based buffer overflow，CWE-787）與 CVE-2026-123633（特定反向代理與 worker 連線條件下，HTTP/2 連線管理的 use-after-free，CWE-416）。Nutanix 列的分數是 CVSS 4.0 為 9.2（Critical）、CVSS 3.1 為 8.1（High）；可從網路觸發，不需要驗證，也不需要使用者操作。
- 受影響：NKP 2.17.x、2.18.x、2.19.x（公告寫 2.16.x 與更舊的版本已 EOM）；另有 Foundation Central 1.x、2.x，NCM 2.1.x，NAI 2.8.x、2.7.x。公告列為不受影響的有 AHV、AOS、Prism Central、NDB、Nutanix Central、Flow 與 Flow Gateway、Objects、Files、NCC、Move、Data Lens、MSP、LCM。
- 修補與緩解：公告寫 Workaround 為「Under Investigation」，修正版本與日期為「Fix Version and Release Date Pending」；下一次更新預定 December 10, 2026。
- 同一批修訂的舊公告（都是先前晨報寫過的公告出了新版）：
  - #0061 改到 Version 1.3（Last Updated November 26, 2026；Brotli，CVE-2026-111497，CVSS 4.0 為 9.2）：這一版更新修正版本，AOS 與 Prism Central 的 7.5.2.x、7.6.1.x 預計 2026 年 12 月初；NKP 仍寫在 2.19.1 修正，NKP 2.18.x 待公布；下一次更新預定 December 3, 2026。
  - #0064 改到 Version 1.1（Last Updated November 25, 2026；OpenJDK「Java4Shell」，CVE-2026-114938、CVE-2026-114939、CVE-2026-114940、CVE-2026-114941、CVE-2026-114942）：AOS 與 Prism Central 的 7.5.2.x、7.6.0.x 修正版預計 2026 年 12 月；NKP 仍列為 Not Impacted。
  - #0063 改到 Version 1.1（CVE-2026-97631，「PXE Flaw」，CVSS 4.0 為 9.5）：NX 硬體韌體 G7、G10 預計 2027 年 1 月，G8、G9 待公布；NKP 列為 Not Impacted。
  - #0057 改到 Version 1.2（Apache CXF）：對象是 AOS 與 Prism Central，不是 NKP。
- 對我們的影響：有 NKP 的客戶目前沒有修正版可裝，也還沒有原廠緩解做法；先盤點 NKP 叢集上對外開放 HTTP/2 的 NGINX 入口，等 Nutanix 在 December 10, 2026 前後的更新。NKP 版本沒有變，產品更新頁最新仍是 2.19（2026-10-20），仍沒有看到 2.19.1 的發布公告。
- 無法確認：公告 PDF 是下載後轉成文字讀的，表格的欄位對應有一部分不能確定；NKP 裡是哪一個元件帶 NGINX，公告沒有寫。Confluent 的公告把同一組 NGINX 漏洞寫成別的編號寫法，各來源的編號照各自原文，沒有互相對照。
- 來源：https://download.nutanix.com/alerts/Security_Advisory_0066.pdf ；公告清單 https://portal.nutanix.com/page/security/security-advisories/list

### OpenShift：RHSA-2026:103542，DevWorkspace Operator 1.1.1 安全更新（Important，CVE-2026-78669）

→ [產品頁](../../products/openshift.md)

- 類別：安全公告
- 內容：Red Hat 於 2026-11-25 發布 RHSA-2026:103542「DevWorkspace Operator 1.1.1 release.」，類型 Security Advisory，嚴重度 Important（頁面寫 Issued: 2026-11-25、Updated: 2026-11-25；發布時間在上一份晨報蒐集之後）。DevWorkspace Operator 是裝在 OpenShift 上、提供 DevWorkspace 支援的 operator，公告寫從 OperatorHub 安裝在 OpenShift Container Platform 4.16 或更新的版本上。修的是 CVE-2026-78669：Go 的 net/http 與 golang.org/x/net/http2 在收到過量的 HTTP/2 SETTINGS frame 時會被耗盡資源（阻斷服務，CWE-770），Red Hat 評 Important，CVSS 3.1 為 7.5。
- 對我們的影響：只有裝了 DevWorkspace Operator 的叢集要把 operator 更新到 1.1.1；離線環境要先把新版 operator 映像鏡像進內部 registry。叢集本身沒有新版，最新 z-stream 仍是 5.0.1（RHSA-2026:94538，2026-11-09），Red Hat Security Bulletin 最上面仍是 RHSB-2026-021。
- 無法確認：Red Hat 的 CVE-2026-78669 頁面另外把 cert-manager Operator、Compliance Operator、ExternalDNS Operator、File Integrity Operator、Multicluster Engine 等列為 Affected，這些元件的修正版今天沒有逐一查。哪些 OpenShift 功能會連帶安裝 DevWorkspace Operator，公告頁沒有寫，請以叢集上實際安裝的 operator 清單為準。
- 來源：https://access.redhat.com/errata/RHSA-2026:103542 ；https://access.redhat.com/security/cve/CVE-2026-78669

### Quantum Safe Explorer (QSE)：2.3.3.1 已於 2026-10-23 發布（安全與穩定性修正），先前晨報漏列，今天補上

→ [產品頁](../../products/qse.md)

- 類別：修補
- 內容：IBM 文件站的 What's new 頁最上面一筆是「IBM Quantum Safe Explorer 2.3.3.1」，Release date: 23 October 2026（頁面 Last Updated 2026-10-26）。先前晨報記的最新版是 2.3.3（25 September 2026）。這一版頁面上只有一項內容：「Security and stability improvements」，寫修正了安全漏洞以提升整體安全與穩定性；fix pack 映像放在 IBM Passport Advantage 的 2.3.3.1 e-Assembly。頁面沒有列 CVE 編號與 CVSS 分數。
- 為什麼今天才寫：發布日是 2026-10-23，早於先前每一份晨報；先前的檢查沒有讀到這一筆，原因沒有查到（清單上登記的是 release notes 頁，今天讀到這一筆的是 What's new 頁）。這是補列，不是 2026-11-26 之後才發生的事。
- 對我們的影響：手上有 QSE 2.3.3 的 POC 或安裝環境可以排升級到 2.3.3.1；離線環境要先從 Passport Advantage 下載 2.3.3.1 的 e-Assembly。安裝文件與 POC 文件裡寫「最新版 2.3.3」的地方要改。
- 無法確認：2.3.3.1 修了哪些 CVE，頁面沒有寫。IBM 安全公告清單上 QSE 最新一筆 node/7293815 的日期也是 2026-10-23，它和 2.3.3.1 是不是同一件事，兩個頁面都沒有寫明。
- 來源：https://www.ibm.com/docs/en/quantum-safe/quantum-safe-explorer/2.x?topic=notes-whats-new

#### 今日無更新

21 項，名單與各產品目前的版本見 [26 項產品現況](../../products/README.md)。

#### 今日無法確認

1 項：

- Software Risk Manager (SRM)：文件入口頁 https://docs.blackduck.com/p/softwareriskmanagement 打得開，但 release notes 要登入才看得到，也沒有公開的安全公告頁。GitHub 上的部署用 Helm chart（codedx/srm-k8s）最新仍是 v1.91.0（2026-11-17），它只是 chart 的版本紀錄，看不到 SRM 本身改了什麼，所以無法判斷有沒有新版。

以下是個別來源或個別項目沒能確認，所屬產品的當天狀態不受影響，不算在上面的 1 項裡：

- NKP：公告 PDF 的表格欄位對應有一部分不能確定；NKP 裡是哪一個元件帶 NGINX，公告沒有寫。
- OpenShift：CVE-2026-78669 在其他 OpenShift operator 的修正版沒有逐一查。
- Quantum Safe Explorer (QSE)：2.3.3.1 修了哪些 CVE 頁面沒有寫；先前為什麼漏掉沒有查到。
- CI/CD（JFrog Artifactory）：release notes 頁的 SaaS 版號從 7.179.1 變成 7.180.1，頁面沒有讀到日期；Self-managed 仍是 7.173.27，不列為更新。
- Confluent Platform：安全公告清單最上面一筆沒有變，清單中段有沒有插入新的公告沒有逐筆比對。
- Rancher / RKE2：SUSE 的 Rancher Security 頁打得開，頁面上沒有公告清單可比對；改讀 Rancher 文件站的安全頁與 GitHub 公告。
- NeuVector：SUSE 文件站的 5.x release notes 舊網址今天仍回 404，改讀 NeuVector 自己的文件站與 GitHub。
- NeuVector：SUSE 的 Rancher Security 頁打得開，頁面上沒有公告清單可比對。
- JBoss EAP：Customer Portal 上的 8.1 Update 9.1 release notes 文章只讀標題與更新日期，內文需要訂閱，沒有讀。
- AppScan：仍沒有找到公開的安全公告頁。
- Seeker：仍沒有找到公開的安全公告頁。

#### 無公開來源

- CMC（IBM Certificate Management Console）：IBM Expert Labs 的資產，沒有公開的版本頁或公告頁，不列入檢查。

#### CI/CD 各工具狀態

12 個工具逐一列在 [CI/CD 產品頁](../../products/cicd.md)，今天有更新的：無；無法確認的：無。
