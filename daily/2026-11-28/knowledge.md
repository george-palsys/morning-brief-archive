# 新知識｜2026-11-28

[← 今日摘要](README.md)｜[產品動態](products.md)｜[新知識](knowledge.md)｜[CVE](cve.md)｜[台灣 IT](taiwan.md)｜[AI](ai.md)｜[清單維護](maintenance.md)｜[26 項產品現況](../../products/README.md)

今天 5 則：架構與實務 2 則，原廠新功能、新工具與開源專案、新標準與規範各 1 則。每一則實際讀了原文的哪些部分，寫在該則的最後。

### 重寫線上服務時，測試通過不等於行為一致：Anthropic 用正式流量比對新舊兩版

- 類別：架構與實務
- 這是什麼：Anthropic 的工程文章，講它怎麼在不停機、不凍結功能開發的情況下，把 Messages API 從 Python 改寫成 Rust。
- 原理：Rust 版通過約 98% 的測試，但拿正式流量比對時，只有約四分之一的輸入結果完全相符，因為使用者依賴的邊角行為不在測試裡。文章舉的例子：Python 寫出 JSON 的 tool call 時會把 emoji 轉成文字碼，Rust 原樣輸出，prompt 就差了幾個位元組。做法是 shadowing：同一個請求讓兩版都處理，逐階段比對。一般的 shadow 工具假設請求可以安全地跑兩次、服務的結果是固定的，這裡兩者都不成立，所以模型只跑一次，把模型的輸出重播給 Rust 版，再比對模型呼叫前後每一階段是不是完全相同。文章寫結果是每個請求少用約 70% 的 CPU。
- 用在哪裡：WebSphere Application Server 換到 Liberty、JBoss EAP 跨版本升級、應用搬上 OpenShift，都是「行為要一樣」的遷移。客戶問「測試都過了為什麼上線還是出事」時，這篇可以當例子：要拿真實流量比對，不能只跑測試。今天讀了開頭到「Why migrate?」與 shadowing 那一節，後面的章節沒有讀；日期取自 Anthropic 新聞列表。
- 原文：Migrating the Messages API to Rust（Anthropic，Nov 25, 2026） https://www.anthropic.com/research/migrating-api-to-rust

### GKE ambient networking 正式推出：service mesh 不再每個 Pod 放一個 sidecar

- 類別：架構與實務
- 這是什麼：Google Cloud 宣布 GKE 的 ambient networking 正式推出（GA），是不用 sidecar 的 service mesh 做法。
- 原理：原本每個 Pod 一個 sidecar proxy 做的事，移到每個節點共用的元件。節點上有一個 NRI plugin 把進出 Pod 的流量攔下來，導向節點上共用的 L4 Envoy；這個 proxy 負責 mTLS、授權政策、負載平衡與遙測。控制面由 Traffic Director 用 xDS 下發路由與存取政策，Certificate Authority Service 發工作負載的身分憑證。應用的 Pod 不用改，也不用注入 sidecar。
- 用在哪裡：客戶嫌 sidecar 太吃資源，或在比較各家 service mesh 時用得上；OpenShift Service Mesh 也有 ambient 模式可以對照（這一句是我們的對照，不是這篇文章的內容）。今天讀了開頭、架構與核心功能的段落，後面沒有讀。
- 原文：Ambient networking for GKE（Google Cloud Blog，November 21, 2026） https://cloud.google.com/blog/products/networking/ambient-networking-for-gke-sidecarless-service-mesh/

### AWS STS GetScopedCredentials：把手上的暫時憑證再縮小權限，交給下一層的 agent

- 類別：原廠新功能
- 這是什麼：AWS STS 的新 API，讓你用現有的暫時憑證換出一組權限更小的暫時憑證。
- 原理：呼叫時帶一份 scope down policy（描述新憑證最多能做什麼）、或更短的效期、或兩者都帶。新憑證的權限是「原本 session 的有效權限」與「scope down policy」的交集，所以只會變小；效期不能超過原本 session 剩下的時間；身分不變。拿縮小後的憑證可以再呼叫一次繼續縮，所以負責分派工作的 agent 能給每個 sub-agent 比自己更窄的權限。
- 用在哪裡：客戶問「AI agent 或 CI/CD 的每個 job 該拿什麼憑證」時的對照：Vault 的子 token 權限不會超過父 token，是同一個想法。今天讀了前四段與「Limit what AI agents can do」的開頭，呼叫範例沒有讀。
- 原文：Scope down permissions of existing sessions using AWS STS GetScopedCredentials（AWS Security Blog，2026-11-20） https://aws.amazon.com/blogs/security/scope-down-permissions-of-existing-sessions-using-aws-sts-getscopedcredentials/

### Shirudo：OpenAI 與 Cisco 開源的 eBPF 防護，修補上線前先擋住漏洞的觸發路徑，不用重啟服務

- 類別：新工具與開源專案
- 這是什麼：OpenAI 與 Cisco 在 November 23, 2026 公開的開源 Linux 工具，用 eBPF 在執行中的系統上臨時擋住某個漏洞。
- 原理：用 eBPF 在作業系統的特定位置掛上小程式（文章稱為 shield），擋掉會觸發漏洞的行為，讓正常的請求照常通過。套用之前可以先觀察這個 shield 對應用的影響，操作的人核准後才真的擋。shield 有密碼學簽章，載入前會驗證，Linux 的 eBPF verifier 再檢查一次；並用 TPM 留下「哪些防護被載入或移除」的可驗證紀錄。文章的示範是在 Java 的 Base64 decoder 加上輸入檢查，掛到執行中的 Elasticsearch 行程上，擋住 Java4Shell 的利用而不用重啟。
- 用在哪裡：WebSphere Liberty、JBoss EAP 的客戶遇到「JDK 的修補還沒出、服務又不能停」的時候，這是一種過渡做法；NeuVector 的執行期防護是同一類話題，可以拿來比較。它是剛公開的工具，今天只讀了介紹文（開頭、運作方式、四項核心能力、Java4Shell 示範），沒有實際安裝或測試。
- 原文：Introducing Shirudo（OpenAI，November 23, 2026） https://openai.com/index/introducing-shirudo

### NIST 對抗式機器學習分類草案（SP 2400-102e2026）：新增針對 agentic 系統的攻擊分類，徵求意見到 12 月 18 日

- 類別：新標準與規範
- 這是什麼：NIST 在 November 09, 2026 公布的初始公開草案「Adversarial Machine Learning: A Taxonomy and Terminology of Attacks and Mitigations」，公開徵求意見到 2026 年 12 月 18 日。
- 原理：這是一份分類與術語的文件，不是控制項清單。它把概念排成階層：機器學習方法的類型、攻擊發生在生命週期的哪個階段、攻擊者的目標、能力與知識。這一版把重點放在對 agentic 系統的攻擊與對應的緩解做法，並新增一份 agentic 攻擊分類的索引方便引用。用途是讓後續的標準與實務指引用同一套名詞。
- 用在哪裡：客戶寫 AI 風險評估，或回應主管機關的 AI 相關要求時，可以拿它當名詞的依據；今天台灣 IT 段落寫的金管會措施裡有「AI 攻擊」情境演練，演練情境怎麼分類也可以參考它。今天只讀了 NIST CSRC 新聞頁的摘要，草案 PDF 本身沒有打開。
- 原文：Adversarial Machine Learning Taxonomy 2026 Draft（NIST CSRC，November 09, 2026） https://csrc.nist.gov/News/2026/adversarial-machine-learning-taxonomy-2026-draft
