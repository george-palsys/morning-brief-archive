# NKP

[← 26 項產品現況](README.md)

- 全名：Nutanix Kubernetes Platform
- 原廠：Nutanix
- 最後檢查：2026-11-28
- 當天狀態：無更新

## 各來源目前看到的最新一筆

| 來源 | 類別 | 工具 | 最新一筆 | 日期 | 檢查結果 |
|---|---|---|---|---|---|
| [Nutanix Community Product Updates（NKP 各版公告）](https://next.nutanix.com/product-updates) | 新版本 | — | Nutanix Kubernetes Platform (NKP) 2.19 | 2026-10-20 | 讀得到 |
| [Nutanix Security Advisories](https://portal.nutanix.com/page/security/security-advisories/list) | 安全公告 | — | #0066（清單日期 2026-11-26，共 65 筆；同批修訂 #0061、#0064、#0063、#0057） | 2026-11-26 | 讀得到 |

## 最近動態

新的在上面，每天往上累加，舊的不刪。

### 2026-11-27

- 安全公告：Nutanix Security Advisory #0066（Critical，Version 1.0；PDF 寫 Published: November 25, 2026，清單日期 Nov 26, 2026）。NGINX 的兩個 HTTP/2 漏洞 CVE-2026-123007、CVE-2026-123633，CVSS 4.0 為 9.2、CVSS 3.1 為 8.1。NKP 2.17.x、2.18.x、2.19.x 受影響；Workaround 寫「Under Investigation」，修正版寫「Fix Version and Release Date Pending」，下一次更新預定 December 10, 2026。同批修訂的舊公告：#0061 改到 Version 1.3（NKP 仍寫在 2.19.1 修正，NKP 2.18.x 待公布）、#0064 改到 Version 1.1（NKP Not Impacted）、#0063 改到 Version 1.1（NKP Not Impacted）、#0057 改到 Version 1.2（對象是 AOS 與 Prism Central）。來源：https://download.nutanix.com/alerts/Security_Advisory_0066.pdf → [當天產品動態](../daily/2026-11-27/products.md)
- 無法確認（個別項目，產品狀態不受影響）：公告 PDF 的表格欄位對應有一部分不能確定；NKP 裡是哪一個元件帶 NGINX，公告沒有寫；產品更新頁最新仍是 NKP 2.19，沒有看到 2.19.1 的發布公告。

### 2026-11-25

- 安全公告：Nutanix 公告清單最上面三筆換成 #0061（Critical，Nov 24, 2026 更新；CVE-2026-111497，CVSS 4.0 為 9.2；NKP 2.17.x、2.18.x、2.19.x 受影響，寫 Fixed in NKP 2.19.1）、#0065（High，Nov 24, 2026；CVE-2026-123158；NKP 列為 Not Impacted）、#0060（Critical，Nov 23, 2026 更新；eMudhra 中繼 CA；NKP 2.17.x 到 2.19.x 有列入，修正大多待公布）。來源：https://portal.nutanix.com/page/security/security-advisories/list → [當天產品動態](../daily/2026-11-25/products.md)
- 無法確認（個別項目，產品狀態不受影響）：三份公告 PDF 的表格欄位對應有一部分不能確定；產品更新頁最新仍是 NKP 2.19，沒有看到 2.19.1 的發布公告。

### 2026-11-22

- 安全公告：Nutanix Security Advisory #0064（OpenJDK「Java4Shell」，CVE-2026-114938 等 5 個，最高 CVSS 3.1 為 8.1），NKP 列為不受影響；AOS、Prism Central 等列為受影響、修補版本待公布，下一次更新預定 2026-11-25。NKP 版本沒有變，仍是 2.19。來源：https://download.nutanix.com/alerts/Security_Advisory_0064.pdf → [當天產品動態](../daily/2026-11-22/products.md)
