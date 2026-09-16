import { Skeleton } from '@heroui/react'

const SKELETON_ROWS = [0, 1, 2, 3, 4]

export const MembersSkeleton = () => {
  return (
    <div className="flex flex-col">
      {SKELETON_ROWS.map((row) => (
        <div
          key={row}
          className="border-separator flex items-center gap-4 border-b px-4 py-3 last:border-b-0"
        >
          <Skeleton className="size-8 shrink-0" />
          <div className="flex flex-1 flex-col gap-1.5">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-3 w-56" />
          </div>
          <Skeleton className="h-6 w-16 shrink-0" />
          <Skeleton className="h-4 w-24 shrink-0" />
        </div>
      ))}
    </div>
  )
}
