export const getPageCount = (total: number, pageSize: number) =>
  total === 0 ? 1 : Math.ceil(total / pageSize)

export type PaginationItem = number | 'ellipsis'

const PAGE_WINDOW_EDGE = 5
const PAGE_WINDOW_CENTER = 1

export const buildPaginationItems = (page: number, pageCount: number): PaginationItem[] => {
  if (pageCount <= PAGE_WINDOW_EDGE + 2) {
    return Array.from({ length: pageCount }, (_, index) => index + 1)
  }

  const start = Math.min(Math.max(page - PAGE_WINDOW_CENTER, 2), pageCount - 3)
  const end = Math.max(Math.min(page + PAGE_WINDOW_CENTER, pageCount - 1), 4)
  const items: PaginationItem[] = [1]

  if (start > 2) {
    items.push('ellipsis')
  }

  for (let current = start; current <= end; current += 1) {
    items.push(current)
  }

  if (end < pageCount - 1) {
    items.push('ellipsis')
  }

  items.push(pageCount)

  return items
}
