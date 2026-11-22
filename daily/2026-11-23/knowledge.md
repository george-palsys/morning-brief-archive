# 新知識｜2026-11-23

[← 今日摘要](README.md)｜[產品動態](products.md)｜[新知識](knowledge.md)｜[CVE](cve.md)｜[台灣 IT](taiwan.md)｜[AI](ai.md)｜[清單維護](maintenance.md)｜[26 項產品現況](../../products/README.md)

### RFC 10073：Composite ML-DSA，把 ML-DSA 與 RSA 或 ECDSA 綁成「一個」簽章演算法放進 X.509 憑證

- 這是什麼：IETF 於 2026 年 11 月發布的 Standards Track RFC（RFC Editor 列的日期是 2026-11-06），定義後量子加傳統（PQ/T hybrid）的複合簽章：把 NIST 的 ML-DSA 與 RSASSA-PKCS1-v1_5、RSASSA-PSS、ECDSA、Ed25519 或 Ed448 其中一種組合起來，用在 X.509 與 PKIX 的資料結構。搭配的 RFC 10082（2026-11-07）定義同一套演算法在 CMS 的用法。
- 原理：
  - 對外是一個演算法：一樣是 KeyGen、Sign、Verify 三個函式，公鑰、私鑰、簽章各自是兩個元件串接後的一個位元組字串，每一種組合有自己的 OID。PKCS #10、CMP、X.509、CMS 這些協定不需要知道裡面是兩個演算法，RFC 稱為 protocol backwards compatibility。
  - 簽章時先把訊息雜湊，組成 `M' = Prefix || Label || len(ctx) || ctx || PH(M)`，再把 M' 分別交給兩個元件演算法簽；Label 是每個組合專屬的字串。裡面的 ML-DSA 用的是「pure」ML-DSA，不需要實作 HashML-DSA。
  - 是嚴格的「AND」模式：兩個簽章都要驗過才算通過。只要其中一個元件演算法仍是 EUF-CMA 安全（且預先雜湊抗碰撞），整體就是 EUF-CMA 安全。
  - RFC 自己寫明的限制：沒有任何組合對量子攻擊者是 SUF-CMA 安全，所以把單純的 ML-DSA 換成 Composite ML-DSA 在這一點上是降低安全性，不建議用在還沒確認 EUF-CMA 足夠的應用。也不提供應用層的向下相容：只有升級過的系統認得這些 OID。
  - 沒有指定必須實作哪一個組合。沒有法規或舊系統包袱時，建議優先實作 `id-MLDSA65-ECDSA-P256-SHA512`；一定要 RSA 時建議 `id-MLDSA65-RSA3072-PSS-SHA512`。
- 用在哪裡：客戶的 PQC 遷移規劃中，「憑證要直接換 ML-DSA，還是用混合式」現在有定案的標準可以引用。它適合已有經過驗證的 RSA 或 ECC 實作、想先加上 ML-DSA 但新實作還沒通過認證的組織。和 11-20 晨報寫過的 NIST IR 8547（2030 年後 deprecated、2035 年後 disallowed）一起看：複合憑證是過渡期的選項之一，但 CA、HSM、Vault PKI 與應用端的函式庫都要支援新的 OID 才用得起來，各產品的支援狀況這次沒有查。
- 原文：
  - RFC 10073「Composite Module-Lattice-Based Digital Signature Algorithm (ML-DSA) for Use in X.509 Public Key Infrastructure」（2026-11-06）：https://www.rfc-editor.org/info/rfc10073/
  - RFC 10082（CMS 的用法，2026-11-07）：https://www.rfc-editor.org/info/rfc10082/

### Upload2Shell 的機制：Ghostscript 字型載入程式的一次型別錯誤，怎麼變成繞過 -dSAFER 的記憶體寫入

- 這是什麼：pwn.ai 的 Paulos Yibelo 於 2026-11-21 發表的技術分析，說明 CVE-2026-125396 的成因。漏洞的版本、嚴重度與修補狀態寫在今天的 [CVE](cve.md)，這裡補它怎麼運作。背景：PostScript 是一種完整的程式語言，轉換 PostScript 文件就是執行一支程式；-dSAFER 是 Ghostscript 直譯器內部的權限檢查，用來限制文件讀寫檔案與執行指令，不是核心層級的 system call 過濾。
- 原理：
  - Ghostscript 的一部分字型載入是用 PostScript 寫的。`gs_fonts.ps` 裡的輔助程序 `.putgstringcopy` 需要寫入受保護的字型字典，所以會呼叫內部的特權運算子 `.forceput`，但呼叫前沒有檢查運算元的型別。
  - 攻擊文件註冊一個 Type 1 字型；字型的載入程式碼把堆疊上的檔名字串換成陣列，讓 `.forceput` 前一步的 `copy` 發生 typecheck 錯誤。
  - 文件自訂的錯誤處理程序把堆疊整理成自己要的字典、鍵、值再返回，執行流程接著跑到 `.forceput`。攻擊者不必直接呼叫這個隱藏的運算子，就完成一次受保護字典的寫入。
  - `.forceput` 寫入時暫時把 `systemdict` 當成 local，所以一個 local 物件可以被放進會在 `restore` 之後存活的 global 字典。`restore` 釋放 local 物件後，字典裡的參照指向已釋放的記憶體；再配置新物件佔用同一位址，就成為 use-after-free，pwn.ai 進一步把它做成可指定寫入內容與位置的 write-what-where，用來改掉執行 -dSAFER 的狀態。
  - 文章寫這個問題是由 GPT 5.6 Sol 與研究員合作找到的。
- 用在哪裡：兩個可以帶走的重點。第一，檢查應用程式有沒有用到 Ghostscript 不能只找程式碼裡有沒有呼叫 `gs`，要看影像函式庫（Pillow、ImageMagick、libvips）會不會依檔案內容把工作轉交出去。第二，直譯器內部的沙箱擋不住直譯器自己的記憶體錯誤，處理不受信任檔案的轉檔工作要另外用作業系統層的限制（AppArmor、seccomp、獨立的低權限容器）包起來。
- 原文：How We Hacked the Pipes — Upload2Shell（2026-11-21）：https://pwn.ai/upload2shell/research.html

### PyPI 新的 Security 分頁：把套件的來源證明（attestation）歸成六種狀態，並標出「來源改變」與「來源消失」

- 這是什麼：OpenSSF 部落格 2026-11-17 的文章（作者 Nicole Harris、Dustin Ingram）。OpenSSF 的 Securing Software Repositories 工作組出資制定「Attestations Style Guide」，規範套件庫該怎麼把 attestation 呈現給使用者；第一個照它實作的是 PyPI，專案頁面新增 Security 分頁。attestation 是可驗證的紀錄，說明套件在哪裡、怎麼建置或發布，由哪個身分或 workflow 負責。
- 原理：
  - PyPI 區分兩種 attestation：PyPI Publish（發布過程的證據）與 SLSA Build Provenance（某個發行檔是怎麼建置出來的）。介面用不同顏色與圖示區分，並連到各自的 predicate 定義。
  - 每個 release 會顯示一個整體的來源狀態，共六種：
    - No provenance：這個 release 的檔案都沒有 attestation。
    - Full provenance：所有檔案都有 attestation。
    - Incomplete provenance：有一部分檔案上傳時沒有 attestation。
    - Inconsistent provenance：attestation 顯示同一個 release 的檔案來自不同、互不相關的建置或發布 pipeline，或不同的原始碼 repository。
    - Change of provenance：建置或發布 pipeline、或來源身分，與前 14 天內的某個 release 不同。
    - Loss of provenance：前 14 天內發布過有來源證明的 release，新的 release 卻沒有 attestation。
  - 來源警告會顯示在專案頁最上方（release 被隔離時，隔離通知優先），側欄、release files 與 release history 分頁也會顯示狀態。PyPI 文件對每種警告都說明了良性與惡意兩種可能的原因。
- 用在哪裡：帳號被盜後發布惡意版本的供應鏈攻擊，常見的痕跡正是「這一版不是從原本的 CI 發出來的」，對應到 Change of provenance 與 Loss of provenance 兩種狀態。客戶的開發團隊評估 Python 套件，或我們用 Black Duck 做 SCA 之外想人工複查某個可疑版本時，可以直接看這個分頁。文章也提醒 attestation 只是判斷套件可信度的其中一項訊號。
- 原文：Clearer Security Signals: Making Attestations Comprehensible for PyPI Users（2026-11-17）：https://openssf.org/blog/2026/11/17/clearer-security-signals-making-attestations-comprehensible-for-pypi-users/

### OpenShell 在 Kubernetes 上怎麼關住 AI agent：workload Pod 完全不能對外，每個請求都回到 supervisor 檢查

- 這是什麼：CNCF 部落格 2026-11-11 的文章（作者 Jim Bugwadia，Nirmata），給平台工程師看的 OpenShell 導覽。OpenShell 由 NVIDIA 發起，現在是 CNCF Sandbox 專案，是讓 AI agent 在沙箱裡執行的 runtime。文章的前提是：agent 會開 shell、裝套件、讀檔、連網路，而且常依剛從網路抓來的文字行動，所以每個 agent 都是「手上握有真實憑證的不受信任程式」。
- 原理：
  - 用 YAML 宣告四類控制：
    - Filesystem：用 Landlock 限制可讀寫的路徑。
    - Process：agent 啟動前降為沒有 capability 的非 root 使用者，並套用 seccomp。
    - Network：對外連線預設全部拒絕，可依 binary、主機、port 與 HTTP method 放行。
    - Credentials：agent 只看到 API key 的 placeholder，真正的 key 由 supervisor 在允許的端點才換上。
  - 在 Kubernetes 上它不自帶 scheduler，而是用 SIG Apps 的 Agent Sandbox（`agents.x-k8s.io` 的 Sandbox 資源）。agent 就是 Pod、Service、PVC、Secret 與 NetworkPolicy。
  - 建立順序是先建 NetworkPolicy 再建 Sandbox：workload Pod 完全沒有對外流量，只接受 supervisor 從 TCP 5500 連入；Pod 先被 scheduling gate 擋住，OpenShell 在 admission 之後把 Pod 讀回來檢查（非 root 的 UID 與 GID、沒有額外 capability、RuntimeDefault seccomp、沒有 host namespace、沒有 ServiceAccount token），有任何一項被 admission webhook 改掉就建立失敗。
  - 執行期間 agent 的每個對外請求都送到 supervisor，檢查目的地、port、發出請求的 binary 與 HTTP 請求內容後才開上游連線；`openshell policy update` 可以不重啟就換政策。文章舉的例子：NetworkPolicy 只能寫「這個 Pod 可以連 api.github.com 的 443」，OpenShell 可以寫「curl 可以讀 issue 但不能建立 issue」。
  - 文章列的限制：目前只能透過 OpenShell gateway 的 API 建立 sandbox，還沒有 CRD 與 operator；每個 agent 一個 supervisor Pod，大規模時不一定撐得住；版本還在 v0.1.x（示範用 OpenShell 0.1.3、Agent Sandbox v1.0.5、Kubernetes 1.35）。
- 用在哪裡：客戶開始在 OpenShift 或 RKE2 上跑會自己執行指令的 AI agent 時，這是「agent 能碰到什麼」這個問題目前在 CNCF 裡的一個具體做法，可以拿它的四類控制當檢查項目。它和 NeuVector 這類執行期防護不衝突：NeuVector 看的是容器的行為與網路，OpenShell 多做的是「哪個 binary 發的哪一種 HTTP 請求」與憑證代換。還是很早期的專案，目前只適合 lab 評估。
- 原文：OpenShell on Kubernetes: A guide for platform engineers（2026-11-11）：https://www.cncf.io/blog/2026/11/11/openshell-on-kubernetes-a-guide-for-platform-engineers/

### 裝了執行期防護工具不等於有安全基準：基準是跨團隊要一起回答的六個問題

- 這是什麼：CNCF 部落格 2026-11-16 的文章（作者 Matteo Bisi，Reevo）。作者看過的案例：團隊在期限壓力下自己選了執行期偵測工具，一週內部署到所有叢集、儀表板滿是事件，但每一則告警都卡在同一個問題「這是預期的行為嗎？」，因為能回答的人在別的團隊，而且沒有人及早去問。
- 原理：
  - 工具提供機制，組織要提供意圖。Falco 內建的是通用規則，要變成有用的訊號得知道每個工作負載應該做什麼；Kyverno 或 OPA Gatekeeper 要擋下還是只回報，是風險決策，不是設定細節；Kubernetes audit log 要先決定記什麼、留多久、誰來看。
  - 文章把基準拆成六個可以在叢集裡設定與驗證的問題，每一個要同意的人不同：
    - 哪些工作負載可以跑、用什麼 security context：Pod Security Admission 或同等的 admission policy；平台與資安。
    - 接受哪些 registry 與映像來源：admission 階段的 Sigstore 簽章驗證；資安與應用團隊。
    - 什麼要擋、什麼只回報：Kyverno 的 Enforce 或 Audit、Gatekeeper 的 deny、warn 或 dryrun；資安定義、平台操作。
    - 正常的執行期行為長什麼樣：依工作負載調整的 Falco 規則與例外；應用團隊與資安。
    - 誰可以核准例外、何時到期：Kyverno PolicyException、Gatekeeper 的排除、Falco 規則例外；對該服務有權責的風險擁有者。
    - 保留哪些事件、多久、誰來看：audit policy 與 log 後端的保留期；資安維運與平台。
  - 做法是把基準當成程式碼：政策與規則放在 repository；用 CODEOWNERS 指定哪些路徑要資安或應用團隊審；例外用 pull request 提出並寫明到期日，再用排程的 CI 檢查過期的例外；新政策先跑回報模式，但要先約定轉成強制的日期與負責人。
  - 四個決定通常不該是同一個人：定義預期結果、實作與維運、接受殘餘風險、驗證持續有效。文章指出最常壞在第三個：核准例外的人要有預算修它，否則只是見證風險，不是接受風險。
- 用在哪裡：NeuVector 的 POC 也要先回答同一類問題：Discover 模式學到的規則，由誰決定哪些行為算正常、什麼時候切到 Protect。POC 與導入規劃可以直接拿這六個問題當會議議程，先確認每一題客戶端是誰回答。文章用的例子是 Falco 與 Kyverno，NeuVector 的對應是我自己的類比，不是文章內容。
- 原文：Your runtime security tool is not your baseline: Silos dressed as autonomy in cloud native teams（2026-11-16）：https://www.cncf.io/blog/2026/11/16/your-runtime-security-tool-is-not-your-baseline-silos-dressed-as-autonomy-in-cloud-native-teams/
