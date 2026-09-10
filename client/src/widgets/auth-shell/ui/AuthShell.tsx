import { Link, useNavigate, useRouterState } from '@tanstack/react-router'
import { defineMessages, FormattedMessage, useIntl } from 'react-intl'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/shared/ui/Card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/shared/ui/Tabs'

const authShellMessages = defineMessages({
  loginTitle: { id: 'authShell.login.title', defaultMessage: 'Welcome back' },
  loginDescription: {
    id: 'authShell.login.description',
    defaultMessage: 'Sign in to your account to continue',
  },
  registerTitle: { id: 'authShell.register.title', defaultMessage: 'Create account' },
  registerDescription: {
    id: 'authShell.register.description',
    defaultMessage: 'Fill in the form to create your account',
  },
  resetTitle: { id: 'authShell.reset.title', defaultMessage: 'Reset password' },
  resetDescription: {
    id: 'authShell.reset.description',
    defaultMessage: "Enter your email and we'll send a reset link",
  },
  tabLogin: { id: 'authShell.tab.login', defaultMessage: 'Login' },
  tabRegister: { id: 'authShell.tab.register', defaultMessage: 'Register' },
  tabReset: { id: 'authShell.tab.reset', defaultMessage: 'Reset' },
  backToLogin: { id: 'authShell.backToLogin', defaultMessage: 'Back to login' },
})

const getTab = (pathname: string) => {
  if (pathname.endsWith('/register')) return 'register'
  if (pathname.endsWith('/reset')) return 'reset'
  return 'login'
}

const titles = {
  login: { title: authShellMessages.loginTitle, description: authShellMessages.loginDescription },
  register: {
    title: authShellMessages.registerTitle,
    description: authShellMessages.registerDescription,
  },
  reset: { title: authShellMessages.resetTitle, description: authShellMessages.resetDescription },
} as const

export const AuthShell = ({ children }: { children: React.ReactNode }) => {
  const intl = useIntl()
  const pathname = useRouterState({ select: (state) => state.location.pathname })
  const navigate = useNavigate()
  const tab = getTab(pathname)
  const copy = titles[tab]

  return (
    <div className="grid min-h-dvh place-items-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>{intl.formatMessage(copy.title)}</CardTitle>
          <CardDescription>{intl.formatMessage(copy.description)}</CardDescription>
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
              <TabsTrigger value="login">
                <FormattedMessage {...authShellMessages.tabLogin} />
              </TabsTrigger>
              <TabsTrigger value="register">
                <FormattedMessage {...authShellMessages.tabRegister} />
              </TabsTrigger>
              <TabsTrigger value="reset">
                <FormattedMessage {...authShellMessages.tabReset} />
              </TabsTrigger>
            </TabsList>
            <TabsContent value={tab}>{children}</TabsContent>
          </Tabs>
          {tab === 'reset' && (
            <Link
              to="/auth/login"
              className="text-primary mt-3 inline-flex w-full justify-center text-xs underline-offset-4 hover:underline"
            >
              <FormattedMessage {...authShellMessages.backToLogin} />
            </Link>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
