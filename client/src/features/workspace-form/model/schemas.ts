import { z } from 'zod'

import {
  WORKSPACE_SLUG_MAX_LENGTH,
  WORKSPACE_SLUG_MIN_LENGTH,
  WORKSPACE_SLUG_PATTERN,
} from './workspace-slug'

const MAX_WORKSPACE_NAME_LENGTH = 100

export const workspaceFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Workspace name is required')
    .max(
      MAX_WORKSPACE_NAME_LENGTH,
      `Workspace name must be at most ${MAX_WORKSPACE_NAME_LENGTH} characters`,
    ),
  slug: z
    .string()
    .trim()
    .min(
      WORKSPACE_SLUG_MIN_LENGTH,
      `Workspace slug must be at least ${WORKSPACE_SLUG_MIN_LENGTH} characters`,
    )
    .max(
      WORKSPACE_SLUG_MAX_LENGTH,
      `Workspace slug must be at most ${WORKSPACE_SLUG_MAX_LENGTH} characters`,
    )
    .regex(
      WORKSPACE_SLUG_PATTERN,
      'Use lowercase letters, numbers and single hyphens — like acme-team',
    ),
})

export type WorkspaceFormValues = z.infer<typeof workspaceFormSchema>
