# 產品動態｜2026-11-24

[← 今日摘要](README.md)｜[產品動態](products.md)｜[新知識](knowledge.md)｜[CVE](cve.md)｜[台灣 IT](taiwan.md)｜[AI](ai.md)｜[清單維護](maintenance.md)｜[26 項產品現況](../../products/README.md)

### CI/CD/OpenShift GitOps：三張 RHSA（2026-11-23），v1.22.4、v1.21.8、v1.20.12 安全更新，CVE 清單含 mod_http2 的 CVE-2026-119618

→ [產品頁](../../products/cicd.md)

- 類別：安全公告
- 內容：
  - 發生什麼事：Red Hat 在 2026-11-23（UTC 16:49 到 17:07）對 OpenShift GitOps 仍在支援的三條版本線各發布一張 Security Advisory，三張的 CVE 清單相同。
  - 逐張列出：
    - RHSA-2026:102591：Red Hat OpenShift GitOps v1.22.4 security update（2026-11-23）。
    - RHSA-2026:102593：Red Hat OpenShift GitOps v1.21.8 security update（2026-11-23）。
    - RHSA-2026:102596：Red Hat OpenShift GitOps v1.20.12 security update（2026-11-23）。
  - 嚴重度：三張 errata 的標題都寫 Important；Red Hat 搜尋結果的嚴重度欄位顯示 Critical。兩個寫法不一致，照來源各自列出。
  - CVE（5 個，嚴重度與 CVSS 都出自 Red Hat 的 CVE 資料）：
    - CVE-2026-119618：Apache HTTP Server 的 mod_http2 遠端執行程式碼。Critical，CVSS 3.1 為 9.8。Red Hat 的 CVE 資料把 OpenShift GitOps 的 `openshift-gitops-1/console-plugin-rhel9` 映像列為 Affected。這個漏洞的利用現況見今天的 [CVE](cve.md)，機制見今天的[新知識](knowledge.md)。
    - CVE-2025-61560：Argo CD 的 SessionManager 有競爭條件，可以繞過登入的頻率限制進行暴力猜測。Important，CVSS 3.1 為 8.1。
    - CVE-2026-116591：Go 的壓縮程式庫 klauspost/compress 處理特製的 zstd 壓縮資料時會 panic（阻斷服務）。Important，CVSS 3.1 為 7.5。
    - CVE-2026-78659：Go 的 net/http 在 HTTP/2 收到宣告大量欄位的 `Trailer` 標頭時耗盡記憶體（阻斷服務）。Moderate，CVSS 3.1 為 7.5。
    - CVE-2026-78660：Go 的 net/http 當反向代理時，HTTP/2 格式錯誤的 framing 標頭可造成 HTTP response smuggling。Moderate，CVSS 3.1 為 7.5。
  - 受影響版本與修補版本：1.22 線升到 v1.22.4、1.21 線升到 v1.21.8、1.20 線升到 v1.20.12。errata 沒有另外寫受影響的版本範圍。
  - 暫時緩解做法：errata 的說明只寫套用更新，沒有列緩解做法。
  - 是否已遭利用：errata 沒有寫。CVE-2026-119618 另有新加坡 CSA 的警示寫已遭利用（見今天的 [CVE](cve.md)）；其餘 4 個未查到遭利用的報告。
  - 沒有確認的部分：
    - 三張 errata 的網頁沒有逐張打開，讀的是 Red Hat 搜尋結果裡的標題、發布時間、CVE 清單與說明欄；說明欄只有一句「An update is now available for Red Hat OpenShift GitOps.」，每個 CVE 修在哪一個映像沒有讀到。
    - Red Hat 的 CVE 資料在我查看時（2026-11-24）還沒有把這三張 errata 列進 CVE-2026-119618、CVE-2026-116591、CVE-2026-78659、CVE-2026-78660 的已修補清單，OpenShift GitOps 的狀態仍是 Affected。
    - OpenShift GitOps 文件站的 release notes 今天仍只列到 1.22.3，還沒有 1.22.4 的說明。
- 對我們的影響：有用 OpenShift GitOps 的客戶，請依所在的版本線排升級，1.22 線到 v1.22.4、1.21 線到 v1.21.8、1.20 線到 v1.20.12。OpenShift GitOps 是 Operator，升級方式依訂閱的 channel 與核准設定而定。五個 CVE 裡最需要注意的是 CVE-2026-119618，它已有遭利用的警示，受影響的是 GitOps 的 console plugin 映像。離線（air-gapped）環境要先把新版的 operator 與映像鏡像進內部 registry。CI/CD 其餘 11 個工具今天沒有更新。
- 來源：
  - Red Hat Errata RHSA-2026:102591（2026-11-23）：https://access.redhat.com/errata/RHSA-2026:102591
  - Red Hat Errata RHSA-2026:102593（2026-11-23）：https://access.redhat.com/errata/RHSA-2026:102593
  - Red Hat Errata RHSA-2026:102596（2026-11-23）：https://access.redhat.com/errata/RHSA-2026:102596
  - Red Hat CVE 頁 CVE-2026-119618（2026-11-11 公開）：https://access.redhat.com/security/cve/CVE-2026-119618
  - Red Hat CVE 頁 CVE-2025-61560（2026-10-09 公開）：https://access.redhat.com/security/cve/CVE-2025-61560
  - Red Hat CVE 頁 CVE-2026-116591（2026-10-26 公開）：https://access.redhat.com/security/cve/CVE-2026-116591
  - Red Hat CVE 頁 CVE-2026-78659（2026-10-08 公開）：https://access.redhat.com/security/cve/CVE-2026-78659
  - Red Hat CVE 頁 CVE-2026-78660（2026-10-08 公開）：https://access.redhat.com/security/cve/CVE-2026-78660

### WebSphere Liberty：7 月的安全公告 CVE-2026-16192（restConnector 阻斷服務）在公告清單上的日期變成 2026-11-23，修正版本仍是 26.0.0.9

→ [產品頁](../../products/websphere-liberty.md)

- 類別：安全公告
- 內容：
  - 發生什麼事：IBM 安全公告查詢的第一筆變成「IBM WebSphere Application Server Liberty is affected by a denial of service (CVE-2026-16192)」（node/7281648），清單上的日期是 2026-11-23。這不是新漏洞：公告頁的 Change History 寫 28 Jul 2026 Initial Publication、11 Aug 2026 Added interim fixes for Liberty 26.0.0.8，沒有 11 月的紀錄。
  - CVE 編號：CVE-2026-16192。
  - 嚴重度與 CVSS：CVSS 3.1 為 7.1，評分來源是 IBM；向量 CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:L/I:N/A:H；CWE-674（Uncontrolled Recursion）。
  - 受影響版本：IBM WebSphere Application Server Liberty 17.0.0.3 到 26.0.0.8，啟用 restConnector-2.0 feature 時受影響；修補段落寫的是使用 restConnector-1.0 或 restConnector-2.0 的環境。
  - 修補版本：套用 APAR DT496294 的 interim fix，或升級到 Liberty Fix Pack 26.0.0.9 或更新版本。目前最新的 fix pack 是 26.0.0.11。
  - 暫時緩解做法：公告寫 None。
  - 是否已遭利用：公告沒有寫，未查到。
  - 沒有確認的部分：公告在 2026-11-23 改了哪些內容沒有查到，Change History 沒有對應的紀錄。公告頁仍寫 26.0.0.9 的「targeted availability 3Q2026」，這段文字沒有更新。
- 對我們的影響：客戶的 Liberty 已經在 26.0.0.9 或更新版本的不用動作。還在 26.0.0.8 或更舊、而且 `server.xml` 啟用了 restConnector-1.0 或 restConnector-2.0 的，要套 interim fix 或升級；restConnector 是 Liberty 的管理用 REST 連接器，admin center 與 JMX 遠端管理會用到。這則公告的產品欄寫的是 WebSphere Application Server，但受影響的只有 Liberty，所以 WebSphere Application Server（傳統版）今天仍列為無更新。
- 來源：IBM Security Bulletin「IBM WebSphere Application Server Liberty is affected by a denial of service (CVE-2026-16192)」（初次發布 2026-07-28，清單日期 2026-11-23）：https://www.ibm.com/support/pages/node/7281648

### OpenShift：六張 RHBA（2026-11-23），4.12、4.21、4.22、5.0 的 dpdk-base 與 openperouter-operator extras 映像更新，沒有新的 RHSA

→ [產品頁](../../products/openshift.md)

- 類別：新版本
- 內容：
  - 發生什麼事：Red Hat 在 2026-11-23（UTC 03:13 到 13:52）發布六張 Bug Fix Advisory，嚴重度欄位為 None。四張的標題是「OpenShift Container Platform <版本> dpdk-base extras update」，兩張是「OpenShift Container Platform <版本> openperouter-operator extras update」。
  - 逐張列出（版本依 errata 標題所寫）：
    - RHBA-2026:102338：OpenShift Container Platform 4.22，openperouter-operator extras。
    - RHBA-2026:102289：OpenShift Container Platform 5.0，openperouter-operator extras。
    - RHBA-2026:102206：OpenShift Container Platform 5.0，dpdk-base extras。
    - RHBA-2026:102203：OpenShift Container Platform 4.22，dpdk-base extras。
    - RHBA-2026:102202：OpenShift Container Platform 4.12，dpdk-base extras。
    - RHBA-2026:102201：OpenShift Container Platform 4.21，dpdk-base extras。
  - 上一份晨報之後沒有 OpenShift Container Platform 的新 RHSA；最新的 z-stream 仍是 5.0.1（RHSA-2026:94538）；Security Bulletin 列表最上面仍是 RHSB-2026-021；文件站的版本選單最上面仍是 5.0。
  - 沒有確認的部分：這六張 errata 的內文沒有逐張打開，修了什麼沒有讀到。
- 對我們的影響：和前三天的 dpdk-base 更新是同一類的例行映像更新，叢集本身不用動。dpdk-base 是給 DPDK 工作負載當基底的映像，openperouter-operator 是選用的網路 operator，金融與公部門客戶一般用不到；有用到的重新拉映像或更新 operator。
- 來源：Red Hat Errata Search（OpenShift Container Platform，2026-11-23 的六張 RHBA）：https://access.redhat.com/errata-search/

#### 今日無更新

21 項，名單與各產品目前的版本見 [26 項產品現況](../../products/README.md)。

#### 今日無法確認

1 項：

- Software Risk Manager (SRM)：文件入口頁 https://docs.blackduck.com/p/softwareriskmanagement 打得開，但頁面上找不到公開的 release notes 或版本號（頁面上方寫要登入才看得到 release notes 內容），也沒有公開的安全公告頁，所以無法判斷有沒有新版。

以下是個別來源或個別項目沒能確認，所屬產品的當天狀態不受影響，不算在上面的 1 項裡：

- CI/CD（OpenShift GitOps）：三張 RHSA 的網頁沒有逐張打開；每個 CVE 修在哪一個映像沒有讀到。
- WebSphere Liberty：node/7281648 在 2026-11-23 改了哪些內容沒有查到。
- OpenShift：六張 RHBA 的內文沒有逐張打開。
- Coverity：2026.9.1 release notes 頁的 Last Updated 從 11-19 變成 11/23/2026，版本仍是 2026.9.1，頁面改了什麼沒有讀到。
- NeuVector：SUSE 文件站的 5.x release notes 舊網址今天仍回 404，改讀 NeuVector 自己的文件站與 GitHub。
- NeuVector：SUSE 的 Rancher Security 頁今天打得開，頁面上沒有公告清單可比對。
- Rancher / RKE2：SUSE 的 Rancher Security 頁今天打得開，頁面上沒有公告清單可比對；改讀 Rancher 文件站的安全頁與 GitHub 公告。
- JBoss EAP：Customer Portal 上的 8.1 Update 9.1 release notes 文章只讀標題與更新日期，內文需要訂閱，沒有讀。
- AppScan：仍沒有找到公開的安全公告頁。
- Seeker：仍沒有找到公開的安全公告頁。
- Concert：roadmap 頁今天打得開，沒有讀到帶日期的項目。
- Guardium Cryptography Manager (GCM)：release notes 頁讀到的版本仍是 2.0.0，What's new 子頁今天沒有打開。

#### 無公開來源

- CMC（IBM Certificate Management Console）：IBM Expert Labs 的資產，沒有公開的版本頁或公告頁，不列入檢查。

#### CI/CD 各工具狀態

12 個工具逐一列在 [CI/CD 產品頁](../../products/cicd.md)，今天有更新的：OpenShift GitOps；無法確認的：無。
