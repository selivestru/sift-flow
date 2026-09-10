import type { IntlShape } from 'react-intl'
import { z } from 'zod'

import { authMessages } from './messages'

export const createLoginSchema = (intl: IntlShape) =>
  z.object({
    email: z.email({ error: intl.formatMessage(authMessages.validationEmailInvalid) }),
    password: z
      .string()
      .min(1, { error: intl.formatMessage(authMessages.validationPasswordRequired) }),
  })

export type LoginValues = z.infer<ReturnType<typeof createLoginSchema>>

export const createRegisterSchema = (intl: IntlShape) =>
  z
    .object({
      fullName: z
        .string()
        .trim()
        .min(1, { error: intl.formatMessage(authMessages.validationNameRequired) })
        .max(100, { error: intl.formatMessage(authMessages.validationNameMax) }),
      email: z.email({ error: intl.formatMessage(authMessages.validationEmailInvalid) }),
      password: z
        .string()
        .min(8, { error: intl.formatMessage(authMessages.validationPasswordMin) })
        .max(128, { error: intl.formatMessage(authMessages.validationPasswordMax) })
        .regex(/\p{L}/u, { error: intl.formatMessage(authMessages.validationPasswordLetter) })
        .regex(/\p{N}/u, { error: intl.formatMessage(authMessages.validationPasswordDigit) }),
      confirmPassword: z.string(),
    })
    .refine((values) => values.password === values.confirmPassword, {
      error: intl.formatMessage(authMessages.validationPasswordMismatch),
      path: ['confirmPassword'],
    })

export type RegisterValues = z.infer<ReturnType<typeof createRegisterSchema>>
