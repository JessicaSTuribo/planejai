import type { LucideIcon } from 'lucide-react'

interface SimulationResultCardProps {
  icon: LucideIcon
  label: string
  value: string
  subtitle: string
  variant?: 'default' | 'primary'
}

const variantClasses = {
  default: 'bg-card text-foreground',
  primary: 'bg-primary text-primary-foreground',
}

export function SimulationResultCard({
  icon: Icon,
  label,
  value,
  subtitle,
  variant = 'default',
}: SimulationResultCardProps) {
  return (
    <div
      className={`flex flex-col gap-3 rounded-2xl p-6 shadow-[4px_4px_18px_0px_rgba(0,0,0,0.2)] ${variantClasses[variant]}`}
    >
      <div className="flex items-center gap-2">
        <Icon size={18} />
        <span className="text-sm font-medium">{label}</span>
      </div>
      <span className="text-2xl font-semibold">{value}</span>
      <span
        className={
          variant === 'primary'
            ? 'text-primary-foreground/80 text-xs'
            : 'text-muted-foreground text-xs'
        }
      >
        {subtitle}
      </span>
    </div>
  )
}
