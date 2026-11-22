# 新知識｜2026-11-22

[← 今日摘要](README.md)｜[產品動態](products.md)｜[新知識](knowledge.md)｜[CVE](cve.md)｜[台灣 IT](taiwan.md)｜[AI](ai.md)｜[清單維護](maintenance.md)｜[26 項產品現況](../../products/README.md)

### 量子位置驗證（QPV）：NIST 首次以無漏洞的 Bell test 證明「人真的在那個地點」

- 這是什麼：量子位置驗證（quantum position verification）是讓兩個可信任的驗證站確認第三方（prover）確實位於指定地點的做法。NIST 於 2026-11-18 發布，研究團隊完成了第一個把已知漏洞都補上的實驗，論文刊在 Nature。
- 原理：
  - 其中一個驗證站產生一對糾纏光子，自己留一顆，另一顆送給 prover。
  - 兩個驗證站各送出一組亂數，時間算好同時抵達 prover 宣稱的位置；prover 依亂數決定怎麼量測光子的偏振，再把結果回傳。
  - 驗證站用訊號來回的時間做三角定位；這個流程在幾分鐘內重複數百萬次，再比對雙方量測結果的相關性。
  - 依量子的 no-cloning theorem，任何人想複製光子狀態分給同夥，相關性就會被破壞；通過 loophole-free Bell test 表示相關性超過古典物理的上限，prover 不可能是在別處假裝。因為量測指示是亂數，冒充者也無法預先算好提早回覆。
  - 實驗在 NIST 的 Boulder 園區進行，兩個驗證站相距 195 公尺，以光纖相連。
- 用在哪裡：NIST 舉的用途是金融交易指令的來源驗證、只允許在安全建築內的人取資料、關鍵基礎設施的遠端指令防護、未來量子網路上的防釣魚。NIST 自己說實際應用可能還要十年以上，目前不是能導入的技術；對我們的用處是和客戶談 Quantum Safe 時，知道「量子」除了威脅現有密碼之外，也有用來做身分與位置驗證的研究方向。
- 原文：Quantum Physics Can Verify a Person's Location, NIST Researchers Show（2026-11-18）：https://www.nist.gov/news-events/news/2026/11/quantum-physics-can-verify-persons-location-nist-researchers-show

### CVE-2026-99312 的機制：KVM 在 AMD 巢狀虛擬化下模擬 INIT 時沒有重設 MMU，guest 可以碰到 host 的記憶體

- 這是什麼：Linux 核心的 KVM 在 AMD 處理器（SVM）開啟巢狀虛擬化時的漏洞，Linux kernel CVE 團隊於 2026-11-18 公告。漏洞本身的版本與嚴重度寫在今天的 [CVE](cve.md)，這裡補它怎麼運作。背景：巢狀虛擬化是在虛擬機（L1）裡再跑虛擬機（L2）。
- 原理：
  - KVM 為每個 vCPU 維護一份 MMU context，裡面的 page role 會記錄目前是不是在 guest mode（L2）。
  - 模擬 INIT（處理器重設訊號）時，原本的程式只在 paging 原本是開著的情況下才重設 MMU。
  - 如果 L2 在 CR0.PG=0（沒開 paging）的狀態下收到 INIT，KVM 回到 L1 執行，卻沿用 L2 留下來的過期 MMU context。Red Hat 把它描述為「use-after-free of nested page table pointer on AMD INIT reset」。
  - 修正方式是模擬 INIT 時一律重設 MMU context。公告寫明這只影響 nested SVM；Intel（VMX）上 INIT 一定會先被攔截，不會在 L2 執行中被模擬。
- 用在哪裡：判斷自己受不受影響的條件有三個：host 是 AMD、用 KVM、而且開了巢狀虛擬化。OpenShift Virtualization 或自建 KVM 跑在 AMD 主機上的環境，先確認巢狀虛擬化有沒有開；用不到就關掉，否則更新 host 核心。
- 原文：
  - linux-cve-announce「CVE-2026-99312: KVM: x86: Unconditionally reset MMU context when emulating INIT」（2026-11-18）：https://lists.openwall.net/linux-cve-announce/2026/11/18/2
  - Red Hat CVE 頁（2026-11-18 公開）：https://access.redhat.com/security/cve/cve-2026-99312

### OpenTelemetry Collector 的五個常見耗能設定：批次、屬性、輪詢、取樣、記憶體保護的順序

- 這是什麼：CNCF 部落格 2026-11-17 的文章，作者是 OpenTelemetry 文件審核者 Diana Todea，整理她在 Cloud Native Days Austria 2026 的演講：蒐集遙測資料本身的成本，以及 Collector 設定上最常見的五個浪費來源。
- 原理：
  - 批次太小：頻繁送出小量資料會增加序列化與連線次數。現在批次是做在 exporter 的 `sending_queue` 裡（獨立的 batch processor 已棄用），由 `min_size` 與 `flush_timeout` 決定何時送出；批次也不是越大越好，會增加緩衝與延遲。
  - 沒人用的 resource attribute：例如 `host.cpu.model.name` 這類硬體細節，可以在 resource detection processor 裡關掉。
  - receiver 輪詢太密：主機、容器、資料庫的指標每幾秒抓一次，應用沒流量時也在耗資源；把 10 秒放寬到 30 秒可以降低負擔，代價是時間解析度變低。
  - 每一筆 trace 都送：用取樣控制量。head-based 取樣早做決定、省下游資源；tail-based 可以保留錯誤的 trace，但要先把資料緩衝起來，本身就耗記憶體。
  - `memory_limiter` 放太後面：應該放在 pipeline 的前面，否則 Collector 先花力氣加工資料，之後才因記憶體壓力把它拒絕掉。它是保護機制，不能取代資源上限與容量規劃。
- 用在哪裡：客戶用 OpenTelemetry Collector 把資料送進 Instana 或其他後端而抱怨 Collector 吃資源時，可以照這五項逐一檢查。文章強調要實際量測，範例數值是 Collector 的預設值，不是通用的建議值。
- 原文：Is your OpenTelemetry pipeline becoming a performance bottleneck?（2026-11-17）：https://www.cncf.io/blog/2026/11/17/is-your-opentelemetry-pipeline-becoming-a-performance-bottleneck/

### PostgreSQL 19 的 `REPACK (CONCURRENTLY)`：資料表重整時不再擋讀寫

- 這是什麼：PostgreSQL 19 於 2026-11-19 發布，新增 `REPACK` 指令，把整張資料表重寫到新的磁碟檔以回收 dead tuple 佔用的空間，並可用 `USING INDEX` 依索引順序重排資料列。
- 原理：
  - `VACUUM` 只把空間標記成可重用；`REPACK` 是整張表重寫，空間才會還給作業系統。
  - 不加選項時，`REPACK` 會對資料表取得 ACCESS EXCLUSIVE lock，讀寫都被擋；加上 `CONCURRENTLY` 之後，重整期間其他交易可以繼續使用這張表。
  - 文件寫明的限制：不指定資料表名稱（整個資料庫）的形式不能搭配 `CONCURRENTLY`；`REPACK` 不適合拿來防 transaction ID wraparound，因為要重寫整張表與所有索引，在忙碌的資料表上用 `CONCURRENTLY` 可能做到快完成才失敗，這個用途仍建議用 `VACUUM`。
  - 同一版另有 `pg_plan_advice` 與 `pg_stash_advice` 兩個擴充模組，可以控制查詢規劃器的決定，並依查詢自動套用。
- 用在哪裡：過去要重整膨脹的資料表，內建的 `VACUUM FULL` 與 `CLUSTER` 都會鎖表。客戶的應用（跑在 Liberty、JBoss EAP 上的）後端是 PostgreSQL、又有不能停機的大表時，這是升到 19 的一個具體理由。是新的主要版本，正式環境先等修補版與應用驗證。
- 原文：
  - PostgreSQL 19 Release Notes（2026-11-19）：https://www.postgresql.org/docs/19/release-19.html
  - PostgreSQL 19 文件「REPACK」：https://www.postgresql.org/docs/19/sql-repack.html

### 產品跑在客戶自管的 Kubernetes 上，支援範圍要怎麼訂

- 這是什麼：CNCF 部落格 2026-11-19 的文章（作者 Adam Zahorscak，Fairwinds），談軟體供應方把應用交付到客戶自己管理的叢集時，支援模式該怎麼設計。
- 原理：
  - 沒有兩個客戶的環境相同：Kubernetes 版本與發行版、網路、ingress controller、storage class、映像 registry、安全政策、存取控制都可能不同，同一份 chart 在參考架構裝得起來，到客戶端可能被 admission policy 擋掉。
  - 所以要先寫下應用對叢集的要求，至少包含：支援的 Kubernetes 版本與發行版；需要的權限、政策與叢集能力；預期的網路、ingress、DNS、憑證、secret 管理與儲存設定；需要的資源量；出問題時支援團隊要的 log、event、metric 與設定資料（最好直接附指令）。
  - 客戶不會照供應方的時程升級：要有明確的版本支援與淘汰政策，講清楚停止支援前多久通知、客戶暫時不能升級時有沒有書面的替代做法。
  - 第一線支援要有足夠的 Kubernetes 能力分辨問題在應用、部署設定還是叢集。例如 Pod 卡在 Pending 可能是容量、resource request、排程限制或政策；映像拉不下來可能是 registry 存取、帳密、網路或映像政策。
- 用在哪裡：這和我們在客戶的 OpenShift、RKE2 上裝 Instana、NeuVector、Black Duck 這類產品的情境相同，客戶的叢集不歸我們管。寫安裝文件與 POC 前置條件時，可以拿文章列的五項當檢查表，把「需要的權限與政策」和「出問題時要收集的資料與指令」寫進文件。
- 原文：How to support your app on Kubernetes environments you don't control（2026-11-19）：https://www.cncf.io/blog/2026/11/19/how-to-support-your-app-on-kubernetes-environments-you-dont-control/
