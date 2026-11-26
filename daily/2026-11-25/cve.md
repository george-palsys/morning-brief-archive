# CVE 重大新聞｜2026-11-25

[← 今日摘要](README.md)｜[產品動態](products.md)｜[新知識](knowledge.md)｜[CVE](cve.md)｜[台灣 IT](taiwan.md)｜[AI](ai.md)｜[清單維護](maintenance.md)｜[26 項產品現況](../../products/README.md)

和我們產品線直接相關的漏洞今天都寫在[產品動態](products.md)：Argo CD（7 個 GHSA）、Instana（node/7297963）、NKP（CVE-2026-111497）、Confluent Manager for Apache Flink（CONFSA-2026-38）。下面 4 則是產品線以外、客戶環境常見的。

### CVE-2026-123903：VMware vCenter 身分驗證繞過，Broadcom 評 9.8，沒有緩解做法

- 發生什麼事：Broadcom 於 2026-11-24 發布 VMSA-2026-0011，一次修補 VMware ESX、vCenter、Workstation、Fusion、Tools 與 Avi Load Balancer 的 23 個漏洞，CVSSv3 範圍 3.4 到 9.8。最嚴重的是 vCenter 的 CVE-2026-123903，屬於身分驗證繞過。
- 受影響版本：以公告的對照表為準；修正版本是 vCenter 9.1.2、9.0.2.0300、8.0 U3m，以及 VCF 5.2.5。
- 嚴重度：CVSSv3 9.8（Broadcom），公告整體等級 Critical。
- 是否已有修補：有，見上面的修正版本。公告的 Workaround 欄位寫 No。
- 攻擊現況：公告沒有提到遭利用。
- 影響：vCenter 是整個虛擬化環境的管理入口，OpenShift、Rancher、NKP 以外仍有大量客戶的 VM 跑在 vSphere 上，JBoss EAP、WebSphere 的主機也常在上面。沒有緩解做法，只能升級；升級前先確認 vCenter 的管理介面沒有對不必要的網段開放。
- 來源：Broadcom VMSA-2026-0011（2026-11-24）：https://support.broadcom.com/web/ecx/support-content-notification/-/external/content/SecurityAdvisories/0/39626 ；iThome 報導（2026-11-25）：https://www.ithome.com.tw/news/180786

### CVE-2026-132165：Drupal core 的 install.php 可被用來重新安裝網站，已遭利用並列入 KEV

- 發生什麼事：Drupal 的公告 SA-CORE-2026-017 說明，攻擊者在特定條件下可以利用 Drupal core 內附的 install.php 嘗試重新安裝 Drupal，結果可能是網站被接管或遠端執行程式碼。公告更新寫安全團隊收到回報，最早在 2026-11-19 19:00 UTC 就有實際網站遭利用。CISA 於 2026-11-24 把它加入 KEV，期限 2026-11-27。
- 受影響版本：`<10.6.22 || >=11.0.0 <11.3.22 || >=11.4.0 <11.4.13`。
- 嚴重度：Drupal 自己的評分是 Highly critical 20 ∕ 25。公告沒有 CVSS 分數；iThome 的報導寫 Tenable 列的 CVSS 是 9.8，這個分數沒有在 Tenable 的頁面上核對。
- 是否已有修補：有，Drupal 11.4.13、11.3.22、10.6.22。公告另外建議安裝完成後把安裝程式鎖起來；網頁伺服器不能寫入或改 settings.php 權限時，可以擋掉一部分（不是全部）的利用途徑。
- 攻擊現況：已遭利用（Drupal 公告與 CISA KEV）。
- 影響：公部門與學校的網站用 Drupal 的不少。客戶有 Drupal 的現在就該升級，並檢查 2026-11-19 之後有沒有不明的管理者帳號或被改過的 settings.php。
- 來源：Drupal SA-CORE-2026-017：https://www.drupal.org/sa-core-2026-017 ；CISA 警示（2026-11-24）：https://www.cisa.gov/news-events/alerts/2026/11/24/cisa-adds-three-known-exploited-vulnerabilities-catalog ；iThome 報導（2026-11-25）：https://www.ithome.com.tw/news/180796

### CVE-2026-123167：SolarWinds Serv-U 權限提升，原廠評 9.1

- 發生什麼事：SolarWinds 於 2026-11-24 發布公告，Serv-U 有權限提升漏洞，domain administrator 可以存取原本需要更高權限才能讀的檔案。公告寫 Windows 上的風險較低。
- 受影響版本：SolarWinds Serv-U 2026.3 與更舊的版本。
- 嚴重度：9.1 Critical（SolarWinds，CVSS 3.1，Linux 的向量是 AV:N/AC:L/PR:H/UI:N/S:C/C:H/I:H/A:H）。
- 是否已有修補：有，Serv-U 2026.4。
- 攻擊現況：公告沒有提到遭利用。
- 影響：Serv-U 是檔案傳輸伺服器，金融業與公部門拿它做對外檔案交換的不少。利用前提是已經有 domain administrator 權限，所以先確認管理帳號沒有共用或外流，再排升級。
- 來源：SolarWinds Security Advisory CVE-2026-123167（2026-11-24）：https://www.solarwinds.com/trust-center/security-advisories/cve-2026-123167 ；iThome 報導（2026-11-25）：https://www.ithome.com.tw/news/180790

### CVE-2026-129514：Elixir 套件庫 Hex.pm 遭入侵，使用者資料與簽章金鑰可能外洩

- 發生什麼事：Hex.pm 於 2026-11-24 公布事件報告。攻擊者在 2026-11-23 18:16 到 18:29（UTC）送出 69 個惡意請求，影響 6 台網頁伺服器。漏洞在 hex.pm 用 Erlang term 格式解碼未經驗證的請求內容，這個解碼方式會放行 struct 值，被串接起來達成程式碼執行。iThome 的報導寫官方事後調查沒有發現套件被竄改，但因為資料庫不記錄讀取，無法排除使用者電子郵件、密碼雜湊、API 金鑰雜湊與雙因素驗證金鑰被讀走。
- 受影響版本：受影響的是 hex.pm 這個服務本身，不是使用者端安裝的軟體版本。
- 嚴重度：Hex.pm 的事件報告沒有讀到分數；iThome 的報導寫 CVSS 4.0 為 10 分，沒有在 CVE 紀錄上核對。
- 是否已有修補：服務端已修補，18:30 到 18:31 所有伺服器換成會拒絕這類內容的版本。registry 的簽章金鑰在報告發布時還沒有輪替，Hex.pm 正在做支援金鑰輪替的新簽章機制，新版用戶端預計幾天內發布。
- 攻擊現況：已發生實際入侵（Hex.pm 事件報告）。
- 影響：客戶有 Elixir 或 Erlang 專案的（含用 rebar3、Gleam 的），照 Hex.pm 的要求改密碼、重設雙因素驗證；新版用戶端出來之前只用 repo.hex.pm，不用鏡像站。對其他客戶的提醒是：套件庫的簽章金鑰一旦可能外洩，在輪替完成前「簽章驗證通過」的保證就打折，Black Duck SCA 這類掃描要搭配來源限制一起看。
- 來源：Hex.pm，Security incident on hex.pm（2026-11-24）：https://hex.pm/blog/security-incident-on-hexpm ；iThome 報導（2026-11-25）：https://www.ithome.com.tw/news/180791

CISA KEV：catalogVersion 2026.11.25，共 1796 筆。上一份晨報之後新增的有 2026-11-24 的 CVE-2026-132165（Drupal Core）、CVE-2026-131914（Idunno AntiCsrf）、CVE-2026-132224（Optimizely Web Experimentation），期限都是 2026-11-27；2026-11-25 的 CVE-2026-103406（HPE Juniper Session Smart Conductor 與 Session Smart Router 的 OS command injection），期限 2026-11-28。今天產品動態裡的 CVE 都沒有被收錄。來源：https://www.cisa.gov/known-exploited-vulnerabilities-catalog
