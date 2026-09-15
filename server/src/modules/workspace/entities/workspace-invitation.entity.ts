import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql'

import { InvitationStatus, WorkspaceRole } from '~/generated/prisma/client.js'
import { UserType } from '~/modules/auth/entities/auth.entity.js'

registerEnumType(InvitationStatus, { name: 'InvitationStatus' })

@ObjectType()
export class WorkspaceSummaryType {
  @Field(() => ID)
  id!: string

  @Field()
  name!: string

  @Field()
  slug!: string
}

@ObjectType()
export class WorkspaceInvitationType {
  @Field(() => ID)
  id!: string

  @Field()
  email!: string

  @Field(() => WorkspaceRole)
  role!: WorkspaceRole

  @Field(() => InvitationStatus)
  status!: InvitationStatus

  @Field()
  token!: string

  @Field()
  expiresAt!: Date

  @Field()
  createdAt!: Date

  @Field(() => WorkspaceSummaryType)
  workspace!: WorkspaceSummaryType

  @Field(() => UserType)
  invitedBy!: UserType
}
