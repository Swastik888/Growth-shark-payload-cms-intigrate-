import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

export default function Portfolio() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
        const res = await fetch(`${apiUrl}/api/portfolio`);
        const data = await res.json();
        if (data.docs) {
          setProjects(data.docs);
        }
      } catch (err) {
        console.error("Error fetching portfolio projects:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, []);

  const apiBase = import.meta.env.VITE_API_URL || "http://localhost:3000";

  return (
    <div className="bg-gradient-to-r from-black via-[#0b223f] to-[#06263f] px-6 py-20 relative overflow-hidden min-h-screen">
      <Helmet>
        <title>Explore Successful Campaigns and Case Studies | Growthshark</title>
        <meta
          name="description"
          content="Discover GrowthShark’s mission vision & success stories and learn how we help brands achieve growth with innovative strategies. Contact us Today."
        />
      </Helmet>

      {/* Background Glow */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="w-80 h-80 bg-sky-500 rounded-full blur-3xl absolute top-20 left-10"></div>
        <div className="w-96 h-96 bg-blue-900 rounded-full blur-3xl absolute bottom-0 right-10"></div>
      </div>

      <div className="relative max-w-6xl mx-auto z-10 pt-20">
        <h1 className="text-4xl md:text-5xl font-bold text-center text-white mb-12">
          Our <span className="text-[#49b9ff]">Portfolio</span> Case Studies
        </h1>

        {loading ? (
          <div className="text-center py-20 text-gray-400 text-xl animate-pulse">
            Loading portfolio...
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-20 text-gray-400 text-xl">
            No case studies found. Add them in your Payload CMS Admin Panel!
          </div>
        ) : (
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <Link
                key={project.id || project.slug}
                to={`/portfolio/${project.slug}`}
                className="relative bg-[#0b2a6d] text-white rounded-2xl overflow-hidden group transform transition hover:scale-105 shadow-xl h-[320px] flex items-center justify-center border border-white/10"
              >
                {/* Thumbnail Image */}
                {project.thumbnail?.url && (
                  <img
                    src={`${apiBase}${project.thumbnail.url}`}
                    alt={project.title}
                    className="w-full h-full object-cover absolute inset-0"
                  />
                )}

                {/* Hover Overlay matching original UI */}
                <div className="absolute inset-0 bg-black/75 backdrop-blur-sm opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center p-6 transition-all duration-300 text-center">
                  <p className="text-2xl font-bold text-white mb-2">
                    {project.title}
                  </p>
                  {project.category && (
                    <span className="text-xs uppercase tracking-widest text-sky-400 font-semibold">
                      {project.category}
                    </span>
                  )}
                  <span className="mt-4 text-xs font-semibold text-sky-300 border border-sky-400/50 px-4 py-1.5 rounded-full">
                    View Case Study →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}