# CVE 重大新聞｜2026-11-19

[← 今日摘要](README.md)｜[產品動態](products.md)｜[新知識](knowledge.md)｜[CVE](cve.md)｜[台灣 IT](taiwan.md)｜[AI](ai.md)｜[清單維護](maintenance.md)

> 歷史演練分檔：2026-11-19 13:19 蒐集（台灣時間）。僅搬移原文，未重新蒐集或查證；產品來源快照本次未建立，不代表目前產品狀態。

### CVE-2026-123007（nginx2root）：NGINX HTTP/2 記憶體毀損漏洞，未登入可能遠端執行程式碼【與我們的產品線相關】

- 發生什麼事：NGINX 在 2026-11-18 釋出 1.31.9 與 1.30.7，修補 HTTP/2 flow control 的記憶體毀損漏洞 CVE-2026-123007。這個問題從 2015 年的 1.9.5 就存在。The Hacker News 引述 F5 的說法：在 ASLR 關閉或可被繞過時，攻擊者可以執行程式碼；Wiz 與 Xint 的研究人員表示已在測試中做到。
- 受影響產品與版本：
  - NGINX 開源版 1.9.5 到 1.31.8（nginx.org 安全公告頁）。
  - NGINX Plus 37.x 修補版之前的版本，以及 R34 到 R36（The Hacker News 引述原廠公告，F5 公告頁我這邊開啟後沒有內容）。
  - 同一批修補的其他漏洞：CVE-2026-123634（resolver use-after-free，影響 0.6.18 到 1.31.8）、CVE-2026-123633（HTTP/2 use-after-free，影響 1.19.7 到 1.31.8），另有一則 HTTP/3 use-after-free（影響 1.25.0 到 1.31.8，nginx.org 頁面上的編號寫成「CVE-CVE-2026-121810」，疑似頁面筆誤）。
- 嚴重度：nginx.org 標示 CVE-2026-123007 為 major；The Hacker News 報導原廠對這次的五個漏洞都給 CVSS 4.0 9.2 分。兩個說法來源不同，各自列出。
- 是否已有修補：升級到 1.31.9 或 1.30.7 以上。暫時緩解做法我沒有在原廠頁面讀到。
- 攻擊現況：原廠與 Wiz、Rapid7 都說還沒看到實際攻擊；截至 2026-11-18 的 CISA KEV 清單沒有列入。GitHub 上已有 PoC，說明寫明只適合對同一台機器上剛啟動的 Docker 容器示範。取得的是 NGINX worker 行程的權限，要拿到主機 root 還需要另一個提權漏洞。
- 影響：RKE2 內建 ingress-nginx，NKP、Rancher 管理的叢集與客戶自建的 API Gateway 前端也常見 NGINX。我沒有查到 SUSE、Nutanix 針對這個 CVE 的產品公告，ingress-nginx 內含的 NGINX 版本是否在受影響範圍也沒有逐一核對，屬待確認。OpenShift 預設的 ingress 是 HAProxy，不是 NGINX。F5 是 NGINX 的原廠，這次公告也發在 F5 的支援網站。
- 來源：
  - nginx security advisories（頁面沒有標示發布日期）：https://nginx.org/en/security_advisories.html
  - The Hacker News（2026-11-19 02:31 台北時間）：https://thehackernews.com/2026/11/10-year-old-nginx-http2-flaw-lets.html
  - F5 公告 K000163926（我這邊開啟後沒有讀到內容，發布日期未查到）：https://my.f5.com/manage/s/article/K000163926

### F5 BIG-IP 六個 Critical 漏洞：特定設定下未登入即可讓流量中斷，可能遠端執行程式碼

> 原廠頁面未能取得，引自媒體。以下保留 13:19 演練原文，待原廠來源補查結果。

- 背景：BIG-IP 是 F5 的負載平衡與應用程式遞送設備，金融業常放在 WebSphere、JBoss 等應用伺服器前面。TMM（Traffic Management Microkernel）是它處理幾乎所有網路流量的資料面行程；iRule 是管理員寫來控制流量的腳本；APM 是存取控管模組。
- 發生什麼事：F5 在 2026-11-18 揭露 BIG-IP 資料面的六個 stack-based buffer overflow，未登入的攻擊者可以讓 TMM 當掉，流量中斷到 TMM 重啟為止，F5 表示也可能導致遠端執行程式碼。管理介面不受影響。
- 受影響產品與版本（每個漏洞都要 virtual server 上有特定設定才會受影響）：
  - CVE-2026-123637：APM per-request policy 同時包含 Client Information agent 與 Endpoint Security agent。僅 BIG-IP APM。
  - CVE-2026-121805：iRule 在用戶端流量上使用 `PEM::subscriber`。BIG-IP PEM、BIG-IP Next for Kubernetes、BIG-IP CNF。
  - CVE-2026-120292：HTTP profile 加上使用 `MR::message route` 的 iRule。BIG-IP 所有模組、BIG-IP Next for Kubernetes。
  - CVE-2026-120285：HTTP profile 加上使用 `PSC::ip_address` 的 iRule。BIG-IP 所有模組、BIG-IP Next for Kubernetes、BIG-IP CNF。
  - CVE-2026-116953：iRule 在用戶端流量上使用 `GENERICMESSAGE::route`。BIG-IP 所有模組、BIG-IP Next for Kubernetes。
  - CVE-2026-120722：iRule 在用戶端流量上使用 `DNS::scrape`。BIG-IP DNS、BIG-IP Next for Kubernetes。
  - 確切的受影響版本號我沒有讀到。
- 嚴重度：F5 對六個漏洞都評 CVSS v3.1 9.8、CVSS v4.0 9.3（The Hacker News 轉述）。
- 是否已有修補：只有 engineering hotfix，沒有排定的正式版本，也沒有暫時緩解做法。F5 自己提醒 engineering hotfix 沒有經過正式版本那樣完整的 QA。
- 攻擊現況：F5 的公告都沒有提到已遭利用。
- 影響：不是我們的產品線，但客戶的 WebSphere、JBoss EAP、OpenShift 前面如果是 BIG-IP，要請負責 F5 的單位盤點 iRule 有沒有用到上面六個指令或 APM 設定。
- 來源：
  - The Hacker News（2026-11-19 02:15 台北時間）：https://thehackernews.com/2026/11/f5-warns-6-critical-big-ip-flaws-can.html
  - F5 公告 K000164058（原廠頁面我這邊開啟後沒有讀到內容，以上內容僅第三方來源）：https://my.f5.com/manage/s/article/K000164058

### CVE-2026-114938（Java4Shell）後續：研究人員稱可對 Jira、Jenkins、Keycloak 等六個應用程式未登入執行程式碼【與我們的產品線相關】

- 上次寫過：2026-11-19 正式晨報。以下只寫新進展。
- 發生什麼事：揭露者 Calif 表示，在預設設定下不需登入就能對 Keycloak、Atlassian Jira、Atlassian Confluence、JFrog Artifactory、Jenkins、PingFederate 執行程式碼，對 Apache Kafka 則需要登入。原因是伺服器常在確認登入狀態之前就先解 Base64（HTTP Basic 標頭、SAML artifact、CSRF token）。Calif 沒有公開這六個應用程式的攻擊程式；其他實驗室目前只重現當機與記憶體洩漏，還沒重現執行程式碼。
- 是否已有修補：Amazon Corretto 已修補；報導發布時 Red Hat 仍在準備。
- 攻擊現況：加拿大 Cyber Centre 表示沒有看到利用這個漏洞的攻擊。
- 影響：名單中的 Jenkins 與 JFrog Artifactory 在我們 CI/CD 的追蹤清單內，Keycloak 是 Red Hat build of Keycloak 的上游。今天 Jenkins 安全公告頁最新一筆仍是 2026-10-28，沒有針對這個 CVE 的新公告；Red Hat errata 今天查到的最新幾筆也沒有看到對應的修補 errata（我只看了 JBoss EAP、OpenShift、JBoss Core Services 三個產品的清單）。
- 來源：The Hacker News（2026-11-18 19:55 台北時間）：https://thehackernews.com/2026/11/java4shell-cve-2026-114938-enables-pre.html

### CISA KEV 在 2026-11-18 新增四筆：LiteLLM、Synology DSM、REDCap、Apache Axis

- 發生什麼事：CISA 的 Known Exploited Vulnerabilities 清單在 2026-11-18 新增四筆（清單資料檔的發布時間是 2026-11-18 19:17 UTC，總數 1,786 筆）：
  - CVE-2026-40217：BerriAI LiteLLM，Unprotected Alternate Channel，可經由 `/guardrails/test_custom_code` 遠端執行程式碼。修補期限 2026-12-02。
  - CVE-2024-10441：Synology DiskStation Manager (DSM)，Improper Encoding or Escaping of Output，遠端攻擊者可執行任意程式碼。修補期限 2026-11-21。
  - CVE-2026-90817：Vanderbilt University REDCap，Code Injection，未登入可在伺服器執行程式碼。修補期限 2026-11-21。
  - CVE-2026-90436：Apache Axis，Unsafe Reflection。修補期限 2026-11-21。這筆在 2026-11-19 正式晨報寫過，當時還不確定是否列入 KEV，現在確認已列入。
- 嚴重度：KEV 清單不提供 CVSS 分數，各筆的分數我沒有另外查。
- 影響：LiteLLM 是常見的 LLM API 代理閘道，客戶或我們自己的 AI 實驗環境如果有架，要優先處理。Apache Axis 1.x 的處理建議見上一份晨報。
- 來源：CISA Known Exploited Vulnerabilities Catalog（資料檔 2026-11-18）：https://www.cisa.gov/known-exploited-vulnerabilities-catalog

### CVE-2026-82384／CVE-2026-129448：Apache Roller 反序列化漏洞已遭利用，影響範圍擴大到 4.0.0 以後所有版本

> 原廠頁面未能取得，引自媒體。以下保留 13:19 演練原文，待原廠來源補查結果。

- 發生什麼事：Apache 基金會在 2026-11-17 警告，9 月在 Apache Roller 6.1.6 修補的 XML-RPC 端點反序列化漏洞 CVE-2026-82384，原本認定只影響 6.1.5，現在確認 4.0.0 到 6.1.4 也有同樣問題，擴大的範圍另外登記為 CVE-2026-129448。未登入即可從遠端攻擊。
- 受影響產品與版本：Apache Roller 4.0.0 到 6.1.5。
- 嚴重度：CVSS 9.8（iThome 轉述，評分來源未寫明）。
- 是否已有修補：升級到 6.1.6 以上。Apache 強調只從管理介面停用 XML-RPC 仍然有風險。
- 攻擊現況：已遭利用。
- 影響：不屬於我們的產品線。Roller 是 Java 的部落格平台，會部署在 Tomcat、JBoss 這類應用伺服器上，客戶如果有舊的對外部落格或公告系統可以提醒一聲。
- 來源：
  - iThome（2026-11-19）：https://www.ithome.com.tw/news/180639
  - Apache 郵件清單原文（我這邊開啟後沒有讀到內容，發布日期未查到）：https://lists.apache.org/thread/lnz4s26tv6hdo03wngtdbpfj4hg4gtds
