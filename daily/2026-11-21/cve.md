# CVE 重大新聞｜2026-11-21

[← 今日摘要](README.md)｜[產品動態](products.md)｜[新知識](knowledge.md)｜[CVE](cve.md)｜[台灣 IT](taiwan.md)｜[AI](ai.md)｜[清單維護](maintenance.md)｜[26 項產品現況](../../products/README.md)

### CVE-2026-132825（Ruby2Shell）：Ruby 修補七個漏洞，GitLab 發布 Critical Patch Release，Red Hat 評為 Critical【與我們的產品線相關】

見[產品動態](products.md)（CI/CD/GitLab：Critical Patch Release 19.6.1、19.5.8、19.4.10；OpenShift：RHSB-2026-021）。這一則直接影響清單上的產品而且有原廠產品公告，完整內容與來源寫在產品動態，這裡不重複。

### CISA KEV 於 2026-11-18 新增四個漏洞：Apache Axis（CVE-2026-90436，後續）、LiteLLM、REDCap、Synology

- 發生什麼事：CISA 在 2026-11-18 依已遭實際利用的證據，把四個漏洞加入 KEV 目錄。其中 Apache Axis 的 CVE-2026-90436 是 11-19 晨報報過的漏洞，這次是正式列入 KEV。這則公告的日期早於上一份晨報的蒐集時間，但上一份沒有寫到，今天補報。
- CVE 編號與受影響產品（以 KEV 目錄的記載為準）：
  - CVE-2026-90436：Apache Axis，Unsafe Reflection Vulnerability。未登入的攻擊者送出特製的 SOAP fault，讓 Axis 產生攻擊者指定的類別，可遠端執行程式碼。目錄註明產品可能已終止維護。修補期限 2026-11-21。
  - CVE-2026-40217：BerriAI LiteLLM，Unprotected Alternate Channel Vulnerability。經由 `/guardrails/test_custom_code` 端點改寫 bytecode，可遠端執行程式碼。修補期限 2026-12-02。
  - CVE-2026-90817：Vanderbilt University Research Electronic Data Capture（REDCap），Code Injection Vulnerability。持有有效的公開問卷 hash 的未登入攻擊者，可以用特製 HTTP 請求執行程式碼。修補期限 2026-11-21。
  - CVE-2024-10441：KEV 目錄的產品欄寫 Synology DiskStation Manager（DSM），Improper Encoding or Escaping of Output Vulnerability；說明文字寫的是 Synology BeeStation OS 的 system plugin daemon 可被遠端執行程式碼。修補期限 2026-11-21。
- 受影響版本：KEV 目錄沒有列版本。CVE-2026-90436 依 11-19 晨報當時讀到的資料是 Apache Axis 1.x 到 1.4；其餘三個的受影響版本我這次沒有查到。
- 嚴重度：KEV 目錄不列 CVSS。LiteLLM、REDCap、Synology 三個的 CVSS 我這次沒有查到，不寫。
- 是否已有修補：KEV 目錄沒有列修補版本，這次沒有另外查原廠公告。Apache Axis 1.x 已終止維護，依 11-19 晨報當時的資料沒有官方修正版。
- 攻擊現況：四個都已遭實際利用（列入 KEV 的條件）。是否用於勒索軟體，目錄四個都寫 Unknown。目錄註明 CVE-2026-90436、CVE-2026-90817、CVE-2024-10441 依 BOD 26-04 需要做 forensic triage，也就是除了修補還要檢查修補前是否已被入侵。
- KEV 目前狀態：今天（2026-11-21 凌晨）查看 KEV 目錄，最新一批的加入日期是 2026-11-18，2026-11-19 與 2026-11-20 沒有新增。昨天報過的 CVE-2026-123890（vCenter）、CVE-2026-129448（Apache Roller）、CVE-2026-76466（Cisco Expressway）在目錄第一頁都沒有看到。
- 影響：Axis 1.x 常內嵌在跑在 WebSphere 或 JBoss EAP 上的老舊 Java 應用裡，正式列入 KEV 之後，客戶的稽核或上級機關比較可能直接問到，可以用 Black Duck 掃 axis 1.x 相依。LiteLLM 是常見的 LLM API 閘道，客戶的 AI 專案如果自己架 LiteLLM proxy，要確認版本並限制管理端點的存取。REDCap 多用在醫學中心與研究機構。
- 來源：
  - CISA 公告「CISA Adds Four Known Exploited Vulnerabilities to Catalog」（2026-11-18）：https://www.cisa.gov/news-events/alerts/2026/11/18/cisa-adds-four-known-exploited-vulnerabilities-catalog
  - CISA KEV 目錄（2026-11-21 查看）：https://www.cisa.gov/known-exploited-vulnerabilities-catalog

### 華碩 ASUS Control Center Express 三個漏洞，最高 CVSS 10.0（CVE-2026-114202、CVE-2026-114204、CVE-2026-114205）

- 發生什麼事：華碩在 2026-11-18 一天內發布六則安全公告，最嚴重的是伺服器與裝置集中管理軟體 ASUS Control Center Express 的 Agent。資安人 2026-11-20 報導：CVE-2026-114202 是硬編碼金鑰，未登入的遠端攻擊者可以偽造驗證權杖取得管理員權限；CVE-2026-114204 也是硬編碼金鑰，低權限的遠端攻擊者可以偽造近期登入帳號的工作階段權杖；CVE-2026-114205 是授權缺陷，低權限使用者可以自行建立管理員帳號。
- 受影響產品與版本：
  - ASUS Control Center Express Agent：華碩公告寫 v1.7.29 之前的版本。資安人報導指出 CVE 紀錄列的受影響版本到 v1.7.27，和華碩公告不完全一致，v1.7.28 的狀態不明確（CVE 紀錄我沒有打開）。
  - 同日另一則公告 CVE-2026-126574（ASUS Control Center）：資安人報導寫影響 Control Center Datacenter 4.0.0.2 以前與 Control Center Enterprise 3.1.0.8 以前，低權限的 Viewer 角色可以變更管理員密碼；華碩公告本身只寫更新到最新版。
- 嚴重度：華碩評分，CVSS 4.0。
  - CVE-2026-114202：10.0（Critical）。
  - CVE-2026-114204：9.0（Critical）。
  - CVE-2026-114205：9.4（Critical）。
  - CVE-2026-126574：9.4（Critical）。
- 是否已有修補：ASUS Control Center Express 升到 v1.7.29 以上；受管理裝置上的 Agent 要另外從「Select Function → Client Agent Updater」更新，更新後確認各裝置的 Agent 版本。CVE-2026-126574 的修補版號華碩公告沒有寫。
- 攻擊現況：華碩公告與資安人報導都沒有提到實際攻擊或 PoC。今天查看 CISA KEV 目錄沒有這幾個 CVE。
- 影響：不屬於我們的產品線。客戶機房如果有華碩伺服器並用 ASUS Control Center 做集中管理，這套軟體能對所有受管主機下指令，被拿到管理員權限的影響範圍很大，可以提醒確認版本。華碩同一天另外發布的 Armoury Crate（CVE-2026-112115，CVSS 4.0 為 8.5）、ASUS System Control Interface（CVE-2026-112117，7.3）、Display Widget Center（CVE-2026-119469，7.0）與路由器韌體更新屬於個人電腦與網通設備。
- 來源：
  - 華碩安全公告 RSS（各則發布時間 2026-11-18）：https://security-advisory-api.asus.com/rss/securityrss.xml
  - 華碩安全公告頁：https://www.asus.com/security-advisory/
  - 資安人（2026-11-20）：https://www.informationsecurity.com.tw/article/article_detail.aspx?aid=13522

### F5 BIG-IP 六個資料平面漏洞，CVSS 9.8，目前只有 Engineering Hotfix

- 發生什麼事：F5 在 2026-11-18 發布的一批公告中，除了昨天報過的 NGINX2Root，另有六個 BIG-IP 資料平面的堆疊式緩衝區溢位，可以讓 Traffic Management Microkernel（TMM）當掉，F5 表示也可能造成遠端程式碼執行。管理介面不受影響。每個漏洞都要有特定的虛擬伺服器設定才會觸發。資安人報導其中四個由 watchTowr 研究員 Sina Kheirkhah 回報，兩個是 F5 自行發現。
- CVE 編號與觸發條件（依 SecurityOnline 的整理）：
  - CVE-2026-123637：BIG-IP APM，per-request policy 同時包含 Client Information 與 Endpoint Security agent。F5 公告 K000163937。
  - CVE-2026-116953：iRule 使用 `GENERICMESSAGE::route`。F5 公告 K000163941。
  - CVE-2026-120285：iRule 使用 `PSC::ip_address` 並搭配 HTTP profile。F5 公告 K000163939。
  - CVE-2026-120292：iRule 使用 `MR::message` route 並搭配 HTTP profile。F5 公告 K000163940。
  - CVE-2026-120722：BIG-IP DNS，iRule 使用 `DNS::scrape`。F5 公告 K000163945。
  - CVE-2026-121805：BIG-IP PEM 與 BIG-IP Next for Kubernetes，iRule 使用 `PEM::subscriber`。F5 公告 K000163946。
- 受影響產品與版本（SecurityOnline，沒有逐一對應到各 CVE）：
  - BIG-IP 21.1.0。
  - BIG-IP 17.5.0 到 17.5.1。
  - BIG-IP 17.1.0 到 17.1.3。
  - BIG-IP Next for Kubernetes 2.4.0 到 2.4.2、2.3.0 到 2.3.4、2.2.0 到 2.2.5。
  - 不受影響：BIG-IQ、F5 Insight、BIG-IP CNF。
  - 資安人報導：F5 只檢查仍在技術支援期的版本，沒有列出的舊版不代表安全。
- 嚴重度：六個都是 CVSS 3.1 為 9.8（SecurityOnline 與資安人都這樣寫）；資安人另外寫 CVSS 4.0 為 9.3。兩篇報導都沒有標示評分來源。
- 是否已有修補：目前只有 Engineering Hotfix，沒有排定的正式修正版，安裝前也沒有替代的緩解做法。F5 說明 Engineering Hotfix 沒有經過正式版本的完整品質檢測。SecurityOnline 列出的 hotfix 名稱在同一篇文章的表格與內文寫法不一致（例如 BIGIP-21.1.0.4.0.19.3-ENG 與 BIGIP-21.1.0.4.0.19.3-ENG3），所以這裡不列版號，請以 F5 的 K 公告為準。
- 攻擊現況：兩篇報導都寫沒有實際利用。今天查看 CISA KEV 目錄沒有這幾個 CVE。
- 注意：F5 的原始公告頁（my.f5.com）這次打不開，以上內容來自資安人與 SecurityOnline 兩篇報導。
- 影響：不屬於我們的產品線，但金融業客戶的 WebSphere、JBoss EAP、OpenShift 前面很多都放 BIG-IP。客戶要先比對自己的 iRule 與 APM policy 有沒有用到上面列的指令與 agent，有用到的向 F5 支援索取 Engineering Hotfix。同一批公告另有 CVE-2026-120718（iControl REST 的 token 可能不會如期失效，CVSS 3.1 為 8.1，F5 公告 K000163929），SecurityOnline 寫修正版是 21.1.0.2、17.5.1.10、17.1.3.6。
- 來源：
  - 資安人（2026-11-20）：https://www.informationsecurity.com.tw/article/article_detail.aspx?aid=13524
  - SecurityOnline（2026-11-18）：https://securityonline.info/f5-big-ip-november-2026-update-7-flaws/

### PHP 七個 Critical 漏洞（後續）：上游在 2026-11-19 釋出 8.5.13、8.4.28、8.3.37、8.2.36，CVE-2026-126714 被稱為 phpAfterShell

- 發生什麼事：昨天的晨報在產品動態寫過 Red Hat 的 RHSB-2026-020（PHP 七個漏洞，當時修補尚未釋出）。PHP 上游已在 2026-11-19 釋出安全更新。其中 CVE-2026-126714 被發現者 Depthfirst 稱為 phpAfterShell：預設的 `files` session handler 寫入新資料前不會先清空舊檔，寫入被中斷時檔案會同時含有新舊資料，能影響 session 內容並中斷寫入的攻擊者，可以讓 PHP 在下次開啟 session 時反序列化攻擊者控制的內容，應用程式裡有合適的 gadget chain 就能遠端執行程式碼。
- CVE 編號（SecurityWeek 的整理）：
  - CVE-2026-115560：session upload progress 的序列化格式不一致，上個月已公開。
  - CVE-2026-126714：session 檔被部分覆寫（phpAfterShell）。
  - CVE-2026-129481：session 關閉被中斷後的 use-after-free，PHP 說明是 CVE-2026-109619 的修補不完整；不影響 PHP 8.2。
  - CVE-2026-129182：use-after-free，CVE-2026-109619 的其他利用情境。
  - CVE-2026-129474：use-after-free，影響 PHP 8.5 以後。
  - CVE-2026-129289：PHP-FPM request smuggling，未登入的攻擊者可以執行自己控制的 PHP。
  - CVE-2026-129496：timezone cache 的 use-after-free。
- 受影響產品與版本：CVE-2026-126714 依 PHP 的 GitHub 公告為 8.2.36 之前、8.3.0 到 8.3.37 之前、8.4.0 到 8.4.28 之前、8.5.0 到 8.5.13 之前。其餘六個的版本範圍我沒有逐一打開公告。資安人報導提醒 PHP 8.1 以下要遷移到仍受支援的分支。
- 嚴重度：CVE-2026-126714 為 Critical，CVSS 4.0 為 9.2（PHP 的 GitHub 公告 GHSA-fm2m-fjf5-v3cp，向量 CVSS:4.0/AV:N/AC:L/AT:P/PR:N/UI:N/VC:H/VI:H/VA:H/SC:N/SI:N/SA:N）。其餘六個的 CVSS 我沒有讀到；Red Hat 的評級見昨天的產品動態。
- 是否已有修補：PHP 8.5.13、8.4.28、8.3.37、8.2.36（php.net，2026-11-19）；同日釋出的 PHP 8.6.0 也包含修補。SecurityWeek 寫 8.6.0 與 8.5.13 修掉全部 Critical 漏洞，8.4.28、8.3.37、8.2.36 包含「大部分」修補，沒有說明各版涵蓋哪些 CVE。暫時緩解：沒有用到上傳進度功能的可以設定 `session.upload_progress.enabled = 0` 後重啟；PHP 的公告說明這擋不住經由其他途徑寫入 session 的情況，升級才是修正。
- 攻擊現況：資安人報導寫 PHP 維護者與 Depthfirst 都沒有回報實際攻擊，公開的概念驗證只使用無害的內建 `stdClass` 物件。10 月修補的 CVE-2026-109619（PHP2Shell 之一）則已被大量利用。今天查看 CISA KEV 目錄第一頁沒有這七個 CVE。
- 影響：PHP 不在我們的產品清單上，受影響的是客戶用 RHEL 或 UBI 的 PHP 映像建出來的應用。上游有修正版之後，接下來要看 Red Hat 的 errata 何時釋出（RHSB-2026-020 今天沒有重新打開，errata 是否已釋出我沒有確認）；自己從上游建 PHP 映像的客戶現在就可以重建並重新部署。
- 來源：
  - php.net 2026 年公告（2026-11-18 預告、2026-11-19 釋出）：https://www.php.net/archive/2026.php
  - PHP GitHub 安全公告 GHSA-fm2m-fjf5-v3cp（2026-11-19）：https://github.com/php/php-src/security/advisories/GHSA-fm2m-fjf5-v3cp
  - SecurityWeek「PHP Patches Seven Critical RCE Vulnerabilities」（2026-11-19）：https://www.securityweek.com/php-patches-seven-critical-rce-vulnerabilities/
  - 資安人（2026-11-20）：https://www.informationsecurity.com.tw/article/article_detail.aspx?aid=13525
