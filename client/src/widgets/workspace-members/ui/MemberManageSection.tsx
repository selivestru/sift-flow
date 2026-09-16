import { Separator, Typography } from '@heroui/react'

import { getMemberPermissions } from '~/entities/workspace'
import { ChangeMemberRole } from '~/features/change-member-role'
import { RemoveMember } from '~/features/remove-workspace-member'
import type { WorkspaceRole } from '~/shared/api/graphql'

interface MemberManageSectionProps {
  workspaceId: string
  userId: string
  memberName: string
  role: WorkspaceRole
  viewerRole: WorkspaceRole | undefined
  isSelf: boolean
  onRemoved: () => void
}

export const MemberManageSection = ({
  workspaceId,
  userId,
  memberName,
  role,
  viewerRole,
  isSelf,
  onRemoved,
}: MemberManageSectionProps) => {
  const permissions = getMemberPermissions(viewerRole, role, isSelf)

  if (!permissions.canManage) {
    return null
  }

  return (
    <>
      <Separator />
      <section aria-label="Manage access" className="flex flex-col gap-3">
        <Typography type="body-sm" weight="semibold">
          Manage access
        </Typography>
        {permissions.canChangeRole && (
          <ChangeMemberRole
            assignableRoles={permissions.assignableRoles}
            memberName={memberName}
            role={role}
            userId={userId}
            workspaceId={workspaceId}
          />
        )}
        {permissions.canRemove && (
          <RemoveMember
            memberName={memberName}
            userId={userId}
            workspaceId={workspaceId}
            onRemoved={onRemoved}
          />
        )}
      </section>
    </>
  )
}
