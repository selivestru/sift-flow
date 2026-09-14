import { I18nProvider as LinguiProvider } from '@lingui/react'
import { Suspense, use } from 'react'

import { i18n, initializeI18n } from '~/shared/i18n'
import { FullScreenLoader } from '~/shared/ui/FullScreenLoader'

const initialLocale = initializeI18n()

const LocaleGate = ({ children }: React.PropsWithChildren) => {
  use(initialLocale)

  return <LinguiProvider i18n={i18n}>{children}</LinguiProvider>
}

export const I18nProvider = ({ children }: React.PropsWithChildren) => (
  <Suspense fallback={<FullScreenLoader />}>
    <LocaleGate>{children}</LocaleGate>
  </Suspense>
)
