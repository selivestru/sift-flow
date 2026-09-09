import { AuthField } from '~/features/auth/ui/AuthField'
import { Button } from '~/shared/ui/Button'

export const ResetForm = () => {
  return (
    <form className="grid gap-3" onSubmit={(event) => event.preventDefault()}>
      <AuthField label="Email" type="email" placeholder="you@example.com" autoComplete="email" />

      <Button type="submit">Отправить ссылку</Button>
    </form>
  )
}
