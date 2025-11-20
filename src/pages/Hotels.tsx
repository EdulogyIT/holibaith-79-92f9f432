// src/pages/Hotels.tsx
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { AppInstallBanner } from "@/components/AppInstallBanner";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Star, Wifi, Car, Coffee, Dumbbell, Loader2, X } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { PropertyFilters } from "@/components/PropertyFilters";
import { useState, useEffect } from "react";
import AIChatBox from "@/components/AIChatBox";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import { supabase } from "@/integrations/supabase/client";
import { MapboxPropertyMap } from "@/components/MapboxPropertyMap";
import CitiesSection from "@/components/CitiesSection";
import { HostAdsCarousel } from "@/components/HostAdsCarousel";
import { useAuth } from "@/contexts/AuthContext";
import { useWishlist, setAuthModalCallback } from "@/hooks/useWishlist";
import { WishlistButton } from "@/components/WishlistButton";
import LoginModal from "@/components/LoginModal";
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import React from "react";

interface Property {
  id: string;
  title: string;
  location: string;
  city: string;
  price: string | number;
  price_per_night?: number;
  price_type: "daily" | "weekly" | "monthly";
  price_currency?: string;
  bedrooms?: string | number;
  bathrooms?: string | number;
  area: string | number;
  images: string[] | null;
  property_type: string;
  is_verified?: boolean;
  latitude?: number;
  longitude?: number;
  features?: any;
}

const num = (v: unknown) => {
  if (typeof v === "number") return v;
  const n = parseInt(String(v ?? "").replace(/[^\d]/g, ""), 10);
  return Number.isFinite(n) ? n : 0;
};

class LocalErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: any) { super(props); this.state = { hasError: false }; }
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(err: any) { console.error("Hotels ErrorBoundary caught:", err); }
  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? (
        <div className="rounded-xl border p-6 text-sm text-muted-foreground">
          Component failed to load.
        </div>
      );
    }
    return this.props.children as any;
  }
}

const Hotels = () => {
  const navigate = useNavigate();
  const routerLocation = useLocation();
  const { t } = useLanguage();
  const { formatPrice } = useCurrency();
  const { user } = useAuth();
  const { wishlistIds, toggleWishlist } = useWishlist(user?.id);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasActiveFilters, setHasActiveFilters] = useState(false);
  const [hoveredPropertyId, setHoveredPropertyId] = useState<string | null>(null);

  useScrollToTop();

  useEffect(() => { 
    fetchProperties();
    setAuthModalCallback(() => setIsLoginModalOpen(true));
  }, []);
  
  useEffect(() => { applyFiltersFromURL(); }, [properties, routerLocation.search]);

  const fetchProperties = async () => {
    try {
      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .eq("category", "short_stay")
        .eq("status", "active")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setProperties((data as Property[]) || []);
      setFilteredProperties((data as Property[]) || []);
    } catch (error) {
      console.error("Error fetching hotels:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const applyFiltersFromURL = () => {
    const searchParams = new URLSearchParams(routerLocation.search);
    const location = searchParams.get("location");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const propertyType = searchParams.get("propertyType");
    const bedrooms = searchParams.get("bedrooms");

    let filtered = [...properties];
    let filtersActive = false;

    if (location) {
      filtered = filtered.filter((p) =>
        p.location.toLowerCase().includes(location.toLowerCase()) ||
        p.city.toLowerCase().includes(location.toLowerCase())
      );
      filtersActive = true;
    }

    if (minPrice) {
      filtered = filtered.filter((p) => num(p.price) >= Number(minPrice));
      filtersActive = true;
    }

    if (maxPrice) {
      filtered = filtered.filter((p) => num(p.price) <= Number(maxPrice));
      filtersActive = true;
    }

    if (propertyType && propertyType !== "all") {
      filtered = filtered.filter((p) => p.property_type === propertyType);
      filtersActive = true;
    }

    if (bedrooms) {
      filtered = filtered.filter((p) => num(p.bedrooms) >= Number(bedrooms));
      filtersActive = true;
    }

    setFilteredProperties(filtered);
    setHasActiveFilters(filtersActive);
  };

  const handleSearch = (filters: { location?: string }) => {
    const params = new URLSearchParams();
    if (filters.location) params.set("location", filters.location);
    navigate(`/hotels?${params.toString()}`);
  };

  const handleFilterClick = () => setIsFilterModalOpen(true);

  const handleFilterApply = (filters: any) => {
    const params = new URLSearchParams();
    if (filters.location) params.set("location", filters.location);
    if (filters.minPrice) params.set("minPrice", filters.minPrice);
    if (filters.maxPrice) params.set("maxPrice", filters.maxPrice);
    if (filters.propertyType && filters.propertyType !== "all") params.set("propertyType", filters.propertyType);
    if (filters.bedrooms) params.set("bedrooms", filters.bedrooms);
    navigate(`/hotels?${params.toString()}`);
    setIsFilterModalOpen(false);
  };

  const clearFilters = () => {
    navigate("/hotels");
    setHasActiveFilters(false);
  };

  const HotelCard = ({ property }: { property: Property }) => {
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
    const [canScrollPrev, setCanScrollPrev] = useState(false);
    const [canScrollNext, setCanScrollNext] = useState(false);

    useEffect(() => {
      if (!emblaApi) return;
      const onSelect = () => {
        setCanScrollPrev(emblaApi.canScrollPrev());
        setCanScrollNext(emblaApi.canScrollNext());
      };
      emblaApi.on("select", onSelect);
      onSelect();
    }, [emblaApi]);

    const scrollPrev = (e: React.MouseEvent) => {
      e.stopPropagation();
      emblaApi?.scrollPrev();
    };

    const scrollNext = (e: React.MouseEvent) => {
      e.stopPropagation();
      emblaApi?.scrollNext();
    };

    const images = property.images && property.images.length > 0
      ? property.images
      : ["/placeholder.svg"];

    const isWishlisted = wishlistIds.has(property.id);

    const handleWishlistClick = (e?: React.MouseEvent) => {
      if (e) e.stopPropagation();
      if (!user) {
        setIsLoginModalOpen(true);
        return;
      }
      toggleWishlist(property.id);
    };

    const handleCardClick = () => navigate(`/property/${property.id}`);

    return (
      <Card
        className="overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group"
        onClick={handleCardClick}
        onMouseEnter={() => setHoveredPropertyId(property.id)}
        onMouseLeave={() => setHoveredPropertyId(null)}
      >
        <div className="relative">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex">
              {images.map((img, idx) => (
                <div key={idx} className="flex-[0_0_100%] min-w-0">
                  <div className="aspect-[4/3] relative">
                    <img
                      src={img}
                      alt={`${property.title} - ${idx + 1}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {images.length > 1 && (
            <>
              {canScrollPrev && (
                <button
                  onClick={scrollPrev}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg z-10 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
              )}
              {canScrollNext && (
                <button
                  onClick={scrollNext}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg z-10 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </>
          )}

          <div className="absolute top-3 right-3 z-10" onClick={(e) => e.stopPropagation()}>
            <WishlistButton
              isInWishlist={isWishlisted}
              onToggle={() => handleWishlistClick()}
            />
          </div>

          {property.is_verified && (
            <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground">
              <Star className="w-3 h-3 mr-1" />
              {t("verified")}
            </Badge>
          )}
        </div>

        <div className="p-4 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-primary transition-colors">
              {property.title}
            </h3>
          </div>

          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4 flex-shrink-0" />
            <span className="line-clamp-1">{property.location}, {property.city}</span>
          </div>

          {property.features && (
            <div className="flex flex-wrap gap-2 text-xs">
              {property.features.wifi && (
                <Badge variant="secondary" className="gap-1">
                  <Wifi className="w-3 h-3" />
                  WiFi
                </Badge>
              )}
              {property.features.parking && (
                <Badge variant="secondary" className="gap-1">
                  <Car className="w-3 h-3" />
                  Parking
                </Badge>
              )}
              {property.features.restaurant && (
                <Badge variant="secondary" className="gap-1">
                  <Coffee className="w-3 h-3" />
                  Restaurant
                </Badge>
              )}
              {property.features.gym && (
                <Badge variant="secondary" className="gap-1">
                  <Dumbbell className="w-3 h-3" />
                  Gym
                </Badge>
              )}
            </div>
          )}

          <div className="pt-2 border-t border-border">
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-xl font-bold">
                  {formatPrice(num(property.price), property.price_currency || "DZD")}
                </span>
                <span className="text-sm text-muted-foreground ml-1">/ {t("night")}</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    );
  };

  return (
    <LocalErrorBoundary>
      <div className="min-h-screen bg-background">
        <AppInstallBanner />
        <Navigation />
        
        <main className="pt-20">
          {/* Hero Section */}
          <section className="relative bg-gradient-to-br from-primary/10 via-background to-accent/10 py-16 md:py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-3xl mx-auto mb-8">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                  {t("findPerfectHotel")}
                </h1>
                <p className="text-lg text-muted-foreground">
                  {t("hotelHeroDescription")}
                </p>
              </div>
            </div>
          </section>

          {/* Filters Bar */}
          <section className="sticky top-16 z-40 bg-background/95 backdrop-blur-sm border-b border-border py-4">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <Button onClick={handleFilterClick} variant="outline">
                    {t("filters")}
                  </Button>
                  {hasActiveFilters && (
                    <Button onClick={clearFilters} variant="ghost" size="sm">
                      <X className="w-4 h-4 mr-1" />
                      {t("clearFilters")}
                    </Button>
                  )}
                </div>
                <div className="text-sm text-muted-foreground">
                  {filteredProperties.length} {t("hotelsFound")}
                </div>
              </div>
            </div>
          </section>

          {/* Main Content */}
          <section className="py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Properties Grid */}
                <div className="lg:w-1/2">
                  {isLoading ? (
                    <div className="flex items-center justify-center py-20">
                      <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                  ) : filteredProperties.length === 0 ? (
                    <div className="text-center py-20">
                      <p className="text-lg text-muted-foreground mb-4">
                        {t("noHotelsFound")}
                      </p>
                      <Button onClick={clearFilters} variant="outline">
                        {t("clearFilters")}
                      </Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-6">
                      {filteredProperties.map((property) => (
                        <HotelCard key={property.id} property={property} />
                      ))}
                    </div>
                  )}
                </div>

                {/* Map */}
                <div className="lg:w-1/2 lg:sticky lg:top-36 h-[500px] lg:h-[calc(100vh-200px)]">
                  <MapboxPropertyMap
                    properties={filteredProperties}
                    hoveredPropertyId={hoveredPropertyId || undefined}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Additional Sections */}
          <LocalErrorBoundary>
            <HostAdsCarousel />
          </LocalErrorBoundary>

          <LocalErrorBoundary>
            <CitiesSection />
          </LocalErrorBoundary>
        </main>

        <Footer />
        <AIChatBox />

        {/* Modals */}
        {isFilterModalOpen && (
          <PropertyFilters
            isModalOpen={isFilterModalOpen}
            onModalClose={() => setIsFilterModalOpen(false)}
            onFilterChange={handleFilterApply}
            listingType="shortStay"
          />
        )}

        <LoginModal
          open={isLoginModalOpen}
          onOpenChange={setIsLoginModalOpen}
        />
      </div>
    </LocalErrorBoundary>
  );
};

export default Hotels;
