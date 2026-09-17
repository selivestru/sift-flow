import { Button, Chip, EmptyState, Table, Typography, cn } from '@heroui/react'
import { AlertCircle, Envelope } from 'reicon-react'

import {
  INVITATION_STATUS_COLOR,
  INVITATION_STATUS_LABELS,
  WORKSPACE_ROLE_COLOR,
  WORKSPACE_ROLE_LABELS,
} from '~/entities/workspace'

import type { InvitationRow } from '../model/invitation-row'
import { InvitationActions } from './InvitationActions'
import { InvitationsSkeleton } from './InvitationsSkeleton'

const EMPTY_STATE_CLASS =
  'flex h-full min-h-80 w-full flex-col items-center justify-center gap-4 px-6 py-16'

interface InvitationsTableProps {
  rows: InvitationRow[]
  workspaceId: string
  isLoading: boolean
  isFetching: boolean
  errorMessage: string | null
  onRetry: () => void
  onMutated: () => void
}

export const InvitationsTable = ({
  rows,
  workspaceId,
  isLoading,
  isFetching,
  errorMessage,
  onRetry,
  onMutated,
}: InvitationsTableProps) => {
  return (
    <Table className={cn('px-2', isFetching && 'animate-pulse')}>
      <Table.ScrollContainer>
        <Table.Content
          aria-label="Workspace invitations"
          aria-busy={isFetching}
          className="min-w-232 table-fixed"
        >
          <Table.Header>
            <Table.Column isRowHeader className="w-[16rem]">
              Email
            </Table.Column>
            <Table.Column className="w-28">Role</Table.Column>
            <Table.Column className="w-32">Status</Table.Column>
            <Table.Column className="w-44">Invited by</Table.Column>
            <Table.Column className="w-32">Expires</Table.Column>
            <Table.Column className="w-32">
              <span className="sr-only">Actions</span>
            </Table.Column>
          </Table.Header>
          <Table.Body
            items={rows}
            renderEmptyState={() => {
              if (isLoading) {
                return <InvitationsSkeleton />
              }

              if (errorMessage) {
                return (
                  <EmptyState className={EMPTY_STATE_CLASS}>
                    <AlertCircle className="text-danger size-6" />
                    <span className="text-muted text-sm">{errorMessage}</span>
                    <Button variant="outline" onPress={onRetry}>
                      Try again
                    </Button>
                  </EmptyState>
                )
              }

              return (
                <EmptyState className={EMPTY_STATE_CLASS}>
                  <Envelope className="text-muted size-6" />
                  <span className="text-muted text-sm">No invitations match this filter</span>
                </EmptyState>
              )
            }}
          >
            {(invitation) => (
              <Table.Row>
                <Table.Cell>
                  <div className="flex flex-col">
                    <Typography truncate type="body-sm" weight="medium">
                      {invitation.email}
                    </Typography>
                    <Typography color="muted" truncate type="body-xs">
                      Invited {invitation.createdAt}
                    </Typography>
                  </div>
                </Table.Cell>
                <Table.Cell>
                  <Chip variant="soft" color={WORKSPACE_ROLE_COLOR[invitation.role]} size="sm">
                    {WORKSPACE_ROLE_LABELS[invitation.role]}
                  </Chip>
                </Table.Cell>
                <Table.Cell>
                  <Chip variant="soft" color={INVITATION_STATUS_COLOR[invitation.status]} size="sm">
                    {INVITATION_STATUS_LABELS[invitation.status]}
                  </Chip>
                </Table.Cell>
                <Table.Cell>
                  <Typography truncate type="body-sm">
                    {invitation.invitedBy}
                  </Typography>
                </Table.Cell>
                <Table.Cell>
                  <Typography className="tabular-nums" type="body-sm">
                    {invitation.expiresAt}
                  </Typography>
                </Table.Cell>
                <Table.Cell>
                  <InvitationActions
                    invitation={invitation}
                    workspaceId={workspaceId}
                    onMutated={onMutated}
                  />
                </Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table.Content>
      </Table.ScrollContainer>
    </Table>
  )
}
