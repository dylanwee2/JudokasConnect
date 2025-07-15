import Head from "next/head";

export default function Home({ news }) {
  return (
    <>
      <Head>
        <title>Judo News</title>
      </Head>

      <main className="ml-20 mt-10 mr-20">
        <h1 className="text-4xl font-semibold mb-8">Latest Judo News</h1>

        <div className="grid gap-12 grid-cols-1 md:grid-cols-3">
          {news.length === 0 && <p>No news available at the moment.</p>}

          {news.slice(0, 6).map((article, index) => (
            <div
              key={index}
              className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => window.open(article.url, "_blank")}
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