import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql'

import { InvitationKind, InvitationStatus, WorkspaceRole } from '~/generated/prisma/client.js'
import { UserType } from '~/modules/auth/entities/auth.entity.js'

registerEnumType(InvitationStatus, { name: 'InvitationStatus' })
registerEnumType(InvitationKind, { name: 'InvitationKind' })

export const InviteResultStatus = {
  INVITED: 'INVITED',
  ALREADY_MEMBER: 'ALREADY_MEMBER',
  INVALID_EMAIL: 'INVALID_EMAIL',
} as const

export type InviteResultStatus = (typeof InviteResultStatus)[keyof typeof InviteResultStatus]

registerEnumType(InviteResultStatus, { name: 'InviteResultStatus' })

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

  @Field(() => String, { nullable: true })
  email?: string | null

  @Field(() => WorkspaceRole)
  role!: WorkspaceRole

  @Field(() => InvitationStatus)
  status!: InvitationStatus

  @Field()
  token!: string

  @Field(() => Date, { nullable: true })
  expiresAt?: Date | null

  @Field()
  createdAt!: Date

  @Field(() => WorkspaceSummaryType)
  workspace!: WorkspaceSummaryType

  @Field(() => UserType)
  invitedBy!: UserType
}

@ObjectType()
export class InviteResultType {
  @Field()
  email!: string

  @Field(() => InviteResultStatus)
  status!: InviteResultStatus

  @Field(() => WorkspaceInvitationType, { nullable: true })
  invitation?: WorkspaceInvitationType | null
}
