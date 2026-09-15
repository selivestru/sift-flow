import { Field, ID, InputType } from '@nestjs/graphql'
import { IsEmail, IsIn, IsString, MaxLength, MinLength } from 'class-validator'

import { Normalize } from '~/common/decorators/normalize.decorator.js'
import { WorkspaceRole } from '~/generated/prisma/client.js'

@InputType()
export class InviteWorkspaceMemberInput {
  @Field(() => ID)
  @IsString()
  @MinLength(1)
  @MaxLength(64)
  workspaceId!: string

  @Field()
  @IsEmail()
  @MaxLength(254)
  @Normalize()
  email!: string

  @Field(() => WorkspaceRole, { nullable: true, defaultValue: WorkspaceRole.MEMBER })
  @IsIn([WorkspaceRole.MEMBER, WorkspaceRole.ADMIN])
  role!: WorkspaceRole
}
