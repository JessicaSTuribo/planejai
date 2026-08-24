import { useCallback, useEffect, useState } from 'react'

import { useSimulationStorage } from '@/hooks/useSimulationStorage'
import { generateInsight, type InsightData } from '@/services/aiService'

export function useInsight(simulationId: string | undefined) {
  const { getSimulation } = useSimulationStorage()
  const [insight, setInsight] = useState<InsightData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    let cancelled = false

    async function run() {
      // yields to a microtask first so every setState below happens after
      // the effect's synchronous phase, not during it
      await Promise.resolve()

      if (!simulationId) {
        return
      }

      const simulation = getSimulation(simulationId)
      if (!simulation) {
        if (!cancelled) {
          setIsLoading(false)
          setError('Simulação não encontrada.')
        }
        return
      }

      try {
        const result = await generateInsight(simulation)
        if (!cancelled) {
          setInsight(result)
          setIsLoading(false)
        }
      } catch {
        if (!cancelled) {
          setError('Não foi possível gerar o diagnóstico. Tente novamente.')
          setIsLoading(false)
        }
      }
    }

    void run()

    return () => {
      cancelled = true
    }
  }, [simulationId, attempt, getSimulation])

  const retry = useCallback(() => {
    setInsight(null)
    setError(null)
    setIsLoading(true)
    setAttempt((count) => count + 1)
  }, [])

  return { insight, isLoading, error, retry }
}
