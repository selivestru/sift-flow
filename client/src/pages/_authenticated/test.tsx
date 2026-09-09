import { Link, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/test')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      <h1>Test (private)</h1>
      <p>Эта страница видна только при isAuthenticated.</p>
      <Link to="/">На главную</Link>
    </div>
  )
}
