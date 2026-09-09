import { EyeIcon, EyeOffIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { useId, useState } from 'react'

import { Field, FieldLabel } from '~/shared/ui/Field'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '~/shared/ui/InputGroup'

interface PasswordFieldProps extends Omit<React.ComponentProps<'input'>, 'type'> {
  label: string
  action?: React.ReactNode
}

export const PasswordField = ({ label, action, ...props }: PasswordFieldProps) => {
  const id = useId()

  const [visible, setVisible] = useState(false)

  return (
    <Field>
      <div className="flex items-center justify-between gap-2">
        <FieldLabel htmlFor={id} className="flex-1">
          {label}
        </FieldLabel>
        {action}
      </div>
      <InputGroup>
        <InputGroupInput id={id} type={visible ? 'text' : 'password'} {...props} />
        <InputGroupAddon align="inline-end">
          <InputGroupButton
            size="icon-xs"
            aria-label={visible ? 'Скрыть пароль' : 'Показать пароль'}
            aria-pressed={visible}
            onClick={() => setVisible((prev) => !prev)}
          >
            <HugeiconsIcon icon={visible ? EyeOffIcon : EyeIcon} />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </Field>
  )
}
