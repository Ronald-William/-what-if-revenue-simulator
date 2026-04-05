import { type SimulationParams } from '../types/simulation'
import { formatPercent, formatDays } from '../utils/formatters'

interface Props {
  params: SimulationParams
  onChange: (params: SimulationParams) => void
  onRun: () => void
  isLoading: boolean
}

interface SliderConfig {
  label: string
  key: keyof SimulationParams
  min: number
  max: number
  step: number
  format: (v: number) => string
}

const SLIDERS: SliderConfig[] = [
  {
    label: 'Conversion Rate',
    key: 'conversionRateDelta',
    min: -50, max: 50, step: 1,
    format: formatPercent
  },
  {
    label: 'Average Deal Size',
    key: 'avgDealSizeDelta',
    min: -50, max: 50, step: 1,
    format: formatPercent,
  },
  {
    label: 'Sales Cycle',
    key: 'salesCycleDelta',
    min: -30, max: 30, step: 1,
    format: formatDays,
  }
]

export default function SimulationPanel({ params, onChange, onRun, isLoading }: Props) {
  return (
    <div className="p-5 border-b border-gray-200">
      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-4">Controls</p>

      <div className="flex flex-col gap-5">
        {SLIDERS.map(slider => {
          const value = params[slider.key]
          const isPos = value > 0
          const isNeg = value < 0
          return (
            <div key={slider.key}>
              
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-gray-700">{slider.label}</span>
                <span className={`text-sm font-mono font-medium tabular-nums ${isPos ? 'text-green-600' : isNeg ? 'text-red-500' : 'text-gray-400'}`}>
                  {slider.format(value)}
                </span>
              </div>

              <input
                type="range"
                min={slider.min}
                max={slider.max}
                step={slider.step}
                value={value}
                onChange={e => onChange({ ...params, [slider.key]: Number(e.target.value) })}
                className="w-full h-1 accent-green-500 cursor-pointer"
              />

             
              <div className="flex justify-between mt-1 text-[10px] text-gray-400 font-mono">
                <span>{slider.format(slider.min)}</span>
                <span>{slider.format(slider.max)}</span>
              </div>
            </div>
          )
        })}
      </div>

      <button
        onClick={onRun}
        disabled={isLoading}
        className="mt-5 w-full py-2 text-sm font-medium bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? 'Running...' : 'Run Simulation'}
      </button>
    </div>
  )
}
