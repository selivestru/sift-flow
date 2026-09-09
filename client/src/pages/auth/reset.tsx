import { createFileRoute } from '@tanstack/react-router'

import { ResetForm } from '~/features/auth'

export const Route = createFileRoute('/auth/reset')({
  component: ResetPage,
})

function ResetPage() {
  return <ResetForm />
}
