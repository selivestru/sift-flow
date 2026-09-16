import { Alert, Avatar, Button, Chip, Drawer, Separator, Skeleton, Typography } from '@heroui/react'

import {
  WORKSPACE_MEMBER_STATUS_COLOR,
  WORKSPACE_MEMBER_STATUS_LABELS,
  WORKSPACE_ROLE_COLOR,
  WORKSPACE_ROLE_LABELS,
} from '~/entities/workspace'
import { useAuthStore } from '~/shared/stores/auth.store'
import { getInitials } from '~/shared/utils/getInitials'

import type { MemberRow } from '../model/member-row'
import { useMemberDetails } from '../model/useMemberDetails'
import { useWorkspaceAccess } from '../model/useWorkspaceAccess'
import { MemberManageSection } from './MemberManageSection'

interface MemberDetailsDrawerProps {
  slug: string
  member: MemberRow | null
  onClose: () => void
}

const DETAIL_LABELS = ['Role', 'Status', 'Joined'] as const

export const MemberDetailsDrawer = ({ slug, member, onClose }: MemberDetailsDrawerProps) => {
  const { details, isFetching, errorMessage, retry } = useMemberDetails(
    slug,
    member?.userId ?? null,
  )
  const { workspaceId, viewerRole } = useWorkspaceAccess(slug)
  const viewerId = useAuthStore((state) => state.user?.id)
  const isSelf = member !== null && member.userId === viewerId

  return (
    <Drawer.Backdrop
      isOpen={member !== null}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          onClose()
        }
      }}
    >
      <Drawer.Content placement="right">
        <Drawer.Dialog>
          <Drawer.CloseTrigger />
          <Drawer.Header>
            <div className="flex items-center gap-3">
              <Avatar className="size-10 shrink-0">
                <Avatar.Fallback>{getInitials(member?.fullName ?? '')}</Avatar.Fallback>
              </Avatar>
              <div className="flex min-w-0 flex-col">
                <Drawer.Heading className="truncate">{member?.fullName}</Drawer.Heading>
                <Typography color="muted" truncate type="body-sm">
                  {member?.email}
                </Typography>
              </div>
            </div>
          </Drawer.Header>
          <Drawer.Body className="flex flex-col gap-6">
            {errorMessage && (
              <div className="flex flex-col items-start gap-3">
                <Alert status="danger">
                  <Alert.Indicator />
                  <Alert.Content>
                    <Alert.Title>Could not load this member</Alert.Title>
                    <Alert.Description>{errorMessage}</Alert.Description>
                  </Alert.Content>
                </Alert>
                <Button variant="outline" onPress={retry}>
                  Try again
                </Button>
              </div>
            )}
            {!errorMessage && isFetching && !details && (
              <div className="flex flex-col gap-2">
                {DETAIL_LABELS.map((label) => (
                  <Skeleton key={label} className="h-5 w-full" />
                ))}
              </div>
            )}
            {!errorMessage && details && (
              <>
                <Separator />
                <dl className="flex flex-col gap-2">
                  <div className="flex items-center justify-between gap-4">
                    <dt className="text-muted text-sm">Role</dt>
                    <dd>
                      <Chip size="sm" variant="soft" color={WORKSPACE_ROLE_COLOR[details.role]}>
                        {WORKSPACE_ROLE_LABELS[details.role]}
                      </Chip>
                    </dd>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <dt className="text-muted text-sm">Status</dt>
                    <dd>
                      <Chip
                        size="sm"
                        variant="soft"
                        color={WORKSPACE_MEMBER_STATUS_COLOR[details.status]}
                      >
                        {WORKSPACE_MEMBER_STATUS_LABELS[details.status]}
                      </Chip>
                    </dd>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <dt className="text-muted text-sm">Joined</dt>
                    <dd className="text-foreground text-sm font-medium tabular-nums">
                      {details.joinedAt}
                    </dd>
                  </div>
                </dl>
                <Separator />
                <section className="flex flex-col gap-2">
                  <Typography type="body-sm" weight="semibold">
                    Projects
                  </Typography>
                  {details.projects.length > 0 ? (
                    <ul className="flex flex-col gap-2">
                      {details.projects.map((project) => (
                        <li key={project.id} className="text-foreground text-sm">
                          {project.name}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <Typography color="muted" type="body-sm">
                      No projects yet.
                    </Typography>
                  )}
                </section>
                <Separator />
                <section className="flex flex-col gap-2">
                  <Typography type="body-sm" weight="semibold">
                    Assigned tasks
                  </Typography>
                  {details.assignedTasks.length > 0 ? (
                    <ul className="flex flex-col gap-2">
                      {details.assignedTasks.map((task) => (
                        <li key={task.id} className="text-foreground text-sm">
                          {task.title}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <Typography color="muted" type="body-sm">
                      Nothing assigned yet.
                    </Typography>
                  )}
                </section>
                {workspaceId && (
                  <MemberManageSection
                    isSelf={isSelf}
                    memberName={details.fullName}
                    role={details.role}
                    userId={member?.userId ?? ''}
                    viewerRole={viewerRole}
                    workspaceId={workspaceId}
                    onRemoved={onClose}
                  />
                )}
              </>
            )}
          </Drawer.Body>
        </Drawer.Dialog>
      </Drawer.Content>
    </Drawer.Backdrop>
  )
}
