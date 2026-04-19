import type { MouseEventHandler, ReactNode } from 'react'
import '../css/button.css'

export type CustomButtonProps = {
    /** Leading icon */
    icon?: ReactNode
    /** Trailing icon */
    iconRight?: ReactNode
    /** Label text — omit for icon-only */
    children?: ReactNode
    onClick?: MouseEventHandler<HTMLButtonElement>
    variant?: 'primary' | 'outline' | 'ghost' | 'none'
    active?: boolean
    /** Extra node rendered after the label (e.g. a badge) */
    badge?: ReactNode
    type?: 'button' | 'submit' | 'reset'
    disabled?: boolean
    className?: string
    'aria-label'?: string
}

export function CustomButton({
    icon,
    iconRight,
    children,
    onClick,
    variant = 'outline',
    active = false,
    badge,
    type = 'button',
    disabled,
    className = '',
    'aria-label': ariaLabel,
}: CustomButtonProps) {
    const iconOnly = Boolean(icon || iconRight) && !children

    const cls = [
        'mc-btn',
        variant !== 'none' ? `mc-btn--${variant}` : '',
        iconOnly ? 'mc-btn--icon-only' : '',
        active ? 'mc-btn--active' : '',
        className,
    ].filter(Boolean).join(' ')

    return (
        <button
            className={cls}
            onClick={onClick}
            type={type}
            disabled={disabled}
            aria-label={ariaLabel}
        >
            {icon && <span className="mc-btn__icon">{icon}</span>}
            {children && <span className="mc-btn__label">{children}</span>}
            {badge}
            {iconRight && <span className="mc-btn__icon-right">{iconRight}</span>}
        </button>
    )
}
