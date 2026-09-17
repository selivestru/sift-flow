import { useEffect, useState } from 'react'

import { type MemberRow, formatMembersCount } from '../model/member-row'
import type { MembersFilters } from '../model/members-search'
import { getPageCount } from '../model/pagination'
import { useMembersQuery } from '../model/useMembersQuery'
import { MemberDetailsDrawer } from './MemberDetailsDrawer'
import { MembersFooter } from './MembersFooter'
import { MembersTable } from './MembersTable'
import { MembersToolbar } from './MembersToolbar'

interface MembersScreenProps {
  slug: string
  filters: MembersFilters
  onFiltersChange: (filters: MembersFilters, options?: { replace?: boolean }) => void
}

export const MembersScreen = ({ slug, filters, onFiltersChange }: MembersScreenProps) => {
  const { rows, total, isLoading, isFetching, errorMessage, retry } = useMembersQuery(slug, filters)
  const [selectedMember, setSelectedMember] = useState<MemberRow | null>(null)

  const pageCount = getPageCount(total, filters.pageSize)
  const hasFilters = filters.search !== '' || filters.roles.length > 0
  const isPageOutOfRange = total > 0 && filters.page > pageCount

  useEffect(() => {
    if (isPageOutOfRange) {
      onFiltersChange({ ...filters, page: pageCount }, { replace: true })
    }
  }, [filters, isPageOutOfRange, pageCount, onFiltersChange])

  const updateFilters = (next: Partial<MembersFilters>, options?: { replace?: boolean }) => {
    onFiltersChange({ ...filters, ...next }, options)
  }

  return (
    <div className="flex flex-col gap-6">
      <MembersToolbar
        countLabel={isLoading || errorMessage ? null : formatMembersCount(total)}
        isFetching={isFetching}
        roles={filters.roles}
        search={filters.search}
        onRolesChange={(roles) => updateFilters({ roles, page: 1 })}
        onSearchChange={(search) => updateFilters({ search, page: 1 }, { replace: true })}
      />
      <MembersTable
        errorMessage={errorMessage}
        hasFilters={hasFilters}
        isFetching={isFetching}
        isLoading={isLoading}
        rows={rows}
        footer={
          total > 0 && (
            <MembersFooter
              page={filters.page}
              pageSize={filters.pageSize}
              total={total}
              onPageChange={(page) => updateFilters({ page })}
              onPageSizeChange={(pageSize) => updateFilters({ pageSize, page: 1 })}
            />
          )
        }
        onClearFilters={() => updateFilters({ search: '', roles: [], page: 1 })}
        onRetry={retry}
        onSelectMember={setSelectedMember}
      />
      <MemberDetailsDrawer
        member={selectedMember}
        slug={slug}
        onClose={() => setSelectedMember(null)}
      />
    </div>
  )
}
