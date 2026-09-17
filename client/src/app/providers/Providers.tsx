import { Toast } from '@heroui/react'

import { MotionProvider } from './MotionProvider'
import { TanstackRouterProvider } from './TanstackRouterProvider'
import { UrqlProvider } from './UrqlProvider'

export const Providers = () => {
  return (
    <MotionProvider>
      <UrqlProvider>
        <TanstackRouterProvider />
        <Toast.Provider />
      </UrqlProvider>
    </MotionProvider>
  )
}
