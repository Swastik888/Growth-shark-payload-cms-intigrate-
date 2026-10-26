import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { mediaUrl } from "../../hooks/useCMS";
import SEO from "../../components/SEO";

// Old hardcoded pages: shown only while a service has no entry in the CMS.
import B2B from "./B2B";
import Blog from "./Blog";
import CommunityManagement from "./CommunityManagement";
import ContentCreation from "./ContentCreation";
import CopyWriting from "./CopyWriting";
import Ecommerce from "./Ecommerce";
import EmailMarketing from "./EmailMarketing";
import FacebookMarketing from "./FacebookMarketing";
import InstaMarketing from "./InstaMarketing";
import SocialListening from "./SocialListening";
import VideoContent from "./VideoContent";

const LEGACY = {
  "b2b-seo-service": B2B,
  "blog-writing-service": Blog,
  "community-management": CommunityManagement,
  "content-creation-services": ContentCreation,
  "copywriting-services": CopyWriting,
  "ecommerce-seo-services": Ecommerce,
  "email-marketing-services": EmailMarketing,
  "facebook-marketing": FacebookMarketing,
  "insta-marketing": InstaMarketing,
  "social-listening": SocialListening,
  "video-editing-service": VideoContent,
};

const CMS = (import.meta.env.VITE_CMS_URL || "").replace(/\/+$/, "");
const cache = {};

function useService(slug) {
  const [state, setState] = useState({ loading: true, doc: null });

  useEffect(() => {
    let alive = true;
    if (cache[slug] !== undefined) {
      setState({ loading: false, doc: cache[slug] });
      return;
    }
    setState({ loading: true, doc: null });
    fetch(`${CMS}/api/services?where[slug][equals]=${encodeURIComponent(slug)}&depth=1&limit=1`)
      .then((r) => r.json())
      .then((j) => {
        const doc = j?.docs?.[0] || null;
        cache[slug] = doc;
        if (alive) setState({ loading: false, doc });
      })
      .catch(() => alive && setState({ loading: false, doc: null }));
    return () => {
      alive = false;
    };
  }, [slug]);

  return state;
}

// **bold** inside any text field becomes <strong>
const rich = (t = "") =>
  String(t)
    .split(/\*\*(.+?)\*\*/g)
    .map((p, i) => (i % 2 ? <strong key={i}>{p}</strong> : p));

const card =
  "bg-gradient-to-br from-[#0b223f]/60 to-[#06263f]/40 p-6 rounded-2xl shadow-lg border border-white/10 backdrop-blur-sm hover:shadow-sky-500/40 hover:scale-[1.02] transition-all duration-300";
const panel =
  "bg-gradient-to-br from-[#0b223f]/70 to-[#06263f]/50 border border-white/10 rounded-xl p-6 shadow-lg backdrop-blur";

function Title({ start, highlight, end, as: Tag = "h2", className = "" }) {
  return (
    <Tag className={className}>
      {start} {highlight && <span className="text-sky-300">{highlight}</span>} {end}
    </Tag>
  );
}

export default function ServicePage() {
  const { slug } = useParams();
  const { loading, doc } = useService(slug);

  if (loading) return <div className="min-h-screen bg-black" />;

  if (!doc) {
    const Legacy = LEGACY[slug];
    return Legacy ? (
      <Legacy />
    ) : (
      <div className="min-h-screen bg-black text-white pt-40 text-center">Service not found</div>
    );
  }

  const { hero, whatIs, approach, different, whyAds, faq, results, cta, meta } = doc;

  return (
    <section className="bg-gradient-to-r from-black via-[#0b223f] to-[#06263f] text-white px-6 py-30 sm:py-30">
      <SEO
        title={meta?.title || doc.title}
        description={meta?.description}
        image={meta?.image ? mediaUrl(meta.image) : undefined}
        keywords={meta?.keywords}
        noindex={meta?.noindex}
      />

      <div className="space-y-14">
        {/* HERO */}
        {hero?.titleStart && (
          <div className="text-center max-w-6xl mx-auto">
            <Title
              as="h1"
              start={hero.titleStart}
              highlight={hero.titleHighlight}
              end={hero.titleEnd}
              className="text-4xl md:text-5xl font-extrabold mb-8 text-center"
            />
            {hero.subheading && <h2 className="text-3xl font-semibold text-sky-300 mb-6">{hero.subheading}</h2>}
            {hero.intro && <p className="text-lg max-w-3xl mx-auto">{rich(hero.intro)}</p>}
          </div>
        )}

        {/* WHAT IS */}
        {whatIs?.heading && (
          <div className="space-y-8 max-w-6xl mx-auto pt-10">
            <h2 className="text-3xl font-bold text-center">{whatIs.heading}</h2>
            {whatIs.text && <p className="text-lg text-center">{rich(whatIs.text)}</p>}
            {whatIs.facts?.length > 0 && (
              <div className={`${panel} text-center hover:scale-105 transition`}>
                {whatIs.factsTitle && <h3 className="text-2xl font-semibold mb-2">{whatIs.factsTitle}</h3>}
                <ul className="list-disc pl-6 space-y-2 text-start mt-8">
                  {whatIs.facts.map((f, i) => (
                    <li key={i}>{rich(f.text)}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* APPROACH CARDS */}
        {approach?.cards?.length > 0 && (
          <div>
            {approach.heading && <h2 className="text-3xl font-bold mb-10 text-center">{approach.heading}</h2>}
            <div className="flex flex-wrap justify-center gap-6 py-8 max-w-7xl mx-auto">
              {approach.cards.map((c, i) => (
                <div key={i} className={`w-full sm:w-[47%] lg:w-[30%] ${card}`}>
                  <h3 className="text-xl font-bold mb-2">{c.title}</h3>
                  <p>{c.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* DIFFERENTIATORS */}
        {different?.points?.length > 0 && (
          <div className="max-w-3xl mx-auto">
            <Title
              start={different.titleStart}
              highlight={different.titleHighlight}
              end={different.titleEnd}
              className="text-4xl font-bold mb-6 text-white text-center"
            />
            <ul className={`${panel} text-center hover:scale-105 transition`}>
              {different.points.map((p, i) => (
                <li key={i} className="flex gap-3 p-2">
                  <span className="text-sky-300 font-bold">✔</span>
                  {p.text}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* WHY ADS + FAQ */}
        {(whyAds?.heading || faq?.items?.length > 0) && (
          <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {whyAds?.heading && (
              <div>
                <h2 className="text-3xl font-bold mb-4 text-white">{whyAds.heading}</h2>
                {whyAds.intro && <p className="text-lg text-gray-300 mb-3">{whyAds.intro}</p>}
                <ul className="space-y-2 text-gray-300">
                  {whyAds.points?.map((p, i) => (
                    <li key={i}>🔹 {rich(p.text)}</li>
                  ))}
                </ul>
              </div>
            )}
            {faq?.items?.length > 0 && (
              <div>
                {faq.heading && <h2 className="text-2xl font-semibold mb-4 text-white">{faq.heading}</h2>}
                <div className="space-y-6 text-gray-300 text-sm">
                  {faq.items.map((q, i) => (
                    <div key={i}>
                      <p className="font-semibold text-gray-300">➤ {q.question}</p>
                      <p className="mt-1">{q.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* RESULTS */}
        {results?.heading && (
          <div>
            <h2 className="text-3xl font-semibold mb-4 text-white text-center">{results.heading}</h2>
            {results.text && (
              <p className="max-w-3xl mx-auto text-center whitespace-pre-line">{rich(results.text)}</p>
            )}
          </div>
        )}

        {/* CTA */}
        {cta?.heading && (
          <div className={`${panel} text-center max-w-6xl mx-auto`}>
            <h2 className="text-3xl font-semibold mb-4 text-white text-center">{cta.heading}</h2>
            {cta.text && <p className="max-w-3xl mx-auto text-center">{cta.text}</p>}
            <div className="flex gap-4 mt-10 justify-center">
              <button className="px-6 py-3 bg-sky-300 text-black rounded-md font-semibold hover:bg-sky-400 transition cursor-pointer">
                <Link to={cta.buttonLink || "/contact"}>{cta.buttonText || "Contact Us"}</Link>
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}