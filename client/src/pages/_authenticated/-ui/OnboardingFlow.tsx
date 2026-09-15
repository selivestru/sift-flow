import { useNavigate } from '@tanstack/react-router'
import { useState } from 'react'

import type { WorkspaceSummary } from '~/features/workspace-form'

import { CreateWorkspaceStep } from './CreateWorkspaceStep'
import { InviteMembersStep } from './InviteMembersStep'
import { StepRail } from './StepRail'

export const OnboardingFlow = () => {
  const navigate = useNavigate()

  const [workspace, setWorkspace] = useState<WorkspaceSummary | null>(null)

  const openWorkspace = () => {
    if (!workspace) {
      return
    }

    navigate({ to: '/w/$slug', params: { slug: workspace.slug } })
  }

  return (
    <div className="flex flex-col gap-6">
      <StepRail currentStep={workspace ? 'members' : 'workspace'} />
      {workspace ? (
        <InviteMembersStep workspace={workspace} onFinish={openWorkspace} />
      ) : (
        <CreateWorkspaceStep onCreated={setWorkspace} />
      )}
    </div>
  )
}
