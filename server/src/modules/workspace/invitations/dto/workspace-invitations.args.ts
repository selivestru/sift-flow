import { ArgsType, Field, ID } from '@nestjs/graphql'
import { IsArray, IsEnum, IsOptional, IsString, MaxLength, MinLength } from 'class-validator'

import { InvitationStatus } from '~/generated/prisma/client.js'

@ArgsType()
export class WorkspaceInvitationsArgs {
  @Field(() => ID)
  @IsString()
  @MinLength(1)
  @MaxLength(64)
  workspaceId!: string

  @Field(() => [InvitationStatus], { nullable: true })
  @IsOptional()
  @IsArray()
  @IsEnum(InvitationStatus, { each: true })
  statuses?: InvitationStatus[]
}
