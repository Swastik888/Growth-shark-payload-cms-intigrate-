import { useState } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, FreeMode } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/autoplay';
import 'swiper/css/free-mode';
import { useGlobal, mediaUrl } from '../../hooks/useCMS';
import img4 from '..//../assets/4.png';
import img5 from '..//../assets/5.png';
import img6 from '..//../assets/6.png';

import tempcon from '..//../assets/tempcon.png';
import Solinas from '..//../assets/Solinas.png';
import sofyrus from '..//../assets/sofyrus.png';
import Sidepath from '..//../assets/Sidepath.png';
import Scoop from '..//../assets/Scoop.png';
import S_IB from '..//../assets/S_IB.png';
import roshni_sanghvi from '..//../assets/roshni_sanghvi.png';
import Rise_hydroponics from '..//../assets/Rise_hydroponics.png';
import rentpost from '..//../assets/rentpost.png';
import quodeck from '..//../assets/quodeck.png';

// ---------- fallbacks (used while the CMS is empty or unreachable) ----------
const DEFAULT_LOGOS = [
  tempcon, Solinas, sofyrus, Sidepath, Scoop,
  S_IB, roshni_sanghvi, Rise_hydroponics, rentpost, quodeck,
];

const DEFAULT_SERVICES = [
  'Email Gatekeeping',
  'Calendar Coordination',
  'Call Gatekeeping',
  'Market Research',
  'Client Intelligence',
  'Social Media Management',
  'Manual Outreach',
  'Document Preparation',
  'Task Delegation',
];

const DEFAULT_REVENUE = ['Less than $5,000', '$5,000-$10,000', 'More than $10,000'];

const DEFAULT_CARDS = [
  {
    image: img4,
    title: 'Strategic Insights',
    description: 'Explore data-driven perspectives to navigate competitive landscapes effectively.',
  },
  {
    image: img5,
    title: 'Innovative Strategies',
    description: 'Unlock unconventional methods to achieve high-growth outcomes.',
  },
  {
    image: img6,
    title: 'Personalized Tactics',
    description: 'Customize your execution playbook based on industry and user behavior.',
  },
];

const AboutSection = () => {
  // ---------- CMS data ----------
  const { data } = useGlobal('home');
  const form = data?.stealthPartnerForm;
  const logosCms = data?.stealthLogos;
  const formula = data?.stealthFormula;

  const serviceOptions = form?.serviceOptions?.length
    ? form.serviceOptions.map((o) => o.label)
    : DEFAULT_SERVICES;

  const revenueOptions = form?.revenueOptions?.length
    ? form.revenueOptions.map((o) => o.label)
    : DEFAULT_REVENUE;

  const cmsLogos = (logosCms?.logos || [])
    .map((l) => ({ src: mediaUrl(l.image), name: l.name }))
    .filter((l) => l.src);


  const logoList = cmsLogos.length
    ? cmsLogos
    : DEFAULT_LOGOS.map((src) => ({ src, name: '' }));

  // Only scroll when there are enough logos; otherwise show them in a static row
  const canScroll = logoList.length >= 4;
  const repeatCount = Math.max(1, Math.ceil(12 / logoList.length));
  const slides = Array.from({ length: repeatCount }, () => logoList).flat();

  const cards = formula?.cards?.length
    ? formula.cards.map((c, i) => ({
      image: mediaUrl(c.image) ?? DEFAULT_CARDS[i]?.image,
      title: c.title,
      description: c.description,
    }))
    : DEFAULT_CARDS;

  // ---------- form connected to backend ----------
  // service / revenue stay empty until the user changes them, then the first option is used
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contact: "",
    website: "",
    service: "",
    requirement: "",
    revenue: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const payload = {
      ...formData,
      service: formData.service || serviceOptions[0],
      revenue: formData.revenue || revenueOptions[0],
    };

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/aboutus`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (res.ok) {
        setMessage("Form submitted successfully!");
        setFormData({
          name: "",
          email: "",
          contact: "",
          website: "",
          service: "",
          requirement: "",
          revenue: "",
        });
      } else {
        setMessage(`${result.message}`);
      }
    } catch (error) {
      setMessage("Failed to submit. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="text-white px-6 py-6 overflow-hidden">
      {/* Header + Form */}
      <div className="max-w-6xl mx-auto flex gap-8 relative z-10 flex-col lg:flex-row">
        <div className="lg:w-1/2 space-y-4 text-center lg:text-left">
          <h1 className="text-4xl font-bold mb-4">
            {form?.headingBefore ?? 'Before You Hunt, Get In'}{' '}
            <span className="text-[#74c0f4]">{form?.headingHighlight ?? 'Stealth Mode'}</span>
            {form?.headingAfter ? ` ${form.headingAfter}` : ''}
          </h1>
          <p className="text-gray-300">
            {form?.description ??
              'Successful companies never hunt blind— they organize, strategize, and delegate with precision. Our Executive Assistants streamline your operations behind-the-scenes, prepping you for the perfect strike.'}
          </p>
        </div>
        <div className="lg:w-1/2">
          <div className="backdrop-blur-md bg-[#71b5f0]  transition-transform duration-300 border border-white/10 p-6 bg-opacity-80 rounded-xl  shadow-lg text-black ">
            <form className='space-y-6 ' onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                  className="p-3 rounded bg-gray-800 text-white placeholder-gray-400" />
                <input
                  type="email"
                  name="email"
                  placeholder="Work Email"
                  value={formData.email}
                  onChange={handleChange}
                  className="p-3 rounded bg-gray-800 text-white placeholder-gray-400" />
                <input
                  type="text"
                  name="contact"
                  placeholder="Contact No"
                  value={formData.contact}
                  onChange={handleChange}
                  className="p-3 rounded bg-gray-800 text-white placeholder-gray-400" />
                <input
                  type="text"
                  name="website"
                  placeholder="Website URL"
                  value={formData.website}
                  onChange={handleChange}
                  className="p-3 rounded bg-gray-800 text-white placeholder-gray-400" />
              </div>

              <div>
                <label className="block mb-1 text-sm text-black">Service you're interested in:</label>
                <select
                  name="service"
                  value={formData.service || serviceOptions[0]}
                  onChange={handleChange}
                  className="w-full p-3 rounded bg-gray-800 text-white">
                  {serviceOptions.map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
              </div>

              <textarea
                name="requirement"
                rows="4"
                value={formData.requirement}
                onChange={handleChange}
                className="w-full p-3 rounded bg-gray-800 text-white placeholder-gray-400"
                placeholder="Briefly discuss your requirement">
              </textarea>

              <div>
                <label className="block mb-1 text-sm text-black">
                  What's your monthly recurring revenue?
                </label>
                <select
                  name="revenue"
                  value={formData.revenue || revenueOptions[0]}
                  onChange={handleChange}
                  className="w-full p-3 rounded bg-gray-800 text-white">
                  {revenueOptions.map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-center">
                <button
                  type="submit"
                  disabled={loading}
                  className="py-2 px-6 bg-lime-400   text-black font-semibold rounded-full duration-300 cursor-pointer shadow-lg shadow-black/50 hover:brightness-110 transition">
                  {loading ? "Submitting..." : (form?.submitText ?? "Submit")}
                </button>
              </div>

              {message && (
                <p className="text-center text-sm mt-4">{message}</p>
              )}
            </form>
          </div>
        </div>
      </div>

      {/* Auto Slider for Logos */}
      <div className="mt-30 relative z-10">
        <h2 className="text-4xl font-bold mb-6 text-center text-[#2ea9ff]">
          {logosCms?.heading ?? 'Those Who Hunted With Us'}
        </h2>

        {/* Side Blur */}
        <div className="hidden lg:block pointer-events-none absolute top-0 left-0 h-full w-34  bg-gradient-to-r from-[#0b223f] to-transparent z-20 "></div>
        <div className="hidden lg:block pointer-events-none absolute top-0 right-0 h-full w-34 bg-gradient-to-l from-[#0b223f] to-transparent z-20 "></div>

        {canScroll ? (
          <Swiper
            key={logoList.length}
            slidesPerView="auto"
            spaceBetween={60}
            loop={true}
            centeredSlides={false}
            speed={1000}
            allowTouchMove={false}
            freeMode={{ enabled: false }}
            autoplay={{
              delay: 0,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            modules={[Autoplay]}
            className="swiper-logos"
          >
            {slides.map((logo, i) => (
              <SwiperSlide
                key={i}
                className="!w-auto px-4 py-8 transition-all duration-500"
              >
                <div className="group relative">
                  <img
                    src={logo.src}
                    alt={logo.name || `Partner logo ${i + 1}`}
                    className="
                h-14 w-auto mx-auto
                opacity-50 grayscale 
                transition-all duration-700 ease-out
                group-hover:opacity-100 group-hover:grayscale-0 
                group-hover:scale-125
                group-hover:-translate-y-4
                drop-shadow-lg
                filter hover:drop-shadow-2xl
              "
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <div className="flex flex-wrap items-center justify-center gap-12 py-8">
            {logoList.map((logo, i) => (
              <div key={i} className="group relative">
                <img
                  src={logo.src}
                  alt={logo.name || `Partner logo ${i + 1}`}
                  className="h-14 w-auto mx-auto opacity-50 grayscale transition-all duration-700 ease-out group-hover:opacity-100 group-hover:grayscale-0 group-hover:scale-125 drop-shadow-lg"
                />
              </div>
            ))}
          </div>
        )}

        <style>{`
    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-12px); }
    }
    .group:hover img {
      animation: float 1.0s ease-in-out infinite;
    }
  `}</style>
      </div>

      {/* Cards Section Heading */}
      <div className="text-center max-w-6xl mx-auto mt-20 mb-20 ">
        <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
          {formula?.headingBefore ?? 'The'}{' '}
          <span className="text-[#49b9ff]">{formula?.headingHighlight ?? 'Stealth Formula'}</span>{' '}
          {formula?.headingAfter ?? 'Of Ours, Is Based On'}
        </h2>
      </div>

      {/* Cards Grid */}
      <div className="relative  flex flex-col lg:flex-row items-center justify-between gap-10 max-w-6xl mx-auto mb-10">
        {cards.map((card, i) => (
          <div
            key={i}
            className="w-full max-w-xs h-[350px] rounded-2xl shadow-lg bg-cover bg-center flex items-end p-6"
            style={{ backgroundImage: card.image ? `url("${card.image}")` : undefined }}
          >
            <div className="w-full bg-white/20 backdrop-blur-md p-5 rounded-xl border border-white/30">
              <h3 className="text-xl font-semibold text-[#2ea9ff] mb-2">{card.title}</h3>
              <p className="text-sm font-medium text-black">{card.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AboutSection;
