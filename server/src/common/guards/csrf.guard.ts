import { timingSafeEqual } from 'node:crypto'

import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'

import { codedException } from '../errors/coded.exception.js'
import { ErrorCode } from '../errors/error-code.js'
import { GraphQLContext } from '../types/graphql.types.js'

export const CSRF_HEADER_NAME = 'x-csrf-token'

@Injectable()
export class CsrfGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const ctx = GqlExecutionContext.create(context)

    const { req } = ctx.getContext<GraphQLContext>()

    if (!req?.session) {
      throw codedException(ErrorCode.INVALID_CSRF_TOKEN)
    }

    const expected = req.session?.csrfToken
    const header = req.headers[CSRF_HEADER_NAME]
    const actual = Array.isArray(header) ? header[0] : header

    if (!expected || !actual || !this.safeEqual(actual, expected)) {
      throw codedException(ErrorCode.INVALID_CSRF_TOKEN)
    }

    return true
  }

  private safeEqual(a: string, b: string): boolean {
    const ab = Buffer.from(a, 'utf8')
    const bb = Buffer.from(b, 'utf8')

    return ab.length === bb.length && timingSafeEqual(ab, bb)
  }
}
