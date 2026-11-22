# CVE 重大新聞｜2026-11-23

[← 今日摘要](README.md)｜[產品動態](products.md)｜[新知識](knowledge.md)｜[CVE](cve.md)｜[台灣 IT](taiwan.md)｜[AI](ai.md)｜[清單維護](maintenance.md)｜[26 項產品現況](../../products/README.md)

### CVE-2026-125396（Upload2Shell）：Ghostscript 的 -dSAFER 沙箱可被特製文件繞過，上傳、預覽、列印功能都可能變成遠端執行指令的入口

- 發生什麼事：資安公司 pwn.ai 於 2026-11-21 發表技術分析，The Hacker News 2026-11-22 報導。Ghostscript 是許多 Linux 伺服器用來轉換 PDF、PostScript 與圖片的直譯器。它的 Type 1 字型載入程式有 use-after-free，特製文件可以藉此關掉 -dSAFER 沙箱的檢查，以負責轉檔的那個帳號在伺服器上執行指令。機制見今天的[新知識](knowledge.md)。
- 為什麼不只是本機漏洞：應用程式不必自己呼叫 Ghostscript。依 pwn.ai 的測試，下列函式庫收到 PostScript 或 EPS 內容時會轉交給 Ghostscript，即使檔名是 `.png`、`.jpg` 或 `.pdf`：
  - Pillow（`Image.load()`、`crop()`）。
  - imageio 與 scikit-image（經由 Pillow）。
  - PHP Imagick（`Imagick::readImage()`，經由 ImageMagick 的 PostScript delegate）。
  - libvips（`thumbnail()`，視系統安裝的 loader 而定）。
  - Qt 的 KImageFormats EPS plugin（`QImageReader.read()`）。
  - 同一份測試中沒有啟動 Ghostscript 的：PHP GD、OpenCV、預先編譯的 Sharp、Jimp、Java ImageIO、Go 標準函式庫的影像解碼器。
- pwn.ai 實測成功、不需要登入的路徑（依 The Hacker News 與 pwn.ai 的 impact index）：
  - Debian 13 上共用的 CUPS 列印佇列，匿名送出列印工作，以 `lp` 身分執行。
  - Roundcube webmail，收件人開啟郵件時附件被產生縮圖，以 `www-data` 身分執行。
  - WordPress 外掛 Forminator 的公開上傳表單。
  - WordPress 外掛 Essential Addons for Elementor 的公開上傳欄位。
  - WordPress Core 本身需要有上傳權限的帳號（Author 以上）；WordPress 已在 2026-08-12 的 7.0.4 以另一個編號 CVE-2026-65640 關掉自己的上傳路徑。
- 受影響版本：Ghostscript（ghostpdl）10.08.0 之前的所有版本（VulnCheck 公告與 NVD 紀錄）。
- 嚴重度：
  - VulnCheck（CNA）：CVSS 4.0 為 8.5，CVSS 3.1 為 7.8（NVD 紀錄所列；NVD 自己尚未評分，狀態為 Awaiting Analysis）。
  - SUSE：important，CVSS 3.1 為 7.8，CVSS 4.0 為 8.5。
  - 兩個評分的攻擊向量都是 Local，但 pwn.ai 的測試是從網路經由列印、郵件與網頁上傳到達 Ghostscript，實際風險要看應用程式怎麼處理上傳的檔案。
- 是否已有修補：
  - 上游：Ghostscript 10.08.0（2026-09-08 釋出）。
  - Debian（security tracker，2026-11-23 查看）：bookworm 基本套件 10.0.0~dfsg-11+deb12u8 標為 vulnerable，bookworm (security) 的 10.0.0~dfsg-11+deb12u9 已修正（DLA-4914-1）；trixie 的 10.05.1~dfsg-1+deb13u3 已修正（DSA-6516-1）。The Hacker News 引述 pwn.ai 上週的調查寫「Debian 12 listed as vulnerable」，與 tracker 現況不同，兩者都列出。
  - SUSE：CVE 頁的整體狀態是 Pending（2026-11-23 查看）；The Hacker News 引述 pwn.ai 的調查寫 SUSE Linux Enterprise 12 SP5、部分 15、Server 16.0 與 16.1 是 fix in progress。
  - Red Hat：我沒有查到 Red Hat 的 CVE 頁（查詢回 404）；The Hacker News 寫 pwn.ai 沒有確認 Red Hat、Rocky Linux、AlmaLinux、Oracle Linux 與 Fedora 目前的套件有沒有修正。
  - 注意：更新主機的套件不會更新容器映像或應用程式內自帶的 Ghostscript。
- 暫時緩解（依 The Hacker News）：列印佇列要求驗證；限制影像處理程式接受的檔案類型；pwn.ai 的一項測試中，AppArmor profile 擋下了被攻破的直譯器啟動 shell。
- 攻擊現況：The Hacker News 寫沒有被用於攻擊的報告。pwn.ai 公開了一個 PoC 檔，只示範核心的記憶體操作（改一個值再改回來），不執行指令也不碰主機檔案，在 10.08.0 上會失敗。
- 影響：不屬於我們的產品線，但 Ghostscript 隨 RHEL、SLES 出貨，也常被包進容器映像。客戶的應用（跑在 Liberty、JBoss EAP、OpenShift 上的）只要有「上傳檔案後產生縮圖或預覽」或文件轉檔功能，就值得查映像裡有沒有 Ghostscript 以及版本；Black Duck 或 NeuVector 的映像掃描可以用 CVE-2026-125396 直接查。SLES 的修補還在進行，Red Hat 的狀態未查到，客戶問起時照實說明。
- 來源：
  - pwn.ai「How We Hacked the Pipes — Upload2Shell」（2026-11-21）：https://pwn.ai/upload2shell/research.html
  - pwn.ai Upload2Shell impact index：https://pwn.ai/upload2shell
  - VulnCheck 公告（2026-11-09）：https://www.vulncheck.com/advisories/ghostscript-before-10.08.0-dsafer-bypass-via-putgstringcopy-forceput-recovery
  - NVD（2026-11-10 發布，2026-11-22 最後修改）：https://nvd.nist.gov/vuln/detail/CVE-2026-125396
  - Debian security tracker：https://security-tracker.debian.org/tracker/CVE-2026-125396
  - SUSE CVE 頁：https://www.suse.com/security/cve/CVE-2026-125396.html
  - Ghostscript 10.08.0 release（2026-09-08）：https://github.com/ArtifexSoftware/ghostpdl-downloads/releases/tag/gs10080
  - The Hacker News（2026-11-22）：https://thehackernews.com/2026/11/researchers-demonstrate-ghostscript.html

### Microsoft Entra Connect Health API 漏洞遭利用，租戶管理員信箱與設定資料外洩（沒有 CVE 編號，Microsoft 已在服務端修補）

- 發生什麼事：BleepingComputer 2026-11-21 報導，Microsoft 通知客戶，攻擊者利用 Entra Connect Health 服務 API 的漏洞，未經授權讀取租戶層級的資料。Entra Connect Health 是用來從 Microsoft Entra 管理中心監看地端身分基礎設施（例如 AD 同步）健康狀態的雲端服務。
- 時間（依 Microsoft 的通知，BleepingComputer 轉述）：
  - 2026-07-23：漏洞被引入。
  - 2026-11-09：Microsoft 發現漏洞。
  - 2026-11-19：服務端修補上線。
  - 2026-11-20：調查結束，開始通知受影響的組織。
- CVE 編號與嚴重度：報導沒有提到 CVE 編號與 CVSS，未查到。
- 外洩的資料：
  - 租戶技術聯絡人與管理員帳號的電子郵件地址。
  - 租戶 ID、顯示名稱、初始網域名稱、國家代碼與區域資訊。
  - Microsoft Entra 授權等級與目錄同步狀態（是否啟用、最後同步時間）。
  - Connect Health 的 onboarding 狀態。
  - 一張已過期的憑證，過去用來向一個 2024 年底已停用的 Microsoft 內部服務註冊 Connect Health agent。
- 沒有外洩的（Microsoft 的說法）：使用者密碼、密碼雜湊、驗證權杖、有效的金鑰、地端伺服器與 Active Directory 拓樸、Azure 訂閱資訊。Microsoft 表示是唯讀存取，沒有發現未經授權的設定變更。
- 是否已有修補：Microsoft 已在服務端修補，通知寫客戶不需要更新軟體或做其他修補動作。
- 攻擊現況：已遭利用。Microsoft 沒有公布攻擊者是誰、多少租戶受影響、攻擊從何時開始。BleepingComputer 寫 Reddit 上有十幾位管理員表示收到通知。
- Microsoft 建議的動作：
  - 提醒資安團隊，外洩的管理員信箱與租戶資訊可能被用於針對性的釣魚與社交工程。
  - 確認特權帳號使用抗釣魚的多因素驗證。
  - 檢查 Connect Health 設定，以及 Entra 的稽核與登入紀錄。
  - Microsoft 提供 PowerShell 指令碼（https://aka.ms/ConnectHealth/scripts）列出可能外洩的資料類型；它顯示的是目前的設定值，不是當時被讀走的內容。
- 影響：不屬於我們的產品線。客戶用 Entra ID（Azure AD）做單一登入、而且有裝 Connect Health agent 的，請客戶的租戶管理員確認有沒有在 Azure Service Health 收到這則通知。客戶環境裡 OpenShift、Vault、Instana 等以 Entra ID 做登入的，登入本身不受影響，要留意的是之後針對管理員的釣魚信。
- 注意：這篇報導的日期是 2026-11-21，早於 11-22 晨報的蒐集時間；11-22 當天 BleepingComputer 沒有讀到，今天補上。
- 來源限制：Microsoft 的通知是寄給受影響客戶的，沒有公開網頁；以上內容全部依 BleepingComputer 的報導，我沒有讀到 Microsoft 的原文。
- 來源：BleepingComputer（2026-11-21）：https://www.bleepingcomputer.com/news/security/microsoft-entra-connect-health-flaw-exploited-to-steal-tenant-data/

今天沒有屬於我們 26 項產品的新安全公告；CISA KEV 自 2026-11-20 之後沒有新增（2026-11-23 查看）。
