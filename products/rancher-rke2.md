# Rancher / RKE2

[← 26 項產品現況](README.md)

- 原廠：SUSE
- 最後檢查：2026-11-26
- 當天狀態：有更新

## 各來源目前看到的最新一筆

| 來源 | 類別 | 工具 | 最新一筆 | 日期 | 檢查結果 |
|---|---|---|---|---|---|
| [Rancher Manager v2.15 Release Notes（以 v2.15.3 頁為入口）](https://documentation.suse.com/cloudnative/rancher-manager/v2.15/en/release-notes/v2.15.3.html) | 新版本 | — | v2.15.4 | 2026-11-25 | 讀得到 |
| [Rancher Manager v2.12 Release Notes（以 v2.12.9 頁為入口）](https://documentation.suse.com/cloudnative/rancher-manager/v2.12/en/release-notes/v2.12.9.html) | 新版本 | — | v2.12.16 | 2026-11-25 | 讀得到 |
| [RKE2 Release Notes（以 v1.37.X 頁為入口）](https://documentation.suse.com/cloudnative/rke2/latest/en/release-notes/v1.37.X.html) | 新版本 | — | v1.37.2+rke2r1 | 2026-11-05 | 讀得到 |
| [RKE2 Release Notes（以 v1.35.X 頁為入口）](https://documentation.suse.com/cloudnative/rke2/latest/en/release-notes/v1.35.X.html) | 新版本 | — | v1.35.10+rke2r1 | 2026-11-05 | 讀得到 |
| [Rancher Security Advisories and CVEs](https://ranchermanager.docs.rancher.com/reference-guides/rancher-security/security-advisories-and-cves) | 安全公告 | — | CVE-2026-88809 | 2026-10-29 | 讀得到 |
| [RKE2 GitHub Security](https://github.com/rancher/rke2/security) | 安全公告 | — | GHSA-x7xj-jvwp-97rv（最新一筆 2024-10-25） | 2024-10-25 | 讀得到 |
| [SUSE Rancher Security](https://www.suse.com/support/security/rancher-security/) | 安全公告 | — | 未記錄 | 頁面沒有日期 | 頁面沒有可比對的清單 |
| [rancher/rancher GitHub Security Advisories](https://github.com/rancher/rancher/security/advisories) | 安全公告 | — | GHSA-8x6f-2v58-x6p7 | 2026-10-29 | 讀得到 |

## 最近動態

新的在上面，每天往上累加，舊的不刪。

### 2026-11-26

- 新版本：Rancher v2.15.4、v2.14.8、v2.13.12、v2.12.16（GitHub Releases，2026-11-25）。v2.15.4 讓內建的 user 與 clusters-create 角色可以 get、list capiproviders 資源，release notes 提醒敏感資料放在 `.spec.credentials`。來源：https://documentation.suse.com/cloudnative/rancher-manager/v2.15/en/release-notes/v2.15.4.html → [當天產品動態](../daily/2026-11-26/products.md)
- 無法確認（個別項目，產品狀態不受影響）：v2.14.8 與 v2.13.12 的 release notes 沒有打開；GitHub Releases 的內文是空的。

### 2026-11-20

- 新版本：RKE2 v1.37.2+rke2r1 出現在文件站 release notes（Kubernetes v1.37.2）。來源：https://documentation.suse.com/cloudnative/rke2/latest/en/release-notes/v1.37.X.html → [當天產品動態](../daily/2026-11-20/products.md)
- 新版本：RKE2 v1.35.10+rke2r1 出現在文件站 release notes，Traefik chart 升到 v40.x 有破壞性變更。來源：https://documentation.suse.com/cloudnative/rke2/latest/en/release-notes/v1.35.X.html → [當天產品動態](../daily/2026-11-20/products.md)
- 安全公告（建立基準時看到，不算當天更新）：新找到的 rancher/rancher GitHub advisories 頁，最新一批 GHSA-8x6f-2v58-x6p7 等，與 Rancher CVE 表格 10-29 那批（CVE-2026-88809 等）同日。不在最近 7 天內，不列為更新。來源：https://github.com/rancher/rancher/security/advisories
