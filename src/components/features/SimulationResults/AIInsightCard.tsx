import { RotateCcw, Sparkles } from 'lucide-react'

import { Button } from '@/components/shared/Button'
import { useInsight } from '@/hooks/useInsight'

interface AIInsightCardProps {
  simulationId: string
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
          <Button variant="secondary" icon={RotateCcw} onClick={() => void retry()}>
            Tentar novamente
          </Button>
        </div>
      )}

      {!isLoading && !error && insight && (
        <div className="flex flex-col gap-4">
          <p className="text-foreground text-sm">{insight.summary}</p>
          <ul className="flex flex-col gap-2">
            {insight.recommendations.map((recommendation) => (
              <li
                key={recommendation}
                className="text-muted-foreground text-sm"
              >
                • {recommendation}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
