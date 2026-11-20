# 晨報產生規則 v4

給 GeorgeAI 的產生規則。v1(2026-11-19 第一份)是三段新聞;v2 加入「產品動態」與「新知識」兩段,並把新知識當成主體;v3 內容規則不變,只改檔案怎麼分:每天一份摘要加各段落各一個檔,另外每個產品一頁累積歷史(見第六節)。

歷史紀錄：v2 於 2026-11-19 合併到 `main`(PR #2),同一天做過一次演練並依結果修訂。v3 的分檔方式同一天由 George 決定(原因:單一檔 467 行太擠,每天會變與不會變的內容混在一起,查單一產品要逐天翻),還沒有照排程實際跑過(見第八節)。

## 一、整份晨報的段落與順序

| 順序 | 段落 | v1 是否已有 | 則數 |
|---|---|---|---|
| 0 | 今天最需要注意的一件事 | 已有 | 1 段 |
| 1 | 產品動態 | 新增 | 依 `products.yaml` 的 26 項逐一檢查,有更新才展開 |
| 2 | 新知識 | 新增 | 每天 5 到 6 則 |
| 3 | CVE 重大新聞 | 已有 | 沿用 v1 |
| 4 | 台灣 IT 重大事件 | 已有 | 沿用 v1 |
| 5 | 全世界 AI 新功能及重大事件 | 已有 | 沿用 v1 |

目標閱讀時間:摘要一到兩分鐘,全部段落十到十五分鐘。

每個段落各寫成一個檔,另有一份當天摘要;檔名與摘要的寫法見第六節。順序 0「今天最需要注意的一件事」寫在摘要的最上面。

## 二、產品動態

### 檢查方式

1. 讀 `products.yaml`,依 id 1 到 26 的順序逐一處理,不可跳過。標了 `public_sources: false` 的產品(目前只有 CMC)不檢查,直接列入「無公開來源」清單。
2. 每個產品打開它列出的每一個 `sources` 網址,找出「上一份晨報之後」新出現的內容。判斷方式見下面「怎麼判斷是新的」,不可只憑頁面印象判斷。
3. `status: unverified`、`status: searched` 或 `status: repo_checked` 的網址:第一次使用時先確認頁面存在且內容正確,確認後在當天晨報的「清單維護」小節回報,並依第七節送 PR 更新 `products.yaml`。
4. `url: null` 的來源:用網路搜尋補查,只採原廠網域的結果。補查也找不到時:這個來源如果是該產品唯一的 `release` 來源,該產品列入「今日無法確認」,原因寫「找不到 release notes 來源」;該產品還有其他讀得到的 `release` 來源時,照讀得到的來源判定,並在該產品後面註明哪個來源沒找到。
5. 網址打不開或需要登入:在該產品底下寫明「無法開啟」,不可當成「無更新」。判定「無法開啟」之前要先照下面「開啟方式」換用瀏覽器再試一次。

### 開啟方式

- 標了 `fetch: browser` 的來源一律用瀏覽器開啟。2026-11-19 實測,IBM Docs、docs.redhat.com、Black Duck 文件站、Nutanix Portal 直接抓取會回 403 或只回空殼,用瀏覽器才讀得到。
- 網域是 `www.ibm.com/docs`、`docs.redhat.com`、`docs.blackduck.com`、`portal.nutanix.com` 的來源,不論有沒有標 `fetch: browser`,都直接用瀏覽器開啟,不必先試直接抓取(2026-11-19 演練時這四個站直接抓取全部失敗)。
- 沒標 `fetch: browser` 的來源先直接抓取;遇到 403、429、逾時或內容是空殼時,改用瀏覽器再開一次。兩種方式都失敗才算「無法開啟」,並寫明兩次各自的結果。
- 頁面是動態載入的(例如 Black Duck 文件站),要等內容出現再讀,只看到 cookie 橫幅不算讀到。
- 標了 `access: subscription` 的來源不嘗試登入。看得到標題與日期就只回報標題與日期,並註明「內容需訂閱登入」;連標題都看不到才列入「今日無法確認」。

### 怎麼判斷是新的

每個來源上次看到什麼,記在本機歸檔資料夾的 `state/sources.json`(備份到 repo 的同一路徑)。格式:

```json
{
  "version": 1,
  "sources": {
    "<來源網址>": {
      "product_id": 3,
      "product_ids": [3],
      "last_checked": "2026-11-20",
      "last_seen_marker": "<頁面上最新一筆的版號、公告編號或標題>",
      "last_seen_date": "<那一筆的發布日期,查不到寫 null>",
      "result": "ok / unreachable / login_required / no_list / redirected",
      "redirected_to": "<result 為 redirected 時寫轉到的網址,其他情況不寫>"
    }
  }
}
```

- 每晚每個來源檢查完就更新它的紀錄。`last_seen_marker` 取頁面上最新的一筆,例如 fix pack 版號 `9.0.5.27`、公告編號 `RHSA-2026:27200`、release 標籤 `v2.14.3`。
- 頁面上最新的一筆與 `last_seen_marker` 不同,才算「有更新」,並回報從上次那一筆之後新增的每一筆。
- 鍵值:一個網址只給一個產品用時,鍵值就是網址。同一個網址給多個產品共用時(例如 IBM 公告清單頁、Red Hat errata、Black Duck 文件站),每個產品各記一筆,鍵值寫成「網址#產品名稱」(產品名稱與 `products.yaml` 的 `name` 一致),`product_ids` 列出共用這個網址的所有產品 id。
- 頁面上沒有日期的來源(2026-11-19 演練時 AppScan、3scale、Confluent 安全公告頁是這樣):`last_seen_marker` 記最上面一筆的版號或標題,`last_seen_date` 寫 `null`,只用 `last_seen_marker` 有沒有改變來判斷。日期只寫到月份的來源(Bob、NeuVector)同樣處理,`last_seen_date` 寫到月份(例如 `2026-10`)。
- `result` 的值:`ok` 讀得到且有可比對的最新一筆;`unreachable` 兩種開啟方式都失敗;`login_required` 要登入才看得到;`no_list` 開得到但頁面上沒有可比對的清單;`redirected` 被轉到別的網址(同時寫 `redirected_to`,轉到的頁面讀得到就照常記 `last_seen_marker`,並在「清單維護」列為改版的網址)。
- 某個來源在 `state/sources.json` 中沒有紀錄(第一次檢查,或網址剛換過):只建立基準,不當成更新回報,在「清單維護」註明「已建立基準」。有兩個例外,符合任一個就照常回報:
  1. 最新一筆的發布時間在「上一份晨報的蒐集時間」之後(定義見下一條)。
  2. 類別是安全公告,原廠標示的嚴重度是 Critical(或 CVSS 9.0 以上),而且發布日期在最近 7 天內。這類寫在該產品底下,標題後面加註「(建立基準時補列)」,避免剛換網址或第一次檢查時漏掉近期的重大公告。
- 來源當晚開不到:`result` 寫 `unreachable`,`last_seen_marker` 維持原值不動。
- 上一份晨報的蒐集時間:本機歸檔資料夾中最新一天的 `collected_at`,台灣時間。新版面的日子讀 `daily/YYYY-MM-DD/meta.yaml`;舊版面的日子(2026-11-19)讀 `YYYY-MM-DD.md` 的 frontmatter(repo 上是 `daily/2026-11-19.md`);兩種都有時取日期最新的那一天。來源有寫到時分的(例如 GitHub release),換算成台灣時間後與它比較;來源只有日期的,日期等於或晚於 `collected_at` 的那一天就算在它之後。只用日期比會漏掉半夜之後才發布的項目(2026-11-19 演練時 Argo CD 三個版本是台灣時間 03:55 前後發布,上一份晨報在 02:25 蒐集)。
- `url: null` 靠搜尋補查的來源,用查到的那一筆的網址當鍵值。

### 帶版本號的網址

`version_specific: true` 的網址只會顯示那一個版本的內容,產品出新的主要版本時,舊網址會一直顯示「沒有變化」。所以每次檢查都要:

1. 看頁面的版本選單(或網址被轉到哪個版本)。
2. 選單中有比網址更新的版本:檢查新版本的對應頁,並在「清單維護」列出建議的新網址。新版本的發布時間在上一份晨報的蒐集時間之後,才當成一則「新版本」更新回報;發布時間更早的(清單落後,不是原廠剛發布)只列在「清單維護」,不寫成產品動態,該產品照其他來源判定有沒有更新。
3. 依第七節送 PR,把新版本的網址加進 `products.yaml`。舊版本的網址在該版本仍受原廠支援期間保留。

### IBM 安全公告的查法

MQ、Turbonomic、Concert、GCM、QSE、Bob、Vault、Instana 的安全公告,用 IBM 的公告清單頁 `https://www.ibm.com/support/pages/bulletin/` 查(2026-11-19 演練實際查過,可行)。原本的兩個入口 `https://www.ibm.com/trust/security-psirt` 與 `https://www.ibm.com/support/pages/ibm-security-vulnerability-management` 都沒有公告清單,不要用。

1. 用瀏覽器開清單頁,在頁面上的搜尋欄用產品的 IBM 正式名稱搜尋。不可只瀏覽預設清單:預設只顯示最近 1000 筆,大約一天就被其他產品的公告擠滿。
2. 產品名稱要用 IBM 的正式名稱才查得到。演練時查得到的名稱:`IBM MQ`、`Turbonomic SaaS`、`IBM Instana Observability`、`IBM Vault Self-Managed`、`IBM Concert`。其他產品先用 `products.yaml` 的 `full_name` 試,查不到再試不同寫法,並把查得到的寫法回報在「清單維護」。
3. 一次只查一個產品,送出後等結果出現再讀。回應很大(演練時 Instana 一個產品就有 1,882 筆),單次查詢常超過 15 秒,要分次等待,不要因為第一次沒回應就判定沒有公告。
4. 查到的公告打開原頁,確認發布日期與受影響版本後才寫入。
5. 等了三次仍沒有回應:該產品的安全公告寫「IBM 公告清單查詢沒有回應,未確認」。這只影響安全公告這一個來源,產品本身照其他來源判定;其他來源都讀得到時不列入「今日無法確認」,但要保留這句說明。
6. 查詢有回應但沒有新的公告:寫「未查到新的 Security Bulletin」,歸在「今日無更新」。

還沒確認的部分:演練時 `IBM Concert Software` 這個名稱的查詢始終沒有回應,`IBM Concert` 只查到 2024-08-29 一則,Concert 的公告是否查得完整未確認。GCM、QSE、Bob 查得到的正式名稱,演練回報中沒有逐一列出。

### 要找的三類更新

| 類別 | `update_type` | 要寫的內容 |
|---|---|---|
| 新版本 | `release` | 版號、發布日、重點變更(新功能、行為改變、移除或棄用的功能)、release note 連結 |
| 安全公告 | `security` | CVE 編號、嚴重度與 CVSS(註明評分來源)、受影響版本、修補版本、暫時緩解做法、是否已遭利用、原廠公告連結 |
| 生命週期 | `lifecycle` | 哪個版本、終止支援或 EOL 日期、建議的升級目標、公告連結 |

### 每個有更新的產品的寫法

```markdown
### <產品名稱>:<一句話說明這次更新>

- 類別:新版本 / 安全公告 / 生命週期
- 內容:<依上表該類別要寫的項目,逐項列出>
- 對我們的影響:<哪些客戶案子或 lab 環境用到、需不需要動作>
- 來源:<原廠頁面標題>(<發布日期>):<網址>
```

同一個產品當天有多則更新時,每一則各寫一個小節,不合併。

### 段落結尾固定三個清單

寫在當天的 `products.md` 結尾:

```markdown
#### 今日無更新

<N> 項,名單與各產品目前的版本見 [26 項產品現況](../../products/README.md)。

#### 今日無法確認

- <產品名稱>:<原因,例如網址無法開啟、需要登入>

#### 無公開來源

- <產品名稱>(`products.yaml` 中標了 `public_sources: false` 的產品,不檢查,每天固定列出)
```

- 「今日無更新」只寫項數,不再逐一列名稱;逐項的狀態寫在 `products/README.md` 的 26 列表格(v2 是每天列出全部名稱,v3 改掉,因為每天有二十項左右重複)。
- 「今日無法確認」與「無公開來源」照舊逐項列出,一項一行。
- 「有更新」「今日無更新」「今日無法確認」「無公開來源」四者的產品數加起來必須等於 26,而且要與 `products/README.md` 表格中「當天狀態」各值的列數一致。

### CI/CD 的特別規則

CI/CD(id 13)底下有多個工具,每個來源用 `tool` 欄位標明屬於哪個工具:

- 每個工具各自檢查、各自判定,有更新的工具各寫一個小節,標題寫成「CI/CD/<工具名稱>:<一句話說明>」。
- 計算 26 項時 CI/CD 算一項,依下列順序判定,符合第一條就停:
  1. 任何一個工具有更新:算「有更新」。
  2. 沒有工具有更新,但至少一個工具無法確認:算「今日無法確認」,原因寫明是哪幾個工具。
  3. 全部工具都確認沒有更新:算「今日無更新」。
- 不論 CI/CD 歸在哪一類,每個工具當天的狀態都逐一寫在 CI/CD 的產品頁 `products/cicd.md`(格式見第六節),一個工具一行。當天的 `products.md` 只留一句:

```markdown
#### CI/CD 各工具狀態

<N> 個工具逐一列在 [CI/CD 產品頁](../../products/cicd.md),今天有更新的:<工具名稱,沒有就寫「無」>;無法確認的:<工具名稱與原因,沒有就寫「無」>。
```

### 來源規則

- 只採原廠來源:IBM Docs、IBM Support、Red Hat Documentation、Red Hat Customer Portal、SUSE Documentation、Black Duck、HashiCorp、Nutanix、Confluent、HCL 的官方網域;CI/CD 工具採各工具的官方網站或官方 GitHub 專案(以 `products.yaml` 列出的為準)。
- 媒體報導與第三方整理只能當線索,要回到原廠頁面確認後才寫入;原廠頁面查不到就寫明「原廠未查到,僅第三方來源」。
- 每則都要有來源的發布日期;查不到就寫「發布日期未查到」。

## 三、新知識

### 則數與深度

每天 5 到 6 則。每則固定四個部分,合計約五到八句:

```markdown
### <主題>

- 這是什麼:<一到兩句的定義>
- 原理:<它怎麼運作,二到三句,要講到機制,不能只重複定義>
- 用在哪裡:<解決什麼問題、什麼情境會用到,一到兩句>
- 原文:<標題>(<發布日期>):<網址>
```

### 選題來源

每天從下列五類中混搭,同一類一天最多兩則:

| 類別 | 來源範例 |
|---|---|
| 新標準與規範 | NIST、IETF、CA/Browser Forum 的新草案與定案 |
| 新攻擊手法與防禦技術 | 研究論文、資安會議發表、資安廠商的技術分析 |
| 新工具與開源專案 | CNCF 專案的新版本與新功能、值得注意的新專案 |
| 原廠新功能 | `products.yaml` 中各產品在版本更新裡技術上有新意的部分 |
| 架構與實務 | 大型企業的工程部落格、事故檢討報告 |

長期追蹤的主題,有新進展時優先選入:後量子密碼(PQC)與量子安全、憑證生命週期管理、SBOM 與軟體供應鏈安全、容器與 Kubernetes 安全、AI 安全。

### 選題規則

- 必須是新的:原文發布日期在最近 30 天內,或是既有技術最近 30 天內有實質變更。
- 不重複:寫之前先查 `items.jsonl` 中 `category` 為 `knowledge` 的紀錄,標題或主題相同的不再寫,除非有新進展,並在內文註明上次是哪一天寫過。
- 讀者背景:熟 IBM 中介軟體、OpenShift 與 Kubernetes 維運、應用程式安全工具、Vault PKI;對 WebSphere traditional 與 F5 較不熟。熟的領域只寫新的變化,不熟的領域補一句背景。
- 只用第一手來源:標準組織原文、論文、原廠文件、專案的 release note 或官方部落格。
- 產品的例行版本更新寫在「產品動態」;只有其中某項功能值得講原理時,才另外在「新知識」寫一則,並互相引用。

### 每週五加碼

週五的晨報在「新知識」段落最後多兩個小節:

- 本週回顧:上週六到本週五這七天寫過的新知識,逐則列出標題與日期(晨報七天都出,週六、週日寫的也要列入)。
- 本週動手題:一個可以在 lab 環境實作的題目,寫明目標、需要的環境、預期看到的結果。

## 四、沿用 v1 的三段

「CVE 重大新聞」「台灣 IT 重大事件」「全世界 AI 新功能及重大事件」的格式與 2026-11-19 那份相同,不變。

一項去重規則:某則 CVE 如果直接影響 `products.yaml` 中的產品,而且原廠已經發了該產品的安全公告,就寫在「產品動態」,在「CVE 重大新聞」只留一行標題並註明「見產品動態」。原廠還沒發產品公告的,照 v1 寫在「CVE 重大新聞」,並保留【與我們的產品線相關】標記。

## 五、寫作規則(全份適用)

- 查不到就明寫查不到,不推測。
- 不同來源的數字不一致時,兩個都寫,並標明各自的來源。
- 表格與清單逐項列出,不合併、不寫「同上」、不寫「×N」。
- 指令逐行寫出,不用 shell `for` 迴圈。
- 每一則都附來源連結與來源發布日期。

## 六、歸檔格式

### 檔案配置

本機歸檔資料夾與 repo 用同一套路徑:

| 路徑 | 內容 | 寫入方式 |
|---|---|---|
| `daily/YYYY-MM-DD/README.md` | 當天摘要 | 每天新建 |
| `daily/YYYY-MM-DD/products.md` | 產品動態 | 每天新建 |
| `daily/YYYY-MM-DD/knowledge.md` | 新知識 | 每天新建 |
| `daily/YYYY-MM-DD/cve.md` | CVE 重大新聞 | 每天新建 |
| `daily/YYYY-MM-DD/taiwan.md` | 台灣 IT 重大事件 | 每天新建 |
| `daily/YYYY-MM-DD/ai.md` | 全世界 AI 新功能及重大事件 | 每天新建 |
| `daily/YYYY-MM-DD/maintenance.md` | 清單維護 | 每天新建;當天沒有內容時仍建檔,內文寫「今天沒有清單維護項目」 |
| `daily/YYYY-MM-DD/meta.yaml` | 當天的欄位資料(原本的 frontmatter) | 每天新建 |
| `products/README.md` | 26 項產品現況總表 | 每晚整份重寫 |
| `products/<slug>.md` | 單一產品頁,共 26 個 | 每晚更新,「最近動態」只往上加 |
| `items.jsonl` | 逐則紀錄 | 只往後附加 |
| `state/sources.json` | 每個來源上次看到的內容 | 每晚整份覆寫 |

- 2026-11-19 那一天是舊版面(本機 `2026-11-19.md`,repo `daily/2026-11-19.md`),保留原樣,不補拆。
- 所有 `.md` 檔都不寫 frontmatter(GitHub 會把它顯示成檔案最上面的一張表),欄位資料放 `meta.yaml`。
- 檔案之間一律用相對連結。內文不寫 `{{` 與 `{%` 這兩種符號組合;原文有的話放進程式碼區塊。這兩點是為了日後要用 GitHub Pages 發布成網頁時不必再改,Pages 實際轉出來的結果還沒有測過。
- 編碼 UTF-8,換行 LF。

### 當天摘要 `daily/YYYY-MM-DD/README.md`

長度以一個畫面為準,不超過 80 行。只寫標題與一句話,細節都在各段落檔。格式:

```markdown
# 晨報 YYYY-MM-DD(星期X)｜摘要

**今天最需要注意的一件事**:<二到三句,含要不要動作> → [<所在段落名稱>](<該段落檔名>)

## 產品動態

26 項:有更新 <N>、無更新 <N>、無法確認 <N>、無公開來源 <N>。→ [完整內容](products.md)｜[26 項產品現況](../../products/README.md)

| 產品 | 更新 | 要不要動作 |
|---|---|---|
| [<產品名稱>](../../products/<slug>.md) | <一句話,含版號或公告編號與發布日期> | <一句話;不需要動作就寫「不需要」> |

無法確認:

- [<產品名稱>](../../products/<slug>.md):<原因>

## CVE 重大新聞

<N> 則。→ [完整內容](cve.md)

- <一行標題;與產品線相關的保留【與我們的產品線相關】標記>

## 新知識

<N> 則。→ [完整內容](knowledge.md)

- <一行標題>

## 台灣 IT 重大事件

<N> 則。→ [完整內容](taiwan.md)

- <一行標題>

## 全世界 AI 新功能及重大事件

<N> 則。→ [完整內容](ai.md)

- <一行標題>

## 清單維護

<一句話說明有幾項;沒有就寫「無」>。→ [完整內容](maintenance.md)
```

- 產品表格:當天每一則更新各一列,同一產品有多則就多列,不合併。CI/CD 的產品欄寫成「CI/CD/<工具名稱>」。當天沒有任何產品更新時不放表格,寫「今天 26 項都沒有更新」(有無法確認的照列)。
- 沒有無法確認的產品時,「無法確認:」那一小段整段不寫。
- 每個段落的標題逐則列出,一則一行,則數要與該段落檔一致。
- 摘要中的數字、版號、日期必須與段落檔完全一致;摘要是最後才寫的,從已經寫好的段落檔摘出來,不另外查資料。

### 各段落檔

每個段落檔的開頭固定兩行,之後才是內容(內容的寫法照第二、三、四、七節,不變):

```markdown
# <段落名稱>｜YYYY-MM-DD

[← 今日摘要](README.md)｜[產品動態](products.md)｜[新知識](knowledge.md)｜[CVE](cve.md)｜[台灣 IT](taiwan.md)｜[AI](ai.md)｜[清單維護](maintenance.md)｜[26 項產品現況](../../products/README.md)
```

`products.md` 中每個有更新的產品小節,標題下第一行加一個連到該產品頁的連結:`→ [產品頁](../../products/<slug>.md)`。

### `daily/YYYY-MM-DD/meta.yaml`

沿用 v1 的欄位(`title`、`date`、`weekday`、`type`、`collected_at`、`cve_ids`、`products`、`tags`)與 v2 新增的五個欄位,`spec_version` 改為 4。檔案是純 YAML,不加 `---` 分隔線:

```yaml
spec_version: 4
products_checked: 26
products_updated:
  - <當天有更新的產品名稱,與 products.yaml 的 name 一致>
products_unconfirmed:
  - <當天無法確認的產品名稱>
cicd_tools_updated:
  - <當天有更新的 CI/CD 工具名稱,與 products.yaml 的 tool 一致>
```

#### `attention`：今天最需要注意的一件事

```yaml
attention:
  section: cve                 # products / knowledge / cve / taiwan / ai 之一，必填
  title: HTTP/2 記憶體毀損漏洞
  summary: 這個問題從 2015 年的 1.9.5 就存在。
  facts:                       # 選填，0 到 4 項，畫在警示區右側
    - label: CVSS 4.0
      value: "9.2"
      source: The Hacker News  # 選填；同一件事有不同來源的值時必填
    - label: 修補版
      value: 1.31.9／1.30.7
```

- v4 必填 `attention` 與 `display`。
- `attention.title`、`attention.summary` 均為必填字串，顯示寬度上限分別為 40 和 200，算法比照 `short`。須取自指定段落原文。缺值或超長時建置失敗。
- `facts[].label`、`value` 必填字串；`source` 為選填字串，同一件事有不同來源的值時必填。
- `section` 必須與摘要 README 裡「今天最需要注意的一件事」那行的連結段落一致。
- `facts` 每一項的 `value` 必須能在該段落檔原文找到。查不到的不寫，不推測。

#### `display`：每一則的顯示資料

依段落列出，每段的項目**順序與段落檔的 `###` 標題順序完全一致**，則數也必須一致。沒有內容的段落寫空陣列 `[]`。

```yaml
display:
  products: []
  knowledge: []
  cve: []
  taiwan: []
  ai: []
```

##### 所有段落共用的欄位

| 欄位 | 必填 | 型別 | 說明 |
|---|---|---|---|
| `short` | 必填 | 字串，顯示寬度 24 以內（中文字算 2、半形字元算 1） | 短標題，用在摘要頁與段落頁頁首的訊號標籤 |
| `keyword` | 必填 | 字串，8 個半形字元以內 | 段落頁色帶背景的大字，用英文或數字，例如 `IPO`、`NGINX` |
| `date` | 選填 | `YYYY-MM-DD` | 原文寫明的事件日期（發布、揭露、公告）；原文沒寫就不填 |
| `figures` | 選填 | 清單，0 到 3 項 | 關鍵數字，每項 `label`、`value`，`value` 必須在段落檔原文找得到 |

##### `cve` 段落多出的欄位

| 欄位 | 必填 | 型別 | 說明 |
|---|---|---|---|
| `cve_ids` | 必填 | 清單 | 這則涉及的 CVE 編號，原文沒有編號的寫 `[]` |
| `cvss` | 必填 | 清單，可為 `[]` | 每個來源一項：`score`（數字）、`version`（`"3.1"`、`"4.0"`，不知道寫 `null`）、`source`（來源名稱）。原文寫了幾個來源的分數就列幾項，不可只挑一個 |
| `exploited` | 必填 | 列舉 | `confirmed`（已遭利用，含列入 CISA KEV）、`poc`（PoC 已公開但未見攻擊）、`none_seen`（原廠或研究者表示未見攻擊）、`unknown`（原文沒寫） |
| `patch` | 必填 | 列舉 | `released`（正式修補版已釋出）、`hotfix`（只有 hotfix 或臨時修補）、`pending`（原廠表示準備中）、`none`（原廠表示沒有修補）、`unknown`（原文沒寫） |
| `related` | 必填 | 布林 | 與段落檔標題的【與我們的產品線相關】標記一致 |
| `kev` | 選填 | 清單 | 列入 CISA KEV 的每一筆：`cve_id`、`product`、`due`（修補期限 `YYYY-MM-DD`） |

##### `taiwan` 段落多出的欄位

| 欄位 | 必填 | 型別 | 說明 |
|---|---|---|---|
| `kind` | 必填 | 列舉 | `個資`、`入侵`、`漏洞`、`勒索`、`新功能`、`政策`、`其他` 之一 |

`exploited`、`patch` 用上表的英文小寫字串，`kind` 用上表的中文值。不用 `yes`／`no`：YAML 1.1 會把它們讀成布林值，換一套解析器就會出錯。

#### v4 欄位與呈現補充

| 欄位 | 必填 | 型別／上限 | 缺值顯示 |
|---|---|---|---|
| `display.cve[].exploited_detail` | 選填 | 字串，無上限 | 使用下表固定文案 |
| `display.cve[].patch_detail` | 選填 | 字串，無上限 | 使用下表固定文案 |
| `display.ai_summary` | 選填 | 字串，顯示寬度 ≤ 60 | AI 頁導言只顯示「今天 N 則。」 |
| `display.<段落>[].caveat` | 選填 | 字串，無上限 | 所有段落共用，缺值隱藏注意區塊 |
| `display.<段落>[].digest` | 選填 | 字串，長度上限待定 | 新知識、台灣 IT、AI 的摘要清單顯示段落檔完整 `###` 標題。段落頁一律顯示完整標題 |
| `drill` | 選填 | 布林，長度不適用，預設 `false` | 不顯示演練免責聲明 |

| 列舉 | 固定文案 |
|---|---|
| `exploited: confirmed` | 已遭利用 |
| `exploited: poc` | PoC 已公開 |
| `exploited: none_seen` | 未見攻擊 |
| `exploited: unknown` | 攻擊現況未寫明 |
| `patch: released` | 有修補 |
| `patch: hotfix` | 只有 hotfix |
| `patch: pending` | 修補準備中 |
| `patch: none` | 無修補 |
| `patch: unknown` | 修補狀況未寫明 |

- KEV 逐筆顯示「產品（CVE 編號）YYYY-MM-DD 到期」，不產生跨筆到期摘要。清單缺少或為空則隱藏。
- 既有頂層欄位名稱與算法沿用。摘要產品副標用 `products_updated` 的產品數，不用版本更新筆數。
- 每天從 `collected_at` 顯示台灣時間（時:分）。只在 `drill: true` 顯示既有免責聲明：「歷史演練分檔：YYYY-MM-DD HH:MM 蒐集（台灣時間）。僅搬移原文，未重新蒐集或查證；產品來源快照本次未建立，不代表目前產品狀態。」
- 段落頁 `<title>` 使用「{段落名}－{date} 晨報」。前一天資料夾不存在就隱藏「前一天」連結。
- 「清單維護」連到當天的 `maintenance.html`，「搜尋」連到全站 `search/index.html`。
- `影響：` 與 `對我們的影響：` 是同一條目標籤。只辨識已定義的結構化標籤，不用正規表示式從自由文字猜顯示欄位；CSP 不變。
- 預設值由 GeorgeAI 訂，George 2026-11-20 指示併入，日後可改：選填 `digest` 缺值時用完整標題；產品數取 `products_updated`；所有段落可選填 `caveat`；`drill` 預設 false，沿用既有免責聲明。

#### 缺值時的顯示

網站必須照下表處理，不可報錯、不可留空白框。

| 情況 | 摘要頁 | 段落頁 |
|---|---|---|
| `attention.facts` 沒有或為空 | 警示區只顯示文字，佔滿整列 | 不影響 |
| `cvss` 為 `[]` | 分數條灰色，右側寫「未提供」 | 不影響 |
| `cvss` 有多項 | 每個來源各畫一條，條後寫分數與來源 | 不影響 |
| `exploited` 或 `patch` 為 `unknown` | 標籤顯示「攻擊現況未寫明」或「修補狀況未寫明」，灰色 | 不影響 |
| `figures` 沒有 | 不影響 | 不顯示關鍵數字區 |
| `date` 沒有 | 訊號標籤下方不顯示日期 | 不影響 |
| 某段落為 `[]` | 則數顯示 0，該區塊顯示「今天沒有」 | 該段落頁顯示「今天沒有」，不畫波形 |
| 整個 `display` 缺少（v3 以前的日期） | 退回只顯示文字標題，不畫分數條、標籤、方格以外的圖 | 頁首不畫波形，不顯示背景大字與關鍵數字 |

#### 建置檢查（不一致就停）

`site/build.mjs` 在下列情況要建置失敗，並指出日期、段落與第幾則：

1. `display.<段落>` 的則數與該段落檔的 `###` 則數不同。
2. `cve` 項目的 `related` 與段落檔標題有無【與我們的產品線相關】不一致。
3. `exploited`、`patch`、`kind` 的值不在列舉範圍內。
4. `short` 顯示寬度超過 24（中文字算 2、半形字元算 1），或 `keyword` 超過 8 個字元。
5. `attention.section` 與摘要 README 的連結段落不一致。

6. v4 必填欄位缺少，或已填的 `display.ai_summary` 超過 60 顯示寬度。

#### 產生順序

GeorgeAI 照現有順序寫完各段落檔與摘要 README 之後，**最後**才寫 `display` 與 `attention`。值一律從已寫好的段落檔摘出，不另外查資料。

完整範例：`site/fixtures/meta.example.yaml`（2026-11-19 的真實內容）。

### 產品頁的檔名

`products/<slug>.md` 的 `<slug>` 固定如下,不可自行改名(改名會讓舊連結失效):

| id | 產品(`products.yaml` 的 `name`) | 檔名 |
|---|---|---|
| 1 | WebSphere Application Server | `products/websphere-application-server.md` |
| 2 | WebSphere Liberty | `products/websphere-liberty.md` |
| 3 | MQ | `products/mq.md` |
| 4 | Instana | `products/instana.md` |
| 5 | Turbonomic | `products/turbonomic.md` |
| 6 | Black Duck SCA | `products/black-duck-sca.md` |
| 7 | Coverity | `products/coverity.md` |
| 8 | Seeker | `products/seeker.md` |
| 9 | Software Risk Manager (SRM) | `products/srm.md` |
| 10 | NeuVector | `products/neuvector.md` |
| 11 | AppScan | `products/appscan.md` |
| 12 | JBoss EAP | `products/jboss-eap.md` |
| 13 | CI/CD | `products/cicd.md` |
| 14 | Concert | `products/concert.md` |
| 15 | GCM | `products/gcm.md` |
| 16 | QSE | `products/qse.md` |
| 17 | Vault | `products/vault.md` |
| 18 | Bob | `products/bob.md` |
| 19 | OpenShift | `products/openshift.md` |
| 20 | 3scale | `products/3scale.md` |
| 21 | JBCS httpd | `products/jbcs-httpd.md` |
| 22 | Rancher / RKE2 | `products/rancher-rke2.md` |
| 23 | NKP | `products/nkp.md` |
| 24 | Confluent Platform | `products/confluent-platform.md` |
| 25 | Palsys One | `products/palsys-one.md` |
| 26 | CMC | `products/cmc.md` |

表中「產品」欄的寫法與 `products.yaml` 的 `name` 不一致時,以 `products.yaml` 為準,檔名以本表的 id 對應為準。`products.yaml` 新增產品時,同一個 PR 要在本表加一列。

### 單一產品頁 `products/<slug>.md`

```markdown
# <產品名稱>

[← 26 項產品現況](README.md)

- 全名:<products.yaml 的 full_name,沒有就不寫這一行>
- 原廠:<vendor>
- 最後檢查:YYYY-MM-DD
- 當天狀態:有更新 / 無更新 / 無法確認(原因) / 無公開來源

## 各來源目前看到的最新一筆

| 來源 | 類別 | 工具 | 最新一筆 | 日期 | 檢查結果 |
|---|---|---|---|---|---|
| [<來源標題>](<網址>) | 新版本 / 安全公告 / 生命週期 | <tool,沒有寫 —> | <last_seen_marker,沒有寫「未記錄」> | <last_seen_date,沒有寫「頁面沒有日期」> | 讀得到 / 無法開啟 / 需要登入 / 頁面沒有可比對的清單 / 已轉址 |

## 最近動態

新的在上面,每天往上累加,舊的不刪。

### YYYY-MM-DD

- <類別>:<一句話,含版號或公告編號與發布日期>。來源:<網址> → [當天產品動態](../daily/YYYY-MM-DD/products.md)
```

- 每晚每個產品都更新:「最後檢查」「當天狀態」與「各來源目前看到的最新一筆」整段照當晚的 `state/sources.json` 重寫,該產品在 `products.yaml` 列出的每個來源各一列,不省略。
- 「最近動態」只在當天該產品有內容時,在最上面加一個 `### YYYY-MM-DD` 小節;當天沒有內容就不加,舊的小節原樣保留,不改寫、不刪除。算有內容的三種情況:當天回報的更新(每則一行);建立基準時看到但不算當天更新的近期安全公告(行首寫「安全公告(建立基準時看到,不算當天更新)」);當天無法確認(寫「無法確認:<原因>」)。
- 還沒有任何動態的產品,「最近動態」底下寫「還沒有紀錄。」;第一次有動態時把這句拿掉。
- CI/CD 的產品頁在「各來源」表格之後多一節「## 各工具當天狀態」,每個工具一行:`- <工具名稱>:有更新 / 無更新 / 無法確認(原因)`,每晚整節重寫,`products.yaml` 中出現的每個工具都要列。
- 沒有公開來源的產品(CMC)也有產品頁,「各來源」底下寫「這個產品沒有公開來源,不檢查。」。
- 產品頁不存在時(第一次執行,或新增了產品)照上面的格式新建。本機有檔案就以本機為準往上加;本機沒有而 repo 有時,先從 repo 的 `main` 取回再往上加,不可用新建的蓋掉 repo 上已有的動態。

### 產品現況總表 `products/README.md`

每晚整份重寫:

```markdown
# 26 項產品現況

最後更新:YYYY-MM-DD。每晚檢查後整張表重寫,點產品名稱看各來源的最新一筆與最近動態。

「目前最新版本」是原廠頁面上讀到的最新版號;有多條版本線或無法用一個版號表示的寫「見產品頁」。

| # | 產品 | 原廠 | 當天狀態 | 目前最新版本 | 最後檢查 |
|---|---|---|---|---|---|
| 1 | [<產品名稱>](<slug>.md) | <vendor> | 有更新 / 無更新 / 無法確認 / 無公開來源 | <版號> | YYYY-MM-DD |
```

- 26 列全部列出,依 id 排序,不合併、不省略。
- 「目前最新版本」只寫當晚在原廠頁面上實際讀到的正式版(GA)版號,不寫公告編號、頁面修改日期或 Beta 版。同時維護多條版本線的產品(例如 WebSphere Application Server 的 9.0.5 與 8.5.5、MQ 的 LTS 與 CD)、CI/CD(多個工具)、當晚讀不到版號的產品,寫「見產品頁」;沒有公開來源的寫「—」。不確定就寫「見產品頁」,不可用推測的版號。
- 當晚無法確認的產品,「目前最新版本」沿用上一晚的值,「最後檢查」維持上一次成功檢查的日期。

### `items.jsonl`

沿用 v1 的 12 個欄位:`id`、`date`、`category`、`title`、`summary`、`impact`、`cve_ids`、`products`、`related_to_palsys`、`source_url`、`source_published`、`file`。

`file` 欄位寫該則所在的段落檔路徑,例如 `daily/2026-11-20/products.md`;舊資料(指向 `daily/2026-11-19.md` 的)不改。

`category` 的值:

| 值 | 說明 | v1 是否已有 |
|---|---|---|
| `cve` | CVE 重大新聞 | 已有 |
| `taiwan-it` | 台灣 IT 重大事件 | 已有 |
| `ai` | 全世界 AI 新功能及重大事件 | 已有 |
| `product` | 產品動態 | 新增 |
| `knowledge` | 新知識 | 新增 |

新增四個選填欄位,舊資料不補:

| 欄位 | 用在哪個 category | 值 |
|---|---|---|
| `update_type` | `product` | `release`、`security`、`lifecycle` 三者之一 |
| `product_version` | `product` | 這則更新對應的版號,字串 |
| `tool` | `product`(僅 CI/CD) | 工具名稱,與 `products.yaml` 的 `tool` 一致 |
| `knowledge_type` | `knowledge` | `standard`、`attack-defense`、`tool`、`vendor-feature`、`architecture` 五者之一 |

規則不變:只往後附加,舊資料不修改。「今日無更新」的產品不寫入 `items.jsonl`。

### `state/sources.json`

每個來源上次看到的內容,格式見第二節「怎麼判斷是新的」。這個檔案每晚整份覆寫,是唯一不受「只往後附加」限制的檔案;歷史由 git 的 commit 紀錄保留。

## 七、清單維護

清單維護寫在當天的 `daily/YYYY-MM-DD/maintenance.md`,摘要只放一句話。當天沒有內容時檔案仍建立,內文寫「今天沒有清單維護項目」。要寫的項目:

- `products.yaml` 中確認可用的 `unverified` 網址(列出產品與網址)。
- 已失效或改版的網址(列出產品、舊網址、建議的新網址)。
- 找到的新來源(列出產品與網址)。
- 當晚第一次建立基準的來源(列出產品與網址)。
- 版本選單出現新版本的來源(列出產品、目前網址的版本、選單中的最新版本)。

上面任何一項有內容時,GeorgeAI 當天就把對應的修改做成 PR 送到 `george-palsys/morning-brief-archive`,不等 George 開口。PR 說明逐項列出改了哪個產品、舊網址、新網址、是怎麼確認的。PR 由 GeorgeAI 自行合併,合併後在當天晨報的「清單維護」與回報中附上 PR 連結,George 不需要逐一核准(George 於 2026-11-19 指示)。修改一律走 PR,不直接推到 `main`,這樣每次改動都留有紀錄、可以還原。沒有實際開頁確認的網址不可標成已確認。

## 八、排程怎麼讀到這份規則

- 半夜 2:00 的排程每晚先從 repo 的 `main` 分支讀 `SPEC.md` 與 `products.yaml`,照讀到的內容執行。規則不寫死在排程裡,這樣合併 PR 後當晚就生效。
- 兩個檔案有任何一個讀不到:當晚改用 v1 的三段格式,整份寫在 `daily/YYYY-MM-DD/README.md` 一個檔,並在第一行寫明「今晚讀不到規則,以下是 v1 格式」;當晚不寫其他段落檔,也不動 `products/` 底下的檔案。
- 本機歸檔資料夾是產出的正本,路徑照第六節的檔案配置,全部先寫在本機。寫入順序:先寫各段落檔、產品頁與總表、`items.jsonl`、`state/sources.json`，再寫當天摘要，最後寫入含顯示欄位的 `meta.yaml`。
- 早上 7:30 的備份排程把本機的檔案上傳到 repo 的同一路徑(當天的 `daily/YYYY-MM-DD/` 整個資料夾、`products/` 全部、`items.jsonl`、`state/sources.json`)。備份排在發送之前,因為發送的摘要中有連到 repo 的連結。
- 早上 8:00 的發送排程只貼當天摘要,摘要中的相對連結換成 repo 上的完整網址(`https://github.com/george-palsys/morning-brief-archive/blob/main/daily/YYYY-MM-DD/<檔名>` 與 `https://github.com/george-palsys/morning-brief-archive/blob/main/products/<檔名>`)。
- 執行時間上限 90 分鐘。超過時把還沒檢查的產品列入「今日無法確認」,原因寫「超過執行時間」,不可當成「無更新」。時間不夠時的取捨順序:段落檔與摘要一定要寫完;產品頁來不及全部更新時,先更新當天有更新與無法確認的產品,其餘沒更新到的在 `maintenance.md` 逐一列出名稱。

上線狀態(2026-11-19):v2 已在 2026-11-19 合併到 `main`(PR #2),半夜 2:00、早上 8:00、早上 8:30 三個排程在同一天改成照 v2 執行;v3 合併後,同一天再改一次(見下面「v3 分檔」)。

演練紀錄(2026-11-19):同一天中午照這份規則完整演練一次,產出只寫在本機的演練資料夾,沒有動正式歸檔。26 個產品全部檢查完,實際工作時間約 26 分鐘(中途因額度用完中斷一次,等待時間不計),沒有碰到 75 分鐘的停查線。演練發現的問題已修進本檔與 `products.yaml`:「上一份晨報之後」的界線改用蒐集時間、建立基準時補列近期重大安全公告、帶版本號網址的回報條件、共用網址的鍵值、沒有日期的頁面、`result` 的新值、IBM 安全公告改用公告清單頁。演練建立的來源基準已放進本機歸檔資料夾的 `state/sources.json`,所以第一次正式執行不是從零開始。

v3 分檔(2026-11-19):George 看過演練那份單一檔後決定拆開。用演練內容拆出來的樣子放在分支 `preview-v2-2026-11-19` 的 `preview/daily/2026-11-19/` 與 `preview/products/`,那是人工拆的版面示範,不是排程產出。三個排程同一天改成照本節執行,備份由 8:30 提前到 7:30。

第一次正式執行是 2026-11-20 半夜 2:00,直接用 v3 的版面;v2 的內容規則與 v3 的分檔都還沒有照排程實際跑過,執行結果還沒有驗證。
