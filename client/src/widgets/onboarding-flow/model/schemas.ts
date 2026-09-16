import { z } from 'zod'

const MAX_EMAIL_LENGTH = 254

export const inviteMemberSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'Email is required')
    .max(MAX_EMAIL_LENGTH, `Email must be at most ${MAX_EMAIL_LENGTH} characters`)
    .pipe(z.email('Please enter a valid email address')),
})

export type InviteMemberValues = z.infer<typeof inviteMemberSchema>
