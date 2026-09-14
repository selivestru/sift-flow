import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'

import type { GraphQLContext } from '~/common/types/graphql.types.js'

export const CurrentUser = createParamDecorator((_data: unknown, context: ExecutionContext) => {
  const ctx = GqlExecutionContext.create(context)
  const { req } = ctx.getContext<GraphQLContext>()
  return req.user
})
