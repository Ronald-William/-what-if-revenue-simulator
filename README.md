# -what-if-revenue-simulator
Revenue Simulation Engine — A full-stack TypeScript application that transforms historical sales data into interactive revenue projections using custom weighted-average logic and real-time scenario modeling.

## Prerequisites

- Node.js v18+
- npm

---

## Running the Backend
```bash
cd backend
npm install
npm run dev
```

Backend runs on **http://localhost:3000**

On startup you should see:
Loaded: Q1=X deals, Q2=X deals, Q3=X deals
Backend running on http://localhost:3000

---

## Running the Frontend

Open a second terminal:
```bash
cd frontend
npm install
npm run dev
```

Frontend runs on **http://localhost:5173**

Open that URL in your browser. The chart will load automatically once the backend is running.

## ASSUMPTIONS and INFERENCES

- Conversion Rate is calculation is based off on only closed deals and open deals are not factored in the formula: **Conversion Rate = (closed_won)/(closed_won + closed_lost)**. Some other factors such as quarter and region also affect the conversion rate which I will explain in subsequent assumptions.
- **Quarter 2 is weighted more heavily than Quarter 1** since it represents a more recent depiction of deal handlings. I have followed a 40-60 weight percentage, 40 for quarter 1 and 60 for quarter 2. **What i mean is: Avg_Conversion_rate = (Q1_avg_conversion_rate * 0.4) + (Q2_avg_conversion_rate*0.6) and similarly Avg_deal_size = (Q1_avg_deal_size * 0.4) + (Q2_avg_deal_size * 0.6)**
- **Stage specific cycle time**: I have defined a stage progress order with 4 stages=> Lead(1) -> Qualified(2) -> Proposal(3) -> Closed(4). I have used this order to predict remaining time left for a quarter 3 deal to close. Why? Because i think a deal in it's LEAD stage will certainly take more time to close than a deal which is in it's PROPOSAL stage. How have I used this in calculations ? By defining subsequent stage progression ratios: Lead = 10% completed, Qualified = 35% completion and Proposal = 65% completion. Therefore, remaining cycle time for a deal in quarter 3 = avg_cycle_time(based off Q1 and Q2) * [1-stage_progression_ratio]. Example: for a deal in lead stage, remaining time would be = avg_cycle_time(based off Q1 and Q2) * (1-0.1)
- **Which Q3 deals get counted?** => Only the deals which are expected to close in quarter 3 itself (based on remaining time from previous assumption). Any deal which exceeds that is quarter 4's problem
- **Region is a factor in conversion rate and average deal size** => I have segmented the given data based on regions('US', 'EU', 'APAC') and calculated the conversion rate and average deal size according to region. This segmentation affects the simulation of quarter 3 data as well. For example: Consider there are 3 US Deals with conversion rate of 0.9 and 1 EU deal with conversion rate of 0.4 and both have a average deal size of 40000. Then revenue would be calculated as 3 * 0.9 * 40000 + 1 * 0.4 * 40000.
- **logical boundary on simulation inputs** => I have defined a logical boundary of 50% on all simulation inputs to escape unrealistic scenarios.
- **Revenue is distributed weekly**
- **Indian rupee is used as currency metric**

<img width="1916" height="870" alt="image" src="https://github.com/user-attachments/assets/1a776ef2-09c6-46c9-a46f-68e321fc1f34" />


https://github.com/user-attachments/assets/103e5827-13a0-4535-9dc4-2528d0579fdb


