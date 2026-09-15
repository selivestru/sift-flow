import { useState } from 'react'
import { useQuery } from 'urql'

import { useDebounceEffect } from '~/shared/hooks/useDebounceEffect'

import { IsWorkspaceSlugAvailableDocument } from '../api/documents'
import {
  WORKSPACE_SLUG_MAX_LENGTH,
  WORKSPACE_SLUG_MIN_LENGTH,
  WORKSPACE_SLUG_PATTERN,
} from './workspace-slug'

export type SlugAvailability = 'idle' | 'checking' | 'available' | 'taken' | 'unknown'

export const useSlugAvailability = (slug: string, workspaceId?: string): SlugAvailability => {
  const [settledSlug, setSettledSlug] = useState('')

  useDebounceEffect(
    () => {
      setSettledSlug(slug)
    },
    500,
    [slug],
  )

  const isCheckable =
    settledSlug.length >= WORKSPACE_SLUG_MIN_LENGTH &&
    settledSlug.length <= WORKSPACE_SLUG_MAX_LENGTH &&
    WORKSPACE_SLUG_PATTERN.test(settledSlug)

  const [result] = useQuery({
    query: IsWorkspaceSlugAvailableDocument,
    variables: { slug: settledSlug, workspaceId: workspaceId ?? null },
    pause: !isCheckable,
    requestPolicy: 'network-only',
  })

  if (!isCheckable) {
    return 'idle'
  }

  if (result.error) {
    return 'unknown'
  }

  if (settledSlug !== slug || result.fetching || result.data === undefined) {
    return 'checking'
  }

  return result.data.isWorkspaceSlugAvailable ? 'available' : 'taken'
}
