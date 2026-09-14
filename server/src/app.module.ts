import { join } from 'node:path'

import { YogaDriver, YogaDriverConfig } from '@graphql-yoga/nestjs'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_GUARD } from '@nestjs/core'
import { GraphQLModule } from '@nestjs/graphql'
import { ThrottlerModule } from '@nestjs/throttler'

import { AppController } from './app.controller.js'
import { GqlThrottlerGuard } from './common/guards/gql-throttler.guard.js'
import { SessionAuthGuard } from './common/guards/session-auth.guard.js'
import type { GraphQLContext } from './common/types/graphql.types.js'
import { validateEnv } from './config/env.config.js'
import { PrismaModule } from './infrastructure/prisma/prisma.module.js'
import { RedisModule } from './infrastructure/redis/redis.module.js'
import { AuthModule } from './modules/auth/auth.module.js'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validate: validateEnv }),
    ThrottlerModule.forRoot({
      throttlers: [{ ttl: 60_000, limit: 100 }],
    }),
    GraphQLModule.forRoot<YogaDriverConfig>({
      driver: YogaDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      introspection: true,
      graphiql: true,
      context: ({ req, res }: GraphQLContext) => ({ req, res }),
    }),
    RedisModule,
    PrismaModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    { provide: APP_GUARD, useClass: GqlThrottlerGuard },
    { provide: APP_GUARD, useClass: SessionAuthGuard },
  ],
})
export class AppModule {}
