import {
  Alert,
  Button,
  Chip,
  Description,
  FieldError,
  Form,
  Input,
  Label,
  Spinner,
  TextField,
} from '@heroui/react'
import { Controller } from 'react-hook-form'

import { useWorkspaceForm } from '../model/useWorkspaceForm'
import type { WorkspaceFormMode, WorkspaceSummary } from '../model/workspace'

type WorkspaceFormProps = {
  onSuccess: (workspace: WorkspaceSummary) => void
  onCancel?: () => void
} & ({ mode: 'create'; workspace?: never } | { mode: 'edit'; workspace: WorkspaceSummary })

export const WorkspaceForm = (props: WorkspaceFormProps) => {
  const { onSuccess, onCancel } = props
  const workspace = props.mode === 'edit' ? props.workspace : undefined
  const mode: WorkspaceFormMode = props.mode

  const {
    form,
    submit,
    changeSlug,
    normalizeSlug,
    availability,
    isEdit,
    isSlugBlocked,
    isSubmitting,
    serverError,
  } = useWorkspaceForm({ mode, workspace, onSuccess })

  return (
    <Form
      aria-label={isEdit ? 'Edit workspace' : 'Create workspace'}
      className="flex flex-col gap-4"
      validationBehavior="aria"
      onSubmit={submit}
    >
      <Controller
        control={form.control}
        name="name"
        render={({ field, fieldState }) => (
          <TextField
            name="name"
            fullWidth
            value={field.value}
            isInvalid={Boolean(fieldState.error)}
            onChange={field.onChange}
          >
            <Label>Workspace name</Label>
            <Input variant="secondary" type="text" autoComplete="organization" placeholder="Acme" />
            {fieldState.error && <FieldError>{fieldState.error.message}</FieldError>}
          </TextField>
        )}
      />

      <Controller
        control={form.control}
        name="slug"
        render={({ field, fieldState }) => (
          <TextField
            name="slug"
            fullWidth
            value={field.value}
            isInvalid={Boolean(fieldState.error) || availability === 'taken'}
            onChange={changeSlug}
            onBlur={normalizeSlug}
          >
            <Label>Workspace slug</Label>
            <Input
              variant="secondary"
              type="text"
              autoComplete="off"
              spellCheck={false}
              placeholder="acme-team"
            />
            <Description>Used in links. Lowercase letters, numbers and single hyphens.</Description>

            {fieldState.error && <FieldError>{fieldState.error.message}</FieldError>}

            <div aria-live="polite" className="flex min-h-5 items-center gap-2">
              {availability === 'checking' && (
                <Chip color="default" size="sm">
                  <Spinner size="sm" />
                  <Chip.Label>Checking availability…</Chip.Label>
                </Chip>
              )}
              {availability === 'available' && (
                <Chip color="success" variant="primary" size="sm">
                  <Chip.Label>Available</Chip.Label>
                </Chip>
              )}
              {availability === 'taken' && (
                <Chip color="danger" variant="primary" size="sm">
                  <Chip.Label>Already taken</Chip.Label>
                </Chip>
              )}
              {availability === 'unknown' && (
                <Chip color="danger" variant="soft" size="sm">
                  <Chip.Label>
                    Could not check this slug — you can still save the workspace
                  </Chip.Label>
                </Chip>
              )}
            </div>
          </TextField>
        )}
      />

      {serverError && (
        <Alert status="danger">
          <Alert.Indicator />
          <Alert.Content>
            <Alert.Title>Could not save this workspace</Alert.Title>
            <Alert.Description>{serverError}</Alert.Description>
          </Alert.Content>
        </Alert>
      )}

      <div className="flex justify-end gap-2">
        {onCancel && (
          <Button type="button" variant="outline" onPress={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" isPending={isSubmitting} isDisabled={isSlugBlocked}>
          {({ isPending }) => (
            <>
              {isPending && <Spinner color="current" size="sm" />}
              {isEdit
                ? isPending
                  ? 'Saving…'
                  : 'Save changes'
                : isPending
                  ? 'Creating…'
                  : 'Create workspace'}
            </>
          )}
        </Button>
      </div>
    </Form>
  )
}
