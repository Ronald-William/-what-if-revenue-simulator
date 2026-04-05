import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import { Deal } from './types';


//boundaries for given quaters
const Q1_START = new Date('2025-01-01');
const Q1_END   = new Date('2025-03-31');
const Q2_START = new Date('2025-04-01');
const Q2_END   = new Date('2025-06-30');
const Q3_START = new Date('2025-07-01');
const Q3_END   = new Date('2025-09-30');

//boundary check for quaters
function isDateInRange(date: Date, start: Date, end: Date): boolean {
  return date >= start && date <= end;
}

//parse the csv data and segregate deals based on quaters
export function parseCsvData(): { q1: Deal[]; q2: Deal[]; q3: Deal[] } {
  const filePath = path.resolve(__dirname, '../deals.csv');
  const rawData = fs.readFileSync(filePath, 'utf-8');

  const records = parse(rawData, {
    columns: true,
    trim: true
  });

  const q1: Deal[] = [];
  const q2: Deal[] = [];
  const q3: Deal[] = [];

  for (const row of records) {
    let closedDate = null;
    if (row.closed_date) {
      closedDate = new Date(row.closed_date);
    }

    const deal: Deal = {
      deal_id: row.deal_id,
      created_date: new Date(row.created_date),
      closed_date: closedDate,
      stage: row.stage,
      deal_value: parseFloat(row.deal_value),
      region: row.region,
      source: row.source
    };

    //push q3 deals into q3 list
    if (isDateInRange(deal.created_date, Q3_START, Q3_END)) {
      if (!deal.closed_date) {
        q3.push(deal);
        continue;
      }
    }

    //similarly doing it for q2 and q1
    if (deal.closed_date) {
      if (isDateInRange(deal.closed_date, Q1_START, Q1_END)) {
        q1.push(deal);
      } else if (isDateInRange(deal.closed_date, Q2_START, Q2_END)) {
        q2.push(deal);
      }
    }
  }

  return { q1, q2, q3 };
}