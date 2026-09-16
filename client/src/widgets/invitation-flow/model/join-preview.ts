import type { CombinedError } from 'urql'

import type { WorkspaceJoinPreviewQuery } from '~/shared/api/graphql'

export const JoinPreviewFailure = {
  INVALID: 'INVALID',
  EXPIRED: 'EXPIRED',
  UNREACHABLE: 'UNREACHABLE',
} as const

export type JoinPreviewFailure = (typeof JoinPreviewFailure)[keyof typeof JoinPreviewFailure]

export type JoinPreview = WorkspaceJoinPreviewQuery['workspaceJoinPreview']

export type JoinPreviewState =
  | { status: 'ready'; preview: JoinPreview }
  | { status: 'unavailable'; reason: JoinPreviewFailure }

export const JOIN_PREVIEW_FAILURE_COPY: Record<
  JoinPreviewFailure,
  { title: string; description: string }
> = {
  INVALID: {
    title: 'This invite link is no longer active',
    description:
      'It was revoked or replaced by a new link. Ask a workspace admin for a fresh invitation.',
  },
  EXPIRED: {
    title: 'This invitation has expired',
    description: 'Invitations stay open for 7 days. Ask a workspace admin to send you a new one.',
  },
  UNREACHABLE: {
    title: 'We could not load this invitation',
    description: 'Check your connection and try again.',
  },
}

const FAILURE_REASONS_BY_CODE: Record<string, JoinPreviewFailure> = {
  WORKSPACE_JOIN_LINK_INVALID: JoinPreviewFailure.INVALID,
  INVITATION_EXPIRED: JoinPreviewFailure.EXPIRED,
}

export const isEmailInvitation = (preview: JoinPreview) => preview.kind === 'EMAIL'

export const getInvitedEmail = (preview: JoinPreview) =>
  isEmailInvitation(preview) ? (preview.email ?? null) : null

export const toJoinPreviewFailure = (error?: CombinedError): JoinPreviewFailure => {
  const code = error?.graphQLErrors.at(0)?.extensions?.code

  if (typeof code !== 'string') {
    return JoinPreviewFailure.UNREACHABLE
  }

  return FAILURE_REASONS_BY_CODE[code] ?? JoinPreviewFailure.UNREACHABLE
}
