import { Button, Dropdown, Label, type DropdownPopoverProps, type Key } from '@heroui/react'
import { useLingui } from '@lingui/react/macro'
import { useTransition } from 'react'

import { DEFAULT_LOCALE, LOCALES, LOCALE_LABELS, activateLocale, isLocale } from '~/shared/i18n'

interface LanguageSwitcherProps {
  placement?: DropdownPopoverProps['placement']
}

export const LanguageSwitcher = ({ placement = 'bottom right' }: LanguageSwitcherProps) => {
  const { t, i18n } = useLingui()
  const [isPending, startTransition] = useTransition()

  const currentLocale = isLocale(i18n.locale) ? i18n.locale : DEFAULT_LOCALE

  const selectLocale = (key: Key) => {
    const locale = String(key)

    if (!isLocale(locale) || locale === currentLocale) {
      return
    }

    startTransition(async () => {
      await activateLocale(locale)
    })
  }

  return (
    <Dropdown>
      <Button aria-label={t`Change language`} size="sm" variant="ghost" isPending={isPending}>
        {LOCALE_LABELS[currentLocale]}
      </Button>
      <Dropdown.Popover placement={placement}>
        <Dropdown.Menu onAction={selectLocale}>
          {LOCALES.map((locale) => (
            <Dropdown.Item key={locale} id={locale} textValue={LOCALE_LABELS[locale]}>
              <Label>{LOCALE_LABELS[locale]}</Label>
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown>
  )
}
