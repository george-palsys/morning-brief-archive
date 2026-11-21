export function visualIcon(root, name, size, lazy = false) {
  return `<img class="mb-motion-art" src="${root}icon-${name}.svg" width="${size}" height="${size}" alt=""${lazy ? ' loading="lazy"' : ''}>`;
}

export function visualPicture(root, topic) {
  return `<picture class="mb-art"><source media="(prefers-reduced-data: reduce)" srcset="${root}blank.svg"><source media="(max-width: 640px)" srcset="${root}hero-${topic}-mobile.webp" width="640" height="320"><img class="mb-motion-art" src="${root}hero-${topic}.webp" width="1440" height="320" alt=""></picture>`;
}

export function fullSentences(value, limit = 160) {
  const sentences = String(value).match(/[^。！？]*[。！？]+|[^。！？]+$/gu) || [];
  let excerpt = '';
  for (const sentence of sentences) {
    if (excerpt && excerpt.length + sentence.length > limit) break;
    if (excerpt && !/[。！？]$/u.test(sentence)) break;
    excerpt += sentence;
  }
  return excerpt;
}
