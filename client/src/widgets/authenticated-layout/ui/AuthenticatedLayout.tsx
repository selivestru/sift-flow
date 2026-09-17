import { Outlet } from '@tanstack/react-router'

import { AppSidebar } from './AppSidebar'
import { ShellHeader } from './ShellHeader'

export const AuthenticatedLayout = () => {
  return (
    <div className="bg-background flex h-dvh overflow-hidden">
      <AppSidebar />
      <div className="border-separator flex flex-1 flex-col border-l">
        <ShellHeader />
        <main className="flex min-h-0 flex-1 scrollbar-gutter-stable flex-col overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
