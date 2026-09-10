import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Reflector } from '@nestjs/core'
import { GqlExecutionContext } from '@nestjs/graphql'

import { IS_PUBLIC_KEY } from '~/common/decorators/public.decorator.js'
import { GraphQLContext } from '~/common/types/graphql.types.js'
import { EnvConfig } from '~/config/env.config.js'
import { PrismaService } from '~/infrastructure/prisma/prisma.service.js'

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
      throw new UnauthorizedException('Not authenticated')
    }

    const userId = req.session?.userId

    if (!userId) {
      throw new UnauthorizedException('Not authenticated')
    }

    const absoluteMax = this.config.get('SESSION_ABSOLUTE_MAX_AGE_MS', {
      infer: true,
    })

    const createdAt = req.session.createdAt

    if (typeof createdAt === 'number' && Date.now() - createdAt > absoluteMax) {
      await new Promise<void>((resolve) => {
        req.session.destroy(resolve)
      })

      throw new UnauthorizedException('Session expired')
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, fullName: true },
    })

    if (!user) {
      throw new UnauthorizedException('Not authenticated')
    }

    req.user = user

    return true
  }
}
