import { i18n, type MessageDescriptor } from '@lingui/core'
import { msg, plural } from '@lingui/core/macro'
import { z } from 'zod'

export const PASSWORD_MIN_LENGTH = 8

const MAX_EMAIL_LENGTH = 254
const MAX_FULL_NAME_LENGTH = 100
const MAX_PASSWORD_LENGTH = 128

const EMAIL_REQUIRED = msg`Email is required`
const EMAIL_TOO_LONG = msg`Email must be at most ${MAX_EMAIL_LENGTH} characters`
const EMAIL_INVALID = msg`Please enter a valid email address`
const PASSWORD_REQUIRED = msg`Password is required`
const PASSWORD_TOO_SHORT = msg({
  message: plural(PASSWORD_MIN_LENGTH, {
    one: 'Password must be at least # character',
    other: 'Password must be at least # characters',
  }),
})
const PASSWORD_TOO_LONG = msg`Password must be at most ${MAX_PASSWORD_LENGTH} characters`
const PASSWORD_LETTER_REQUIRED = msg`Password must contain at least one letter`
const PASSWORD_DIGIT_REQUIRED = msg`Password must contain at least one digit`
const FULL_NAME_REQUIRED = msg`Full name is required`
const FULL_NAME_TOO_LONG = msg`Full name must be at most ${MAX_FULL_NAME_LENGTH} characters`
const CONFIRM_PASSWORD_REQUIRED = msg`Please confirm your password`
const PASSWORDS_MISMATCH = msg`Passwords do not match`

const translatedError = (message: MessageDescriptor) => ({
  error: () => i18n.t(message),
})

const emailSchema = z
  .string()
  .trim()
  .min(1, translatedError(EMAIL_REQUIRED))
  .max(MAX_EMAIL_LENGTH, translatedError(EMAIL_TOO_LONG))
  .pipe(z.email(translatedError(EMAIL_INVALID)))

export const loginFormSchema = z.object({
  email: emailSchema,
  password: z
    .string()
    .trim()
    .min(1, translatedError(PASSWORD_REQUIRED))
    .max(MAX_PASSWORD_LENGTH, translatedError(PASSWORD_TOO_LONG)),
})

export const registerFormSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(1, translatedError(FULL_NAME_REQUIRED))
      .max(MAX_FULL_NAME_LENGTH, translatedError(FULL_NAME_TOO_LONG)),
    email: emailSchema,
    password: z
      .string()
      .trim()
      .min(PASSWORD_MIN_LENGTH, translatedError(PASSWORD_TOO_SHORT))
      .max(MAX_PASSWORD_LENGTH, translatedError(PASSWORD_TOO_LONG))
      .regex(/\p{L}/u, translatedError(PASSWORD_LETTER_REQUIRED))
      .regex(/\p{N}/u, translatedError(PASSWORD_DIGIT_REQUIRED)),
    confirmPassword: z.string().trim().min(1, translatedError(CONFIRM_PASSWORD_REQUIRED)),
  })
  .refine((values) => values.password === values.confirmPassword, {
    path: ['confirmPassword'],
    ...translatedError(PASSWORDS_MISMATCH),
  })

export type LoginFormValues = z.infer<typeof loginFormSchema>

export type RegisterFormValues = z.infer<typeof registerFormSchema>
