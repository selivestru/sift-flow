import { MotionProvider } from './MotionProvider'
import { TanstackRouterProvider } from './TanstackRouterProvider'

export const Providers = () => {
  return (
    <MotionProvider>
      <TanstackRouterProvider />
    </MotionProvider>
  )
}
