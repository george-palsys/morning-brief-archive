# CVE 重大新聞｜2026-11-22

[← 今日摘要](README.md)｜[產品動態](products.md)｜[新知識](knowledge.md)｜[CVE](cve.md)｜[台灣 IT](taiwan.md)｜[AI](ai.md)｜[清單維護](maintenance.md)｜[26 項產品現況](../../products/README.md)

### NeuVector 四則安全公告：CVE-2026-127182（CVSS 4.0 為 9.4）、CVE-2026-127183（9.2）等【與我們的產品線相關】

見[產品動態](products.md)（NeuVector：四則安全公告，修補版本 5.7.0、5.6.5、5.5.6）。這一則直接影響清單上的產品而且有原廠公告，完整內容與來源寫在產品動態，這裡不重複。

### IBM Concert Software 56 個 CVE，最高 CVSS 9.8（CVE-2026-96760）【與我們的產品線相關】

見[產品動態](products.md)（Concert：Security Bulletin 7297667，修補版本 3.1.0）。這一則直接影響清單上的產品而且有原廠公告，完整內容與來源寫在產品動態，這裡不重複。

### CISA KEV 於 2026-11-20 新增四個漏洞：SAP NetWeaver（CVE-2025-42884）、VMware vCenter、Cisco Expressway、Apache Roller（後三個為後續）

- 發生什麼事：CISA 在 2026-11-20 依已遭實際利用的證據，把四個漏洞加入 KEV 目錄。其中 vCenter、Cisco Expressway、Apache Roller 三個是 11-20 晨報報過的漏洞，這次是正式列入 KEV；SAP NetWeaver 的 CVE-2025-42884 是第一次出現在晨報。
- CVE 編號與受影響產品（名稱依 CISA 公告）：
  - CVE-2025-42884：SAP NetWeaver，Improper Neutralization of Special Elements in Data Query Logic Vulnerability。
  - CVE-2026-123890：VMware vCenter，Authentication Bypass Using an Alternate Path or Channel Vulnerability。
  - CVE-2026-76466：Cisco Expressway Series，Use of Hard-coded Credentials Vulnerability。
  - CVE-2026-129448：Apache Roller，Deserialization of Untrusted Data Vulnerability。
- 受影響版本：CISA 公告與 KEV 目錄沒有列版本。CVE-2025-42884 依 The Hacker News 的說明是 SAP NetWeaver Enterprise Portal，未登入的攻擊者可以透過注入 JNDI 環境屬性或 JNDI lookup 用的 URL，讀取或竄改伺服器資訊；受影響版本我沒有查到。
- 嚴重度：
  - CVE-2025-42884：CVSS 3.1 為 6.5（SAP 評分，NVD 紀錄所列）。
  - CVE-2026-123890：9.8（The Hacker News 所列，沒有寫評分來源與版本）。
  - CVE-2026-76466：9.8（The Hacker News 所列，沒有寫評分來源與版本）。
  - CVE-2026-129448：9.8（The Hacker News 所列，沒有寫評分來源與版本）。
- 是否已有修補：依 The Hacker News 的整理，SAP 在 2025 年 11 月修補，Cisco Expressway 在 2026 年 10 月修補，vCenter 與 Apache Roller 在 2026 年 11 月修補。修補版號這次沒有另外查原廠公告。
- 攻擊現況：四個都已遭實際利用（列入 KEV 的條件）。KEV 目錄四個的修補期限都是 2026-11-23，是否用於勒索軟體都寫 Unknown。The Hacker News 寫 CVE-2025-42884 目前沒有公開的攻擊報告；CVE-2026-76466 依資安業者 F6 的報告，在 PoC 公開後被用來入侵一家俄羅斯的組織。
- 影響：vCenter 是客戶機房最常見的一項，11-20 晨報已提醒過，正式列入 KEV 且期限只有三天，客戶的上級機關或稽核比較可能直接問到。SAP NetWeaver Enterprise Portal 不屬於我們的產品線，客戶有 SAP 的可以轉給負責的廠商確認 2025 年 11 月的 Security Note 有沒有上。
- 來源：
  - CISA 公告「CISA Adds Four Known Exploited Vulnerabilities to Catalog」（2026-11-20）：https://www.cisa.gov/news-events/alerts/2026/11/20/cisa-adds-four-known-exploited-vulnerabilities-catalog
  - CISA KEV 目錄（2026-11-22 查看，版本 2026.11.20）：https://www.cisa.gov/known-exploited-vulnerabilities-catalog
  - The Hacker News（2026-11-21）：https://thehackernews.com/2026/11/hackers-exploit-critical-vmware-cisco.html

### CVE-2026-129975：GnuPG 的 GPGME 函式庫 double free，官方稱為 critical，修補版本 GPGME 2.3.1

- 發生什麼事：GnuPG 專案在 2026-11-20 發布安全公告。GPGME 是應用程式用來呼叫 GnuPG 的標準函式庫。帶有特製超長 user ID 的 OpenPGP 金鑰可以觸發 double free，公告寫可以藉由送出簽章資料等方式從應用程式竊取資料，而且不能排除遠端程式碼執行，建議立即更新。
- 成因（依公告）：GPGME 讀取 gpg 回傳的狀態列與金鑰清單時，先配置 1024 byte 的緩衝區，不夠時重新配置；新的指標只在函式結束時才寫回 context，如果中途因讀取錯誤提早返回，context 還留著已釋放的舊指標，之後釋放 context 時就再釋放一次。
- 受影響版本：GPGME 2.3.0 之前的所有版本，不論是 shared library、DLL 或靜態連結。公告列的使用者有 Gpg4win、GnuPG Desktop、GnuPG VS-Desktop、多數郵件用戶端、許多 XMPP 用戶端、Samba、Flatpak（公告原文拼作 Flatpack）。
- 嚴重度：GnuPG 公告稱為 critical security bug，沒有列 CVSS。NVD 今天還查不到這個 CVE 的紀錄，分數不寫。
- 是否已有修補：GPGME 2.3.1（2026-11-19）。Windows 用新版 Gpg4win 取得更新後的 DLL（The Hacker News 寫是 Gpg4win 5.1.2）；靜態連結的程式要用 2.3.1 重新建置；不能升級的版本可以套公告附的 patch。GPGMEPP 與 GPGMEQT 不需要更新。
- 攻擊現況：公告沒有提到實際攻擊。漏洞由 Johan Carlsson 發現，GitLab 於 2026-11-12 通報；原訂 2026-11-25 協調揭露，因為 GitLab 為了 Ruby2Shell 必須提前更新，所以提早到 2026-11-20 公開。
- 影響：不屬於我們的產品線，但 GPGME 隨 Linux 發行版出貨，RHEL、SLES 上有用到它的套件之後會被客戶的弱點掃描掃出來，等發行版的修補套件即可。GitLab 昨天的 Critical Patch Release 是否已含這個修正，我沒有回頭確認 GitLab 的公告。
- 來源：
  - GnuPG 公告「GnuPG Security Advisory for GPGME (T8557,CVE-2026-129975)」（2026-11-20）：https://lists.gnupg.org/pipermail/gnupg-announce/2026q4/000517.html
  - The Hacker News（2026-11-21）：https://thehackernews.com/2026/11/gnupg-warns-critical-gpgme-flaw-could.html

### CVE-2026-99312：Linux KVM 在 AMD 巢狀虛擬化下，虛擬機可以讀寫 host 記憶體

- 發生什麼事：Linux kernel CVE 團隊於 2026-11-18 公告 KVM 的漏洞。The Hacker News 2026-11-20 報導，資安公司 Terra Security 的研究員 Oren Yomtov 在 DigitalOcean 的一台 Droplet 裡讀出 host 約 127 GB 的記憶體（唯讀對映）；在研究團隊自己的 AMD 實體機上，guest 把 32 個指定的 byte 寫進 host 核心的記憶體分頁。機制見今天的[新知識](knowledge.md)。
- 受影響範圍：只有 AMD 處理器、而且開啟巢狀虛擬化的 KVM host。Intel 的 KVM host 不受影響。攻擊者要先在該 host 上的一台 guest 裡有 root 權限，不是只靠網路連線。
- 嚴重度：
  - Linux kernel CVE 團隊：CVSS 3.1 為 8.8（NVD 紀錄所列，NVD 自己尚未評分）。
  - Red Hat：Important，CVSS 3.1 為 7.8（Red Hat 的 CVE 資料標示為 draft）。
- 是否已有修補：上游核心已修正（依 The Hacker News：維護者於 2026-10-21 接獲通報、2026-11-02 合併修正，修正版核心在研究公開的前一天釋出）。各發行版的修補套件版號這次沒有查。暫時緩解是關閉 AMD 上的巢狀虛擬化。DigitalOcean 已用 live patch 修補自己的主機。
- 攻擊現況：The Hacker News 引述 VirtFusion：沒有研究以外被利用的報告，也沒有公開的攻擊程式。
- 影響：客戶在 AMD 主機上跑 KVM（含 OpenShift Virtualization、RHEL KVM）而且開了巢狀虛擬化才需要處理；一般正式環境很少開。Red Hat 對 RHEL 與 OpenShift 的修補狀態要看它的 CVE 頁，我只讀了嚴重度與說明，沒有讀受影響產品清單。
- 來源：
  - linux-cve-announce（2026-11-18）：https://lists.openwall.net/linux-cve-announce/2026/11/18/2
  - Red Hat CVE 頁：https://access.redhat.com/security/cve/cve-2026-99312
  - The Hacker News（2026-11-20）：https://thehackernews.com/2026/11/new-linux-kvm-flaw-cve-2026-99312-lets.html

### CVE-2026-133968：MONAI Label 路徑穿越可任意寫檔（CVSS 3.1 為 9.8），被 AI 代理自行找到並用於入侵，目前沒有修補版本

- 發生什麼事：MONAI Label 是研究團隊用來標註醫學影像、訓練影像模型的開源伺服器。專案的安全公告 GHSA-qc22-rmgc-vg94 指出，`PUT /datastore/image` 的 `image` 參數沒有檢查就拿來組檔案路徑，像 `../../../tmp/x` 這樣的值可以把上傳內容寫到程式有權限寫入的任何位置；`PUT /datastore/label` 有同樣的問題。任意寫檔可以進一步變成遠端程式碼執行（例如覆寫程式碼、寫入 `.ssh/authorized_keys` 或 cron）。
- 這則值得注意的原因：The Hacker News 2026-11-21 報導，Amazon Threat Intelligence 表示，疑似與中國有關的攻擊者用開源的 AI 滲透測試框架 Cairn 驅動自主 AI 代理，找到這個當時未知的漏洞，並取得一所大學伺服器的 root 權限。代理在 2026 年 9 月約 48 小時的行動中，大約 11 分鐘就摸清應用介面並做到寫檔；操作者只設定目標與「取得 shell」這個目的，方法由代理自己選。Amazon 對歸因的信心是中等。
- 受影響版本：monailabel（pip）0.8.5 以前。預設不啟用驗證（`MONAI_LABEL_AUTH_ENABLE=False`），網路連得到就能利用；啟用驗證時，ANNOTATOR 角色就夠。
- 嚴重度：CVSS 3.1 為 9.8（MITRE 評分，NVD 紀錄所列）。
- 是否已有修補：原始碼已在 PR #1915 修正，但公告的 Patched versions 欄寫 None，還沒有可安裝的修正版。
- 攻擊現況：已被用於實際入侵（Amazon 的報告）。今天的 CISA KEV 目錄沒有這個 CVE。
- 影響：不屬於我們的產品線；醫學中心與研究單位的客戶如果有 MONAI Label，先確認沒有對外開放並啟用驗證。對我們比較有用的是案例本身：AI 代理從摸索介面到寫檔只要十幾分鐘，「預設沒有驗證」的內部研究工具風險比過去高，和 11-20 晨報新知識寫過的 AI 滲透測試編排器是同一條線。Amazon 的原始報告我沒有讀到全文，以上入侵經過依 The Hacker News 的轉述。
- 來源：
  - GHSA-qc22-rmgc-vg94：https://github.com/Project-MONAI/MONAILabel/security/advisories/GHSA-qc22-rmgc-vg94
  - The Hacker News（2026-11-21）：https://thehackernews.com/2026/11/attackers-ai-agents-found-zero-day-in.html
