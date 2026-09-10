import { UseGuards } from '@nestjs/common'
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql'
import { Throttle } from '@nestjs/throttler'

import { Public } from '~/common/decorators/public.decorator.js'
import type { GraphQLContext } from '~/common/types/graphql.types.js'

import { AuthService } from './auth.service.js'
import { AuthPayload, LoginInput, RegisterInput, UserType } from './auth.types.js'
import { CsrfGuard } from './csrf.guard.js'
import { CurrentUser } from './current-user.decorator.js'

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Query(() => String)
  csrfToken(@Context() ctx: GraphQLContext): string {
    return this.authService.issueCsrfToken(ctx.req)
  }

  @Public()
  @Mutation(() => AuthPayload)
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @UseGuards(CsrfGuard)
  async register(
    @Args('input') input: RegisterInput,
    @Context() ctx: GraphQLContext,
  ): Promise<AuthPayload> {
    const user = await this.authService.register(input, ctx.req)
    return { user }
  }

  @Public()
  @Mutation(() => AuthPayload)
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @UseGuards(CsrfGuard)
  async login(
    @Args('input') input: LoginInput,
    @Context() ctx: GraphQLContext,
  ): Promise<AuthPayload> {
    const user = await this.authService.login(input, ctx.req)
    return { user }
  }

  @Mutation(() => Boolean)
  @UseGuards(CsrfGuard)
  async logout(@Context() ctx: GraphQLContext): Promise<boolean> {
    return this.authService.logout(ctx.req, ctx.res)
  }

  @Query(() => UserType)
  me(@CurrentUser() user: UserType): UserType {
    return user
  }
}
