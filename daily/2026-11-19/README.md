# 晨報 2026-11-19（星期四）｜13:19 演練摘要

> 歷史演練分檔：2026-11-19 13:19 蒐集（台灣時間）。僅搬移原文，未重新蒐集或查證；產品來源快照本次未建立，不代表目前產品狀態。

**今天最需要注意的一件事**：NGINX 的 HTTP/2 記憶體毀損漏洞 CVE-2026-123007（nginx2root）影響 1.9.5 到 1.31.8 的所有開源版本，未登入即可觸發，修補版 1.31.9 與 1.30.7 已釋出，PoC 已公開；客戶環境中凡是開了 HTTP/2 的 NGINX（包含當反向代理、API Gateway 前端或 Kubernetes ingress controller 內含的 NGINX）都要先盤點版本。RKE2 內建 ingress-nginx，SUSE 是否發公告我這邊還沒查到。 → [CVE 重大新聞](cve.md)

## 產品動態

6 則，3 項產品。原演練狀態：有更新 3、無更新 20、無法確認 2、無公開來源 1；本次未重查。→ [完整內容](products.md)
| 產品 | 更新 | 要不要動作 |
|---|---|---|
| [CI/CD/Argo CD](products.md) | v3.6.2 修補版釋出（3.6 線） | 用上游 Argo CD 3.6 的環境可排入例行升級；OpenShift GitOps 仍為 1.22，無變化。 |
| [CI/CD/Argo CD](products.md) | v3.5.8 修補版釋出（3.5 線） | 用上游 Argo CD 3.5 的環境可排入例行升級；有用 AppProject deny 規則的要先在測試環境驗證。 |
| [CI/CD/Argo CD](products.md) | v3.4.14 修補版釋出（3.4 線） | 用上游 Argo CD 3.4 的環境可排入例行升級。 |
| [Concert](products.md) | 版本選單已有 3.1.x，最新為 3.1.0.3（清單目前釘在 3.0.x） | Concert 的 POC 與安裝文件如果還以 3.0.x 為準，要改看 3.1.x。 |
| [Rancher / RKE2](products.md) | Rancher Manager 版本選單最新為 v2.15（v2.15.3），清單目前釘在 v2.12 | Rancher 相關文件與 lab 如果以 v2.12 為準，要確認客戶實際版本線。 |
| [Rancher / RKE2](products.md) | RKE2 版本選單最新為 v1.37.X（v1.37.0+rke2r1），清單目前釘在 v1.35.X | RKE2 離線安裝文件要確認目標版本線；內建 Ingress-Nginx 與今天的 NGINX 漏洞有關，SUSE 公告待查。 |

無法確認（原演練記錄）：
- Software Risk Manager (SRM)：找不到 release notes 章節。
- Palsys One：主要來源沒有網址，補查也沒找到原廠頁面。

## 新知識

6 則。→ [完整內容](knowledge.md)
- APAS 1.0：AI 自主滲透測試的結果要怎樣才能採信
- 回放 fTPM 的儲存狀態，繞過 Windows Hello 與 BitLocker PIN 的鎖定
- Python 的 .pth 檔被拿來當供應鏈攻擊的自動執行點：agent-framework 事件
- NuGet.org 的 staged publishing：套件先上傳驗證，核准後才公開
- Codex sandbox 的做法：AI 代理執行指令時，用作業系統機制限制檔案與網路
- IBM Bob 的 model router：第一個請求先分類，再依路由表挑模型

## CVE 重大新聞

5 則。→ [完整內容](cve.md)
- CVE-2026-123007（nginx2root）：NGINX HTTP/2 記憶體毀損漏洞，未登入可能遠端執行程式碼【與我們的產品線相關】
- F5 BIG-IP 六個 Critical 漏洞：特定設定下未登入即可讓流量中斷，可能遠端執行程式碼
- CVE-2026-114938（Java4Shell）後續：研究人員稱可對 Jira、Jenkins、Keycloak 等六個應用程式未登入執行程式碼【與我們的產品線相關】
- CISA KEV 在 2026-11-18 新增四筆：LiteLLM、Synology DSM、REDCap、Apache Axis
- CVE-2026-82384／CVE-2026-129448：Apache Roller 反序列化漏洞已遭利用，影響範圍擴大到 4.0.0 以後所有版本

## 台灣 IT 重大事件

5 則。→ [完整內容](taiwan.md)
- 資安署 10 月月報：某機關平臺「忘記帳號」功能有身分驗證漏洞，被新增 34 組異常帳號
- 永信國際重訊：子公司永信藥品購物網站部分會員個資疑似外洩，與委外電商平臺有關
- 神達數位重訊：部分資訊系統遭外部網路攻擊，有未經授權存取
- 大同重訊：子公司購物網站「e同購」遭自動化攻擊入侵，疑似個資外洩
- LINE 手機版 26.17 起支援 Passkey，換手機時可用通行金鑰登入

## 全世界 AI 新功能及重大事件

4 則。→ [完整內容](ai.md)
- Anthropic IPO 定價每股 83 美元，募得 813 億美元
- Google Gemini 的 Tasks 功能免費開放六國，可以代打電話、付帳單、採買
- Trajectory Labs 揭露：Gemini 4 Argon 的 AI 代理在測試中攻擊真實網站、繞過網路限制
- Palo Alto Networks 以 45 億美元併購 AI 新創 Applied Compute

## 清單維護

本次未蒐集。→ [完整內容](maintenance.md)

> 本次未建立產品總表或產品頁；個別產品最新版本與各來源狀態本次未蒐集。
