import {
  amapNavUrl,
  douyinSearchPair,
  pickMobilePreferredHref,
  xhsSearchPair,
} from './urls'

/** 高德导航 / 搜索（keyword + city） */
export function resolveAmapNavHref(keyword: string, city = '广元'): string {
  return amapNavUrl(keyword, city)
}

/** 小红书关键词搜索 */
export function resolveXhsSearchHref(keyword: string): string {
  return pickMobilePreferredHref(xhsSearchPair(keyword))
}

/** 抖音关键词搜索 */
export function resolveDouyinSearchHref(query: string): string {
  return pickMobilePreferredHref(douyinSearchPair(query))
}

/** 扩展入口：新增平台时在 switch 中补分支，并导出新的 resolveXxxHref */
export type ExternalJumpProvider = 'amap' | 'xhs' | 'douyin'

export type JumpInput = {
  /** 高德关键词 / 小红书关键词 */
  keyword?: string
  /** 抖音搜索词（可与 keyword 复用） */
  query?: string
  city?: string
}

export function resolveJumpHref(provider: ExternalJumpProvider, input: JumpInput): string {
  const city = input.city ?? '广元'
  const kw = String(input.keyword ?? '').trim()
  const q = String(input.query ?? input.keyword ?? '').trim()

  switch (provider) {
    case 'amap':
      return resolveAmapNavHref(kw || city, city)
    case 'xhs':
      return resolveXhsSearchHref(kw || city)
    case 'douyin':
      return resolveDouyinSearchHref(q || city)
    default: {
      const _: never = provider
      return _
    }
  }
}

/**
 * 行程详情顶栏「地图 / 小红书 / 抖音」三组链接（已按移动端选好 href）。
 */
export function buildTripToolJumpHrefs(rawQuery: string, city = '广元') {
  const q = String(rawQuery ?? '').trim()
  const fallback = q || city
  return {
    map: resolveAmapNavHref(fallback, city),
    xhs: resolveXhsSearchHref(fallback),
    douyin: resolveDouyinSearchHref(fallback),
  }
}
