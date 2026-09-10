import { FormattedMessage, useIntl } from 'react-intl'

import { authMessages } from '~/features/auth/model/messages'
import { AuthField } from '~/features/auth/ui/AuthField'
import { Button } from '~/shared/ui/Button'

export const ResetForm = () => {
  const intl = useIntl()

  return (
    <form className="grid gap-3" onSubmit={(event) => event.preventDefault()}>
      <AuthField
        label={intl.formatMessage(authMessages.emailLabel)}
        type="email"
        placeholder="you@example.com"
        autoComplete="email"
      />

      <Button type="submit">
        <FormattedMessage {...authMessages.resetSubmit} />
      </Button>
    </form>
  )
}
