import { parseCurrency } from '@/utils/currency'

export interface InsightData {
  feasible: boolean
  monthlySavingsNeeded: number
  monthlySavingsAvailable: number
  summary: string
  recommendations: string[]
}

interface GenerateInsightInput {
  income: string
  expenses: string
  debts: string
  goalAmount: string
  goalDeadline: string
}

// Stub: cálculo local até haver integração com um provedor de IA real.
export async function generateInsight(
  input: GenerateInsightInput,
): Promise<InsightData> {
  const income = parseCurrency(input.income)
  const expenses = parseCurrency(input.expenses)
  const debts = parseCurrency(input.debts)
  const goalAmount = parseCurrency(input.goalAmount)
  const goalDeadline = Number(input.goalDeadline) || 1

  const monthlySavingsAvailable = income - expenses - debts
  const monthlySavingsNeeded = goalAmount / goalDeadline
  const feasible = monthlySavingsAvailable >= monthlySavingsNeeded

  return {
    feasible,
    monthlySavingsNeeded,
    monthlySavingsAvailable,
    summary: feasible
      ? 'Com base nos valores informados, essa meta é alcançável dentro do prazo.'
      : 'Com base nos valores informados, essa meta pode não ser alcançável dentro do prazo definido.',
    recommendations: feasible
      ? ['Mantenha o ritmo de economia mensal para atingir sua meta no prazo.']
      : [
          'Considere aumentar o prazo para a meta.',
          'Avalie reduzir custos fixos ou dívidas mensais.',
        ],
  }
}
