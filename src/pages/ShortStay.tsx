// src/pages/ShortStay.tsx
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ShortStayHeroSearch from "@/components/ShortStayHeroSearch";
import { AppInstallBanner } from "@/components/AppInstallBanner";
import { useState, useEffect } from "react";
import AIChatBox from "@/components/AIChatBox";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import { useNavigate, useLocation } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import LoginModal from "@/components/LoginModal";
import { setAuthModalCallback } from "@/hooks/useWishlist";
import CityPropertiesSection from "@/components/CityPropertiesSection";
import BrowseByTypeSection from "@/components/BrowseByTypeSection";
import ReadyToHostCTA from "@/components/ReadyToHostCTA";

const ShortStay = () => {
  const navigate = useNavigate();
  const routerLocation = useLocation();
  const { t } = useLanguage();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  useScrollToTop();

  useEffect(() => { 
    setAuthModalCallback(() => setIsLoginModalOpen(true));
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <AppInstallBanner />
      <Navigation />
      <main className="pt-[120px] md:pt-20">
        <ShortStayHeroSearch 
          onSearch={(vals) => {
            const qs = new URLSearchParams();
            if (vals.location) qs.set("location", String(vals.location));
            if (vals.checkIn) qs.set("checkIn", String(vals.checkIn));
            if (vals.checkOut) qs.set("checkOut", String(vals.checkOut));
            if (vals.adults) qs.set("adults", String(vals.adults));
            if (vals.children) qs.set("children", String(vals.children));
            if (vals.infants) qs.set("infants", String(vals.infants));
            if (vals.pets) qs.set("pets", String(vals.pets));
            navigate({ pathname: "/short-stay", search: qs.toString() });
          }}
          onFilterClick={() => setIsFilterModalOpen(true)}
        />

        {/* City Sections */}
        <CityPropertiesSection 
          city="Algiers" 
          descriptionKey="algiersDescription" 
        />
        <CityPropertiesSection 
          city="Oran" 
          descriptionKey="oranDescription" 
        />
        <CityPropertiesSection 
          city="Constantine" 
          descriptionKey="constantineDescription" 
        />

        {/* Browse by Type */}
        <BrowseByTypeSection />

        {/* Ready to Host CTA */}
        <ReadyToHostCTA />

        <AIChatBox />
      </main>
      <Footer />
      <LoginModal open={isLoginModalOpen} onOpenChange={setIsLoginModalOpen} />
    </div>
  );
};

export default ShortStay;
