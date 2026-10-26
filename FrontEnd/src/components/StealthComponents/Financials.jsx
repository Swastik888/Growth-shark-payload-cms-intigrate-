import React from 'react';
import StealthFinancial from '../../assets/StealthFinancial.png';
import { useGlobal } from '../../hooks/useCMS'; // Adjust path if your hook is located elsewhere

function Financials() {
  // Fetch global home data directly using your hook
  const { data: homeData } = useGlobal('home');
  const data = homeData?.transparentFinancials;

  const headingBefore = data?.headingBefore || '';
  const headingHighlight = data?.headingHighlight || 'Financials';
  const headingAfter = data?.headingAfter || '';
  const description = data?.description || 'We would love to sit on a call and discuss possibilities for your growth via our Attack Mode, but we will be upfront: our typical costs range between $500 to $1500, beyond which we believe it’s too much for you to spend on us, and below that is too little for us to stay ‘motivated’.';

  return (
    <section className="text-white px-6 py-12 overflow-hidden max-w-6xl mx-auto">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-4">
          {headingBefore} <span className="text-[#44c8ff]">{headingHighlight}</span> {headingAfter}
        </h2>

        <img
          src={StealthFinancial}
          alt="Financial"
          className="w-full max-w-xs sm:max-w-md md:max-w-xl mx-auto mb-2"
        />

        <p className="text-xs sm:text-sm md:text-base text-gray-300 leading-relaxed px-1 sm:px-4">
          {description}
        </p>
      </div>
    </section>
  );
}

export default Financials;
