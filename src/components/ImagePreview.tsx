import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'

type ImagePreviewCtx = {
  openPreview: (src: string, alt: string) => void
}

const ImagePreviewContext = createContext<ImagePreviewCtx | null>(null)

export function useImagePreview(): ImagePreviewCtx {
  const c = useContext(ImagePreviewContext)
  if (!c) throw new Error('useImagePreview 需在 ImagePreviewProvider 内使用')
  return c
}

export function ImagePreviewProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState<{ src: string; alt: string } | null>(null)

  const openPreview = useCallback((src: string, alt: string) => {
    setOpen({ src, alt })
  }, [])

  const close = useCallback(() => setOpen(null), [])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, close])

  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  return (
    <ImagePreviewContext.Provider value={{ openPreview }}>
      {children}
      {open ? (
        <button
          type="button"
          className="imagePreviewBackdrop"
          onClick={close}
          aria-label="关闭图片预览"
        >
          <img src={open.src} alt={open.alt} className="imagePreviewImg" decoding="async" />
        </button>
      ) : null}
    </ImagePreviewContext.Provider>
  )
}
