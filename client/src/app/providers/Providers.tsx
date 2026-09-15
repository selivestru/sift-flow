import { MotionProvider } from './MotionProvider'
import { TanstackRouterProvider } from './TanstackRouterProvider'
import { UrqlProvider } from './UrqlProvider'

export const Providers = () => {
  return (
    <MotionProvider>
      <UrqlProvider>
        <TanstackRouterProvider />
      </UrqlProvider>
    </MotionProvider>
  )
}
