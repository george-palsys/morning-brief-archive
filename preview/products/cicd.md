# CI/CD

[← 26 項產品現況](README.md)

- 原廠：多家
- 最後檢查：2026-11-19
- 當天狀態：有更新

## 各來源目前看到的最新一筆

| 來源 | 類別 | 工具 | 最新一筆 | 日期 | 檢查結果 |
|---|---|---|---|---|---|
| [Jenkins LTS Changelog](https://www.jenkins.io/changelog-stable/) | 新版本 | Jenkins | 2.580.2 | 2026-10-28 | 讀得到 |
| [Jenkins Security Advisories](https://www.jenkins.io/security/advisories/) | 安全公告 | Jenkins | Jenkins Security Advisory 2026-10-28 | 2026-10-28 | 讀得到 |
| [GitLab Releases](https://docs.gitlab.com/releases/) | 新版本 | GitLab | 未記錄 | 頁面沒有日期 | 這次沒有紀錄 |
| [GitHub Changelog](https://github.blog/changelog/) | 新版本 | GitHub Actions | 最新一筆 2026-11-18；Actions 相關最新 2026-11-12 | 2026-11-18 | 讀得到 |
| [actions/runner Releases(自架 runner)](https://github.com/actions/runner/releases) | 新版本 | GitHub Actions | v2.338.2 | 2026-10-26 | 讀得到 |
| [Azure DevOps Server Release Notes](https://learn.microsoft.com/en-us/azure/devops/server/release-notes/azuredevopsserver?view=azure-devops) | 新版本 | Azure DevOps | 未記錄 | 頁面沒有日期 | 這次沒有紀錄 |
| [tektoncd/pipeline Releases](https://github.com/tektoncd/pipeline/releases) | 新版本 | Tekton | v1.18.0 | 2026-10-29 | 讀得到 |
| [tektoncd/pipeline Security Advisories](https://github.com/tektoncd/pipeline/security/advisories) | 安全公告 | Tekton | 最新一筆 2026-04-21 | 2026-04-21 | 讀得到 |
| [Red Hat OpenShift Pipelines 文件(各版 Release notes)](https://docs.redhat.com/en/documentation/red_hat_openshift_pipelines/) | 新版本 | OpenShift Pipelines | 1.24 | 頁面沒有日期 | 讀得到 |
| [argoproj/argo-cd Releases](https://github.com/argoproj/argo-cd/releases) | 新版本 | Argo CD | v3.6.2 / v3.5.8 / v3.4.14 | 2026-11-18 | 讀得到 |
| [argoproj/argo-cd Security Advisories](https://github.com/argoproj/argo-cd/security/advisories) | 安全公告 | Argo CD | 最新一筆 2026-10-07 | 2026-10-07 | 讀得到 |
| [Red Hat OpenShift GitOps 文件(各版 Release notes)](https://docs.redhat.com/en/documentation/red_hat_openshift_gitops/) | 新版本 | OpenShift GitOps | 1.22 | 頁面沒有日期 | 讀得到 |
| [fluxcd/flux2 Releases](https://github.com/fluxcd/flux2/releases) | 新版本 | Flux | v2.10.0 | 2026-10-26 | 讀得到 |
| [fluxcd/flux2 Security Advisories](https://github.com/fluxcd/flux2/security/advisories) | 安全公告 | Flux | 未記錄 | 頁面沒有日期 | 讀得到 |
| [goharbor/harbor Releases](https://github.com/goharbor/harbor/releases) | 新版本 | Harbor | v2.15.5（另有 v2.16.0，2026-11-10） | 2026-11-12 | 讀得到 |
| [goharbor/harbor Security Advisories](https://github.com/goharbor/harbor/security/advisories) | 安全公告 | Harbor | 未記錄 | 頁面沒有日期 | 讀得到 |
| [Sonatype Nexus Repository Release Notes](https://help.sonatype.com/en/release-notes.html) | 新版本 | Sonatype Nexus Repository | 3.98.2 | 頁面沒有日期 | 讀得到 |
| [Artifactory Release Notes](https://docs.jfrog.com/releases/docs/artifactory-release-notes) | 新版本 | JFrog Artifactory | 未記錄 | 頁面沒有日期 | 這次沒有紀錄 |

## 各工具當天狀態

- Jenkins：無更新（LTS 2.580.2，2026-10-28；安全公告最新 2026-10-28）
- GitLab：無更新（最新 Patch Release 19.5.6、19.4.8、19.3.9，2026-11-16；已建立基準）
- GitHub Actions：無更新（GitHub Changelog 最新一筆 2026-11-18，Actions 相關最新一筆 2026-11-12；actions/runner v2.338.2，2026-10-26）
- Azure DevOps：無更新（Azure DevOps Server 最新 Patch 9，2026-10-13）
- Tekton：無更新（tektoncd/pipeline v1.18.0，2026-10-29；安全公告最新 2026-04-21）
- OpenShift Pipelines：無更新（文件頁目前版本 1.24）
- Argo CD：有更新
- OpenShift GitOps：無更新（文件頁目前版本 1.22）
- Flux：無更新（fluxcd/flux2 v2.10.0，2026-10-26）
- Harbor：無更新（v2.15.5，2026-11-12；v2.16.0，2026-11-10；已建立基準）
- Sonatype Nexus Repository：無更新（3.98.2；已建立基準）
- JFrog Artifactory：無更新（Self-managed 7.173.21、SaaS 7.178.1；已建立基準）

## 最近動態

新的在上面，每天往上累加，舊的不刪。

### 2026-11-19

- 新版本：Argo CD v3.6.2 修補版（2026-11-18）。來源：https://github.com/argoproj/argo-cd/releases/tag/v3.6.2 → [當天產品動態](../daily/2026-11-19/products.md)
- 新版本：Argo CD v3.5.8 修補版（2026-11-18），AppProject destination deny 規則的判定有修正。來源：https://github.com/argoproj/argo-cd/releases/tag/v3.5.8 → [當天產品動態](../daily/2026-11-19/products.md)
- 新版本：Argo CD v3.4.14 修補版（2026-11-18）。來源：https://github.com/argoproj/argo-cd/releases/tag/v3.4.14 → [當天產品動態](../daily/2026-11-19/products.md)
