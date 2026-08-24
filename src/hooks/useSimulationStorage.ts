import { useCallback } from 'react'

import type {
  SimulationFormData,
  SimulationRecord,
} from '@/components/data/simulation'

const STORAGE_KEY = 'planejai:simulations'

function readSimulations(): SimulationRecord[] {
  const raw = localStorage.getItem(STORAGE_KEY)
  return raw ? (JSON.parse(raw) as SimulationRecord[]) : []
}

function writeSimulations(simulations: SimulationRecord[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(simulations))
}

export function useSimulationStorage() {
  const saveFormData = useCallback((formData: SimulationFormData) => {
    const id = crypto.randomUUID()
    const record: SimulationRecord = { ...formData, id }

    writeSimulations([...readSimulations(), record])

    return id
  }, [])

  const getSimulation = useCallback((id: string) => {
    return readSimulations().find((simulation) => simulation.id === id)
  }, [])

  const getAllSimulations = useCallback(() => readSimulations(), [])

  return { saveFormData, getSimulation, getAllSimulations }
}
