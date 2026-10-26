import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import { useGlobal, mediaUrl } from "../hooks/useCMS";

import AboutImage1 from "../assets/AboutImage1.jpg";
import AboutImage2 from "../assets/AboutImage2.jpg";
import AboutImage3 from "../assets/AboutImage3.jpg";
import AboutImage4 from "../assets/AboutImage4.jpg";
import AboutImage5 from "../assets/AboutImage5.jpg";
import AboutImage6 from "../assets/AboutImage6.jpg";

import { Link } from "react-router-dom";

const DEFAULT_IMAGES = [AboutImage1, AboutImage2, AboutImage3, AboutImage4, AboutImage5, AboutImage6];

const DEFAULT_STATS = [
  { value: 7, label: "Years Experience" },
  { value: 215, label: "Completed Projects" },
  { value: 100, label: "Happy Customers" },
];

function Counter({ target, start }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!start) return;

    setCount(0);
    let current = 0;
    const duration = 2000;
    const increment = target / (duration / 20);

    const interval = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(interval);
      }
      setCount(Math.ceil(current));
    }, 20);

    return () => clearInterval(interval);
  }, [start, target]);

  return <span>{count} +</span>;
}

export default function AboutSection() {
  const { data } = useGlobal("about-page");
  const c = data || {};

  const { ref: statsRowRef, inView: statsInView } = useInView({
    triggerOnce: false,
    threshold: 0.3,
  });

  // Slides: CMS images if present, otherwise the local ones
  const cmsSlides = (c.gallery?.images || [])
    .filter((i) => i?.image)
    .map((i) => ({ src: mediaUrl(i.image), alt: i.alt }));
  const slides = cmsSlides.length
    ? cmsSlides
    : DEFAULT_IMAGES.map((src, i) => ({ src, alt: `AboutImage ${i + 1}` }));
  const multi = slides.length > 1;

  const stats = c.stats?.length ? c.stats : DEFAULT_STATS;

  return (
    <div className="bg-gradient-to-r from-black via-[#0b223f] to-[#06263f] text-white relative overflow-hidden  px-6 ">
      <div className="max-w-6xl mx-auto pb-16">
        {/* Background Glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="w-96 h-96 bg-sky-500 opacity-20 rounded-full blur-3xl absolute -top-10 -left-10"></div>
          <div className="w-96 h-96 bg-blue-900 opacity-20 rounded-full blur-3xl absolute bottom-0 right-0"></div>
        </div>

        {/* Top Section */}
        <section className=" pt-32 pb-10">
          <div className="relative max-w-6xl mx-auto grid md:grid-cols-2 gap-12 z-10">
            <div className="flex flex-col ">
              <h4 className="text-sm uppercase text-sky-400 tracking-widest mb-2">
                {c.story?.eyebrow || "Our Story"}
              </h4>
              <h1 className="text-3xl sm:text-4xl font-bold mb-6 leading-snug">
                {c.story?.heading || "Writing content like you’ve never had before"}
              </h1>
            </div>
            <div className="text-gray-300 leading-relaxed space-y-4">
              <p>
                {c.story?.paragraph1 ||
                  "At GrowthShark, we don't just tell stories; we create experiences. Our journey began with a simple, yet powerful idea: to change the way content is crafted and shared. With creativity as our fuel and innovation as our compass, we set out to break away from traditional storytelling and bring fresh, captivating content to the world. What started as a small team of passionate storytellers has since grown into a powerhouse of creative minds, each dedicated to transforming the ordinary into something extraordinary."}
              </p>
            </div>
          </div>
          <div className="relative max-w-6xl mx-auto grid md:grid-cols-2 gap-12 z-10 py-10">
            <p>
              {c.story?.paragraph2 ||
                "From day one, we've believed that every piece of content has the potential to inspire, inform, and impact. Whether we're working with clients to develop their brand's voice, creating compelling narratives, or delivering cutting-edge digital content, our goal is the same: to leave a lasting impression. Our approach is built on a foundation of authenticity, originality, and meticulous attention to detail. We don't just create content that fills space—we create content that resonates, sparks conversation, and connects with audiences on a deeper level."}
            </p>
            <p>
              {c.story?.paragraph3 ||
                "As we've grown, we've never lost sight of our core values. We continue to challenge the status quo, experimenting with new formats, technologies, and platforms to deliver content that stands out. Every project we take on is an opportunity to push boundaries, explore new ideas, and redefine the limits of creativity. Our journey is far from over, and with each new chapter, we're writing content like you've never had before—content that inspires, engages, and leaves."}
            </p>
          </div>
        </section>

        {/* Image Swiper */}
        <div className="relative max-w-6xl mx-auto z-10">
          <Swiper
            key={slides.length + (c.gallery?.autoplayDelay || 0)}
            spaceBetween={20}
            centeredSlides={true}
            autoplay={
              multi && c.gallery?.autoplay !== false
                ? { delay: c.gallery?.autoplayDelay || 2500, disableOnInteraction: false }
                : false
            }
            loop={multi}
            pagination={multi ? { clickable: true } : false}
            navigation={multi}
            modules={[Autoplay, Pagination, Navigation]}
            className="rounded-lg shadow-lg mb-12"
          >
            {slides.map((s, index) => (
              <SwiperSlide key={index}>
                <img
                  src={s.src}
                  alt={s.alt || `AboutImage ${index + 1}`}
                  className="rounded-lg w-full h-auto object-cover"
                />
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Stats Section */}
          <div
            ref={statsRowRef}
            className="grid grid-cols-1 sm:grid-cols-3 text-center text-sky-400 font-bold text-xl gap-8 mb-12"
          >
            {stats.map((s, i) => (
              <div
                key={i}
                className="bg-black/30 rounded-lg p-6 backdrop-blur-md hover:bg-black/50 transition border border-white/10"
              >
                <p className="text-3xl">
                  <Counter target={Number(s.value) || 0} start={statsInView} />
                </p>
                <p className="text-white text-lg font-medium mt-2">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-sky-400 text-black py-12 mt-16 text-center relative z-10 rounded-2xl mx-auto max-w-6xl">
          <h3 className="text-2xl font-semibold mb-4">
            {c.cta?.heading || "We make the creative solutions for modern brands"}
          </h3>
          <button className="bg-black text-sky-400 px-6 py-2 font-semibold rounded hover:bg-gray-800 transition">
            <Link to={c.cta?.buttonLink || "/contact"}>{c.cta?.buttonText || "Contact Us"}</Link>
          </button>
        </div>
      </div>
    </div>
  );
}
