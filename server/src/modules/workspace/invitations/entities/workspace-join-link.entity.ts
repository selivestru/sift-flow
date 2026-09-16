import { Field, ID, ObjectType } from '@nestjs/graphql'

import { InvitationKind, WorkspaceRole } from '~/generated/prisma/client.js'

@ObjectType()
export class WorkspaceJoinLinkType {
  @Field(() => ID)
  id!: string

  @Field()
  url!: string

  @Field(() => WorkspaceRole)
  role!: WorkspaceRole

  @Field(() => Date, { nullable: true })
  expiresAt?: Date | null

  @Field()
  createdAt!: Date
}

@ObjectType()
export class WorkspaceJoinPreviewType {
  @Field()
  name!: string

  @Field()
  slug!: string

  @Field(() => WorkspaceRole)
  role!: WorkspaceRole

  @Field(() => InvitationKind)
  kind!: InvitationKind

  @Field(() => String, { nullable: true })
  email?: string | null
}
