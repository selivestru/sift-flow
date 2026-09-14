import { I18nProvider } from './I18nProvider'
import { MotionProvider } from './MotionProvider'
import { TanstackRouterProvider } from './TanstackRouterProvider'
import { UrqlProvider } from './UrqlProvider'

export const Providers = () => {
  return (
    <MotionProvider>
      <UrqlProvider>
        <I18nProvider>
          <TanstackRouterProvider />
        </I18nProvider>
      </UrqlProvider>
    </MotionProvider>
  )
}
