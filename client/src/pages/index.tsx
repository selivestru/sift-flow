import { Link, createFileRoute } from '@tanstack/react-router'

import { useAuth } from '~/shared/auth'

export const Route = createFileRoute('/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { isAuthenticated, login, logout } = useAuth()

  return (
    <div>
      <h1>Landing (public)</h1>
      <p>Статус: {isAuthenticated ? 'авторизован' : 'гость'}</p>
      {isAuthenticated ? (
        <button type="button" onClick={logout}>
          Выйти
        </button>
      ) : (
        <button type="button" onClick={login}>
          Войти (тест)
        </button>
      )}
      <div>
        <Link to="/test">Приватная тестовая страница</Link>
      </div>
    </div>
  )
}
