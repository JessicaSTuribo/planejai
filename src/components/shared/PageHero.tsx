interface PageHeroProps {
  title: string
  subtitle: string
}

export function PageHero({ title, subtitle }: PageHeroProps) {
  return (
    <div className="mb-8">
      <h1 className="text-foreground text-2xl font-semibold">{title}</h1>
      <p className="text-muted-foreground text-sm">{subtitle}</p>
    </div>
  )
}
