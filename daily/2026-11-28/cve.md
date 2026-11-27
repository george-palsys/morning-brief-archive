# CVE 重大新聞｜2026-11-28

[← 今日摘要](README.md)｜[產品動態](products.md)｜[新知識](knowledge.md)｜[CVE](cve.md)｜[台灣 IT](taiwan.md)｜[AI](ai.md)｜[清單維護](maintenance.md)｜[26 項產品現況](../../products/README.md)

和我們產品線直接相關、而且有原廠公告的漏洞今天寫在[產品動態](products.md)：Instana 的安全公告 node/7298440。下面 5 則裡有幾則的原廠公告日期早於 2026-11-27，收進來是因為 CISA 在 2026-11-27 把它們列入 KEV，或是 CVE 編號這兩天才指派；日期一律照來源頁面寫。

### CVE-2026-120705、CVE-2026-129243：GeoServer 兩個漏洞列入 CISA KEV，可和另外三個串成不需登入的遠端程式碼執行

- 發生什麼事：CISA 在 2026-11-27 把 GeoServer 的 CVE-2026-120705（XML injection）與 CVE-2026-129243（授權檢查錯誤）列入 KEV。KEV 的說明寫，這兩個可以和 CVE-2026-129244、CVE-2026-129245、CVE-2026-129242 串連，在受影響的 GeoServer 上做到不需驗證的遠端程式碼執行。依 GitHub 上的原廠公告：`service=x/WFS` 這種帶前綴的參數，系統會當成 WFS 去執行，但權限比對用的是沒解析過的字串，所以匿名者可以建立與刪除 WFS stored query；內建的 GetFeatureById stored query 又把呼叫者給的 ID 直接塞進 XML 範本，可以用來讀本機文字檔或讓伺服器對外發出請求。原廠的說明文「GeoServer Security Update - November 2026」依網址是 2026-11-23。
- 受影響版本：GeoServer 2.27.6 與更舊、2.28.0 到 2.28.5、3.0.0 到 3.0.1。CVE-2026-120705 另外影響 GeoTools（gt-metadata）33.6 與更舊、34.0 到 34.5、35.0 到 35.1。
- 嚴重度：CVE-2026-120705 是 8.6（CVSS v3），CVE-2026-129243 是 8.8（CVSS v4），兩個分數都出自 GitHub Security Advisory。NVD 與 CVE.org 今天都還查不到這兩筆。
- 是否已有修補：有。GeoServer 3.0.2、2.28.6、2.27.7；GeoTools 33.7、34.6、35.2。緩解做法：在前端代理擋掉 service 參數含 `/` 的請求；檢查 data directory 的 `wfs/query` 與 `workspaces/*/wfs/query` 有沒有不是自己建的 stored query；匿名使用者不需要 WFS 就關掉。
- 攻擊現況：已遭利用，依據是列入 CISA KEV；原廠頁面沒有寫遭利用。KEV 的修補期限兩筆都是 2026-11-30。
- 影響：和我們的產品線沒有直接關係。公部門的地理資訊與圖資系統常用 GeoServer，有對外開放的要立刻升級並檢查 stored query。
- 來源：https://github.com/geoserver/geoserver/security/advisories/GHSA-39mw-5chv-jh47 ；https://github.com/geoserver/geoserver/security/advisories/GHSA-rv5g-g2r9-58rj ；https://geoserver.org/vulnerability/2026/11/23/cve-update.html ；https://www.cisa.gov/known-exploited-vulnerabilities-catalog

### 【與我們的產品線相關】CVE-2026-137481：Traefik 沒有處理 `/..;x/` 這種路徑，可以繞過驗證到達後面 Servlet 應用的受保護路徑

- 發生什麼事：Traefik 的 `sanitizePath`（預設開啟）會先解掉路徑裡的 `..`，但帶了路徑參數的寫法（例如 `/..;x/`）沒有處理。Traefik 用沒解開的路徑去比對 router 與套用 middleware，再原樣轉給後端；後端如果會去掉路徑參數（原廠公告舉的是 Servlet containers 與 Spring），而且同一個後端同時掛在「不需驗證的 router」與「有驗證 middleware 的 router」後面，送出 `/public/..;x/admin` 就能到受保護的資源。原廠公告 GHSA-cp28-5662-543f 是 Nov 12, 2026 發布的；CVE 編號在 2026-11-26 才指派（指派單位 VulnCheck），同一天進到 Red Hat 的資料庫。
- 受影響版本：Traefik v2.11.61 與更舊；v3.0.0 到 v3.7.17；v3.8.0-rc.1。v3.0 到 v3.6 已經 EOL，不會出修補。
- 嚴重度：原廠公告與 CVE 紀錄都是 7.8（CVSS 4.0，High）。CVE 紀錄另列 9.3（CVSS 3.1，Critical，來源 VulnCheck）；Red Hat 評 7.5（CVSS 3.1），嚴重度 Important，狀態還是 draft。三個分數不一致，照各自來源列出。
- 是否已有修補：有。v2.11.62、v3.7.18、v3.8.0-rc.2。Red Hat 給的緩解做法：不要把不需驗證與需要驗證的 router 放在同一個會去掉路徑參數的後端前面，或把驗證放在看得到正規化後路徑的那一層。
- 攻擊現況：未見利用報告（原廠公告、CVE 紀錄與 Red Hat 頁面都沒有提到）。
- 影響：RKE2 與 Rancher 的環境會用 Traefik 當 ingress，後面接的 WebSphere Liberty、JBoss EAP 正是會去掉 `;` 路徑參數的 Servlet 容器，所以「前面 Traefik 做驗證、後面是 Java 應用」的架構要檢查。Red Hat 另寫 OpenShift Dev Spaces 的 gateway 內含 Traefik（列為 Affected），但預設的路由方式不符合上面的條件。RKE2 與 Rancher 內附的 Traefik 版本有沒有含修補，今天沒有查，無法確認。
- 來源：https://github.com/traefik/traefik/security/advisories/GHSA-cp28-5662-543f ；https://access.redhat.com/security/cve/CVE-2026-137481

### CVE-2026-136716：【後續】Drupal core 的 SA-CORE-2026-019 在 2026-11-27 列入 CISA KEV

- 發生什麼事：這是 2026-11-27 晨報寫的 Drupal core 公告 SA-CORE-2026-019 的後續。CISA 在 2026-11-27 把 CVE-2026-136716 列入 KEV，說明寫：網站處於不尋常或沒有完成安裝的狀態時，不需驗證的遠端攻擊者可以經由對外開放的 Drupal 安裝程式接管網站。
- 受影響版本：見 2026-11-27 的晨報（公告頁今天被驗證頁擋下，沒有重讀）。
- 嚴重度：CVSS 分數今天仍沒有查到；Drupal 自己的評分見 2026-11-27 的晨報。
- 是否已有修補：有，版本見 2026-11-27 的晨報。
- 攻擊現況：已遭利用（列入 KEV）。KEV 的修補期限是 2026-11-30。
- 影響：和我們的產品線沒有直接關係。公部門網站常用 Drupal；昨天還沒更新的，現在有了 KEV 的期限可以當依據。
- 來源：https://www.cisa.gov/known-exploited-vulnerabilities-catalog ；https://www.drupal.org/sa-core-2026-019

### CVE-2026-120353：Apache Airflow 多個 provider 把範本算了兩次，能觸發 DAG 的人可以在 worker 上執行命令

- 發生什麼事：Apache 在 oss-security 郵件論壇發出公告（Thu, 26 Nov 2026）：`@task.bash`、`@task.sql`、`@task.kubernetes_cmd`，以及 common.ai 的 `@task.llm`、`@task.agent` 這些 decorator，在 task runner 已經算過 Jinja 範本之後又算了一次。所以 run conf、參數或 prompt 裡的文字會在 worker 上被當成範本求值；能觸發 DAG run 的人，或能控制 DAG 會讀進來的文字（工單、下載的文件）的人，就能執行命令並讀出連線密碼與 Variables。
- 受影響版本：Standard provider 0.3.0 到 1.22.0 之前；CNCF Kubernetes provider 10.5.0 到 11.0.0 之前；Common SQL provider 1.32.0 到 3.0.0 之前；Common Ai provider 0.1.0 到 1.2.0 之前。
- 嚴重度：公告寫 Severity: important。CVSS 分數沒有查到。
- 是否已有修補：有。apache-airflow-providers-standard 1.22.0、apache-airflow-providers-cncf-kubernetes 11.0.0、apache-airflow-providers-common-sql 3.0.0、apache-airflow-providers-common-ai 1.2.0。
- 攻擊現況：未見利用報告。
- 影響：和我們的產品線沒有直接關係。客戶的資料團隊在 OpenShift 或 Kubernetes 上跑 Airflow 的要升級 provider。值得記住的是成因：外面讀進來的文字被當成範本再算一次，AI 工作流程讀文件、讀工單時也是同一類風險。
- 來源：https://seclists.org/oss-sec/2026/q4/902

### CVE-2026-137686：Apache Shiro 的 ActiveDirectoryRealm 在特定設定下接受空白的帳號與密碼

- 發生什麼事：Apache 在 oss-security 郵件論壇發出公告（Thu, 26 Nov 2026）：Shiro 的 ActiveDirectoryRealm 如果沒有設定 `principalSuffix`，而且目錄伺服器允許匿名 bind，空白的帳號密碼會被接受；公告寫這是 CVE-2014-0074 當年沒有修完整的部分。
- 受影響版本：Apache Shiro（org.apache.shiro:shiro-core）3.0.2 之前的版本，而且要符合上面兩個條件。
- 嚴重度：6.3（CVSS 4.0，medium），分數出自 Apache 的公告。
- 是否已有修補：有。3.0.2。不能馬上升級的做法：設定 `principalSuffix`，或關閉目錄伺服器的匿名 bind。
- 攻擊現況：未見利用報告。
- 影響：不是我們產品本身的漏洞。Shiro 是跑在 WebSphere Liberty、JBoss EAP 上的 Java 應用常用的驗證函式庫，Black Duck SCA 掃得到；客戶的應用有用 ActiveDirectoryRealm 的要檢查設定。
- 來源：https://seclists.org/oss-sec/2026/q4/903

CISA KEV：catalogVersion 2026.11.27，共 1808 筆（昨天是 1805 筆）。2026-11-27 新增 3 筆：GeoServer 的 CVE-2026-120705 與 CVE-2026-129243、Drupal core 的 CVE-2026-136716，期限都是 2026-11-30，今天都寫了。CISA 對應的 alert 頁今天沒有找到，以 KEV 的 JSON 資料為準。
