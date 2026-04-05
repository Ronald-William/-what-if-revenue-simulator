import { type BaselineResponse, type SimulationParams, type SimulationResult } from '../types/simulation'

const URL = 'http://localhost:3000'

export async function fetchBaseline(): Promise<BaselineResponse> {
  const res = await fetch(`${URL}/api/baseline`)
  if (!res.ok) throw new Error('Failed to fetch baseline')
  return res.json()
}

export async function runSimulation(params: SimulationParams): Promise<SimulationResult> {
  const res = await fetch(`${URL}/api/simulate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params)
  })
  if (!res.ok) throw new Error('Simulation failed')
  return res.json()
}