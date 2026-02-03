import { Card } from "@/components/ui/card";
import { MapPin, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface FeaturedProperty {
  id: string;
  title: string;
  city: string;
  price: string;
  images: string[];
  rating?: number;
  reviewCount?: number;
}

const FeaturedStaysSection = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [properties, setProperties] = useState<FeaturedProperty[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedProperties = async () => {
      const { data, error } = await supabase
        .from('properties')
        .select('id, title, city, price, images')
        .eq('status', 'active')
        .eq('is_featured', true)
        .limit(4);
      
      if (data && !error) {
        // Fetch reviews for each property
        const propertiesWithRatings = await Promise.all(
          data.map(async (prop) => {
            const { data: reviews } = await supabase
              .from('reviews')
              .select('rating')
              .eq('property_id', prop.id);
            
            const avgRating = reviews && reviews.length > 0
              ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
              : 4.8;
            
            return {
              ...prop,
              images: prop.images || [],
              rating: avgRating,
              reviewCount: reviews?.length || 0
            };
          })
        );
        setProperties(propertiesWithRatings);
      }
      setLoading(false);
    };

    fetchFeaturedProperties();
  }, []);

  // Sample data matching screenshots exactly
  const sampleProperties: FeaturedProperty[] = [
    {
      id: '1',
      title: 'Le Royal Mansour',
      city: 'Algiers',
      price: '180.00',
      images: ['/lovable-uploads/bd206675-bfd0-4aee-936b-479f6c1240ca.png'],
      rating: 4.9,
      reviewCount: 324
    },
    {
      id: '2',
      title: 'Mediterranean Villa',
      city: 'Oran',
      price: '120.00',
      images: ['/lovable-uploads/bd206675-bfd0-4aee-936b-479f6c1240ca.png'],
      rating: 4.8,
      reviewCount: 156
    },
    {
      id: '3',
      title: 'Sahara Desert Resort',
      city: 'Tamanrasset',
      price: '150.00',
      images: ['/lovable-uploads/bd206675-bfd0-4aee-936b-479f6c1240ca.png'],
      rating: 4.7,
      reviewCount: 203
    },
    {
      id: '4',
      title: 'Casbah Heritage House',
      city: 'Algiers',
      price: '95.00',
      images: ['/lovable-uploads/bd206675-bfd0-4aee-936b-479f6c1240ca.png'],
      rating: 4.9,
      reviewCount: 287
    }
  ];

  const displayProperties = properties.length > 0 ? properties : sampleProperties;

  return (
    <section className="py-16 md:py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-playfair italic text-foreground mb-4">
            Featured Stays
          </h2>
          <p className="text-lg text-muted-foreground font-inter font-light max-w-3xl mx-auto">
            Handpicked accommodations that define luxury and authenticity
          </p>
        </div>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayProperties.map((property) => (
            <Card
              key={property.id}
              className="group overflow-hidden border-0 shadow-soft hover:shadow-elegant transition-all duration-300 cursor-pointer bg-card rounded-xl"
              onClick={() => navigate(`/property/${property.id}`)}
            >
              {/* Image Container */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={property.images[0] || '/placeholder.svg'}
                  alt={property.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {/* Featured Badge - Gold/Tan color */}
                <div className="absolute top-3 left-3 bg-[#C4A574] text-white text-xs font-inter font-semibold px-3 py-1 rounded-full">
                  Featured
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                {/* Title and Rating Row */}
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-playfair font-semibold text-foreground line-clamp-1 flex-1">
                    {property.title}
                  </h3>
                  {/* Rating */}
                  <div className="flex items-center gap-1 ml-2">
                    <Star className="h-4 w-4 fill-[#C4A574] text-[#C4A574]" />
                    <span className="text-sm font-inter font-medium text-foreground">{property.rating?.toFixed(1)}</span>
                  </div>
                </div>
                
                {/* Location */}
                <div className="flex items-center text-muted-foreground mb-3">
                  <MapPin className="h-3.5 w-3.5 mr-1" />
                  <span className="text-sm font-inter">{property.city}</span>
                </div>

                {/* Price and Reviews Row */}
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-lg font-inter font-bold text-foreground">€{property.price}</span>
                    <span className="text-sm text-muted-foreground font-inter"> / night</span>
                  </div>
                  <span className="text-xs text-muted-foreground font-inter">{property.reviewCount} reviews</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedStaysSection;
