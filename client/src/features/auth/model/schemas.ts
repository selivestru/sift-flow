import { z } from 'zod'

const emailSchema = z
  .string()
  .trim()
  .min(1, 'Email is required')
  .max(254, 'Email must be at most 254 characters')
  .pipe(z.email('Please enter a valid email address'))

export const loginFormSchema = z.object({
  email: emailSchema,
  password: z
    .string()
    .trim()
    .min(1, 'Password is required')
    .max(128, 'Password must be at most 128 characters'),
})

export const registerFormSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(1, 'Full name is required')
      .max(100, 'Full name must be at most 100 characters'),
    email: emailSchema,
    password: z
      .string()
      .trim()
      .min(8, 'Password must be at least 8 characters')
      .max(128, 'Password must be at most 128 characters')
      .regex(/\p{L}/u, 'Password must contain at least one letter')
      .regex(/\p{N}/u, 'Password must contain at least one digit'),
    confirmPassword: z.string().trim().min(1, 'Please confirm your password'),
  })
  .refine((values) => values.password === values.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  })

export type LoginFormValues = z.infer<typeof loginFormSchema>

export type RegisterFormValues = z.infer<typeof registerFormSchema>
