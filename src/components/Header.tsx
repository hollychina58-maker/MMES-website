"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link, usePathname, locales, languageNames, type Locale } from "@/routing";
import { motion } from "framer-motion";

export function Header({ locale }: { locale: Locale }) {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);

  const navItems = [
    { href: "/", label: t("home") },
    { href: "/products", label: t("products") },
    { href: "/about", label: t("about") },
    { href: "/blog", label: t("blog") },
    { href: "/contact", label: t("contact") },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-slate-200 dark:border-slate-800">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent"
          >
            MMES-MCTI
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="relative text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors group"
              >
                {item.label}
                <span className="absolute -bottom-1 start-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-cyan-500 transition-all group-hover:w-full" />
              </Link>
            ))}
          </div>

          <div className="relative">
            <button
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              aria-label="Select language"
            >
              <span className="text-sm">{languageNames[locale as Locale]?.native}</span>
              <motion.svg
                animate={{ rotate: isLangOpen ? 180 : 0 }}
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </motion.svg>
            </button>

            {isLangOpen && (
              <div className="absolute end-0 mt-2 w-40 py-2 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 z-50">
                {locales.map((loc) => (
                  <Link
                    key={loc}
                    href={pathname}
                    locale={loc}
                    onClick={() => setIsLangOpen(false)}
                    className={`block px-4 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-700 ${
                      locale === loc ? "text-blue-600 font-medium" : "text-slate-700 dark:text-slate-200"
                    }`}
                  >
                    <span className="font-medium">{languageNames[loc].native}</span>
                    <span className="text-slate-500 ms-2 text-xs">{languageNames[loc].name}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden mt-4 pb-4 border-t border-slate-200 dark:border-slate-700 pt-4"
          >
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className="block py-2 text-slate-700 dark:text-slate-200 hover:text-blue-600"
              >
                {item.label}
              </Link>
            ))}
          </motion.div>
        )}
      </nav>
    </header>
  );
}
