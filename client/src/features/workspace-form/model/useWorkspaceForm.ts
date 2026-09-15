import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { useMutation } from 'urql'

import {
  FALLBACK_ERROR_MESSAGE,
  executeGuardedMutation,
  getApiErrorMessage,
} from '~/shared/api/graphql'

import { CreateWorkspaceDocument, UpdateWorkspaceDocument } from '../api/documents'
import { type WorkspaceFormValues, workspaceFormSchema } from './schemas'
import { type SlugAvailability, useSlugAvailability } from './useSlugAvailability'
import type { WorkspaceFormMode, WorkspaceSummary } from './workspace'
import { toWorkspaceSlug } from './workspace-slug'

interface UseWorkspaceFormOptions {
  mode: WorkspaceFormMode
  workspace?: WorkspaceSummary
  onSuccess: (workspace: WorkspaceSummary) => void
}

export const useWorkspaceForm = ({ mode, workspace, onSuccess }: UseWorkspaceFormOptions) => {
  const isEdit = mode === 'edit' && Boolean(workspace)

  const [createState, executeCreateWorkspace] = useMutation(CreateWorkspaceDocument)
  const [updateState, executeUpdateWorkspace] = useMutation(UpdateWorkspaceDocument)

  const [hasEditedSlug, setHasEditedSlug] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  const form = useForm<WorkspaceFormValues>({
    defaultValues: {
      name: workspace?.name ?? '',
      slug: workspace?.slug ?? '',
    },
    resolver: zodResolver(workspaceFormSchema),
  })

  const name = useWatch({ control: form.control, name: 'name' })
  const slug = useWatch({ control: form.control, name: 'slug' })

  const availability: SlugAvailability = useSlugAvailability(slug, workspace?.id)

  useEffect(() => {
    if (isEdit || hasEditedSlug) {
      return
    }

    form.setValue('slug', toWorkspaceSlug(name))
  }, [form, hasEditedSlug, isEdit, name])

  const changeSlug = (value: string) => {
    setHasEditedSlug(true)

    form.setValue('slug', value.toLowerCase(), { shouldValidate: true })
  }

  const normalizeSlug = () => {
    const current = form.getValues('slug')
    const normalized = toWorkspaceSlug(current)

    if (normalized !== current) {
      form.setValue('slug', normalized, { shouldValidate: true })
    }
  }

  const submit = form.handleSubmit(async (values) => {
    setServerError(null)

    if (isEdit && workspace) {
      const result = await executeGuardedMutation(() =>
        executeUpdateWorkspace({
          input: { workspaceId: workspace.id, name: values.name, slug: values.slug },
        }),
      )

      if (result.error) {
        setServerError(getApiErrorMessage(result.error))
        return
      }

      const updatedWorkspace = result.data?.updateWorkspace

      if (!updatedWorkspace) {
        setServerError(FALLBACK_ERROR_MESSAGE)
        return
      }

      onSuccess(updatedWorkspace)
      return
    }

    const result = await executeGuardedMutation(() =>
      executeCreateWorkspace({ input: { name: values.name, slug: values.slug } }),
    )

    if (result.error) {
      setServerError(getApiErrorMessage(result.error))
      return
    }

    const createdWorkspace = result.data?.createWorkspace

    if (!createdWorkspace) {
      setServerError(FALLBACK_ERROR_MESSAGE)
      return
    }

    onSuccess(createdWorkspace)
  })

  return {
    form,
    submit,
    changeSlug,
    normalizeSlug,
    availability,
    isEdit,
    isSlugBlocked: availability === 'checking' || availability === 'taken',
    isSubmitting: createState.fetching || updateState.fetching,
    serverError,
  }
}
