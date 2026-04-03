/**
 * 生成高德导航链接：
 * - 移动端优先尝试 App 深链接（iOS/Android），App 未安装时降级到 H5
 * - 桌面直接返回高德 Web 搜索链接
 * 在 <a href={amapNavUrl(kw)}> 中直接使用即可，无需额外 JS 处理
 */
export function amapNavUrl(keyword: string, city = '广元'): string {
  const enc = encodeURIComponent(keyword)
  const cityEnc = encodeURIComponent(city)
  // uri.amap.com 是高德官方 Universal Link 中转，App 已安装则打开 App，否则打开 H5
  return `https://uri.amap.com/search?keyword=${enc}&city=${cityEnc}`
}

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

