import sharkImage from '../../assets/shark.png';
import { useGlobal } from '../../hooks/useCMS';

const CMS_URL = import.meta.env.VITE_CMS_URL;

export default function Hero() {
    const { data } = useGlobal('home');
    const hero = data?.attackHero;

    const bgImage = hero?.backgroundImage?.url
        ? `${CMS_URL}${hero.backgroundImage.url}`
        : sharkImage;

    return (
        <section
            className="w-full min-h-screen bg-black bg-cover bg-center flex items-center text-white"
            style={{ backgroundImage: `url(${bgImage})` }}
        >
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 lg:px-16">
                <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight">
                        {hero?.titleWhite ?? 'Dominate The'} <br />
                        <span className="text-[#2ea9ff]">
                            {hero?.titleHighlight ?? 'Blue Ocean'}
                        </span>
                    </h1>
                    <p className="text-lg sm:text-xl text-gray-300 mt-4">
                        {hero?.subtitle ?? 'Get ready to hunt down your competitors'}
                    </p>
                    <a
                        href={hero?.buttonLink || 'https://calendly.com/proriterz101/30min'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 sm:mt-6 px-6 py-3 bg-[#49b9ff] hover:bg-[#3aa8e8] text-black font-semibold rounded-full shadow-lg transition text-sm sm:text-base lg:text-lg cursor-pointer"
                    >
                        {hero?.buttonText ?? 'CHECK YOUR ELIGIBILITY'}
                    </a>
                </div>
            </div>
        </section>
    );
}