# Confluent Platform

[← 26 項產品現況](README.md)

- 原廠：Confluent
- 最後檢查：2026-11-22
- 當天狀態：無更新

## 各來源目前看到的最新一筆

| 來源 | 類別 | 工具 | 最新一筆 | 日期 | 檢查結果 |
|---|---|---|---|---|---|
| [Confluent Platform Release Notes](https://docs.confluent.io/platform/current/release-notes/index.html) | 新版本 | — | Confluent Platform 8.4（最新 patch 8.4.1；Last updated: Nov 12, 2026） | 2026-11-12 | 讀得到 |
| [Security Advisories and Security Release Notes(Confluent Support Portal)](https://support.confluent.io/hc/en-us/sections/360008413952-Security-Advisories-and-Security-Release-Notes) | 安全公告 | — | CVE-2026-123633 and CVE-2026-12300 NGINX Vulnerabilities Notification（無 CONFSA 編號）；有編號的最新是 CONFSA-2026-37 | 2026-11-19 | 讀得到 |

## 最近動態

新的在上面，每天往上累加，舊的不刪。

### 2026-11-20

- 安全公告：CONFSA-2026-37：OpenJDK「Java4Shell」（CVE-2026-114938）影響 Confluent Platform，CP 映像檔尚無修補版，先加 JVM 參數緩解。來源：https://support.confluent.io/hc/en-us/articles/55810725278740-CONFSA-2026-37-CVE-2026-114938-Confluent-Cloud-and-Confluent-Platform-OpenJDK-vulnerability-Java4Shell → [當天產品動態](../daily/2026-11-20/products.md)
- 安全公告：Confluent 公告：NGINX 兩個未經驗證 RCE 漏洞不影響自管的 Confluent Platform。來源：https://support.confluent.io/hc/en-us/articles/55810997025556-CVE-2026-123633-and-CVE-2026-12300-NGINX-Vulnerabilities-Notification → [當天產品動態](../daily/2026-11-20/products.md)
- 無法確認（個別來源，產品狀態不受影響）：NGINX 通知的第二個 CVE 編號，標題寫 CVE-2026-12300、內文寫 CVE-2026-123007，哪一個正確未確認；兩則公告都沒有寫 CVSS 分數。
