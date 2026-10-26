import { useState } from "react";
import { useGlobal } from "../../hooks/useCMS"; // Adjust path if needed

function ReadyForHunt() {
  const [company, setCompany] = useState("");
  const { data: homeData } = useGlobal('home');
  const ready = homeData?.stealthReady;

  // CMS Fallbacks matching your exact design intent
  const headingBefore = ready?.headingBefore || "Ready For The";
  const headingHighlight = ready?.headingHighlight || "DELEGATION?";
  const headingAfter = ready?.headingAfter || "";
  const quoteText = ready?.quote || "“Delegation isn’t just about getting help. It’s about multiplying your effectiveness, protecting your focus, and scaling your vision.”";
  const placeholderText = ready?.placeholder || "Type your company name";
  const buttonText = ready?.buttonText || "Book Your Discovery Session →";

  return (
    <section className="text-white px-6 py-16 overflow-hidden max-w-6xl mx-auto">
      <div className="max-w-4xl mx-auto text-center">
        {/* Heading */}
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
          {headingBefore} <br />
          <span className="text-[#66ccff] text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold block mt-2 leading-snug">
            {headingHighlight}
          </span>
          {headingAfter}
        </h2>

        {/* Quote */}
        <p className="text-sky-300 text-sm sm:text-base md:text-lg leading-relaxed mt-4 mb-6">
          {quoteText}
        </p>

        {/* Sentence with Styled Input */}
        <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-8">
          So, if you’ve made it this far, welcome to the ‘pack’, let’s strategize on how <br className="hidden sm:block" />
          <span className="text-sky-300 font-semibold">Growthshark X </span>
          <input
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder={placeholderText}
            className="bg-transparent border-b border-gray-500 outline-none px-1 w-40 sm:w-52 md:w-60 text-sky-300 font-semibold text-center placeholder-gray-400 mt-2"
          />{" "}
          <br className="hidden sm:block" />
          can together make some differences, shall we?
        </p>

        {/* CTA Button */}
        <a
          href="https://calendly.com/proriterz101/30min"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-lime-400 hover:bg-lime-300 text-black font-semibold px-8 py-3 rounded-full shadow-md text-sm sm:text-base transition duration-300"
        >
          {buttonText}
        </a>
      </div>
    </section>
  );
}

export default ReadyForHunt;