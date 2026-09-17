import type { InvitationFact } from '../model/invitation-facts'

interface InvitationFactsProps {
  facts: InvitationFact[]
}

export const InvitationFacts = ({ facts }: InvitationFactsProps) => {
  return (
    <dl className="flex flex-col gap-3">
      {facts.map((fact) => (
        <div key={fact.label} className="flex items-baseline justify-between gap-4">
          <dt className="text-muted text-sm">{fact.label}</dt>
          <dd className="text-foreground text-right text-sm font-semibold wrap-break-word">
            {fact.value}
          </dd>
        </div>
      ))}
    </dl>
  )
}
