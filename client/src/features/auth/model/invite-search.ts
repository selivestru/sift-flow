import { z } from 'zod'

export const inviteSearchSchema = z.object({
  invite: z.string().min(16).max(128).optional(),
})

export type InviteSearch = z.infer<typeof inviteSearchSchema>

export const parseInviteSearch = (search: Record<string, unknown>): InviteSearch => {
  const parsed = inviteSearchSchema.safeParse(search)

  return parsed.success ? parsed.data : {}
}
