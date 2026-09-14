import { ExecutionContext, Injectable } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import { ThrottlerGuard } from '@nestjs/throttler'

import { codedException } from '../errors/coded.exception.js'
import { ErrorCode } from '../errors/error-code.js'
import { GraphQLContext } from '../types/graphql.types.js'

@Injectable()
export class GqlThrottlerGuard extends ThrottlerGuard {
  protected override async throwThrottlingException(): Promise<void> {
    throw codedException(ErrorCode.TOO_MANY_REQUESTS)
  }

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
