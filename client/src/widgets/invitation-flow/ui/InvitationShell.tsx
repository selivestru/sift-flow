import { LogoMark } from '~/shared/ui/LogoMark'

interface InvitationShellProps {
  children: React.ReactNode
}

export const InvitationShell = ({ children }: InvitationShellProps) => {
  return (
    <div className="bg-background flex min-h-dvh flex-col">
      <header className="border-separator bg-surface border-b">
        <div className="mx-auto flex h-16 w-full max-w-sm items-center justify-center px-6">
          <div className="flex items-center gap-2.5">
            <LogoMark />
            <span className="text-lg font-semibold tracking-tight">SiftFlow</span>
          </div>
        </div>
      </header>
      <main className="mx-auto flex w-full max-w-sm px-6 py-12">{children}</main>
    </div>
  )
}
