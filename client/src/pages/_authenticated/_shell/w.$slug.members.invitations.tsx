import { createFileRoute, useNavigate } from '@tanstack/react-router'

import {
  InvitationsScreen,
  parseInvitationsSearch,
  toInvitationStatusFilter,
  toInvitationsSearch,
  type InvitationStatusFilter,
} from '~/widgets/workspace-invitations'

export const Route = createFileRoute('/_authenticated/_shell/w/$slug/members/invitations')({
  validateSearch: parseInvitationsSearch,
  component: RouteComponent,
})

function RouteComponent() {
  const { slug } = Route.useParams()
  const search = Route.useSearch()
  const navigate = useNavigate()

  const handleFilterChange = (filter: InvitationStatusFilter) => {
    navigate({
      to: '/w/$slug/members/invitations',
      params: { slug },
      search: toInvitationsSearch(filter),
      replace: true,
    })
  }

  return (
    <InvitationsScreen
      filter={toInvitationStatusFilter(search)}
      slug={slug}
      onFilterChange={handleFilterChange}
    />
  )
}
