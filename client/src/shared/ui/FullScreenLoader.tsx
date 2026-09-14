import { Spinner } from '@heroui/react'

export const FullScreenLoader = () => {
  return (
    <main className="grid h-dvh place-items-center">
      <Spinner size="xl" />
    </main>
  )
}
