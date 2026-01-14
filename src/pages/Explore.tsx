import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import AIChatBox from "@/components/AIChatBox";
import { AppInstallBanner } from "@/components/AppInstallBanner";
import { Building2, Home, MapPin, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

// City data for hotels
const hotelCities = [
  { key: "algiers", hotels: 84, descKey: "algiersHotelDesc", regionKey: "algiersRegion", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=800&fit=crop" },
  { key: "oran", hotels: 62, descKey: "oranHotelDesc", regionKey: "oranRegion", image: "https://images.unsplash.com/photo-1539650116574-8efeb43e2750?w=600&h=800&fit=crop" },
  { key: "constantine", hotels: 38, descKey: "constantineHotelDesc", regionKey: "constantineRegion", image: "https://images.unsplash.com/photo-1581373449483-37449f962b6c?w=600&h=800&fit=crop" },
  { key: "tlemcen", hotels: 29, descKey: "tlemcenHotelDesc", regionKey: "tlemcenRegion", image: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=600&h=800&fit=crop" },
  { key: "annaba", hotels: 24, descKey: "annabaHotelDesc", regionKey: "annabaRegion", image: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=600&h=800&fit=crop" },
  { key: "tamanrasset", hotels: 11, descKey: "tamanrassetHotelDesc", regionKey: "tamanrassetRegion", image: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=600&h=800&fit=crop" },
];

// City data for short stays
const shortStayCities = [
  { key: "algiers", properties: 164, descKey: "algiersShortStayDesc", regionKey: "algiersRegion", image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&h=800&fit=crop" },
  { key: "oran", properties: 94, descKey: "oranShortStayDesc", regionKey: "oranRegion", image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&h=800&fit=crop" },
  { key: "constantine", properties: 51, descKey: "constantineShortStayDesc", regionKey: "constantineRegion", image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&h=800&fit=crop" },
  { key: "tipaza", properties: 47, descKey: "tipazaShortStayDesc", regionKey: "tipazaRegion", image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&h=800&fit=crop" },
  { key: "bejaia", properties: 33, descKey: "bejaiaShortStayDesc", regionKey: "bejaiaRegion", image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&h=800&fit=crop" },
  { key: "ghardaia", properties: 18, descKey: "ghardaiaShortStayDesc", regionKey: "ghardaiaRegion", image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600&h=800&fit=crop" },
];

const Explore = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  useScrollToTop();

  return (
    <div className="min-h-screen bg-background">
      <AppInstallBanner />
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="font-playfair italic text-4xl md:text-5xl lg:text-6xl text-foreground mb-4">
            {t("exploreAlgeria")}
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto mb-8">
            {t("discoverExceptionalHotels")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => navigate("/hotels")}
              className="bg-[#2F6B4F] hover:bg-[#245a40] text-white px-8 py-6 text-lg rounded-full"
            >
              <Building2 className="w-5 h-5 mr-2" />
              {t("browseHotels")}
            </Button>
            <Button
              onClick={() => navigate("/short-stay")}
              variant="outline"
              className="border-foreground text-foreground px-8 py-6 text-lg rounded-full hover:bg-muted"
            >
              <Home className="w-5 h-5 mr-2" />
              {t("browseShortStays")}
            </Button>
          </div>
        </div>
      </section>

      {/* Hotels by City Section */}
      <section className="py-12 px-4 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Building2 className="w-5 h-5 text-[#2F6B4F]" />
                <span className="text-sm font-semibold uppercase tracking-wider text-[#2F6B4F]">
                  {t("hotels")}
                </span>
              </div>
              <h2 className="font-playfair text-3xl md:text-4xl text-foreground mb-2">
                {t("hotelsByCity")}
              </h2>
              <p className="text-muted-foreground">
                {t("professionalServiceAmenities")}
              </p>
            </div>
            <button
              onClick={() => navigate("/hotels")}
              className="text-[#2F6B4F] font-medium flex items-center gap-1 hover:underline mt-4 md:mt-0"
            >
              {t("viewAllHotels")} <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Hotel City Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hotelCities.map((city) => (
              <div
                key={city.key}
                onClick={() => navigate(`/hotels?city=${city.key}`)}
                className="relative rounded-2xl overflow-hidden cursor-pointer group aspect-[4/5] shadow-lg"
              >
                <img
                  src={city.image}
                  alt={t(city.key)}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                
                {/* Hotel count badge */}
                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm font-medium text-foreground">
                  {city.hotels} {t("hotels").toLowerCase()}
                </div>
                
                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <div className="flex items-center gap-1 text-white/80 text-sm mb-1">
                    <MapPin className="w-4 h-4" />
                    {t(city.regionKey)}
                  </div>
                  <h3 className="font-playfair text-2xl mb-1 capitalize">{t(city.key)}</h3>
                  <p className="text-white/90 text-sm">{t(city.descKey)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Short Stays by City Section */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Home className="w-5 h-5 text-[#D4A574]" />
                <span className="text-sm font-semibold uppercase tracking-wider text-[#D4A574]">
                  {t("shortStay")}
                </span>
              </div>
              <h2 className="font-playfair text-3xl md:text-4xl text-foreground mb-2">
                {t("shortStaysByCity")}
              </h2>
              <p className="text-muted-foreground">
                {t("authenticHomesCharacter")}
              </p>
            </div>
            <button
              onClick={() => navigate("/short-stay")}
              className="text-[#D4A574] font-medium flex items-center gap-1 hover:underline mt-4 md:mt-0"
            >
              {t("viewAllShortStays")} <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Short Stay City Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {shortStayCities.map((city) => (
              <div
                key={city.key}
                onClick={() => navigate(`/short-stay?city=${city.key}`)}
                className="relative rounded-2xl overflow-hidden cursor-pointer group aspect-[4/5] shadow-lg"
              >
                <img
                  src={city.image}
                  alt={t(city.key)}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                
                {/* Property count badge */}
                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm font-medium text-foreground">
                  {city.properties} {t("propertiesCount")}
                </div>
                
                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <div className="flex items-center gap-1 text-white/80 text-sm mb-1">
                    <MapPin className="w-4 h-4" />
                    {t(city.regionKey)}
                  </div>
                  <h3 className="font-playfair text-2xl mb-1 capitalize">{t(city.key)}</h3>
                  <p className="text-white/90 text-sm">{t(city.descKey)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Share Your Space CTA */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="relative rounded-3xl overflow-hidden bg-[#2F6B4F]">
            {/* Background image overlay */}
            <div 
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: "url('https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&h=600&fit=crop')",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
            
            <div className="relative z-10 p-8 md:p-12 lg:p-16">
              <div className="max-w-2xl">
                <h2 className="font-playfair italic text-3xl md:text-4xl lg:text-5xl text-white mb-4">
                  {t("shareYourSpace")}
                </h2>
                <p className="text-white/90 text-lg mb-8 leading-relaxed">
                  {t("joinThousandsHosts")}
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    onClick={() => navigate("/host/onboarding")}
                    className="bg-white text-foreground hover:bg-white/90 px-8 py-6 text-lg rounded-full"
                  >
                    {t("listYourPropertyBtn")} <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                  <Button
                    onClick={() => navigate("/about")}
                    variant="outline"
                    className="border-white text-white hover:bg-white/10 px-8 py-6 text-lg rounded-full"
                  >
                    {t("learnMore")}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <AIChatBox />
    </div>
  );
};

export default Explore;
