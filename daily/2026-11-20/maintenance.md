# 清單維護｜2026-11-20

[← 今日摘要](README.md)｜[產品動態](products.md)｜[新知識](knowledge.md)｜[CVE](cve.md)｜[台灣 IT](taiwan.md)｜[AI](ai.md)｜[清單維護](maintenance.md)｜[26 項產品現況](../../products/README.md)

## 來源清單修正（products.yaml）

今天的修正已送出並合併：https://github.com/george-palsys/morning-brief-archive/pull/18

- 把今天實際打開、讀得到內容的 32 個來源由「搜尋到、未確認」改為已確認（verified_on: 2026-11-20）。
- 換網址或補網址的 8 筆、新增來源 4 筆、修改查詢名稱 1 筆，逐項列在 PR 說明。
- Software Risk Manager (SRM) 的來源沒有改：候選的 changelog 頁沒有打開，維持未確認。
- JBoss EAP 8.1 各次 Update 的網址補上 https://access.redhat.com/articles/7149700，內容需要訂閱登入、沒有讀，狀態維持未確認（searched）。

## 一、今天實際打開並確認的來源

- Coverity：讀得到新聞稿清單（含日期）。多為公司新聞，很少有產品版本資訊。 網址：https://news.blackduck.com/
- Coverity：讀得到，March 26, 2026 的單篇公告。 網址：https://www.blackduck.com/blog/coverity-connect-cve-2026-1496-security-advisory.html
- Black Duck SCA：讀得到，政策頁，沒有公告清單。 網址：https://www.blackduck.com/company/legal/security-commitments.html
- NeuVector：讀得到，5.x release notes，日期只到月份。 網址：https://documentation.suse.com/cloudnative/security/latest/en/5x.html
- NeuVector：讀得到，郵件清單訂閱頁，沒有清單可比對。 網址：https://lists.suse.com/mailman/listinfo/neuvector-updates
- NeuVector / Rancher / RKE2：讀得到，只是入口頁，沒有公告清單。 網址：https://www.suse.com/support/security/rancher-security/
- AppScan：讀得到，內容正確。 網址：https://help.hcl-software.com/appscan/Standard/10.12.0/r_WhatsNew001.html
- AppScan：讀得到，內容正確。 網址：https://help.hcl-software.com/appscan/Enterprise/10.12.0/topics/r_whats_new.html
- AppScan / Palsys One：讀得到，內容正確。 網址：https://help.hcl-software.com/appscan/360/2.2.0/360_whats_new.html
- CI/CD（Jenkins）：讀得到，LTS changelog。 網址：https://www.jenkins.io/changelog-stable/
- Vault：檔案存在；用 https://raw.githubusercontent.com/hashicorp/vault/main/CHANGELOG.md 讀取比較穩。 網址：https://github.com/hashicorp/vault/blob/main/CHANGELOG.md
- Bob：讀得到，內容正確。 網址：https://bob.ibm.com/docs/ide/changelog
- Bob：讀得到，內容正確。 網址：https://bob.ibm.com/docs/shell/changelog
- Bob：讀得到，內容正確。 網址：https://bob.ibm.com/blog/
- Bob：讀得到，內容正確。 網址：https://bob.ibm.com/blog/rss.xml
- Rancher / RKE2：讀得到；目錄列到 v2.12.15。 網址：https://documentation.suse.com/cloudnative/rancher-manager/v2.12/en/release-notes/v2.12.9.html
- Rancher / RKE2：讀得到，CVE 表格含日期與修補版本。 網址：https://ranchermanager.docs.rancher.com/reference-guides/rancher-security/security-advisories-and-cves
- Rancher / RKE2：讀得到。 網址：https://github.com/rancher/rke2/security
- NKP：讀得到，各則有發布時間（UTC）。 網址：https://next.nutanix.com/product-updates
- Confluent Platform：讀得到，免登入；清單頁無日期，個別文章有 Published 時間（PST）。 網址：https://support.confluent.io/hc/en-us/sections/360008413952-Security-Advisories-and-Security-Release-Notes
- Concert：Concert 3.0.x release notes 是索引頁，本身沒有版本清單；版本選單最新 3.1.x（清單已收錄 3.1.x What's new）。roadmap 頁開得到但沒有可比對的清單。 網址：https://www.ibm.com/docs/en/concert/3.0.x?topic=release-notes
- Black Duck SCA：SCA release notes 的實際頁面已開啟確認，顯示 Version 2026.7.2。 舊網址：https://docs.blackduck.com/ 新網址：https://docs.blackduck.com/r/blackduck/latest/black-duck-documentation/black-duck-sca-release-notes.html
- Seeker：Seeker release notes 的實際頁面已確認，最新 2026.5.1。 舊網址：https://docs.blackduck.com/ 新網址：https://docs.blackduck.com/r/seeker/latest/release-notes/release-notes.html

## 二、失效或搬家的網址

- MQ：舊網址仍可用，會轉到新網址；建議改用轉址後的網址。 舊網址：https://www.ibm.com/docs/SSFKSJ_9.4.0/overview/mq_newchgd_cd.html 新網址：https://www.ibm.com/docs/en/ibm-mq/9.4.x?topic=am-whats-new-changed-in-mq-94x-continuous-delivery
- MQ：舊網址仍可用，會轉到新網址；建議改用轉址後的網址。 舊網址：https://www.ibm.com/docs/SSFKSJ_9.4.0/overview/mq_newchgd_initial.html 新網址：https://www.ibm.com/docs/en/ibm-mq/9.4.x?topic=mq-whats-new-changed-in-940
- Turbonomic：8.16.x 仍轉到 8.21.5（與昨天相同）；版本選單只有 8.21.5、8.21.0。 舊網址：https://www.ibm.com/docs/en/tarm/8.16.x?topic=notes-whats-new 新網址：https://www.ibm.com/docs/en/tarm/8.21.5?topic=notes-whats-new
- GCM：2.0.x 網址會轉到 2.0.0，內容相同；版本選單最新仍是 2.0.x，沒有更新的版本。 舊網址：https://www.ibm.com/docs/en/guardium-cm/2.0.x?topic=release-notes 新網址：https://www.ibm.com/docs/en/guardium-cm/2.0.0?topic=release-notes

## 三、新找到的來源

下面寫「建議」的項目是檢查當下的紀錄，哪些已經納入今天的修正，以上面那個 PR 的說明為準。

- Palsys One（AppScan on Cloud）：HCL 網域搜尋找到並打開：What's new in AppScan on Cloud，條目以「New on <日期>」分段，最新 New on November 19, 2026。建議填入 id 25 的 null 來源。 網址：https://help.hcl-software.com/appscan/ASoC/appseccloud_whats_new_cm.html
- Rancher / RKE2：SUSE Rancher Security 入口頁指向的 Rancher 本體 GitHub advisories 頁（未在清單，已打開）：最新一批 GHSA-8x6f-2v58-x6p7 等，2026-10-29，只建立基準。建議加入 id 22 的安全來源。 網址：https://github.com/rancher/rancher/security/advisories
- Instana：Self-Hosted Standard Edition release notes（原本 url: null）找到並開啟確認：最新 build 1.15.1(2026-10-20)，Last Updated 2026-11-10，已建立基準。網址帶文件版本 1.0.329，建議標 version_specific: true、fetch: browser；文件入口 https://www.ibm.com/docs/en/instana-observability/standard 會列出各版本（今天最新 1.0.329）。 網址：https://www.ibm.com/docs/en/instana-observability/standard/1.0.329?topic=releases-standard-edition-release-notes
- Coverity：找到 Coverity 地端版 release notes，比 Polaris release notes 更直接反映 Coverity 版本；今日已出現 2026.9.1。建議新增為 Coverity 的 release 來源。 舊網址：https://docs.blackduck.com/r/polaris/black-duck-polaris-platform/polaris-release-notes.html 新網址：https://docs.blackduck.com/r/coverity/latest/coverity-documentation/coverity-current-release-notes.html
- JBoss EAP：「JBoss Enterprise Application Platform 8.1 Update 9.1 Release Notes」，Updated 2026-11-11，內容需訂閱登入。另有 https://access.redhat.com/articles/7039745「JBoss EAP 8 Maintenance Schedule」（Updated 2026-11-12，需訂閱；可見摘要寫 EAP 8.0 Update 12 為最後一個 8.0 Update，之後須移到 8.1）。 網址：https://access.redhat.com/articles/7149700

## 四、第一次檢查、只建立基準的來源

- Palsys One（AppScan on Cloud）：建立基準：last_seen_marker「New on November 19, 2026」，日期 2026-11-19。 網址：https://help.hcl-software.com/appscan/ASoC/appseccloud_whats_new_cm.html
- CI/CD（Flux）：建立基準：GHSA-mwcp-qpcg-fr7c，2026-08-11。 網址：https://github.com/fluxcd/flux2/security/advisories
- CI/CD（Harbor）：建立基準：GHSA-w5fq-xrhj-j7g2，2026-10-06。 網址：https://github.com/goharbor/harbor/security/advisories

## 五、版本選單出現的新版本

- AppScan：試開下一版路徑都回 HCL 404 頁：Standard/10.13.0、Enterprise/10.13.0、360/2.2.1、360/2.3.0、360/3.0.0。目前沒有新版文件。
- NeuVector：版本選單有 5.7 （Unreleased），尚未發布，不列為更新。 網址：https://documentation.suse.com/cloudnative/security/latest/en/5x.html
- Rancher / RKE2：RKE2 v1.36.X 頁（未在清單）：最新 v1.36.6+rke2r1，Nov 05 2026。發布早於上一份晨報，只建立基準。 舊網址：https://documentation.suse.com/cloudnative/rke2/latest/en/release-notes/v1.37.X.html 新網址：https://documentation.suse.com/cloudnative/rke2/latest/en/release-notes/v1.36.X.html
- Rancher / RKE2：RKE2 v1.34.X 頁（未在清單）：最新 v1.34.13+rke2r1，Nov 05 2026。發布早於上一份晨報，只建立基準。v1.38.X 頁回 404，選單最高仍是 v1.37.X。 舊網址：https://documentation.suse.com/cloudnative/rke2/latest/en/release-notes/v1.35.X.html 新網址：https://documentation.suse.com/cloudnative/rke2/latest/en/release-notes/v1.34.X.html
- Rancher / RKE2：Rancher 其他版本線（未在清單）：v2.14 線最新 v2.14.7、v2.13 線最新 v2.13.11，都早於上一份晨報，只建立基準。v2.16 仍標 Unreleased，頁面沒有版本條目。 網址：https://documentation.suse.com/cloudnative/rancher-manager/v2.15/en/release-notes/v2.15.3.html
- JBoss EAP：版本選單仍有 8.2-Beta，尚未 GA，不列為更新。 網址：https://docs.redhat.com/en/documentation/red_hat_jboss_enterprise_application_platform/8.1

## 六、IBM 安全公告的查詢名稱

- AppScan：AppScan 安全公告清單頁仍未找到。HCL 的 Security Bulletin 是 support.hcl-software.com 的個別 KB 文章（例 KB0077916 開得到）；清單在 my.hcl-software.com（JavaScript 應用，直接抓取只有空殼，是否免登入未確認）。（未確認，網址沒有實際打開）
- WebSphere Application Server：公告清單用「IBM WebSphere Application Server」查，只回「IBM WebSphere Application Server in IBM Cloud」321 筆（最新 2021-04-09）；要用不帶 IBM 的「WebSphere Application Server」才查得到本產品（928 筆，最新 node/7295357）。 網址：https://www.ibm.com/support/pages/bulletin/
- WebSphere Liberty：公告清單用「IBM WebSphere Application Server Liberty」查會回 2000 筆（疑似上限）且混入其他產品；用不帶 IBM 的「WebSphere Application Server Liberty」只回本產品 18 筆，結果較乾淨。 網址：https://www.ibm.com/support/pages/bulletin/
- Concert：「IBM Concert Software」今天查得到（1,715 筆，最新 node/7296252,2026-11-10），近期的 Concert 公告都掛在這個產品名下；「IBM Concert」只有 22 筆且停在 2024-08-29。建議以後以「IBM Concert Software」為主，已建立基準（建議鍵值 https://www.ibm.com/support/pages/bulletin/#IBM Concert Software）。 網址：https://www.ibm.com/support/pages/bulletin/
- GCM / QSE / Bob：查得到的正式名稱：「IBM Guardium Cryptography Manager」（116 筆）、「IBM Quantum Safe Explorer」（159 筆）、「IBM Bob」（75 筆）。 網址：https://www.ibm.com/support/pages/bulletin/

## 七、其他觀察

- AppScan：Standard 有不帶版本號的 /latest/ 路徑（開得到），但最上面一節是 10.12.0、沒有 10.12.1，內容比帶版本號的頁舊，暫不建議取代。Enterprise 與 360 的 /latest/ 回 404。各產品現行文件版本可看 https://help.hcl-software.com/appscan/Welcome.html（Standard／Enterprise 10.12.0、360 2.2.0）。 舊網址：https://help.hcl-software.com/appscan/Standard/10.12.0/r_WhatsNew001.html 新網址：https://help.hcl-software.com/appscan/Standard/latest/r_WhatsNew001.html
- CI/CD（GitLab）：最新一筆是從同站的 feed all-releases.xml 讀的（含月度版與 patch release，有日期）。建議把 feed 加進來源或寫進 note。 舊網址：https://docs.gitlab.com/releases/ 新網址：https://docs.gitlab.com/releases/all-releases.xml
- Rancher / RKE2：GitHub rancher/rke2（不是清單內的來源，僅供參考）：v1.32.13+rke2r3 發布於 2026-11-17 05:30 台北（舊版本線，不在追蹤的兩頁）；v1.36.6-rc1+rke2r2 為 RC（2026-11-20 09:14 台北），不是正式版，不列為更新。 網址：https://github.com/rancher/rke2/releases
- Confluent Platform：這頁的 patch 段落會列 8.4.x（目前 8.4.1），建議 last_seen_marker 改記到 patch 版號，否則 patch 更新比不出來。 網址：https://docs.confluent.io/platform/current/release-notes/index.html
- Vault：直接抓取回 429，瀏覽器開得到；總覽頁，沒有公告清單，應記 no_list 而不是 unreachable。 網址：https://www.hashicorp.com/en/trust/security
- Turbonomic：sources.json 裡這個來源上次的紀錄掛在較舊的 /aiops/ 網址下；這次以 products.yaml 的網址打開，內容相同。 網址：https://community.ibm.com/community/user/viewdocument/turbonomic-latest-releases-downlo
- CI/CD（Azure DevOps）：sources.json 裡上次的紀錄掛在較舊的網址下；這次以 products.yaml 的網址打開，最新仍是 Patch 9。 網址：https://learn.microsoft.com/en-us/azure/devops/server/release-notes/azuredevopsserver?view=azure-devops
- IBM Security Bulletins：公告清單頁的搜尋實際呼叫同站的 /support/pages/securityapp/api/search?q=<產品名>（JSONP）。瀏覽器開著清單頁時在頁面內呼叫，每個產品約 1–40 秒有回應，今天 10 個產品全部有回應；回傳未依日期排序，要自己依 Publish Date 排序。 舊網址：https://www.ibm.com/support/pages/bulletin/ 新網址：https://www.ibm.com/support/pages/securityapp/api/search?q=<產品名>
- MQ：頁面 Last Updated 今天讀到 2026-10-22，昨天紀錄是 2026-06-16；日期早於上一份晨報，頁面沒有新版本條目，只更新紀錄，不當產品動態。 網址：https://www.ibm.com/docs/en/ibm-mq/10.0.x?topic=mq-whats-new-changed-in-1000
- QSE：release notes 頁是索引頁，版本與發布日寫在子頁 What's new；建議把 What's new 子頁加進清單。範例公告網址（…multiple-vulnerabilities-1）開得到，但它是 2026-08-13 的 node/7283615，不是最新一則。 舊網址：https://www.ibm.com/docs/en/quantum-safe/quantum-safe-explorer/2.x?topic=release-notes 新網址：https://www.ibm.com/docs/en/quantum-safe/quantum-safe-explorer/2.x?topic=notes-whats-new
- Software Risk Manager (SRM)：SRM 文件集可開啟，但沒有 release notes 章節，無法作為版本來源。搜尋結果顯示 community.blackduck.com 有 SRM Changelog 公告，未開啟確認，可作為候選來源再查。 舊網址：https://docs.blackduck.com/ 新網址：https://docs.blackduck.com/r/srm/latest/software-risk-manager-documentation.html（未確認，網址沒有實際打開）
- OpenShift / JBoss EAP / JBCS httpd：errata-search 是 SPA，直接抓取讀不到清單；其後端查詢 API 可直接讀取（以 documentKind:Errata 加 portal_product_filter 篩選）。EAP 的產品篩選名稱是「JBoss Enterprise Application Platform」，不帶 Red Hat 前綴。 舊網址：https://access.redhat.com/errata-search/ 新網址：https://access.redhat.com/hydra/rest/search/kcs
- Black Duck 部落格：此分類頁回 404，不是可用來源。 網址：https://www.blackduck.com/blog/category.security-advisories.html

## 建立基準時看到的安全公告（不算當天更新）

- CI/CD/Flux：建立基準時看到的最新公告：GHSA-mwcp-qpcg-fr7c（Improper network isolation allows event spoofing, DoS and unauthorized status updates）。不在最近 7 天內，不列為更新。網址：https://github.com/fluxcd/flux2/security/advisories
- CI/CD/Harbor：建立基準時看到的最新公告：GHSA-w5fq-xrhj-j7g2（A system robot with user:update makes itself a system administrator）。不在最近 7 天內，不列為更新。網址：https://github.com/goharbor/harbor/security/advisories
- Rancher / RKE2：新找到的 rancher/rancher GitHub advisories 頁，最新一批 GHSA-8x6f-2v58-x6p7 等，與 Rancher CVE 表格 10-29 那批（CVE-2026-88809 等）同日。不在最近 7 天內，不列為更新。網址：https://github.com/rancher/rancher/security/advisories
- Concert：以「IBM Concert Software」查到的最新公告：Multiple Vulnerabilities in IBM Concert Software(node/7296252)；建立基準，不在最近 7 天內，未逐則打開。網址：https://www.ibm.com/support/pages/node/7296252
- 3scale：3scale 產品頁 Latest security advisories 今日建立基準（清單無日期）：CVE-2026-128085（Moderate，OpenTelemetry-Go 服務中斷）、CVE-2026-126063（Moderate，Nokogiri XSS）、CVE-2026-119025（Important，open 套件在 Windows/WSL 的程式碼執行）。網址：https://access.redhat.com/products/red-hat-3scale-api-management
- 3scale：3scale errata 今日建立基準：最新為 RHEA-2026:74448（3scale 2.15.6 容器映像，2026-10-01）；2.16 線最新為 RHEA-2026:37394（2.16.4，2026-07-09）。網址：https://access.redhat.com/errata/RHEA-2026:74448

## 沒有更新到的產品頁

沒有，26 個產品頁今天全部重寫。
