import { Provider } from 'urql'

import { urqlClient } from '~/shared/api'

export const UrqlProvider = ({ children }: React.PropsWithChildren) => {
  return <Provider value={urqlClient}>{children}</Provider>
}
