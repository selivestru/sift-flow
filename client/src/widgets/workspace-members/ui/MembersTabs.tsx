import { Tabs, type Key } from '@heroui/react'
import { useMatchRoute, useNavigate } from '@tanstack/react-router'

import type { FileRouteTypes } from '~/app/routeTree.gen'

interface MembersTab {
  id: string
  label: string
  to: FileRouteTypes['to']
}

const MEMBERS_TABS: MembersTab[] = [
  { id: 'members', label: 'Members', to: '/w/$slug/members' },
  { id: 'invitations', label: 'Invitations', to: '/w/$slug/members/invitations' },
]

interface MembersTabsProps {
  slug: string
}

export const MembersTabs = ({ slug }: MembersTabsProps) => {
  const navigate = useNavigate()
  const matchRoute = useMatchRoute()

  const activeTab = MEMBERS_TABS.find((tab) =>
    matchRoute({ to: tab.to, params: { slug }, fuzzy: false }),
  )

  const handleSelectionChange = (key: Key) => {
    const tab = MEMBERS_TABS.find((entry) => entry.id === key)

    if (tab) {
      navigate({ to: tab.to, params: { slug } })
    }
  }

  return (
    <Tabs
      align="start"
      className="w-fit"
      selectedKey={activeTab?.id ?? MEMBERS_TABS[0].id}
      variant="primary"
      onSelectionChange={handleSelectionChange}
    >
      <Tabs.ListContainer>
        <Tabs.List aria-label="Members and invitations">
          {MEMBERS_TABS.map((tab) => (
            <Tabs.Tab key={tab.id} id={tab.id}>
              {tab.label}
              <Tabs.Indicator />
            </Tabs.Tab>
          ))}
        </Tabs.List>
      </Tabs.ListContainer>
    </Tabs>
  )
}
