# 產品動態｜2026-11-22

[← 今日摘要](README.md)｜[產品動態](products.md)｜[新知識](knowledge.md)｜[CVE](cve.md)｜[台灣 IT](taiwan.md)｜[AI](ai.md)｜[清單維護](maintenance.md)｜[26 項產品現況](../../products/README.md)

### NeuVector：四則安全公告，兩則 Critical（CVE-2026-127182、CVE-2026-127183），修補版本 5.7.0、5.6.5、5.5.6

→ [產品頁](../../products/neuvector.md)

- 類別：安全公告
- 內容：
  - 發生什麼事：NeuVector 在 GitHub 的 Security Advisories 於 2026-11-20（UTC 22:36 到 22:37）一次發布四則公告，同時釋出修補版本 5.7.0、5.6.5、5.5.6。
  - GHSA-3x2m-c67v-vw77（CVE-2026-127182），Critical，CVSS 4.0 為 9.4（公告頁所列）：
    - 問題：DLP／WAF 規則的內容會讓 Enforcer dataplane 的 2048 byte 堆疊緩衝區溢位。
    - 利用條件：需要一個能寫入 DLP／WAF 設定的已登入帳號，包含只限單一 namespace 的 admin。
    - 後果：全叢集的 dataplane 當掉，公告寫可能可以執行程式碼。
    - 受影響版本：5.6.0 以上、5.6.5 之前；5.5.6 之前。
    - 修補版本：5.7.0、5.6.5、5.5.6。
    - 暫時緩解：公告寫沒有完整的替代做法，建議收緊能改 DLP／WAF 設定的權限，並稽核現有規則。
  - GHSA-v7m5-cp6v-m46h（CVE-2026-127183），Critical，CVSS 4.0 為 9.2（公告頁所列）：
    - 問題：dataplane 的四個記憶體安全缺陷，分別是 Kafka 解析器的越界讀取（未登入、只要網路可達就能觸發）、IPv6 的 use-after-free、TDS 解析的一個 byte 堆疊寫入、Proxymesh 的 NULL 指標解參考。
    - 後果：服務阻斷，Enforcer 失去防護能力。
    - 受影響版本：5.6.0 以上、5.6.5 之前；5.5.0 以上、5.5.6 之前。
    - 修補版本：5.7.0、5.6.5、5.5.6。
    - 暫時緩解：公告寫沒有。修正在 Enforcer 映像裡，公告特別寫明 air-gapped 與 Rancher 內建的 NeuVector 需要重新建置後的映像。
  - GHSA-x447-gqmh-6mcx（CVE-2026-127181），High，CVSS 4.0 為 7.2（公告頁所列）：
    - 問題：用 ephemeral container 可以繞過 admission control。
    - 修補版本：5.7.0、5.6.5、5.5.6。
    - 暫時緩解：限制 `pods/ephemeralcontainers` 的 RBAC，並啟用 Pod Security Admission。
  - GHSA-5cw8-qxqw-9j5w（CVE-2026-127180），Moderate，CVSS 4.0 為 4.1（公告頁所列）：
    - 問題：scanner 把 registry 帳密寫到 `/tmp`，而且所有使用者都讀得到。
    - 受影響版本：neuvector/scanner 4.330 之前。
    - 修補版本：neuvector/scanner 4.331。
    - 暫時緩解：registry 帳密只給最小權限，並輪替。
  - 是否已遭利用：四則公告頁都沒有看到已遭利用的說明。
- 對我們的影響：NeuVector 是我們的產品線，客戶多為離線環境。兩則 Critical 的修正都在 Enforcer 映像，離線客戶要把 5.7.0、5.6.5 或 5.5.6 的映像（含 scanner 4.331 以上）搬進私有 registry 再升級；Rancher 內建安裝的客戶要確認 chart 帶的映像版本。還沒排到升級的環境，先檢查誰有 DLP／WAF 設定的寫入權限，以及 `pods/ephemeralcontainers` 的 RBAC。
- 來源：
  - GHSA-3x2m-c67v-vw77（2026-11-20）：https://github.com/neuvector/neuvector/security/advisories/GHSA-3x2m-c67v-vw77
  - GHSA-v7m5-cp6v-m46h（2026-11-20）：https://github.com/neuvector/neuvector/security/advisories/GHSA-v7m5-cp6v-m46h
  - GHSA-x447-gqmh-6mcx（2026-11-20）：https://github.com/neuvector/neuvector/security/advisories/GHSA-x447-gqmh-6mcx
  - GHSA-5cw8-qxqw-9j5w（2026-11-20）：https://github.com/neuvector/neuvector/security/advisories/GHSA-5cw8-qxqw-9j5w

### NeuVector：5.7.0 新版本，同時釋出 5.6.5 與 5.5.6

→ [產品頁](../../products/neuvector.md)

- 類別：新版本
- 內容：
  - 版本與日期：v5.7.0，GitHub release 發布於 2026-11-20（UTC 17:40）；NeuVector 文件站的 release notes 寫「5.7.0 November 2026」。同時出現 v5.6.5 與 v5.5.6，這兩版的 release 時間我沒有記下，不寫。上一份晨報記錄的最新版是 5.6.4。
  - 重點變更（依文件站的 5.7.0 release notes）：
    - 映像掃描失敗時的錯誤訊息改善（NVSHAS-10316）。
    - Istio proxymesh 的流量改為比對上層 workload 的規則（NVSHAS-10304）。
    - webhook 通知支援驗證。
    - controller 新增 API，可以把 exposure report 送到 syslog。
    - gRPC 訊息大小可以調整。
    - controller、agent、monitor、dp 的 log 改為 JSON 格式。
    - 安全修正：sniffer 的 command injection、SAML audience confusion、JWT 登出繞過，以及上一則的四個 CVE。
  - 行為改變要注意：log 改為 JSON 格式，有收 NeuVector log 做解析的環境（syslog、SIEM 的解析規則）升級後要檢查。
- 對我們的影響：因為上一則的兩個 Critical，5.6 的客戶至少要到 5.6.5、5.5 的客戶至少要到 5.5.6；要不要直接上 5.7.0 看客戶是否接受新的 minor 版。SUSE 文件站的 5.x release notes 頁今天回 404，以上內容讀自 NeuVector 自己的文件站。
- 來源：
  - NeuVector v5.7.0 release（2026-11-20）：https://github.com/neuvector/neuvector/releases/tag/v5.7.0
  - NeuVector 5.x Release Notes（5.7.0，November 2026）：https://open-docs.neuvector.com/releasenotes/5x

### Concert：Security Bulletin 7297667，56 個 CVE，最高 CVSS 9.8，修補版本 Concert 3.1.0

→ [產品頁](../../products/concert.md)

- 類別：安全公告
- 內容：
  - 發生什麼事：IBM 在 2026-11-21 發布 Security Bulletin「Multiple Vulnerabilities in IBM Concert Software」，摘要寫這些漏洞已在 Concert Protect 3.1.0 與 Concert Platform 3.0.3 處理。
  - CVE：共 56 個。分數最高的幾個（分數與評分來源依公告所列）：
    - CVE-2026-96760：9.8（CISA ADP）。
    - CVE-2026-78663：9.1（CISA ADP）。
    - CVE-2026-114615：9.1（NVD）。
    - CVE-2026-114616：9.1（NVD）。
    - CVE-2026-116672：8.8（Authlib）。
    - CVE-2026-84304：8.7。
    - CVE-2026-5423：8.2（Neo4j）。
    - 其餘 49 個見公告原文，這裡沒有逐一抄錄。
  - 受影響版本：IBM Concert Software 1.0 到 3.0.1.1。
  - 修補版本：升級到 3.1.0（由 IBM Entitled Registry 取得）。
  - 暫時緩解：公告寫沒有。
  - 是否已遭利用：公告沒有提到。
- 對我們的影響：Concert 是我們的產品線。POC 或 lab 環境還在 3.0.1.1 以前的，要排升級到 3.1.0；離線環境要先把 3.1.0 的映像由 IBM Entitled Registry 鏡像進來。文件站目前的版本是 3.1.0.3（2026-11-06），已在 3.1.0 以上的環境這則不需要動作。
- 來源：Security Bulletin: Multiple Vulnerabilities in IBM Concert Software（2026-11-21）：https://www.ibm.com/support/pages/node/7297667

### NKP：Nutanix Security Advisory #0064（OpenJDK「Java4Shell」），NKP 列為不受影響

→ [產品頁](../../products/nkp.md)

- 類別：安全公告
- 內容：
  - 發生什麼事：Nutanix 發布 Security Advisory #0064，說明 OpenJDK 的 Java4Shell 系列漏洞對各產品的影響。PDF 寫發布日期 2026-11-20、版本 1.0，下一次更新預定 2026-11-25；公告列表顯示的日期是 2026-11-21。
  - CVE 與 CVSS（Nutanix 公告所列，CVSS 3.1）：
    - CVE-2026-114938：8.1（High）。
    - CVE-2026-114939：7.4。
    - CVE-2026-114940：7.4。
    - CVE-2026-114941：7.0。
    - CVE-2026-114942：7.0。
  - 不受影響：AHV、Flow、NAI、NKP、Move、Data Lens、NCM Self-Service、MSP、Foundation、LCM。
  - 受影響、修補版本待公布：AOS 7.5.x 與 7.6.x、Prism Central pc.7.5.x 與 pc.7.6.x、NDB、Objects、Files 5.4.x。
  - 調查中：NCC、Nutanix Central。
  - 同一個列表另有 #0063（2026-11-20，CVE-2026-97631「EDK II PXE Flaw」，CVSS 4.0 為 9.5、CVSS 3.1 為 8.8），影響 AHV 11.x、10.x 與 NX 韌體 G10 到 G7，不涉及 NKP。
- 對我們的影響：NKP 本身不需要動作。NKP 跑在 Nutanix 基礎架構上的客戶，底層的 AOS 與 Prism Central 列為受影響而且修補版本還沒出，要追 2026-11-25 的更新；AHV 另外看 #0063。NKP 的版本沒有變，仍是 2.19。
- 來源：
  - Nutanix Security Advisory #0064（2026-11-20）：https://download.nutanix.com/alerts/Security_Advisory_0064.pdf
  - Nutanix Security Advisories 列表：https://portal.nutanix.com/page/security/security-advisories/list

### OpenShift：七張 RHBA，各版本的 dpdk-base extras 映像更新，沒有新的 RHSA

→ [產品頁](../../products/openshift.md)

- 類別：修補
- 內容：
  - 發生什麼事：Red Hat 在 2026-11-21（UTC）發布七張 Bug Fix Advisory，標題都是「OpenShift Container Platform <版本> dpdk-base extras update」。
  - 逐張列出（版本依 errata 標題所寫）：
    - RHBA-2026:100984：OpenShift Container Platform 5.0。
    - RHBA-2026:100983：OpenShift Container Platform 4.20。
    - RHBA-2026:100982：OpenShift Container Platform 4.20。
    - RHBA-2026:100981：OpenShift Container Platform 4.22。
    - RHBA-2026:100980：OpenShift Container Platform 4.22。
    - RHBA-2026:100975：OpenShift Container Platform 5.1。
    - RHBA-2026:100908：OpenShift Container Platform 4.14。
  - 上一份晨報之後沒有新的 RHSA；Security Bulletin 列表最上面仍是 RHSB-2026-021；文件站的版本選單最上面仍是 5.0。
  - 沒有確認的部分：RHBA-2026:100975 的標題寫 5.1，但文件站還沒有 5.1；這幾張 errata 的內文我沒有逐張打開，修了什麼沒有讀到。
- 對我們的影響：dpdk-base 是給 DPDK 工作負載（多半是電信類的高速封包處理）當基底的映像，金融與公部門客戶一般用不到；有用到的重新拉映像或重新 build。昨天報的 RHSB-2026-021（Ruby2Shell）今天仍沒有對應的 RHSA。
- 來源：Red Hat Errata Search（OpenShift Container Platform，2026-11-21 的七張 RHBA）：https://access.redhat.com/errata-search/

#### 今日無更新

20 項，名單與各產品目前的版本見 [26 項產品現況](../../products/README.md)。

#### 今日無法確認

1 項：

- Software Risk Manager (SRM)：文件入口頁 https://docs.blackduck.com/p/softwareriskmanagement 打得開，但 release notes 的內容顯示要登入才能看，也沒有公開的安全公告頁，所以無法判斷有沒有新版。

以下是個別來源或個別項目沒能確認，所屬產品的當天狀態不受影響，不算在上面的 1 項裡：

- NeuVector：SUSE 文件站的 5.x release notes 頁今天回 404，改讀 NeuVector 自己的文件站與 GitHub。
- NeuVector：v5.6.5 與 v5.5.6 的 release 時間沒有記下。
- JBoss EAP：Customer Portal 上的 release notes 文章內容需要登入，只讀到標題。
- AppScan：仍沒有找到公開的安全公告頁。
- Seeker：仍沒有找到公開的安全公告頁。
- OpenShift：七張 RHBA 的內文沒有逐張打開。
- Concert：roadmap 頁今天沒有用瀏覽器重新打開；Security Bulletin 的 56 個 CVE 只抄錄分數最高的 7 個。
- Vault：HashiCorp 的 trust 頁今天沒有用瀏覽器重新打開。
- Quantum Safe Explorer (QSE)：單則安全公告頁今天沒有重新打開（改用 IBM 公告查詢確認，最新仍是 node/7293815）。

#### 無公開來源

- CMC（IBM Certificate Management Console）：IBM Expert Labs 的資產，沒有公開的版本頁或公告頁，不列入檢查。

#### CI/CD 各工具狀態

12 個工具逐一列在 [CI/CD 產品頁](../../products/cicd.md)，今天有更新的：無；無法確認的：無。
