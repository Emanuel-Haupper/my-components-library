import { useState, useMemo } from 'react'
import { ArrowUp, ArrowDown, ArrowUpDown, ChevronLeft, ChevronRight, SlidersHorizontal } from 'lucide-react'
import { CustomButton } from './CustomButton.tsx'
import { SearchInput } from './filters/SearchInput.tsx'
import '../css/data-table.css'
import { FilterPanel, type FilterValue } from '../index.ts'

const ROWS_PER_PAGE = 10

export type FilterDef = {
    key: string
    label: string
    type: 'text' | 'select' | 'range'
    /** select: derived from data if omitted */
    options?: string[]
    /** range: derived from data if omitted */
    min?: number
    max?: number
}

export type DataTableProps = {
    data: Array<Record<string, any>>
    columns: Array<{
        key: string
        label: string
        render?: (value: any, row: Record<string, any>) => React.ReactNode
        minWidth?: string
    }>
    filterKey?: string
    filters?: FilterDef[]
    onRowClick?: (row: Record<string, any>) => void
}

export function DataTable({ data = [], columns = [], filterKey, filters, onRowClick }: DataTableProps) {
    const [query, setQuery] = useState('')
    const [sortKey, setSortKey] = useState<string | null>(null)
    const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')
    const [page, setPage] = useState(1)
    const [panelOpen, setPanelOpen] = useState(false)
    const [pendingFilters, setPendingFilters] = useState<Record<string, FilterValue>>({})
    const [appliedFilters, setAppliedFilters] = useState<Record<string, FilterValue>>({})

    // Derive select options from data (or use provided options)
    const selectOptions = useMemo(() => {
        const opts: Record<string, string[]> = {}
        if (!filters) return opts
        for (const f of filters) {
            if (f.type !== 'select') continue
            opts[f.key] = f.options ?? Array.from(new Set(data.map(row => String(row[f.key])).filter(Boolean))).sort()
        }
        return opts
    }, [data, filters])

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
        if (sortKey !== key) { setSortKey(key); setSortDir('asc') }
        else if (sortDir === 'asc') setSortDir('desc')
        else setSortKey(null)
        setPage(1)
    }

    function openPanel() { setPendingFilters({ ...appliedFilters }); setPanelOpen(true) }
    function applyFilters() { setAppliedFilters({ ...pendingFilters }); setPage(1); setPanelOpen(false) }
    function clearFilters() { setPendingFilters({}); setAppliedFilters({}); setPage(1) }
    function setPending(key: string, value: FilterValue) { setPendingFilters(prev => ({ ...prev, [key]: value })) }

    const filtered = useMemo(() => {
        let result = data
        if (query && filterKey) {
            result = result.filter(row => String(row[filterKey]).toLowerCase().includes(query.toLowerCase()))
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
                result = result.filter(row => String(row[key]).toLowerCase().includes(value.toLowerCase()))
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
                        <SearchInput
                            value={query}
                            onChange={v => { setQuery(v); setPage(1) }}
                            placeholder="Search…"
                        />
                    )}
                    <div className="dt-toolbar-right">
                        <span className="dt-count">{sorted.length} result{sorted.length !== 1 ? 's' : ''}</span>
                        {filters && (
                            <CustomButton
                                variant="outline"
                                icon={<SlidersHorizontal size={14} />}
                                active={activeCount > 0}
                                badge={activeCount > 0 ? <span className="dt-filter-badge">{activeCount}</span> : undefined}
                                onClick={openPanel}
                            >
                                Filters
                            </CustomButton>
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
                                <td colSpan={columns.length} className="dt-empty">No results found.</td>
                            </tr>
                        ) : paginated.map((row, i) => (
                            <tr
                                key={i}
                                className={`dt-row${onRowClick ? ' dt-row--clickable' : ''}`}
                                onClick={() => onRowClick?.(row)}
                            >
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
                    <CustomButton
                        icon={<ChevronLeft size={16} />}
                        variant="outline"
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                        aria-label="Previous page"
                    />
                    <span className="dt-page-info">Page {page} of {totalPages}</span>
                    <CustomButton
                        icon={<ChevronRight size={16} />}
                        variant="outline"
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        aria-label="Next page"
                    />
                </div>
            )}

            {filters && (
                <FilterPanel
                    open={panelOpen}
                    onClose={() => setPanelOpen(false)}
                    filters={filters}
                    pendingFilters={pendingFilters}
                    setPending={setPending}
                    dataRanges={dataRanges}
                    selectOptions={selectOptions}
                    onClear={clearFilters}
                    onApply={applyFilters}
                />
            )}
        </div>
    )
}

