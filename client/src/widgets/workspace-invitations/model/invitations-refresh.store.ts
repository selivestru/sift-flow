import { create } from 'zustand'

interface InvitationsRefreshState {
  revision: number
  requestRefresh: () => void
}

export const useInvitationsRefresh = create<InvitationsRefreshState>((set) => ({
  revision: 0,
  requestRefresh: () => set((state) => ({ revision: state.revision + 1 })),
}))
