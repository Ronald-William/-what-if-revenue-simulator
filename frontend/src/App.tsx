import { useEffect, useState } from 'react'
import SimulationPanel from './components/SimulationPanel'
import ChartPanel from './components/ChartPanel'
import InsightsPanel from './components/InsightsPanel'
import { fetchBaseline, runSimulation } from './utils/api'
import { type SimulationParams, type SimulationResult, type BaselineMetrics } from './types/simulation'

const DEFAULT_PARAMS: SimulationParams = {
  conversionRateDelta: 0,
  avgDealSizeDelta: 0,
  salesCycleDelta: 0
}

export default function App() {
  const [metrics, setMetrics] = useState<BaselineMetrics | null>(null)
  const [baseline, setBaseline] = useState<number[] | null>(null)
  const [params, setParams] = useState<SimulationParams>(DEFAULT_PARAMS)
  const [result, setResult] = useState<SimulationResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchBaseline()
      .then(data => {
        setMetrics(data.metrics)
        setBaseline(data.baseline.weeklyRevenue)
      })
      .catch(() => setError('Could not connect to backend.'))
  }, [])

  async function handleRun() {
    setIsLoading(true)
    setError(null)
    try {
      const res = await runSimulation(params)
      setResult(res)
    } catch {
      setError('Simulation failed. Check backend.')
    } finally {
      setIsLoading(false)
    }
  }

  function handleReset() {
    setParams(DEFAULT_PARAMS)
    setResult(null)
  }

  return (
    <div className="min-h-screen bg-white text-gray-800">

      {/* Header */}
      <header className="border-b border-gray-200 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-base font-semibold text-gray-900">"WHAT IF" Simulation</h1>
          <span className="text-xs text-gray-400">Q3 Revenue Simulator</span>
        </div>
        {result && (
          <button
            onClick={handleReset}
            className="text-xs text-gray-400 hover:text-gray-600 underline"
          >
            Reset
          </button>
        )}
      </header>

      {error && (
        <div className="bg-red-50 border-b border-red-200 text-red-600 px-6 py-2 text-xs">
          {error}
        </div>
      )}

     
      <div className="flex h-[calc(100vh-49px)]">

        <aside className="w-72 border-r border-gray-200 flex flex-col overflow-y-auto">
          <SimulationPanel
            params={params}
            onChange={setParams}
            onRun={handleRun}
            isLoading={isLoading}
          />
          <InsightsPanel result={result} metrics={metrics} />
        </aside>

        <main className="flex-1 p-6 flex flex-col">
          <ChartPanel baseline={baseline} result={result} />
        </main>

      </div>
    </div>
  )
}
