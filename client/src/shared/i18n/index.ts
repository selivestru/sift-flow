import ru from './messages/ru.json'

export const supportedLocales = ['en', 'ru'] as const
export type Locale = (typeof supportedLocales)[number]

export const defaultLocale: Locale = 'en'

export const messagesByLocale: Partial<Record<Locale, Record<string, string>>> = { ru }

export const getInitialLocale = (): Locale => {
  const [language] = navigator.languages ?? [navigator.language]
  return language?.toLowerCase().startsWith('ru') ? 'ru' : defaultLocale
}
