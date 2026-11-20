// Fixed wording from SPEC.md. Keep presentation code separate from copy.
export const copy = {
  attention: '今天最需要注意的一件事',
  cvss: (version, source) => `CVSS${version === null ? '' : ` ${version}`}（${source}）`,
  drill: (date, time) => `歷史演練分檔：${date} ${time} 蒐集（台灣時間）。僅搬移原文，未重新蒐集或查證；產品來源快照本次未建立，不代表目前產品狀態。`,
  kev: ({ product, cve_id, due }) => `${product}（${cve_id}）${due} 到期`,
  exploited: { confirmed: '已遭利用', poc: 'PoC 已公開', none_seen: '未見攻擊', unknown: '攻擊現況未寫明' },
  patch: { released: '有修補', hotfix: '只有 hotfix', pending: '修補準備中', none: '無修補', unknown: '修補狀況未寫明' },
  kinds: ['個資', '入侵', '漏洞', '勒索', '新功能', '政策', '其他'],
  unavailable: '未提供',
  empty: '今天沒有',
  maintenance: '清單維護',
  productGrid: '26 項產品現況',
  unconfirmed: '無法確認',
  backToOverview: '回到今日摘要',
  moreCve: count => `再顯示 ${count} 則`,
  productCount: count => `${count} 項產品`,
};
