import {
  AlertTriangle,
  CheckCircle2,
  Lightbulb,
  LineChart,
  type LucideIcon,
  RotateCcw,
  Sparkles,
  TrendingUp,
  XCircle,
} from 'lucide-react'

import { Button } from '@/components/shared/Button'
import { useInsight } from '@/hooks/useInsight'
import type { InsightData } from '@/services/aiService'

interface AIInsightCardProps {
  simulationId: string
}

const feasibilityConfig: Record<
  InsightData['feasibility']['status'],
  { icon: LucideIcon; label: string; className: string }
> = {
  viable: {
    icon: CheckCircle2,
    label: 'Meta viável',
    className: 'bg-emerald-500/10 text-emerald-500',
  },
  needs_adjustment: {
    icon: AlertTriangle,
    label: 'Precisa de ajustes',
    className: 'bg-amber-500/10 text-amber-500',
  },
  unfeasible: {
    icon: XCircle,
    label: 'Meta inviável no momento',
    className: 'bg-red-500/10 text-red-500',
  },
}

function InsightList({
  icon: Icon,
  title,
  items,
}: {
  icon: LucideIcon
  title: string
  items: string[]
}) {
  return (
    <div>
      <div className="mb-2 flex items-center gap-2">
        <Icon size={16} className="text-primary" />
        <span className="text-foreground text-sm font-medium">{title}</span>
      </div>
      <ul className="flex flex-col gap-1.5">
        {items.map((item) => (
          <li key={item} className="text-muted-foreground text-sm">
            • {item}
          </li>
        ))}
      </ul>
    </div>
  )
}

export function AIInsightCard({ simulationId }: AIInsightCardProps) {
  const { insight, isLoading, error, retry } = useInsight(simulationId)

  return (
    <div className="bg-card rounded-2xl p-6 shadow-[4px_4px_18px_0px_rgba(0,0,0,0.2)] sm:p-8">
      <div className="mb-4 flex items-center gap-2">
        <Sparkles size={18} className="text-primary" />
        <span className="text-foreground text-sm font-medium">
          Diagnóstico com IA
        </span>
      </div>

      {isLoading && (
        <p className="text-muted-foreground text-sm">
          Gerando diagnóstico...
        </p>
      )}

      {!isLoading && error && (
        <div className="flex flex-col items-start gap-3">
          <p className="text-muted-foreground text-sm">{error}</p>
          <Button
            variant="secondary"
            icon={RotateCcw}
            onClick={() => void retry()}
          >
            Tentar novamente
          </Button>
        </div>
      )}

      {!isLoading && !error && insight && (
        <div className="flex flex-col gap-5">
          <div>
            <div
              className={`mb-2 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${feasibilityConfig[insight.feasibility.status].className}`}
            >
              {(() => {
                const FeasibilityIcon =
                  feasibilityConfig[insight.feasibility.status].icon
                return <FeasibilityIcon size={14} />
              })()}
              {feasibilityConfig[insight.feasibility.status].label}
            </div>
            <p className="text-foreground text-sm">
              {insight.feasibility.content}
            </p>
          </div>

          <p className="text-muted-foreground text-sm">
            {insight.diagnosis.content}
          </p>

          <InsightList
            icon={Lightbulb}
            title="Sugestões"
            items={insight.suggestions.items}
          />
          <InsightList
            icon={TrendingUp}
            title="Renda extra"
            items={insight.extraIncome.items}
          />
          <InsightList
            icon={LineChart}
            title="Investimentos"
            items={insight.investment.items}
          />

          <p className="text-foreground border-border border-t pt-4 text-sm italic">
            {insight.motivation.content}
          </p>
        </div>
      )}
    </div>
  )
}
