import { CalendarClock, ChevronRight, Goal } from 'lucide-react'
import { Link } from 'react-router-dom'

import type { SimulationRecord } from '@/components/data/simulation'
import { parseCurrency } from '@/utils/currency'
import { formatBRL } from '@/utils/format'

interface SimulationHistoryCardProps {
  simulation: SimulationRecord
}

export function SimulationHistoryCard({
  simulation,
}: SimulationHistoryCardProps) {
  return (
    <Link
      to={`/resultado/${simulation.id}`}
      className="bg-card flex items-center gap-4 rounded-2xl p-6 shadow-[4px_4px_18px_0px_rgba(0,0,0,0.2)] transition-opacity hover:opacity-80"
    >
      <div className="bg-primary flex h-12 w-12 shrink-0 items-center justify-center rounded-xl">
        <Goal size={22} className="text-primary-foreground" />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-foreground truncate font-semibold">
          {simulation.goalName}
        </p>
        <p className="text-muted-foreground text-sm">
          {formatBRL(parseCurrency(simulation.goalAmount))}
        </p>
      </div>

      <div className="text-muted-foreground flex items-center gap-1 text-sm">
        <CalendarClock size={16} />
        {simulation.goalDeadline} meses
      </div>

      <ChevronRight size={20} className="text-muted-foreground shrink-0" />
    </Link>
  )
}
