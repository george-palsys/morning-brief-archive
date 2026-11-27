# 產品動態｜2026-11-28

[← 今日摘要](README.md)｜[產品動態](products.md)｜[新知識](knowledge.md)｜[CVE](cve.md)｜[台灣 IT](taiwan.md)｜[AI](ai.md)｜[清單維護](maintenance.md)｜[26 項產品現況](../../products/README.md)

上一份晨報是 2026-11-27，這一份是那之後的變化。26 項：有更新 2、無更新 22、無法確認 1、無公開來源 1。

### Instana：IBM 再發一則自架版安全公告（node/7298440），列 70 個 CVE，修在 build 1.0.329

→ [產品頁](../../products/instana.md)

- 類別：安全公告
- 內容：IBM 於 2026-11-27 發布安全公告 node/7298440「Multiple vulnerabilities in IBM Observability with Instana (OnPrem)」，摘要寫多個漏洞已在 build 1.0.329 處理，受影響的是 Build 1.0.285 到 1.0.327，公告清單上的嚴重度是 High。這一則列了 70 個 CVE，和 2026-11-24 那一則（node/7297963）列的 CVE 沒有重複。分數最高的是 8.7（CVSS 4.0，評分來源 security@apache.org），共四個，都在 Apache Thrift 的 NodeJS binding：CVE-2026-83745、CVE-2026-86535、CVE-2026-94646、CVE-2026-96294。其他還有 Eclipse Jetty 的 CVE-2026-19203（HTTP/1.1 chunked 請求造成 request smuggling，8.3，CVSS 4.0）與 CVE-2026-1605（GzipHandler）。70 個 CVE 沒有逐一抄錄，完整清單見公告。
- 對我們的影響：要動作的對象和 2026-11-25 晨報寫的那一則相同：自架（Self-Hosted）Instana 的客戶確認後端 build 是不是 1.0.329，還在 1.0.327 或更舊的排升級；已經升到 1.0.329 的不用再動。SaaS 客戶不用動作。公告沒有寫這些元件的漏洞在 Instana 裡怎麼被觸發。
- 來源：IBM Security Bulletin node/7298440（2026-11-27）：https://www.ibm.com/support/pages/node/7298440

### CI/CD/OpenShift Pipelines：文件補上 1.24.3 的 release notes，兩項修正，其中一項把映像的 OpenSSL 政策改成 DEFAULT:PQ

→ [產品頁](../../products/cicd.md)

- 類別：修補
- 內容：Red Hat OpenShift Pipelines 1.24 的 release notes 今天最上面多了「Release notes for Red Hat OpenShift Pipelines 1.24.3」一節（昨天最新的一節是 1.24.2）。頁面寫 1.24.3 可用在 OpenShift Container Platform 4.14 與之後仍受支援的版本。這一節只有兩項 Fixed issues：(1) SRVKP-14944：bundle 裡有重複的 `tektonmulticlusterproxyaaes.operator.tekton.dev` CRD，造成 OLMv1 的 ClusterExtension 安裝失敗，這一版拿掉重複的定義；(2) SRVKP-15070：容器映像先前沒有把 OpenSSL 的預設密碼政策設成 DEFAULT:PQ，這一版改用啟用後量子密碼（PQC）的 base image 或設定；FIPS 模式下仍強制 FIPS 140，PQC 演算法停用。這一節沒有列 CVE，頁面也沒有寫發行日期。1.24.3 的 errata（RHEA-2026:93149、RHEA-2026:93150、RHEA-2026:93151）在 2026-10-31 就發布了，先前的晨報只把它記在比對紀錄裡，沒有寫內容；今天是文件補上說明。
- 對我們的影響：用 OLMv1（ClusterExtension）裝 OpenShift Pipelines 1.24 的環境，裝不起來的原因可能就是第一項，升到 1.24.3 處理。第二項和後量子轉換有關：客戶問「pipeline 元件的 TLS 會不會用到 PQC」時，1.24.3 起映像的 OpenSSL 政策是 DEFAULT:PQ，但開了 FIPS 模式的叢集不會用到 PQC。離線環境要鏡像 1.24.3 的 operator 映像。
- 來源：Red Hat OpenShift Pipelines 1.24 Release notes：https://docs.redhat.com/en/documentation/red_hat_openshift_pipelines/1.24/html-single/release_notes/index#op-release-notes-1-24-3_op-release-notes-1-24

#### 今日無更新

22 項，名單與各產品目前的版本見 [26 項產品現況](../../products/README.md)。

#### 今日無法確認

1 項：

- Software Risk Manager (SRM)：文件入口頁 https://docs.blackduck.com/p/softwareriskmanagement 打得開，但 release notes 要登入才看得到，也沒有公開的安全公告頁。GitHub 上的部署用 Helm chart（codedx/srm-k8s）最新仍是 v1.91.0（2026-11-17），它只是 chart 的版本紀錄，看不到 SRM 本身改了什麼，所以無法判斷有沒有新版。

以下是個別來源或個別項目沒能確認，所屬產品的當天狀態不受影響，不算在上面的 1 項裡：

- Instana：node/7298440 的 70 個 CVE 沒有逐一抄錄；公告的修補說明欄位今天沒有讀到，「修在 build 1.0.329」出自公告摘要。
- CI/CD（OpenShift Pipelines）：1.24.3 這一節在文件上沒有日期，也沒有 errata 編號；它是哪一天加到文件裡的無法確認。
- Coverity：Polaris release notes 頁的 Last Updated 從 11/25/2026 變成 11/27/2026，「November 2026」段落最上面多了一項 DAST profile 路徑規則的功能；這是 Polaris 的功能，沒有提到 Coverity 版本，不列為 Coverity 更新。同一段最後的「Tests 頁改用 React 架構」是不是今天新增的無法確認。
- OpenShift：Errata Search 最上面兩筆是 RHBA-2026:104101 與 RHBA-2026:104100（NVIDIA OpenGPU 的 driver 映像，2026-11-27），不是 OpenShift 本身的更新，不列為更新。
- NKP：Nutanix 公告清單仍是 65 筆、前 7 筆和昨天相同；今天沒有重讀各份 PDF，PDF 內文有沒有改無法確認。
- Confluent Platform：安全公告清單第一頁 30 筆今天全部抄下來當之後的比對基準；第二頁沒有讀。
- Rancher / RKE2：SUSE 的 Rancher Security 頁打得開，頁面上沒有公告清單可比對；改讀 Rancher 文件站的安全頁與 GitHub 公告。
- NeuVector：SUSE 文件站的 5.x release notes 舊網址今天仍回 404，改讀 NeuVector 自己的文件站與 GitHub。
- NeuVector：SUSE 的 Rancher Security 頁打得開，頁面上沒有公告清單可比對。
- JBoss EAP：Customer Portal 上的 8.1 Update 9.1 release notes 文章只讀標題與更新日期，內文需要訂閱，沒有讀。
- AppScan：仍沒有找到公開的安全公告頁。
- Seeker：仍沒有找到公開的安全公告頁。

#### 無公開來源

- CMC（IBM Certificate Management Console）：IBM Expert Labs 的資產，沒有公開的版本頁或公告頁，不列入檢查。

#### CI/CD 各工具狀態

12 個工具逐一列在 [CI/CD 產品頁](../../products/cicd.md)，今天有更新的：OpenShift Pipelines；無法確認的：無。
