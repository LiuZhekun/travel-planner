/**
 * 第三方 App / H5 跳转：设备判断、URL 构造、统一 <a> 行为。
 * 新增平台：在 urls.ts 增加 pair/直链 → resolve.ts 增加 resolveXxxHref → 此处导出。
 */
export { isIOSLike, isMobileDevice } from './device'
export {
  amapNavUrl,
  douyinSearchPair,
  pickMobilePreferredHref,
  xhsSearchPair,
  type HttpsAppPair,
} from './urls'
export {
  buildTripToolJumpHrefs,
  resolveAmapNavHref,
  resolveDouyinSearchHref,
  resolveJumpHref,
  resolveXhsSearchHref,
  type ExternalJumpProvider,
  type JumpInput,
} from './resolve'
export { ExternalJumpLink, getExternalOpenAnchorProps } from './ExternalJumpLink'
