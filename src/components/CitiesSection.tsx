import { Card } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState, useEffect } from "react";
import algerImage from "@/assets/city-alger.jpg";
import oranImage from "@/assets/city-oran.jpg";
import constantineImage from "@/assets/city-constantine.jpg";
import annabaImage from "@/assets/city-annaba.jpg";
import { supabase } from "@/integrations/supabase/client";

const CitiesSection = () => {
  const navigate = useNavigate();
  const { t, currentLang } = useLanguage();
  const [cityCounts, setCityCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    const fetchPropertyCounts = async () => {
      const { data, error } = await supabase
        .from('properties')
        .select('city')
        .eq('status', 'active');
      
      if (data && !error) {
        const counts: Record<string, number> = {};
        data.forEach(prop => {
          const city = prop.city?.toLowerCase() || '';
          counts[city] = (counts[city] || 0) + 1;
        });
        setCityCounts(counts);
      }
    };
    
    fetchPropertyCounts();
  }, []);

  useEffect(() => {
    // Re-render when language changes
  }, [currentLang]);
  
  const getCityPropertyCount = (cityId: string) => {
    const count = cityCounts[cityId.toLowerCase()] || 0;
    return `${count} ${t('propertiesCount')}`;
  };

  const cities = [
    {
      id: "alger",
      name: t('cityAlger'),
      properties: getCityPropertyCount("alger"),
      image: algerImage
    },
    {
      id: "oran",
      name: t('cityOran'),
      properties: getCityPropertyCount("oran"),
      image: oranImage
    },
    {
      id: "constantine", 
      name: t('cityConstantine'),
      properties: getCityPropertyCount("constantine"),
      image: constantineImage
    },
    {
      id: "tlemcen",
      name: t('cityTlemcen'),
      properties: getCityPropertyCount("tlemcen"),
      image: annabaImage
    }
  ];

  return (
    <section className="py-16 md:py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-playfair italic text-foreground mb-4">
            Explore by City
          </h2>
          <p className="text-lg text-muted-foreground font-inter font-light max-w-3xl mx-auto">
            Discover the unique character of Algeria's most captivating destinations
          </p>
        </div>

        {/* Cities Grid - Simple Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {cities.map((city) => (
            <Card 
              key={city.id} 
              className="group relative overflow-hidden border-0 rounded-2xl hover:shadow-elegant transition-all duration-300 cursor-pointer aspect-[3/4]"
              onClick={() => navigate(`/city/${city.id}`)}
            >
              {/* City Image */}
              <div className="absolute inset-0">
                <img 
                  src={city.image} 
                  alt={city.name}
                  className="w-full h-full object-cover group-hover:scale-105 transform-gpu transition-transform duration-500"
                />
                {/* Simple Dark Bottom Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              </div>
              
              {/* Text Overlay - Bottom */}
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <h3 className="text-xl md:text-2xl font-playfair font-semibold mb-1">
                  {city.name}
                </h3>
                <p className="text-sm font-inter text-white/80">
                  {city.properties}
                </p>
              </div>
            </Card>
          ))}
        </div>

        {/* Bottom CTA - Simple Link */}
        <div className="text-center mt-12">
          <button
            onClick={() => navigate('/cities')}
            className="text-primary hover:text-primary/80 font-inter font-medium inline-flex items-center gap-2 transition-colors duration-300 group"
          >
            <span>{t('viewAllDestinations')}</span>
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default CitiesSection;
