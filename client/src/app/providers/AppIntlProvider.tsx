import { useMemo } from 'react'
import { IntlProvider, ReactIntlErrorCode } from 'react-intl'

import { defaultLocale, getInitialLocale, messagesByLocale } from '~/shared/i18n'

export const AppIntlProvider = ({ children }: React.PropsWithChildren) => {
  const locale = useMemo(() => getInitialLocale(), [])

  return (
    <IntlProvider
      locale={locale}
      defaultLocale={defaultLocale}
      messages={messagesByLocale[locale]}
      onError={(error) => {
        if (error.code !== ReactIntlErrorCode.MISSING_TRANSLATION) {
          console.error(error)
        }
      }}
    >
      {children}
    </IntlProvider>
  )
}
