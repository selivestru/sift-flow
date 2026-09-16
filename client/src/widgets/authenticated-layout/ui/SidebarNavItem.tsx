import { Button, Tooltip, Typography } from '@heroui/react'
import { useMatchRoute, useNavigate, useParams } from '@tanstack/react-router'

import type { NavigationItem } from '../model/navigation'

interface SidebarNavItemProps {
  item: NavigationItem
  isCollapsed: boolean
}

export const SidebarNavItem = ({ item, isCollapsed }: SidebarNavItemProps) => {
  const { slug } = useParams({ from: '/_authenticated/_shell/w/$slug' })
  const navigate = useNavigate()
  const matchRoute = useMatchRoute()

  const isActiveRoute = matchRoute({ to: item.to, params: { slug } })
  const Icon = item.icon

  const handlePress = () => {
    navigate({ to: item.to, params: { slug } })
  }

  return (
    <Tooltip isDisabled={!isCollapsed}>
      <Button
        aria-label={item.label}
        variant={isActiveRoute ? 'tertiary' : 'ghost'}
        className="text-muted hover:bg-surface-secondary hover:text-foreground h-10 w-full justify-start gap-3 px-2"
        onPress={handlePress}
      >
        <span className="flex size-8 shrink-0 items-center justify-center">
          <Icon className="size-5" />
        </span>
        <Typography className="t-sidebar-label" type="body-sm">
          {item.label}
        </Typography>
      </Button>
      <Tooltip.Content placement="right">{item.label}</Tooltip.Content>
    </Tooltip>
  )
}
