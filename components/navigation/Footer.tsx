import '../css/footer.css'

export type FooterProps = {
    appName?: string
    notes?: string[]
}

export function Footer({ appName, notes = [] }: FooterProps) {
    const items = [
        appName ? `© ${new Date().getFullYear()} ${appName}` : null,
        ...notes,
    ].filter(Boolean) as string[]

    return (
        <footer className="mc-footer">
            <div className="mc-footer__inner">
                {items.map((item, i) => (
                    <span key={i} className="mc-footer__wrap">
                        {i > 0 && <span className="mc-footer__sep">·</span>}
                        {i === 0 && appName ? (
                            <span className="mc-footer__copy">{item}</span>
                        ) : (
                            <span className="mc-footer__note">{item}</span>
                        )}
                    </span>
                ))}
            </div>
        </footer>
    )
}
