import { Field, ID, InputType } from '@nestjs/graphql'
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsIn,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator'

import { WorkspaceRole } from '~/generated/prisma/client.js'

@InputType()
export class InviteWorkspaceMembersInput {
  @Field(() => ID)
  @IsString()
  @MinLength(1)
  @MaxLength(64)
  workspaceId!: string

  @Field(() => [String])
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(50)
  @IsString({ each: true })
  @MaxLength(254, { each: true })
  emails!: string[]

  @Field(() => WorkspaceRole, { nullable: true, defaultValue: WorkspaceRole.MEMBER })
  @IsIn([WorkspaceRole.MEMBER, WorkspaceRole.ADMIN])
  role!: WorkspaceRole
}
