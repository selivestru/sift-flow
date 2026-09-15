import { Button, Tooltip } from '@heroui/react'
import { cn } from '@heroui/styles'
import { ChevronLeft, ChevronRight } from 'reicon-react'

import { LogoMark } from '~/shared/ui/LogoMark'

import { NAVIGATION_ITEMS } from '../model/navigation'
import { useSidebarStore } from '../model/sidebar'
import { SidebarNavItem } from './SidebarNavItem'
import { SidebarProfile } from './SidebarProfile'
import { WorkspaceSwitcher } from './WorkspaceSwitcher'

const SIDEBAR_ID = 'app-sidebar'

export const AppSidebar = () => {
  const isCollapsed = useSidebarStore((state) => state.isCollapsed)
  const toggle = useSidebarStore((state) => state.toggle)

  return (
    <aside
      id={SIDEBAR_ID}
      data-collapsed={isCollapsed}
      className={cn(
        't-sidebar bg-surface relative z-20 flex h-full flex-col',
        isCollapsed ? 'w-16' : 'w-64',
      )}
    >
      <div className="border-separator flex h-16 items-center gap-2.5 overflow-hidden border-b px-4">
        <LogoMark className="size-8 max-w-none" />
        <span className="t-sidebar-label text-base font-semibold tracking-tight">SiftFlow</span>
      </div>
      <WorkspaceSwitcher />
      <nav aria-label="Main" className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto p-2">
        {NAVIGATION_ITEMS.map((item) => (
          <SidebarNavItem key={item.id} isCollapsed={isCollapsed} item={item} />
        ))}
      </nav>
      <SidebarProfile />
      <Tooltip>
        <Button
          isIconOnly
          aria-controls={SIDEBAR_ID}
          aria-expanded={!isCollapsed}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="t-sidebar-toggle border-separator bg-surface absolute top-5 -right-3 z-10 size-6 border"
          size="sm"
          variant="ghost"
          onPress={toggle}
        >
          <span className="t-icon-swap" data-state={isCollapsed ? 'b' : 'a'}>
            <ChevronLeft aria-hidden className="t-icon size-3.5" data-icon="a" />
            <ChevronRight aria-hidden className="t-icon size-3.5" data-icon="b" />
          </span>
        </Button>
        <Tooltip.Content>{isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}</Tooltip.Content>
      </Tooltip>
    </aside>
  )
}
