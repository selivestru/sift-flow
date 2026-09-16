import { Avatar, Button, Chip, cn, EmptyState, Table, Typography } from '@heroui/react'
import { AlertCircle, Eye, Magnifier, Users } from 'reicon-react'

import {
  WORKSPACE_MEMBER_STATUS_COLOR,
  WORKSPACE_MEMBER_STATUS_LABELS,
  WORKSPACE_ROLE_COLOR,
  WORKSPACE_ROLE_LABELS,
} from '~/entities/workspace'
import { useAuthStore } from '~/shared/stores/auth.store'
import { getInitials } from '~/shared/utils/getInitials'

import type { MemberRow } from '../model/member-row'
import { MembersSkeleton } from './MembersSkeleton'

interface MembersTableProps {
  rows: MemberRow[]
  isLoading: boolean
  isFetching: boolean
  errorMessage: string | null
  hasFilters: boolean
  footer?: React.ReactNode
  onRetry: () => void
  onClearFilters: () => void
  onSelectMember: (member: MemberRow) => void
}

const EMPTY_STATE_CLASS =
  'flex h-full min-h-80 w-full flex-col items-center justify-center gap-4 px-6 py-16'

export const MembersTable = ({
  rows,
  isLoading,
  isFetching,
  errorMessage,
  hasFilters,
  footer,
  onRetry,
  onClearFilters,
  onSelectMember,
}: MembersTableProps) => {
  const viewerId = useAuthStore((state) => state.user?.id)

  return (
    <Table className={cn('px-2', isFetching && 'animate-pulse')}>
      <Table.ScrollContainer>
        <Table.Content aria-label="Workspace members" aria-busy={isFetching}>
          <Table.Header>
            <Table.Column isRowHeader>Member</Table.Column>
            <Table.Column>Role</Table.Column>
            <Table.Column>Status</Table.Column>
            <Table.Column>Joined</Table.Column>
            <Table.Column>
              <span className="sr-only">Actions</span>
            </Table.Column>
          </Table.Header>
          <Table.Body
            items={rows}
            renderEmptyState={() => {
              if (isLoading) {
                return <MembersSkeleton />
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

              if (hasFilters) {
                return (
                  <EmptyState className={EMPTY_STATE_CLASS}>
                    <Magnifier className="text-muted size-6" />
                    <span className="text-muted text-sm">No members match these filters</span>
                    <Button variant="outline" onPress={onClearFilters}>
                      Clear filters
                    </Button>
                  </EmptyState>
                )
              }

              return (
                <EmptyState className={EMPTY_STATE_CLASS}>
                  <Users className="text-muted size-6" />
                  <span className="text-muted text-sm">Nobody has joined this workspace yet</span>
                </EmptyState>
              )
            }}
          >
            {(member) => (
              <Table.Row>
                <Table.Cell>
                  <div className="flex items-center gap-3">
                    <Avatar className="size-8 shrink-0">
                      <Avatar.Fallback>{getInitials(member.fullName)}</Avatar.Fallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <Typography type="body-sm" weight="medium">
                          {member.fullName}
                        </Typography>
                        {member.userId === viewerId && (
                          <Chip size="sm" variant="soft" color="accent">
                            You
                          </Chip>
                        )}
                      </div>
                      <Typography color="muted" type="body-xs">
                        {member.email}
                      </Typography>
                    </div>
                  </div>
                </Table.Cell>
                <Table.Cell>
                  <Chip variant="soft" color={WORKSPACE_ROLE_COLOR[member.role]} size="sm">
                    {WORKSPACE_ROLE_LABELS[member.role]}
                  </Chip>
                </Table.Cell>
                <Table.Cell>
                  <Chip
                    variant="soft"
                    color={WORKSPACE_MEMBER_STATUS_COLOR[member.status]}
                    size="sm"
                  >
                    {WORKSPACE_MEMBER_STATUS_LABELS[member.status]}
                  </Chip>
                </Table.Cell>
                <Table.Cell>
                  <Typography className="tabular-nums" type="body-sm">
                    {member.joinedAt}
                  </Typography>
                </Table.Cell>
                <Table.Cell>
                  <Button
                    isIconOnly
                    aria-label={`View details of ${member.fullName}`}
                    variant="ghost"
                    onPress={() => onSelectMember(member)}
                  >
                    <Eye className="size-5" />
                  </Button>
                </Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table.Content>
      </Table.ScrollContainer>
      {footer && <Table.Footer className="px-2">{footer}</Table.Footer>}
    </Table>
  )
}
