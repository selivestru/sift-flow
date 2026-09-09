import { ExecutionContext, Injectable } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import { ThrottlerGuard } from '@nestjs/throttler'

import type { GraphQLContext } from '~/common/types/graphql.types.js'

@Injectable()
export class GqlThrottlerGuard extends ThrottlerGuard {
  protected override getRequestResponse(context: ExecutionContext): {
    req: Record<string, unknown>
    res: Record<string, unknown>
  } {
    if (context.getType<string>() === 'graphql') {
      const ctx = GqlExecutionContext.create(context).getContext<GraphQLContext>()

      return {
        req: ctx.req as unknown as Record<string, unknown>,
        res: ctx.res as unknown as Record<string, unknown>,
      }
    }

    return super.getRequestResponse(context)
  }
}
