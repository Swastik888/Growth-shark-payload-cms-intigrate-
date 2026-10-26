
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import SEO from "../components/SEO";
import { cmsImg, plainText } from "../components/RichText";

const CMS = (import.meta.env.VITE_CMS_URL || "").replace(/\/+$/, "");

async function loadPost(slug, signal) {
  if (!CMS) {
    throw new Error("VITE_CMS_URL is not configured.");
  }

  const url = new URL(`${CMS}/api/blogs`);
  url.searchParams.set("where[slug][equals]", slug);
  url.searchParams.set("depth", "2");
  url.searchParams.set("limit", "1");

  const response = await fetch(url.toString(), { signal });

  if (!response.ok) {
    throw new Error(`CMS request failed: ${response.status}`);
  }

  const result = await response.json();
  return result.docs?.[0] || null;
}

function getBaseUrl() {
  return (
    import.meta.env.VITE_BASE_URL ||
    (typeof window !== "undefined" ? window.location.origin : "")
  ).replace(/\/+$/, "");
}

function formatDate(value) {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function renderNode(node, index) {
  if (!node) return null;

  if (node.type === "text") {
    let content = node.text || "";

    if (node.format & 1) content = <strong>{content}</strong>;
    if (node.format & 2) content = <em>{content}</em>;
    if (node.format & 8) content = <u>{content}</u>;
    if (node.format & 16) content = <code>{content}</code>;

    return <span key={index}>{content}</span>;
  }

  const children = (node.children || []).map((child, childIndex) =>
    renderNode(child, childIndex)
  );

  switch (node.type) {
    case "root":
      return <div key={index}>{children}</div>;

    case "paragraph":
      return (
        <p key={index} className="mb-5 leading-8 text-gray-200">
          {children}
        </p>
      );

    case "heading": {
      const tag = /^h[1-6]$/.test(node.tag) ? node.tag : "h2";
      const className =
        "mb-4 mt-8 font-bold tracking-tight text-white " +
        (tag === "h1"
          ? "text-3xl"
          : tag === "h2"
            ? "text-2xl"
            : "text-xl");

      if (tag === "h1") {
        return <h1 key={index} className={className}>{children}</h1>;
      }
      if (tag === "h3") {
        return <h3 key={index} className={className}>{children}</h3>;
      }
      if (tag === "h4") {
        return <h4 key={index} className={className}>{children}</h4>;
      }
      if (tag === "h5") {
        return <h5 key={index} className={className}>{children}</h5>;
      }
      if (tag === "h6") {
        return <h6 key={index} className={className}>{children}</h6>;
      }

      return <h2 key={index} className={className}>{children}</h2>;
    }

    case "list":
      return node.listType === "number" ? (
        <ol key={index} className="mb-5 list-decimal space-y-2 pl-6 text-gray-200">
          {children}
        </ol>
      ) : (
        <ul key={index} className="mb-5 list-disc space-y-2 pl-6 text-gray-200">
          {children}
        </ul>
      );

    case "listitem":
      return <li key={index}>{children}</li>;

    case "quote":
      return (
        <blockquote
          key={index}
          className="my-6 border-l-4 border-sky-500 pl-5 italic text-gray-300"
        >
          {children}
        </blockquote>
      );

    case "link":
    case "autolink": {
      const href = node.fields?.url || node.url || "#";
      const newTab = Boolean(node.fields?.newTab);

      return (
        <a
          key={index}
          href={href}
          target={newTab ? "_blank" : undefined}
          rel={newTab ? "noopener noreferrer" : undefined}
          className="text-sky-400 underline underline-offset-4 hover:text-sky-300"
        >
          {children}
        </a>
      );
    }

    case "linebreak":
      return <br key={index} />;

    default:
      return children.length ? <div key={index}>{children}</div> : null;
  }
}

function RichContent({ content }) {
  if (!content) return null;

  if (typeof content === "string") {
    return (
      <p className="mb-5 whitespace-pre-line leading-8 text-gray-200">
        {content}
      </p>
    );
  }

  const root = content.root || content;

  if (!Array.isArray(root.children)) return null;

  return <div>{renderNode(root, 0)}</div>;
}

export default function BlogPost() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function fetchPost() {
      setLoading(true);
      setPost(null);
      setError("");

      try {
        const result = await loadPost(slug, controller.signal);

        if (!controller.signal.aborted) {
          if (result) {
            setPost(result);
          } else {
            setError("not-found");
          }
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          console.error("Failed to load CMS blog:", err);
          setError("load-failed");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    if (slug) {
      fetchPost();
    } else {
      setError("not-found");
      setLoading(false);
    }

    return () => controller.abort();
  }, [slug]);

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-r from-black via-[#0b223f] to-[#06263f] px-4 pt-32 text-center text-white">
        Loading article...
      </main>
    );
  }

  if (error === "not-found") {
    return (
      <main className="grid min-h-screen place-items-center bg-gradient-to-r from-black via-[#0b223f] to-[#06263f] px-4 pt-24 text-center text-white">
        <div>
          <h1 className="text-3xl font-bold">Blog not found</h1>
          <p className="mt-4 text-gray-300">
            This article may have been unpublished or the URL may be incorrect.
          </p>
          <Link to="/blog" className="mt-6 inline-block text-sky-400 underline">
            Back to blogs
          </Link>
        </div>
      </main>
    );
  }

  if (error || !post) {
    return (
      <main className="grid min-h-screen place-items-center bg-gradient-to-r from-black via-[#0b223f] to-[#06263f] px-4 pt-24 text-center text-white">
        <div>
          <h1 className="text-2xl font-bold">Unable to load this article</h1>
          <p className="mt-4 text-gray-300">Please try again later.</p>
          <Link to="/blog" className="mt-6 inline-block text-sky-400 underline">
            Back to blogs
          </Link>
        </div>
      </main>
    );
  }

  const banner = cmsImg(post.thumbnail);
  const description =
    post.seo?.description ||
    post.excerpt ||
    plainText(post.sections?.[0]?.richContent, 160) ||
    "";

  const image = cmsImg(post.seo?.image) || banner;
  const baseUrl = getBaseUrl();
  const canonicalUrl = post.slug
    ? `${baseUrl}/blog/${post.slug}`
    : undefined;

  const articleSchema = {
    "@type": "BlogPosting",
    headline: post.seo?.title || post.title,
    ...(description ? { description } : {}),
    ...(image ? { image: [image] } : {}),
    ...(post.publishedAt ? { datePublished: post.publishedAt } : {}),
    ...(post.updatedAt ? { dateModified: post.updatedAt } : {}),
    ...(canonicalUrl
      ? {
        url: canonicalUrl,
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": canonicalUrl,
        },
      }
      : {}),
  };

  return (
    <>
      <SEO
        title={post.seo?.title || post.title}
        description={description}
        image={image}
        keywords={post.seo?.keywords}
        noindex={post.seo?.noindex}
        canonicalUrl={canonicalUrl}
        ogType="article"
        schema={[articleSchema]}
      />

      <main className="min-h-screen bg-gradient-to-r from-black via-[#0b223f] to-[#06263f] px-4 pb-20 pt-32 sm:px-6 sm:pt-36">
        <article className="mx-auto max-w-6xl">
          <Link
            to="/blog"
            className="mb-8 inline-flex items-center text-sm font-medium text-sky-400 transition hover:text-sky-300"
          >
            ← Back to blogs
          </Link>

          <header className="mb-10">
            {post.category && (
              <p className="mb-4 text-center text-xs font-semibold uppercase tracking-[0.2em] text-sky-400">
                {post.category}
              </p>
            )}

            <h1 className="mx-auto max-w-5xl text-center text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
              {post.title}
            </h1>

            {post.publishedAt && (
              <time
                dateTime={post.publishedAt}
                className="mt-5 block text-center text-sm text-gray-400"
              >
                {formatDate(post.publishedAt)}
              </time>
            )}

            {post.excerpt && (
              <p className="mx-auto mt-6 max-w-3xl text-center text-base leading-8 text-gray-300 sm:text-lg">
                {post.excerpt}
              </p>
            )}
          </header>

          {banner && (
            <img
              src={banner}
              alt={post.title}
              fetchPriority="high"
              className="mx-auto mb-12 max-h-[600px] w-full rounded-2xl object-cover shadow-2xl"
            />
          )}

          <div className="mx-auto max-w-4xl">
            {(post.sections || []).map((section, index) => {
              const sectionImage = cmsImg(section.sectionImage);

              return (
                <section
                  key={section.id || `${post.slug}-section-${index}`}
                  className="mb-10"
                >
                  {section.sectionTitle && (
                    <h2 className="mb-5 mt-8 text-2xl font-bold text-white sm:text-3xl">
                      {section.sectionTitle}
                    </h2>
                  )}

                  {sectionImage && (
                    <img
                      src={sectionImage}
                      alt={section.sectionTitle || post.title}
                      loading="lazy"
                      className="mb-6 w-full rounded-xl object-cover"
                    />
                  )}

                  <RichContent content={section.richContent} />
                </section>
              );
            })}
          </div>
        </article>
      </main>
    </>
  );
}

