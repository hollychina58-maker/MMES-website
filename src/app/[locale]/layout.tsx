import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing, Locale } from "@/routing";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { GA4 } from "@/components/GA4";
import { SEO } from "@/components/SEO";
import { PlausibleAnalytics } from "@/components/PlausibleAnalytics";
import "../globals.css";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();
  const isRTL = locale === "ar" || locale === "fa";

  return (
    <html lang={locale} dir={isRTL ? "rtl" : "ltr"}>
      <head>
        <GA4 />
        <PlausibleAnalytics />
        <SEO locale={locale} canonical="" />
      </head>
      <body className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900">
        <NextIntlClientProvider messages={messages}>
          <Header locale={locale as Locale} />
          <main className="flex-1">{children}</main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
