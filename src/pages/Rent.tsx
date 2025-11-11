import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import RentHeroSearch from "@/components/RentHeroSearch";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Bed, Bath, Square, Loader2, ShieldCheck } from "lucide-react";
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
import { useAuth } from "@/contexts/AuthContext";
import { useWishlist, setAuthModalCallback } from "@/hooks/useWishlist";
import { WishlistButton } from "@/components/WishlistButton";
import LoginModal from "@/components/LoginModal";
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import React from "react";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";

/** ---------- Types ---------- */
interface Property {
  id: string;
  title: string;
  location: string;
  city: string;
  price: string | number;
  price_type?: string;
  price_currency?: string;
  bedrooms?: string;
  bathrooms?: string;
  area: string | number;
  images: string[] | null;
  property_type: string;
  is_verified?: boolean;
  latitude?: number;
  longitude?: number;
}

/** ---------- Utils ---------- */
const num = (v: unknown) => {
  if (typeof v === "number") return v;
  const n = parseInt(String(v ?? "").replace(/[^\d]/g, ""), 10);
  return Number.isFinite(n) ? n : 0;
};

/** ---------- Error Boundary ---------- */
class LocalErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(err: any) {
    console.error("Rent Page ErrorBoundary caught:", err);
  }
  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="rounded-xl border p-6 text-sm text-muted-foreground">
            Component failed to load.
          </div>
        )
      );
    }
    return this.props.children as any;
  }
}

/** ---------- Page ---------- */
const Rent = () => {
  const navigate = useNavigate();
  const routerLocation = useLocation();
  const { t } = useLanguage();
  const { formatPrice } = useCurrency();
  const { user } = useAuth();
  const { wishlistIds, toggleWishlist } = useWishlist(user?.id);
  const [isLoginModalOpen, setIsLoginModalOpen] = React.useState(false);

  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [snapPoint, setSnapPoint] = useState<number | string | null>(0.6);
  const isMobile = useIsMobile();

  useScrollToTop();

  React.useEffect(() => {
    setAuthModalCallback(() => setIsLoginModalOpen(true));
  }, []);

  useEffect(() => {
    fetchProperties();
  }, []);

  useEffect(() => {
    applyFiltersFromURL();
  }, [properties, routerLocation.search]);

  const fetchProperties = async () => {
    try {
      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .eq("category", "rent")
        .eq("status", "active")
        .order("created_at", { ascending: false });

      if (!error) {
        setProperties((data as any) || []);
        setFilteredProperties((data as any) || []);
      }
    } catch (err) {
      console.error("Error fetching properties:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const applyFiltersFromURL = () => {
    const urlParams = new URLSearchParams(routerLocation.search);
    const location = (urlParams.get("location") || "").trim();
    const type = (urlParams.get("type") || "").trim();
    const maxRent = (urlParams.get("maxRent") || "").trim();

    let filtered = [...properties];

    if (location) {
      const l = location.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          (p.city || "").toLowerCase().includes(l) ||
          (p.location || "").toLowerCase().includes(l)
      );
    }

    if (type && type.toLowerCase() !== "all") {
      filtered = filtered.filter(
        (p) => (p.property_type || "").toLowerCase() === type.toLowerCase()
      );
    }

    if (maxRent && maxRent !== "0") {
      const cap = num(maxRent);
      if (cap > 0) {
        filtered = filtered.filter((p) => num(p.price) <= cap);
      }
    }

    setFilteredProperties(filtered);
  };

  const handleSearch = (vals: { location?: string; type?: string; maxRent?: string | number }) => {
    const qs = new URLSearchParams();
    if (vals.location) qs.set("location", String(vals.location));
    if (vals.type && vals.type !== "all") qs.set("type", String(vals.type));
    if (vals.maxRent && String(vals.maxRent) !== "0") qs.set("maxRent", String(vals.maxRent));
    navigate({ pathname: "/rent", search: qs.toString() });
  };

  const PropertyCard = ({ property }: { property: Property }) => {
    const images = property.images && property.images.length > 0 ? property.images : ["/placeholder-property.jpg"];
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
    const [currentIndex, setCurrentIndex] = React.useState(0);
    const isInWishlist = wishlistIds.has(property.id);

    React.useEffect(() => {
      if (!emblaApi) return;
      emblaApi.on('select', () => {
        setCurrentIndex(emblaApi.selectedScrollSnap());
      });
    }, [emblaApi]);

    return (
      <div
        className="cursor-pointer group"
        onClick={() => navigate(`/property/${property.id}`)}
      >
        <Card className="bg-transparent shadow-none border-0">
          <div className="relative w-full rounded-2xl overflow-hidden aspect-[4/3] md:aspect-[5/4]">
            {/* Image carousel */}
            <div className="embla w-full h-full" ref={emblaRef}>
              <div className="embla__container flex h-full">
                {images.map((img, i) => (
                  <div key={i} className="embla__slide flex-[0_0_100%] min-w-0">
                    <img
                      src={img}
                      alt={`${property.title} ${i+1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = "/placeholder-property.jpg";
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation arrows */}
            {images.length > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); emblaApi?.scrollPrev(); }}
                  className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 hover:bg-white rounded-full p-1.5 shadow-md z-10"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); emblaApi?.scrollNext(); }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 hover:bg-white rounded-full p-1.5 shadow-md z-10"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </>
            )}

            {/* Image counter */}
            {images.length > 1 && (
              <div className="absolute top-3 left-3 bg-black/70 text-white text-xs px-2 py-1 rounded-md z-10">
                {currentIndex + 1}/{images.length}
              </div>
            )}

            {/* Wishlist button */}
            <WishlistButton
              isInWishlist={isInWishlist}
              onToggle={() => toggleWishlist(property.id)}
            />

            {/* Verified icon */}
            {property.is_verified && (
              <span
                title="Verified"
                className="absolute left-3 bottom-12 inline-flex h-7 w-7 items-center justify-center rounded-full bg-background/85 backdrop-blur border z-10"
              >
                <ShieldCheck className="h-4 w-4" />
              </span>
            )}

            {/* Rent badge */}
            <div className="absolute bottom-3 right-3 z-10">
              <Badge variant="secondary" className="bg-background/80 text-foreground text-xs">
                {t("forRent") || "For rent"}
              </Badge>
            </div>
          </div>
        </Card>

        {/* Info below */}
        <div className="mt-2">
          {/* Price first on mobile */}
          <div className="mb-2 md:hidden">
            <div className="text-xl font-bold">
              {formatPrice(num(property.price), property.price_type, property.price_currency)}
            </div>
          </div>

          <div className="text-[15px] sm:text-base font-semibold line-clamp-1">
            {property.title}
          </div>
          <div className="mt-0.5 flex items-center text-muted-foreground">
            <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
            <span className="text-[13px] line-clamp-1">
              {(property.city || "").trim()}
              {property.city && property.location ? ", " : ""}
              {(property.location || "").trim()}
            </span>
          </div>
          
          {/* Price on desktop (original position) */}
          <div className="mt-1 text-lg md:text-xl font-bold hidden md:block">
            {formatPrice(num(property.price), property.price_type, property.price_currency)}
          </div>
          <div className="mt-1.5 flex items-center gap-4 text-muted-foreground text-xs">
            {property.bedrooms && (
              <div className="flex items-center whitespace-nowrap">
                <Bed className="h-4 w-4 mr-1" />
                <span>{property.bedrooms}</span>
              </div>
            )}
            {property.bathrooms && (
              <div className="flex items-center whitespace-nowrap">
                <Bath className="h-4 w-4 mr-1" />
                <span>{property.bathrooms}</span>
              </div>
            )}
            <div className="flex items-center whitespace-nowrap">
              <Square className="h-4 w-4 mr-1" />
              <span>{num(property.area)} {t("areaUnit")}</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-[120px] md:pt-20">
        <RentHeroSearch onSearch={handleSearch} onFilterClick={() => setIsFilterModalOpen(true)} />

        {/* Map + list: 60/40 layout */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
          {/* Desktop Layout - Side by Side */}
          <div className="hidden md:grid md:grid-cols-[60%_40%] gap-6 items-start">
            {/* Cards */}
            <div className="order-2 lg:order-1">
              <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
                <h2 className="text-2xl font-bold">
                  {filteredProperties.length} {t("properties") || "properties"}
                </h2>
                <PropertyFilters
                  isModalOpen={isFilterModalOpen}
                  onModalClose={() => setIsFilterModalOpen(false)}
                  onFilterChange={(filters) => {
                    let filtered = properties;

                    if (filters.minPrice > 0 || filters.maxPrice < 100000) {
                      filtered = filtered.filter(p => {
                        const price = num(p.price);
                        return price >= filters.minPrice && price <= filters.maxPrice;
                      });
                    }

                    if (filters.bedrooms > 0) {
                      filtered = filtered.filter((p) => num(p.bedrooms) >= filters.bedrooms);
                    }

                    if (filters.bathrooms > 0) {
                      filtered = filtered.filter((p) => num(p.bathrooms) >= filters.bathrooms);
                    }

                    setFilteredProperties(filtered);
                  }} 
                  listingType="rent" 
                />
              </div>

              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin" />
                  <span className="ml-2">{t("loading")}</span>
                </div>
              ) : filteredProperties.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-lg font-semibold mb-2">
                    {t("noPropertiesFound")}
                  </div>
                  <div className="text-muted-foreground">{t("Adjust Filters Or Check Later")}</div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {filteredProperties.map((property) => (
                    <PropertyCard key={property.id} property={property} />
                  ))}
                </div>
              )}
            </div>

            {/* Map */}
            <div className="order-1 lg:order-2 lg:min-h-[200vh]">
              <LocalErrorBoundary
                fallback={
                  <div className="sticky top-24 rounded-2xl ring-1 ring-border bg-background p-8 h-[calc(100vh-7rem)]">
                    <div className="flex flex-col items-center justify-center h-full text-center">
                      <MapPin className="h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold mb-2">Map Unavailable</h3>
                      <p className="text-sm text-muted-foreground max-w-md mb-4">
                        The interactive map cannot be displayed. This may be due to device limitations or browser settings.
                      </p>
                      <div className="text-xs text-muted-foreground space-y-1">
                        <p className="font-medium mb-2">Try these steps:</p>
                        <p>• Enable hardware acceleration in browser settings</p>
                        <p>• Use Chrome, Firefox, or Safari</p>
                        <p>• Update to the latest browser version</p>
                      </div>
                    </div>
                  </div>
                }
              >
                <div className="sticky top-24 rounded-2xl overflow-hidden ring-1 ring-border h-[calc(100vh-7rem)]">
                  <MapboxPropertyMap properties={filteredProperties || []} />
                </div>
              </LocalErrorBoundary>
            </div>
          </div>

          {/* Mobile Layout - Draggable Bottom Sheet */}
          <div className="md:hidden relative h-[calc(100vh-180px)]">
            {/* Fixed Map Background */}
            <div className="absolute inset-0 z-0">
              <LocalErrorBoundary
                fallback={
                  <div className="w-full h-full bg-muted/20 rounded-2xl flex items-center justify-center">
                    <div className="text-center p-4">
                      <MapPin className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">Map Unavailable</p>
                    </div>
                  </div>
                }
              >
                <MapboxPropertyMap properties={filteredProperties || []} />
              </LocalErrorBoundary>
            </div>

            {/* Draggable Property Sheet */}
            <Drawer
              open={true}
              modal={false}
              snapPoints={[0.85, 0.55, 0.25]}
              activeSnapPoint={snapPoint}
              setActiveSnapPoint={setSnapPoint}
              fadeFromIndex={1}
            >
              <DrawerContent 
                className="h-[90vh] bg-background border-t"
                style={{ 
                  paddingTop: 'env(safe-area-inset-top)',
                }}
              >
                {/* Drag Handle */}
                <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-muted-foreground/20 mt-3 mb-3" />
                
                {/* Property Count & Filters */}
                <div className="flex items-center justify-between mb-3 px-3 sm:px-4 gap-3 flex-wrap">
                  <h2 className="text-lg sm:text-xl font-bold">
                    {filteredProperties.length} {t("properties") || "properties"}
                  </h2>
                  <PropertyFilters
                    isModalOpen={isFilterModalOpen}
                    onModalClose={() => setIsFilterModalOpen(false)}
                    onFilterChange={(filters) => {
                      let filtered = properties;

                      if (filters.minPrice > 0 || filters.maxPrice < 100000) {
                        filtered = filtered.filter(p => {
                          const price = num(p.price);
                          return price >= filters.minPrice && price <= filters.maxPrice;
                        });
                      }

                      if (filters.bedrooms > 0) {
                        filtered = filtered.filter((p) => num(p.bedrooms) >= filters.bedrooms);
                      }

                      if (filters.bathrooms > 0) {
                        filtered = filtered.filter((p) => num(p.bathrooms) >= filters.bathrooms);
                      }

                      setFilteredProperties(filtered);
                    }} 
                    listingType="rent" 
                  />
                </div>

                {/* Scrollable Property Cards */}
                <div 
                  className="flex-1 overflow-y-auto px-3 sm:px-4"
                  style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 1rem)' }}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="h-8 w-8 animate-spin" />
                      <span className="ml-2">{t("loading")}</span>
                    </div>
                  ) : filteredProperties.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="text-lg font-semibold mb-2">
                        {t("noPropertiesFound")}
                      </div>
                      <div className="text-muted-foreground">{t("Adjust Filters Or Check Later")}</div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      {filteredProperties.map((property) => (
                        <PropertyCard key={property.id} property={property} />
                      ))}
                    </div>
                  )}
                </div>
              </DrawerContent>
            </Drawer>
          </div>
        </section>

        <CitiesSection />
        <AIChatBox />
      </main>
      <Footer />
      <LoginModal open={isLoginModalOpen} onOpenChange={setIsLoginModalOpen} />
    </div>
  );
};

export default Rent;
