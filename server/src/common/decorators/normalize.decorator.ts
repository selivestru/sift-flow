import { Transform } from 'class-transformer'

export const Normalize = () => {
  return Transform(({ value }) => {
    if (typeof value !== 'string') {
      return value
    }

    return value.trim().toLowerCase()
  })
}
