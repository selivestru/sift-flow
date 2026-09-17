import {
  Alert,
  Button,
  FieldError,
  Form,
  Input,
  Label,
  Modal,
  Spinner,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  type Key,
  toast,
} from '@heroui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'

import { DEFAULT_INVITABLE_ROLE, WORKSPACE_ROLE_LABELS } from '~/entities/workspace'
import type { WorkspaceRole } from '~/shared/api/graphql'

import { type InviteMemberValues, inviteMemberSchema } from '../model/schemas'
import { useInviteMember } from '../model/useInviteMember'

interface InviteMemberModalProps {
  workspaceId: string
  assignableRoles: WorkspaceRole[]
  onInvited: () => void
}

const toSelectedRole = (keys: Set<Key>, assignableRoles: WorkspaceRole[]): WorkspaceRole | null => {
  const [key] = keys

  return assignableRoles.find((role) => role === key) ?? null
}

export const InviteMemberModal = ({
  workspaceId,
  assignableRoles,
  onInvited,
}: InviteMemberModalProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [role, setRole] = useState<WorkspaceRole>(DEFAULT_INVITABLE_ROLE)
  const { inviteMember, isInviting, serverError } = useInviteMember()

  const form = useForm<InviteMemberValues>({
    defaultValues: { email: '' },
    resolver: zodResolver(inviteMemberSchema),
  })

  const submit = form.handleSubmit(async (values) => {
    const isInvited = await inviteMember(workspaceId, values.email, role)

    if (!isInvited) {
      return
    }

    form.reset()
    setIsOpen(false)
    toast.success('Invitation sent', { description: values.email })
    onInvited()
  })

  const handleRoleChange = (keys: Set<Key>) => {
    const nextRole = toSelectedRole(keys, assignableRoles)

    if (nextRole) {
      setRole(nextRole)
    }
  }

  return (
    <>
      <Button onPress={() => setIsOpen(true)}>Invite member</Button>
      <Modal.Backdrop isOpen={isOpen} onOpenChange={setIsOpen}>
        <Modal.Container>
          <Modal.Dialog className="sm:max-w-md">
            <Modal.CloseTrigger />
            <Modal.Header>
              <Modal.Heading>Invite a member</Modal.Heading>
              <Typography className="mt-1.5" color="muted" type="body-sm">
                They receive an email with a link to join this workspace. The invitation expires in
                7 days.
              </Typography>
            </Modal.Header>
            <Modal.Body>
              <Form
                aria-label="Invite a member"
                className="flex flex-col gap-4"
                validationBehavior="aria"
                onSubmit={submit}
              >
                <Controller
                  control={form.control}
                  name="email"
                  render={({ field, fieldState }) => (
                    <TextField
                      name="email"
                      fullWidth
                      value={field.value}
                      isInvalid={Boolean(fieldState.error)}
                      onChange={field.onChange}
                    >
                      <Label>Email</Label>
                      <Input
                        variant="secondary"
                        type="email"
                        autoComplete="off"
                        spellCheck={false}
                        placeholder="teammate@example.com"
                      />
                      {fieldState.error && <FieldError>{fieldState.error.message}</FieldError>}
                    </TextField>
                  )}
                />
                {assignableRoles.length > 1 && (
                  <div className="flex flex-col gap-2">
                    <Typography color="muted" type="body-sm">
                      Role
                    </Typography>
                    <ToggleButtonGroup
                      fullWidth
                      aria-label="Role of the invited member"
                      selectedKeys={new Set([role])}
                      selectionMode="single"
                      onSelectionChange={handleRoleChange}
                    >
                      {assignableRoles.map((assignableRole) => (
                        <ToggleButton key={assignableRole} id={assignableRole}>
                          {WORKSPACE_ROLE_LABELS[assignableRole]}
                        </ToggleButton>
                      ))}
                    </ToggleButtonGroup>
                  </div>
                )}
                {serverError && (
                  <Alert status="danger">
                    <Alert.Indicator />
                    <Alert.Content>
                      <Alert.Title>Could not send the invitation</Alert.Title>
                      <Alert.Description>{serverError}</Alert.Description>
                    </Alert.Content>
                  </Alert>
                )}
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onPress={() => setIsOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" isPending={isInviting}>
                    {({ isPending }) => (
                      <>
                        {isPending && <Spinner color="current" size="sm" />}
                        {isPending ? 'Inviting…' : 'Send invitation'}
                      </>
                    )}
                  </Button>
                </div>
              </Form>
            </Modal.Body>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </>
  )
}
