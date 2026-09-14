import { Button, Card, Separator, Typography } from '@heroui/react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'

import { LogoMark } from '~/shared/ui/LogoMark'

export const Route = createFileRoute('/')({
  component: RouteComponent,
})

const FEATURES = [
  {
    title: 'Boards and lists',
    description:
      'Group work into boards, lists and cards. Drag anything anywhere — the structure follows your process, not the other way around.',
  },
  {
    title: 'Real-time collaboration',
    description:
      'Every change lands on your teammates screens instantly. No refresh, no lost edits, no merge conflicts.',
  },
  {
    title: 'Built for focus',
    description:
      'Filter by assignee, label or due date, and keep the noise out of the way until it actually needs attention.',
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
        <Button onPress={() => navigate({ to: '/auth/login' })}>Log in</Button>
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
        Where your team&apos;s work flows
      </Typography>
      <Typography className="mt-6 max-w-2xl" color="muted" type="body">
        SiftFlow is a real-time collaborative workspace for planning, tracking and shipping work
        together — boards, tasks and progress in one shared place.
      </Typography>
      <div className="mt-10 flex flex-wrap gap-3">
        <Button size="lg" onPress={() => navigate({ to: '/auth/register' })}>
          Create account
        </Button>
        <Button size="lg" variant="outline" onPress={() => navigate({ to: '/auth/login' })}>
          Log in
        </Button>
      </div>
    </section>
  )
}

function Features() {
  return (
    <section className="border-separator border-t">
      <div className="mx-auto w-full max-w-6xl px-6 py-20">
        <Typography className="text-3xl font-semibold tracking-tight" type="h2">
          Everything a board needs
        </Typography>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {FEATURES.map((feature) => (
            <Card key={feature.title} variant="secondary">
              <Card.Header>
                <Card.Title>{feature.title}</Card.Title>
                <Card.Description>{feature.description}</Card.Description>
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
          © 2026 SiftFlow
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
