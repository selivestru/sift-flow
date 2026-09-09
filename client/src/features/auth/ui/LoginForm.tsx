import { Link } from '@tanstack/react-router'

import { AuthDivider } from '~/features/auth/ui/AuthDivider'
import { AuthField } from '~/features/auth/ui/AuthField'
import { PasswordField } from '~/features/auth/ui/PasswordField'
import { SocialAuthButtons } from '~/features/auth/ui/SocialAuthButtons'
import { Button } from '~/shared/ui/Button'

export const LoginForm = () => {
  return (
    <div className="grid gap-4">
      <SocialAuthButtons />
      <AuthDivider>или</AuthDivider>
      <form className="grid gap-3" onSubmit={(event) => event.preventDefault()}>
        <AuthField label="Email" type="email" placeholder="you@example.com" autoComplete="email" />

        <PasswordField
          label="Пароль"
          placeholder="••••••••"
          autoComplete="current-password"
          action={
            <Link
              to="/auth/reset"
              className="text-primary text-xs underline-offset-4 hover:underline"
            >
              Забыли пароль?
            </Link>
          }
        />

        <Button type="submit">Войти</Button>
      </form>
    </div>
  )
}
