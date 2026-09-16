import { Card, Separator, Skeleton } from '@heroui/react'

import { InvitationShell } from './InvitationShell'

export const InvitationPending = () => {
  return (
    <InvitationShell>
      <Card aria-busy className="w-full">
        <Card.Content className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <Skeleton className="h-7 w-3/5" />
            <Skeleton className="h-5 w-2/5" />
          </div>
          <Separator />
          <div className="flex flex-col gap-3">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
          </div>
          <div className="flex flex-col gap-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </Card.Content>
      </Card>
    </InvitationShell>
  )
}
