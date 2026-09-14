import { Provider } from 'urql'

import { graphqlClient } from '~/shared/api/graphql'

export const UrqlProvider = ({ children }: React.PropsWithChildren) => {
  return <Provider value={graphqlClient}>{children}</Provider>
}
