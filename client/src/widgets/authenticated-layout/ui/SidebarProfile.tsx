import { Avatar, Button, Dropdown, Label, Separator, Typography } from '@heroui/react'
import { useNavigate } from '@tanstack/react-router'
import { ChevronDown, Gear, Logout } from 'reicon-react'

import { useAuthStore } from '~/shared/stores/auth.store'
import { getInitials } from '~/shared/utils/getInitials'

export const SidebarProfile = () => {
  const user = useAuthStore((state) => state.user)
  const navigate = useNavigate()

  const name = user?.fullName ?? user?.email ?? ''

  const handleAction = (key: React.Key) => {
    if (key !== 'logout') return

    useAuthStore.getState().clearUser()
    navigate({ to: '/' })
  }

  return (
    <div className="border-separator border-t p-2">
      <Dropdown>
        <Button className="h-auto w-full justify-start gap-2.5 px-2 py-2" variant="ghost">
          <Avatar className="size-8 shrink-0">
            <Avatar.Fallback>{getInitials(name)}</Avatar.Fallback>
          </Avatar>
          <span className="t-sidebar-label flex flex-1 flex-col items-start">
            <Typography truncate type="body-sm" weight="medium">
              {name}
            </Typography>
            <Typography color="muted" truncate type="body-xs">
              {user?.email}
            </Typography>
          </span>
          <ChevronDown className="t-sidebar-label text-muted size-4 shrink-0" />
        </Button>
        <Dropdown.Popover>
          <Dropdown.Menu onAction={handleAction}>
            <Dropdown.Item id="settings" textValue="Settings">
              <Gear className="text-muted size-4 shrink-0" />
              <Label>Settings</Label>
            </Dropdown.Item>
            <Separator />
            <Dropdown.Item id="logout" textValue="Log out" variant="danger">
              <Logout className="text-danger size-4 shrink-0" />
              <Label>Log out</Label>
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown.Popover>
      </Dropdown>
    </div>
  )
}
