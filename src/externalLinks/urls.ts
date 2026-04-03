import { isIOSLike, isMobileDevice } from './device'

/** 同时提供 HTTPS 与 App scheme，由 {@link pickMobilePreferredHref} 按端选用 */
export type HttpsAppPair = { https: string; app: string }

/**
 * 高德：官方 Universal Link 中转，移动端同窗打开时更易唤起 App。
 * 桌面同样可用（会落到 Web 或唤起）。
 */
export function amapNavUrl(keyword: string, city = '广元'): string {
  const enc = encodeURIComponent(keyword)
  const cityEnc = encodeURIComponent(city)
  return `https://uri.amap.com/search?keyword=${enc}&city=${cityEnc}`
}

export function xhsSearchPair(keyword: string): HttpsAppPair {
  const q = String(keyword ?? '').trim()
  const enc = encodeURIComponent(q)
  return {
    https: `https://www.xiaohongshu.com/search_result?keyword=${enc}`,
    app: `xhsdiscover://search/result?keyword=${enc}`,
  }
}

export function douyinSearchPair(query: string): HttpsAppPair {
  const q = String(query ?? '').trim()
  const encPath = encodeURIComponent(q)
  const https = `https://www.douyin.com/search/${encPath}`
  const encUrl = encodeURIComponent(https)
  const app = isIOSLike()
    ? `aweme://webview?url=${encUrl}&from=webview&refer=web`
    : `snssdk1128://webview?url=${encUrl}&from=webview&refer=web`
  return { https, app }
}

export function pickMobilePreferredHref(pair: HttpsAppPair, mobile = isMobileDevice()): string {
  return mobile ? pair.app : pair.https
}
