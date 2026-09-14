import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Reflector } from '@nestjs/core'
import { GqlExecutionContext } from '@nestjs/graphql'

import { EnvConfig } from '~/config/env.config.js'
import { PrismaService } from '~/infrastructure/prisma/prisma.service.js'

import { IS_PUBLIC_KEY } from '../decorators/public.decorator.js'
import { codedException } from '../errors/coded.exception.js'
import { ErrorCode } from '../errors/error-code.js'
import { GraphQLContext } from '../types/graphql.types.js'

@Injectable()
export class SessionAuthGuard implements CanActivate {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService<EnvConfig, true>,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ])

    if (isPublic) return true

    const gql = GqlExecutionContext.create(context).getContext<GraphQLContext>()
    const req = gql?.req

    if (!req?.session) {
      throw codedException(ErrorCode.NOT_AUTHENTICATED)
    }

    const userId = req.session?.userId

    if (!userId) {
      throw codedException(ErrorCode.NOT_AUTHENTICATED)
    }

    const absoluteMax = this.config.get('SESSION_ABSOLUTE_MAX_AGE_MS', {
      infer: true,
    })

    const createdAt = req.session.createdAt

    if (typeof createdAt === 'number' && Date.now() - createdAt > absoluteMax) {
      await new Promise<void>((resolve) => {
        req.session.destroy(resolve)
      })

      throw codedException(ErrorCode.SESSION_EXPIRED)
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, fullName: true },
    })

    if (!user) {
      throw codedException(ErrorCode.NOT_AUTHENTICATED)
    }

    req.user = user

    return true
  }
}
