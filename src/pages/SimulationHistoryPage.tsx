import { TrendingUp } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { SimulationHistoryCard } from '@/components/features/SimulationHistory/Card'
import { Button } from '@/components/shared/Button'
import { PageHero } from '@/components/shared/PageHero'
import { useSimulationStorage } from '@/hooks/useSimulationStorage'

export function SimulationHistoryPage() {
  const navigate = useNavigate()
  const { getAllSimulations } = useSimulationStorage()
  const simulations = getAllSimulations()

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:py-14">
      <PageHero
        title="Histórico de simulações"
        subtitle="Reveja os resultados das simulações que você já fez."
      />

      {simulations.length === 0 ? (
        <div className="bg-card flex flex-col items-center gap-4 rounded-2xl p-10 text-center shadow-[4px_4px_18px_0px_rgba(0,0,0,0.2)]">
          <p className="text-muted-foreground text-sm">
            Você ainda não fez nenhuma simulação.
          </p>
          <Button
            variant="primary"
            icon={TrendingUp}
            onClick={() => void navigate('/')}
          >
            Nova simulação
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {simulations.map((simulation) => (
            <SimulationHistoryCard key={simulation.id} simulation={simulation} />
          ))}
        </div>
      )}
    </main>
  )
}
