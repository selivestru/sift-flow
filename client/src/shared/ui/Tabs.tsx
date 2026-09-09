import { Tabs as TabsPrimitive } from '@base-ui/react/tabs'
import { cn } from 'cn'
import { useReducedMotion } from 'motion/react'
import * as m from 'motion/react-m'
import { tv } from 'tailwind-variants'

export const Tabs = ({
  className,
  orientation = 'horizontal',
  ...props
}: TabsPrimitive.Root.Props) => {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      orientation={orientation}
      className={cn('group/tabs flex gap-2 data-horizontal:flex-col', className)}
      {...props}
    />
  )
}

const tabsListVariants = tv({
  base: 'group/tabs-list relative inline-flex w-fit items-center justify-center rounded-none bg-muted p-0.75 text-muted-foreground group-data-horizontal/tabs:h-8 group-data-vertical/tabs:h-fit group-data-vertical/tabs:flex-col',
})

export const TabsList = ({ className, children, ...props }: TabsPrimitive.List.Props) => {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(tabsListVariants(), className)}
      {...props}
    >
      <TabsIndicator />
      {children}
    </TabsPrimitive.List>
  )
}

const TabsIndicator = () => {
  const reduceMotion = useReducedMotion()

  return (
    <TabsPrimitive.Indicator
      data-slot="tabs-indicator"
      render={(props, state) => {
        const {
          onDrag: _onDrag,
          onDragEnd: _onDragEnd,
          onDragStart: _onDragStart,
          onAnimationStart: _onAnimationStart,
          onAnimationEnd: _onAnimationEnd,
          onAnimationIteration: _onAnimationIteration,
          ...indicatorProps
        } = props
        const position = state.activeTabPosition
        const size = state.activeTabSize

        return (
          <m.span
            aria-hidden
            {...indicatorProps}
            className="bg-background dark:border-input dark:bg-input/30 absolute top-0 left-0 rounded-none border border-transparent"
            initial={false}
            animate={{
              x: position?.left ?? 0,
              y: position?.top ?? 0,
              width: size?.width ?? 0,
              height: size?.height ?? 0,
              opacity: position && size ? 1 : 0,
            }}
            transition={
              reduceMotion ? { duration: 0 } : { type: 'spring', bounce: 0, duration: 0.35 }
            }
          />
        )
      }}
    />
  )
}

export const TabsTrigger = ({ className, ...props }: TabsPrimitive.Tab.Props) => {
  return (
    <TabsPrimitive.Tab
      data-slot="tabs-trigger"
      className={cn(
        "relative inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-none border border-transparent bg-transparent px-1.5 py-0.5 text-sm font-medium whitespace-nowrap text-foreground/60 transition-all group-data-vertical/tabs:w-full group-data-vertical/tabs:justify-start group-data-vertical/tabs:py-[calc(--spacing(1.25))] hover:text-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-1 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50 has-data-[icon=inline-end]:pr-1 has-data-[icon=inline-start]:pl-1 aria-disabled:pointer-events-none aria-disabled:opacity-50 dark:text-muted-foreground dark:hover:text-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        'data-active:text-foreground dark:data-active:text-foreground',
        className,
      )}
      {...props}
    />
  )
}

export const TabsContent = ({ className, ...props }: TabsPrimitive.Panel.Props) => {
  return (
    <TabsPrimitive.Panel
      data-slot="tabs-content"
      className={cn('flex-1 text-sm/relaxed outline-none', className)}
      {...props}
    />
  )
}
