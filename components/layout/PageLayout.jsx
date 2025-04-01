import Head from "next/head";

export default function PageLayout({
  children,
  title,
  description,
  mainRef,
  skipToContentHandler,
  announcement,
}) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
      </Head>

      <a
        href="#main-content"
        onClick={skipToContentHandler}
        className="sr-only focus:not-sr-only focus:absolute focus:z-10 focus:p-4 focus:bg-white focus:text-blue-600 focus:border focus:border-blue-600"
      >
        Skip to main content
      </a>

      {announcement && (
        <div className="sr-only" role="status" aria-live="polite">
          {announcement}
        </div>
      )}

      <div className="min-h-screen flex flex-col">
        <header className="bg-white border-b border-gray-200 py-4">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-800">
              Item Browser (JSONPlaceholder Posts)
            </h1>
          </div>
        </header>

        <main
          id="main-content"
          ref={mainRef}
          className="container mx-auto p-4 md:p-8 max-w-3xl flex-grow"
          tabIndex="-1"
        >
          {children}
        </main>

        <footer className="bg-gray-100 border-t border-gray-200 py-4 mt-8">
          <div className="container mx-auto px-4 text-center text-gray-600">
            <p>Item Browser Application - Accessible Demo</p>
          </div>
        </footer>
      </div>
    </>
  );
}
