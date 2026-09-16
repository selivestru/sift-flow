import { Field, ID, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class UserType {
  @Field(() => ID)
  id!: string

  @Field()
  email!: string

  @Field()
  fullName!: string
}

@ObjectType()
export class AuthPayload {
  @Field(() => UserType)
  user!: UserType

  @Field(() => String, { nullable: true })
  joinedWorkspaceSlug?: string | null
}
