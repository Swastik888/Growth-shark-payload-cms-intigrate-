import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

function LexicalContentRenderer({ content, apiBase }) {
    if (!content || !content.root || !content.root.children) return null;

    return content.root.children.map((node, index) => {
        // Check alignment format on paragraph/heading nodes
        const isCentered = node.format === 'center' || node.format === 2;
        const alignClass = isCentered ? 'text-center' : 'text-center md:text-left';

        switch (node.type) {
            case 'paragraph':
                return (
                    <p key={index} className={`text-gray-300 text-base md:text-lg leading-relaxed mb-4 ${alignClass}`}>
                        {node.children?.map((child, cIdx) => {
                            let text = child.text || '';
                            if (child.format & 1) text = <strong key={cIdx} className="text-white font-bold">{text}</strong>;
                            if (child.format & 2) text = <em key={cIdx}>{text}</em>;
                            return text;
                        })}
                    </p>
                );

            case 'heading':
                const headingText = node.children?.map(c => c.text).join('') || '';
                return (
                    <h3 key={index} className={`text-xl md:text-2xl font-bold mb-3 ${alignClass}`}>
                        {headingText}
                    </h3>
                );

            case 'list':
                const ListTag = node.tag === 'ol' ? 'ol' : 'ul';
                const listStyle = node.tag === 'ol' ? 'list-decimal' : 'list-disc';
                return (
                    <ListTag key={index} className={`${listStyle} list-inside space-y-2 mb-4 pl-2 text-center`}>
                        {node.children?.map((listItem, lIdx) => (
                            <li key={lIdx} className="leading-relaxed">
                                {listItem.children?.map(c => c.text).join('')}
                            </li>
                        ))}
                    </ListTag>
                );

            case 'upload':
                // Handles embedded images inside the rich text editor
                const mediaObj = typeof node.value === 'object' ? node.value : node.fields?.doc?.value;
                const imgUrl = mediaObj?.url || (typeof node.value === 'string' ? null : null);

                if (imgUrl) {
                    return (
                        <div key={index} className="my-6 flex justify-center">
                            <div className="overflow-hidden rounded-2xl border border-white/10 shadow-2xl max-w-2xl w-full">
                                <img
                                    src={`${apiBase}${imgUrl}`}
                                    alt={mediaObj?.alt || "Embedded image"}
                                    className="w-full h-auto object-cover"
                                />
                            </div>
                        </div>
                    );
                }
                return null;

            default:
                return null;
        }
    });
}

export default function CaseStudy() {
    const { slug } = useParams();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchProject() {
            try {
                const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
                const res = await fetch(`${apiUrl}/api/portfolio?where[slug][equals]=${slug}`);
                const data = await res.json();

                if (data.docs && data.docs.length > 0) {
                    setProject(data.docs[0]);
                }
            } catch (err) {
                console.error('Error fetching project:', err);
            } finally {
                setLoading(false);
            }
        }
        fetchProject();
    }, [slug]);

    if (loading) {
        return <div className="text-white text-center py-32 text-xl animate-pulse">Loading case study...</div>;
    }

    if (!project) {
        return (
            <div className="text-white text-center py-32 space-y-4 min-h-screen">
                <h2 className="text-2xl font-bold">Case study not found</h2>
                <Link to="/portfolio" className="text-sky-400 underline">Back to Portfolio</Link>
            </div>
        );
    }

    const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    const seo = project.meta || project.seo || {};

    const seoTitle = seo.title || project.title;
    const seoDescription = seo.description || project.category || '';
    const seoKeywords = seo.keywords || '';
    const canonicalUrl = seo.canonical || window.location.href;
    const robotsValue = seo.noIndex ? 'noindex, nofollow' : 'index, follow';
    const publisherName = seo.publisher || 'Growthshark';

    return (
        <div className="text-white bg-gradient-to-r from-black via-[#0b223f] to-[#06263f] min-h-screen px-6 py-20">
            <Helmet>
                <title>{seoTitle}</title>
                <meta name="description" content={seoDescription} />
                {seoKeywords && <meta name="keywords" content={seoKeywords} />}
                <meta name="robots" content={robotsValue} />
                <meta name="publisher" content={publisherName} />
                <link rel="canonical" href={canonicalUrl} />
            </Helmet>

            <div className="max-w-4xl mx-auto space-y-12 pt-10">

                {/* Back Link */}
                <Link to="/portfolio" className="inline-block text-sky-400 hover:text-sky-300 text-sm font-semibold">
                    ← Back to Portfolio Grid
                </Link>

                {/* Structured Sections Loop: Heading -> Image -> Rich Text Content */}
                {project.sections?.map((section, index) => {
                    let containerClass = "bg-[#081b33]/90 border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl space-y-6 text-center";
                    let headingClass = "text-2xl md:text-3xl font-bold text-white text-center mb-4";

                    if (section.layoutStyle === 'highlightBox') {
                        containerClass = "bg-sky-500 text-slate-950 rounded-3xl p-8 md:p-12 shadow-2xl space-y-6 text-center";
                        headingClass = "text-2xl md:text-3xl font-bold text-slate-950 text-center mb-4";
                    } else if (section.layoutStyle === 'centered') {
                        containerClass = "text-center space-y-6 max-w-3xl mx-auto py-4";
                        headingClass = "text-3xl font-bold text-white text-center mb-4";
                    }

                    return (
                        <div key={index} className={containerClass}>

                            {/* 1. Section Heading */}
                            {section.sectionTitle && (
                                <h2 className={headingClass}>
                                    {section.sectionTitle}
                                </h2>
                            )}

                            {/* 2. Attached Chart / Analytics Screenshot */}
                            {section.sectionImage?.url && (
                                <div className="mb-6 flex justify-center">
                                    <div className="overflow-hidden rounded-2xl border border-white/10 shadow-2xl w-full">
                                        <img
                                            src={`${apiBase}${section.sectionImage.url}`}
                                            alt={section.sectionTitle || "Case study attachment"}
                                            className="w-full h-auto object-cover mx-auto"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* 3. Rich Text Content (Paragraphs, Embedded Editor Uploads, Bullet Lists) */}
                            {section.richContent && (
                                <LexicalContentRenderer content={section.richContent} apiBase={apiBase} />
                            )}

                        </div>
                    );
                })}

            </div>
        </div>
    );
}