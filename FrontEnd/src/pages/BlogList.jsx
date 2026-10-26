
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SEO from "../components/SEO";
import { cmsImg, plainText } from "../components/RichText";

const CMS = (import.meta.env.VITE_CMS_URL || "").replace(/\/+$/, "");

async function getCms(signal) {
  if (!CMS) {
    throw new Error("VITE_CMS_URL is not configured.");
  }

  const url = new URL(`${CMS}/api/blogs`);
  url.searchParams.set("depth", "1");
  url.searchParams.set("limit", "100");
  url.searchParams.set("sort", "-createdAt");

  const response = await fetch(url.toString(), { signal });

  if (!response.ok) {
    throw new Error(`CMS request failed: ${response.status}`);
  }

  const json = await response.json();

  return (json.docs || [])
    .filter((blog) => blog?.slug && blog?.title)
    .map((blog) => ({
      key: `cms-${blog.id}`,
      slug: blog.slug,
      title: blog.title,
      category: blog.category || "",
      image: cmsImg(blog.thumbnail),
      excerpt:
        blog.excerpt ||
        plainText(blog.sections?.[0]?.richContent, 150) ||
        "",
      publishedAt: blog.publishedAt || blog.createdAt,
    }));
}

function formatDate(value) {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function BlogList() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadBlogs() {
      try {
        const blogs = await getCms(controller.signal);

        if (!controller.signal.aborted) {
          setPosts(blogs);
          setError("");
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          console.error("Failed to load CMS blogs:", err);
          setPosts([]);
          setError("Could not load blogs. Please try again later.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadBlogs();

    return () => controller.abort();
  }, []);

  const baseUrl = (
    import.meta.env.VITE_BASE_URL ||
    (typeof window !== "undefined" ? window.location.origin : "")
  ).replace(/\/+$/, "");

  return (
    <>
      <SEO
        title="Blogs | GrowthShark"
        description="Explore articles, ideas, and practical guides from GrowthShark."
        canonicalUrl={`${baseUrl}/blog`}
      />

      <main className="min-h-screen bg-gradient-to-r from-black via-[#0b223f] to-[#06263f]">
        <div className="mx-auto max-w-6xl px-4 pb-12 pt-28 sm:px-6 sm:pt-36 lg:pt-40">
          {loading && (
            <div className="grid min-h-[50vh] place-items-center text-white">
              Loading...
            </div>
          )}

          {!loading && error && (
            <div className="grid min-h-[50vh] place-items-center text-center text-red-300">
              <div>
                <p>{error}</p>
                <button
                  type="button"
                  onClick={() => window.location.reload()}
                  className="mt-4 rounded-lg bg-sky-600 px-5 py-2 font-semibold text-white hover:bg-sky-500"
                >
                  Try again
                </button>
              </div>
            </div>
          )}

          {!loading && !error && posts.length === 0 && (
            <div className="grid min-h-[40vh] place-items-center text-gray-300">
              No blogs yet.
            </div>
          )}

          {!loading && !error && posts.length > 0 && (
            <div className="grid items-stretch gap-8 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <article
                  key={post.key}
                  className="flex flex-col rounded-2xl bg-white p-4 shadow transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <Link
                    to={`/blog/${post.slug}`}
                    aria-label={`Read ${post.title}`}
                    className="block overflow-hidden rounded-xl"
                  >
                    {post.image ? (
                      <img
                        src={post.image}
                        alt={post.title}
                        className="mb-3 h-48 w-full rounded-xl object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="mb-3 grid h-48 place-items-center rounded-xl bg-gray-100 text-sm text-gray-500">
                        No image available
                      </div>
                    )}
                  </Link>

                  <div className="mb-1 flex items-center justify-between gap-3">
                    {post.category ? (
                      <span className="text-xs font-semibold uppercase tracking-widest text-sky-600">
                        {post.category}
                      </span>
                    ) : (
                      <span />
                    )}

                    {post.publishedAt && (
                      <time
                        dateTime={post.publishedAt}
                        className="shrink-0 text-xs text-gray-500"
                      >
                        {formatDate(post.publishedAt)}
                      </time>
                    )}
                  </div>

                  <h2 className="text-xl font-semibold leading-snug text-gray-950">
                    <Link
                      to={`/blog/${post.slug}`}
                      className="hover:underline"
                    >
                      {post.title}
                    </Link>
                  </h2>

                  {post.excerpt && (
                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-gray-700">
                      {post.excerpt}
                    </p>
                  )}

                  <Link
                    to={`/blog/${post.slug}`}
                    className="mt-auto inline-block pt-5 text-gray-900 underline hover:text-sky-700"
                  >
                    Read more
                  </Link>
                </article>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}




