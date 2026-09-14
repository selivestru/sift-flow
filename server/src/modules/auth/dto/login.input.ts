import { Field, InputType } from '@nestjs/graphql'
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator'

import { Trim } from '~/common/decorators/trim.decorator.js'

@InputType()
export class LoginInput {
  @Field()
  @IsEmail()
  @MaxLength(254)
  @Trim()
  email!: string

  @Field()
  @IsString()
  @MinLength(1)
  @MaxLength(128)
  @Trim()
  password!: string
}
