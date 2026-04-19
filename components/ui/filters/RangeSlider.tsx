import '../../css/range-slider.css'

export type RangeSliderProps = {
    min: number
    max: number
    valueMin: number
    valueMax: number
    onChange: (min: number, max: number) => void
}

export function RangeSlider({ min, max, valueMin, valueMax, onChange }: RangeSliderProps) {
    const span = max - min || 1
    const leftPct = (valueMin - min) / span * 100
    const rightPct = 100 - (valueMax - min) / span * 100

    return (
        <div className="mc-range">
            <div className="mc-range__track-bg">
                <div className="mc-range__track-fill" style={{ left: `${leftPct}%`, right: `${rightPct}%` }} />
            </div>
            <input
                className="mc-range__input"
                type="range"
                min={min}
                max={max}
                value={valueMin}
                onChange={e => {
                    const v = Math.min(Number(e.target.value), valueMax - 1)
                    onChange(v, valueMax)
                }}
            />
            <input
                className="mc-range__input"
                type="range"
                min={min}
                max={max}
                value={valueMax}
                onChange={e => {
                    const v = Math.max(Number(e.target.value), valueMin + 1)
                    onChange(valueMin, v)
                }}
            />
            <div className="mc-range__values">
                <span className="mc-range__val">{valueMin}</span>
                <span className="mc-range__val">{valueMax}</span>
            </div>
        </div>
    )
}
