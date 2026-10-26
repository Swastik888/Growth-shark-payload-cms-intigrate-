import { useState } from "react";
import { Mail, Phone } from "lucide-react";
import { useGlobal } from "../hooks/useCMS";

const DEFAULT_MAP_SRC =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d49642.585803087815!2d87.82504918794346!3d23.246215328212315!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f849d1ea7e5efd%3A0x4ce71a0a521f8b0e!2sBardhaman%2C%20West%20Bengal!5e1!3m2!1sen!2sin!4v1754377415094!5m2!1sen!2sin";

const DEFAULT_EMAILS = ["marketing@growthshark.io", "diptesh@growthshark.io"];
const DEFAULT_PHONES = ["+91 83482 96083"];

// Accepts a plain URL or a pasted <iframe ...> tag; returns a safe Google Maps src or null
function resolveMapSrc(map) {
  if (!map || map.show === false) return null;

  if (map.mode === "embed" && map.embedLink) {
    const raw = map.embedLink.trim();
    const match = raw.match(/src=["']([^"']+)["']/i);
    const url = match ? match[1] : raw;
    const ok = /^https:\/\/(www\.)?google\.[a-z.]+\/maps/i.test(url);
    return ok ? url : null;
  }

  if (map.mode === "address" && map.address) {
    const zoom = map.zoom || 13;
    const type = map.mapType === "satellite" ? "k" : "m";
    return `https://maps.google.com/maps?q=${encodeURIComponent(map.address)}&t=${type}&z=${zoom}&output=embed`;
  }

  return DEFAULT_MAP_SRC;
}

function ContactSection() {
  const { data } = useGlobal("contact-page");
  const c = data || {};

  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("");

  const emails = c.info?.emails?.length
    ? c.info.emails.map((e) => e.email).filter(Boolean)
    : DEFAULT_EMAILS;
  const phones = c.info?.phones?.length
    ? c.info.phones.map((p) => p.phone).filter(Boolean)
    : DEFAULT_PHONES;

  // Whole map block is hidden only if admin turned it off; otherwise fall back to the default map
  const mapSrc = c.map ? resolveMapSrc(c.map) : DEFAULT_MAP_SRC;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("Sending...");

    try {
      const baseUrl = import.meta.env.VITE_API_URL.replace(/\/+$/, "");
      const response = await fetch(`${baseUrl}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        const contentType = response.headers.get("content-type");
        let errorMessage;

        if (contentType?.includes("application/json")) {
          const errorData = await response.json();
          errorMessage = errorData.message || "Unknown error";
        } else {
          errorMessage = await response.text();
        }

        console.error("Error:", errorMessage);
        setStatus(`Error: ${errorMessage}`);
        return;
      }

      const result = await response.json();
      console.log("Success:", result.message);
      setStatus("Message sent successfully!");
    } catch (error) {
      console.error("Contact form error:", error);
      setStatus("Error sending message. Please try again.");
    }
  }

  return (
    <section className="text-white pt-30 bg-gradient-to-r from-black via-[#0b223f] to-[#06263f] relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute inset-0 opacity-20">
        <div className="w-96 h-96 bg-sky-500 rounded-full blur-3xl absolute -top-20 -left-20"></div>
        <div className="w-96 h-96 bg-blue-800 rounded-full blur-3xl absolute bottom-0 right-0"></div>
      </div>

      <div className="relative px-6 z-10">
        {/* Heading */}
        <h2 className="text-sky-300 text-lg font-semibold mb-2 text-center">
          {c.heading?.eyebrow || "Contact"}
        </h2>
        <h1 className="text-3xl sm:text-4xl font-bold mb-12 text-center">
          {c.heading?.title || "Get in touch"}
        </h1>

        <div className="grid md:grid-cols-2 gap-10 max-w-6xl mx-auto">
          {/* Left Info */}
          <div className="bg-white/10 backdrop-blur-lg p-6 rounded-xl border border-white/10 shadow-lg space-y-6 ">
            {emails.map((em) => (
              <div key={em} className="flex items-center gap-4 hover:translate-x-2 transition-transform">
                <Mail className="w-6 h-6 text-sky-400" />
                <a href={`mailto:${em}`} className="text-lg hover:underline">
                  {em}
                </a>
              </div>
            ))}
            {phones.map((ph) => (
              <div key={ph} className="flex items-center gap-4 hover:translate-x-2 transition-transform">
                <Phone className="w-6 h-6 text-sky-400" />
                <a href={`tel:${ph.replace(/[^+\d]/g, "")}`} className="text-lg hover:underline">
                  {ph}
                </a>
              </div>
            ))}
          </div>

          {/* Right Form */}
          <form
            onSubmit={handleSubmit}
            className="bg-[#71b5f0] backdrop-blur-lg p-6 rounded-xl border border-white/10 shadow-lg space-y-6"
          >
            <div className="grid sm:grid-cols-2 gap-4">
              <input
                type="text"
                name="name"
                placeholder={c.form?.namePlaceholder || "Name"}
                value={form.name}
                onChange={handleChange}
                className="bg-transparent border-b border-gray-800 focus:border-sky-400 outline-none py-2 text-black placeholder-gray-900 transition w-full"
                required
              />
              <input
                type="email"
                name="email"
                placeholder={c.form?.emailPlaceholder || "Email*"}
                value={form.email}
                onChange={handleChange}
                className="bg-transparent border-b border-gray-800 focus:border-sky-400 outline-none py-2 text-black placeholder-gray-900 transition w-full"
                required
              />
            </div>
            <textarea
              name="message"
              placeholder={c.form?.messagePlaceholder || "Message"}
              value={form.message}
              onChange={handleChange}
              className="w-full bg-transparent border-b border-gray-800 focus:border-sky-400 outline-none py-2 text-black placeholder-gray-800 transition resize-none"
              rows="4"
              required
            ></textarea>
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-800 italic">
                {c.form?.disclaimer ||
                  "*We promise not to disclose your personal information to third parties."}
              </p>
              <button
                type="submit"
                className="bg-lime-400  shadow-lg shadow-black/50 hover:brightness-110  text-black font-semibold py-3 px-6 rounded-lg transition cursor-pointer"
              >
                {c.form?.buttonText || "Send Message"}
              </button>
            </div>
            {status && <p className="text-sm mt-2">{status}</p>}
          </form>
        </div>

        {/* Map */}
        {mapSrc && (
          <div
            className="m-12 w-full max-w-6xl mx-auto"
            style={{ height: c.map?.height || 450 }}
          >
            <iframe
              key={mapSrc}
              title={c.map?.title || "Location Map"}
              src={mapSrc}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="rounded-xl shadow-lg"
            />
          </div>
        )}
      </div>
    </section>
  );
}

export default ContactSection;
