import { useEffect, useState } from 'react'
import type { TripSection } from '../schema/trip'
import { getSectionNote, setSectionNote } from '../storage/notes'

export function SectionCard(props: { tripId: string; section: TripSection }) {
  const { tripId, section } = props
  const [expanded, setExpanded] = useState(false)
  const [note, setNote] = useState('')

  useEffect(() => {
    setNote(getSectionNote(tripId, section.id))
  }, [tripId, section.id])

  function onChangeNote(next: string) {
    setNote(next)
    // "立即写入 localStorage"：为了移动端离线继续可用，这里直接同步写入
    setSectionNote(tripId, section.id, next)
  }

  const anchorId = `section-${section.id}`

  return (
    <article className="sectionCard card" id={anchorId}>
      <header className="sectionHeader" onClick={() => setExpanded((v) => !v)} role="button" tabIndex={0}>
        <div className="sectionHeaderTitle">{section.title}</div>
        <div className="subtle">{expanded ? '收起' : '展开'}</div>
      </header>

      {expanded ? (
        <div className="sectionBody">
          <p className="placeholder">内容区域占位：后续把你的具体旅行内容结构化到 Trip 配置后，这里将渲染对应组件。</p>

          <div className="noteLabel">
            <span>本块备注</span>
            <span className="subtle">{note.length}/300</span>
          </div>
          <textarea
            className="noteArea"
            value={note}
            placeholder="离线时可继续编辑；用于记录临时想法/现场确认要点…"
            onChange={(e) => onChangeNote(e.target.value)}
          />
        </div>
      ) : null}
    </article>
  )
}

