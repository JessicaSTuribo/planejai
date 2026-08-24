import { buildAIPrompt } from '@/components/data/aiPrompt'
import type { SimulationRecord } from '@/components/data/simulation'

export interface InsightData {
  feasibility: {
    status: 'viable' | 'needs_adjustment' | 'unfeasible'
    content: string
  }
  diagnosis: {
    content: string
  }
  suggestions: {
    items: string[]
  }
  extraIncome: {
    items: string[]
  }
  investment: {
    items: string[]
  }
  motivation: {
    content: string
  }
}

interface GeminiResponse {
  candidates?: {
    content?: {
      parts?: { text?: string }[]
    }
  }[]
}

const GEMINI_MODEL = 'gemini-3.6-flash'
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`

export async function generateInsight(
  simulation: SimulationRecord,
): Promise<InsightData> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY

  if (!apiKey) {
    throw new Error('VITE_GEMINI_API_KEY não configurada.')
  }

  const response = await fetch(GEMINI_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': apiKey,
    },
    body: JSON.stringify({
      contents: [{ parts: [{ text: buildAIPrompt(simulation) }] }],
      generationConfig: { responseMimeType: 'application/json' },
    }),
  })

  if (!response.ok) {
    throw new Error(`Gemini API respondeu com status ${response.status}`)
  }

  const data = (await response.json()) as GeminiResponse
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text

  if (!text) {
    throw new Error('Resposta da Gemini sem conteúdo.')
  }

  return JSON.parse(text) as InsightData
}
