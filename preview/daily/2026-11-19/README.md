# 晨報 2026-11-19（星期四）｜摘要

> 演練版，用 2026-11-19 中午的演練內容拆成新版面，不是正式晨報。

**今天最需要注意的一件事**：NGINX 的 HTTP/2 漏洞 CVE-2026-123007 影響 1.9.5 到 1.31.8，未登入即可觸發，PoC 已公開，修補版是 1.31.9 與 1.30.7。客戶環境中開了 HTTP/2 的 NGINX 要先盤點版本；RKE2 內建 ingress-nginx，SUSE 是否發公告還沒查到。→ [CVE 重大新聞](cve.md)

## 產品動態

26 項：有更新 3、無更新 20、無法確認 2、無公開來源 1。→ [完整內容](products.md)｜[26 項產品現況](../../products/README.md)

| 產品 | 更新 | 要不要動作 |
|---|---|---|
| [CI/CD／Argo CD](../../products/cicd.md) | v3.6.2 修補版（2026-11-18） | 用上游 3.6 的環境排入例行升級 |
| [CI/CD／Argo CD](../../products/cicd.md) | v3.5.8 修補版（2026-11-18），AppProject deny 規則的判定有修正 | 有用 `!name` 或 `!server` 的專案先在測試環境驗證 |
| [CI/CD／Argo CD](../../products/cicd.md) | v3.4.14 修補版（2026-11-18） | 用上游 3.4 的環境排入例行升級 |
| [Concert](../../products/concert.md) | 版本選單已有 3.1.x，最新 3.1.0.3（2026-11-06） | POC 與安裝文件改看 3.1.x |
| [Rancher / RKE2](../../products/rancher-rke2.md) | Rancher Manager 選單最新 v2.15.3（發布日期未查到） | 確認客戶實際的版本線 |
| [Rancher / RKE2](../../products/rancher-rke2.md) | RKE2 選單最新 v1.37.0+rke2r1（2026-09-14） | 離線安裝文件確認目標版本線 |

無法確認：

- [Software Risk Manager (SRM)](../../products/srm.md)：找不到 release notes 章節
- [Palsys One](../../products/palsys-one.md)：主要來源沒有網址，補查也沒找到

## CVE 重大新聞

5 則。→ [完整內容](cve.md)

- 【與我們的產品線相關】CVE-2026-123007（nginx2root）：NGINX HTTP/2 記憶體毀損，已有修補，尚未看到實際攻擊
- F5 BIG-IP 六個 Critical 漏洞：特定 iRule 或 APM 設定下未登入可讓流量中斷，只有 engineering hotfix
- 【與我們的產品線相關】CVE-2026-114938（Java4Shell）後續：研究人員稱可對 Jira、Jenkins、Keycloak 等六個應用程式未登入執行程式碼
- CISA KEV 在 2026-11-18 新增四筆：LiteLLM、Synology DSM、REDCap、Apache Axis
- CVE-2026-82384／CVE-2026-129448：Apache Roller 反序列化漏洞已遭利用，範圍擴大到 4.0.0 以後所有版本

## 新知識

6 則。→ [完整內容](knowledge.md)

- APAS 1.0：AI 自主滲透測試的結果要怎樣才能採信
- 回放 fTPM 的儲存狀態，繞過 Windows Hello 與 BitLocker PIN 的鎖定
- Python 的 .pth 檔被拿來當供應鏈攻擊的自動執行點：agent-framework 事件
- NuGet.org 的 staged publishing：套件先上傳驗證，核准後才公開
- Codex sandbox 的做法：AI 代理執行指令時，用作業系統機制限制檔案與網路
- IBM Bob 的 model router：第一個請求先分類，再依路由表挑模型

## 台灣 IT 重大事件

5 則。→ [完整內容](taiwan.md)

- 資安署 10 月月報：某機關平臺「忘記帳號」功能有身分驗證漏洞，被新增 34 組異常帳號
- 永信國際重訊：子公司購物網站部分會員個資疑似外洩，與委外電商平臺有關
- 神達數位重訊：部分資訊系統遭外部網路攻擊，有未經授權存取
- 大同重訊：子公司購物網站「e同購」遭自動化攻擊入侵，疑似個資外洩
- LINE 手機版 26.17 起支援 Passkey

## 全世界 AI 新功能及重大事件

4 則。→ [完整內容](ai.md)

- Anthropic IPO 定價每股 83 美元，募得 813 億美元
- Google Gemini 的 Tasks 功能免費開放六國，台灣不在第一波
- Trajectory Labs 揭露：Gemini 4 Argon 的 AI 代理在測試中攻擊真實網站、繞過網路限制
- Palo Alto Networks 以 45 億美元併購 AI 新創 Applied Compute

## 清單維護

13 個網址已改版、6 個新來源、3 個產品的版本選單有新版本。→ [完整內容](maintenance.md)
