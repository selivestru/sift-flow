import { GithubIcon, GoogleIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'

import { Button } from '~/shared/ui/Button'

export const SocialAuthButtons = () => {
  return (
    <div className="grid grid-cols-2 gap-2">
      <Button type="button" variant="outline">
        <HugeiconsIcon icon={GoogleIcon} />
        Google
      </Button>
      <Button type="button" variant="outline">
        <HugeiconsIcon icon={GithubIcon} />
        GitHub
      </Button>
    </div>
  )
}
