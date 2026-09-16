import { Field, ID, InputType } from '@nestjs/graphql'
import { IsOptional, IsString, Matches, MaxLength, MinLength } from 'class-validator'

import { Normalize } from '~/common/decorators/normalize.decorator.js'
import { Trim } from '~/common/decorators/trim.decorator.js'
import {
  WORKSPACE_SLUG_MAX_LENGTH,
  WORKSPACE_SLUG_MIN_LENGTH,
  WORKSPACE_SLUG_PATTERN,
} from '~/modules/workspace/core/workspace-slug.js'

@InputType()
export class UpdateWorkspaceInput {
  @Field(() => ID)
  @IsString()
  @MinLength(1)
  @MaxLength(64)
  workspaceId!: string

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  @Trim()
  name?: string

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  @MinLength(WORKSPACE_SLUG_MIN_LENGTH)
  @MaxLength(WORKSPACE_SLUG_MAX_LENGTH)
  @Matches(WORKSPACE_SLUG_PATTERN, {
    message: 'slug must be lowercase alphanumeric words separated by single hyphens',
  })
  @Normalize()
  slug?: string
}
