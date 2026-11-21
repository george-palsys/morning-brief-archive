# OpenShift

[← 26 項產品現況](README.md)

- 原廠：Red Hat
- 最後檢查：2026-11-21
- 當天狀態：有更新

## 各來源目前看到的最新一筆

| 來源 | 類別 | 工具 | 最新一筆 | 日期 | 檢查結果 |
|---|---|---|---|---|---|
| [OpenShift Container Platform 文件（各版 Release notes）](https://docs.redhat.com/en/documentation/openshift_container_platform/) | 新版本 | — | 5.0（最新 z-stream 5.0.1，RHSA-2026:94538） | 2026-11-09 | 已轉址 |
| [Red Hat Product Errata，以產品 OpenShift Container Platform 篩選](https://access.redhat.com/errata-search/) | 安全公告 | — | RHBA-2026:100764 | 2026-11-20 | 讀得到 |
| [Red Hat Security Bulletins(RHSB)](https://access.redhat.com/security/vulnerabilities/) | 安全公告 | — | RHSB-2026-021 | 2026-11-20 | 讀得到 |

## 最近動態

新的在上面，每天往上累加，舊的不刪。

### 2026-11-21

- 安全公告：Red Hat 發布 RHSB-2026-021（Ruby2Shell，CVE-2026-132825），評為 Critical、CVSS 3.1 為 9.8，OpenShift Container Platform 5 與 4 列為直接受影響。來源：https://access.redhat.com/security/vulnerabilities/RHSB-2026-021 → [當天產品動態](../daily/2026-11-21/products.md)
- 修補：RHBA-2026:100764，RHEL 8 為基礎的 Middleware Containers 映像更新（處理 RHSA-2026:100556）。來源：https://access.redhat.com/errata/RHBA-2026:100764 → [當天產品動態](../daily/2026-11-21/products.md)
- 無法確認（個別來源，產品狀態不受影響）：RHSB-2026-021 的 errata 清單沒有讀到；RHSB-2026-018、RHSB-2026-019、RHSB-2026-020 今天沒有重新打開。

### 2026-11-20

- 安全公告：Red Hat 發布 RHSB-2026-019：nginx HTTP/2、HTTP/3 堆積溢位等 5 個漏洞（NGINX2Root），評為 Critical，已有公開 PoC，修補尚未釋出。來源：https://access.redhat.com/security/vulnerabilities/RHSB-2026-019 → [當天產品動態](../daily/2026-11-20/products.md)
- 安全公告：RHSB-2026-018（CVE-2026-114938，OpenJDK）於 2026-11-19 更新，Red Hat 已開始釋出 OpenJDK 修正版 errata。來源：https://access.redhat.com/security/vulnerabilities/RHSB-2026-018 → [當天產品動態](../daily/2026-11-20/products.md)
- 安全公告：Red Hat 發布 RHSB-2026-020：PHP 7 個漏洞，其中 6 個評為 Critical，修補尚未釋出。來源：https://access.redhat.com/security/vulnerabilities/RHSB-2026-020 → [當天產品動態](../daily/2026-11-20/products.md)
- 生命週期：OpenShift Container Platform 4.12 的 Extended Update Support Term 3 將於 2027-01-17 結束（RHBA-2026:100683 終止前通知）。來源：https://access.redhat.com/errata/RHBA-2026:100683 → [當天產品動態](../daily/2026-11-20/products.md)
- 新版本：OpenShift 相關 errata 新增 5 筆容器映像更新（皆為 RHBA，2026-11-19，無嚴重度評級）。來源：https://access.redhat.com/errata/RHBA-2026:100719 → [當天產品動態](../daily/2026-11-20/products.md)
