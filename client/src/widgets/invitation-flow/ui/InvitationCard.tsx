import { Card, Separator, Typography } from '@heroui/react'

import type { InvitationFact } from '../model/invitation-facts'
import type { JoinPreview } from '../model/join-preview'
import { InvitationFacts } from './InvitationFacts'

interface InvitationCardProps {
  preview: JoinPreview
  facts: InvitationFact[]
  children: React.ReactNode
}

export const InvitationCard = ({ preview, facts, children }: InvitationCardProps) => {
  return (
    <Card className="w-full">
      <Card.Header>
        <Typography type="h3">Join {preview.name}</Typography>
        <div className="mt-2">
          <Typography type="code">/w/{preview.slug}</Typography>
        </div>
      </Card.Header>
      <Card.Content className="flex flex-col gap-6">
        <Separator />
        <InvitationFacts facts={facts} />
        {children}
      </Card.Content>
    </Card>
  )
}
