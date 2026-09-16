import { Button, Card, Typography } from '@heroui/react'
import { useNavigate, useRouter } from '@tanstack/react-router'

import { JOIN_PREVIEW_FAILURE_COPY, JoinPreviewFailure } from '../model/join-preview'

interface InvitationUnavailableProps {
  reason: JoinPreviewFailure
}

export const InvitationUnavailable = ({ reason }: InvitationUnavailableProps) => {
  const navigate = useNavigate()
  const router = useRouter()

  const { title, description } = JOIN_PREVIEW_FAILURE_COPY[reason]
  const isRetryable = reason === JoinPreviewFailure.UNREACHABLE

  return (
    <Card className="relative w-full overflow-hidden">
      {!isRetryable && (
        <span
          aria-hidden
          className={
            reason === JoinPreviewFailure.INVALID
              ? 'bg-danger absolute inset-x-0 top-0 h-0.5'
              : 'bg-warning absolute inset-x-0 top-0 h-0.5'
          }
        />
      )}

      <Card.Header>
        <Typography type="h4">{title}</Typography>
        <Typography className="mt-2" color="muted" type="body-sm">
          {description}
        </Typography>
      </Card.Header>
      <Card.Content>
        {isRetryable ? (
          <Button fullWidth onPress={() => router.invalidate()}>
            Try again
          </Button>
        ) : (
          <Button fullWidth variant="outline" onPress={() => navigate({ to: '/onboarding' })}>
            Back to SiftFlow
          </Button>
        )}
      </Card.Content>
    </Card>
  )
}
