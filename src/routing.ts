import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

export const locales = ['en', 'ru', 'ar', 'zh', 'fa', 'la'] as const;
export type Locale = (typeof locales)[number];

export const rtlLocales: Locale[] = ['ar', 'fa'];

export const languageNames: Record<Locale, { name: string; native: string }> = {
  en: { name: 'English', native: 'English' },
  zh: { name: 'Chinese', native: '中文' },
  ru: { name: 'Russian', native: 'Русский' },
  ar: { name: 'Arabic', native: 'العربية' },
  fa: { name: 'Persian', native: 'فارسی' },
  la: { name: 'Latin', native: 'Latina' },
};

export const routing = defineRouting({
  locales,
  defaultLocale: 'en',
  localePrefix: 'always',
});

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
