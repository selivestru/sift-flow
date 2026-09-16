import { createFileRoute } from '@tanstack/react-router'

import { InvitationPending, InvitationScreen, fetchJoinPreview } from '~/widgets/invitation-flow'

export const Route = createFileRoute('/invite/$token')({
  loader: ({ params }) => fetchJoinPreview(params.token),
  pendingComponent: InvitationPending,
  component: RouteComponent,
})

function RouteComponent() {
  const { token } = Route.useParams()
  const state = Route.useLoaderData()

  return <InvitationScreen state={state} token={token} />
}
