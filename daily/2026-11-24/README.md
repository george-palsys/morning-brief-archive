# 晨報 2026-11-24（星期二）｜摘要

**今天最需要注意的一件事**：新加坡網路安全局（CSA）於 2026-11-17 發布警示，寫 mod_http2 的漏洞 CVE-2026-119618 已遭利用。客戶的 JBCS httpd 還沒升到 2.4.62 SP7、而且啟用了 HTTP/2 的，現在應該排進最近的維護時段；OpenShift GitOps 也在 2026-11-23 發布了含這個 CVE 的三張安全更新。 → [CVE](cve.md)

## 產品動態

26 項：有更新 3、無更新 21、無法確認 1、無公開來源 1。→ [完整內容](products.md)｜[26 項產品現況](../../products/README.md)

| 產品 | 更新 | 要不要動作 |
|---|---|---|
| [CI/CD/OpenShift GitOps](../../products/cicd.md) | 三張 RHSA（2026-11-23）：v1.22.4、v1.21.8、v1.20.12 安全更新，5 個 CVE，含 mod_http2 的 CVE-2026-119618 | 要。有用 OpenShift GitOps 的依版本線排升級；離線環境先鏡像新版 operator 與映像 |
| [WebSphere Liberty](../../products/websphere-liberty.md) | 7 月的公告 CVE-2026-16192（restConnector 阻斷服務，CVSS 3.1 為 7.1）清單日期變成 2026-11-23；修正版本仍是 26.0.0.9 | 已在 26.0.0.9 或更新版本的不用動；26.0.0.8 或更舊且啟用 restConnector 的套 interim fix 或升級 |
| [OpenShift](../../products/openshift.md) | 六張 RHBA（2026-11-23），4.12、4.21、4.22、5.0 的 dpdk-base 與 openperouter-operator extras 映像更新；沒有新的 RHSA | 叢集本身不用動；有用到這兩個元件的重新拉映像或更新 operator |

無法確認：Software Risk Manager (SRM)（文件入口頁打得開，但 release notes 要登入才看得到，也沒有公開的安全公告頁）。

## CVE 重大新聞

4 則。其中 3 則與我們的產品線相關。→ [完整內容](cve.md)

- 【與我們的產品線相關】CVE-2026-119618（後續）：Apache HTTP Server mod_http2 遠端執行程式碼漏洞，新加坡 CSA 警告已遭利用；JBCS httpd 的修補已在 SP7
- 【與我們的產品線相關】CVE-2026-114938（Java4Shell，後續）：GreyNoise 已看到 7 個來源 IP 送出攻擊樣式的請求，目前沒有確認成功的入侵
- 【與我們的產品線相關】CVE-2026-121481：OpenSSL `EVP_EncodeBlock()` 整數溢位，GitHub 列 9.8 分但 OpenSSL 自評 Low，上游只影響 4.0 與 4.1
- CVE-2026-133325：Apache Tomcat 叢集用 TLS 1.3 加 TLS-PSK 時不驗證對端，未經驗證的節點可以加入叢集，修補版本尚未釋出

## 新知識

5 則。→ [完整內容](knowledge.md)

- RFC 10070：OAuth 的 JWT 用戶端驗證，`aud` 只能填授權伺服器的 issuer identifier，不能再填 token endpoint 網址
- CVE-2026-119618 的機制：mod_http2 的工作執行緒寫進連線執行緒的記憶體，RHEL 9 與 10 因為每個 stream 各用一個 allocator 而較難利用
- phpAfterShell（CVE-2026-126714）的機制：session 檔寫到一半被中斷，新資料的開頭接上舊資料的結尾，下一次 `session_start()` 把它反序列化
- Kubernetes v1.38 預告：kubelet 不再接受自行設定的 cgroup driver，改由容器執行環境透過 CRI 回報
- Cloudflare 怎麼測 DNS：把端對端測試框架 Flamingo 擴充到 DNS，從每個資料中心對正式環境持續探測，結果決定版本要不要繼續上線

## 台灣 IT 重大事件

5 則。→ [完整內容](taiwan.md)

- 數發部：台灣政府網路每日平均抵禦約 280 萬次境外網攻，已有台灣企業加入 Anthropic 的 Project Glasswing
- 電商開店平台 BVShop、Shopline 相繼公告訂單資料遭未經授權存取，已有消費者收到冒用訂單資料的詐騙信
- 全國電（6281）發布資安重訊：會員收到冒名的假訂單郵件，信中的姓名、電子郵件、會員卡號與真實資料相符
- 崇越（5434）發布資安重訊：子公司全越運動的電商委外服務商伊比薩發現異常資料存取
- 尚凡國際（5278）發布資安重訊：不明 IP 位址侵入公司資訊設備，旗下 iPair、SweetRing 公告系統維護

## 全世界 AI 新功能及重大事件

4 則。→ [完整內容](ai.md)

- Nvidia 調查案（後續）：董事會一致決議讓黃仁勳回任總裁、執行長與董事，立即生效
- 亞馬遜與 Decart（後續）：亞馬遜正式公告買下 Decart 的 AI 最佳化技術並延攬創辦團隊，官方沒有公布金額
- 印度 CERT-In 示警：AI 輔助的網路攻擊已在銀行、金融服務業與支付服務商造成未經授權的金融交易
- Amazon 威脅情報：攻擊者的 AI 代理約 11 分鐘自行找到並利用醫療影像 AI 軟體 MONAI Label 的零時差漏洞，目標是東亞多所大學

## 清單維護

- 來源清單（products.yaml）今天沒有修正，沒有送 PR。
- 今天打開 108 個來源，107 個讀得到，1 個回 404（NeuVector 在 SUSE 文件站的舊網址）。
- WebSphere Liberty 的更新是舊公告的清單日期變動，改了什麼沒有查到；OpenShift GitOps 三張 RHSA 的網頁沒有逐張打開。
- 數位發展部新聞稿頁、國家資通安全研究院、BleepingComputer feed 等 7 個新聞來源今天沒有讀到。

→ [完整內容](maintenance.md)
