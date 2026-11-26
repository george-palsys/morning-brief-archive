# 晨報 2026-11-26（星期四）｜摘要

**今天最需要注意的一件事**：Jenkins 於 2026-11-25 發布安全公告，11 項外掛漏洞（含 Pipeline: Groovy 的 sandbox 繞過）全部有修正版；GitLab 同日發布 19.6.2，修 13 個漏洞。客戶的 CI/CD 平台可排同一個維護時段升級。 → [產品動態](products.md)

## 產品動態

26 項：有更新 2、無更新 22、無法確認 1、無公開來源 1。上一份晨報是 11-25（補做），這一份收 2026-11-25 發布的項目。→ [完整內容](products.md)｜[26 項產品現況](../../products/README.md)

| 產品 | 更新 | 要不要動作 |
|---|---|---|
| [CI/CD/Jenkins](../../products/cicd.md) | 2026-11-25 安全公告，11 項外掛漏洞，全部有修正版；LTS 2.580.3 | 要。Pipeline: Groovy 與 Script Security 外掛排進最近的維護 |
| [CI/CD/GitLab](../../products/cicd.md) | Patch Release 19.6.2、19.5.9、19.4.11，13 個安全修正（12 個 Medium、1 個 Low） | 自架的依版本線升級，不算緊急 |
| [Rancher / RKE2](../../products/rancher-rke2.md) | Rancher v2.15.4、v2.14.8、v2.13.12、v2.12.16（2026-11-25） | 例行 patch；有用 Rancher Turtles 的先檢查 `.spec.variables` |

無法確認：Software Risk Manager (SRM)（release notes 要登入才看得到，也沒有公開的安全公告頁）。

## CVE 重大新聞

0 則。今天沒有重大消息。和產品線相關的漏洞寫在產品動態；產品線以外的 4 則發布日期都在 2026-11-24（含）以前，寫在 2026-11-25 的晨報。→ [完整內容](cve.md)

## 新知識

2 則。→ [完整內容](knowledge.md)

- OAuth 2.0 Token Exchange（RFC 8693）用在 AI agent：impersonation 與 delegation 的差別
- Siren：測 AI agent 發現沙箱有洞時會不會自己跑出去

## 台灣 IT 重大事件

2 則。→ [完整內容](taiwan.md)

- 黑貓宅急便：委外廠商摩奇創意後臺遭未授權存取，預約寄件的姓名與電話外洩
- 數發部 AI 風險分類框架：三大類、二十項子類別，內控分甲、乙、丙與無顯著風險

## 全世界 AI 新功能及重大事件

1 則。→ [完整內容](ai.md)

- Google：Workspace MCP 伺服器與 Workspace CLI 正式上線，Agent Gateway 管 agent 的連線

## 清單維護

- 來源清單（products.yaml）今天沒有修正，沒有送 PR。
- 今天打開 109 個來源，108 個讀得到（含補建基準的 1 個），1 個回 404（NeuVector 在 SUSE 文件站的舊網址）。
- SRM 的 release notes 要登入，沒有讀。
- 原本併在這一份、來源發布日期在 2026-11-24（含）以前的項目，已拆到 2026-11-25 的晨報。

→ [完整內容](maintenance.md)
