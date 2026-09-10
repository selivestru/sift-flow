import { AppIntlProvider } from './AppIntlProvider'
import { AuthSessionProvider } from './AuthSessionProvider'
import { MotionProvider } from './MotionProvider'
import { TanstackRouterProvider } from './TanstackRouterProvider'
import { UrqlProvider } from './UrqlProvider'

export const Providers = () => {
  return (
    <AppIntlProvider>
      <MotionProvider>
        <UrqlProvider>
          <AuthSessionProvider>
            <TanstackRouterProvider />
          </AuthSessionProvider>
        </UrqlProvider>
      </MotionProvider>
    </AppIntlProvider>
  )
}
