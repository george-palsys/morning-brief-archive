# CI/CD

[← 26 項產品現況](README.md)

- 原廠：多家
- 最後檢查：2026-11-26
- 當天狀態：有更新

## 各來源目前看到的最新一筆

| 來源 | 類別 | 工具 | 最新一筆 | 日期 | 檢查結果 |
|---|---|---|---|---|---|
| [Jenkins LTS Changelog](https://www.jenkins.io/changelog-stable/) | 新版本 | Jenkins | 2.580.3 | 2026-11-25 | 讀得到 |
| [Jenkins Security Advisories](https://www.jenkins.io/security/advisories/) | 安全公告 | Jenkins | Jenkins Security Advisory 2026-11-25 | 2026-11-25 | 讀得到 |
| [GitLab Releases](https://docs.gitlab.com/releases/) | 新版本 | GitLab | GitLab 19.6.2（Patch Release 19.6.2、19.5.9、19.4.11；月度版仍為 19.6） | 2026-11-25 | 讀得到 |
| [GitHub Changelog](https://github.blog/changelog/) | 新版本 | GitHub Actions | Actions 相關最新 2026-11-19（Red Hat Enterprise Linux runner images now generally available） | 2026-11-19 | 讀得到 |
| [actions/runner Releases（自架 runner）](https://github.com/actions/runner/releases) | 新版本 | GitHub Actions | v2.338.2 | 2026-10-26 | 讀得到 |
| [Azure DevOps Server Release Notes](https://learn.microsoft.com/en-us/azure/devops/server/release-notes/azuredevopsserver?view=azure-devops) | 新版本 | Azure DevOps | Azure DevOps Server Patch 9 | 2026-10-13 | 讀得到 |
| [tektoncd/pipeline Releases](https://github.com/tektoncd/pipeline/releases) | 新版本 | Tekton | v1.18.0 | 2026-10-30 | 讀得到 |
| [tektoncd/pipeline Security Advisories](https://github.com/tektoncd/pipeline/security/advisories) | 安全公告 | Tekton | GHSA-wjxp-xrpv-xpff（最新一筆 2026-04-21） | 2026-04-21 | 讀得到 |
| [Red Hat OpenShift Pipelines 文件（各版 Release notes）](https://docs.redhat.com/en/documentation/red_hat_openshift_pipelines/) | 新版本 | OpenShift Pipelines | 1.24（文件 release notes 列到 1.24.2；errata 有 1.24.3） | 2026-10-31 | 已轉址 |
| [argoproj/argo-cd Releases](https://github.com/argoproj/argo-cd/releases) | 新版本 | Argo CD | v3.6.3 / v3.5.9 / v3.4.15 | 2026-11-24 | 讀得到 |
| [argoproj/argo-cd Security Advisories](https://github.com/argoproj/argo-cd/security/advisories) | 安全公告 | Argo CD | GHSA-jj8j-82j2-7ph7 | 2026-11-20 | 讀得到 |
| [Red Hat OpenShift GitOps 文件（各版 Release notes）](https://docs.redhat.com/en/documentation/red_hat_openshift_gitops/) | 新版本 | OpenShift GitOps | 1.22.4（RHSA-2026:102591；文件站已列出 1.22.4） | 2026-11-23 | 已轉址 |
| [fluxcd/flux2 Releases](https://github.com/fluxcd/flux2/releases) | 新版本 | Flux | v2.10.1 | 2026-11-20 | 讀得到 |
| [fluxcd/flux2 Security Advisories](https://github.com/fluxcd/flux2/security/advisories) | 安全公告 | Flux | GHSA-mwcp-qpcg-fr7c | 2026-08-11 | 讀得到 |
| [goharbor/harbor Releases](https://github.com/goharbor/harbor/releases) | 新版本 | Harbor | v2.15.5（另有 v2.16.0） | 2026-11-12 | 讀得到 |
| [goharbor/harbor Security Advisories](https://github.com/goharbor/harbor/security/advisories) | 安全公告 | Harbor | GHSA-x955-mxjx-g5cj（依發布日排序的第一筆，2026-10-28；先前記的是 GHSA-w5fq-xrhj-j7g2） | 2026-10-28 | 讀得到 |
| [Sonatype Nexus Repository Release Notes](https://help.sonatype.com/en/release-notes.html) | 新版本 | Sonatype Nexus Repository | 3.98.3 | 2026-11-19 | 讀得到 |
| [Artifactory Release Notes](https://docs.jfrog.com/releases/docs/artifactory-release-notes) | 新版本 | JFrog Artifactory | Self-managed 7.173.27（SaaS 今天沒有讀到，上次是 7.179.1） | 2026-11-24 | 讀得到 |

## 各工具當天狀態

- Jenkins：有更新
- GitLab：有更新
- GitHub Actions：無更新
- Azure DevOps：無更新
- Tekton：無更新
- OpenShift Pipelines：無更新
- Argo CD：有更新
- OpenShift GitOps：無更新
- Flux：無更新
- Harbor：無更新
- Sonatype Nexus Repository：無更新
- JFrog Artifactory：有更新

## 最近動態

新的在上面，每天往上累加，舊的不刪。

### 2026-11-26

- 安全公告：Jenkins Security Advisory 2026-11-25，11 個 SECURITY 項目，全部是外掛、全部有修正版：Pipeline: Groovy（CVE-2026-136834，sandbox 繞過）、Script Security（CVE-2026-136835，sandbox 繞過）、Gradle（CVE-2026-136836）、Warnings（CVE-2026-136837）、Subversion（CVE-2026-136838、CVE-2026-136839）、Configuration as Code（CVE-2026-136840）、Nested View（CVE-2026-136841）、Performance（CVE-2026-136842）、Spira Importer（CVE-2026-136843、CVE-2026-136844）、Pipeline DORA Metrics（CVE-2026-136845 到 CVE-2026-136853）、Rich Text Publisher（CVE-2026-136854）。來源：https://www.jenkins.io/security/advisory/2026-11-25/ → [當天產品動態](../daily/2026-11-26/products.md)
- 新版本：Jenkins LTS 2.580.3（2026-11-25），相依套件更新。來源：https://www.jenkins.io/changelog-stable/ → [當天產品動態](../daily/2026-11-26/products.md)
- 安全公告：GitLab Patch Release 19.6.2、19.5.9、19.4.11（2026-11-25），13 個安全修正（12 個 Medium、1 個 Low，最高 CVSS 6.7 的 CVE-2026-119452），內附 NGINX 升到 1.31.9。來源：https://docs.gitlab.com/releases/patches/patch-release-gitlab-19-6-2-released/ → [當天產品動態](../daily/2026-11-26/products.md)
- 安全公告：Argo CD v3.6.3、v3.5.9、v3.4.15（2026-11-24），7 個安全修正（4 個 High、3 個 Moderate，沒有 CVE 編號）：GHSA-mfgm-4p7x-3ccr、GHSA-w7rw-fg89-2cjf、GHSA-rxm8-qc6h-3c8h、GHSA-rvmf-gjc9-wjgq、GHSA-q4f6-wc8m-r246、GHSA-v2hj-322q-6cg4、GHSA-8cfq-7w4v-ggm3。Helm release name 改成照字面傳入，必須是合法名稱。來源：https://github.com/argoproj/argo-cd/releases/tag/v3.6.3 → [當天產品動態](../daily/2026-11-26/products.md)
- 安全公告：JFrog Artifactory 7.173.27 Self-Managed（2026-11-24），原廠寫含安全性錯誤修正、強烈建議升級。來源：https://docs.jfrog.com/releases/docs/artifactory-release-notes → [當天產品動態](../daily/2026-11-26/products.md)
- 無法確認（個別項目，產品狀態不受影響）：Artifactory 7.173.27 修了哪些漏洞要登入 MyJFrog 才看得到，沒有讀；SaaS 版的最新版號今天沒有讀到。Jenkins 公告頁沒有 CVSS 分數。Argo CD 的 Security Advisories 頁最上面一筆今天沒有重新記錄，表中仍是 11-24 的紀錄。

### 2026-11-24

- 安全公告：OpenShift GitOps，三張 RHSA（2026-11-23）：RHSA-2026:102591（v1.22.4）、RHSA-2026:102593（v1.21.8）、RHSA-2026:102596（v1.20.12）。CVE 清單相同，共 5 個：CVE-2026-119618（mod_http2，Critical，CVSS 3.1 為 9.8）、CVE-2025-61560、CVE-2026-116591、CVE-2026-78659、CVE-2026-78660。來源：https://access.redhat.com/errata/RHSA-2026:102591 → [當天產品動態](../daily/2026-11-24/products.md)
- 無法確認（個別項目，產品狀態不受影響）：三張 RHSA 的網頁沒有逐張打開；文件站的 release notes 仍只列到 1.22.3。

### 2026-11-23

- 新版本：JFrog Artifactory，Artifactory 7.179.1 SaaS 發布（2026-11-22），1 項功能調整、8 項問題修正，說明沒有列出安全性修正；自管版仍是 7.173.21。來源：https://docs.jfrog.com/releases/docs/artifactory-saas-releases → [當天產品動態](../daily/2026-11-23/products.md)

### 2026-11-21

- 安全公告：GitLab，Critical Patch Release 19.6.1、19.5.8、19.4.10，換掉內建 Ruby 以修補 CVE-2026-132825（Ruby2Shell）。來源：https://docs.gitlab.com/releases/patches/patch-release-gitlab-19-6-1-released/ → [當天產品動態](../daily/2026-11-21/products.md)
- 安全公告：Argo CD，GHSA-jj8j-82j2-7ph7，`last-applied-configuration` 不是合法 JSON 時 Secret 遮罩會被跳過（Medium，CVSS 3.1 為 6.3）；修補版本 v3.6.0、v3.5.1、v3.4.7、v3.3.14。來源：https://github.com/argoproj/argo-cd/security/advisories/GHSA-jj8j-82j2-7ph7 → [當天產品動態](../daily/2026-11-21/products.md)
- 修補：Flux，v2.10.1 修補版，修正憑證快取、私有位址 registry 驗證與 Git checkout 的問題。來源：https://github.com/fluxcd/flux2/releases/tag/v2.10.1 → [當天產品動態](../daily/2026-11-21/products.md)

### 2026-11-20

- 新版本：GitLab，GitLab 19.6 月度版發布，Rapid Diffs 正式取代舊的 diff 檢視，GitLab Runner 19.6 同步發布。來源：https://docs.gitlab.com/releases/19/gitlab-19-6-released/ → [當天產品動態](../daily/2026-11-20/products.md)
- 新版本：GitHub Actions，GitHub-hosted larger runner 的 RHEL 9 / RHEL 10 映像檔正式 GA。來源：https://github.blog/changelog/2026-11-19-red-hat-enterprise-linux-runner-images-now-generally-available → [當天產品動態](../daily/2026-11-20/products.md)
- 新版本：Argo CD，Argo CD 三條維護線同時出 patch：v3.6.2、v3.5.8、v3.4.14。來源：https://github.com/argoproj/argo-cd/releases/tag/v3.6.2 → [當天產品動態](../daily/2026-11-20/products.md)
- 新版本：Sonatype Nexus Repository，Nexus Repository 3.98.3 發布，修正搜尋索引重建造成的多餘資料庫寫入與索引膨脹。來源：https://help.sonatype.com/en/sonatype-nexus-repository-3-98-0-release-notes.html → [當天產品動態](../daily/2026-11-20/products.md)
- 安全公告（建立基準時看到，不算當天更新）：Flux，建立基準時看到的最新公告：GHSA-mwcp-qpcg-fr7c（Improper network isolation allows event spoofing, DoS and unauthorized status updates）。不在最近 7 天內，不列為更新。來源：https://github.com/fluxcd/flux2/security/advisories
- 安全公告（建立基準時看到，不算當天更新）：Harbor，建立基準時看到的最新公告：GHSA-w5fq-xrhj-j7g2（A system robot with user:update makes itself a system administrator）。不在最近 7 天內，不列為更新。來源：https://github.com/goharbor/harbor/security/advisories
- 無法確認（個別來源，產品狀態不受影響）：GitLab，GitLab 19.6 的 deprecations and removals 頁與 upgrade notes 沒有打開，移除與棄用項目未逐項確認。
- 無法確認（個別來源，產品狀態不受影響）：Argo CD，CVE-2026-77299 的嚴重度與 CVSS，release 頁沒有寫，未查到。
