import { Fragment } from "react";

const CMS = (import.meta.env.VITE_CMS_URL || "").replace(/\/+$/, "");

// Payload media doc (or URL string) -> full image URL
export const cmsImg = (m) => {
    if (!m) return "";
    const url = typeof m === "string" ? m : m.url;
    if (!url) return "";
    return /^https?:\/\//i.test(url) ? url : `${CMS}${url}`;
};

// Styles for blog content (used for CMS rich text and for the old WordPress HTML)
export const articleCSS = `
.cms-blog{color:inherit;font-size:1.125rem;line-height:2}
.cms-blog > *:first-child{margin-top:0}
.cms-blog p{margin:0 0 1.25rem}
.cms-blog h2{font-size:2.25rem;font-weight:700;line-height:1.25;margin:2.5rem 0 1.25rem}
.cms-blog h3{font-size:1.875rem;font-weight:700;line-height:1.3;margin:2rem 0 1rem}
.cms-blog h4,.cms-blog h5,.cms-blog h6{font-size:1.5rem;font-weight:700;margin:1.75rem 0 .75rem}
.cms-blog ul{list-style:disc;padding-left:2rem;margin:0 0 1.25rem}
.cms-blog ol{list-style:decimal;padding-left:2rem;margin:0 0 1.25rem}
.cms-blog li{margin:.35rem 0}
.cms-blog li > ul,.cms-blog li > ol{margin-bottom:0}
.cms-blog a{color:#00b4ff;text-decoration:none}
.cms-blog a:hover{text-decoration:underline}
.cms-blog img{display:block;max-width:100%;height:auto;border-radius:1rem;margin:1.5rem auto}
.cms-blog figure{margin:1.5rem 0}
.cms-blog iframe,.cms-blog video{max-width:100%}
.cms-blog blockquote{border-left:4px solid #00b4ff;padding-left:1rem;font-style:italic;margin:1.5rem 0}
.cms-blog hr{border:0;border-top:1px solid rgba(255,255,255,.2);margin:2rem 0}
.cms-blog code{background:rgba(255,255,255,.12);padding:.1rem .4rem;border-radius:.25rem;font-size:.95em}
.cms-blog table{width:100%;border-collapse:collapse;margin:1.5rem 0;display:block;overflow-x:auto}
.cms-blog th,.cms-blog td{border:1px solid rgba(255,255,255,.2);padding:.5rem .75rem}
.cms-highlight a{color:#000;text-decoration:underline}
.cms-highlight blockquote{border-color:#000}
@media (max-width:640px){
  .cms-blog{font-size:1rem;line-height:1.9}
  .cms-blog h2{font-size:1.75rem}
  .cms-blog h3{font-size:1.5rem}
}
`;

const ALIGN = ["left", "center", "right", "justify"];

const blockStyle = (n) => {
    const s = {};
    if (ALIGN.includes(n.format)) s.textAlign = n.format;
    if (n.indent) s.paddingInlineStart = `${n.indent * 2}rem`;
    return Object.keys(s).length ? s : undefined;
};

// Lexical text format bits: 1 bold, 2 italic, 4 strike, 8 underline, 16 code, 32 sub, 64 sup
function renderText(n, key) {
    const f = n.format || 0;
    let el = n.text;
    if (f & 16) el = <code>{el}</code>;
    if (f & 32) el = <sub>{el}</sub>;
    if (f & 64) el = <sup>{el}</sup>;
    if (f & 1) el = <strong>{el}</strong>;
    if (f & 2) el = <em>{el}</em>;
    if (f & 8) el = <u>{el}</u>;
    if (f & 4) el = <s>{el}</s>;
    return <Fragment key={key}>{el}</Fragment>;
}

function renderNodes(nodes = []) {
    return nodes.map((n, i) => renderNode(n, i));
}

function renderNode(n, key) {
    if (!n) return null;
    const kids = () => renderNodes(n.children);

    switch (n.type) {
        case "text":
            return renderText(n, key);
        case "linebreak":
            return <br key={key} />;
        case "tab":
            return <Fragment key={key}>{"\t"}</Fragment>;
        case "paragraph":
            if (!n.children?.length) return null; // skip empty paragraphs
            return (
                <p key={key} style={blockStyle(n)}>
                    {kids()}
                </p>
            );
        case "heading": {
            const Tag = n.tag === "h1" ? "h2" : n.tag || "h2"; // page already has one h1
            return (
                <Tag key={key} style={blockStyle(n)}>
                    {kids()}
                </Tag>
            );
        }
        case "quote":
            return (
                <blockquote key={key} style={blockStyle(n)}>
                    {kids()}
                </blockquote>
            );
        case "list": {
            const ordered = n.listType === "number";
            const Tag = ordered ? "ol" : "ul";
            return (
                <Tag key={key} start={ordered && n.start > 1 ? n.start : undefined}>
                    {kids()}
                </Tag>
            );
        }
        case "listitem": {
            const nested = n.children?.length === 1 && n.children[0].type === "list";
            return (
                <li key={key} style={nested ? { listStyle: "none" } : undefined}>
                    {kids()}
                </li>
            );
        }
        case "link":
        case "autolink": {
            const url = n.fields?.url || "#";
            const blank = n.fields?.newTab;
            return (
                <a
                    key={key}
                    href={url}
                    target={blank ? "_blank" : undefined}
                    rel={blank ? "noopener noreferrer" : undefined}
                >
                    {kids()}
                </a>
            );
        }
        case "horizontalrule":
            return <hr key={key} />;
        case "upload": {
            const src = cmsImg(n.value);
            return src ? <img key={key} src={src} alt={n.value?.alt || ""} loading="lazy" /> : null;
        }
        default:
            return n.children ? <Fragment key={key}>{kids()}</Fragment> : null;
    }
}

// <div className="cms-blog"><RichText data={field} /></div>
export default function RichText({ data }) {
    const nodes = data?.root?.children;
    if (!nodes?.length) return null;
    return <>{renderNodes(nodes)}</>;
}

const textOf = (n) => (n.type === "text" ? n.text : (n.children || []).map(textOf).join(""));

// Short plain-text summary (first paragraph) for blog cards and SEO fallback
export function plainText(data, max = 150) {
    const blocks = data?.root?.children || [];
    const first =
        blocks.filter((b) => b.type === "paragraph").map(textOf).find((t) => t.trim()) ||
        blocks.map(textOf).find((t) => t.trim()) ||
        "";
    const t = first.trim().replace(/\s+/g, " ");
    return t.length > max ? t.slice(0, max).replace(/\s+\S*$/, "") + ".." : t;
}