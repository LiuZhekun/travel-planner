import { useCallback, useEffect, useMemo, useState } from 'react'
import { listHref, tripHref } from '../router'
import { getTripConfig } from '../../trips/registry'
import type { ExpenseCategory, ExpenseItem, TripExpenseState } from '../../storage/expenses'
import { loadTripExpenses, saveTripExpenses } from '../../storage/expenses'

const CATEGORY_META: Record<
  ExpenseCategory,
  { label: string; icon: string; cellClass: string; iconWrapClass: string }
> = {
  food: {
    label: '餐饮',
    icon: 'restaurant',
    cellClass: 'expenseCatCell expenseCatCell--food',
    iconWrapClass: 'expenseCatIconWrap expenseCatIconWrap--food',
  },
  stay: {
    label: '住宿',
    icon: 'hotel',
    cellClass: 'expenseCatCell expenseCatCell--stay',
    iconWrapClass: 'expenseCatIconWrap expenseCatIconWrap--stay',
  },
  transport: {
    label: '交通',
    icon: 'directions_car',
    cellClass: 'expenseCatCell expenseCatCell--transport',
    iconWrapClass: 'expenseCatIconWrap expenseCatIconWrap--transport',
  },
  misc: {
    label: '其他',
    icon: 'more_horiz',
    cellClass: 'expenseCatCell expenseCatCell--misc',
    iconWrapClass: 'expenseCatIconWrap expenseCatIconWrap--misc',
  },
}

function formatYuan(n: number) {
  return new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency: 'CNY',
    maximumFractionDigits: 2,
  }).format(n)
}

function formatTime(ts: number) {
  return new Intl.DateTimeFormat('zh-CN', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(ts))
}

function newId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`
}

function sumByCategory(items: ExpenseItem[]): Record<ExpenseCategory, number> {
  const z = { food: 0, stay: 0, transport: 0, misc: 0 }
  for (const it of items) z[it.category] += it.amount
  return z
}

export function ExpensesPage(props: { tripId: string }) {
  const { tripId } = props
  const trip = getTripConfig(tripId)
  const [tick, setTick] = useState(0)
  const [sheetOpen, setSheetOpen] = useState(false)
  /** 非 null 表示编辑该条 */
  const [editingItem, setEditingItem] = useState<ExpenseItem | null>(null)
  /** 从分类卡片进入新增时锁定分类；编辑时为 null */
  const [addForCategory, setAddForCategory] = useState<ExpenseCategory | null>(null)
  const [showAll, setShowAll] = useState(false)
  const [budgetEdit, setBudgetEdit] = useState(false)
  const [budgetDraft, setBudgetDraft] = useState('')

  const data = useMemo(() => loadTripExpenses(tripId), [tripId, tick])

  const persist = useCallback(
    (next: TripExpenseState) => {
      saveTripExpenses(tripId, next)
      setTick((t) => t + 1)
    },
    [tripId],
  )

  const total = useMemo(() => data.items.reduce((a, x) => a + x.amount, 0), [data.items])
  const byCat = useMemo(() => sumByCategory(data.items), [data.items])
  const budget = data.budget
  const progressPct =
    budget != null && budget > 0 ? Math.min(100, Math.round((total / budget) * 100)) : null

  const sorted = useMemo(
    () => [...data.items].sort((a, b) => b.createdAt - a.createdAt),
    [data.items],
  )
  const visibleItems = showAll ? sorted : sorted.slice(0, 8)

  function closeSheet() {
    setSheetOpen(false)
    setEditingItem(null)
    setAddForCategory(null)
  }

  function openAddForCategory(cat: ExpenseCategory) {
    setEditingItem(null)
    setAddForCategory(cat)
    setSheetOpen(true)
  }

  function onSaveExpense(payload: { title: string; amount: number; category: ExpenseCategory }) {
    const title = payload.title.trim() || '未命名'
    if (editingItem) {
      persist({
        ...data,
        items: data.items.map((i) =>
          i.id === editingItem.id
            ? { ...i, title, amount: payload.amount, category: payload.category }
            : i,
        ),
      })
    } else {
      const item: ExpenseItem = {
        id: newId(),
        title,
        amount: payload.amount,
        category: payload.category,
        createdAt: Date.now(),
      }
      persist({ ...data, items: [...data.items, item] })
    }
    closeSheet()
  }

  function onDeleteExpense(id: string) {
    if (!window.confirm('确定删除这笔支出？删除后无法恢复。')) return
    persist({
      ...data,
      items: data.items.filter((i) => i.id !== id),
    })
    closeSheet()
  }

  function onSaveBudget() {
    const n = parseFloat(budgetDraft.replace(/,/g, ''))
    if (!Number.isFinite(n) || n < 0) {
      persist({ ...data, budget: null })
    } else {
      persist({ ...data, budget: n })
    }
    setBudgetEdit(false)
  }

  if (!trip) {
    return (
      <div className="page">
        <p className="subtle">未找到该旅行配置：{tripId}</p>
        <a href={listHref()} className="subtle" style={{ marginTop: 12, display: 'inline-block' }}>
          返回行程列表
        </a>
      </div>
    )
  }

  return (
    <div className="page expensePage" data-trip-id={tripId}>
      <header className="expensePageHeader">
        <a href={tripHref(tripId)} className="expenseBackLink" aria-label="返回时间线">
          <span className="material-symbols-outlined">arrow_back</span>
        </a>
        <div className="expensePageHeaderText">
          <h1 className="expensePageTitle">{trip.title}</h1>
          <p className="expensePageSub">费用统计 · 仅保存在本机</p>
        </div>
      </header>

      <section className="expenseTitleRow" aria-label="状态">
        <h2 className="expenseTripLabel">支出概览</h2>
        <span className="expenseSyncBadge">
          <span className="material-symbols-outlined">verified</span>
          离线已同步
        </span>
      </section>

      <section className="expenseSummaryCard" aria-label="当前支出">
        <div className="expenseSummaryInner">
          <p className="expenseSummaryKicker">当前支出</p>
          <p className="expenseSummaryAmount">{formatYuan(total)}</p>
          {budget != null && budget > 0 ? (
            <div className="expenseProgressBlock">
              <div className="expenseProgressLabels">
                <span>预算进度</span>
                <span>
                  {progressPct}% / {formatYuan(budget)}
                </span>
              </div>
              <div className="expenseProgressTrack">
                <div className="expenseProgressFill" style={{ width: `${progressPct}%` }} />
              </div>
            </div>
          ) : (
            <p className="expenseBudgetHint">
              <button
                type="button"
                className="expenseLinkBtn"
                onClick={() => {
                  setBudgetDraft(budget != null ? String(budget) : '')
                  setBudgetEdit(true)
                }}
              >
                设置预算
              </button>
              后可看进度条
            </p>
          )}
        </div>
        <div className="expenseSummaryGlow" aria-hidden />
      </section>

      {budget != null && budget > 0 ? (
        <div className="expenseBudgetBar">
          <button
            type="button"
            className="expenseLinkBtn"
            onClick={() => {
              setBudgetDraft(String(budget))
              setBudgetEdit(true)
            }}
          >
            调整预算
          </button>
        </div>
      ) : null}

      {budgetEdit ? (
        <div className="expenseBudgetForm card">
          <p className="noteLabel" style={{ marginTop: 0 }}>
            <span>预算金额（元）</span>
          </p>
          <input
            className="keywordsArea"
            inputMode="decimal"
            placeholder="例如 5000"
            value={budgetDraft}
            onChange={(e) => setBudgetDraft(e.target.value)}
          />
          <div className="actionRow" style={{ marginTop: 12 }}>
            <button type="button" className="actionBtn expenseFormBtn" onClick={() => setBudgetEdit(false)}>
              取消
            </button>
            <button type="button" className="tripDetailExportBtn expenseFormSave" onClick={onSaveBudget}>
              保存
            </button>
          </div>
        </div>
      ) : null}

      <section className="expenseCategorySection" aria-label="分类汇总">
        <h3 className="expenseSectionTitle">
          <span>分类</span>
          <span className="expenseSectionTitleLine" />
        </h3>
        <p className="expenseCategoryHint subtle">点击分类卡片，填写金额即可记入该分类</p>
        <div className="expenseCategoryGrid">
          {(Object.keys(CATEGORY_META) as ExpenseCategory[]).map((cat) => {
            const m = CATEGORY_META[cat]
            return (
              <button
                key={cat}
                type="button"
                className={`${m.cellClass} expenseCatCellBtn`}
                onClick={() => openAddForCategory(cat)}
              >
                <div className={m.iconWrapClass}>
                  <span className="material-symbols-outlined">{m.icon}</span>
                </div>
                <div>
                  <p className="expenseCatLabel">{m.label}</p>
                  <p className="expenseCatAmount">{formatYuan(byCat[cat])}</p>
                </div>
              </button>
            )
          })}
        </div>
      </section>

      <section className="expenseRecentSection" aria-label="最近记录">
        <div className="expenseRecentHead">
          <h3 className="expenseSectionTitlePlain">最近记录</h3>
          {sorted.length > 8 ? (
            <button type="button" className="expenseViewAllBtn" onClick={() => setShowAll((v) => !v)}>
              {showAll ? '收起' : '查看全部'}
            </button>
          ) : null}
        </div>
        {sorted.length === 0 ? (
          <p className="subtle expenseEmpty">点击上方「餐饮 / 住宿 / 交通 / 其他」任一分类添加支出</p>
        ) : (
          <ul className="expenseRecentList">
            {visibleItems.map((it) => (
              <li key={it.id}>
                <button
                  type="button"
                  className="expenseRecentItem expenseRecentItemBtn"
                  onClick={() => {
                    setAddForCategory(null)
                    setEditingItem(it)
                    setSheetOpen(true)
                  }}
                >
                  <div className={`expenseRecentThumb ${CATEGORY_META[it.category].iconWrapClass}`}>
                    <span className="material-symbols-outlined">{CATEGORY_META[it.category].icon}</span>
                  </div>
                  <div className="expenseRecentBody">
                    <div className="expenseRecentTop">
                      <span className="expenseRecentName">{it.title}</span>
                      <span className="expenseRecentMoney">-{formatYuan(it.amount)}</span>
                    </div>
                    <div className="expenseRecentMeta">
                      <span>{formatTime(it.createdAt)}</span>
                      <span className="expenseRecentHint">
                        <span className="material-symbols-outlined">edit</span>
                        点击修改或删除
                      </span>
                    </div>
                  </div>
                  <span className="material-symbols-outlined expenseRecentChevron" aria-hidden>
                    chevron_right
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {sheetOpen ? (
        <ExpenseFormSheet
          key={editingItem?.id ?? `add-${addForCategory ?? 'x'}`}
          editingItem={editingItem}
          lockedCategory={editingItem ? null : addForCategory}
          onClose={closeSheet}
          onSave={onSaveExpense}
          onDelete={editingItem ? () => onDeleteExpense(editingItem.id) : undefined}
        />
      ) : null}
    </div>
  )
}

function ExpenseFormSheet(props: {
  editingItem: ExpenseItem | null
  /** 新增且从分类卡片进入时锁定分类；编辑时传 null */
  lockedCategory: ExpenseCategory | null
  onClose: () => void
  onSave: (p: { title: string; amount: number; category: ExpenseCategory }) => void
  onDelete?: () => void
}) {
  const { editingItem, lockedCategory, onClose, onSave, onDelete } = props
  const isEdit = editingItem != null
  const categoryLocked = !isEdit && lockedCategory != null
  const [title, setTitle] = useState('')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState<ExpenseCategory>('food')

  useEffect(() => {
    if (editingItem) {
      setTitle(editingItem.title)
      setAmount(String(editingItem.amount))
      setCategory(editingItem.category)
    } else if (lockedCategory) {
      setTitle('')
      setAmount('')
      setCategory(lockedCategory)
    } else {
      setTitle('')
      setAmount('')
      setCategory('food')
    }
  }, [editingItem, lockedCategory])

  function submit() {
    const n = parseFloat(amount.replace(/,/g, ''))
    if (!Number.isFinite(n) || n <= 0) return
    const cat = categoryLocked && lc ? lc : category
    const name = title.trim() || CATEGORY_META[cat].label
    onSave({ title: name, amount: n, category: cat })
  }

  const lc = lockedCategory
  const sheetTitle = isEdit ? '编辑支出' : lc ? `添加${CATEGORY_META[lc].label}支出` : '记一笔'

  return (
    <div
      className="expenseSheetRoot"
      role="dialog"
      aria-modal="true"
      aria-label={isEdit ? '编辑支出' : '添加支出'}
    >
      <button type="button" className="expenseSheetBackdrop" aria-label="关闭" onClick={onClose} />
      <div className="expenseSheet">
        <div className="expenseSheetHandle" />
        <h3 className="expenseSheetTitle">{sheetTitle}</h3>
        {categoryLocked && lc ? (
          <div className="expenseLockedCat">
            <div className={CATEGORY_META[lc].iconWrapClass}>
              <span className="material-symbols-outlined">{CATEGORY_META[lc].icon}</span>
            </div>
            <span className="expenseLockedCatLabel">记入「{CATEGORY_META[lc].label}」</span>
          </div>
        ) : null}
        <label className="expenseFieldLabel">名称（可选）</label>
        <input
          className="keywordsArea"
          placeholder={categoryLocked ? `默认「${CATEGORY_META[category].label}」` : '例如：海鲜大排档'}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <label className="expenseFieldLabel">金额（元）</label>
        <input
          className="keywordsArea"
          inputMode="decimal"
          placeholder="输入金额"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          autoFocus
        />
        {!categoryLocked ? (
          <>
            <p className="expenseFieldLabel">分类</p>
            <div className="expenseCatPickRow">
              {(Object.keys(CATEGORY_META) as ExpenseCategory[]).map((cat) => {
                const m = CATEGORY_META[cat]
                const on = category === cat
                return (
                  <button
                    key={cat}
                    type="button"
                    className={`expenseCatPick ${on ? 'expenseCatPick--on' : ''}`}
                    onClick={() => setCategory(cat)}
                  >
                    <span className="material-symbols-outlined">{m.icon}</span>
                    {m.label}
                  </button>
                )
              })}
            </div>
          </>
        ) : null}
        <button type="button" className="tripDetailExportBtn expenseSheetSubmit" onClick={submit}>
          {isEdit ? '保存修改' : '保存'}
        </button>
        {onDelete ? (
          <button type="button" className="expenseSheetDelete" onClick={onDelete}>
            <span className="material-symbols-outlined">delete</span>
            删除本条
          </button>
        ) : null}
      </div>
    </div>
  )
}
