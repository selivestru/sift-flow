import { ArgsType, Field, ID } from '@nestjs/graphql'
import { IsString, MaxLength, MinLength } from 'class-validator'

import { Trim } from '~/common/decorators/trim.decorator.js'

@ArgsType()
export class WorkspaceJoinLinkArgs {
  @Field(() => ID)
  @IsString()
  @MinLength(1)
  @MaxLength(64)
  workspaceId!: string
}

@ArgsType()
export class WorkspaceJoinPreviewArgs {
  @Field()
  @IsString()
  @MinLength(16)
  @MaxLength(128)
  @Trim()
  token!: string
}
