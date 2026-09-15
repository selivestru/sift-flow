import { Card, Tabs, type Key } from '@heroui/react'
import {
  Outlet,
  createFileRoute,
  redirect,
  useNavigate,
  useRouterState,
} from '@tanstack/react-router'

import { LogoMark } from '~/shared/ui/LogoMark'

const LOGIN_KEY = 'login'
const REGISTER_KEY = 'register'

export const Route = createFileRoute('/auth')({
  beforeLoad: ({ context }) => {
    if (context.auth.isAuthenticated) {
      throw redirect({ to: '/onboarding' })
    }
  },
  component: AuthLayout,
})

function AuthLayout() {
  const navigate = useNavigate()
  const pathname = useRouterState({ select: (state) => state.location.pathname })

  const selectedKey = pathname === '/auth/register' ? REGISTER_KEY : LOGIN_KEY

  const onTabChange = (key: Key) => {
    if (key === LOGIN_KEY) {
      navigate({ to: '/auth/login' })
    } else if (key === REGISTER_KEY) {
      navigate({ to: '/auth/register' })
    }
  }

  return (
    <main className="bg-background flex min-h-dvh flex-col px-4 py-6">
      <div className="m-auto flex w-full max-w-sm flex-col gap-3">
        <Card className="w-full">
          <Card.Header>
            <Card.Title className="mb-4 flex items-center justify-center gap-2">
              <LogoMark />
              <span className="text-lg font-semibold tracking-tight">SiftFlow</span>
            </Card.Title>
            <Tabs selectedKey={selectedKey} className="" onSelectionChange={onTabChange}>
              <Tabs.ListContainer>
                <Tabs.List aria-label="Authentication">
                  <Tabs.Tab id={LOGIN_KEY}>
                    Login
                    <Tabs.Indicator />
                  </Tabs.Tab>
                  <Tabs.Tab id={REGISTER_KEY}>
                    Register
                    <Tabs.Indicator />
                  </Tabs.Tab>
                </Tabs.List>
              </Tabs.ListContainer>
            </Tabs>
          </Card.Header>
          <Card.Content>
            <Outlet />
          </Card.Content>
        </Card>
      </div>
    </main>
  )
}
