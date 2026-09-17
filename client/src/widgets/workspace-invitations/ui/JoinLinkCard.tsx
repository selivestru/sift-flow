import { Button, Card, Skeleton, Typography } from '@heroui/react'
import { Check, Copy } from 'reicon-react'

import { RevokeJoinLink } from '~/features/revoke-workspace-join-link'
import { useCopy } from '~/shared/hooks/useCopy'

import { useJoinLinkQuery } from '../model/useJoinLinkQuery'

const COPIED_RESET_MS = 2000

interface JoinLinkCardProps {
  workspaceId: string
}

export const JoinLinkCard = ({ workspaceId }: JoinLinkCardProps) => {
  const { link, isLoading, errorMessage, refetch } = useJoinLinkQuery(workspaceId)
  const { copy, copied } = useCopy(COPIED_RESET_MS)

  return (
    <Card variant="secondary" className="sticky bottom-0 flex-4">
      <Card.Header>
        <Card.Title>Public link</Card.Title>
        <Card.Description>
          Anyone with this link joins as a member. It never expires — revoke it to cut off access.
        </Card.Description>
      </Card.Header>
      <Card.Content className="flex flex-col gap-3">
        {isLoading && <Skeleton className="h-10 w-full" />}
        {errorMessage && (
          <div className="flex flex-col items-start gap-3">
            <Typography color="muted" type="body-sm">
              {errorMessage}
            </Typography>
            <Button variant="outline" onPress={refetch}>
              Try again
            </Button>
          </div>
        )}
        {link && (
          <div className="flex flex-col gap-3">
            <div className="border-border bg-surface flex border px-3 py-2">
              <Typography className="line-clamp-1 break-all" type="body-sm">
                {link.url}
              </Typography>
            </div>
            <div className="flex justify-end gap-3 max-sm:flex-col">
              <Button
                className="w-32 justify-start max-sm:w-full max-sm:justify-center"
                variant="primary"
                onPress={() => copy(link.url)}
              >
                <span className="t-icon-swap" data-state={copied ? 'b' : 'a'}>
                  <Copy className="t-icon size-4" data-icon="a" />
                  <Check className="t-icon text-success size-4" data-icon="b" />
                </span>
                {copied ? 'Copied' : 'Copy link'}
              </Button>
              <RevokeJoinLink workspaceId={workspaceId} onRevoked={refetch} />
            </div>
          </div>
        )}
      </Card.Content>
    </Card>
  )
}
