import Script from 'next/script';

const GA4_ID = process.env.NEXT_PUBLIC_GA4_ID || 'G-YVBQSN4KSR';

export function GA4() {
  if (!GA4_ID) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`}
        strategy="lazyOnload"
      />
      <Script
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA4_ID}');
          `,
        }}
        strategy="lazyOnload"
      />
    </>
  );
}
