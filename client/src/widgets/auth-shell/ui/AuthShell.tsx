import { Link, useNavigate, useRouterState } from '@tanstack/react-router'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/shared/ui/Card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/shared/ui/Tabs'

const getTab = (pathname: string) => {
  if (pathname.endsWith('/register')) return 'register'
  if (pathname.endsWith('/reset')) return 'reset'
  return 'login'
}

const titles = {
  login: { title: 'С возвращением', description: 'Войдите в аккаунт, чтобы продолжить' },
  register: { title: 'Создать аккаунт', description: 'Заполните форму, чтобы зарегистрироваться' },
  reset: { title: 'Сброс пароля', description: 'Введите email — пришлём ссылку для сброса' },
} as const

export const AuthShell = ({ children }: { children: React.ReactNode }) => {
  const pathname = useRouterState({ select: (state) => state.location.pathname })
  const navigate = useNavigate()
  const tab = getTab(pathname)
  const copy = titles[tab]

  return (
    <main className="bg-background grid min-h-dvh place-items-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>{copy.title}</CardTitle>
          <CardDescription>{copy.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs
            value={tab}
            onValueChange={(value) => {
              switch (value) {
                case 'login':
                  navigate({ to: '/auth/login' })
                  break
                case 'register':
                  navigate({ to: '/auth/register' })
                  break
                case 'reset':
                  navigate({ to: '/auth/reset' })
                  break
              }
            }}
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
              <TabsTrigger value="reset">Reset</TabsTrigger>
            </TabsList>
            <TabsContent value={tab}>{children}</TabsContent>
          </Tabs>
          {tab === 'reset' && (
            <Link
              to="/auth/login"
              className="text-primary mt-3 inline-flex w-full justify-center text-xs underline-offset-4 hover:underline"
            >
              Back to login
            </Link>
          )}
        </CardContent>
      </Card>
    </main>
  )
}
