import { i18n, type Messages } from '@lingui/core'

import { DEFAULT_LOCALE, isLocale, type Locale } from './config'

const LOCALE_STORAGE_KEY = 'sift-flow.locale'

const loadCatalog = async (locale: Locale) => {
  const { messages } = (await import(`./locales/${locale}/messages.po`)) as {
    messages: Messages
  }

  i18n.loadAndActivate({ locale, messages })
}

const detectLocale = (): Locale | null => {
  const preferred = navigator.languages.map((language) => language.split('-')[0])

  return preferred.find(isLocale) ?? null
}

export const getInitialLocale = (): Locale => {
  const stored = localStorage.getItem(LOCALE_STORAGE_KEY)

  if (stored && isLocale(stored)) {
    return stored
  }

  return detectLocale() ?? DEFAULT_LOCALE
}

export const activateLocale = async (locale: Locale) => {
  if (i18n.locale !== locale) {
    await loadCatalog(locale)
  }

  localStorage.setItem(LOCALE_STORAGE_KEY, locale)

  document.documentElement.lang = locale
}

export const initializeI18n = () => activateLocale(getInitialLocale())
