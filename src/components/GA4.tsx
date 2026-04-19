import Script from 'next/script';

export function GA4() {
  return (
    <>
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-YVBQSN4KSR"
        strategy="afterInteractive"
      />
      <Script
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-YVBQSN4KSR');
          `,
        }}
        strategy="afterInteractive"
      />
    </>
  );
}
