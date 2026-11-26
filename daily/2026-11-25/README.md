# 晨報 2026-11-25（星期三）｜摘要

**今天最需要注意的一件事**：Argo CD 於 2026-11-24 發布 v3.6.3、v3.5.9、v3.4.15，修 7 個漏洞（4 個 High）；IBM 同日公告自架版 Instana build 1.0.285 到 1.0.327 受影響，修在 1.0.329。有自架這兩項的客戶可排進最近的維護時段。 → [產品動態](products.md)

## 產品動態

26 項：有更新 6、無更新 18、無法確認 1、無公開來源 1。這一份是 2026-11-26 補做的，收來源發布日期在 2026-11-24（含）以前的項目。→ [完整內容](products.md)｜[26 項產品現況](../../products/README.md)

| 產品 | 更新 | 要不要動作 |
|---|---|---|
| [CI/CD/Argo CD](../../products/cicd.md) | v3.6.3、v3.5.9、v3.4.15，7 個安全修正（4 個 High） | 要。升級前檢查 Helm release name 是否合法 |
| [CI/CD/JFrog Artifactory](../../products/cicd.md) | Self-Managed 7.173.27，含安全修正，細節要登入才看得到 | 自架的排升級；細節請有帳號的人確認 |
| [Instana](../../products/instana.md) | IBM 公告 node/7297963：自架版 build 1.0.285 到 1.0.327 受影響，修在 1.0.329 | 自架的確認 build，舊的排升級；SaaS 不用動 |
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

3 則。→ [完整內容](knowledge.md)

- Sigstore Rekor 公共實例只收 5 種紀錄類型
- Agent Host Protocol：讓 AI agent 的工作階段可以跨裝置接續
- RFC 10097：RPKI 信任錨憑證同時有好幾張有效時，該用哪一張

## 台灣 IT 重大事件

3 則。→ [完整內容](taiwan.md)

- 葡萄王子公司葡眾：委外廠商統一資訊通知，加密的會員資料遭未經授權存取
- 車麗屋：購物網站遭自動化攻擊，部分會員個資疑似外洩
- 資安署：遭駭後調查階段就該通知上下游，並建議用 4 項指標排漏洞修補順序

## 全世界 AI 新功能及重大事件

2 則。→ [完整內容](ai.md)

- Google DeepMind：Humanity's First Exam，測模型做簡單任務穩不穩
- AWS：開源 Strands Decider v2，用小模型替 agent 做選擇題

## 清單維護

- 這一份是 2026-11-26 補做的：2026-11-25 凌晨因 AI 帳號用量上限沒有產出，內容取自 2026-11-26 02:00 的蒐集結果，沒有另外重新蒐集。
- CONFSA-2026-38 是 11-19 發布、先前漏掉的公告，這一份補列。
- JFrog 的修補細節要登入，沒有讀；NKP 公告 PDF 的表格對應有一部分不能確定。
- 來源檢查只在 2026-11-26 02:00 做了一次，逐項紀錄寫在 2026-11-26 的清單維護。

→ [完整內容](maintenance.md)
