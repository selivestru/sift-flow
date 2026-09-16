import { z } from 'zod'

import type { WorkspaceRole } from '~/shared/api/graphql'

export const MEMBERS_PAGE_SIZES = [20, 50, 100] as const

export type MembersPageSize = (typeof MEMBERS_PAGE_SIZES)[number]

export const DEFAULT_MEMBERS_PAGE_SIZE: MembersPageSize = 20

export const WORKSPACE_ROLES = ['OWNER', 'ADMIN', 'MEMBER'] as const

export interface MembersFilters {
  search: string
  roles: WorkspaceRole[]
  page: number
  pageSize: MembersPageSize
}

export type MembersSearch = {
  q?: string
  roles?: string
  page?: number
  pageSize?: MembersPageSize
}

export const DEFAULT_MEMBERS_FILTERS: MembersFilters = {
  search: '',
  roles: [],
  page: 1,
  pageSize: DEFAULT_MEMBERS_PAGE_SIZE,
}

const isPageSize = (value: number): value is MembersPageSize =>
  (MEMBERS_PAGE_SIZES as readonly number[]).includes(value)

const membersSearchSchema = z.object({
  q: z.string().trim().max(100).optional(),
  roles: z.string().optional(),
  page: z.coerce.number().int().min(1).optional(),
  pageSize: z.coerce.number().int().optional(),
})

const toRoleList = (value: string) =>
  WORKSPACE_ROLES.filter((role) => value.split(',').includes(role))

export const parseMembersSearch = (search: Record<string, unknown>): MembersSearch => {
  const parsed = membersSearchSchema.safeParse(search)

  if (!parsed.success) {
    return {}
  }

  const { q, roles, page, pageSize } = parsed.data
  const roleList = roles === undefined ? [] : toRoleList(roles)

  return {
    ...(q === undefined || q === '' ? {} : { q }),
    ...(roleList.length === 0 ? {} : { roles: roleList.join(',') }),
    ...(page === undefined || page === 1 ? {} : { page }),
    ...(pageSize === undefined || !isPageSize(pageSize) || pageSize === DEFAULT_MEMBERS_PAGE_SIZE
      ? {}
      : { pageSize }),
  }
}

export const toMembersFilters = (search: MembersSearch): MembersFilters => {
  return {
    search: search.q ?? '',
    roles: search.roles === undefined ? [] : toRoleList(search.roles),
    page: search.page ?? 1,
    pageSize: search.pageSize ?? DEFAULT_MEMBERS_PAGE_SIZE,
  }
}

export const toMembersSearch = (filters: MembersFilters): MembersSearch => {
  return parseMembersSearch({
    q: filters.search,
    roles: filters.roles.join(','),
    page: filters.page,
    pageSize: filters.pageSize,
  })
}
