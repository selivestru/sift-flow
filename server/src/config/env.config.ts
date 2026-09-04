import * as z from 'zod'

export const envSchema = z.object({
  PORT: z.coerce.number(),
  NODE_ENV: z.enum(['development', 'production']),
  ORIGIN: z.url(),
})

export type EnvConfig = z.infer<typeof envSchema>

export function validateEnv(config: Record<string, unknown>): EnvConfig {
  return envSchema.parse(config)
}
