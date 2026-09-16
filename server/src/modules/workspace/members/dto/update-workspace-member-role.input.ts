import { Field, ID, InputType } from '@nestjs/graphql'
import { IsIn, IsString, MaxLength, MinLength } from 'class-validator'

import { WorkspaceRole } from '~/generated/prisma/client.js'

@InputType()
export class UpdateWorkspaceMemberRoleInput {
  @Field(() => ID)
  @IsString()
  @MinLength(1)
  @MaxLength(64)
  workspaceId!: string

  @Field(() => ID)
  @IsString()
  @MinLength(1)
  @MaxLength(64)
  userId!: string

  @Field(() => WorkspaceRole)
  @IsIn([WorkspaceRole.MEMBER, WorkspaceRole.ADMIN])
  role!: WorkspaceRole
}
