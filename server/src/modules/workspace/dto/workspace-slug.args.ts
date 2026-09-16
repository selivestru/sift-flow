import { ArgsType, Field, ID } from '@nestjs/graphql'
import { IsOptional, IsString, Matches, MaxLength, MinLength } from 'class-validator'

import { Normalize } from '~/common/decorators/normalize.decorator.js'
import {
  WORKSPACE_SLUG_MAX_LENGTH,
  WORKSPACE_SLUG_MIN_LENGTH,
  WORKSPACE_SLUG_PATTERN,
} from '~/modules/workspace/core/workspace-slug.js'

@ArgsType()
export class WorkspaceSlugArgs {
  @Field()
  @IsString()
  @MinLength(WORKSPACE_SLUG_MIN_LENGTH)
  @MaxLength(WORKSPACE_SLUG_MAX_LENGTH)
  @Matches(WORKSPACE_SLUG_PATTERN, {
    message: 'slug must be lowercase alphanumeric words separated by single hyphens',
  })
  @Normalize()
  slug!: string

  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(64)
  workspaceId?: string
}
