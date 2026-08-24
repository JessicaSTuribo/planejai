import { CalendarClock, Goal, PiggyBank } from 'lucide-react'
import { useParams } from 'react-router-dom'

import { AIInsightCard } from '@/components/features/SimulationResults/AIInsightCard'
import { SimulationResultCard } from '@/components/features/SimulationResults/Card'
import { PageHero } from '@/components/shared/PageHero'
import { useSimulationStorage } from '@/hooks/useSimulationStorage'
import { parseCurrency } from '@/utils/currency'
import { formatBRL } from '@/utils/format'
import { calcMonthlySavings } from '@/utils/simulation'

export function SimulationResultsPage() {
  const { id } = useParams<{ id: string }>()
  const { getSimulation } = useSimulationStorage()
  const simulation = id ? getSimulation(id) : undefined

  if (!simulation) {
    return (
      <main className="mx-auto max-w-xl px-4 py-10 sm:py-14">
        <p className="text-muted-foreground text-sm">
          Simulação não encontrada.
        </p>
      </main>
    )
  }

  const monthlySavingsAvailable = calcMonthlySavings(simulation)

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:py-14">
      <PageHero
        title="Resultado da sua simulação"
        subtitle="Confira o diagnóstico com base nos dados informados."
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <SimulationResultCard
          icon={Goal}
          label={simulation.goalName}
          value={formatBRL(parseCurrency(simulation.goalAmount))}
          subtitle="Valor da meta"
          variant="primary"
        />
        <SimulationResultCard
          icon={CalendarClock}
          label="Prazo"
          value={`${simulation.goalDeadline} meses`}
          subtitle="Tempo estimado para atingir a meta"
        />
        <SimulationResultCard
          icon={PiggyBank}
          label="Economia mensal"
          value={formatBRL(monthlySavingsAvailable)}
          subtitle="Disponível por mês (renda - custos - dívidas)"
        />
      </div>

      <div className="mt-6">
        <AIInsightCard simulationId={simulation.id} />
      </div>
    </main>
  )
}
