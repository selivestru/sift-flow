import { createFileRoute, Outlet } from '@tanstack/react-router'

import { getInvitationPermissions } from '~/entities/workspace'
import { InviteMemberModal } from '~/features/invite-workspace-member'
import { useWorkspaceAccess } from '~/shared/hooks/useWorkspaceAccess'
import { useInvitationsRefresh } from '~/widgets/workspace-invitations'
import { MembersTabs } from '~/widgets/workspace-members'

export const Route = createFileRoute('/_authenticated/_shell/w/$slug/members')({
  component: RouteComponent,
})

function RouteComponent() {
  const { slug } = Route.useParams()
  const { workspaceId, viewerRole } = useWorkspaceAccess(slug)
  const permissions = getInvitationPermissions(viewerRole)
  const requestRefresh = useInvitationsRefresh((state) => state.requestRefresh)

  return (
    <div className="flex flex-col gap-6 px-4 py-6 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <MembersTabs slug={slug} />
        {workspaceId && permissions.canManageInvitations && (
          <InviteMemberModal
            assignableRoles={permissions.assignableRoles}
            workspaceId={workspaceId}
            onInvited={requestRefresh}
          />
        )}
      </div>
      <Outlet />
    </div>
  )
}
