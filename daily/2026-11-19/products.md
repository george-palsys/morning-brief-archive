# 產品動態｜2026-11-19

[← 今日摘要](README.md)｜[產品動態](products.md)｜[新知識](knowledge.md)｜[CVE](cve.md)｜[台灣 IT](taiwan.md)｜[AI](ai.md)｜[清單維護](maintenance.md)

> 歷史演練分檔：2026-11-19 13:19 蒐集（台灣時間）。僅搬移原文，未重新蒐集或查證；產品來源快照本次未建立，不代表目前產品狀態。

6 則產品條目，涉及 3 項追蹤產品。原演練記錄有更新 3、無更新 20、無法確認 2、無公開來源 1；此為原文記錄，本次未重查，未建立產品總表或產品頁來源快照。

### CI/CD/Argo CD：v3.6.2 修補版釋出（3.6 線）

- 類別：新版本
- 內容：
  - 版號：v3.6.2
  - 發布日：2026-11-18 19:55 UTC（台北時間 2026-11-19 03:55）
  - 重點變更：changelog 只有 Bug fixes 段落，包含 ApplicationSet 只 patch refresh annotation 而不整份改寫（#24378、#24647）；controller 在 manifest-generate-paths 沒有變更時保留 server-side diff cache（#30812）；sync 狀態為 Unknown 後略過 diff cache（#28722）；相依套件 dlclark/regexp2 由 v1.12.0 升到 v2.13.0（changelog 註明 CVE-2026-77299）；kustomize 的 ignoreMissingComponents 修正；三項 UI 修正。
  - 安全面：Argo CD 專案的 Security Advisories 頁最新一筆仍是 2026-10-07，沒有對應這一版的新公告。CVE-2026-77299 的嚴重度與細節我沒有查。
- 對我們的影響：用上游 Argo CD 3.6 的環境可排入例行升級。OpenShift GitOps 的版本由 Red Hat 另外發布，今天文件頁仍是 1.22，沒有變化。
- 來源：argoproj/argo-cd Release v3.6.2（2026-11-18）：https://github.com/argoproj/argo-cd/releases/tag/v3.6.2

### CI/CD/Argo CD：v3.5.8 修補版釋出（3.5 線）

- 類別：新版本
- 內容：
  - 版號：v3.5.8
  - 發布日：2026-11-18 19:54 UTC（台北時間 2026-11-19 03:54）
  - 重點變更：ApplicationSet 只 patch refresh annotation；dlclark/regexp2 升到 v2.13.0（CVE-2026-77299）；AppProject destination 的 deny 規則（`!name`／`!server`）在正向符合時改為否決；兩項 UI 修正；相依更新 go-jose v4 4.1.4 到 4.1.6、otel v1.44.0 到 v1.46.0、Go 1.26.11。
  - 行為改變：AppProject destination deny 規則的判定有修正，用了 `!name` 或 `!server` 寫法的專案升級後要重新確認允許的部署目的地。
- 對我們的影響：用上游 Argo CD 3.5 的環境可排入例行升級；有用 AppProject deny 規則的要先在測試環境驗證。
- 來源：argoproj/argo-cd Release v3.5.8（2026-11-18）：https://github.com/argoproj/argo-cd/releases/tag/v3.5.8

### CI/CD/Argo CD：v3.4.14 修補版釋出（3.4 線）

- 類別：新版本
- 內容：
  - 版號：v3.4.14
  - 發布日：2026-11-18 19:58 UTC（台北時間 2026-11-19 03:58）
  - 重點變更：dlclark/regexp2 升到 v2.13.0（CVE-2026-77299）；AppProject destination 的 deny 規則修正（與 v3.5.8 相同的修正移植到 3.4）；go-jose v4 4.1.4 到 4.1.6；Go 1.26.11；git-lfs v3.7.1 到 v3.8.1；gitops-engine 不再為每個叢集保留解碼後的 OpenAPI 文件（#30810）。
- 對我們的影響：用上游 Argo CD 3.4 的環境可排入例行升級。
- 來源：argoproj/argo-cd Release v3.4.14（2026-11-18）：https://github.com/argoproj/argo-cd/releases/tag/v3.4.14

### Concert：版本選單已有 3.1.x，最新為 3.1.0.3（清單目前釘在 3.0.x）

- 類別：新版本
- 內容：
  - 這則是依「帶版本號的網址」規則回報：清單上的網址是 3.0.x（該頁最新為 3.0.1.1，2026-08-25），版本選單中有更新的 3.1.x。不是昨天之後才發布的版本。
  - 3.1.0.3：發布日 2026-11-06。self-hosted 的修補版，新增支援 virtual-hosted-style 定址的 S3 相容物件儲存，另含錯誤修正。
  - 3.1.0.2：發布日 2026-10-31。self-hosted 修補版，針對安全性強化設定的 Kubernetes 叢集，含弱點管理與修補相關修正，原廠建議使用 CVE 管理與修復功能的客戶採用。
  - 3.1.0.1：發布日 2026-10-28。僅 SaaS，把 3.1.0 的功能帶到 SaaS；Proof of exploitability 只在 self-hosted 提供。
  - 3.1.0：發布日 2026-09-30。新增 AI 的 Proof of Exploitability（以 AI agent 依原始碼結構與部署設定判斷弱點是否可被利用）、Infrastructure view、依資源層級 label 的跨 namespace 應用程式自動探索、可匯出 CycloneDX 1.7 格式的 SBOM、Secure Coder VS Code 擴充套件可同步 exploitability 結果並支援 Mend CLI 掃描器。
  - 移除或棄用的功能：頁面前段沒有看到，後段我沒有讀完。
  - 安全公告：以產品名「IBM Concert」在 IBM 公告清單查到的只有 2024-08-29 一則；另一個產品名「IBM Concert Software」的查詢沒有回應，這部分未確認。
- 對我們的影響：Concert 的 POC 與安裝文件如果還以 3.0.x 為準，要改看 3.1.x；3.1.0 的 Proof of Exploitability 與 SBOM 匯出是可以拿來展示的新功能。
- 來源：What's new in IBM Concert（3.1.x，頁面最後更新 2026-11-10）：https://www.ibm.com/docs/en/concert/3.1.x?topic=notes-whats-new

### Rancher / RKE2：Rancher Manager 版本選單最新為 v2.15（v2.15.3），清單目前釘在 v2.12

- 類別：新版本
- 內容：
  - 這則是依「帶版本號的網址」規則回報：清單上的網址是 v2.12（該線最新為 v2.12.15），版本選單另有 v2.13、v2.14、v2.15，以及標示 Unreleased 的 v2.16。不是昨天之後才發布的版本。
  - 版號：v2.15.3（v2.15 線目前最新的修補版，Prime 版本）。
  - 發布日：頁面上沒有標示，發布日期未查到。
  - 重點變更：維護更新與錯誤修正；安全修正包含 meta proxy 端點的目的地 allowlist 檢查位置錯誤（已登入使用者可讓 Rancher server 對內部服務發送請求並取得回應，CVE-2026-88809），以及 GlobalRole 的 inheritedNamespacedRules 欄位未做權限提升檢查。Rancher 的 CVE 清單頁上 CVE-2026-88809 的日期是 2026-10-29。
  - 升級注意：使用 AD FS 的環境升級到 v2.10.1 以後可能需要手動更新 Relying Party Trust（頁面開頭的固定提醒）。
- 對我們的影響：Rancher 相關文件與 lab 如果以 v2.12 為準，要確認客戶實際版本線；v2.12 是否仍在支援期我沒有查。
- 來源：Rancher Manager v2.15.3 Release Notes（發布日期未查到）：https://documentation.suse.com/cloudnative/rancher-manager/v2.15/en/release-notes/v2.15.3.html

### Rancher / RKE2：RKE2 版本選單最新為 v1.37.X（v1.37.0+rke2r1），清單目前釘在 v1.35.X

- 類別：新版本
- 內容：
  - 這則是依「帶版本號的網址」規則回報：清單上的網址是 v1.35.X（最新 v1.35.8+rke2r1，2026-08-28），選單另有 v1.36.X 與 v1.37.X。不是昨天之後才發布的版本。
  - 版號：v1.37.0+rke2r1
  - 發布日：2026-09-14
  - 重點變更：Kubernetes 升到 v1.37.0；元件版本為 etcd v3.7.1-k3s1、containerd v2.3.4-k3s1、runc v1.4.3、CoreDNS v1.14.7、Ingress-Nginx v1.14.5-hardened2、Traefik v3.7.13；新增 rke2-security-responder chart；加入 RKE_INGRESS_CONTROLLER 棄用警告。
- 對我們的影響：RKE2 的離線安裝文件要確認目標版本線；內建的 Ingress-Nginx 與今天的 NGINX 漏洞（見 CVE 重大新聞）有關，SUSE 是否發公告待查。
- 來源：RKE2 v1.37.X Release Notes（v1.37.0+rke2r1，2026-09-14）：https://documentation.suse.com/cloudnative/rke2/latest/en/release-notes/v1.37.X.html
