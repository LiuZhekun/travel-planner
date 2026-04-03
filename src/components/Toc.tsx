export type TocItem = { sectionId: string; title: string }

export function Toc(props: { items: TocItem[]; onJump: (sectionId: string) => void }) {
  const { items, onJump } = props
  if (!items.length) return null

  return (
    <div className="tocBar" aria-label="目录">
      <div className="tocRow">
        {items.map((it) => (
          <button key={it.sectionId} className="tocBtn" type="button" onClick={() => onJump(it.sectionId)}>
            {it.title}
          </button>
        ))}
      </div>
    </div>
  )
}

