import type { Request } from 'express'
import type { Session } from 'express-session'

import type { User } from '~/generated/prisma/client.js'

export interface AuthSessionFields {
  userId?: string
  createdAt?: number
  csrfToken?: string
}

export type SessionRequest = Request & {
  session: Session & AuthSessionFields
}

declare module 'express-session' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface SessionData extends AuthSessionFields {}
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: Pick<User, 'id' | 'email' | 'fullName'>
    }
  }
}


