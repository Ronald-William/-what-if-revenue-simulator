import express from 'express';
import cors from 'cors';
import { parseCsvData } from './loader';
import { computeBaseline } from './metrics';
import { runSimulation } from './simulation';
import { SimulationParameters } from './types';

const app = express();
app.use(cors());
app.use(express.json());

const data = parseCsvData();
const q1 = data.q1;
const q2 = data.q2;
const q3 = data.q3;

const baselineMetrics = computeBaseline(q1, q2);

console.log('Server started and data loaded');


//creating the baseline graph with 0 Delta
app.get('/api/baseline', (req, res) => {
  const result = runSimulation(q3, baselineMetrics, {
    conversionRateDelta: 0,
    avgDealSizeDelta: 0,
    salesCycleDelta: 0
  });
  
  const response = {
    metrics: baselineMetrics,
    baseline: result.baseline,
    scenario: result.scenario,
    impact: result.impact,
    drivers: result.drivers
  };
  
  res.json(response);
});

//creating the simulated graph based of user given changes
app.post('/api/simulate', (req, res) => {
  let convDelta = 0;
  if (req.body.conversionRateDelta !== undefined) {
    convDelta = Number(req.body.conversionRateDelta);
  }

  let sizeDelta = 0;
  if (req.body.avgDealSizeDelta !== undefined) {
    sizeDelta = Number(req.body.avgDealSizeDelta);
  }

  let cycleDelta = 0;
  if (req.body.salesCycleDelta !== undefined) {
    cycleDelta = Number(req.body.salesCycleDelta);
  }

  const params: SimulationParameters = {
    conversionRateDelta: convDelta,
    avgDealSizeDelta: sizeDelta,
    salesCycleDelta: cycleDelta
  };

  const result = runSimulation(q3, baselineMetrics, params);
  res.json(result);
});

app.listen(3000, () => {
  console.log('Backend running on port 3000');
});