
import { useLocation } from "react-router-dom";
import SEO from "./SEO";
import { useGlobal } from "../hooks/useCMS";

function normalizePath(pathname = "/") {
    const withoutQuery = pathname.split("?")[0].split("#")[0];
    const trimmed = withoutQuery.replace(/\/+$/, "");

    return trimmed || "/";
}

function filled(value) {
    if (!value || typeof value !== "object") {
        return {};
    }

    return Object.fromEntries(
        Object.entries(value).filter(
            ([, fieldValue]) =>
                fieldValue !== undefined &&
                fieldValue !== null &&
                fieldValue !== ""
        )
    );
}

export default function PageSEO() {
    const location = useLocation();
    const pathname = normalizePath(location.pathname);

    const { data, loading, error } = useGlobal("seo");

    // Blog articles supply their own title, description, image,
    // canonical URL and BlogPosting structured data in BlogPost.jsx.
    if (pathname.startsWith("/blog/")) {
        return null;
    }

    if (loading || error || !data) {
        return null;
    }

    const entries = Array.isArray(data.pages)
        ? data.pages
        : Array.isArray(data.entries)
            ? data.entries
            : [];

    const defaults = filled(data.defaults);

    const entry = entries.find((item) => {
        const entryPath = normalizePath(
            item.path || item.slug || item.url || "/"
        );

        return entryPath === pathname;
    });

    const pageMeta = {
        ...defaults,
        ...filled(entry),
    };

    // No matching page entry: use defaults, if configured.
    if (!Object.keys(pageMeta).length) {
        return null;
    }

    return <SEO meta={pageMeta} />;
}
