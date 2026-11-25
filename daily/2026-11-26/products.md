# 產品動態｜2026-11-26

[← 今日摘要](README.md)｜[產品動態](products.md)｜[新知識](knowledge.md)｜[CVE](cve.md)｜[台灣 IT](taiwan.md)｜[AI](ai.md)｜[清單維護](maintenance.md)｜[26 項產品現況](../../products/README.md)

上一份晨報是 2026-11-24 02:20 蒐集的（11-25 沒有產出），這一份比對的是那之後的變化。26 項：有更新 7、無更新 17、無法確認 1、無公開來源 1。

### CI/CD/Jenkins：LTS 2.580.3 與 2026-11-25 安全公告，11 項外掛漏洞全數有修正版

→ [產品頁](../../products/cicd.md)

- 類別：安全公告、新版本
- 內容：Jenkins 於 2026-11-25 發布 LTS 2.580.3，changelog 列的是相依套件更新（asm v9.11.1、Node.js v24.22.2、spring-framework-bom v7.0.10、spring-security-bom v7.1.2、guava v33.8.0）。同一天發布 Jenkins Security Advisory 2026-11-25，內容全部是外掛，共 11 個 SECURITY 項目，公告寫每一項都有修正版：
  - SECURITY-4152（CVE-2026-136834）：Pipeline: Groovy 外掛的 sandbox 繞過，修正版 4403.4405.va_b_cdb_b_d0b_89f。
  - SECURITY-4278（CVE-2026-136835）：Script Security 外掛的 sandbox 繞過，是 SECURITY-3925 修補不完整，修正版 1436.1438.v3dc5ef7d16f2。
  - SECURITY-4075（CVE-2026-136836）：Gradle 外掛的 XXE，修正版 2.22.1283.v53b_41fe4cb_d9。
  - SECURITY-4325（CVE-2026-136837）：Warnings 外掛可執行任意程式碼，修正版 13.10365.10367.v2db_e2de17661。
  - SECURITY-4342（CVE-2026-136838、CVE-2026-136839）：Subversion 外掛的 SSRF。
  - SECURITY-4429（CVE-2026-136840）：Configuration as Code 外掛可讀取任意檔案，修正版 2148.v9d0c041b_a_13c。
  - SECURITY-4284（CVE-2026-136841）：Nested View 外掛。
  - SECURITY-4285（CVE-2026-136842）：Performance 外掛的 stored XSS，修正版 1025.ve64297f8ccb_c。
  - SECURITY-3912（CVE-2026-136843、CVE-2026-136844）：Spira Importer 外掛。
  - SECURITY-4251（CVE-2026-136845 到 CVE-2026-136853，共 9 個）：Pipeline DORA Metrics 外掛。
  - SECURITY-4449（CVE-2026-136854）：Rich Text Publisher 外掛的 stored XSS，修正版 1.6。
- 對我們的影響：Pipeline: Groovy 與 Script Security 幾乎每一套 Jenkins 都有裝，sandbox 繞過代表能改 Jenkinsfile 的人有機會在 controller 上執行程式碼，客戶的 Jenkins 應該把這兩個外掛排進最近一次維護。Configuration as Code、Warnings、Gradle、Subversion 有裝的一併更新。Jenkins core 這次沒有安全修正，LTS 2.580.3 可以照一般節奏升。離線環境要先把新版 .hpi 與相依外掛下載進內部更新站。公告頁沒有 CVSS 分數；公告沒有提到遭利用。
- 來源：Jenkins Security Advisory 2026-11-25（2026-11-25）：https://www.jenkins.io/security/advisory/2026-11-25/ ；Jenkins LTS Changelog（2.580.3，2026-11-25）：https://www.jenkins.io/changelog-stable/

### CI/CD/GitLab：Patch Release 19.6.2、19.5.9、19.4.11，修 13 個漏洞並把內附 NGINX 升到 1.31.9

→ [產品頁](../../products/cicd.md)

- 類別：安全公告
- 內容：GitLab 於 2026-11-25 發布 Patch Release 19.6.2、19.5.9、19.4.11，同時回補到 19.3.10、19.2.11、19.1.11、19.0.12、18.11.15。共 13 個安全修正，12 個 Medium、1 個 Low：CVE-2026-119452（CVSS 6.7）、CVE-2026-132156（6.5）、CVE-2026-132822（6.5）、CVE-2026-81336（6.5）、CVE-2026-131867（6.3）、CVE-2026-135221（6.3，EE 的 MCP server OAuth token endpoint SSRF）、CVE-2026-17194（5.7）、CVE-2026-132102、CVE-2026-16744、CVE-2026-107633、CVE-2026-132794、CVE-2026-129982、CVE-2026-135636（Low）。相依元件：Git 的 CVE-2026-105437 修補回補；gpgme gem 升到 2.0.27，修 GPGME 的 double free（CVE-2026-129975）；Linux 套件與 Docker 映像內附的 NGINX 在 19.6.2、19.5.9、19.4.11 升到 1.31.9。GitLab.com 已經是修補後的版本。
- 對我們的影響：自架 GitLab 的客戶依版本線升到 19.6.2、19.5.9 或 19.4.11。這一輪沒有 High 或 Critical，不算緊急；但 11-20 那一輪是 Critical Patch Release（19.6.1、19.5.8、19.4.10），還沒升的可以直接跳到這一版，一次補齊。離線環境要先同步新版套件或映像。
- 來源：GitLab Patch Release: 19.6.2, 19.5.9, 19.4.11（2026-11-25）：https://docs.gitlab.com/releases/patches/patch-release-gitlab-19-6-2-released/

### CI/CD/Argo CD：v3.6.3、v3.5.9、v3.4.15 修 7 個漏洞，4 個列為 High

→ [產品頁](../../products/cicd.md)

- 類別：安全公告
- 內容：Argo CD 於 2026-11-24 發布 v3.6.3、v3.5.9、v3.4.15，release notes 列出 7 個安全修正，都沒有 CVE 編號：
  - GHSA-mfgm-4p7x-3ccr（High）：建立 repository 時帶 upsert，沒有 update 權限也能覆寫既有設定。
  - GHSA-w7rw-fg89-2cjf（High）：一個未經驗證的請求就能讓 API server 當掉。
  - GHSA-rxm8-qc6h-3c8h（High）：Helm chart 的 home 連結造成 stored XSS。
  - GHSA-rvmf-gjc9-wjgq（High）：ApplicationSet 的刪除 API 沒有檢查允許的 namespace。
  - GHSA-q4f6-wc8m-r246（Moderate）：Bitbucket Cloud webhook 會把已儲存的 repository 憑證送到 payload 指定的主機。
  - GHSA-v2hj-322q-6cg4（Moderate）：Helm release name 被當成 template 執行。
  - GHSA-8cfq-7w4v-ggm3（Moderate）：含 SSO 密鑰的 Dex 設定檔所有人可讀。
  受影響範圍寫 `>= 3.0.0, < 3.4.15 || >= 3.5.0, < 3.5.9 || >= 3.6.0, < 3.6.3`。升級要注意一個可能破壞相容性的變更：Helm release name 改成照字面傳入，必須是合法名稱（小寫字母、數字、`-`、`.`，最長 53 個字元）。
- 對我們的影響：直接用上游 Argo CD 的客戶依版本線升級，API server 對外可達的優先（GHSA-w7rw-fg89-2cjf 不需要登入）。升級前先檢查 Application 的 Helm release name 有沒有用到 template 語法或不合法字元。用 OpenShift GitOps 的客戶要等 Red Hat 的對應版本，今天 OpenShift GitOps 沒有新的 errata，仍是 1.22.4。
- 來源：argoproj/argo-cd Release v3.6.3（2026-11-24）：https://github.com/argoproj/argo-cd/releases/tag/v3.6.3

### CI/CD/JFrog Artifactory：Self-Managed 7.173.27 含安全修正，原廠建議升級

→ [產品頁](../../products/cicd.md)

- 類別：安全公告
- 內容：JFrog 的 release notes 列出 Artifactory 7.173.27 Self-Managed，Released: 24 November 2026，說明寫這個 patch 含安全性錯誤修正，強烈建議升級。修了哪些漏洞要登入 MyJFrog 才看得到，沒有讀。
- 對我們的影響：自架 Artifactory 7.173 版本線的客戶可以排升級到 7.173.27；修的是什麼、嚴重度多高，要由有 MyJFrog 帳號的人登入確認後再決定急不急。
- 來源：Artifactory Release Notes（7.173.27，2026-11-24）：https://docs.jfrog.com/releases/docs/artifactory-release-notes

### Instana：IBM 安全公告，自架版 build 1.0.285 到 1.0.327 受影響，修在 1.0.329

→ [產品頁](../../products/instana.md)

- 類別：安全公告
- 內容：IBM 於 2026-11-24 發布安全公告 node/7297963「Multiple vulnerabilities in IBM Observability with Instana (OnPrem)」，寫多個漏洞已在 build 1.0.329 處理，受影響的是 Build 1.0.285 到 1.0.327，公告清單上的嚴重度是 High。公告列出的 CVE 包括 CVE-2023-4860（Chrome 的 Skia，CVSS 9.6，分數來源 NVD）、CVE-2024-7966（CVSS 8.8，分數來源 CISA ADP）、CVE-2026-9998（Skia 整數溢位，Chrome 148.0.7778.216 之前的版本）。完整的 CVE 清單沒有逐一抄錄。
- 對我們的影響：自架（Self-Hosted）Instana 的客戶確認後端 build 是不是 1.0.329；還在 1.0.327 或更舊的排升級。SaaS 客戶不用動作。這幾個是內含 Chromium 元件的漏洞，公告沒有寫在 Instana 裡怎麼被觸發。
- 來源：IBM Security Bulletin node/7297963（2026-11-24）：https://www.ibm.com/support/pages/node/7297963

### Rancher / RKE2：Rancher v2.15.4、v2.14.8、v2.13.12、v2.12.16 發布

→ [產品頁](../../products/rancher-rke2.md)

- 類別：新版本
- 內容：rancher/rancher 的 GitHub Releases 於 2026-11-25 列出 v2.15.4、v2.14.8、v2.13.12、v2.12.16 四個 patch 版本，SUSE 文件站也已有 v2.15.4 與 v2.12.16 的 release notes。文件站寫這兩版是 Prime 版本的維護更新與錯誤修正。v2.15.4 列出的變更：內建的 user 角色與 clusters-create 角色新增對 `turtles-capi.cattle.io` 的 capiproviders 資源的 get 與 list 權限；release notes 提醒有這個權限的人看得到 `.spec.variables` 的明文，憑證與敏感資料要放在 `.spec.credentials`。v2.12.16 的頁面沒有列出個別變更，只連到完整變更清單。v2.14.8 與 v2.13.12 的 release notes 沒有打開。Rancher 的安全公告清單今天沒有新的項目。
- 對我們的影響：例行的 patch 版本，沒有讀到安全修正。升 v2.15.4 之後，一般使用者看得到 CAPI provider 的設定，有用 Rancher Turtles 的客戶先確認 `.spec.variables` 裡沒有放密碼或金鑰。RKE2 今天沒有變動，文件站仍是 v1.37.2+rke2r1 與 v1.35.10+rke2r1。
- 來源：Rancher Manager v2.15.4 Release Notes：https://documentation.suse.com/cloudnative/rancher-manager/v2.15/en/release-notes/v2.15.4.html ；rancher/rancher Releases（2026-11-25）：https://github.com/rancher/rancher/releases

### NKP：Nutanix 更新兩則 Critical 公告，#0061 寫 NKP 修正版是 2.19.1

→ [產品頁](../../products/nkp.md)

- 類別：安全公告
- 內容：Nutanix 安全公告清單最上面三筆換成：
  - #0061（Critical，清單日期 Nov 24, 2026，舊公告更新）：CVE-2026-111497，Brotli 解碼器越界寫入，CVSS 4.0 為 9.2。公告 PDF 寫 Published October 30, 2026、Last Updated November 23, 2026、Version 1.2；NKP 2.17.x、2.18.x、2.19.x 與已 EOM 的 2.15.2 列為受影響，寫「Fixed in NKP 2.19.1」，NKP 2.18.x 的修正待公布；並寫在其檢視的來源中沒有確認到遭利用。
  - #0065（High，Nov 24, 2026，新公告）：CVE-2026-123158，OpenSSH 驗證繞過，CVSS 3.1 為 8.1，影響 NCM 2.1.x，NKP 列為 Not Impacted。
  - #0060（Critical，Nov 23, 2026，舊公告更新）：eMudhra 中繼 CA 不再受信任的相關處置，CVE-2026-91403（9.1）、CVE-2026-114820（9.1）、CVE-2026-114406（6.8）、CVE-2026-111943（6.8），NKP 2.17.x 到 2.19.x 有列入，修正大多待公布。
  這三份 PDF 是下載後抽取文字讀的，表格的欄位對應有一部分不能確定。Nutanix 的產品更新頁最新仍是 NKP 2.19，沒有看到 2.19.1 的發布公告。
- 對我們的影響：NKP 2.19.x 的客戶留意 2.19.1 什麼時候可以下載，到時排升級補 CVE-2026-111497；2.18.x 的修正還沒有版本。下載與版本資訊要由有 Nutanix 入口網站帳號的人確認，公告表格裡各版本的對應請以原文為準。
- 來源：Nutanix Security Advisories（#0061、#0065、#0060，2026-11-23 與 2026-11-24）：https://portal.nutanix.com/page/security/security-advisories/list

### Confluent Platform：CONFSA-2026-38，Confluent Manager for Apache Flink 的驗證與授權繞過（補列）

→ [產品頁](../../products/confluent-platform.md)

- 類別：安全公告
- 內容：Confluent 的公告 CONFSA-2026-38「Confluent Platform Vulnerability: Authentication and Authorization Bypass in Confluent Manager for Apache Flink」，頁面寫 Published November 19, 2026 09:30 AM PST。受影響的是 Confluent Manager for Apache Flink（CMF）2.4.0 到 2.4.4 與 2.5.0，條件是使用遠端 MDS，而且 CMF 與 MDS 之間用 mTLS；修正版 2.4.5 與 2.5.1；CVSS 3.1 為 8.8；沒有 CVE 編號；Confluent Cloud 不受影響。這則公告發布在上一份晨報之前，當時只比對清單最上面一筆，它不在最上面所以漏掉，今天補列。
- 對我們的影響：只有部署了 Confluent Manager for Apache Flink 的客戶受影響，把 CMF 升到 2.4.5 或 2.5.1。只用 Kafka broker、Connect、Schema Registry 的環境不在這則公告範圍內。Confluent Platform 本身的版本沒有變，仍是 8.4.1。
- 來源：CONFSA-2026-38（2026-11-19）：https://support.confluent.io/hc/en-us/articles/54012122578068-CONFSA-2026-38-Confluent-Platform-Vulnerability-Authentication-and-Authorization-Bypass-in-Con

### Palsys One：HCL AppScan on Cloud 的 DAST 引擎升到 10.13.0，加入 MCP 自動掃描

→ [產品頁](../../products/palsys-one.md)

- 類別：新版本
- 內容：HCL AppScan on Cloud 的 What's new 新增兩段。「New on November 24, 2026」：DAST 引擎更新到 10.13.0，加入自動 MCP 掃描（用最新版 AppScan Standard 產生的掃描範本 `.scant`）、發現 MCP server 時回報一筆 informational 等級的 issue、啟用 AI provider 時可用 AI 自動登入、擴充 TLS 1.3 的後量子密碼就緒檢查。「New on November 23, 2026」：IAST 的 Java agent 1.23.5 加入 Java4Shell 的偵測。
- 對我們的影響：Palsys One 底層是 AppScan on Cloud，客戶的動態掃描會用到新引擎，不用另外動作。可以拿來向客戶說明的有兩點：受測應用如果對外開了 MCP server，掃描結果會多一筆提示；TLS 1.3 的後量子就緒檢查和 QSE、GCM 的盤點題目可以互相對照。地端的 AppScan Standard、Enterprise 仍是 10.12.1，沒有變動。
- 來源：HCL AppScan on Cloud What's new（New on November 24, 2026）：https://help.hcl-software.com/appscan/ASoC/appseccloud_whats_new_cm.html

### OpenShift：五張 RHBA，5.0 的 openperouter-operator extras 與 4.19 的 Helm 修補版

→ [產品頁](../../products/openshift.md)

- 類別：修補
- 內容：Red Hat 於 2026-11-24（UTC）發布五張 Bug Fix Advisory：RHBA-2026:103409、RHBA-2026:103404、RHBA-2026:103403、RHBA-2026:103390，四張標題都是「OpenShift Container Platform 5.0 openperouter-operator extras update」；RHBA-2026:100495，標題是「Advisory for publishing Helm 3.20.2.4 CVE fix release for OCP 4.19」。沒有新的 RHSA，文件站的最新 z-stream 仍是 5.0.1。五張 errata 只讀了標題與發布時間，內文沒有逐張打開，Helm 那一張修的是哪個 CVE 沒有讀到。
- 對我們的影響：例行的映像更新，叢集本身不用動。openperouter-operator 是選用的網路 operator，有用到的更新 operator；OCP 4.19 的客戶如果用 Red Hat 提供的 Helm CLI，可以換成 3.20.2.4。
- 來源：Red Hat Errata Search（OpenShift Container Platform，2026-11-24 的五張 RHBA）：https://access.redhat.com/errata-search/

#### 今日無更新

17 項，名單與各產品目前的版本見 [26 項產品現況](../../products/README.md)。

#### 今日無法確認

1 項：

- Software Risk Manager (SRM)：文件入口頁 https://docs.blackduck.com/p/softwareriskmanagement 打得開，但 release notes 要登入才看得到，也沒有公開的安全公告頁。GitHub 上的部署用 Helm chart（codedx/srm-k8s）最新仍是 v1.91.0（2026-11-17），它只是 chart 的版本紀錄，看不到 SRM 本身改了什麼，所以無法判斷有沒有新版。

以下是個別來源或個別項目沒能確認，所屬產品的當天狀態不受影響，不算在上面的 1 項裡：

- CI/CD（JFrog Artifactory）：7.173.27 修了哪些漏洞要登入 MyJFrog 才看得到，沒有讀；SaaS 版的最新版號今天沒有讀到。
- CI/CD（Jenkins）：公告頁沒有列 CVSS 分數，各項的嚴重度沒有逐項核對，產品動態沒有寫。
- Instana：node/7297963 的完整 CVE 清單沒有逐一抄錄。
- Rancher / RKE2：v2.14.8 與 v2.13.12 的 release notes 沒有打開；GitHub Releases 的內文是空的。
- Rancher / RKE2：SUSE 的 Rancher Security 頁打得開，頁面上沒有公告清單可比對；改讀 Rancher 文件站的安全頁與 GitHub 公告。
- NKP：三份公告 PDF 的表格欄位對應有一部分不能確定；清單上 #0061 的日期（Nov 24）與 PDF 的 Last Updated（November 23）不一致。
- OpenShift：五張 RHBA 的內文沒有逐張打開。
- Coverity：2026.9.1 release notes 頁的 Last Updated 從 11/23/2026 變成 11/24/2026，版本仍是 2026.9.1，頁面改了什麼沒有讀到。
- Coverity：Polaris release notes 頁的 Last Updated 從 11/19/2026 變成 11/25/2026，最新一段仍是 November 2026，哪幾項是新加的無法判斷。
- NeuVector：SUSE 文件站的 5.x release notes 舊網址今天仍回 404，改讀 NeuVector 自己的文件站與 GitHub。
- NeuVector：SUSE 的 Rancher Security 頁打得開，頁面上沒有公告清單可比對。
- JBoss EAP：Customer Portal 上的 8.1 Update 9.1 release notes 文章只讀標題與更新日期，內文需要訂閱，沒有讀。
- AppScan：仍沒有找到公開的安全公告頁。
- Seeker：仍沒有找到公開的安全公告頁。
- Concert：roadmap 頁打得開，沒有讀到帶日期的項目。

#### 無公開來源

- CMC（IBM Certificate Management Console）：IBM Expert Labs 的資產，沒有公開的版本頁或公告頁，不列入檢查。

#### CI/CD 各工具狀態

12 個工具逐一列在 [CI/CD 產品頁](../../products/cicd.md)，今天有更新的：Jenkins、GitLab、Argo CD、JFrog Artifactory；無法確認的：無。
