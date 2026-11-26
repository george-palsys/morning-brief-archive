# 產品動態｜2026-11-25

[← 今日摘要](README.md)｜[產品動態](products.md)｜[新知識](knowledge.md)｜[CVE](cve.md)｜[台灣 IT](taiwan.md)｜[AI](ai.md)｜[清單維護](maintenance.md)｜[26 項產品現況](../../products/README.md)

這一份是 2026-11-26 補做的：2026-11-25 凌晨因 AI 帳號用量上限沒有產出，內容取自 2026-11-26 02:00 的蒐集結果中、來源發布日期在 2026-11-24（含）以前的項目，沒有另外重新蒐集。26 項：有更新 6、無更新 18、無法確認 1、無公開來源 1。

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

18 項，名單與各產品目前的版本見 [26 項產品現況](../../products/README.md)。

#### 今日無法確認

1 項：

- Software Risk Manager (SRM)：文件入口頁 https://docs.blackduck.com/p/softwareriskmanagement 打得開，但 release notes 要登入才看得到，也沒有公開的安全公告頁。GitHub 上的部署用 Helm chart（codedx/srm-k8s）最新仍是 v1.91.0（2026-11-17），它只是 chart 的版本紀錄，看不到 SRM 本身改了什麼，所以無法判斷有沒有新版。

以下是個別來源或個別項目沒能確認，所屬產品的當天狀態不受影響，不算在上面的 1 項裡：

- CI/CD（JFrog Artifactory）：7.173.27 修了哪些漏洞要登入 MyJFrog 才看得到，沒有讀；SaaS 版的最新版號今天沒有讀到。
- Instana：node/7297963 的完整 CVE 清單沒有逐一抄錄。
- NKP：三份公告 PDF 的表格欄位對應有一部分不能確定；清單上 #0061 的日期（Nov 24）與 PDF 的 Last Updated（November 23）不一致。
- OpenShift：五張 RHBA 的內文沒有逐張打開。

#### 無公開來源

- CMC（IBM Certificate Management Console）：IBM Expert Labs 的資產，沒有公開的版本頁或公告頁，不列入檢查。

#### CI/CD 各工具狀態

12 個工具逐一列在 [CI/CD 產品頁](../../products/cicd.md)，今天有更新的：Argo CD、JFrog Artifactory；無法確認的：無。
