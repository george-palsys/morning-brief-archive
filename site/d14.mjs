// D14 extends Proposal A components; all supplied markup is builder-escaped.
export function pageContent(file, body, link) {
  const type = file === '404.html' ? 'notfound' : file === 'about.html' ? 'about'
    : file === 'search/index.html' ? 'search' : file === 'daily/index.html' ? 'archive'
    : file.startsWith('products/') ? 'product' : /daily\/[^/]+\.html$/.test(file) ? 'legacy'
    : /\/index.html$/.test(file) ? 'overview' : 'reading';
  const labels = {notfound:'404',about:'關於',search:'搜尋',archive:'歷史歸檔',product:'產品追蹤',legacy:'歷史晨報',overview:'晨報',reading:'本日晨報'};
  body = body.replace(/<span class="field">/g, '<span class="lead-in">');
  body = body.replace(/<div class="table-stack">/g, '<div class="table-stack" role="region" aria-label="摘要表格" tabindex="0">');
  if (!body.includes('class="kicker"')) body = body.replace(/<h1\b/, `<div class="kicker">${labels[type]}</div><h1`);
  body = body.replace(/<h1>/g, '<h1 class="page-title">');
  if (type === 'legacy') body = body.replace('這一天是舊版單檔格式', '注意：這一天是舊版單檔格式');
  if (!/class="(?:crumbs|breadcrumbs)"/.test(body)) body = `<nav class="crumbs" aria-label="所在位置">${link('index.html','首頁')}<span aria-hidden="true">/</span><span aria-current="page">${labels[type]}</span></nav>` + body;
  if (type === 'archive') body = body.replace('</h1>', '</h1><p class="lead">依日期閱讀晨報與各段落，保留歷史歸檔及同日不同版本。</p>');
  if (type === 'search') body = body.replace('</h1>', '</h1><p class="lead">以關鍵字、類別與時間範圍查找晨報。</p>');
  if (type === 'about') body = body.replace('<div class="prose">', '<div class="prose card about-body">').replace('<p>', '<p class="lead">');
  if (type === 'notfound') body = body.replace('<p class="actions">', '<div class="card notfound-actions"><p class="actions">') + '</div>';
  if (type === 'product') body = body.replace(/(<\/h1>)<a /, '$1<a class="btn" ');
  return `<div class="d14 d14-${type}" data-page-type="${type}">${body}</div>`;
}

export function productMeta(html) {
  const content = html.replace(/<ul>\s*((?:<li>(?:全名|原廠|最後檢查|當天狀態)[：:][\s\S]*?<\/li>\s*)+)<\/ul>/,
    (_, items) => `<dl class="product-meta factbox">${items.replace(/<li>(全名|原廠|最後檢查|當天狀態)[：:]\s*([\s\S]*?)<\/li>/g,'<div><dt>$1</dt><dd>$2</dd></div>')}</dl>`);
  return content.replace('<table role="table">', '<table role="table" class="product-sources"><colgroup><col><col><col><col><col><col></colgroup>');
}
