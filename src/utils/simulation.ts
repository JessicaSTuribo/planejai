import type { SimulationRecord } from '@/components/data/simulation'

import { parseCurrency } from './currency'

export function calcMonthlySavings(simulation: SimulationRecord): number {
  const income = parseCurrency(simulation.income)
  const expenses = parseCurrency(simulation.expenses)
  const debts = parseCurrency(simulation.debts)

  return income - expenses - debts
}
