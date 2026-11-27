# Instana

[← 26 項產品現況](README.md)

- 原廠：IBM
- 最後檢查：2026-11-28
- 當天狀態：有更新

## 各來源目前看到的最新一筆

| 來源 | 類別 | 工具 | 最新一筆 | 日期 | 檢查結果 |
|---|---|---|---|---|---|
| [Instana What's new](https://www.ibm.com/docs/en/instana-observability/saas?topic=notes-whats-new) | 新版本 | — | 1.0.329 | 2026-11-02 | 讀得到 |
| [Instana Release notes(SaaS)](https://www.ibm.com/docs/en/instana-observability/saas?topic=release-notes) | 新版本 | — | Self-Hosted Standard Edition 1.15.1 / Custom Edition 1.12.1 / Classic 329 | 2026-11-11 | 讀得到 |
| [Standard Edition release notes(Self-Hosted)](https://www.ibm.com/docs/en/instana-observability/standard/1.0.329?topic=releases-standard-edition-release-notes) | 新版本 | — | 1.15.1 | 2026-10-20 | 讀得到 |
| [Instana Security and compliance](https://www.ibm.com/docs/en/instana-observability/saas?topic=notes-security-compliance) | 安全公告 | — | 頁面 Last Updated 2026-08-27 | 2026-08-27 | 讀得到 |
| [Deprecated and removed features](https://www.ibm.com/docs/en/instana-observability/saas?topic=notes-deprecated-removed-features) | 生命週期 | — | 頁面 Last Updated 2026-11-05 | 2026-11-05 | 讀得到 |
| [IBM Security Bulletins（查詢名稱 Instana）](https://www.ibm.com/support/pages/bulletin/) | 安全公告 | — | node/7298440 | 2026-11-27 | 讀得到 |

## 最近動態

新的在上面，每天往上累加，舊的不刪。

### 2026-11-28

- 安全公告：IBM Security Bulletin node/7298440（2026-11-27）「Multiple vulnerabilities in IBM Observability with Instana (OnPrem)」，自架版 Build 1.0.285 到 1.0.327 受影響，摘要寫修在 build 1.0.329；公告列 70 個 CVE，和 node/7297963 列的沒有重複。分數最高的是 8.7（CVSS 4.0，評分來源 security@apache.org），共四個，都在 Apache Thrift 的 NodeJS binding：CVE-2026-83745、CVE-2026-86535、CVE-2026-94646、CVE-2026-96294；另有 Eclipse Jetty 的 CVE-2026-19203（8.3，CVSS 4.0）與 CVE-2026-1605。來源：https://www.ibm.com/support/pages/node/7298440 → [當天產品動態](../daily/2026-11-28/products.md)
- 無法確認（個別項目，產品狀態不受影響）：70 個 CVE 沒有逐一抄錄；公告的修補說明欄位沒有讀到，「修在 build 1.0.329」出自公告摘要。

### 2026-11-25

- 安全公告：IBM Security Bulletin node/7297963（2026-11-24）「Multiple vulnerabilities in IBM Observability with Instana (OnPrem)」，自架版 Build 1.0.285 到 1.0.327 受影響，修在 build 1.0.329；公告列出的 CVE 包括 CVE-2023-4860（CVSS 9.6，NVD）、CVE-2024-7966（CVSS 8.8，CISA ADP）、CVE-2026-9998。來源：https://www.ibm.com/support/pages/node/7297963 → [當天產品動態](../daily/2026-11-25/products.md)
- 無法確認（個別項目，產品狀態不受影響）：公告的完整 CVE 清單沒有逐一抄錄。
