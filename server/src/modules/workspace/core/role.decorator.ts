import { SetMetadata } from '@nestjs/common'

import type { WorkspaceRole } from '~/generated/prisma/client.js'

export const ROLE_KEY = 'role'

export const Role = (role: WorkspaceRole) => SetMetadata(ROLE_KEY, role)
