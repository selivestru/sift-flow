import * as z from 'zod'

export const envSchema = z.object({
  PORT: z.coerce.number().default(3000),
  NODE_ENV: z.enum(['development', 'production']).default('development'),
  ORIGIN: z.url(),

  DATABASE_URL: z.string().min(1),
  REDIS_URL: z.string().min(1),

  SESSION_SECRET: z.string().min(32, 'SESSION_SECRET must be at least 32 chars'),
  SESSION_NAME: z.string().default('sift.sid'),
  SESSION_MAX_AGE_MS: z.coerce.number().default(24 * 60 * 60 * 1000),
  SESSION_ABSOLUTE_MAX_AGE_MS: z.coerce.number().default(7 * 24 * 60 * 60 * 1000),
})

export type EnvConfig = z.infer<typeof envSchema>

export function validateEnv(config: Record<string, unknown>): EnvConfig {
  return envSchema.parse(config)
}
