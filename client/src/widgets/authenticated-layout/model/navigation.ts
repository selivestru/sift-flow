import type { IconComponent } from 'reicon-react'
import { Home, Users } from 'reicon-react'

import type { FileRouteTypes } from '~/app/routeTree.gen'

export interface NavigationItem {
  id: string
  label: string
  icon: IconComponent
  to: FileRouteTypes['to']
}

export const NAVIGATION_ITEMS: NavigationItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: Home, to: '/w/$slug/dashboard' },
  // { id: 'projects', label: 'Projects', icon: FolderOpen },
  // { id: 'tasks', label: 'Tasks', icon: Task },
  { id: 'members', label: 'Members', icon: Users, to: '/w/$slug/members' },
  // { id: 'settings', label: 'Settings', icon: Settings },
]
