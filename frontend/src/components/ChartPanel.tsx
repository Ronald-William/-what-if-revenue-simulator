import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from 'recharts'
import { type SimulationResult } from '../types/simulation'
import { weekLabel, formatCurrency } from '../utils/formatters'

interface Props {
  baseline: number[] | null
  result: SimulationResult | null
}

export default function ChartPanel({ baseline, result }: Props) {
  if (!baseline) {
    return (
      <div className="flex-1 flex items-center justify-center text-sm text-gray-400">
        Loading...
      </div>
    )
  }

  const chartData = baseline.map((value, i) => {
    const point: Record<string, number | string> = {
      week: weekLabel(i),
      Baseline: Math.round(value)
    }
    if (result) {
      point['Simulated'] = Math.round(result.scenario.weeklyRevenue[i])
    }
    return point
  })

  return (
    <div className="flex flex-col h-full">
      <div className="mb-4">
        <h2 className="text-sm font-medium text-gray-800">Q3 Weekly Revenue Projection</h2>
        <p className="text-xs text-gray-400 mt-0.5">
          {result
            ? 'Showing baseline vs simulated scenario'
            : 'Showing baseline — run a simulation to compare'}
        </p>
      </div>

      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="week"
              tick={{ fill: '#9ca3af', fontSize: 11 }}
              tickLine={false}
              interval={1}
            />
            <YAxis
              tickFormatter={(v: number) => formatCurrency(v)}
              tick={{ fill: '#9ca3af', fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              width={60}
            />
            <Tooltip
              formatter={(value) => [formatCurrency(Number(value))]}
              contentStyle={{
                background: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: 4,
                fontSize: 12
              }}
              labelStyle={{ color: '#6b7280', marginBottom: 4 }}
            />
            <Legend
              wrapperStyle={{ fontSize: 12, paddingTop: 12 }}
            />

            <Line
              type="monotone"
              dataKey="Baseline"
              stroke="#9ca3af"
              strokeWidth={1.5}
              strokeDasharray="5 4"
              dot={false}
            />

           
            {result && (
              <Line
                type="monotone"
                dataKey="Simulated"
                stroke="#2563eb"
                strokeWidth={2}
                dot={false}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
