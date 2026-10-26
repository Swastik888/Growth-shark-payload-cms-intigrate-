
import { Helmet } from "react-helmet-async";

function getImageUrl(image) {
    if (!image) return "";
    if (typeof image === "string") return image;
    return image.url || image.thumbnailURL || "";
}

function absoluteUrl(url, origin) {
    if (!url) return "";
    try {
        return new URL(url, origin || undefined).href;
    } catch {
        return "";
    }
}

export default function SEO({
    meta = {},
    fallback = {},
    schema = [],
    title: titleProp,
    description: descriptionProp,
    image: imageProp,
    keywords: keywordsProp,
    noindex: noindexProp,
    noIndex: noIndexProp,
    canonicalUrl: canonicalProp,
    ogType = "website",
}) {
    const title =
        meta.title ||
        titleProp ||
        fallback.title ||
        "";

    const description =
        meta.description ||
        descriptionProp ||
        fallback.description ||
        "";

    const rawImage =
        meta.image ||
        imageProp ||
        fallback.image ||
        "";

    const keywordsValue =
        meta.keywords ||
        keywordsProp ||
        fallback.keywords ||
        "";

    const keywords = Array.isArray(keywordsValue)
        ? keywordsValue.join(", ")
        : keywordsValue;

    const noindex = Boolean(
        meta.noindex ??
        meta.noIndex ??
        noindexProp ??
        noIndexProp ??
        fallback.noindex ??
        fallback.noIndex ??
        false
    );

    const baseUrl = (
        import.meta.env.VITE_BASE_URL ||
        (typeof window !== "undefined"
            ? window.location.origin
            : "")
    ).replace(/\/+$/, "");

    const pathname =
        typeof window !== "undefined"
            ? window.location.pathname
            : "/";

    const canonicalPath =
        pathname === "/" ? "/" : pathname.replace(/\/+$/, "");

    const canonical = absoluteUrl(
        canonicalProp || meta.canonicalUrl || `${baseUrl}${canonicalPath}`,
        baseUrl
    );

    const image = absoluteUrl(getImageUrl(rawImage), baseUrl);

    const structuredData = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "Organization",
                name: "GrowthShark",
                ...(baseUrl ? { url: baseUrl } : {}),
                email: "marketing@growthshark.io",
            },
            {
                "@type": "WebPage",
                ...(title ? { name: title } : {}),
                ...(description ? { description } : {}),
                ...(canonical ? { url: canonical } : {}),
            },
            ...schema.filter(Boolean),
        ],
    };

    return (
        <Helmet>
            {title && <title>{title}</title>}

            {description && (
                <meta name="description" content={description} />
            )}

            {keywords && (
                <meta name="keywords" content={keywords} />
            )}

            <meta
                name="robots"
                content={
                    noindex
                        ? "noindex, nofollow"
                        : "index, follow"
                }
            />

            {canonical && (
                <link rel="canonical" href={canonical} />
            )}

            <meta property="og:type" content={ogType} />
            <meta property="og:site_name" content="GrowthShark" />

            {title && (
                <>
                    <meta property="og:title" content={title} />
                    <meta name="twitter:title" content={title} />
                </>
            )}

            {description && (
                <>
                    <meta
                        property="og:description"
                        content={description}
                    />
                    <meta
                        name="twitter:description"
                        content={description}
                    />
                </>
            )}

            {image && (
                <>
                    <meta property="og:image" content={image} />
                    <meta name="twitter:image" content={image} />
                    <meta
                        name="twitter:card"
                        content="summary_large_image"
                    />
                </>
            )}

            {canonical && (
                <meta property="og:url" content={canonical} />
            )}

            <script type="application/ld+json">
                {JSON.stringify(structuredData)}
            </script>
        </Helmet>
    );
}
