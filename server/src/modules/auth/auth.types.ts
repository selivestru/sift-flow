import { Field, ID, InputType, ObjectType } from '@nestjs/graphql'
import { Transform } from 'class-transformer'
import { IsEmail, IsString, Matches, MaxLength, MinLength } from 'class-validator'

const trim = () =>
  Transform(({ value }: { value: unknown }) => (typeof value === 'string' ? value.trim() : value))

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
}

@InputType()
export class RegisterInput {
  @Field()
  @IsEmail()
  @MaxLength(254)
  @trim()
  email!: string

  @Field()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  @trim()
  fullName!: string

  @Field()
  @IsString()
  @MinLength(8)
  @MaxLength(128)
  @Matches(/\p{L}/u, { message: 'must contain at least one letter' })
  @Matches(/\p{N}/u, { message: 'must contain at least one digit' })
  @trim()
  password!: string
}

@InputType()
export class LoginInput {
  @Field()
  @IsEmail()
  @MaxLength(254)
  @trim()
  email!: string

  @Field()
  @IsString()
  @MinLength(1)
  @MaxLength(128)
  @trim()
  password!: string
}
