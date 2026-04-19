import type { ReactNode } from 'react'
import '../css/content.css'

export type ContentProps = {
    children: ReactNode
    maxWidth?: string
    className?: string
}

export function Content({ children, maxWidth, className = '' }: ContentProps) {
    return (
        <div className="mc-content">
            <div
                className={`mc-content__inner ${className}`.trim()}
                style={maxWidth ? { '--mc-content-max-width': maxWidth } as React.CSSProperties : undefined}
            >
                {children}
            </div>
        </div>
    )
}
