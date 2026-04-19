import BorderGlow from './BorderGlow'
import '../css/stat-card.css'

export type StatCardProps = {
    label: string
    value: string | number
    icon: React.ReactNode
    accent?: string
    index?: number
}

export function StatCard({ label, value, icon, accent = '#a78bfa', index = 0 }: StatCardProps) {
    return (
        <div className="staggered-card-entry" style={{ '--card-index': index } as React.CSSProperties}>
            <BorderGlow
                edgeSensitivity={35}
                glowColor="260 75 72"
                backgroundColor="rgba(22, 27, 34)"
                borderRadius={8}
                glowRadius={12}
                glowIntensity={0.7}
                coneSpread={25}
                colors={[accent, '#a78bfa', '#60a5fa']}
                className="stat-card-glow"
            >
                <div className="stat-card" style={{ '--stat-accent': accent } as React.CSSProperties}>
                    <span className="stat-card__icon" style={{ color: accent }}>
                        {icon}
                    </span>
                    <div>
                        <p className="stat-card__value">{value}</p>
                        <p className="stat-card__label">{label}</p>
                    </div>
                </div>
            </BorderGlow>
        </div>
    )
}
