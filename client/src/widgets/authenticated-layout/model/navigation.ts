import type { IconComponent } from 'reicon-react'
import { FolderOpen, Home, Settings, Task, Users } from 'reicon-react'

export interface NavigationItem {
  id: string
  label: string
  icon: IconComponent
}

export const NAVIGATION_ITEMS: NavigationItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'projects', label: 'Projects', icon: FolderOpen },
  { id: 'tasks', label: 'Tasks', icon: Task },
  { id: 'members', label: 'Members', icon: Users },
  { id: 'settings', label: 'Settings', icon: Settings },
]
