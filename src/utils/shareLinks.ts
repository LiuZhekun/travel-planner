export function buildShareUrls(query: string) {
  const q = String(query ?? '').trim()
  const enc = encodeURIComponent(q)

  // 注：这些是“可用的通用搜索入口”，具体落地效果以各平台当前规则为准
  return {
    map: `https://www.amap.com/search?query=${enc}`,
    xhs: `https://www.xiaohongshu.com/search?q=${enc}`,
    douyin: `https://www.douyin.com/search/${enc}`,
  }
}

