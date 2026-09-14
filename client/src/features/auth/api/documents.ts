import { graphql } from '~/shared/api/graphql'

export const CsrfTokenDocument = graphql(`
  query CsrfToken {
    csrfToken
  }
`)

export const MeDocument = graphql(`
  query Me {
    me {
      id
      email
      fullName
    }
  }
`)

export const LoginDocument = graphql(`
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

export const RegisterDocument = graphql(`
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
