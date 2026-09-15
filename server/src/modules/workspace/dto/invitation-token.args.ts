import { ArgsType, Field } from '@nestjs/graphql'
import { IsString, MaxLength, MinLength } from 'class-validator'

import { Trim } from '~/common/decorators/trim.decorator.js'

@ArgsType()
export class InvitationTokenArgs {
  @Field()
  @IsString()
  @MinLength(32)
  @MaxLength(128)
  @Trim()
  token!: string
}
