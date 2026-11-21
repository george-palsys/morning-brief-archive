# 晨報 2026-11-21（星期六）｜摘要

**今天最需要注意的一件事**：Ruby 的 Ruby2Shell 漏洞（CVE-2026-132825）Red Hat 評為 Critical、CVSS 3.1 為 9.8，OpenShift Container Platform 5 與 4 列為直接受影響；GitLab 已發布 Critical Patch Release 19.6.1、19.5.8、19.4.10。已有 PoC、沒有查到實際攻擊；自管 GitLab 要排升級，OpenShift 先盤點對外的 Ruby 工作負載並等 errata。 → [產品動態](products.md)

## 產品動態

26 項：有更新 3、無更新 21、無法確認 1、無公開來源 1。→ [完整內容](products.md)｜[26 項產品現況](../../products/README.md)

| 產品 | 更新 | 要不要動作 |
|---|---|---|
| [CI/CD/GitLab](../../products/cicd.md) | Critical Patch Release 19.6.1、19.5.8、19.4.10，修補 CVE-2026-132825（Ruby2Shell） | 自管 GitLab 盡快升到 19.6.1／19.5.8／19.4.10 |
| [OpenShift](../../products/openshift.md) | RHSB-2026-021：Ruby2Shell，Critical、CVSS 3.1 為 9.8，OCP 5 與 4 直接受影響 | 盤點對外的 Ruby 工作負載，追這則公告的 errata |
| [OpenShift](../../products/openshift.md) | RHBA-2026:100764：RHEL 8 為基礎的 Middleware Containers 映像更新 | 用到這些映像的應用重新拉映像或重新 build |
| [JBoss EAP](../../products/jboss-eap.md) | 兩張 OpenShift 映像 respin errata（RHEA-2026:100759、RHEA-2026:100770），EAP 版本沒有變 | 在 OpenShift 上用 EAP 映像的應用排重新 build |
| [CI/CD/Argo CD](../../products/cicd.md) | GHSA-jj8j-82j2-7ph7（Medium，CVSS 3.1 為 6.3），Secret 遮罩可能被跳過 | 升到 v3.6.0／v3.5.1／v3.4.7／v3.3.14 |
| [CI/CD/Flux](../../products/cicd.md) | v2.10.1 修補版 | 照一般 patch 流程安排 |

無法確認：Software Risk Manager (SRM)（文件入口頁打得開，但找不到 release notes 頁，也沒有公開的安全公告頁）。

## CVE 重大新聞

5 則。其中 1 則（Ruby2Shell）併入產品動態。→ [完整內容](cve.md)

- CVE-2026-132825（Ruby2Shell）：Ruby 修補七個漏洞，GitLab 發布 Critical Patch Release，Red Hat 評為 Critical【與我們的產品線相關】
- CISA KEV 於 2026-11-18 新增四個漏洞：Apache Axis（CVE-2026-90436，後續）、LiteLLM、REDCap、Synology
- 華碩 ASUS Control Center Express 三個漏洞，最高 CVSS 10.0（CVE-2026-114202、CVE-2026-114204、CVE-2026-114205）
- F5 BIG-IP 六個資料平面漏洞，CVSS 9.8，目前只有 Engineering Hotfix
- PHP 七個 Critical 漏洞（後續）：上游在 2026-11-19 釋出 8.5.13、8.4.28、8.3.37、8.2.36，CVE-2026-126714 被稱為 phpAfterShell

## 新知識

6 則。→ [完整內容](knowledge.md)

- NIST 決定改版 SP 800-52 Rev. 2：TLS 1.2 降為「可以支援」，並加入後量子演算法
- nginx2root 的機制：HTTP/2 流量控制視窗退款沒有上限，加上四個 use-after-free
- Argo CD 的 sync window 關閉後，self-heal 可能跳過 Sync hook：資料庫 migration 沒跑卻顯示 Synced
- Open Liberty 26.0.0.11：停機寬限時間可以設定了，`quiesceTimeout` 放在 `<server>` 上
- Kyverno 1.19.2：CEL 准入政策的成本原來花在重複轉換物件，不是花在 CEL 運算
- 後量子的盲簽章：用 VOLE-in-the-Head 零知識證明加多變數簽章，取代 Privacy Pass 的 RSA 盲簽章

## 台灣 IT 重大事件

3 則。→ [完整內容](taiwan.md)

- 四家銀行向金管會通報網銀盜轉：5 名客戶、約 56.6 萬元，初步認定是客戶手機被植入惡意程式
- 數發部成立跨部會小組，用 AI 工具主動掃描政府與關鍵基礎設施的漏洞；國產 PQC 晶片已量產
- 台股 11-20 收盤重挫 2,393.6 點（後續）：史上第三大跌點，跌破 37,000 點

## 全世界 AI 新功能及重大事件

2 則。→ [完整內容](ai.md)

- Anthropic 完成 IPO 交割：承銷商加購權全數行使，連同私募共募得約 1,195 億美元
- 加州檢察總長對 Nvidia 發出調查傳票：查先進晶片或機密是否流向中國、是否誤導投資人

## 清單維護

來源清單今天有修正（換網址 2 筆：SRM 文件入口、JBoss EAP release notes），已送出並合併。有 12 個來源今天沒有重新打開。→ [清單維護](maintenance.md)
