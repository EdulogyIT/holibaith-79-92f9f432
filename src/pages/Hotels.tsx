import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import LocationAutocomplete from "@/components/LocationAutocomplete";
import { GuestsSelector } from "@/components/GuestsSelector";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Search, MapPin, ArrowRight, Star, Wifi, Car, Utensils, Dumbbell, Waves, Sparkles, CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

// Import city images
import cityAlger from "@/assets/city-alger.jpg";
import cityOran from "@/assets/city-oran.jpg";
import cityConstantine from "@/assets/city-constantine.jpg";
import cityAnnaba from "@/assets/city-annaba.jpg";

// Placeholder images for accommodation types
const hotelTypeImg = "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop";
const resortTypeImg = "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=400&h=300&fit=crop";
const boutiqueTypeImg = "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=300&fit=crop";
const businessTypeImg = "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=400&h=300&fit=crop";

// Sample hotel images
const hotelImages = [
  "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1496417263034-38ec4f0b665a?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=400&h=300&fit=crop",
];

const Hotels = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  const [location, setLocation] = useState("");
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [guests, setGuests] = useState({
    adults: 1,
    children: 0,
    infants: 0,
    pets: 0,
  });

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (location) params.set("location", location);
    if (dateRange?.from) params.set("checkIn", dateRange.from.toISOString());
    if (dateRange?.to) params.set("checkOut", dateRange.to.toISOString());
    const totalGuests = guests.adults + guests.children;
    if (totalGuests > 0) params.set("guests", totalGuests.toString());
    navigate(`/short-stay?${params.toString()}`);
  };

  const trendingCities = [
    { name: "Algiers", properties: 248, price: 145, image: cityAlger },
    { name: "Oran", properties: 156, price: 132, image: cityOran },
    { name: "Constantine", properties: 89, price: 98, image: cityConstantine },
    { name: "Tlemcen", properties: 64, price: 87, image: "https://images.unsplash.com/photo-1539650116574-8efeb43e2750?w=400&h=500&fit=crop" },
    { name: "Annaba", properties: 73, price: 95, image: cityAnnaba },
    { name: "Tamanrasset", properties: 42, price: 110, image: "https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=400&h=500&fit=crop" },
  ];

  const accommodationTypes = [
    {
      title: t('hotelsType') || "Hotels",
      desc: t('hotelsTypeDesc') || "Professional service, daily housekeeping",
      count: 412,
      image: hotelTypeImg,
    },
    {
      title: t('resortsType') || "Resorts",
      desc: t('resortsTypeDesc') || "All-inclusive luxury experiences",
      count: 28,
      image: resortTypeImg,
    },
    {
      title: t('boutiqueHotelsType') || "Boutique Hotels",
      desc: t('boutiqueHotelsDesc') || "Intimate, design-focused stays",
      count: 89,
      image: boutiqueTypeImg,
    },
    {
      title: t('businessHotelsType') || "Business Hotels",
      desc: t('businessHotelsDesc') || "Corporate amenities and convenience",
      count: 156,
      image: businessTypeImg,
    },
  ];

  const highlightedHotels = [
    {
      name: "Hotel El Aurassi",
      location: "Algiers, Algeria",
      rating: 4.8,
      reviews: 342,
      price: 185,
      stars: 5,
      amenities: ["Pool", "Spa", "Restaurant", "Gym", "WiFi", "Parking"],
      image: hotelImages[0],
    },
    {
      name: "Sheraton Oran",
      location: "Oran, Algeria",
      rating: 4.7,
      reviews: 218,
      price: 165,
      stars: 5,
      amenities: ["Pool", "Spa", "Restaurant", "WiFi", "Parking"],
      image: hotelImages[1],
    },
    {
      name: "Marriott Constantine",
      location: "Constantine, Algeria",
      rating: 4.6,
      reviews: 156,
      price: 142,
      stars: 4,
      amenities: ["Restaurant", "Gym", "WiFi", "Parking"],
      image: hotelImages[2],
    },
  ];

  const getAmenityIcon = (amenity: string) => {
    switch (amenity.toLowerCase()) {
      case "pool": return <Waves className="w-3 h-3" />;
      case "spa": return <Sparkles className="w-3 h-3" />;
      case "restaurant": return <Utensils className="w-3 h-3" />;
      case "gym": return <Dumbbell className="w-3 h-3" />;
      case "wifi": return <Wifi className="w-3 h-3" />;
      case "parking": return <Car className="w-3 h-3" />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Hotels in Algeria | Holibayt"
        description="Find your ideal hotel in Algeria. From luxury resorts to business hotels - compare prices and book direct."
      />
      <Navigation />

      {/* Hero Section */}
      <section className="relative bg-[#2F6B4F] pt-24 pb-16 md:pt-32 md:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 md:mb-12">
            <h1 className="font-playfair italic text-3xl md:text-5xl text-white mb-4">
              {t('findYourIdealHotel') || "Find your ideal hotel in Algeria"}
            </h1>
            <p className="text-white/90 text-lg md:text-xl max-w-2xl mx-auto">
              {t('fromLuxuryResorts') || "From luxury resorts to business hotels - compare prices and book direct"}
            </p>
          </div>

          {/* Search Card */}
          <div className="bg-white rounded-2xl p-4 md:p-6 shadow-xl max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Where */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600">{t('whereTo') || "Where"}</label>
                <LocationAutocomplete
                  value={location}
                  onChange={setLocation}
                  placeholder={t('searchPlaceholder') || "Search destinations"}
                />
              </div>
              
              {/* Check-in */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600">{t('checkInLabel') || "Check-in"}</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal h-12",
                        !dateRange?.from && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateRange?.from ? format(dateRange.from, "MMM d") : t('selectDate') || "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 z-50" align="start">
                    <Calendar
                      mode="range"
                      selected={dateRange}
                      onSelect={setDateRange}
                      numberOfMonths={2}
                      disabled={{ before: new Date() }}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              {/* Check-out */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600">{t('checkOutLabel') || "Check-out"}</label>
                <div className="h-12 flex items-center px-3 border rounded-lg text-muted-foreground text-sm bg-background">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange?.to ? format(dateRange.to, "MMM d") : t('selectDate') || "Select date"}
                </div>
              </div>
              
              {/* Who + Search */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600">{t('who') || "Who"}</label>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <GuestsSelector value={guests} onChange={setGuests} />
                  </div>
                  <Button 
                    onClick={handleSearch}
                    className="bg-[#2F6B4F] hover:bg-[#245840] text-white px-4"
                  >
                    <Search className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trending Destinations */}
      <section className="py-16 md:py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="font-playfair text-3xl md:text-4xl text-foreground mb-3">
              {t('trendingDestinations') || "Trending destinations"}
            </h2>
            <p className="text-muted-foreground text-lg">
              {t('mostPopularChoices') || "Most popular choices for travelers in Algeria"}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {trendingCities.map((city) => (
              <Link 
                key={city.name} 
                to={`/city/${city.name.toLowerCase()}`}
                className="group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="aspect-[4/5]">
                  <img
                    src={city.image}
                    alt={city.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                
                {/* Location Badge */}
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-foreground">
                  Algeria
                </div>
                
                {/* Content Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                  <h3 className="font-playfair text-2xl text-white mb-1">{city.name}</h3>
                  <div className="flex items-center justify-between text-white/90 text-sm">
                    <span>{city.properties} {t('propertiesCount') || "properties"}</span>
                    <span>{t('fromPrice') || "From"} €{city.price.toFixed(2)}/night</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Browse by Accommodation Type */}
      <section className="py-16 md:py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="font-playfair text-3xl md:text-4xl text-foreground mb-3">
              {t('browseByAccommodation') || "Browse by accommodation type"}
            </h2>
            <p className="text-muted-foreground text-lg">
              {t('discoverStaysStyle') || "Discover stays to suit your style"}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {accommodationTypes.map((type) => (
              <div 
                key={type.title}
                className="group bg-card rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={type.image}
                    alt={type.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-5">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-playfair text-xl text-foreground">{type.title}</h3>
                    <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>
                  <p className="text-muted-foreground text-sm mb-3">{type.desc}</p>
                  <span className="text-sm font-medium text-primary">{type.count} {t('propertiesCount') || "properties"}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Highly Rated Hotels */}
      <section className="py-16 md:py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="font-playfair text-3xl md:text-4xl text-foreground mb-2">
                {t('highlyRatedHotels') || "Highly rated hotels"}
              </h2>
              <p className="text-muted-foreground">
                {t('topRatedByGuests') || "Top-rated by guests like you"}
              </p>
            </div>
            <Link 
              to="/short-stay" 
              className="hidden md:flex items-center gap-2 text-primary hover:underline font-medium"
            >
              {t('seeAllHotels') || "See all hotels"} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {highlightedHotels.map((hotel) => (
              <div 
                key={hotel.name}
                className="bg-card rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer group"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={hotel.image}
                    alt={hotel.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Star Badge */}
                  <div className="absolute top-3 left-3 bg-[#2F6B4F] text-white px-3 py-1 rounded-full flex items-center gap-1">
                    {[...Array(hotel.stars)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-current" />
                    ))}
                  </div>
                </div>
                
                <div className="p-5">
                  <h3 className="font-playfair text-xl text-foreground mb-1">{hotel.name}</h3>
                  <div className="flex items-center gap-1 text-muted-foreground text-sm mb-4">
                    <MapPin className="w-4 h-4" />
                    {hotel.location}
                  </div>
                  
                  {/* Amenity Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {hotel.amenities.slice(0, 6).map((amenity) => (
                      <span 
                        key={amenity}
                        className="inline-flex items-center gap-1 bg-muted px-2 py-1 rounded-full text-xs text-muted-foreground"
                      >
                        {getAmenityIcon(amenity)}
                        {amenity}
                      </span>
                    ))}
                  </div>
                  
                  {/* Rating + Price */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-[#2F6B4F] text-white flex items-center justify-center text-sm font-semibold">
                        {hotel.rating}
                      </div>
                      <div>
                        <span className="text-sm font-medium text-foreground">{t('excellent') || "Excellent"}</span>
                        <span className="text-xs text-muted-foreground ml-1">({hotel.reviews} {t('reviews') || "reviews"})</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-semibold text-foreground">€{hotel.price}</span>
                      <span className="text-sm text-muted-foreground">/{t('perNight') || "night"}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile link */}
          <div className="mt-6 text-center md:hidden">
            <Link 
              to="/short-stay" 
              className="inline-flex items-center gap-2 text-primary hover:underline font-medium"
            >
              {t('seeAllHotels') || "See all hotels"} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* List Your Hotel CTA */}
      <section className="bg-[#2F6B4F] py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-playfair text-3xl md:text-4xl text-white mb-4">
            {t('listYourHotel') || "List your hotel on Holibayt"}
          </h2>
          <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
            {t('reachMillions') || "Reach millions of travelers and grow your business"}
          </p>
          <Link to="/publish-property">
            <Button 
              size="lg" 
              className="bg-white text-[#2F6B4F] hover:bg-white/90 font-medium px-8"
            >
              {t('startListing') || "Start listing"}
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Hotels;
