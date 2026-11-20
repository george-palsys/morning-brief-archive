# 產品動態｜2026-11-21

[← 今日摘要](README.md)｜[產品動態](products.md)｜[新知識](knowledge.md)｜[CVE](cve.md)｜[台灣 IT](taiwan.md)｜[AI](ai.md)｜[清單維護](maintenance.md)｜[26 項產品現況](../../products/README.md)

### CI/CD/GitLab：Critical Patch Release 19.6.1、19.5.8、19.4.10，換掉內建 Ruby 以修補 CVE-2026-132825（Ruby2Shell）

→ [產品頁](../../products/cicd.md)

- 類別：安全公告
- 內容：
  - 發生什麼事：Ruby 官方在 2026-11-18 的公告（頁面註明原始發布時間為 2026-11-19 00:00 UTC）修補正規表示式引擎與字串大小寫轉換的七個漏洞，並寫明已知有 PoC 可以證明其中幾個能觸發遠端程式碼執行。其中字串大小寫轉換的 one-byte heap-based buffer overflow（GHSA-34m4-m9fh-gqp5）被稱為 Ruby2Shell。GitLab 在 2026-11-20 發布 Critical Patch Release，把內建的 Ruby 換成修正版，同時帶進 Ruby 這份公告裡其他漏洞的修正。
  - CVE 編號：Ruby 官方公告寫 CVE 編號已申請但尚未配發，只列 GHSA 編號；GitLab 的公告與 SecurityWeek 則寫 GHSA-34m4-m9fh-gqp5 的編號是 CVE-2026-132825。其餘六個沒有查到 CVE 編號：
    - GHSA-7x2q-68qv-6p8x：正規表示式編譯的 double free。
    - GHSA-87fm-7w84-j2px：字串大小寫轉換的 integer overflow，造成 heap-based buffer overflow。
    - GHSA-wpqw-5qxg-m68r：不分大小寫比對的 out-of-bounds read。
    - GHSA-3p8q-wmhx-vm2w：正規表示式編譯的 integer overflow，造成 heap-based buffer overflow。
    - GHSA-7whj-cfh7-xgm4：`Regexp#to_s` 的 heap-based buffer overflow。
    - GHSA-pvgc-g7gj-pv6h：不分大小寫 backreference 比對的 out-of-bounds read。
  - 受影響版本：
    - GitLab CE 與 EE：19.4.10 之前的所有版本、19.5 的 19.5.8 之前、19.6 的 19.6.1 之前。
    - Ruby 3.3.13 以前。
    - Ruby 3.4.0 到 3.4.12。
    - Ruby 4.0.0 到 4.0.9。
    - Ruby 3.2 以前已終止維護，不會有修正。
    - SecurityWeek 引述 Veria Labs：GitHub Enterprise Server 也受影響；預設組態下，未登入的攻擊者可以經由 Rails 與 classic-style Sinatra 觸發。
  - 嚴重度與 CVSS：各來源不同，都寫出來。
    - Ruby 官方公告頁沒有列 CVSS 分數。
    - GitLab 公告：Ruby security team 評為 Critical；MITRE 評為 High，CVSS 7.4（公告沒有寫 CVSS 版本）。
    - Red Hat（RHSB-2026-021）：Critical，CVSS 3.1 基本分數 9.8，見下一則。
    - SecurityWeek：CVSS 7.4（沒有寫評分來源與版本）。
  - 修補版本：
    - GitLab 19.6.1、19.5.8、19.4.10。官方 Linux 套件與官方容器映像已內含修正版 Ruby；自行編譯安裝的要用 Ruby 3.3.14 或 3.4.13（或同一 minor 的更新版）重新編譯。GitLab 說明這次沒有新的 migration，多節點部署不需要停機。
    - GitLab.com 與 GitLab Dedicated 已經是修正版，不需要動作。
    - Ruby 4.0.10、3.4.13、3.3.14（三版都修掉全部七個）。
    - SecurityWeek 報導 Chatwoot、Mastodon、OpenProject 與 Discourse base image 也已修補。
  - 是否已遭利用：沒有查到實際攻擊的報導。Ruby 官方表示 GHSA-34m4-m9fh-gqp5、GHSA-7x2q-68qv-6p8x、GHSA-87fm-7w84-j2px、GHSA-3p8q-wmhx-vm2w 都有可在部分情境達成 RCE 的 PoC。SecurityWeek 報導 Veria Labs 打算等主要廠商修補後公開 PoC；watchTowr 的研究員認為在正式環境要成功利用很難（需要精準的記憶體配置、非 glibc 的 allocator、特定執行組態並繞過 ASLR），比較可能的結果是阻斷服務。今天查看 CISA KEV 目錄沒有這個 CVE。
- 對我們的影響：自管 GitLab 的客戶要排升級，而且受影響範圍是「19.4.10 之前的所有版本」，停在舊版的環境沒有對應的修正版可裝，要先升到 19.4 以上的維護線。昨天才報過的 GitLab 19.6（2026-11-19 發布）也在受影響範圍內，要升到 19.6.1。客戶自己用 Ruby 寫的應用（Rails、Sinatra）以及映像裡帶 Ruby 的工具也要盤點。
- 來源：
  - GitLab Critical Patch Release: 19.6.1, 19.5.8, 19.4.10（2026-11-20）：https://docs.gitlab.com/releases/patches/patch-release-gitlab-19-6-1-released/
  - Ruby 官方公告「Multiple vulnerabilities in Regexp and String」（2026-11-18）：https://www.ruby-lang.org/en/news/2026/11/18/multiple-vulnerabilities-in-regexp-and-string/
  - SecurityWeek（2026-11-20）：https://www.securityweek.com/ruby-patches-ruby2shell-vulnerability-that-could-lead-to-rce/

### OpenShift：Red Hat 發布 RHSB-2026-021（Ruby2Shell，CVE-2026-132825），評為 Critical、CVSS 9.8，OpenShift Container Platform 5 與 4 直接受影響

→ [產品頁](../../products/openshift.md)

- 類別：安全公告
- 內容：
  - CVE 編號：CVE-2026-132825（CWE-787）。公告標題是「One-byte heap overflow - ruby (CVE-2026-132825) - ruby2shell」。
  - 嚴重度與 CVSS：Red Hat 評為 Critical，CVSS 3.1 基本分數 9.8（評分來源：Red Hat；向量 CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H）。同一個漏洞 GitLab 公告引用 MITRE 的評分是 High、CVSS 7.4，見上一則。
  - 受影響產品：公告列為直接受影響的是 Red Hat OpenShift Container Platform 5 與 4；另外寫到以 RHEL 或 UBI 映像為基礎的產品容器，以及從 RHEL channel 取用套件的產品也受影響。
  - 受影響的 Ruby 版本：3.3.14、3.4.13、4.0.10 之前的版本。
  - 觸發條件：應用程式要對攻擊者提供的文字做大小寫轉換（`upcase`、`upcase!`、`swapcase`、`swapcase!`、帶 `:fold` 的 `downcase`、`downcase!`、`casecmp?`），而且文字是 ISO-8859-1 或 Windows-1252 這類 single-byte 編碼。
  - 原廠建議：在可行的情況下，先暫停非必要、對網際網路開放的 Ruby 服務，直到更新完成。公告寫調查仍在進行。
  - 修補版本：我今天沒有讀到公告裡的 errata 清單，各產品的修補是否已釋出沒有確認。
  - 是否已遭利用：公告沒有讀到已遭利用的說明。
  - 日期：公告頁顯示 Updated 2026-11-20 12:39。昨天檢查時 Red Hat Security Bulletin 清單最新一筆是 RHSB-2026-020。
- 對我們的影響：OpenShift 5 與 4 被列為直接受影響，客戶會問要不要動作。目前能做的是盤點叢集上對外開放、用 Ruby 寫的工作負載（含以 UBI Ruby 映像建出來的應用），並追這則公告的 errata；z-stream 今天沒有新版（仍是 5.0.1）。
- 來源：RHSB-2026-021 One-byte heap overflow - ruby (CVE-2026-132825) - ruby2shell（頁面顯示 Updated 2026-11-20）：https://access.redhat.com/security/vulnerabilities/RHSB-2026-021

### OpenShift：RHBA-2026:100764，RHEL 8 為基礎的 Middleware Containers 映像更新

→ [產品頁](../../products/openshift.md)

- 類別：修補
- 內容：
  - 公告標題：updated RHEL-8 based Middleware Containers container images。
  - 發布時間：2026-11-20（UTC 14:50）。
  - 說明：公告寫這次更新是為了處理 RHSA-2026:100556。
  - OpenShift Container Platform 本身今天沒有新的 z-stream，最新仍是 5.0.1（RHSA-2026:94537、RHSA-2026:94538，2026-11-09）。
- 對我們的影響：使用 RHEL 8 為基礎的 Red Hat Middleware 容器映像的客戶，重新拉取映像並重建應用映像即可取得修正。不需要動 OpenShift 叢集本身。
- 來源：RHBA-2026:100764（2026-11-20）：https://access.redhat.com/errata/RHBA-2026:100764

### JBoss EAP：兩張 OpenShift 映像 respin errata，EAP 8.1 Update 9 與 EAP 7.4.26.GA 的映像重新建置

→ [產品頁](../../products/jboss-eap.md)

- 類別：修補
- 內容：
  - RHEA-2026:100759「EAP 8.1 GA update 9 OpenShift Image Release respin」（2026-11-20，UTC 14:37）：JBoss EAP 8.1 update 9 的 builder 與 runtime 映像，用於在 OpenShift Container Platform 4 上以 OpenJDK 17 或 21 執行 Jakarta EE 10 應用程式；架構有 amd64、ppc64le、s390x、arm64。公告沒有列 CVE。
  - RHEA-2026:100770「EAP 7.4.26.GA OpenShift Image Release Respin」（2026-11-20，UTC 16:35）：產品欄位是 JBoss EAP 7.4 ELS；公告列出可搭配的 OpenShift Container Platform 版本為 4.12、4.14、4.16、4.18、4.19、4.20、4.21、4.22；內容請見 7.4.26.GA release notes（https://access.redhat.com/articles/7148910）。
  - EAP 本身沒有新版：文件頁最新仍是 8.1 Update 9.1。
- 對我們的影響：在 OpenShift 上用 EAP 8.1 或 EAP 7.4 映像的客戶，重建應用映像就會用到新的基底映像。EAP 版本沒有變，不是功能更新；兩張都是 RHEA（Enhancement Advisory），不是安全公告。
- 來源：
  - RHEA-2026:100759（2026-11-20）：https://access.redhat.com/errata/RHEA-2026:100759
  - RHEA-2026:100770（2026-11-20）：https://access.redhat.com/errata/RHEA-2026:100770

### CI/CD/Argo CD：安全公告 GHSA-jj8j-82j2-7ph7，`last-applied-configuration` 不是合法 JSON 時 Secret 遮罩會被跳過（CVSS 6.3）

→ [產品頁](../../products/cicd.md)

- 類別：安全公告
- 內容：
  - 編號：GHSA-jj8j-82j2-7ph7，公告沒有列 CVE 編號。標題寫明這是 CVE-2026-45737（GHSA-rg3g-4rw9-gqrp）修正不完整的後續。
  - 嚴重度與 CVSS：Medium，CVSS 3.1 基本分數 6.3（評分來源：Argo CD 的 GitHub 公告；向量 AV:N/AC:H/PR:L/UI:N/S:C/C:H/I:N/A:N）。
  - 問題：live Secret 上的 `kubectl.kubernetes.io/last-applied-configuration` annotation 不是合法 JSON 時，Argo CD 會跳過 Secret 遮罩。攻擊者需要有檢視該 Application 的權限。
  - 受影響版本：v3.2.12 起的 3.2 版、v3.3.10 到 v3.3.13、v3.4.2 到 v3.4.6、v3.5.0。
  - 修補版本：v3.6.0、v3.5.1、v3.4.7、v3.3.14。修正後遮罩失敗時改為不顯示內容（fail closed）。
  - 暫時緩解做法：把 Secret 上的 `kubectl.kubernetes.io/last-applied-configuration` annotation 移除，或改用 server-side apply；用 RBAC 限制能檢視 Application 的人。
  - 日期：公告發布於 2026-11-20（UTC 04:04）。Argo CD 的 release 今天沒有新版，最新仍是 v3.6.2、v3.5.8、v3.4.14，都已含修正。
- 對我們的影響：用 Argo CD 的客戶確認版本是否在修補版本以上；3.2 版列為受影響但公告沒有列 3.2 的修補版本，還在 3.2 的環境要升到 3.3.14 以上。OpenShift GitOps 的版本對應今天沒有查，不能直接套用。
- 來源：GHSA-jj8j-82j2-7ph7（2026-11-20）：https://github.com/argoproj/argo-cd/security/advisories/GHSA-jj8j-82j2-7ph7

### CI/CD/Flux：v2.10.1 修補版，修正憑證快取、私有位址 registry 驗證與 Git checkout 的問題

→ [產品頁](../../products/cicd.md)

- 類別：修補
- 內容：
  - 版本與日期：Flux v2.10.1，2026-11-20 發布（UTC 13:08）；source-controller 為 v1.10.2。
  - 修正 credential cache key：ServiceAccount 上的 `credential.auth.fluxcd.io/username` 與 `gcp.auth.fluxcd.io/workload-identity-provider` annotation 變更後，下一次 reconcile 就會生效。
  - kustomize-controller：預設的 decryption ServiceAccount 改為用到雲端 KMS 或 Vault 後端時才解析。
  - source-controller：把 ORAS 更新到 v2.7.0，恢復對 token service 在私有位址的 registry 的驗證，以及同主機 HTTP 轉 HTTPS 之後的驗證。
  - source-controller、image-automation-controller：修正 Git checkout 會刪掉相對 symlink 的目標或卡住的問題。
  - 已刪除物件的 reconcile duration metric 序列會被清掉。
- 對我們的影響：離線環境的私有 registry 常把 token service 放在私有位址，用 Flux 從這類 registry 拉 OCI 來源而遇到驗證失敗的客戶，可以先看這一版。沒有遇到這些問題的環境照一般修補節奏升級即可。
- 來源：Flux v2.10.1（2026-11-20）：https://github.com/fluxcd/flux2/releases/tag/v2.10.1

#### 今日無更新

21 項，名單與各產品目前的版本見 [26 項產品現況](../../products/README.md)。

#### 今日無法確認

1 項：

- Software Risk Manager (SRM)：文件入口頁 https://docs.blackduck.com/p/softwareriskmanagement 打得開，但找不到 release notes 頁（試的網址被導回首頁），也沒有找到公開的安全公告頁，所以無法判斷有沒有新版。

以下是個別來源或個別項目沒能確認，所屬產品的當天狀態不受影響，不算在上面的 1 項裡：

- JBoss EAP：Customer Portal 上的 release notes 文章內容需要登入，只讀到標題與日期。
- JBoss EAP：html-single 版的 release notes 今天沒有重新打開，沿用昨天的紀錄。
- AppScan：仍沒有找到公開的安全公告頁。
- Seeker：仍沒有找到公開的安全公告頁。
- OpenShift：RHSB-2026-021 的 errata 清單今天沒有讀到。
- OpenShift：RHSB-2026-018、RHSB-2026-019、RHSB-2026-020 今天沒有重新打開，有沒有更新沒有確認。
- Concert：roadmap 頁今天沒有重新打開，沿用昨天的紀錄。
- Quantum Safe Explorer (QSE)：release notes 只確認頁面的 Last Updated 沒有變，版本號沒有重讀；單則安全公告頁今天沒有重新打開。

#### 無公開來源

- CMC（IBM Certificate Management Console）：IBM Expert Labs 的資產，沒有公開的版本頁或公告頁，不列入檢查。

#### CI/CD 各工具狀態

12 個工具逐一列在 [CI/CD 產品頁](../../products/cicd.md)，今天有更新的：GitLab、Argo CD、Flux；無法確認的：無。
