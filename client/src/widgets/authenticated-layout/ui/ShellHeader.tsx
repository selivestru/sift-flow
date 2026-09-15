import { Button, SearchField, Tooltip } from '@heroui/react'
import { Add, Bell, Search } from 'reicon-react'

export const ShellHeader = () => {
  return (
    <header className="bg-surface border-separator flex h-16 items-center justify-between gap-4 border-b px-4 sm:px-6">
      <div className="hidden max-w-72 flex-1 sm:block">
        <SearchField aria-label="Search" name="search" variant="secondary">
          <SearchField.Group>
            <SearchField.SearchIcon />
            <SearchField.Input
              aria-label="Search"
              className="w-full"
              placeholder="Search boards, tasks and people"
            />
            <SearchField.ClearButton />
          </SearchField.Group>
        </SearchField>
      </div>
      <Button isIconOnly aria-label="Search" className="sm:hidden" variant="tertiary">
        <Search className="size-5" />
      </Button>
      <div className="flex items-center gap-2">
        <Tooltip>
          <Button isIconOnly aria-label="Notifications" variant="ghost">
            <Bell className="size-5" />
          </Button>
          <Tooltip.Content>Notifications</Tooltip.Content>
        </Tooltip>
        <Button>
          <Add className="size-4" />
          New task
        </Button>
      </div>
    </header>
  )
}
