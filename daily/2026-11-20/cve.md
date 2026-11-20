# CVE 重大新聞｜2026-11-20

[← 今日摘要](README.md)｜[產品動態](products.md)｜[新知識](knowledge.md)｜[CVE](cve.md)｜[台灣 IT](taiwan.md)｜[AI](ai.md)｜[清單維護](maintenance.md)｜[26 項產品現況](../../products/README.md)

### CVE-2026-114938（Java4Shell）（後續）：開始出現攻擊嘗試，Red Hat 釋出第一張 errata，Keycloak 映像已更新【與我們的產品線相關】

見[產品動態](products.md)（OpenShift：RHSB-2026-018）。這一則直接影響清單上的產品而且有原廠產品公告，完整內容與來源寫在產品動態，這裡不重複。

### NGINX2Root：F5 緊急修補 nginx 十個漏洞，其中五個可能遠端執行程式碼（CVE-2026-123007 等），Red Hat 評為 Critical【與我們的產品線相關】

見[產品動態](products.md)（OpenShift：RHSB-2026-019）。這一則直接影響清單上的產品而且有原廠產品公告，完整內容與來源寫在產品動態，這裡不重複。

### CVE-2026-123890：VMware vCenter 驗證繞過漏洞，9 月起已被當成 zero-day 利用

- 發生什麼事：Broadcom 在 2026-11-19 發布 VMSA-2026-0009，修補 vCenter 的 VMware Directory Service 驗證繞過漏洞，能連到 vCenter 的未登入攻擊者可以取得 `administrator@vsphere.local` 的工作階段。Google Threat Intelligence Group 與 Mandiant 在 2026-11-20 發表報告，指疑似中國背景的 ARMORY CASTLE（原 UNC5221）從 2026 年 9 月初就用自製工具 BONESAW 利用這個漏洞：先用 BeyondTrust Remote Support 的 CVE-2026-102764 進入內網，再打 vCenter，偷走目錄資料庫與 SAML 簽章金鑰、建立 SSO 管理員帳號，最後進到 ESXi 主機，從 VMFS 抽出虛擬機內的資料（包含 Active Directory 的 NTDS）。
- 受影響產品與版本：
  - vCenter 8.0（8.0 U3m 之前）。
  - vCenter 7.0（已過一般支援期）。
  - VMware Cloud Foundation／vSphere Foundation 9.1.x（9.1.1.0200 之前）。
  - VMware Cloud Foundation／vSphere Foundation 9.0.x（9.0.2.0200 之前）。
  - VMware Cloud Foundation 5.x（5.2.5 之前）。
  - VMware Telco Cloud Platform 3.0、4.x、5.0.x、5.1.x、5.2。
  - VMware Telco Cloud Infrastructure 3.0。
  - Broadcom 說明 vSphere 6.5 與 6.7 應視為受影響。
  - 同一份公告另外修補：CVE-2026-123891（SDDC Manager SQL injection）、CVE-2026-123892（SDDC Manager 已驗證 command injection）、CVE-2026-123893（SDDC Manager 本機權限提升）、CVE-2026-123894（VMware Tools for Windows SAML token 簽章繞過，影響 13.x、12.x、11.x）。
  - 不受影響：ESX、NSX、VCF Operations、VCF Automation、VMware Workstation、VMware Fusion、非 Windows 的 VMware Tools。
- 嚴重度：Broadcom 評分，CVSS 3.x。CVE-2026-123890 為 9.8（Critical）；CVE-2026-123891 為 8.1；CVE-2026-123892 為 7.2；CVE-2026-123893 為 6.7；CVE-2026-123894 為 6.7。
- 是否已有修補：
  - vCenter 8.0：8.0 U3m。
  - VCF／vSphere Foundation 9.1.x：9.1.1.0200。
  - VCF／vSphere Foundation 9.0.x：9.0.2.0200（SDDC Manager 為 9.0.2.0100）。
  - VCF 5.x：5.2.5。
  - Telco Cloud Platform 與 Telco Cloud Infrastructure：依 KB463116。
  - vCenter 7.0：沒有公開修補，需有延長支援合約並聯絡 Broadcom Support。
  - VMware Tools for Windows：13.1.5.0（13.x）、12.5.5（12.x 與 11.x）。
  - 所有 CVE 都沒有 workaround。
- 攻擊現況：已遭實際利用超過兩個月。Broadcom 公告本身沒有提到實際攻擊，利用情形來自 Mandiant 報告。今天查看 CISA KEV 目錄尚未列入。
- 影響：不屬於我們的產品線，但金融業與公部門客戶的 OpenShift、中介軟體、資料庫絕大多數跑在 vSphere 上，vCenter 被拿下等於上面所有虛擬機的磁碟都能被讀走。還在用 vCenter 7.0 的客戶沒有公開修補可裝，風險最高。Mandiant 建議的補強：用主機上的 iptables 限制可連 TCP 2012、443、22、5480 的來源；封鎖 vCenter 對外連線；把 log 送到遠端 SIEM；平時關閉 vCenter 的 SSH，並對 VAMI API 開啟 SSH 的請求發告警。
- 來源：
  - Broadcom VMSA-2026-0009（2026-11-19）：https://support.broadcom.com/web/ecx/support-content-notification/-/external/content/SecurityAdvisories/0/39495
  - Broadcom 官方 GitHub 說明頁（2026-11-19）：https://github.com/vmware/vcf-security-and-compliance-guidelines/tree/main/security-advisories/vmsa-2026-0009
  - Google Threat Intelligence Group／Mandiant 報告（2026-11-20）：https://cloud.google.com/blog/topics/threat-intelligence/armory-castle-exploits-vsphere
  - SecurityWeek（2026-11-19）：https://www.securityweek.com/newly-patched-vmware-vcenter-flaw-exploited-as-zero-day-by-chinese-apt/
  - BleepingComputer（2026-11-19）：https://www.bleepingcomputer.com/news/security/vmware-patches-vcenter-zero-day-exploited-in-attacks-since-september/

### CVE-2026-129448：Apache Roller 反序列化漏洞，Apache 表示正遭實際攻擊

- 發生什麼事：Apache 在 2026-11-17 的公告指出，Apache Roller（Java 寫的部落格平台）的 XML-RPC 介面在驗證身分之前就對資料做不安全的反序列化，未登入即可遠端執行程式碼，並寫明「This issue is being actively exploited」，沒有提供攻擊細節。Apache 說明它和 9 月揭露的 CVE-2026-82384 是同一個弱點，當時只列了 6.1.5 受影響。
- 受影響產品與版本：Apache Roller 4.0.0 到 6.1.4。
- 嚴重度：Apache 評為 Critical，CVSS 3.1 為 9.8（AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H）。
- 是否已有修補：升級到 6.1.6 以上。SecurityWeek 報導 6.1.7（2026-11-11 釋出）另外修了 15 個漏洞。在管理介面關閉 XML-RPC 擋不住這個攻擊。
- 攻擊現況：Apache 確認已遭實際攻擊。今天查看 CISA KEV 目錄沒有這個 CVE。
- 影響：不屬於我們的產品線。Roller 是跑在 Java 應用伺服器上的 WAR，客戶若有老舊的內部部落格或公告系統部署在 WebSphere 或 JBoss EAP 上，可以請他們查一下。
- 來源：
  - Apache 公告郵件（2026-11-17）：https://lists.apache.org/thread/lnz4s26tv6hdo03wngtdbpfj4hg4gtds
  - SecurityWeek（2026-11-19）：https://www.securityweek.com/critical-apache-roller-axis-vulnerabilities-exploited-in-attacks/

### CVE-2026-76466：Cisco Expressway 在 PoC 公開後遭實際攻擊

- 發生什麼事：SecurityWeek 2026-11-19 報導，資安公司 F6 調查到攻擊者在 GitHub 出現 PoC 後不久，就攻陷一家俄羅斯組織兩台對外的 Expressway X15.5.3，取得 root 後橫向移動到內網另外兩個叢集節點，並部署自製 Python 工具掃描網路、搜尋 SMB、SQL Server、WinRM 與 GitLab 上的帳密與機敏資料。漏洞出在 Expressway 的資料庫服務功能，起因是固定不變的 cookie。
- 受影響產品與版本：Cisco Expressway-C 與 Expressway-E（虛擬與實體設備），執行 X15.5.3 以前的版本且設定為叢集時。
- 嚴重度：Cisco 評分，CVSS 3.1 為 9.8（Critical，AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H）。
- 是否已有修補：X15.5.20。X14 以前的版本要移轉到修正版。Cisco 表示沒有 workaround；F6 建議在防火牆封鎖 TCP 4371 到 4372，只允許可信任的叢集節點 IP。
- 攻擊現況：已有實際攻擊（F6 的調查），PoC 已公開。Cisco 公告自 2026-10-21 首次發布後沒有改版，仍寫不知道有惡意利用。今天查看 CISA KEV 目錄沒有這個 CVE。
- 影響：不屬於我們的產品線。Expressway 是視訊會議對外的閘道，常直接面對網際網路，有用 Cisco 視訊會議的客戶可以提醒確認版本。
- 來源：
  - Cisco 公告 cisco-sa-vcs-static-cred-hr7EWZ8t（2026-10-21）：https://sec.cloudapps.cisco.com/security/center/content/CiscoSecurityAdvisory/cisco-sa-vcs-static-cred-hr7EWZ8t
  - SecurityWeek（2026-11-19）：https://www.securityweek.com/hackers-exploit-cisco-expressway-vulnerability-soon-after-poc-release/
