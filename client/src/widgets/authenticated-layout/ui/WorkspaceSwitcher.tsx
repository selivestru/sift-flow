import { Button, Chip, Description, Dropdown, Label, Separator, Typography } from '@heroui/react'
import { useNavigate, useParams } from '@tanstack/react-router'
import { useState } from 'react'
import { Check, ChevronDown, Plus } from 'reicon-react'
import { useQuery } from 'urql'

import {
  setLastOpenedWorkspace,
  WORKSPACE_ROLE_COLOR,
  WORKSPACE_ROLE_LABELS,
} from '~/entities/workspace'
import { WorkspaceFormModal, type WorkspaceSummary } from '~/features/workspace-form'
import { MyWorkspacesDocument } from '~/shared/api/workspace'

const WORKSPACE_LIMIT = 5

const CREATE_WORKSPACE_KEY = 'new-workspace'

const formatMembers = (count: number) => (count === 1 ? '1 member' : `${count} members`)

const getMonogram = (name: string) => name.charAt(0).toUpperCase()

export const WorkspaceSwitcher = () => {
  const [{ data }] = useQuery({ query: MyWorkspacesDocument, requestPolicy: 'cache-only' })
  const { slug } = useParams({ from: '/_authenticated/_shell/w/$slug' })
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const navigate = useNavigate()

  const workspaces = data?.myWorkspaces ?? []
  const ownedWorkspaceCount = workspaces.filter((workspace) => workspace.role === 'OWNER').length
  const activeWorkspace = workspaces.find((workspace) => workspace.slug === slug) ?? workspaces[0]

  if (!activeWorkspace) return null

  const handleAction = (key: React.Key) => {
    if (key === CREATE_WORKSPACE_KEY) {
      setIsCreateOpen(true)
      return
    }

    setLastOpenedWorkspace(String(key))
    navigate({ to: '/w/$slug/dashboard', params: { slug: String(key) } })
  }

  const handleCreated = (workspace: WorkspaceSummary) => {
    setLastOpenedWorkspace(workspace.slug)
    navigate({ to: '/w/$slug/dashboard', params: { slug: workspace.slug } })
  }

  return (
    <div className="border-separator border-b p-2">
      <Dropdown>
        <Button className="h-auto w-full justify-start gap-2.5 px-2 py-2" variant="ghost">
          <span className="bg-surface-secondary border-border flex size-8 shrink-0 items-center justify-center border text-sm font-semibold">
            {getMonogram(activeWorkspace.name)}
          </span>
          <div className="flex items-center gap-1.5 overflow-hidden">
            <span className="t-sidebar-label inline-block flex-1 overflow-hidden">
              <Typography truncate type="body-sm" weight="medium">
                {activeWorkspace.name}
              </Typography>
              <Typography color="muted" truncate type="body-xs">
                {formatMembers(activeWorkspace.membersCount)}
              </Typography>
            </span>
            <Chip variant="soft" size="sm" color={WORKSPACE_ROLE_COLOR[activeWorkspace.role]}>
              {WORKSPACE_ROLE_LABELS[activeWorkspace.role]}
            </Chip>
          </div>
          <ChevronDown className="t-sidebar-label text-muted size-4 shrink-0" />
        </Button>
        <Dropdown.Popover>
          <Dropdown.Menu onAction={handleAction}>
            {workspaces.map((workspace) => (
              <Dropdown.Item key={workspace.id} id={workspace.slug} textValue={workspace.name}>
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5">
                    <Label>{workspace.name}</Label>
                    <Chip variant="soft" size="sm" color={WORKSPACE_ROLE_COLOR[workspace.role]}>
                      {WORKSPACE_ROLE_LABELS[workspace.role]}
                    </Chip>
                  </div>
                  <Description>{formatMembers(workspace.membersCount)}</Description>
                </div>
                {workspace.id === activeWorkspace.id && (
                  <Check className="text-accent ms-auto size-4 shrink-0" />
                )}
              </Dropdown.Item>
            ))}
            <Separator />
            <Dropdown.Item
              id={CREATE_WORKSPACE_KEY}
              isDisabled={ownedWorkspaceCount >= WORKSPACE_LIMIT}
              textValue="New workspace"
            >
              <Plus className="text-muted size-4 shrink-0" />
              <Label>New workspace</Label>
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown.Popover>
      </Dropdown>
      <WorkspaceFormModal
        isOpen={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onSuccess={handleCreated}
      />
    </div>
  )
}
