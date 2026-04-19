import type { ReactNode } from 'react'
import '../css/topbar.css'

export type NavItem = {
    id: string
    label: string
    icon?: ReactNode
}

export type TopbarProps = {
    appName: string
    appNameClassName?: string
    color?: string
    currentItem: string
    items: NavItem[]
    logo?: ReactNode
    onNavigate: (id: string) => void
}

const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

export function Topbar({ appName, appNameClassName, logo, items, currentItem, onNavigate, color }: TopbarProps) {
    return (
        <header className="topbar" style={color ? { background: color } : undefined}>
            <button
                className="topbar__brand"
                onClick={() => { onNavigate(items[0]?.id ?? ''); scrollToTop() }}
            >
                {logo && <span className="topbar__brand-icon">{logo}</span>}
                <span className={appNameClassName}>{appName}</span>
            </button>
            <nav className="topbar__nav">
                {items.map(item => (
                    <button
                        key={item.id}
                        className={`topbar__link${currentItem === item.id ? ' topbar__link--active' : ''}`}
                        onClick={() => { onNavigate(item.id); scrollToTop() }}
                    >
                        {item.icon}
                        {item.label}
                    </button>
                ))}
            </nav>
        </header>
    )
}
