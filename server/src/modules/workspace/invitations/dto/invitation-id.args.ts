import { ArgsType, Field, ID } from '@nestjs/graphql'
import { IsString, MaxLength, MinLength } from 'class-validator'

@ArgsType()
export class InvitationIdArgs {
  @Field(() => ID)
  @IsString()
  @MinLength(1)
  @MaxLength(64)
  workspaceId!: string

  @Field(() => ID)
  @IsString()
  @MinLength(1)
  @MaxLength(64)
  invitationId!: string
}
