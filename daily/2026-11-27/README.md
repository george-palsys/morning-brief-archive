# 晨報 2026-11-27（星期五）｜摘要

**今天最需要注意的一件事**：Nutanix 公告 #0066（Critical）：NGINX 的兩個 HTTP/2 漏洞，CVSS 4.0 為 9.2。NKP 2.17.x、2.18.x、2.19.x 受影響，修正版與緩解做法還沒公布，下次更新預定 December 10, 2026。先盤點對外的 NGINX 入口。 → [產品動態](products.md)

## 產品動態

26 項：有更新 3、無更新 21、無法確認 1、無公開來源 1。→ [完整內容](products.md)｜[26 項產品現況](../../products/README.md)

| 產品 | 更新 | 要不要動作 |
|---|---|---|
| [NKP](../../products/nkp.md) | Nutanix Security Advisory #0066（Critical，PDF 寫 November 25, 2026）：NGINX HTTP/2 的 CVE-2026-123007、CVE-2026-123633，NKP 2.17.x、2.18.x、2.19.x 受影響，修正版待公布 | 要。目前沒有修正版也沒有緩解做法；先盤點對外開放 HTTP/2 的 NGINX 入口，等 December 10, 2026 前後的更新 |
| [OpenShift](../../products/openshift.md) | RHSA-2026:103542（2026-11-25，Important）：DevWorkspace Operator 1.1.1，修 CVE-2026-78669（CVSS 3.1 為 7.5） | 有裝 DevWorkspace Operator 的叢集更新 operator；離線環境先鏡像新版映像。叢集本身不用動 |
| [Quantum Safe Explorer (QSE)](../../products/qse.md) | 2.3.3.1（2026-10-23 發布，安全與穩定性修正）；先前晨報漏列，今天補上 | 手上有 2.3.3 的環境可以排升級；文件裡寫「最新版 2.3.3」的地方要改 |

無法確認：

- [Software Risk Manager (SRM)](../../products/srm.md)：文件入口頁打得開，但 release notes 要登入才看得到，也沒有公開的安全公告頁。

## CVE 重大新聞

5 則。其中 2 則與我們的產品線相關。→ [完整內容](cve.md)

- CVE-2026-133323 等 5 個：Mitel MiCollab 的 AWV 元件五個漏洞被串連利用，全數列入 CISA KEV
- CVE-2026-133469：Xen Orchestra 把登入 cookie 設成空物件就能當管理員，已遭利用並列入 CISA KEV
- CVE-2026-136716：【後續】Drupal core 再發 Highly critical 公告 SA-CORE-2026-019，上一次的修補在特定狀態的網站上擋不住，已遭利用
- 【與我們的產品線相關】CVE-2026-46300：Linux kernel 本機提權漏洞 Fragnesia，Palo Alto 觀察到在對外開放的 PAN-OS 管理介面上被利用
- 【與我們的產品線相關】CVE-2026-121481：【後續】OpenSSL 預告 2026-12-01 釋出新版，這個漏洞的修補還在審查

## 新知識

5 則。今天是星期五，另有本週回顧與本週動手題。→ [完整內容](knowledge.md)

- AWS-LC：把所有服務收斂到同一個密碼函式庫，後量子演算法就變成例行升級
- RFC 10069：QUIC 多路徑擴充，一條連線同時走好幾條網路路徑
- ruby2shell（CVE-2026-132825）的機制：一個字元轉成大寫後變成兩個位元組，Ruby 只留了一個位元組的空間
- Zarf 1.0：把 Kubernetes 應用和它要的映像檔打包帶進隔離網路的開源工具
- Vault 在 Kubernetes 上的三項更新：etcd 加密用的 KMS、cert-manager 的 Vault issuer、機密即時更新

## 台灣 IT 重大事件

3 則。→ [完整內容](taiwan.md)

- PayNow 電子發票系統的對外 API 兩度遭異常存取，多家商家的消費者資料外洩
- 瓦城代子公司泰味國際發布資安重訊：委外的雲端發票平台遭異常存取，影響 290 人
- 【後續】刑事局示警：假冒短劇 App 的手機木馬盜轉網路銀行存款

## 全世界 AI 新功能及重大事件

3 則。→ [完整內容](ai.md)

- Anthropic：Claude 桌面版可以把 artifact 安裝成獨立的 App（beta），權限分三級
- OpenAI 傳出要合併 ChatGPT 的 Chat 與 Work 分頁，額度改成共用（只有媒體報導）
- AWS Sign-In 支援 Enterprise-Managed Authorization：由企業的身分提供者決定 AI agent 能不能連進 AWS

## 清單維護

- 來源清單（products.yaml）今天沒有修正，沒有送 PR。
- 今天打開 109 個來源，108 個讀得到，1 個回 404（NeuVector 在 SUSE 文件站的舊網址）。
- QSE 2.3.3.1 是在 What's new 頁讀到的，這一頁不在來源清單裡，要不要加進去留給 George 決定。
- NKP 公告 PDF 的表格欄位對應有一部分不能確定；OpenShift 其他 operator 的修正版沒有逐一查。

→ [完整內容](maintenance.md)
