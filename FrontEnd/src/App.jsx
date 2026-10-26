
import { Helmet, HelmetProvider } from "react-helmet-async";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { useState } from "react";

import ScrollToTop from "./components/ScrollToTop";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Pages
import HomeStealth from "./pages/HomeStealth";
import HomeAttack from "./pages/HomeAttack";
import About from "./pages/AboutUs";
import Contact from "./pages/ContactUs";
import Career from "./pages/Career";
import Portfolio from "./pages/Portfolio";
import BlogList from "./pages/BlogList";
import BlogPost from "./pages/BlogPost";
import CampaignLawFirms from "./pages/CampaignLawFirms";
import CampaignPlumbers from "./pages/CampaignPlumbers";
import CampaignRoofers from "./pages/CampaignRoofers";
import CampaignDental from "./pages/CampaignDental";

// Dynamic Portfolio Case Study Page
import CaseStudy from "./pages/portfolio/CaseStudy";

// Services
import ServicePage from "./pages/services/ServicePage";

// SEO
import PageSEO from "./components/pageSEO";

// Canonical URL management
function CanonicalHelmet() {
  const location = useLocation();
  const pathname = location.pathname;

  // BlogList and BlogPost manage their canonical URLs through SEO.jsx.
  // Avoid generating duplicate canonical tags for these routes.
  const isBlogPage =
    pathname === "/blog" ||
    pathname.startsWith("/blog/");

  if (isBlogPage) {
    return null;
  }

  const baseUrl = (
    import.meta.env.VITE_BASE_URL ||
    window.location.origin
  ).replace(/\/+$/, "");

  const normalizedPath =
    pathname === "/"
      ? "/"
      : pathname.replace(/\/+$/, "");

  const canonicalUrl = `${baseUrl}${normalizedPath}`;

  return (
    <Helmet>
      <link rel="canonical" href={canonicalUrl} />
    </Helmet>
  );
}

function AppContent() {
  const [isStealth, setIsStealth] = useState(false);
  const location = useLocation();

  const isCampaignPage = location.pathname.startsWith("/lawers");

  const toggleMode = () => {
    console.log("Toggling mode, isStealth before:", isStealth);

    setIsStealth((prev) => {
      console.log("isStealth after:", !prev);
      return !prev;
    });
  };

  return (
    <>
      <CanonicalHelmet />

      <ScrollToTop />

      <Navbar
        toggleMode={toggleMode}
        isStealth={isStealth}
      />

      {/* Static page SEO. Individual blog posts manage their own SEO. */}
      <PageSEO />

      <Routes>
        <Route
          path="/"
          element={
            isStealth ? <HomeStealth /> : <HomeAttack />
          }
        />

        <Route path="/attack" element={<HomeAttack />} />
        <Route path="/stealth" element={<HomeStealth />} />

        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/career" element={<Career />} />
        <Route path="/portfolio" element={<Portfolio />} />

        {/* Dynamic Portfolio Case Study */}
        <Route
          path="/portfolio/:slug"
          element={<CaseStudy />}
        />

        {/* Campaign pages */}
        <Route
          path="/lawyer"
          element={<CampaignLawFirms />}
        />

        <Route
          path="/plumber"
          element={<CampaignPlumbers />}
        />

        <Route
          path="/roofer"
          element={<CampaignRoofers />}
        />

        <Route
          path="/dental"
          element={<CampaignDental />}
        />

        {/* Service pages */}
        <Route
          path="/services/:slug"
          element={<ServicePage />}
        />

        {/* Blog pages — CMS only */}
        <Route path="/blog" element={<BlogList />} />

        <Route
          path="/blog/:slug"
          element={<BlogPost />}
        />
      </Routes>

      <Footer />
    </>
  );
}

export default function App() {
  return (
    <HelmetProvider>
      <Router>
        <AppContent />
      </Router>
    </HelmetProvider>
  );
}
