import { z } from 'zod'

export const PASSWORD_MIN_LENGTH = 8

const MAX_EMAIL_LENGTH = 254
const MAX_FULL_NAME_LENGTH = 100
const MAX_PASSWORD_LENGTH = 128

const emailSchema = z
  .string()
  .trim()
  .min(1, 'Email is required')
  .max(MAX_EMAIL_LENGTH, `Email must be at most ${MAX_EMAIL_LENGTH} characters`)
  .pipe(z.email('Please enter a valid email address'))

export const loginFormSchema = z.object({
  email: emailSchema,
  password: z
    .string()
    .trim()
    .min(1, 'Password is required')
    .max(MAX_PASSWORD_LENGTH, `Password must be at most ${MAX_PASSWORD_LENGTH} characters`),
})

export const registerFormSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(1, 'Full name is required')
      .max(MAX_FULL_NAME_LENGTH, `Full name must be at most ${MAX_FULL_NAME_LENGTH} characters`),
    email: emailSchema,
    password: z
      .string()
      .trim()
      .min(PASSWORD_MIN_LENGTH, `Password must be at least ${PASSWORD_MIN_LENGTH} characters`)
      .max(MAX_PASSWORD_LENGTH, `Password must be at most ${MAX_PASSWORD_LENGTH} characters`)
      .regex(/\p{L}/u, 'Password must contain at least one letter')
      .regex(/\p{N}/u, 'Password must contain at least one digit'),
    confirmPassword: z.string().trim().min(1, 'Please confirm your password'),
  })
  .refine((values) => values.password === values.confirmPassword, {
    path: ['confirmPassword'],
    error: 'Passwords do not match',
  })

export type LoginFormValues = z.infer<typeof loginFormSchema>

export type RegisterFormValues = z.infer<typeof registerFormSchema>
