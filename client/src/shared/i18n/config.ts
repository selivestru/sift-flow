export const LOCALES = ['en', 'uk'] as const

export type Locale = (typeof LOCALES)[number]

export const DEFAULT_LOCALE: Locale = 'en'

export const LOCALE_LABELS: Record<Locale, string> = {
  en: 'English',
  uk: 'Українська',
}

export const isLocale = (value: string): value is Locale => LOCALES.includes(value as Locale)
