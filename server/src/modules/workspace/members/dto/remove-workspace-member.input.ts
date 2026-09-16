import { Field, ID, InputType } from '@nestjs/graphql'
import { IsIn, IsOptional, IsString, MaxLength, MinLength, ValidateIf } from 'class-validator'

import { WorkspaceTaskMode } from '~/modules/workspace/members/entities/workspace-member.entity.js'

@InputType()
export class RemoveWorkspaceMemberTasksInput {
  @Field(() => WorkspaceTaskMode)
  @IsIn([WorkspaceTaskMode.UNASSIGN, WorkspaceTaskMode.REASSIGN])
  mode!: WorkspaceTaskMode

  @Field(() => ID, { nullable: true })
  @ValidateIf((input: RemoveWorkspaceMemberTasksInput) => input.mode === WorkspaceTaskMode.REASSIGN)
  @IsString()
  @MinLength(1)
  @MaxLength(64)
  reassignToUserId?: string
}

@InputType()
export class RemoveWorkspaceMemberInput {
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

  @Field(() => RemoveWorkspaceMemberTasksInput, { nullable: true })
  @IsOptional()
  tasks?: RemoveWorkspaceMemberTasksInput
}
