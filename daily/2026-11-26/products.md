# 產品動態｜2026-11-26

[← 今日摘要](README.md)｜[產品動態](products.md)｜[新知識](knowledge.md)｜[CVE](cve.md)｜[台灣 IT](taiwan.md)｜[AI](ai.md)｜[清單維護](maintenance.md)｜[26 項產品現況](../../products/README.md)

上一份晨報是 2026-11-25（補做，收的是來源發布日期在 2026-11-24（含）以前的項目），這一份是那之後、2026-11-25 發布的變化。26 項：有更新 2、無更新 22、無法確認 1、無公開來源 1。

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

### Rancher / RKE2：Rancher v2.15.4、v2.14.8、v2.13.12、v2.12.16 發布

→ [產品頁](../../products/rancher-rke2.md)

- 類別：新版本
- 內容：rancher/rancher 的 GitHub Releases 於 2026-11-25 列出 v2.15.4、v2.14.8、v2.13.12、v2.12.16 四個 patch 版本，SUSE 文件站也已有 v2.15.4 與 v2.12.16 的 release notes。文件站寫這兩版是 Prime 版本的維護更新與錯誤修正。v2.15.4 列出的變更：內建的 user 角色與 clusters-create 角色新增對 `turtles-capi.cattle.io` 的 capiproviders 資源的 get 與 list 權限；release notes 提醒有這個權限的人看得到 `.spec.variables` 的明文，憑證與敏感資料要放在 `.spec.credentials`。v2.12.16 的頁面沒有列出個別變更，只連到完整變更清單。v2.14.8 與 v2.13.12 的 release notes 沒有打開。Rancher 的安全公告清單今天沒有新的項目。
- 對我們的影響：例行的 patch 版本，沒有讀到安全修正。升 v2.15.4 之後，一般使用者看得到 CAPI provider 的設定，有用 Rancher Turtles 的客戶先確認 `.spec.variables` 裡沒有放密碼或金鑰。RKE2 今天沒有變動，文件站仍是 v1.37.2+rke2r1 與 v1.35.10+rke2r1。
- 來源：Rancher Manager v2.15.4 Release Notes：https://documentation.suse.com/cloudnative/rancher-manager/v2.15/en/release-notes/v2.15.4.html ；rancher/rancher Releases（2026-11-25）：https://github.com/rancher/rancher/releases

#### 今日無更新

22 項，名單與各產品目前的版本見 [26 項產品現況](../../products/README.md)。

#### 今日無法確認

1 項：

- Software Risk Manager (SRM)：文件入口頁 https://docs.blackduck.com/p/softwareriskmanagement 打得開，但 release notes 要登入才看得到，也沒有公開的安全公告頁。GitHub 上的部署用 Helm chart（codedx/srm-k8s）最新仍是 v1.91.0（2026-11-17），它只是 chart 的版本紀錄，看不到 SRM 本身改了什麼，所以無法判斷有沒有新版。

以下是個別來源或個別項目沒能確認，所屬產品的當天狀態不受影響，不算在上面的 1 項裡：

- CI/CD（Jenkins）：公告頁沒有列 CVSS 分數，各項的嚴重度沒有逐項核對，產品動態沒有寫。
- Rancher / RKE2：v2.14.8 與 v2.13.12 的 release notes 沒有打開；GitHub Releases 的內文是空的。
- Rancher / RKE2：SUSE 的 Rancher Security 頁打得開，頁面上沒有公告清單可比對；改讀 Rancher 文件站的安全頁與 GitHub 公告。
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

12 個工具逐一列在 [CI/CD 產品頁](../../products/cicd.md)，今天有更新的：Jenkins、GitLab；無法確認的：無。
