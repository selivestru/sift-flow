import { Button, FieldError, InputGroup, Label, TextField, type InputProps } from '@heroui/react'
import { useState } from 'react'
import { Eye, EyeOff2 } from 'reicon-react'

type TextFieldProps = React.ComponentProps<typeof TextField>

interface PasswordFieldProps {
  name: string
  label: string
  autoComplete: string
  placeholder?: string
  variant?: InputProps['variant']
  value?: TextFieldProps['value']
  isInvalid?: boolean
  errorMessage?: string
  onChange?: TextFieldProps['onChange']
}

export const PasswordField = ({
  name,
  label,
  autoComplete,
  placeholder,
  variant,
  value,
  isInvalid,
  errorMessage,
  onChange,
}: PasswordFieldProps) => {
  const [isVisible, setIsVisible] = useState(false)

  return (
    <TextField name={name} fullWidth value={value} isInvalid={isInvalid} onChange={onChange}>
      <Label>{label}</Label>
      <InputGroup variant={variant}>
        <InputGroup.Input
          type={isVisible ? 'text' : 'password'}
          autoComplete={autoComplete}
          placeholder={placeholder}
        />
        <InputGroup.Suffix className="pe-0">
          <Button
            type="button"
            isIconOnly
            aria-label={isVisible ? 'Hide password' : 'Show password'}
            size="sm"
            variant="ghost"
            onPress={() => setIsVisible((prev) => !prev)}
          >
            {isVisible ? <Eye /> : <EyeOff2 />}
          </Button>
        </InputGroup.Suffix>
      </InputGroup>
      {errorMessage && <FieldError>{errorMessage}</FieldError>}
    </TextField>
  )
}
