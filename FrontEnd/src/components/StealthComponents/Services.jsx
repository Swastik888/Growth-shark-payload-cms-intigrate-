import React from 'react';
import { SlEnvolopeLetter } from "react-icons/sl";
import { FaRegCalendarAlt, FaInstagram, FaTasks } from "react-icons/fa";
import { MdOutlineWifiCalling3, MdOutlinePeopleAlt, MdCampaign } from "react-icons/md";
import { IoIosSearch } from "react-icons/io";
import { IoDocumentTextOutline } from "react-icons/io5";
import { useGlobal } from '../../hooks/useCMS';

// Map icon names from CMS or index to actual icon components
const iconMap = {
  envelope: <SlEnvolopeLetter size={32} className="text-cyan-400" />,
  calendar: <FaRegCalendarAlt size={32} className="text-cyan-400" />,
  call: <MdOutlineWifiCalling3 size={32} className="text-cyan-400" />,
  search: <IoIosSearch size={32} className="text-cyan-400" />,
  people: <MdOutlinePeopleAlt size={32} className="text-cyan-400" />,
  instagram: <FaInstagram size={32} className="text-cyan-400" />,
  campaign: <MdCampaign size={32} className="text-cyan-400" />,
  document: <IoDocumentTextOutline size={32} className="text-cyan-400" />,
  tasks: <FaTasks size={32} className="text-cyan-400" />,
};

function Services() {
  const { data: homeData } = useGlobal('home');
  const data = homeData?.perfectPartnerGrid;

  const headingBefore = data?.headingBefore || 'How Can We Be Your Perfect';
  const headingHighlight = data?.headingHighlight || 'Delegation';
  const headingAfter = data?.headingAfter || 'Partner?';

  // Fallback default cards matching your exact static content if CMS is empty
  const defaultCards = [
    { title: "Email \n Gatekeeping", description: "Your inbox stays pristine; only essential messages reach you.", iconKey: "envelope" },
    { title: "Calendar \n Coordination", description: "Perfectly planned meetings without conflicts or confusion.", iconKey: "calendar" },
    { title: "Call \n Gatekeeping", description: "Only valuable calls make it through, protecting your productivity.", iconKey: "call" },
    { title: "Market \n Research", description: "Concise, insightful reports on competitors, industry trends, and market opportunities.", iconKey: "search" },
    { title: "Client \n Intelligence", description: "Detailed background briefings, enabling confident client interactions.", iconKey: "people" },
    { title: "Social Media \n Management", description: "Consistent, high-quality content to enhance brand visibility.", iconKey: "instagram" },
    { title: "Manual \n Outreach", description: "Personalized, human-like communication to build genuine relationships.", iconKey: "campaign" },
    { title: "Document \n Preparation", description: "Professionally prepared presentations, reports, and meeting summaries.", iconKey: "document" },
    { title: "Task \n Delegation", description: "Clearly assigned tasks with tracked progress and transparent reporting.", iconKey: "tasks" },
  ];

  const cards = data?.cards?.length ? data.cards : defaultCards;

  return (
    <>
      <div className="py-16 px-6 relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-white text-4xl sm:text-5xl font-bold leading-tight mb-6">
              {headingBefore}<br className="hidden sm:block" />
              {' '}<span className="text-[#49b9ff]">{headingHighlight}</span>{' '}
              {headingAfter}
            </h2>
            <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
              Your Growthshark team handles essential marketing strategies & execution, <br />
              and gives you a bloody edge at your competitors, while focusing more on inbound than vague niches.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4 lg:gap-9 max-w-7xl mx-auto">
            {cards.map((card, index) => {
              // Fallback icon assignment based on index if icon keys aren't explicitly configured in CMS
              const fallbackKeys = ["envelope", "calendar", "call", "search", "people", "instagram", "campaign", "document", "tasks"];
              const currentIconKey = card.iconKey || fallbackKeys[index % fallbackKeys.length];

              return (
                <div
                  key={index}
                  className="w-90 text-center backdrop-blur-md bg-[#141f3a]/60 border border-white/10 bg-opacity-80 text-white p-6 rounded-xl shadow-md hover:shadow-cyan-500/20 transition duration-300"
                >
                  <div className="flex justify-center mb-3">
                    {iconMap[currentIconKey] || <SlEnvolopeLetter size={32} className="text-cyan-400" />}
                  </div>
                  <h4 className="text-[#a6ff00] text-lg font-semibold mb-2 whitespace-pre-line">
                    {card.title}
                  </h4>
                  <p className="text-gray-300 text-sm whitespace-pre-line">
                    {card.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}

export default Services;
