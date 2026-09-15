import { Typography } from '@heroui/react'
import { createFileRoute } from '@tanstack/react-router'

import { LogoMark } from '~/shared/ui/LogoMark'

import { OnboardingFlow } from './-ui/OnboardingFlow'

export const Route = createFileRoute('/_authenticated/onboarding')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="bg-background min-h-dvh">
      <header className="border-separator border-b">
        <div className="mx-auto flex h-16 w-full max-w-xl items-center justify-between px-6">
          <div className="flex items-center gap-2.5">
            <LogoMark />
            <span className="text-lg font-semibold tracking-tight">SiftFlow</span>
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-xl px-6 py-12">
        <Typography className="tracking-tight" type="h3">
          Set up your workspace
        </Typography>
        <Typography className="mt-2" color="muted" type="body">
          A workspace is where your team's boards, lists and cards live. Name it, then bring your
          team in.
        </Typography>
        <div className="mt-8">
          <OnboardingFlow />
        </div>
      </main>
    </div>
  )
}
