import { FaArrowRight } from 'react-icons/fa';
import { useGlobal } from '../../hooks/useCMS'; // change ../ if this file is in a different folder depth

const DEFAULT_LEFT = [
    'Missed Reminders & Deadlines',
    'Overlapping Schedules & Conflicts',
    'Workflow Disruptions & Confusion',
    'Client Tantrums & Communication Breakdowns',
    'Stress-Induced Burnout & Mental Clutter',
];

const DEFAULT_RIGHT = [
    'Timely Reminders And Delegated Alerts',
    'Optimized Scheduling & Clear Calendars',
    'Seamless Workflow & Structured Processes',
    'Proactive Client Management & Updates',
    'Focused Executives, Stress-Free Teams',
];

const Why = () => {
    const { data } = useGlobal('home');
    const w = data?.stealthWhy;

    const leftItems = w?.leftItems?.length ? w.leftItems.map((i) => i.text) : DEFAULT_LEFT;
    const rightItems = w?.rightItems?.length ? w.rightItems.map((i) => i.text) : DEFAULT_RIGHT;

    return (
        <section className=" text-white px-6 overflow-hidden py-16 ">

            {/* Header */}
            <div className=" max-w-4xl mx-auto text-center mb-8">
                <h1 className="text-3xl sm:text-4xl font-bold">
                    {w?.headingBefore ?? 'Why Do You Need'}{' '}
                    <span className="text-[#2ea9ff]">{w?.headingHighlight ?? 'Stealth Mode'}</span>
                    {w?.headingAfter ?? '?'}
                </h1>
                <p className="text-sm sm:text-base text-gray-300 mt-4">
                    {w?.intro ?? "Because it couldn't have been said better:"}
                </p>
                <p className='text-lg sm:text-xl text-[#2ea9ff] mt-1'>
                    {w?.quote ??
                        "“If you're not delegating, you're drowning. Real executives focus on the catch—not on chasing their tails.”"}
                </p>

                <p className="text-sm sm:text-base text-gray-300 mt-1">
                    {w?.afterQuote ?? 'Businesses trying to manage everything alone experience predictable chaos:'}
                </p>
            </div>

            {/* Comparison Cards */}
            <div className="relative z-10 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                {/* In-House */}
                <div className="shadow-lg backdrop-blur-md bg-[#141f3a]/60 hover:scale-105 transform transition-transform duration-300 rounded-xl border border-white/10 p-6">
                    <h2 className="text-xl sm:text-2xl font-semibold text-gray-200 text-center mb-4">
                        {w?.leftTitle ?? 'Doing It In-House'}
                    </h2>
                    <ul className="space-y-3 text-gray-300 text-sm sm:text-base px-4 sm:px-10">
                        {leftItems.map((text, i) => (
                            <li key={i}>
                                <FaArrowRight className="inline mr-2 text-red-600" />
                                {text}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* GrowthShark */}
                <div className="shadow-lg backdrop-blur-md bg-[#141f3a]/60 hover:scale-105 transform transition-transform duration-300 rounded-xl border border-white/10 p-6">
                    <h2 className="text-xl sm:text-2xl font-semibold text-[#2ea9ff] text-center mb-4">
                        {w?.rightTitle ?? 'With GrowthShark'}
                    </h2>
                    <ul className="space-y-3 text-gray-300 text-sm sm:text-base px-4 sm:px-10">
                        {rightItems.map((text, i) => (
                            <li key={i}>
                                <FaArrowRight className="inline mr-2 text-green-600" />
                                {text}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* CTA Button */}
            <div className="relative z-10 mt-10 sm:mt-12 text-center mb-10">
                <a
                    href={w?.buttonLink || 'https://calendly.com/proriterz101/30min'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block max-w-sm mx-auto
              bg-[#49b9ff] hover:bg-[#3aa8e8] text-black font-semibold 
               p-6  py-4 rounded-full 
               transition-all duration-300 
               text-sm sm:text-sm 
               leading-snug 
               break-words md:whitespace-nowrap"
                >
                    {w?.buttonText ?? 'Get A Free Consultation On How To Be Aggressive'}
                </a>
            </div>

        </section>
    );
};

export default Why; 
