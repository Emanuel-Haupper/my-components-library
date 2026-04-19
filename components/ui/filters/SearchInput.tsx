import { Search, X } from 'lucide-react'
import { CustomButton } from '../CustomButton'
import '../../css/search-input.css'

export type SearchInputProps = {
    value: string
    onChange: (value: string) => void
    placeholder?: string
    className?: string
}

export function SearchInput({ value, onChange, placeholder = 'Search…', className = '' }: SearchInputProps) {
    return (
        <div className={`mc-search${className ? ` ${className}` : ''}`}>
            <Search size={14} className="mc-search__icon" />
            <input
                className="mc-search__input"
                type="text"
                placeholder={placeholder}
                value={value}
                onChange={e => onChange(e.target.value)}
            />
            {value && (
                <CustomButton
                    className="mc-search__clear"
                    type="button"
                    aria-label="Clear search"
                    onClick={() => onChange('')}
                    icon={<X size={13} />}
                />
            )}
        </div>
    )
}
