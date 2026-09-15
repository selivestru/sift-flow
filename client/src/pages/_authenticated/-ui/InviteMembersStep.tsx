import {
  Button,
  Card,
  ErrorMessage,
  FieldError,
  Form,
  InputGroup,
  Label,
  Separator,
  Spinner,
  TextField,
  Typography,
} from '@heroui/react'
import { Controller } from 'react-hook-form'
import { Check } from 'reicon-react'

import type { WorkspaceSummary } from '~/features/workspace-form'

import { useInviteMembersForm } from '../-model/useInviteMembersForm'

interface InviteMembersStepProps {
  workspace: WorkspaceSummary
  onFinish: () => void
}

export const InviteMembersStep = ({ workspace, onFinish }: InviteMembersStepProps) => {
  const { form, submit, invitedEmails, isSubmitting, serverError } = useInviteMembersForm(
    workspace.id,
  )

  return (
    <Card>
      <Card.Header>
        <Card.Title>Invite your teammates</Card.Title>
        <Card.Description>
          {workspace.name} is ready. Invite anyone you work with — you can add more people later.
        </Card.Description>
      </Card.Header>
      <Card.Content className="flex flex-col gap-4">
        <Form
          aria-label="Invite a teammate"
          className="flex flex-col gap-2"
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
                <InputGroup variant="secondary">
                  <InputGroup.Input
                    type="email"
                    autoComplete="off"
                    spellCheck={false}
                    placeholder="teammate@example.com"
                  />
                  <InputGroup.Suffix className="pe-0.5">
                    <Button type="submit" size="sm" isPending={isSubmitting}>
                      {({ isPending }) => (
                        <>
                          {isPending && <Spinner color="current" size="sm" />}
                          {isPending ? 'Inviting…' : 'Invite'}
                        </>
                      )}
                    </Button>
                  </InputGroup.Suffix>
                </InputGroup>
                {fieldState.error && <FieldError>{fieldState.error.message}</FieldError>}
              </TextField>
            )}
          />
          {serverError && <ErrorMessage>{serverError}</ErrorMessage>}
        </Form>
        <Separator />
        {invitedEmails.length === 0 ? (
          <Typography type="body-sm" color="muted">
            No invitations yet. Add the first teammate above.
          </Typography>
        ) : (
          <ul className="divide-separator divide-y">
            {invitedEmails.map((email) => (
              <li key={email} className="flex items-center justify-between gap-3 py-3">
                <div className="flex items-center gap-2">
                  <span className="bg-success text-success-foreground flex size-4 items-center justify-center">
                    <Check strokeWidth={2} className="size-3" />
                  </span>
                  <Typography type="body-sm" truncate>
                    {email}
                  </Typography>
                </div>
                <span className="text-muted text-xs">Invitation sent</span>
              </li>
            ))}
          </ul>
        )}
      </Card.Content>
      <Card.Footer className="flex justify-end">
        <Button onPress={onFinish}>Open workspace</Button>
      </Card.Footer>
    </Card>
  )
}
