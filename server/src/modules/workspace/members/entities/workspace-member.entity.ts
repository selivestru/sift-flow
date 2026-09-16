import { Field, ID, Int, ObjectType, registerEnumType } from '@nestjs/graphql'

import { WorkspaceMemberStatus, WorkspaceRole } from '~/generated/prisma/client.js'
import { UserType } from '~/modules/auth/entities/auth.entity.js'
import { WorkspaceType } from '~/modules/workspace/core/workspace.entity.js'

registerEnumType(WorkspaceMemberStatus, { name: 'WorkspaceMemberStatus' })

export const WorkspaceTaskMode = {
  UNASSIGN: 'UNASSIGN',
  REASSIGN: 'REASSIGN',
} as const

export type WorkspaceTaskMode = (typeof WorkspaceTaskMode)[keyof typeof WorkspaceTaskMode]

registerEnumType(WorkspaceTaskMode, { name: 'WorkspaceTaskMode' })

@ObjectType()
export class WorkspaceMemberType {
  @Field(() => ID)
  id!: string

  @Field(() => WorkspaceRole)
  role!: WorkspaceRole

  @Field(() => WorkspaceMemberStatus)
  status!: WorkspaceMemberStatus

  @Field(() => UserType)
  user!: UserType

  @Field()
  joinedAt!: Date

  @Field(() => [WorkspaceMemberProjectType])
  projects!: WorkspaceMemberProjectType[]

  @Field(() => [WorkspaceMemberTaskType])
  assignedTasks!: WorkspaceMemberTaskType[]
}

@ObjectType()
export class WorkspaceMemberPageType {
  @Field(() => [WorkspaceMemberType])
  members!: WorkspaceMemberType[]

  @Field(() => Int)
  total!: number
}

@ObjectType()
export class WorkspaceMemberProjectType {
  @Field(() => ID)
  id!: string

  @Field()
  name!: string
}

@ObjectType()
export class WorkspaceMemberTaskType {
  @Field(() => ID)
  id!: string

  @Field()
  title!: string
}

@ObjectType()
export class WorkspaceMemberRemovalType {
  @Field(() => WorkspaceMemberType)
  member!: WorkspaceMemberType

  @Field(() => WorkspaceType)
  workspace!: WorkspaceType
}
