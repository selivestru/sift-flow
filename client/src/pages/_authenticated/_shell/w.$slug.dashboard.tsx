import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/_shell/w/$slug/dashboard')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_authenticated/_shell/w/$slug/dashboard"!</div>
}
