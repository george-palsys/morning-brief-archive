# 產品動態｜2026-11-23

[← 今日摘要](README.md)｜[產品動態](products.md)｜[新知識](knowledge.md)｜[CVE](cve.md)｜[台灣 IT](taiwan.md)｜[AI](ai.md)｜[清單維護](maintenance.md)｜[26 項產品現況](../../products/README.md)

### OpenShift：四張 RHBA，4.22、5.0、5.1 的 dpdk-base extras 映像更新，沒有新的 RHSA

→ [產品頁](../../products/openshift.md)

- 類別：修補
- 內容：
  - 發生什麼事：Red Hat 在 2026-11-22（UTC 03:20 到 05:31）發布四張 Bug Fix Advisory，標題都是「OpenShift Container Platform <版本> dpdk-base extras update」，嚴重度欄位為 None。
  - 逐張列出（版本依 errata 標題所寫）：
    - RHBA-2026:101363：OpenShift Container Platform 4.22。
    - RHBA-2026:101338：OpenShift Container Platform 4.22。
    - RHBA-2026:101335：OpenShift Container Platform 5.0。
    - RHBA-2026:101333：OpenShift Container Platform 5.1。
  - 上一份晨報之後沒有新的 RHSA；最新的 z-stream 仍是 5.0.1（RHSA-2026:94537、RHSA-2026:94538）；Security Bulletin 列表最上面仍是 RHSB-2026-021；文件站的版本選單最上面仍是 5.0。
  - 沒有確認的部分：這四張 errata 的內文我沒有逐張打開，修了什麼沒有讀到；RHBA-2026:101333 的標題寫 5.1，但文件站還沒有 5.1。
- 對我們的影響：和 11-22 晨報那七張是同一類更新。dpdk-base 是給 DPDK 工作負載（多半是電信類的高速封包處理）當基底的映像，金融與公部門客戶一般用不到；有用到的重新拉映像或重新 build，叢集本身不用動。RHSB-2026-021（Ruby2Shell）今天仍沒有看到對應的 OpenShift RHSA。
- 來源：Red Hat Errata Search（OpenShift Container Platform，2026-11-22 的四張 RHBA）：https://access.redhat.com/errata-search/

### CI/CD：JFrog Artifactory 7.179.1 SaaS 發布（2026-11-22），自管版仍是 7.173.21

→ [產品頁](../../products/cicd.md)

- 類別：新版本
- 內容：
  - 發生什麼事：JFrog 的 Artifactory SaaS Releases 頁新增「Artifactory 7.179.1 SaaS」，頁面寫 Released: 22 November 2026。這是雲端（SaaS）版；Artifactory Release Notes 總表上自管版（Self-managed）的最新版號沒有變，仍是 7.173.21。
  - 功能調整（1 項）：retention policy 的 Include Package Name 欄位可以使用斜線（`/`），例如 scoped npm 套件名稱；限制只保留在 Maven、Gradle、SBT 三種套件類型。
  - 修正的問題（8 項，逐項列出）：
    - RTFE-6859（High，Packages）：Nix 的 Set Me Up 設定片段在較新的 Nix 與 curl 版本上讓 `nix-channel --update` 回 401。
    - RTDEV-107729（Medium，Packages）：較新的 Nix 用戶端執行 `nix-channel --update` 回 HTTP 401。
    - RTDEV-105982（Medium，Packages）：沒有 overwrite 或 delete 權限的使用者推送新的 image tag 時，`tags.json` 沒有更新，Docker tags 清單看不到新 tag。
    - RTDEV-105975（Medium，Packages）：Gems smart remote repository 對 3.2.3 之前的 RubyGems 用戶端錯誤回 HTTP 200，導致 gem 安裝出現 404。
    - RTDEV-105017（General，Medium）：沒有 `HARDENED_ARTIFACTORY_EVENTS` 授權的執行個體上，repository 設定 worker（`BEFORE_REPO_CREATE`、`BEFORE_REPO_UPDATE`、`BEFORE_REPO_DELETE`）的 `STOP` 動作被忽略，repository 仍可被建立、修改或刪除。
    - RTDEV-102946（Medium，Packages）：推送平台為 `-gnu`（例如 x86_64-linux-gnu）的 Linux gem 時，`-gnu` 字尾被去掉，造成相依解析與下載失敗。
    - RTDEV-102793（Medium，Repositories）：Remember Me 自動登入在 session 逾時後失敗時，UI 下載以內部 `_system_` 使用者執行並回 403。
    - JA-25699（High，Authentication Providers）：OIDC identity mapping 的 global mapping 超過 5 筆時，Global 分頁的表格顯示為空白。
  - 這一版的說明沒有列出安全性修正或 CVE。
- 對我們的影響：這是 JFrog 雲端版的例行更新，由 JFrog 自行套用，客戶端不用動作。客戶自管的 Artifactory 沒有新版，仍是 7.173.21。CI/CD 其餘 11 個工具今天沒有更新。
- 來源：
  - Artifactory SaaS Releases（Artifactory 7.179.1 SaaS，2026-11-22）：https://docs.jfrog.com/releases/docs/artifactory-saas-releases
  - Artifactory Release Notes（各版本線最新版號總表）：https://docs.jfrog.com/releases/docs/artifactory-release-notes

#### 今日無更新

22 項，名單與各產品目前的版本見 [26 項產品現況](../../products/README.md)。

#### 今日無法確認

1 項：

- Software Risk Manager (SRM)：文件入口頁 https://docs.blackduck.com/p/softwareriskmanagement 打得開，但頁面上找不到公開的 release notes 或版本號，也沒有公開的安全公告頁，所以無法判斷有沒有新版。

以下是個別來源或個別項目沒能確認，所屬產品的當天狀態不受影響，不算在上面的 1 項裡：

- NeuVector：SUSE 文件站的 5.x release notes 舊網址今天仍回 404，改讀 NeuVector 自己的文件站與 GitHub。
- NeuVector：SUSE 的 Rancher Security 頁今天打開後標題仍是「Signing Keys」，沒有公告清單可比對。
- Rancher / RKE2：SUSE 的 Rancher Security 頁今天打開後標題仍是「Signing Keys」，沒有公告清單可比對；改讀 Rancher 文件站的安全頁與 GitHub 公告。
- JBoss EAP：Customer Portal 上的 8.1 Update 9.1 release notes 文章今天讀得到標題與更新日期，內文需要訂閱，沒有讀。
- AppScan：仍沒有找到公開的安全公告頁。
- Seeker：仍沒有找到公開的安全公告頁。
- OpenShift：四張 RHBA 的內文沒有逐張打開。
- Concert：roadmap 頁今天只確認打得開，沒有用瀏覽器讀內容。
- Quantum Safe Explorer (QSE)：單則安全公告頁今天沒有重新打開（改用 IBM 公告查詢確認，最新仍是 node/7293815）；release notes 入口頁的 Last Updated 是 2026-10-26，子頁今天沒有逐頁打開。

#### 無公開來源

- CMC（IBM Certificate Management Console）：IBM Expert Labs 的資產，沒有公開的版本頁或公告頁，不列入檢查。

#### CI/CD 各工具狀態

12 個工具逐一列在 [CI/CD 產品頁](../../products/cicd.md)，今天有更新的：JFrog Artifactory；無法確認的：無。
