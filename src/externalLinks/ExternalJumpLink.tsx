import type { ComponentProps, ReactNode } from 'react'
import { isMobileDevice } from './device'

/**
 * 外链打开策略：移动端同窗（利于 Universal Link / App scheme），桌面新标签。
 */
export function getExternalOpenAnchorProps(): Pick<
  ComponentProps<'a'>,
  'target' | 'rel'
> {
  if (isMobileDevice()) return { rel: 'noreferrer' }
  return { target: '_blank', rel: 'noreferrer' }
}

export type ExternalJumpLinkProps = Omit<ComponentProps<'a'>, 'target' | 'rel'> & {
  href: string
  children?: ReactNode
}

/** 统一封装 target/rel，业务侧只关心 href 与样式 */
export function ExternalJumpLink({ href, children, ...rest }: ExternalJumpLinkProps) {
  const open = getExternalOpenAnchorProps()
  return (
    <a href={href} {...open} {...rest}>
      {children}
    </a>
  )
}
