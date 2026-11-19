# 清單維護｜2026-11-19

[← 今日摘要](README.md)｜[產品動態](products.md)｜[新知識](knowledge.md)｜[CVE](cve.md)｜[台灣 IT](taiwan.md)｜[AI](ai.md)｜[清單維護](maintenance.md)｜[26 項產品現況](../../products/README.md)

這次是演練，沒有對 GitHub 做任何寫入，下面各項都沒有送 PR。

### 確認可用的 `unverified`、`searched`、`repo_checked` 網址

- Jenkins：https://www.jenkins.io/security/advisories/
- GitHub Actions：https://github.blog/changelog/
- GitHub Actions：https://github.com/actions/runner/releases
- Tekton：https://github.com/tektoncd/pipeline/releases
- Tekton：https://github.com/tektoncd/pipeline/security/advisories
- Argo CD：https://github.com/argoproj/argo-cd/releases
- Argo CD：https://github.com/argoproj/argo-cd/security/advisories
- Flux：https://github.com/fluxcd/flux2/releases
- Flux：https://github.com/fluxcd/flux2/security/advisories
- Harbor：https://github.com/goharbor/harbor/releases
- Harbor：https://github.com/goharbor/harbor/security/advisories
- Sonatype Nexus Repository：https://help.sonatype.com/en/release-notes.html
- NeuVector：https://github.com/neuvector/neuvector/security/advisories
- Confluent Platform：https://docs.confluent.io/platform/current/release-notes/index.html
- Red Hat Security Bulletins（共用來源）：https://access.redhat.com/security/vulnerabilities/
- CISA KEV（共用來源）：https://www.cisa.gov/known-exploited-vulnerabilities-catalog
- MQ：https://www.ibm.com/docs/en/ibm-mq/10.0.x?topic=am-whats-new-changed-in-mq-100x-continuous-delivery

### 已失效或改版的網址

- IBM 安全公告入口（共用來源）：舊 https://www.ibm.com/trust/security-psirt ，建議新 https://www.ibm.com/support/pages/bulletin/ （IBM Product Security Central，有公告清單與搜尋）
- IBM Security Vulnerability Management（共用來源）：舊 https://www.ibm.com/support/pages/ibm-security-vulnerability-management ，建議新 https://www.ibm.com/support/pages/bulletin/
- Red Hat Product Errata（共用來源）：舊 https://access.redhat.com/errata/ ，轉到 https://access.redhat.com/errata-search/
- GitLab：舊 https://about.gitlab.com/releases/categories/releases/ ，轉到 https://docs.gitlab.com/releases/
- Azure DevOps：舊 https://learn.microsoft.com/en-us/azure/devops/server/release-notes/ （轉到 2020 版的頁面），建議新 https://learn.microsoft.com/en-us/azure/devops/server/release-notes/azuredevopsserver?view=azure-devops
- JFrog Artifactory：舊 https://jfrog.com/help/r/jfrog-release-information/artifactory-release-notes ，轉到 https://docs.jfrog.com/releases/docs/artifactory-release-notes
- Turbonomic：舊 https://community.ibm.com/community/user/aiops/viewdocument/turbonomic-latest-releases-downlo ，轉到 https://community.ibm.com/community/user/viewdocument/turbonomic-latest-releases-downlo
- Vault：舊 https://discuss.hashicorp.com/c/security ，轉到 https://discuss.hashicorp.com/c/security/52
- NKP：舊 https://portal.nutanix.com/page/documents/security-advisories/list ，轉到 https://portal.nutanix.com/page/security/security-advisories/list
- MQ：舊 https://www.ibm.com/docs/SSFKSJ_9.4.0/overview/mq_newchgd_cd.html ，轉到 https://www.ibm.com/docs/en/ibm-mq/9.4.x 底下的對應主題（轉址後的完整網址這次沒有記下）
- MQ：舊 https://www.ibm.com/docs/SSFKSJ_9.4.0/overview/mq_newchgd_initial.html ，轉到 https://www.ibm.com/docs/en/ibm-mq/9.4.x 底下的對應主題（轉址後的完整網址這次沒有記下）
- JBoss EAP：舊 https://access.redhat.com/articles/6961381 ，轉到 https://access.redhat.com/kb/6961381
- 3scale：舊 https://access.redhat.com/node/2787991 ，轉到 https://access.redhat.com/kb/2787991

### 找到的新來源

- QSE（release notes）：https://www.ibm.com/docs/en/quantum-safe/quantum-safe-explorer/2.x?topic=release-notes
- Coverity（地端 release notes）：https://docs.blackduck.com/r/coverity/latest/coverity-documentation/coverity-current-release-notes.html （路徑由文件站目錄資料確認，沒有用這個網址直接開頁）
- Black Duck SCA（release notes）：https://docs.blackduck.com/r/blackduck/latest/black-duck-documentation/black-duck-sca-release-notes.html （路徑由文件站目錄資料確認，沒有用這個網址直接開頁）
- Seeker（release notes）：https://docs.blackduck.com/r/seeker/latest/release-notes/release-notes.html （路徑由文件站目錄資料確認，沒有用這個網址直接開頁）
- JBoss EAP（8.1 Update 9.1，需訂閱）：https://access.redhat.com/articles/7149700
- JBoss EAP（8.1 Update 9，需訂閱）：https://access.redhat.com/articles/7148325
- 仍未找到：Instana Self-Hosted Standard Edition release notes 專頁
- 仍未找到：HCL AppScan on Cloud What's new
- 仍未找到：Software Risk Manager release notes

### 第一次建立基準的來源

`state\sources.json` 原本不存在，這次檢查到的每一個來源都是第一次建立基準，逐筆紀錄在 `state\sources.json`。

### 版本選單出現新版本的來源

- Concert：目前網址 3.0.x，選單最新 3.1.x。建議新增 https://www.ibm.com/docs/en/concert/3.1.x?topic=notes-whats-new
- Rancher / RKE2（Rancher Manager）：目前網址 v2.12，選單最新 v2.15（另有 Unreleased 的 v2.16）。建議新增 https://documentation.suse.com/cloudnative/rancher-manager/v2.15/en/release-notes/v2.15.3.html
- Rancher / RKE2（RKE2）：目前網址 v1.35.X，選單最新 v1.37.X。建議新增 https://documentation.suse.com/cloudnative/rke2/latest/en/release-notes/v1.37.X.html
- JBoss EAP：目前網址 8.1，選單有 8.2-Beta（尚未 GA，不當成新版本回報）
- NeuVector：5.x 頁選單有 5.7（Unreleased，不當成新版本回報）
- Turbonomic：網址中的 8.16.x 被轉到 8.21.5
- GCM：網址中的 2.0.x 落在 2.0.0，選單沒有更新的版本
- MQ：10.0.x 已在清單內，選單沒有更新的版本
- AppScan：Standard 與 Enterprise 的 10.12.0 頁列出 10.12.1，沒有看到更新的版本文件
- 3scale：目前網址 2.16，沒有看到更新的版本
