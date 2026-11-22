# 晨報 2026-11-23（星期一）｜摘要

**今天最需要注意的一件事**：Ghostscript 的 -dSAFER 沙箱可以被特製文件繞過（CVE-2026-125396，VulnCheck 的 CVSS 4.0 為 8.5），有上傳、預覽、轉檔、列印功能的系統都可能成為入口，修補版本是 Ghostscript 10.08.0。目前沒有被用於攻擊的報告。它不屬於我們 26 項產品，但客戶的文件處理系統與 Linux 主機常會裝到。 → [CVE](cve.md)

## 產品動態

26 項：有更新 2、無更新 22、無法確認 1、無公開來源 1。→ [完整內容](products.md)｜[26 項產品現況](../../products/README.md)

| 產品 | 更新 | 要不要動作 |
|---|---|---|
| [OpenShift](../../products/openshift.md) | 四張 RHBA（2026-11-22），4.22、5.0、5.1 的 dpdk-base extras 映像更新；沒有新的 RHSA | 有用 dpdk-base 映像的應用重新拉映像或重新 build；叢集本身不用動 |
| [CI/CD](../../products/cicd.md) | JFrog Artifactory 7.179.1 SaaS 發布（2026-11-22），1 項功能調整、8 項問題修正；自管版仍是 7.173.21 | 不用動作；雲端版由 JFrog 自行套用，自管版沒有新版 |

無法確認：Software Risk Manager (SRM)（文件入口頁打得開，但找不到公開的 release notes 或版本號，也沒有公開的安全公告頁）。

## CVE 重大新聞

2 則。今天沒有屬於我們 26 項產品的新安全公告。→ [完整內容](cve.md)

- CVE-2026-125396（Upload2Shell）：Ghostscript 的 -dSAFER 沙箱可被特製文件繞過，上傳、預覽、列印功能都可能變成遠端執行指令的入口
- Microsoft Entra Connect Health API 漏洞遭利用，租戶管理員信箱與設定資料外洩（沒有 CVE 編號，Microsoft 已在服務端修補）

## 新知識

5 則。→ [完整內容](knowledge.md)

- RFC 10073：Composite ML-DSA，把 ML-DSA 與 RSA 或 ECDSA 綁成「一個」簽章演算法放進 X.509 憑證
- Upload2Shell 的機制：Ghostscript 字型載入程式的一次型別錯誤，怎麼變成繞過 -dSAFER 的記憶體寫入
- PyPI 新的 Security 分頁：把套件的來源證明（attestation）歸成六種狀態，並標出「來源改變」與「來源消失」
- OpenShell 在 Kubernetes 上怎麼關住 AI agent：workload Pod 完全不能對外，每個請求都回到 supervisor 檢查
- 裝了執行期防護工具不等於有安全基準：基準是跨團隊要一起回答的六個問題

## 台灣 IT 重大事件

4 則。→ [完整內容](taiwan.md)

- 公股銀行揭露今年遭攻擊數字：有國銀前 10 月偵測約 2170 萬次外部探測及攻擊，第 3 季起明顯增加
- 觀光署統計：113 年至今 12 家旅行社通報個資外洩，累計約 155 萬筆，近 8 成業者未符合個資風險評估要求
- TeamT5 執行長：10 月起進入 AI 自動化攻擊時代，事件應變案件多到成立以來首度婉拒新客戶
- 台股震盪（後續）：上週單週跌 7641.83 點，行政院長 11-23 下午邀金融、科技與工商公協會代表會面

## 全世界 AI 新功能及重大事件

4 則。→ [完整內容](ai.md)

- OpenRouter 下架三家推論供應商、取消 125 個端點的 Zero Data Retention 資格：研究者發現提示內容被竊取與留存
- 黎曼猜想證明（後續）：Lean 與 Mathlib 社群聲明已完成檢查，確認敘述與證明都正確
- OpenAI 首席科學家公開內部 perplexity 數字，提議各家以它訂出共同的開發上限
- 金融時報：亞馬遜接近以約 75 億美元收購 AI 新創 Decart，交易尚未確定

## 清單維護

- 來源清單（products.yaml）今天沒有修正，沒有送 PR。
- 今天打開 105 個來源，104 個讀得到，1 個回 404（NeuVector 在 SUSE 文件站的舊網址）；另有 3 個沒有成功重新讀到（SUSE 的 Rancher 安全頁標題仍是 Signing Keys、QSE 單則公告頁沒有重開），沿用上次紀錄。
- 數位發展部新聞稿頁回 404、Reuters 回 401，這兩個新聞來源今天沒有讀到。

→ [完整內容](maintenance.md)
