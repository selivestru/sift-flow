import { Button, Card, Typography } from '@heroui/react'
import { X } from 'reicon-react'

interface DeclinedInvitationProps {
  name: string
  onBack: () => void
}

export const DeclinedInvitation = ({ name, onBack }: DeclinedInvitationProps) => {
  return (
    <Card className="w-full">
      <Card.Content className="flex flex-col gap-6">
        <span
          aria-hidden
          className="bg-danger text-danger-foreground flex size-10 items-center justify-center"
        >
          <X className="size-5" />
        </span>
        <div>
          <Typography type="h4">Invitation declined</Typography>
          <Typography className="mt-2" color="muted" type="body-sm">
            You will not be added to {name}.
          </Typography>
        </div>
        <Button fullWidth onPress={onBack}>
          Back to SiftFlow
        </Button>
      </Card.Content>
    </Card>
  )
}
