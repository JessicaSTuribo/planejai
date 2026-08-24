export function formatCurrencyMask(value: string): string {
  const digitsOnly = value.replace(/\D/g, '')

  if (!digitsOnly) {
    return ''
  }

  const numericValue = Number(digitsOnly) / 100

  return numericValue.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

export function parseCurrency(value: string): number {
  return Number(value.replace(/\./g, '').replace(',', '.')) || 0
}
