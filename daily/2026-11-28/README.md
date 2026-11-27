# 晨報 2026-11-28（星期六）｜摘要

**今天最需要注意的一件事**：金管會 2026-11-26 發布「金融業資安防護強化措施」：金融機構要在 115 年底前完成 14 項自評並提報董事會。內容涵蓋漏洞修補動態排序、停止支援系統的汰換、金鑰與憑證管理。金融業客戶會問各項拿什麼當佐證。 → [台灣 IT](taiwan.md)

## 產品動態

26 項：有更新 2、無更新 22、無法確認 1、無公開來源 1。→ [完整內容](products.md)｜[26 項產品現況](../../products/README.md)

| 產品 | 更新 | 要不要動作 |
|---|---|---|
| [Instana](../../products/instana.md) | IBM 安全公告 node/7298440（2026-11-27）：自架版 Build 1.0.285 到 1.0.327 受影響，列 70 個 CVE，最高 8.7（CVSS 4.0），修在 build 1.0.329 | 自架版確認後端 build 是不是 1.0.329，還沒到的排升級；已經是 1.0.329 的與 SaaS 客戶不用動 |
| [CI/CD](../../products/cicd.md) | OpenShift Pipelines：文件補上 1.24.3 的 release notes（errata 是 2026-10-31），兩項修正：OLMv1 安裝失敗、映像的 OpenSSL 政策改成 DEFAULT:PQ | 用 OLMv1 裝 1.24 裝不起來的升到 1.24.3；其他環境不急 |

無法確認：

- [Software Risk Manager (SRM)](../../products/srm.md)：文件入口頁打得開，但 release notes 要登入才看得到，也沒有公開的安全公告頁。

## CVE 重大新聞

5 則。其中 1 則與我們的產品線相關；CISA KEV 在 2026-11-27 新增 3 筆。→ [完整內容](cve.md)

- CVE-2026-120705、CVE-2026-129243：GeoServer 兩個漏洞列入 CISA KEV，可和另外三個串成不需登入的遠端程式碼執行
- 【與我們的產品線相關】CVE-2026-137481：Traefik 沒有處理 `/..;x/` 這種路徑，可以繞過驗證到達後面 Servlet 應用的受保護路徑
- CVE-2026-136716：【後續】Drupal core 的 SA-CORE-2026-019 在 2026-11-27 列入 CISA KEV
- CVE-2026-120353：Apache Airflow 多個 provider 把範本算了兩次，能觸發 DAG 的人可以在 worker 上執行命令
- CVE-2026-137686：Apache Shiro 的 ActiveDirectoryRealm 在特定設定下接受空白的帳號與密碼

## 新知識

5 則。→ [完整內容](knowledge.md)

- 重寫線上服務時，測試通過不等於行為一致：Anthropic 用正式流量比對新舊兩版
- GKE ambient networking 正式推出：service mesh 不再每個 Pod 放一個 sidecar
- AWS STS GetScopedCredentials：把手上的暫時憑證再縮小權限，交給下一層的 agent
- Shirudo：OpenAI 與 Cisco 開源的 eBPF 防護，修補上線前先擋住漏洞的觸發路徑，不用重啟服務
- NIST 對抗式機器學習分類草案（SP 2400-102e2026）：新增針對 agentic 系統的攻擊分類，徵求意見到 12 月 18 日

## 台灣 IT 重大事件

3 則。→ [完整內容](taiwan.md)

- 金管會發布「金融業資安防護強化措施」：14 項自評，115 年底前完成並提報董事會
- Gogolook 代子公司袋鼠金融科技發布資安重訊：Roo.Cash 平台遭外部攻擊，部分使用者個資外洩
- TWCERT/CC 在 2026-11-27 公開三則漏洞公告：德瑞數位科技入口網、網擎 Mail2000、D-Link DWM-222W

## 全世界 AI 新功能及重大事件

3 則。→ [完整內容](ai.md)

- 瑞士國家網路安全中心：首次確認用 AI agent 發動的攻擊成功入侵關鍵基礎設施營運者
- Microsoft 公開 AI 攻擊框架 ARTEX 的拆解：六個威脅組織已經把它納入自己的工具
- OpenAI 修正 GPT-6.2 的計費錯誤，Astra 與 Sol 的額度會更快用完（只有媒體報導）

## 清單維護

- 來源清單（products.yaml）今天沒有修正，沒有送 PR。
- 今天打開 109 個來源，108 個讀得到，1 個回 404（NeuVector 在 SUSE 文件站的舊網址）。
- QSE 的 What's new 頁要不要加進來源清單，還在等 George 決定。
- Coverity 的 Polaris 頁與 OpenShift 的 Errata Search 有變動，但都不是這兩項產品本身的更新，只更新比對紀錄。

→ [完整內容](maintenance.md)
