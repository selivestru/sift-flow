import { cn } from '@heroui/styles'

export const LogoMark = ({ className, ...props }: React.ComponentProps<'img'>) => {
  return (
    <img
      height={36}
      width={36}
      src="/assets/images/logo.svg"
      className={cn('size-9', className)}
      alt="SiftFlow logo"
      {...props}
    />
  )
}
