import { EmptyState, Spinner } from '@heroui/react'
import { Lock } from 'reicon-react'

import { getInvitationPermissions } from '~/entities/workspace'
import { useWorkspaceAccess } from '~/shared/hooks/useWorkspaceAccess'

import { formatInvitationsCount } from '../model/invitation-row'
import type { InvitationStatusFilter } from '../model/invitations-search'
import { useInvitationsQuery } from '../model/useInvitationsQuery'
import { InvitationsTable } from './InvitationsTable'
import { InvitationsToolbar } from './InvitationsToolbar'
import { JoinLinkCard } from './JoinLinkCard'

interface InvitationsScreenProps {
  slug: string
  filter: InvitationStatusFilter
  onFilterChange: (filter: InvitationStatusFilter) => void
}

const EMPTY_STATE_CLASS =
  'flex h-full min-h-80 w-full flex-col items-center justify-center gap-4 px-6 py-16'

export const InvitationsScreen = ({ slug, filter, onFilterChange }: InvitationsScreenProps) => {
  const { workspaceId, viewerRole, isPending } = useWorkspaceAccess(slug)
  const permissions = getInvitationPermissions(viewerRole)
  const { rows, isLoading, isFetching, errorMessage, refetch } = useInvitationsQuery(slug, filter)

  if (isPending) {
    return (
      <div className="flex min-h-80 items-center justify-center">
        <Spinner aria-label="Loading invitations" />
      </div>
    )
  }

  if (!permissions.canManageInvitations || !workspaceId) {
    return (
      <EmptyState className={EMPTY_STATE_CLASS}>
        <Lock className="text-muted size-6" />
        <span className="text-muted text-sm">
          Only workspace owners and admins can manage invitations
        </span>
      </EmptyState>
    )
  }

  return (
    <div className="relative flex flex-col gap-6">
      <InvitationsToolbar
        countLabel={isLoading || errorMessage ? null : formatInvitationsCount(rows.length)}
        filter={filter}
        isFetching={isFetching}
        onFilterChange={onFilterChange}
      />
      <InvitationsTable
        errorMessage={errorMessage}
        isFetching={isFetching}
        isLoading={isLoading}
        rows={rows}
        workspaceId={workspaceId}
        onMutated={refetch}
        onRetry={refetch}
      />
      <JoinLinkCard workspaceId={workspaceId} />
    </div>
  )
}
