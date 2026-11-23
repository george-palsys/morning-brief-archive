# CVE 重大新聞｜2026-11-24

[← 今日摘要](README.md)｜[產品動態](products.md)｜[新知識](knowledge.md)｜[CVE](cve.md)｜[台灣 IT](taiwan.md)｜[AI](ai.md)｜[清單維護](maintenance.md)｜[26 項產品現況](../../products/README.md)

### 【與我們的產品線相關】CVE-2026-119618（後續）：Apache HTTP Server mod_http2 遠端執行程式碼漏洞，新加坡 CSA 警告已遭利用；JBCS httpd 的修補已在 SP7

- 發生什麼事：這個 CVE 在 11-20 晨報的產品動態（JBCS httpd 2.4.62 SP7）列過，當時沒有寫到攻擊的消息。新進展：新加坡網路安全局（CSA）於 2026-11-17 發布警示「Active Exploitation of Vulnerability in Apache HTTP Server's mod_http2」，摘要寫攻擊者正在利用這個漏洞達成遠端執行程式碼，要求立即修補；iThome 2026-11-23 報導。
- 漏洞內容：mod_http2 的 `assign_headers()` 有執行緒同步缺陷，可造成堆積記憶體毀損與遠端執行程式碼，不需要驗證。只有啟用 HTTP/2 的伺服器受影響。機制見今天的[新知識](knowledge.md)。
- 受影響版本（Apache 公告）：Apache HTTP Server 2.4.55 到 2.4.70；GitHub 上的 mod_h2 2.0.8 到 2.0.42。
- 嚴重度：
  - Apache：critical。
  - CISA-ADP（NVD 紀錄所列）：CVSS 3.1 為 8.1。
  - Red Hat：Critical，CVSS 3.1 為 9.8；RHEL 9 與 RHEL 10 的套件評為 Important。
  - iThome 轉述 CSA 的評分是 8.1 分；CSA 的警示清單頁把它稱為 high-severity。
- 是否已有修補：
  - 上游：Apache HTTP Server 2.4.71（2026-11-11 釋出）。
  - Red Hat JBoss Core Services 2.4.62.SP7：RHSA-2026:100552（2026-11-17）。
  - JBoss Core Services for RHEL 8：RHSA-2026:100550（2026-11-18）。
  - Red Hat Enterprise Linux 9：RHSA-2026:98981（2026-11-11）。
  - Red Hat Enterprise Linux 10：RHSA-2026:98978（2026-11-11）。
  - Red Hat OpenShift Dev Spaces 3.31：RHSA-2026:100811（2026-11-20）。
  - Red Hat OpenShift GitOps 的 `openshift-gitops-1/console-plugin-rhel9`：Red Hat 在 2026-11-23 發布三張安全更新 RHSA-2026:102591（v1.22.4）、RHSA-2026:102593（v1.21.8）、RHSA-2026:102596（v1.20.12），CVE 清單含 CVE-2026-119618，見今天的[產品動態](products.md)。Red Hat 的 CVE 資料在 2026-11-24 查看時仍把這個映像列為 Affected，還沒有列出這三張 errata。
  - RHEL 8 與更早的版本：Red Hat 寫不受影響。
  - RHEL 的 Extended Update Support 等其他版本線也各有 errata，這裡沒有逐一列出，見 Red Hat CVE 頁。
- 攻擊現況：
  - CSA 寫已遭利用，但我只讀到警示清單頁的標題、日期與摘要，警示內文沒有開到。
  - iThome 寫 CSA 提到已有公開的 PoC，但沒有說明受害對象、攻擊規模與 PoC 的技術細節。
  - Red Hat 的 CVE 頁寫公開的研究已示範對預設組態、啟用 mod_http2 的伺服器的可靠 exploit。
  - CISA KEV 沒有收錄這個 CVE（2026-11-24 查看，目錄最新的 dateAdded 是 2026-11-20）。
- 影響：JBCS httpd 是我們的產品。客戶的 JBCS httpd 還沒升到 2.4.62 SP7、而且啟用了 HTTP/2 的，現在應該排進最近的維護時段；暫時無法升級的，先確認 `Protocols` 指令有沒有 `h2` 或 `h2c`，只提供 HTTP/1.1 的不受影響。客戶在 RHEL 9、RHEL 10 上自己裝的 httpd 也要一併確認套件版本。IBM HTTP Server 是否受影響這次沒有查。
- 來源：
  - 新加坡 CSA 警示清單（該則日期 2026-11-17）：https://www.csa.gov.sg/alerts-and-advisories/alerts/
  - Apache HTTP Server 2.4 vulnerabilities（2.4.71，2026-11-11）：https://httpd.apache.org/security/vulnerabilities_24.html
  - Red Hat CVE 頁（2026-11-11 公開）：https://access.redhat.com/security/cve/CVE-2026-119618
  - NVD（2026-11-11 發布，2026-11-15 最後修改）：https://nvd.nist.gov/vuln/detail/CVE-2026-119618
  - iThome（2026-11-23）：https://www.ithome.com.tw/news/180711

### 【與我們的產品線相關】CVE-2026-114938（Java4Shell，後續）：GreyNoise 已看到 7 個來源 IP 送出攻擊樣式的請求，目前沒有確認成功的入侵

- 發生什麼事：11-19 晨報寫過的 OpenJDK Base64 解碼器漏洞出現嘗試利用的活動。GreyNoise 為它開了專頁持續更新，iThome 2026-11-23 彙整了幾家威脅情報公司的觀察。
- GreyNoise 專頁（2026-11-24 查看）：
  - 自 2026-11-17 00:00 UTC 起，有 7 個來源 IP 的 HTTP Authorization 標頭帶著符合 Java4Shell 觸發形狀的 Basic 或 Bearer 值，全部分類為 malicious。
  - 被請求的路徑包括 `/`、`/rest/api/space`、`/login.action`、`/actuator/env`、`/api/`、`/rest/api-application/1.0/application-info`、`/rpc/xml`、`/api/login`、`/api/v1/login`、`/auth/login`、`/api/json`、`/crumbIssuer/api/json`、`/whoAmI/api/json`、`/cli`。
  - 「Successful Exploitation (0)」：GreyNoise 的感測點還沒有確認成功的利用。
- iThome 的彙整（2026-11-23，以下數字我沒有逐一對到各家原文）：
  - GreyNoise：截至 23 日有 7 個 IP、共 261 次請求，尚未出現成功入侵的事故。
  - Previdian：18 日、19 日攻擊者存取它的蜜罐，主要目標是 Jenkins，共 32 次 HTTP 回應，其中 28 次是 401、4 次是 302，沒有記憶體洩露或遠端執行程式碼。
  - Cloudforce One：有人把 AI 工具 ARTEX 與 Java4Shell 同時用於攻擊活動，研判攻擊者正準備把 Java4Shell 整合進攻擊流程。
  - watchTowr：攻擊者在全球廣泛嘗試，請求的 User Agent 含有 `java4shell-recon`。
- CVE 編號與嚴重度：CVE-2026-114938。嚴重度與修補版本見 11-19 晨報的 CVE 段與 11-20 晨報產品動態的 RHSB-2026-018，這次沒有重新查分數。
- 是否已有修補：有，Oracle 與 OpenJDK 於 2026-11-17 修補（iThome）；各產品的修補狀態以原廠公告為準，這次沒有重新逐一查。
- 攻擊現況：有掃描與嘗試利用，沒有確認成功的案例。CISA KEV 沒有收錄（2026-11-24 查看）。
- 影響：Liberty、JBoss EAP、Confluent Platform 與 CI/CD 工具（Jenkins）都跑在 Java 上。客戶有對外開放的 Java 服務、JDK 還沒更新的，要優先處理。可以請客戶在反向代理或 WAF 的紀錄裡找 User Agent 含 `java4shell-recon` 的請求，確認有沒有被掃過。
- 來源：
  - GreyNoise「Java4Shell (CVE-2026-114938) Activity 2026」（持續更新，頁面的發布日期未查到）：https://java4shell.events.greynoise.io/
  - iThome（2026-11-23）：https://www.ithome.com.tw/news/180709

### 【與我們的產品線相關】CVE-2026-121481：OpenSSL `EVP_EncodeBlock()` 整數溢位，GitHub 列 9.8 分但 OpenSSL 自評 Low，上游只影響 4.0 與 4.1

- 發生什麼事：OpenSSL 的 CVE-2026-121481 於 2026-11-18 公開（NVD 發布日）。Base64 編碼函式 `EVP_EncodeBlock()` 在輸入長度接近 INT_MAX 時，計算輸出長度的算式會溢位，寫入超過呼叫端配置的緩衝區，造成堆積緩衝區溢位。iThome 2026-11-23 報導。寫這則是因為不同來源的分數差很多，掃描工具可能把它報成 Critical，客戶會來問。
- 受影響版本：
  - Red Hat：上游只有 OpenSSL 4.0 與 4.1 兩條線受影響；出貨 OpenSSL 3.5 或更早版本的產品不在上游的受影響範圍。
  - iThome：4.0.0 至 4.0.3，以及 4.1.0。這組版號我沒有在第一手頁面對到。
- 嚴重度（各來源不同，全部列出）：
  - OpenSSL（CVE 紀錄的說明）：Low，理由是目前沒有找到攻擊者可以觸發的途徑，呼叫端必須自己持有約 2 GB 的緩衝區。
  - CISA-ADP（NVD 紀錄所列）：CVSS 3.1 為 5.9。NVD 自己尚未評分，狀態為 Awaiting Analysis。
  - Red Hat：Low，CVSS 3.1 為 3.7。
  - GitHub Advisory Database（GHSA-83xj-7xh4-4p7x，狀態 unreviewed）：critical，CVSS 3.1 為 9.8。
- 觸發條件（CVE 紀錄的說明）：OpenSSL 的 TLS、QUIC 與 CMS 實作不會編碼這麼大的緩衝區，命令列工具實際上也做不到；會受影響的是把攻擊者可控的長度不經檢查就傳給 `EVP_EncodeBlock()` 的應用程式。受影響的程式碼在 FIPS 模組邊界之外。
- 是否已有修補：CVE 紀錄的參考連結是 pull request https://github.com/openssl/openssl/pull/33652 。iThome 寫截至 11 月 23 日還沒有合併到主線；我沒有自己查合併狀態。OpenSSL 官網的漏洞清單頁我查看時（2026-11-24）沒有列出這個 CVE，修補版本的版號未查到。
- 攻擊現況：未查到攻擊或 PoC 的報告；OpenSSL 表示沒有找到攻擊者可觸發的途徑。
- 影響：Red Hat 把 JBoss Core Services 的 `jbcs-httpd24-openssl` 與 OpenShift Container Platform 4、5 的 RHCOS 映像列為 Not affected。客戶用 Black Duck 或 NeuVector 掃出這個 CVE 並顯示 9.8 分時，先確認映像裡的 OpenSSL 是不是 4.0 或 4.1；是 3.x 就不在上游的受影響範圍。自行開發的 C 或 C++ 程式直接呼叫 `EVP_EncodeBlock()` 的，檢查有沒有限制輸入長度。
- 來源：
  - NVD（2026-11-18 發布，2026-11-20 最後修改）：https://nvd.nist.gov/vuln/detail/CVE-2026-121481
  - Red Hat CVE 頁（2026-11-18 公開）：https://access.redhat.com/security/cve/CVE-2026-121481
  - GitHub Advisory Database（2026-11-18）：https://github.com/advisories/GHSA-83xj-7xh4-4p7x
  - OpenSSL 漏洞清單頁（查看時沒有這個 CVE）：https://openssl-library.org/news/vulnerabilities/
  - iThome（2026-11-23）：https://www.ithome.com.tw/news/180700

### CVE-2026-133325：Apache Tomcat 叢集用 TLS 1.3 加 TLS-PSK 時不驗證對端，未經驗證的節點可以加入叢集，修補版本尚未釋出

- 發生什麼事：Apache Tomcat 於 2026-11-19 公開。叢集通訊用 TLS 1.3 搭配預先共享金鑰（TLS-PSK）保護時，金鑰交換沒有驗證對端身分，未經驗證的節點可以加入叢集。iThome 2026-11-23 報導。
- 受影響版本：
  - NVD（Apache 提供的說明）：Apache Tomcat 11.0.28 到 11.0.29、10.1.62、9.0.124。
  - Tomcat 11 的安全公告頁：11.0.28 to 11.0.29。
  - Red Hat CVE 頁轉載的說明寫的是 11.0.29、10.1.62、9.0.124，與 NVD 不同，兩者都列出。
- 嚴重度：
  - CISA-ADP（NVD 紀錄所列）：CVSS 3.1 為 9.8。NVD 自己尚未評分，狀態為 Awaiting Analysis。
  - Red Hat：Important，CVSS 3.1 為 8.1。理由是要用非預設的叢集設定並以 TLS 1.3 搭配 TLS-PSK 才會觸發，Red Hat 的標準部署預設停用 Tomcat 叢集。
  - iThome 寫 Apache Tomcat 的公告列為 Critical；我在 Tomcat 11 公告頁讀到的段落沒有包含嚴重度那一行，未對到。
- 是否已有修補：還沒有正式版。NVD 的說明寫修補版本是 11.0.30、10.1.63、9.0.125（when released）；Tomcat 11 公告頁寫修正在 commit 2e6c85ba，並寫「Until Tomcat 11.0.30 is available」。
- 暫時緩解：
  - Apache：叢集通訊改用 TLS 1.2。
  - Red Hat：限制叢集通訊埠只讓授權的節點連線；或把 TLS-PSK 換成使用 X.509 憑證的 mTLS。改叢集設定要重啟 Tomcat。
- 攻擊現況：未查到攻擊或 PoC 的報告。CISA KEV 沒有收錄（2026-11-24 查看）。
- 影響：Tomcat 不在我們的 26 項產品裡。但客戶環境裡 Tomcat 很常見，而且 Tomcat 同一頁的另一則公告（CVE-2026-95517）才建議把 EncryptInterceptor 換成 TLS-PSK，照做並用 TLS 1.3 的叢集反而會碰到這個漏洞；該公告也寫了在 11.0.30 出來前只用 TLS 1.2。有用 Tomcat session 複寫叢集的客戶，確認叢集通訊的 TLS 版本與通訊埠的防火牆規則。
- 來源：
  - Apache Tomcat 11 vulnerabilities（該則 2026-11-19 公開）：https://tomcat.apache.org/security-11.html
  - NVD（2026-11-19 發布，2026-11-21 最後修改）：https://nvd.nist.gov/vuln/detail/CVE-2026-133325
  - Red Hat CVE 頁（2026-11-19 公開）：https://access.redhat.com/security/cve/CVE-2026-133325
  - iThome（2026-11-23）：https://www.ithome.com.tw/news/180707

CISA KEV 自 2026-11-20 之後沒有新增（2026-11-24 查看，目錄版本 2026.11.23）。屬於我們 26 項產品的新安全公告由產品動態段落逐項檢查，這一段沒有另外查。
