"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/routing";

export function Footer() {
  const t = useTranslations("nav");
  const tFooter = useTranslations("footer");
  const pathname = usePathname();

  const languages = [
    { code: "en", name: "English" },
    { code: "zh", name: "中文" },
    { code: "ru", name: "Русский" },
    { code: "ar", name: "العربية" },
    { code: "fa", name: "فارسی" },
    { code: "la", name: "Latina" },
  ];

  return (
    <footer className="bg-gradient-to-br from-slate-900 to-slate-800 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-4">
              MMES-MCTI
            </h3>
            <p className="text-slate-400 max-w-md">
              {tFooter("description")}
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-slate-200">{tFooter("quickLinks")}</h4>
            <ul className="space-y-2 text-slate-400">
              <li><Link href="/products" className="hover:text-blue-400 transition-colors">{t("products")}</Link></li>
              <li><Link href="/about" className="hover:text-blue-400 transition-colors">{t("about")}</Link></li>
              <li><Link href="/blog" className="hover:text-blue-400 transition-colors">{t("blog")}</Link></li>
              <li><Link href="/contact" className="hover:text-blue-400 transition-colors">{t("contact")}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-slate-200">{tFooter("languages")}</h4>
            <ul className="space-y-2 text-slate-400">
              {languages.map((lang) => (
                <li key={lang.code}>
                  <Link href={pathname} locale={lang.code} className="hover:text-blue-400 transition-colors">
                    {lang.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-700 text-center text-slate-500">
          <p>&copy; {new Date().getFullYear()} {tFooter("copyright")}</p>
        </div>
      </div>
    </footer>
  );
}
