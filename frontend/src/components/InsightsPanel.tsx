import { type SimulationResult, type BaselineMetrics } from '../types/simulation'
import { formatCurrency, formatPercent } from '../utils/formatters'

interface Props {
  result: SimulationResult | null
  metrics: BaselineMetrics | null
}

export default function InsightsPanel({ result, metrics }: Props) {
  if (!metrics) return null

  const isPositive = result ? result.impact.percentage >= 0 : true

  return (
    <div className="p-5 flex flex-col gap-5">

      <div>
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">Baseline Metrics</p>
        <div className="flex flex-col gap-2">
          <Row label="Avg Sales Cycle" value={`${Math.round(metrics.avgSalesCycleDays)} days`} />
          {(Object.entries(metrics.byRegion) as [string, { conversionRate: number }][]).map(([region, m]) => (
            <Row
              key={region}
              label={`${region} Conversion`}
              value={formatPercent(m.conversionRate * 100)}
            />
          ))}
        </div>
      </div>

      {result && (
        <div>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">Revenue Outcome</p>
          <div className="flex flex-col gap-2">
            <Row label="Baseline" value={formatCurrency(result.baseline.totalRevenue)} />
            <Row label="Projected" value={formatCurrency(result.scenario.totalRevenue)} highlight />
            <Row
              label="Impact"
              value={`${formatCurrency(result.impact.absolute)} (${formatPercent(result.impact.percentage)})`}
              color={isPositive ? 'text-green-600' : 'text-red-500'}
            />
          </div>
        </div>
      )}

      {result && result.drivers.length > 0 && (
        <div>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">What Changed</p>
          <ul className="flex flex-col gap-2">
            {result.drivers.map((d, i) => (
              <li key={i} className="text-xs text-gray-600 leading-relaxed pl-3 border-l-2 border-blue-400">
                {d}
              </li>
            ))}
          </ul>
        </div>
      )}

      {!result && (
        <p className="text-xs text-gray-400 italic">
          Adjust the sliders above and run a simulation to see projected outcomes.
        </p>
      )}
    </div>
  )
}

function Row({ label, value, highlight, color }: {
  label: string
  value: string
  highlight?: boolean
  color?: string
}) {
  return (
    <div className={`flex justify-between items-center text-sm ${highlight ? 'font-medium' : ''}`}>
      <span className="text-gray-500">{label}</span>
      <span className={`font-mono tabular-nums ${color ?? 'text-gray-800'}`}>{value}</span>
    </div>
  )
}
