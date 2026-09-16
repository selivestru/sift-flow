import { z } from 'zod'

import { getStorageItem, setStorageItem } from '~/shared/utils/storage'

const STORAGE_KEY = 'last-opened-workspace'

export const getLastOpenedWorkspace = () => {
  return getStorageItem(STORAGE_KEY, z.string().trim().min(3).max(48), null)
}

export const setLastOpenedWorkspace = (slug: string) => {
  setStorageItem(STORAGE_KEY, slug)
}
