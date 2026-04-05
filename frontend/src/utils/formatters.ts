export function formatCurrency(value: number): string {
  if (value >= 100000) {
    return `₹${(value / 100000).toFixed(1)}L`  
  }
  if (value >= 1000) {
    return `₹${(value / 1000).toFixed(1)}K`    
  }
  return `₹${value.toFixed(0)}`
}

export function formatPercent(value: number): string {
  const sign = value >= 0 ? '+' : ''
  return `${sign}${value.toFixed(1)}%`
}

export function formatDays(value: number): string {
  const sign = value >= 0 ? '+' : ''
  return `${sign}${value}d`
}

export function weekLabel(index: number): string {
  const q3Start = new Date('2025-07-01')
  const date = new Date(q3Start)
  date.setDate(date.getDate() + index * 7)
  const month = date.toLocaleString('default', { month: 'short' })
  const day = date.getDate()
  return `${month} ${day}`
}