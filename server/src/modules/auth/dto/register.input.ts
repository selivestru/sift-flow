import { Field, InputType } from '@nestjs/graphql'
import { IsEmail, IsString, Matches, MaxLength, MinLength } from 'class-validator'

import { Trim } from '~/common/decorators/trim.decorator.js'

@InputType()
export class RegisterInput {
  @Field()
  @IsEmail()
  @MaxLength(254)
  @Trim()
  email!: string

  @Field()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  @Trim()
  fullName!: string

  @Field()
  @IsString()
  @MinLength(8)
  @MaxLength(128)
  @Matches(/\p{L}/u, { message: 'must contain at least one letter' })
  @Matches(/\p{N}/u, { message: 'must contain at least one digit' })
  @Trim()
  password!: string
}
