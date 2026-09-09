import { AuthDivider } from '~/features/auth/ui/AuthDivider'
import { AuthField } from '~/features/auth/ui/AuthField'
import { PasswordField } from '~/features/auth/ui/PasswordField'
import { SocialAuthButtons } from '~/features/auth/ui/SocialAuthButtons'
import { Button } from '~/shared/ui/Button'

export const RegisterForm = () => {
  return (
    <div className="grid gap-4">
      <SocialAuthButtons />
      <AuthDivider>или</AuthDivider>
      <form className="grid gap-3" onSubmit={(event) => event.preventDefault()}>
        <AuthField label="Полное имя" type="text" placeholder="Иван Петров" autoComplete="name" />

        <AuthField label="Email" type="email" placeholder="you@example.com" autoComplete="email" />

        <PasswordField label="Пароль" placeholder="••••••••" autoComplete="new-password" />

        <PasswordField
          label="Подтвердите пароль"
          placeholder="••••••••"
          autoComplete="new-password"
        />

        <Button type="submit">Зарегистрироваться</Button>
      </form>
    </div>
  )
}
