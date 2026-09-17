import { createFileRoute, useNavigate } from '@tanstack/react-router'

import {
  MembersScreen,
  parseMembersSearch,
  toMembersFilters,
  toMembersSearch,
  type MembersFilters,
} from '~/widgets/workspace-members'

export const Route = createFileRoute('/_authenticated/_shell/w/$slug/members/')({
  validateSearch: parseMembersSearch,
  component: RouteComponent,
})

function RouteComponent() {
  const { slug } = Route.useParams()
  const search = Route.useSearch()
  const navigate = useNavigate()

  const handleFiltersChange = (filters: MembersFilters, options?: { replace?: boolean }) => {
    navigate({
      to: '/w/$slug/members',
      params: { slug },
      search: toMembersSearch(filters),
      replace: options?.replace ?? false,
    })
  }

  return (
    <MembersScreen
      filters={toMembersFilters(search)}
      slug={slug}
      onFiltersChange={handleFiltersChange}
    />
  )
}
