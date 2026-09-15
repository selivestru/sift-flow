import { Prisma, WorkspaceRole } from '~/generated/prisma/client.js'

import { WorkspaceType } from './entities/workspace.entity.js'

export const WORKSPACE_MEMBERS_COUNT_INCLUDE = {
  _count: { select: { members: true } },
} satisfies Prisma.WorkspaceInclude

export type WorkspaceWithMembersCount = Prisma.WorkspaceGetPayload<{
  include: typeof WORKSPACE_MEMBERS_COUNT_INCLUDE
}>

export const toWorkspaceType = (
  workspace: WorkspaceWithMembersCount,
  role: WorkspaceRole,
): WorkspaceType => {
  return {
    id: workspace.id,
    name: workspace.name,
    slug: workspace.slug,
    role,
    membersCount: workspace._count.members,
    createdAt: workspace.createdAt,
    updatedAt: workspace.updatedAt,
  }
}
