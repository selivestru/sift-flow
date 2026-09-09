import { ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestExpressApplication } from '@nestjs/platform-express'
import RedisStore from 'connect-redis'
import cookieParser from 'cookie-parser'
import type { NextFunction, Request, Response } from 'express'
import session from 'express-session'
import helmet from 'helmet'

import type { EnvConfig } from './config/env.config.js'
import { RedisService } from './infrastructure/redis/redis.service.js'

export function configureApp(app: NestExpressApplication): void {
  app.set('trust proxy', 1)

  const config = app.get(ConfigService<EnvConfig, true>)
  const isProd = config.get('NODE_ENV', { infer: true }) === 'production'

  app.enableCors({
    origin: config.get('ORIGIN', { infer: true }),
    credentials: true,
  })

  app.use(
    helmet({
      contentSecurityPolicy: false,
      crossOriginEmbedderPolicy: false,
    }),
  )
  app.use(cookieParser())

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }))

  app.use('/graphql', (req: Request, res: Response, next: NextFunction) => {
    if (req.method === 'GET') {
      const query = typeof req.query['query'] === 'string' ? req.query['query'] : ''
      if (/^\s*mutation\b/i.test(query)) {
        res.status(405).json({ errors: [{ message: 'Mutations over GET are disabled' }] })
        return
      }
    }
    next()
  })

  const redis = app.get(RedisService)
  app.use(
    session({
      store: new RedisStore({ client: redis }),
      name: config.get('SESSION_NAME', { infer: true }),
      secret: config.get('SESSION_SECRET', { infer: true }),
      resave: false,
      saveUninitialized: false,
      rolling: true,
      cookie: {
        httpOnly: true,
        secure: isProd,
        sameSite: 'lax',
        maxAge: config.get('SESSION_MAX_AGE_MS', { infer: true }),
        path: '/',
      },
    }),
  )

  app.setGlobalPrefix('api', { exclude: ['graphql'] })
}
