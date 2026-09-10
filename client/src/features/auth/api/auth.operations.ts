import { graphql } from '~/shared/api/graphql'

export const MeDocument = graphql(/* GraphQL */ `
  query Me {
    me {
      id
      email
      fullName
    }
  }
`)

export const LoginDocument = graphql(/* GraphQL */ `
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      user {
        id
        email
        fullName
      }
    }
  }
`)

export const RegisterDocument = graphql(/* GraphQL */ `
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
      user {
        id
        email
        fullName
      }
    }
  }
`)

export const LogoutDocument = graphql(/* GraphQL */ `
  mutation Logout {
    logout
  }
`)
