import { ArgsType, Field, ID, Int } from '@nestjs/graphql'
import {
  IsArray,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator'

import { Trim } from '~/common/decorators/trim.decorator.js'
import { WorkspaceRole } from '~/generated/prisma/client.js'

export const WORKSPACE_MEMBERS_DEFAULT_LIMIT = 20
export const WORKSPACE_MEMBERS_MAX_LIMIT = 100

@ArgsType()
export class WorkspaceMembersArgs {
  @Field(() => ID)
  @IsString()
  @MinLength(1)
  @MaxLength(64)
  workspaceId!: string

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  @Trim()
  search?: string

  @Field(() => [WorkspaceRole], { nullable: true })
  @IsOptional()
  @IsArray()
  @IsEnum(WorkspaceRole, { each: true })
  roles?: WorkspaceRole[]

  @Field(() => Int, { nullable: true, defaultValue: WORKSPACE_MEMBERS_DEFAULT_LIMIT })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(WORKSPACE_MEMBERS_MAX_LIMIT)
  limit!: number

  @Field(() => Int, { nullable: true, defaultValue: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  offset!: number
}
