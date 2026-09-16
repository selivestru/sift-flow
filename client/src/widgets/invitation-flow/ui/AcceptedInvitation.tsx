import { Button, Card, Typography } from '@heroui/react'
import { Check } from 'reicon-react'

interface AcceptedInvitationProps {
  name: string
  slug: string
  onOpen: () => void
}

export const AcceptedInvitation = ({ name, slug, onOpen }: AcceptedInvitationProps) => {
  return (
    <Card className="w-full">
      <Card.Content className="flex flex-col gap-6">
        <span
          aria-hidden
          className="bg-success text-success-foreground flex size-10 items-center justify-center"
        >
          <Check className="size-5" />
        </span>
        <div>
          <Typography type="h4">You are in {name}</Typography>
          <div className="mt-2">
            <Typography type="code">/w/{slug}</Typography>
          </div>
        </div>
        <Button fullWidth onPress={onOpen}>
          Open workspace
        </Button>
      </Card.Content>
    </Card>
  )
}
