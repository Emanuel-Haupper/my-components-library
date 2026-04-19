import { X } from "lucide-react"
import { CustomButton } from "../CustomButton"
import type { FilterDef } from "../DataTable"
import { RangeSlider } from "./RangeSlider"

export type FilterValue = string | { min: string; max: string }

export type FilterPanelProps = {
    open: boolean
    onClose: () => void
    filters: FilterDef[]
    pendingFilters: Record<string, FilterValue>
    setPending: (key: string, value: FilterValue) => void
    dataRanges: Record<string, { min: number; max: number }>
    selectOptions: Record<string, string[]>
    onClear: () => void
    onApply: () => void
}

export function FilterPanel({ open, onClose, filters, pendingFilters, setPending, dataRanges, selectOptions, onClear, onApply }: FilterPanelProps) {
    return (
        <>
            <div
                className={`dt-panel-backdrop${open ? ' dt-panel-backdrop--open' : ''}`}
                onClick={onClose}
            />
            <aside className={`dt-filter-panel${open ? ' dt-filter-panel--open' : ''}`}>
                <div className="dt-filter-panel__header">
                    <h3 className="dt-filter-panel__title">Filters</h3>
                    <CustomButton icon={<X size={16} />} variant="ghost" onClick={onClose} aria-label="Close filters" />
                </div>

                <div className="dt-filter-panel__body">
                    {filters.map(f => (
                        <div key={f.key} className="dt-filter-field">
                            <label className="dt-filter-label">{f.label}</label>
                            {f.type === 'select' ? (
                                <div className="dt-select-wrap">
                                    <select
                                        className="dt-filter-select"
                                        value={(pendingFilters[f.key] as string) ?? ''}
                                        onChange={e => { setPending(f.key, e.target.value); e.target.blur() }}
                                    >
                                        <option value="">All</option>
                                        {(selectOptions[f.key] ?? []).map(opt => (
                                            <option key={opt} value={opt}>{opt}</option>
                                        ))}
                                    </select>
                                </div>
                            ) : f.type === 'range' ? (() => {
                                const dataRange = dataRanges[f.key] ?? { min: 0, max: 100 }
                                const rawVal = pendingFilters[f.key] as { min: string; max: string } | undefined
                                const curMin = rawVal?.min !== undefined && rawVal.min !== '' ? Number(rawVal.min) : dataRange.min
                                const curMax = rawVal?.max !== undefined && rawVal.max !== '' ? Number(rawVal.max) : dataRange.max
                                return (
                                    <RangeSlider
                                        min={dataRange.min}
                                        max={dataRange.max}
                                        valueMin={curMin}
                                        valueMax={curMax}
                                        onChange={(min, max) => setPending(f.key, { min: String(min), max: String(max) })}
                                    />
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
                    <CustomButton variant="outline" onClick={onClear}>Clear all</CustomButton>
                    <CustomButton variant="primary" onClick={onApply}>Apply</CustomButton>
                </div>
            </aside>
        </>
    )
}