export const AuthDivider = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="text-muted-foreground flex items-center gap-2">
      <span className="bg-border h-px flex-1" />
      <span className="text-xs">{children}</span>
      <span className="bg-border h-px flex-1" />
    </div>
  )
}
