import { useState, useMemo } from 'react'
import { ArrowUp, ArrowDown, ArrowUpDown, ChevronLeft, ChevronRight, Search, SlidersHorizontal, X } from 'lucide-react'
import './DataTable.css'

const ROWS_PER_PAGE = 10

export type FilterDef = {
    key: string
    label: string
    type: 'text' | 'select' | 'range'
    options?: string[]
    min?: number
    max?: number
}

type DataTableProps = {
    data: Array<Record<string, any>>
    columns: Array<{
        key: string
        label: string
        render?: (value: any, row: Record<string, any>) => React.ReactNode
        minWidth?: string
    }>
    filterKey?: string
    filters?: FilterDef[]
}

type FilterValue = string | { min: string; max: string }

export function DataTable({ data = [], columns = [], filterKey, filters }: DataTableProps) {
    const [query, setQuery] = useState('')
    const [sortKey, setSortKey] = useState<string | null>(null)
    const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')
    const [page, setPage] = useState(1)
    const [panelOpen, setPanelOpen] = useState(false)
    const [pendingFilters, setPendingFilters] = useState<Record<string, FilterValue>>({})
    const [appliedFilters, setAppliedFilters] = useState<Record<string, FilterValue>>({})

    const dataRanges = useMemo(() => {
        const ranges: Record<string, { min: number; max: number }> = {}
        if (!filters) return ranges
        for (const f of filters) {
            if (f.type !== 'range') continue
            const vals = data.map(row => Number(row[f.key])).filter(v => !isNaN(v))
            if (vals.length === 0) { ranges[f.key] = { min: f.min ?? 0, max: f.max ?? 100 }; continue }
            ranges[f.key] = { min: f.min ?? Math.min(...vals), max: f.max ?? Math.max(...vals) }
        }
        return ranges
    }, [data, filters])

    const activeCount = useMemo(() => {
        return Object.entries(appliedFilters).filter(([key, v]) => {
            if (typeof v === 'object') {
                if (v.min === '' && v.max === '') return false
                const range = dataRanges[key]
                if (!range) return v.min !== '' || v.max !== ''
                return Number(v.min) !== range.min || Number(v.max) !== range.max
            }
            return Boolean(v)
        }).length
    }, [appliedFilters, dataRanges])

    function handleSort(key: string) {
        if (sortKey !== key) {
            setSortKey(key)
            setSortDir('asc')
        } else if (sortDir === 'asc') {
            setSortDir('desc')
        } else {
            setSortKey(null)
        }
        setPage(1)
    }

    function openPanel() {
        setPendingFilters({ ...appliedFilters })
        setPanelOpen(true)
    }

    function applyFilters() {
        setAppliedFilters({ ...pendingFilters })
        setPage(1)
        setPanelOpen(false)
    }

    function clearFilters() {
        setPendingFilters({})
        setAppliedFilters({})
        setPage(1)
    }

    function setPending(key: string, value: FilterValue) {
        setPendingFilters(prev => ({ ...prev, [key]: value }))
    }

    const filtered = useMemo(() => {
        let result = data
        if (query && filterKey) {
            result = result.filter(row =>
                String(row[filterKey]).toLowerCase().includes(query.toLowerCase())
            )
        }
        for (const [key, value] of Object.entries(appliedFilters)) {
            if (!value) continue
            if (typeof value === 'object') {
                const { min, max } = value
                if (min === '' && max === '') continue
                result = result.filter(row => {
                    const val = Number(row[key])
                    if (min !== '' && val < Number(min)) return false
                    if (max !== '' && val > Number(max)) return false
                    return true
                })
            } else {
                result = result.filter(row =>
                    String(row[key]).toLowerCase().includes(value.toLowerCase())
                )
            }
        }
        return result
    }, [data, query, filterKey, appliedFilters])

    const sorted = useMemo(() => {
        if (!sortKey) return filtered
        return [...filtered].sort((a, b) => {
            const av = a[sortKey], bv = b[sortKey]
            if (av == null) return 1
            if (bv == null) return -1
            const cmp = typeof av === 'number' && typeof bv === 'number'
                ? av - bv
                : String(av).localeCompare(String(bv))
            return sortDir === 'asc' ? cmp : -cmp
        })
    }, [filtered, sortKey, sortDir])

    const totalPages = Math.max(1, Math.ceil(sorted.length / ROWS_PER_PAGE))
    const paginated = sorted.slice((page - 1) * ROWS_PER_PAGE, page * ROWS_PER_PAGE)

    function sortIcon(key: string) {
        if (sortKey !== key) return <ArrowUpDown size={13} className="dt-sort-icon dt-sort-icon--inactive" />
        return sortDir === 'asc'
            ? <ArrowUp size={13} className="dt-sort-icon" />
            : <ArrowDown size={13} className="dt-sort-icon" />
    }

    return (
        <div className="dt-wrapper">
            {(filterKey || filters) && (
                <div className="dt-toolbar">
                    {filterKey && (
                        <div className="dt-search-wrap">
                            <Search size={14} className="dt-search-icon" />
                            <input
                                className="dt-search"
                                type="text"
                                placeholder="Filter..."
                                value={query}
                                onChange={e => { setQuery(e.target.value); setPage(1) }}
                            />
                        </div>
                    )}
                    <div className="dt-toolbar-right">
                        <span className="dt-count">{sorted.length} result{sorted.length !== 1 ? 's' : ''}</span>
                        {filters && (
                            <button
                                className={`dt-filter-btn${activeCount > 0 ? ' dt-filter-btn--active' : ''}`}
                                onClick={openPanel}
                                type="button"
                            >
                                <SlidersHorizontal size={14} />
                                Filters
                                {activeCount > 0 && <span className="dt-filter-badge">{activeCount}</span>}
                            </button>
                        )}
                    </div>
                </div>
            )}

            <div className="dt-scroll">
                <table className="dt-table">
                    <thead>
                        <tr>
                            {columns.map(col => (
                                <th
                                    key={col.key}
                                    onClick={() => handleSort(col.key)}
                                    className={`dt-th${sortKey === col.key ? ' dt-th--sorted' : ''}`}
                                    style={col.minWidth ? { minWidth: col.minWidth } : undefined}
                                >
                                    <span className="dt-th-inner">
                                        {col.label}
                                        {sortIcon(col.key)}
                                    </span>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {paginated.length === 0 ? (
                            <tr>
                                <td colSpan={columns.length} className="dt-empty">
                                    No results found.
                                </td>
                            </tr>
                        ) : paginated.map((row, i) => (
                            <tr key={i} className="dt-row">
                                {columns.map(col => (
                                    <td
                                        key={col.key}
                                        className="dt-td"
                                        style={col.minWidth ? { minWidth: col.minWidth } : undefined}
                                    >
                                        {col.render ? col.render(row[col.key], row) : row[col.key]}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {totalPages > 1 && (
                <div className="dt-pagination">
                    <button
                        className="dt-page-btn"
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                        aria-label="Previous page"
                    >
                        <ChevronLeft size={16} />
                    </button>
                    <span className="dt-page-info">
                        Page {page} of {totalPages}
                    </span>
                    <button
                        className="dt-page-btn"
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        aria-label="Next page"
                    >
                        <ChevronRight size={16} />
                    </button>
                </div>
            )}

            {filters && (
                <>
                    <div
                        className={`dt-panel-backdrop${panelOpen ? ' dt-panel-backdrop--open' : ''}`}
                        onClick={() => setPanelOpen(false)}
                    />
                    <aside className={`dt-filter-panel${panelOpen ? ' dt-filter-panel--open' : ''}`}>
                        <div className="dt-filter-panel__header">
                            <h3 className="dt-filter-panel__title">Filters</h3>
                            <button
                                className="dt-filter-panel__close"
                                onClick={() => setPanelOpen(false)}
                                type="button"
                                aria-label="Close filters"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        <div className="dt-filter-panel__body">
                            {filters.map(f => (
                                <div key={f.key} className="dt-filter-field">
                                    <label className="dt-filter-label">{f.label}</label>
                                    {f.type === 'select' ? (
                                        <select
                                            className="dt-filter-select"
                                            value={(pendingFilters[f.key] as string) ?? ''}
                                            onChange={e => setPending(f.key, e.target.value)}
                                        >
                                            <option value="">All</option>
                                            {f.options?.map(opt => (
                                                <option key={opt} value={opt}>{opt}</option>
                                            ))}
                                        </select>
                                    ) : f.type === 'range' ? (() => {
                                        const dataRange = dataRanges[f.key] ?? { min: 0, max: 100 }
                                        const rawVal = pendingFilters[f.key] as { min: string; max: string } | undefined
                                        const curMin = rawVal?.min !== undefined && rawVal.min !== '' ? Number(rawVal.min) : dataRange.min
                                        const curMax = rawVal?.max !== undefined && rawVal.max !== '' ? Number(rawVal.max) : dataRange.max
                                        const span = dataRange.max - dataRange.min || 1
                                        const leftPct = (curMin - dataRange.min) / span * 100
                                        const rightPct = 100 - (curMax - dataRange.min) / span * 100
                                        return (
                                            <div className="dt-range-slider">
                                                <div className="dt-range-track-bg">
                                                    <div className="dt-range-track-fill" style={{ left: `${leftPct}%`, right: `${rightPct}%` }} />
                                                </div>
                                                <input
                                                    className="dt-range-input"
                                                    type="range"
                                                    min={dataRange.min}
                                                    max={dataRange.max}
                                                    value={curMin}
                                                    onChange={e => {
                                                        const v = Math.min(Number(e.target.value), curMax - 1)
                                                        setPending(f.key, { min: String(v), max: String(curMax) })
                                                    }}
                                                />
                                                <input
                                                    className="dt-range-input"
                                                    type="range"
                                                    min={dataRange.min}
                                                    max={dataRange.max}
                                                    value={curMax}
                                                    onChange={e => {
                                                        const v = Math.max(Number(e.target.value), curMin + 1)
                                                        setPending(f.key, { min: String(curMin), max: String(v) })
                                                    }}
                                                />
                                                <div className="dt-range-values">
                                                    <span className="dt-range-val">{curMin}</span>
                                                    <span className="dt-range-val">{curMax}</span>
                                                </div>
                                            </div>
                                        )
                                    })() : (
                                        <input
                                            className="dt-filter-input"
                                            type="text"
                                            placeholder={`Search ${f.label.toLowerCase()}…`}
                                            value={(pendingFilters[f.key] as string) ?? ''}
                                            onChange={e => setPending(f.key, e.target.value)}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="dt-filter-panel__footer">
                            <button className="dt-filter-clear" onClick={clearFilters} type="button">
                                Clear all
                            </button>
                            <button className="dt-filter-apply" onClick={applyFilters} type="button">
                                Apply
                            </button>
                        </div>
                    </aside>
                </>
            )}
        </div>
    )
}