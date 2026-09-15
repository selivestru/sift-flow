import { Typography } from '@heroui/react'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/_shell/w/$slug')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="grid flex-1 place-items-center px-6">
      <Typography color="muted" type="body">
        Nothing here yet.
      </Typography>
    </div>
  )
}
