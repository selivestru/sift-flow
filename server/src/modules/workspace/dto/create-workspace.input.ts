import { Field, InputType } from '@nestjs/graphql'
import { IsString, Matches, MaxLength, MinLength } from 'class-validator'

import { Normalize } from '~/common/decorators/normalize.decorator.js'
import { Trim } from '~/common/decorators/trim.decorator.js'

import {
  WORKSPACE_SLUG_MAX_LENGTH,
  WORKSPACE_SLUG_MIN_LENGTH,
  WORKSPACE_SLUG_PATTERN,
} from '../workspace-slug.js'

@InputType()
export class CreateWorkspaceInput {
  @Field()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  @Trim()
  name!: string

  @Field()
  @IsString()
  @MinLength(WORKSPACE_SLUG_MIN_LENGTH)
  @MaxLength(WORKSPACE_SLUG_MAX_LENGTH)
  @Matches(WORKSPACE_SLUG_PATTERN, {
    message: 'slug must be lowercase alphanumeric words separated by single hyphens',
  })
  @Normalize()
  slug!: string
}
