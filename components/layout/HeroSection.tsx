import type { ReactNode } from 'react'
import '../css/hero-section.css'

export type HeroSectionProps = {
    title: string
    eyebrow?: string
    tagline?: string
    background?: ReactNode
    titleClassName?: string
}

export function HeroSection({ title, eyebrow, tagline, background, titleClassName }: HeroSectionProps) {
    return (
        <>
            {background && <div className="mc-hero__background">{background}</div>}
            <section className="mc-hero">
                <div className="mc-hero__content">
                    {eyebrow && <p className="mc-hero__eyebrow">{eyebrow}</p>}
                    <h1 className={`mc-hero__title ${titleClassName || ''}`}>{title}</h1>
                    {tagline && <p className="mc-hero__tagline">{tagline}</p>}
                </div>
            </section>
        </>
    )
}
