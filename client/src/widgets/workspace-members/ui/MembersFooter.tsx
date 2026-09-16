import { Pagination, ToggleButton, ToggleButtonGroup, Typography, type Key } from '@heroui/react'

import { MEMBERS_PAGE_SIZES, type MembersPageSize } from '../model/members-search'
import { buildPaginationItems, getPageCount } from '../model/pagination'

interface MembersFooterProps {
  page: number
  pageSize: MembersPageSize
  total: number
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: MembersPageSize) => void
}

const toPageSize = (keys: Set<Key>): MembersPageSize => {
  const value = Number([...keys][0])

  return MEMBERS_PAGE_SIZES.find((size) => size === value) ?? MEMBERS_PAGE_SIZES[0]
}

export const MembersFooter = ({
  page,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange,
}: MembersFooterProps) => {
  const pageCount = getPageCount(total, pageSize)
  const first = total === 0 ? 0 : (page - 1) * pageSize + 1
  const last = Math.min(page * pageSize, total)

  return (
    <div className="flex w-full flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        <Typography color="muted" type="body-sm">
          Rows per page
        </Typography>
        <ToggleButtonGroup
          aria-label="Rows per page"
          selectedKeys={new Set([String(pageSize)])}
          selectionMode="single"
          size="sm"
          onSelectionChange={(keys) => onPageSizeChange(toPageSize(keys))}
        >
          {MEMBERS_PAGE_SIZES.map((size) => (
            <ToggleButton key={size} id={String(size)}>
              {size}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </div>
      <div className="flex min-w-0 flex-1 items-center justify-end">
        <Pagination>
          <Pagination.Summary>
            {first}–{last} of {total}
          </Pagination.Summary>
          <Pagination.Content>
            <Pagination.Item>
              <Pagination.Previous
                isDisabled={page === 1}
                onPress={() => onPageChange(Math.max(1, page - 1))}
              >
                <Pagination.PreviousIcon />
              </Pagination.Previous>
            </Pagination.Item>
            {buildPaginationItems(page, pageCount).map((item, index) =>
              item === 'ellipsis' ? (
                <Pagination.Item key={`ellipsis-${index}`}>
                  <Pagination.Ellipsis />
                </Pagination.Item>
              ) : (
                <Pagination.Item key={item}>
                  <Pagination.Link isActive={item === page} onPress={() => onPageChange(item)}>
                    {item}
                  </Pagination.Link>
                </Pagination.Item>
              ),
            )}
            <Pagination.Item>
              <Pagination.Next
                isDisabled={page >= pageCount}
                onPress={() => onPageChange(Math.min(pageCount, page + 1))}
              >
                <Pagination.NextIcon />
              </Pagination.Next>
            </Pagination.Item>
          </Pagination.Content>
        </Pagination>
      </div>
    </div>
  )
}
