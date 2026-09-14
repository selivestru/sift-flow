import { Button, Card, Separator, Typography } from '@heroui/react'
import { msg } from '@lingui/core/macro'
import { Trans, useLingui } from '@lingui/react/macro'
import { createFileRoute, useNavigate } from '@tanstack/react-router'

import { LanguageSwitcher } from '~/features/language-switcher'
import { LogoMark } from '~/shared/ui/LogoMark'

export const Route = createFileRoute('/')({
  component: RouteComponent,
})

const FEATURES = [
  {
    title: msg`Boards and lists`,
    description: msg`Group work into boards, lists and cards. Drag anything anywhere — the structure follows your process, not the other way around.`,
  },
  {
    title: msg`Real-time collaboration`,
    description: msg`Every change lands on your teammates screens instantly. No refresh, no lost edits, no merge conflicts.`,
  },
  {
    title: msg`Built for focus`,
    description: msg`Filter by assignee, label or due date, and keep the noise out of the way until it actually needs attention.`,
  },
] as const

function SiteHeader() {
  const navigate = useNavigate()

  return (
    <header className="bg-background/80 border-separator sticky top-0 z-50 border-b backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6">
        <div className="flex items-center gap-2.5">
          <LogoMark />
          <span className="text-lg font-semibold tracking-tight">SiftFlow</span>
        </div>
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <Button onPress={() => navigate({ to: '/auth/login' })}>
            <Trans>Log in</Trans>
          </Button>
        </div>
      </div>
    </header>
  )
}

function Hero() {
  const navigate = useNavigate()

  return (
    <section className="mx-auto w-full max-w-6xl px-6 py-20 md:py-28">
      <Typography
        className="text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl"
        type="h1"
      >
        <Trans>Where your team&apos;s work flows</Trans>
      </Typography>
      <Typography className="mt-6 max-w-2xl" color="muted" type="body">
        <Trans>
          SiftFlow is a real-time collaborative workspace for planning, tracking and shipping work
          together — boards, tasks and progress in one shared place.
        </Trans>
      </Typography>
      <div className="mt-10 flex flex-wrap gap-3">
        <Button size="lg" onPress={() => navigate({ to: '/auth/register' })}>
          <Trans>Create account</Trans>
        </Button>
        <Button size="lg" variant="outline" onPress={() => navigate({ to: '/auth/login' })}>
          <Trans>Log in</Trans>
        </Button>
      </div>
    </section>
  )
}

function Features() {
  const { i18n } = useLingui()

  return (
    <section className="border-separator border-t">
      <div className="mx-auto w-full max-w-6xl px-6 py-20">
        <Typography className="text-3xl font-semibold tracking-tight" type="h2">
          <Trans>Everything a board needs</Trans>
        </Typography>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {FEATURES.map((feature) => (
            <Card key={feature.title.id} variant="secondary">
              <Card.Header>
                <Card.Title>{i18n.t(feature.title)}</Card.Title>
                <Card.Description>{i18n.t(feature.description)}</Card.Description>
              </Card.Header>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

function SiteFooter() {
  return (
    <footer className="border-separator border-t">
      <Separator />
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-8">
        <div className="flex items-center gap-2.5">
          <LogoMark />
          <span className="font-semibold tracking-tight">SiftFlow</span>
        </div>
        <Typography color="muted" type="body-xs">
          <Trans>© 2026 SiftFlow</Trans>
        </Typography>
      </div>
    </footer>
  )
}

function RouteComponent() {
  return (
    <div className="bg-background min-h-dvh">
      <SiteHeader />
      <main>
        <Hero />
        <Features />
      </main>
      <SiteFooter />
    </div>
  )
}
