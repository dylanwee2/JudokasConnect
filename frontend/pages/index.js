import Head from "next/head";

export default function Home({ news }) {
  return (
    <>
      <Head>
        <title>Judo News</title>
      </Head>

      <main className="flex flex-col items-center gap-6 p-4 md:p-6 bg-[#FDF6F0] min-h-screen">
        <h1 className="text-3xl sm:text-4xl font-semibold mb-4 text-center sm:text-left w-full max-w-6xl">
          Latest Judo News
        </h1>

        {news.length === 0 ? (
          <p className="text-center text-gray-500">No news available at the moment.</p>
        ) : (
          <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 w-full max-w-6xl">
            {news.slice(0, 6).map((article, index) => (
              <div
                key={index}
                onClick={() => window.open(article.url, "_blank")}
                className="bg-white p-4 rounded-2xl shadow-md hover:shadow-xl transition-shadow cursor-pointer"
              >
                {article.urlToImage ? (
                  <img
                    src={article.urlToImage}
                    alt={article.title}
                    className="rounded-lg h-48 w-full object-cover mb-4"
                  />
                ) : (
                  <div className="bg-gray-200 rounded-lg h-48 w-full mb-4 flex items-center justify-center text-gray-500">
                    No Image
                  </div>
                )}
                <h3 className="font-semibold text-lg mb-2">{article.title}</h3>
                {article.description && (
                  <p className="text-sm text-gray-700 line-clamp-3">{article.description}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}

export async function getServerSideProps(context) {
  const protocol = context.req.headers["x-forwarded-proto"] || "http";
  const host = context.req.headers.host;
  const baseUrl = `${protocol}://${host}`;

  let news = [];
  try {
    const res = await fetch(`${baseUrl}/api/judo-news`);
    const json = await res.json();
    news = Array.isArray(json) ? json : json.news || [];
  } catch (err) {
    console.error("Failed to fetch judo news:", err);
    news = [
      {
        title: "Unable to fetch live judo news",
        description: "Showing fallback content instead.",
        url: "#",
        urlToImage: "/placeholder.png",
      },
    ];
  }

  return {
    props: {
      news,
    },
  };
}
