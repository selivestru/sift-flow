import { UseGuards } from '@nestjs/common'
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql'
import { Throttle } from '@nestjs/throttler'

import { CurrentUser } from '~/common/decorators/current-user.decorator.js'
import { Public } from '~/common/decorators/public.decorator.js'
import { CsrfGuard } from '~/common/guards/csrf.guard.js'
import { type GraphQLContext } from '~/common/types/graphql.types.js'

import { AuthService } from './auth.service.js'
import { LoginInput } from './dto/login.input.js'
import { RegisterInput } from './dto/register.input.js'
import { AuthPayload, UserType } from './entities/auth.entity.js'

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
  register(
    @Args('input') input: RegisterInput,
    @Context() ctx: GraphQLContext,
  ): Promise<AuthPayload> {
    return this.authService.register(input, ctx.req)
  }

  @Public()
  @Mutation(() => AuthPayload)
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @UseGuards(CsrfGuard)
  login(@Args('input') input: LoginInput, @Context() ctx: GraphQLContext): Promise<AuthPayload> {
    return this.authService.login(input, ctx.req)
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
