import type { ReactNode } from 'react'
import { CustomButton } from '../ui/CustomButton.tsx'
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

const scrollToTop = () => {
    const scrollContainer = document.querySelector<HTMLElement>('.app-content')

    if (scrollContainer) {
        scrollContainer.scrollTo({ top: 0, behavior: 'smooth' })
        return
    }

    window.scrollTo({ top: 0, behavior: 'smooth' })
}

export function Topbar({ appName, appNameClassName, logo, items, currentItem, onNavigate, color }: TopbarProps) {
    const navigateAndScroll = (id: string) => {
        onNavigate(id)
        requestAnimationFrame(scrollToTop)
    }

    return (
        <header className="topbar" style={color ? { background: color } : undefined}>
            <CustomButton
                className="topbar__brand"
                variant="none"
                icon={logo ? <span className="topbar__brand-icon">{logo}</span> : undefined}
                onClick={() => navigateAndScroll(items[0]?.id ?? '')}
            >
                <span className={appNameClassName}>{appName}</span>
            </CustomButton>
            <nav className="topbar__nav">
                {items.map(item => (
                    <CustomButton
                        key={item.id}
                        className={`topbar__link${currentItem === item.id ? ' topbar__link--active' : ''}`}
                        variant="ghost"
                        icon={item.icon}
                        onClick={() => navigateAndScroll(item.id)}
                    >
                        {item.label}
                    </CustomButton>
                ))}
            </nav>
        </header>
    )
}
