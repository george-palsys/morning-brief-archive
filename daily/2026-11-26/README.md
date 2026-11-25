# 晨報 2026-11-26（星期四）｜摘要

**今天最需要注意的一件事**：CI/CD 三個工具在 11-24、11-25 都發了安全更新：Jenkins 11 項外掛漏洞（含 Pipeline: Groovy 的 sandbox 繞過）、GitLab 19.6.2 修 13 個、Argo CD v3.6.3 修 7 個。客戶的 CI/CD 平台可排同一個維護時段升級。 → [產品動態](products.md)

## 產品動態

26 項：有更新 7、無更新 17、無法確認 1、無公開來源 1。上一份晨報是 11-24，這一份涵蓋兩天。→ [完整內容](products.md)｜[26 項產品現況](../../products/README.md)

| 產品 | 更新 | 要不要動作 |
|---|---|---|
| [CI/CD/Jenkins](../../products/cicd.md) | 2026-11-25 安全公告，11 項外掛漏洞，全部有修正版；LTS 2.580.3 | 要。Pipeline: Groovy 與 Script Security 外掛排進最近的維護 |
| [CI/CD/GitLab](../../products/cicd.md) | Patch Release 19.6.2、19.5.9、19.4.11，13 個安全修正（12 個 Medium、1 個 Low） | 自架的依版本線升級，不算緊急 |
| [CI/CD/Argo CD](../../products/cicd.md) | v3.6.3、v3.5.9、v3.4.15，7 個安全修正（4 個 High） | 要。升級前檢查 Helm release name 是否合法 |
| [CI/CD/JFrog Artifactory](../../products/cicd.md) | Self-Managed 7.173.27，含安全修正，細節要登入才看得到 | 自架的排升級；細節請有帳號的人確認 |
| [Instana](../../products/instana.md) | IBM 公告 node/7297963：自架版 build 1.0.285 到 1.0.327 受影響，修在 1.0.329 | 自架的確認 build，舊的排升級；SaaS 不用動 |
| [Rancher / RKE2](../../products/rancher-rke2.md) | Rancher v2.15.4、v2.14.8、v2.13.12、v2.12.16（2026-11-25） | 例行 patch；有用 Rancher Turtles 的先檢查 `.spec.variables` |
| [NKP](../../products/nkp.md) | Nutanix 更新 #0061（CVE-2026-111497，CVSS 4.0 為 9.2），寫 NKP 修正版是 2.19.1 | 留意 2.19.1 何時可下載 |
| [Confluent Platform](../../products/confluent-platform.md) | CONFSA-2026-38：Confluent Manager for Apache Flink 驗證與授權繞過，CVSS 3.1 為 8.8（補列） | 有部署 CMF 的升到 2.4.5 或 2.5.1 |
| [Palsys One](../../products/palsys-one.md) | 底層 AppScan on Cloud 的 DAST 引擎升到 10.13.0，加入 MCP 自動掃描 | 不用動作 |
| [OpenShift](../../products/openshift.md) | 五張 RHBA（2026-11-24），沒有新的 RHSA | 叢集本身不用動 |

無法確認：Software Risk Manager (SRM)（release notes 要登入才看得到，也沒有公開的安全公告頁）。

## CVE 重大新聞

4 則。這 4 則都在產品線以外；和產品線相關的漏洞寫在產品動態。→ [完整內容](cve.md)

- CVE-2026-123903：VMware vCenter 身分驗證繞過，Broadcom 評 9.8，沒有緩解做法
- CVE-2026-132165：Drupal core 的 install.php 可被用來重新安裝網站，已遭利用並列入 KEV
- CVE-2026-123167：SolarWinds Serv-U 權限提升，原廠評 9.1
- CVE-2026-129514：Elixir 套件庫 Hex.pm 遭入侵，使用者資料與簽章金鑰可能外洩

## 新知識

5 則。→ [完整內容](knowledge.md)

- OAuth 2.0 Token Exchange（RFC 8693）用在 AI agent：impersonation 與 delegation 的差別
- Siren：測 AI agent 發現沙箱有洞時會不會自己跑出去
- Sigstore Rekor 公共實例只收 5 種紀錄類型
- Agent Host Protocol：讓 AI agent 的工作階段可以跨裝置接續
- RFC 10097：RPKI 信任錨憑證同時有好幾張有效時，該用哪一張

## 台灣 IT 重大事件

5 則。→ [完整內容](taiwan.md)

- 葡萄王子公司葡眾：委外廠商統一資訊通知，加密的會員資料遭未經授權存取
- 黑貓宅急便：委外廠商摩奇創意後臺遭未授權存取，預約寄件的姓名與電話外洩
- 車麗屋：購物網站遭自動化攻擊，部分會員個資疑似外洩
- 資安署：遭駭後調查階段就該通知上下游，並建議用 4 項指標排漏洞修補順序
- 數發部 AI 風險分類框架：三大類、二十項子類別，內控分甲、乙、丙與無顯著風險

## 全世界 AI 新功能及重大事件

3 則。→ [完整內容](ai.md)

- Google：Workspace MCP 伺服器與 Workspace CLI 正式上線，Agent Gateway 管 agent 的連線
- Google DeepMind：Humanity's First Exam，測模型做簡單任務穩不穩
- AWS：開源 Strands Decider v2，用小模型替 agent 做選擇題

## 清單維護

- 來源清單（products.yaml）今天沒有修正，沒有送 PR。
- 今天打開 109 個來源，108 個讀得到（含補建基準的 1 個），1 個回 404（NeuVector 在 SUSE 文件站的舊網址）。
- CONFSA-2026-38 是 11-19 發布、先前漏掉的公告，今天補列。
- JFrog 的修補細節與 SRM 的 release notes 都要登入，沒有讀；NKP 公告 PDF 的表格對應有一部分不能確定。

→ [完整內容](maintenance.md)
