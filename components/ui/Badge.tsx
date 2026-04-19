import '../css/badge.css'

type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'default'

export type BadgeProps = {
    label: string
    variant?: BadgeVariant
}

export function Badge({ label, variant = 'default' }: BadgeProps) {
    return <span className={`badge badge--${variant}`}>{label}</span>
}
