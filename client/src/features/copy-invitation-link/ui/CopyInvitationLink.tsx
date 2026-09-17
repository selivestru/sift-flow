import { Button, Tooltip } from '@heroui/react'
import { Check, Copy } from 'reicon-react'

import { useCopy } from '~/shared/hooks/useCopy'

const COPIED_RESET_MS = 2000

interface CopyInvitationLinkProps {
  token: string
}

export const CopyInvitationLink = ({ token }: CopyInvitationLinkProps) => {
  const { copy, copied } = useCopy(COPIED_RESET_MS)

  const handleCopy = () => {
    copy(`${window.location.origin}/invite/${token}`)
  }

  return (
    <Tooltip>
      <Button isIconOnly aria-label="Copy the invitation link" variant="ghost" onPress={handleCopy}>
        <span className="t-icon-swap" data-state={copied ? 'b' : 'a'}>
          <Copy className="t-icon size-5" data-icon="a" />
          <Check className="t-icon text-success size-5" data-icon="b" />
        </span>
      </Button>
      <Tooltip.Content>{copied ? 'Link copied' : 'Copy invitation link'}</Tooltip.Content>
    </Tooltip>
  )
}
