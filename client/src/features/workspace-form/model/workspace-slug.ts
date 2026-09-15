import slugify from 'slugify'

export const WORKSPACE_SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
export const WORKSPACE_SLUG_MIN_LENGTH = 3
export const WORKSPACE_SLUG_MAX_LENGTH = 48

export const toWorkspaceSlug = (value: string) => {
  const slug = slugify(value, {
    lower: true,
    trim: true,
    replacement: '-',
    strict: true,
    locale: 'en',
  })

  return slug.slice(0, WORKSPACE_SLUG_MAX_LENGTH).replace(/-+$/, '')
}
