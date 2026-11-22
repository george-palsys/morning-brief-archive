# 晨報 2026-11-22（星期日）｜摘要

**今天最需要注意的一件事**：NeuVector 在 2026-11-20 一次發布四則安全公告，其中兩則 Critical（CVE-2026-127182，CVSS 4.0 為 9.4；CVE-2026-127183，CVSS 4.0 為 9.2），修正都在 Enforcer 映像，修補版本 5.7.0、5.6.5、5.5.6。公告沒有提到已遭利用；離線環境的客戶要先把新版映像搬進私有 registry 才能升級。 → [產品動態](products.md)

## 產品動態

26 項：有更新 4、無更新 20、無法確認 1、無公開來源 1。→ [完整內容](products.md)｜[26 項產品現況](../../products/README.md)

| 產品 | 更新 | 要不要動作 |
|---|---|---|
| [NeuVector](../../products/neuvector.md) | 四則安全公告：CVE-2026-127182（Critical，CVSS 4.0 為 9.4）、CVE-2026-127183（Critical，9.2）、CVE-2026-127181（High，7.2）、CVE-2026-127180（Moderate，4.1） | 5.6 的環境升到 5.6.5、5.5 的環境升到 5.5.6 或直接上 5.7.0；scanner 要 4.331 以上 |
| [NeuVector](../../products/neuvector.md) | 5.7.0 新版本（2026-11-20），同時釋出 5.6.5 與 5.5.6；log 改為 JSON 格式 | 有解析 NeuVector log 的環境，升級後檢查解析規則 |
| [Concert](../../products/concert.md) | Security Bulletin 7297667：56 個 CVE，最高 CVSS 9.8（CVE-2026-96760），受影響版本 1.0 到 3.0.1.1 | 還在 3.0.1.1 以前的環境排升級到 3.1.0；3.1.0 以上不需要動作 |
| [NKP](../../products/nkp.md) | Nutanix Security Advisory #0064（OpenJDK「Java4Shell」，最高 CVSS 3.1 為 8.1），NKP 列為不受影響 | NKP 不需要動作；底層的 AOS、Prism Central 受影響且修補版本待公布，追 2026-11-25 的更新 |
| [OpenShift](../../products/openshift.md) | 七張 RHBA（2026-11-21），各版本的 dpdk-base extras 映像更新；沒有新的 RHSA | 有用 dpdk-base 映像的應用重新拉映像或重新 build；叢集本身不用動 |

無法確認：Software Risk Manager (SRM)（文件入口頁打得開，但 release notes 要登入才能看，也沒有公開的安全公告頁）。

## CVE 重大新聞

6 則。其中 2 則（NeuVector、Concert）併入產品動態。→ [完整內容](cve.md)

- NeuVector 四則安全公告：CVE-2026-127182（CVSS 4.0 為 9.4）、CVE-2026-127183（9.2）等【與我們的產品線相關】
- IBM Concert Software 56 個 CVE，最高 CVSS 9.8（CVE-2026-96760）【與我們的產品線相關】
- CISA KEV 於 2026-11-20 新增四個漏洞：SAP NetWeaver（CVE-2025-42884）、VMware vCenter、Cisco Expressway、Apache Roller（後三個為後續）
- CVE-2026-129975：GnuPG 的 GPGME 函式庫 double free，官方稱為 critical，修補版本 GPGME 2.3.1
- CVE-2026-99312：Linux KVM 在 AMD 巢狀虛擬化下，虛擬機可以讀寫 host 記憶體
- CVE-2026-133968：MONAI Label 路徑穿越可任意寫檔（CVSS 3.1 為 9.8），被 AI 代理自行找到並用於入侵，目前沒有修補版本

## 新知識

5 則。→ [完整內容](knowledge.md)

- 量子位置驗證（QPV）：NIST 首次以無漏洞的 Bell test 證明「人真的在那個地點」
- CVE-2026-99312 的機制：KVM 在 AMD 巢狀虛擬化下模擬 INIT 時沒有重設 MMU，guest 可以碰到 host 的記憶體
- OpenTelemetry Collector 的五個常見耗能設定：批次、屬性、輪詢、取樣、記憶體保護的順序
- PostgreSQL 19 的 `REPACK (CONCURRENTLY)`：資料表重整時不再擋讀寫
- 產品跑在客戶自管的 Kubernetes 上，支援範圍要怎麼訂

## 台灣 IT 重大事件

4 則。→ [完整內容](taiwan.md)

- 金管會宣布 5 項穩定股市措施，2026-11-23 起全面禁止平盤以下放空
- 刑事局揭露詐騙集團話務轉接新手法：一般 Android 手機加撥號 APP 就能當中繼站
- 國內首座 6G 實驗網 6G-FORMOSA 啟用，串聯歐盟、英國實驗網與衛星營運商
- 網擎資訊（Openfind）投資資安演練廠商微智安聯，取得 37.6% 股權

## 全世界 AI 新功能及重大事件

3 則。→ [完整內容](ai.md)

- Signal 預設擋下作業系統內建 AI 代理的螢幕擷取，並坦承這個防護不完整
- Anthropic 數學家宣稱與 Claude 合作證明黎曼猜想，尚未經獨立驗證
- 川普揚言對把 AI 資料中心蓋在美國境外的企業課「tremendous tax」

## 清單維護

- NeuVector 的 5.x release notes 舊網址回 404，來源已改為 NeuVector 官方文件站，修正已合併：https://github.com/george-palsys/morning-brief-archive/pull/38
- 今天成功讀到 101 個來源；6 個沒有成功重新讀到（SUSE 的 Rancher 安全頁標題變了、JBoss EAP 三個頁面、HashiCorp trust 頁回 429），沿用上次紀錄。
- BleepingComputer、SecurityWeek、TechCrunch AI 的 feed 今天回 403，這三個來源的新聞沒有讀到。

→ [完整內容](maintenance.md)
