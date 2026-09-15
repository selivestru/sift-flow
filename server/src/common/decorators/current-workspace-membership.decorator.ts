import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'

import { codedException } from '~/common/errors/coded.exception.js'
import { ErrorCode } from '~/common/errors/error-code.js'
import type { GraphQLContext } from '~/common/types/graphql.types.js'
import type { WorkspaceMembership } from '~/common/types/workspace.types.js'

export const CurrentWorkspaceMembership = createParamDecorator(
  (_data: unknown, context: ExecutionContext): WorkspaceMembership => {
    const { req } = GqlExecutionContext.create(context).getContext<GraphQLContext>()

    if (!req.workspace) {
      throw codedException(ErrorCode.INTERNAL_SERVER_ERROR)
    }

    return req.workspace
  },
)
