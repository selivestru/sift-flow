import { Card, Tabs, type Key } from '@heroui/react'
import {
  Outlet,
  createFileRoute,
  redirect,
  useNavigate,
  useRouterState,
} from '@tanstack/react-router'

const LOGIN_KEY = 'login'
const REGISTER_KEY = 'register'

export const Route = createFileRoute('/auth')({
  beforeLoad: ({ context }) => {
    if (context.auth.isAuthenticated) {
      throw redirect({ to: '/test' })
    }
  },
  component: AuthLayout,
})

function AuthLayout() {
  const navigate = useNavigate()

  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })
  const selectedKey = pathname === '/auth/register' ? REGISTER_KEY : LOGIN_KEY

  const onTabChange = (key: Key) => {
    if (key === LOGIN_KEY) {
      navigate({ to: '/auth/login' })
    } else if (key === REGISTER_KEY) {
      navigate({ to: '/auth/register' })
    }
  }

  return (
    <main className="bg-background grid min-h-dvh place-items-center gap-6 px-4">
      <Card className="w-full max-w-sm">
        <Card.Header>
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
    </main>
  )
}
