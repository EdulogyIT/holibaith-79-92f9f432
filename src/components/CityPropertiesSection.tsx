import { useNavigate } from "react-router-dom";
import { Heart, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useAuth } from "@/contexts/AuthContext";
import { useWishlist } from "@/hooks/useWishlist";
import { Badge } from "@/components/ui/badge";
import useEmblaCarousel from 'embla-carousel-react';
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Property {
  id: string;
  title: string;
  city: string;
  location: string;
  price: string | number;
  images: string[] | null;
  is_verified?: boolean;
  is_featured?: boolean;
}

interface Review {
  property_id: string;
  rating: number;
}

interface CityPropertiesSectionProps {
  city: string;
  descriptionKey: string;
}

const CityPropertiesSection = ({ city, descriptionKey }: CityPropertiesSectionProps) => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { formatPrice } = useCurrency();
  const { user } = useAuth();
  const { wishlistIds, toggleWishlist } = useWishlist(user?.id);
  const [properties, setProperties] = useState<Property[]>([]);
  const [reviews, setReviews] = useState<Record<string, { avg: number; count: number }>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCityProperties = async () => {
      try {
        const { data, error } = await supabase
          .from("properties")
          .select("id, title, city, location, price, images, is_verified, is_featured")
          .eq("category", "short-stay")
          .eq("status", "active")
          .ilike("city", `%${city}%`)
          .limit(4);

        if (!error && data) {
          setProperties(data as Property[]);
          
          // Fetch reviews for these properties
          const propertyIds = data.map(p => p.id);
          const { data: reviewsData } = await supabase
            .from("reviews")
            .select("property_id, rating")
            .in("property_id", propertyIds);
          
          if (reviewsData) {
            const reviewMap: Record<string, { avg: number; count: number }> = {};
            propertyIds.forEach(id => {
              const propReviews = reviewsData.filter((r: Review) => r.property_id === id);
              if (propReviews.length > 0) {
                const avg = propReviews.reduce((sum: number, r: Review) => sum + r.rating, 0) / propReviews.length;
                reviewMap[id] = { avg: Math.round(avg * 10) / 10, count: propReviews.length };
              }
            });
            setReviews(reviewMap);
          }
        }
      } catch (err) {
        console.error("Error fetching city properties:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCityProperties();
  }, [city]);

  const getBadgeType = (property: Property, index: number): string | null => {
    if (property.is_verified && index === 0) return "superhost";
    if (property.is_featured) return "guestFavorite";
    if (index === 2) return "rareFind";
    return null;
  };

  const PropertyCard = ({ property, index }: { property: Property; index: number }) => {
    const images = property.images && property.images.length > 0 ? property.images : ["/placeholder-property.jpg"];
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
    const [currentIndex, setCurrentIndex] = React.useState(0);
    const isInWishlist = wishlistIds.has(property.id);
    const badgeType = getBadgeType(property, index);
    const review = reviews[property.id];

    React.useEffect(() => {
      if (!emblaApi) return;
      emblaApi.on('select', () => setCurrentIndex(emblaApi.selectedScrollSnap()));
    }, [emblaApi]);

    const priceValue = typeof property.price === 'string' 
      ? parseInt(property.price.replace(/[^\d]/g, ''), 10) 
      : property.price;

    return (
      <div 
        className="cursor-pointer group" 
        onClick={() => navigate(`/property/${property.id}`)}
      >
        <div className="relative w-full rounded-2xl overflow-hidden aspect-[4/3] bg-muted">
          <div className="embla w-full h-full" ref={emblaRef}>
            <div className="embla__container flex h-full">
              {images.map((img, i) => (
                <div key={i} className="embla__slide flex-[0_0_100%] min-w-0">
                  <img
                    src={img}
                    alt={`${property.title} ${i + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => { (e.currentTarget as HTMLImageElement).src = "/placeholder-property.jpg"; }}
                  />
                </div>
              ))}
            </div>
          </div>

          {images.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); emblaApi?.scrollPrev(); }}
                className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-card/90 hover:bg-card rounded-full p-1.5 shadow-md z-10"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); emblaApi?.scrollNext(); }}
                className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-card/90 hover:bg-card rounded-full p-1.5 shadow-md z-10"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </>
          )}

          {/* Badge */}
          {badgeType && (
            <div className="absolute top-3 left-3 z-10">
              <Badge className="bg-card text-foreground text-xs font-medium px-2.5 py-1 rounded-full shadow-sm border-0">
                {badgeType === "superhost" && t("superhost")}
                {badgeType === "guestFavorite" && t("guestFavorite")}
                {badgeType === "rareFind" && t("rareFind")}
              </Badge>
            </div>
          )}

          {/* Wishlist */}
          <button
            onClick={(e) => { e.stopPropagation(); toggleWishlist(property.id); }}
            className="absolute top-3 right-3 z-10 p-2"
          >
            <Heart 
              className={`h-6 w-6 transition-colors ${isInWishlist ? 'fill-red-500 text-red-500' : 'fill-black/30 text-card stroke-2'}`} 
            />
          </button>
        </div>

        <div className="mt-3">
          {/* Rating */}
          {review && (
            <div className="flex items-center gap-1 mb-1">
              <Star className="h-4 w-4 fill-foreground text-foreground" />
              <span className="text-sm font-medium">{review.avg}</span>
              <span className="text-sm text-muted-foreground">({review.count})</span>
            </div>
          )}
          
          {/* Title */}
          <h3 className="font-playfair text-base font-medium line-clamp-1">{property.title}</h3>
          
          {/* Price */}
          <div className="mt-1">
            <span className="font-semibold">{formatPrice(priceValue || 0, "daily")}</span>
            <span className="text-muted-foreground ml-1">{t("night")}</span>
          </div>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/4"></div>
            <div className="h-4 bg-muted rounded w-1/3"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="aspect-[4/3] bg-muted rounded-2xl"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (properties.length === 0) return null;

  return (
    <section className="py-12 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="font-playfair text-3xl md:text-4xl font-semibold text-foreground">{city}</h2>
            <p className="text-muted-foreground mt-1">{t(descriptionKey)}</p>
          </div>
          <button 
            onClick={() => navigate(`/short-stay?location=${city}`)}
            className="text-foreground font-medium hover:underline flex items-center gap-1 whitespace-nowrap"
          >
            {t("showAll")} &gt;
          </button>
        </div>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {properties.map((property, index) => (
            <PropertyCard key={property.id} property={property} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CityPropertiesSection;
