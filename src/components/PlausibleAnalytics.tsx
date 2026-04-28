import Script from 'next/script';

export function PlausibleAnalytics() {
  return (
    <>
      <Script
        src="https://plausible.io/js/script.manual.js"
        strategy="lazyOnload"
        async
      />
      <Script
        dangerouslySetInnerHTML={{
          __html: `
            window.plausible = window.plausible || function() { (window.plausible.q = window.plausible.q || []).push(arguments) }
          `,
        }}
        strategy="lazyOnload"
      />
    </>
  );
}