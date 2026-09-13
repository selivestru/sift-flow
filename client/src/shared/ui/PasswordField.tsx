import { Button, InputGroup, Label, TextField, type InputProps } from '@heroui/react'
import { useState } from 'react'
import { Eye, EyeOff2 } from 'reicon-react'

interface PasswordFieldProps {
  name: string
  label: string
  autoComplete: string
  placeholder?: string
  variant?: InputProps['variant']
}

export const PasswordField = ({
  name,
  label,
  autoComplete,
  placeholder,
  variant,
}: PasswordFieldProps) => {
  const [isVisible, setIsVisible] = useState(false)

  return (
    <TextField name={name} isRequired fullWidth>
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
    </TextField>
  )
}
