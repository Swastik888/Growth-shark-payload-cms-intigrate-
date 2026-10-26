import SEO from "../components/SEO";
import { useGlobal } from "../hooks/useCMS";
import Hero from "../components/AttackComponents/Hero";
import AboutSection from "../components/AttackComponents/AboutSection";
import Why from "../components/AttackComponents/Why";
import PartnerForm from "../components/AttackComponents/PartnerForm";
import Services from "../components/AttackComponents/Services";
import Financials from '../components/AttackComponents/Financials';
import ReadyForHunt from '../components/AttackComponents/ReadyForHunt';
import Testimonials from '../components/AttackComponents/Testimonials'

export default function HomeAttack() {
    const { data } = useGlobal('home');

    return (
        <div className="bg-black text-white">
            <SEO
                meta={data?.attackMeta}
                fallback={{
                    title: "Grow Your Business Online with a Leading Marketing Agency | Growthshark",
                    description: "Looking to grow your business online? GrowthShark provides expert marketing services that boost engagement, generate leads, and increase sales. Get your free consultation today!",
                }}
            />

            <Hero />
            <AboutSection />
            <Why />
            <PartnerForm />
            <Services />
            <Financials />
            <ReadyForHunt />
            <Testimonials />

        </div>
    );
}