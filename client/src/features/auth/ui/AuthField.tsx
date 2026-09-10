import { useId } from 'react'

import { Field, FieldError, FieldLabel } from '~/shared/ui/Field'
import { Input } from '~/shared/ui/Input'

interface AuthFieldProps extends React.ComponentProps<'input'> {
  label: string
  action?: React.ReactNode
  error?: string
}

export const AuthField = ({ label, action, error, ...props }: AuthFieldProps) => {
  const id = useId()

  return (
    <Field>
      <div className="flex items-center justify-between gap-2">
        <FieldLabel htmlFor={id} className="flex-1">
          {label}
        </FieldLabel>
        {action}
      </div>
      <Input id={id} aria-invalid={error ? true : undefined} {...props} />
      {error && <FieldError>{error}</FieldError>}
    </Field>
  )
}
