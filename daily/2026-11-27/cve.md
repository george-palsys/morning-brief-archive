# CVE 重大新聞｜2026-11-27

[← 今日摘要](README.md)｜[產品動態](products.md)｜[新知識](knowledge.md)｜[CVE](cve.md)｜[台灣 IT](taiwan.md)｜[AI](ai.md)｜[清單維護](maintenance.md)｜[26 項產品現況](../../products/README.md)

和我們產品線直接相關、而且有原廠公告的漏洞今天寫在[產品動態](products.md)：NKP（CVE-2026-123007、CVE-2026-123633）、OpenShift 的 DevWorkspace Operator（CVE-2026-78669）。下面 5 則裡有幾則的原廠公告日期早於 2026-11-26，收進來是因為 CISA 在台北時間 2026-11-26 凌晨把它們列入 KEV，或是有新的後續；日期一律照來源頁面寫。

### CVE-2026-133323 等 5 個：Mitel MiCollab 的 AWV 元件五個漏洞被串連利用，全數列入 CISA KEV

- 發生什麼事：Mitel 的統一通訊產品 MiCollab，AWV 元件有五個漏洞：CVE-2026-133323（OS command injection）、CVE-2026-133303（XML injection）、CVE-2026-133275（可上傳危險類型的檔案）、CVE-2026-133311（驗證強度不足）、CVE-2026-133324（失敗時沒有安全地擋下）。CISA 在 2026-11-25 把五個都列入 KEV。原廠公告 MISA-2026-0012 的 First Issue Date 是 2026-11-16，Last Updated 是 2026-11-24（Revision 2.0）。
- 受影響版本：MiCollab「10.3 (10.3.0.18) and earlier」。
- 嚴重度：Mitel 評的 CVSS 3.1：CVE-2026-133323 為 10.0（Critical），CVE-2026-133303 為 9.0（Critical），CVE-2026-133275 為 5.3，CVE-2026-133311 為 5.9，CVE-2026-133324 為 5.3。NVD 對 CVE-2026-133323 另評 9.8；其餘四個的 NVD 分數沒有查。
- 是否已有修補：有。原廠提供 10.3 (10.3.0.18) 的修補程式，做法寫在 Mitel 的 KB000129195；緩解做法是限制外部對 AWV 元件的存取。
- 攻擊現況：已遭利用（列入 KEV）。KEV 的修補期限：CVE-2026-133323、CVE-2026-133303、CVE-2026-133275、CVE-2026-133324 是 2026-11-28，CVE-2026-133311 是 2026-12-09。The Hacker News（Nov 26, 2026）轉述 Accenture 的說法：有受害者在修補釋出前一天就被植入 web shell，攻擊者在 30 分鐘內取得 root；這些細節只在這篇報導看到，原始報告沒有打開。
- 影響：和我們的產品線沒有直接關係。客戶有用 MiCollab、而且 AWV 對外開放的，要立刻套修補並檢查有沒有 web shell。
- 來源：https://www.mitel.com/support/security-advisories/mitel-product-security-advisory-misa-2026-0012 ；https://www.cisa.gov/news-events/alerts/2026/11/25/cisa-adds-10-known-exploited-vulnerabilities-catalog ；https://thehackernews.com/2026/11/hackers-exploit-10-vulnerabilities.html

### CVE-2026-133469：Xen Orchestra 把登入 cookie 設成空物件就能當管理員，已遭利用並列入 CISA KEV

- 發生什麼事：Vates 的虛擬化管理平台 Xen Orchestra，送出 `authenticationToken=j:%7B%7D` 這個 cookie 會被解析成空物件 `{}`，系統把它當成沒有條件的查詢，回傳第一個登入權杖，攻擊者因此取得 Admin 權限，可以進一步在受管理的 pool 上執行任意程式，以 root 接管 XCP-ng 節點。原廠公告 VSA-2026-062 的 Published 與 Updated 都是 2026-11-10；CISA 在 2026-11-25 列入 KEV。
- 受影響版本：Xen Orchestra 6.9.2（stable）之前與 6.10.1（latest）之前的版本，以及 Xen Orchestra Appliance。
- 嚴重度：Vates 頁面寫 Severity Critical，CVSS 4.0 寫「Not available yet」。NVD 列的是 GitHub 給的 CVSS 3.1 為 9.8（Critical）。
- 是否已有修補：有。6.9.2（stable）與 6.10.1（latest）。緩解做法：不要把 Xen Orchestra 開放到網際網路、放在專用的管理網段、封鎖公告列出的來源 IP。
- 攻擊現況：已遭利用。原廠公告寫明已有實際攻擊；KEV 的修補期限是 2026-11-28。
- 影響：和我們的產品線沒有直接關係。客戶用 XCP-ng 與 Xen Orchestra 當虛擬化平台的要立刻升級；這個漏洞的成因（把使用者送來的物件直接當查詢條件）在別的系統也可能出現。
- 來源：https://docs.vates.tech/security-advisories/advisories/2026/vates-sa-2026-062/ ；https://www.cisa.gov/news-events/alerts/2026/11/25/cisa-adds-10-known-exploited-vulnerabilities-catalog

### CVE-2026-136716：【後續】Drupal core 再發 Highly critical 公告 SA-CORE-2026-019，上一次的修補在特定狀態的網站上擋不住，已遭利用

- 發生什麼事：這是 2026-11-25 晨報寫的 CVE-2026-132165（SA-CORE-2026-017）的後續。Drupal 在 2026-November-25 發布 SA-CORE-2026-019：處於不尋常或沒有完成安裝狀態的網站，套了 SA-CORE-2026-017 之後仍然可能被接管；安裝程式已經妥善保護的網站不受影響。類型是 Access bypass。
- 受影響版本：公告原文是 `<10.6.23 || >= 11.0.0 <11.3.23 || >=11.4.0 <11.4.14`。11.2.x 以下與 10.5.x 以下已經 EOL。
- 嚴重度：Drupal 自己的評分是 Highly critical，21 ∕ 25。CVSS 分數沒有查到（The Hacker News 寫 N/A，NVD 沒有查）。
- 是否已有修補：有。Drupal 11.4.14、11.3.23、10.6.23。更新後要執行 update.php，並檢查紀錄裡 user 1 的異動。
- 攻擊現況：已遭利用。公告原文寫「This is being exploited in the wild」。CISA KEV 在 2026-11-25 新增的 10 筆裡沒有這一筆。
- 影響：和我們的產品線沒有直接關係。公部門網站常用 Drupal；前幾天已經照 SA-CORE-2026-017 更新過的網站，這次還要再更新一次。
- 來源：https://www.drupal.org/sa-core-2026-019 ；https://thehackernews.com/2026/11/drupal-warns-of-new-highly-critical.html

### 【與我們的產品線相關】CVE-2026-46300：Linux kernel 本機提權漏洞 Fragnesia，Palo Alto 觀察到在對外開放的 PAN-OS 管理介面上被利用

- 發生什麼事：Palo Alto Networks 的公告 PAN-SA-2026-0015 寫，已觀察到針對開放在網際網路上的管理介面利用 CVE-2026-46300。CVE-2026-46300 是 Linux kernel 的本機提權漏洞（NVD 的描述是「net: skbuff: preserve shared-frag marker during coalescing」），攻擊者要先有本機的執行權限；公告寫目前已知的唯一途徑，是先從對外開放的管理介面利用 PHP2Shell 進來，再用這個漏洞提權。公告頁上的日期互相不一致（Published 2026-11-25、Updated 2026-11-24、Timeline 寫 2026-11-24 Initial Publication），照實列出。
- 受影響版本：PAN-OS 的修正版本（含之後的版本）公告列了 20 個，例如 10.2.18-h15、11.1.16-h6、11.2.16-h3、12.1.10-h6、12.2.4-h3，完整清單見公告。Linux kernel 本身受影響的版本範圍今天沒有查。
- 嚴重度：NVD 評 CVSS 3.1 為 7.8（High）。Palo Alto 把這則公告列為 Informational。
- 是否已有修補：PAN-OS 有，見上面的修正版本。各 Linux 發行版（RHEL、SLES 等）與容器主機的 kernel 修補狀況今天沒有查，無法確認。
- 攻擊現況：已遭利用。公告原文寫「Exploitation of CVE-2026-46300 has been observed targeting the Palo Alto Networks management interface exposed to the internet」。iThome 另報導有 25 台伺服器受害，這個數字只在 iThome 看到。
- 影響：這是 Linux kernel 的漏洞，我們的產品線跑的 OpenShift、RKE2、NKP 節點與一般 Linux 主機都用 kernel。它要先有本機執行權限才能用，所以風險在「和別的漏洞串起來」：先從對外服務進來，再提權成 root。客戶端要確認節點的 kernel 修補狀況，請以各發行版自己的公告為準。
- 來源：https://security.paloaltonetworks.com/PAN-SA-2026-0015 ；https://www.ithome.com.tw/news/180808

### 【與我們的產品線相關】CVE-2026-121481：【後續】OpenSSL 預告 2026-12-01 釋出新版，這個漏洞的修補還在審查

- 發生什麼事：這是 2026-11-24 晨報寫的 CVE-2026-121481（`EVP_EncodeBlock()` 整數溢位）的後續。oss-security 郵件論壇 25 Nov 2026 的信轉述 OpenSSL 的 Security Advisory [24th November 2026]：有 4 個 Low 等級的修補已經合併（涉及 QUIC、X.509 CRL 處理、TLS DANE），新版預定 1st December 2026 釋出；CVE-2026-121481 的修補（openssl/openssl#33652）還在審查。
- 受影響版本：這封信沒有列版本範圍；先前的內容見 2026-11-24 的晨報。
- 嚴重度：信裡提到 CISA 先給 CVSS 3.1 為 9.8，後來降為 5.9。OpenSSL 與 NVD 的分數今天沒有另外核對。
- 是否已有修補：還沒有。12 月 1 日的新版版號信裡沒有寫；CVE-2026-121481 的修補會不會趕上這一版，信裡沒有說。
- 攻擊現況：未見利用報告。
- 影響：OpenSSL 是我們多數產品線底層的 TLS 函式庫（httpd、作業系統、容器基底映像）。現在不用動作；12 月 1 日之後各發行版與產品會陸續跟進，屆時再看各原廠的公告。
- 來源：https://seclists.org/oss-sec/2026/q4/884

CISA KEV：catalogVersion 2026.11.25，共 1805 筆。這一版在 2026-11-25 新增 10 筆：Juniper 的 CVE-2026-103406 昨天寫過；今天寫的 Mitel MiCollab 5 筆與 Xen Orchestra 1 筆；另外 3 筆是 Danfoss AK-SM 800A 系列（CVE-2025-41450，期限 2026-12-09；CVE-2023-25914 與 CVE-2023-25915，期限 2026-11-28），Danfoss 的原廠公告今天沒有打開，分數與修補版本沒有確認，所以不另外成則。沒有 dateAdded 在 2026-11-26 以後的項目。
