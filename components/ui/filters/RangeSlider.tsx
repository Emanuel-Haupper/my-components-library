import '../../css/range-slider.css'

export type RangeSliderProps = {
    min: number
    max: number
    valueMin: number
    valueMax: number
    onChange: (min: number, max: number) => void
}

function decimalPlaces(value: number) {
    const text = String(value)
    if (!text.includes('.')) return 0
    return text.split('.')[1]?.length ?? 0
}

function inferStep(min: number, max: number) {
    const precision = Math.max(decimalPlaces(min), decimalPlaces(max))
    return precision > 0 ? 1 / 10 ** precision : 1
}

function roundToStep(value: number, step: number) {
    const precision = decimalPlaces(step)
    return Number(value.toFixed(precision))
}

export function RangeSlider({ min, max, valueMin, valueMax, onChange }: RangeSliderProps) {
    const step = inferStep(min, max)
    const span = max - min || 1
    const leftPct = (valueMin - min) / span * 100
    const rightPct = 100 - (valueMax - min) / span * 100
    const minGap = Math.min(step, span)

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
                step={step}
                value={valueMin}
                onChange={e => {
                    const nextValue = Number(e.target.value)
                    const clampedValue = Math.min(nextValue, valueMax - minGap)
                    onChange(roundToStep(clampedValue, step), roundToStep(valueMax, step))
                }}
            />
            <input
                className="mc-range__input"
                type="range"
                min={min}
                max={max}
                step={step}
                value={valueMax}
                onChange={e => {
                    const nextValue = Number(e.target.value)
                    const clampedValue = Math.max(nextValue, valueMin + minGap)
                    onChange(roundToStep(valueMin, step), roundToStep(clampedValue, step))
                }}
            />
            <div className="mc-range__values">
                <span className="mc-range__val">{valueMin}</span>
                <span className="mc-range__val">{valueMax}</span>
            </div>
        </div>
    )
}
