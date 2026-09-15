import { Field, ID, Int, ObjectType, registerEnumType } from '@nestjs/graphql'

import { WorkspaceRole } from '~/generated/prisma/client.js'

registerEnumType(WorkspaceRole, { name: 'WorkspaceRole' })

@ObjectType()
export class WorkspaceType {
  @Field(() => ID)
  id!: string

  @Field()
  name!: string

  @Field()
  slug!: string

  @Field(() => WorkspaceRole)
  role!: WorkspaceRole

  @Field(() => Int)
  membersCount!: number

  @Field()
  createdAt!: Date

  @Field()
  updatedAt!: Date
}
