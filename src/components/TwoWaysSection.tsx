import { Card } from "@/components/ui/card";
import { Building2, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import hotelImage from "@/assets/property-luxury-apartment.jpg";
import villaImage from "@/assets/property-villa-mediterranean.jpg";

const TwoWaysSection = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const ways = [
    {
      id: 'hotels',
      icon: Building2,
      title: t('hotelsCardTitle'),
      description: t('hotelsCardDesc'),
      image: hotelImage,
      route: '/hotels'
    },
    {
      id: 'short-stay',
      icon: Home,
      title: t('shortStayCardTitle'),
      description: t('shortStayCardDesc'),
      image: villaImage,
      route: '/short-stay'
    }
  ];

  return (
    <section className="py-16 md:py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-playfair text-foreground mb-4">
            {t('twoWaysTitle')}
          </h2>
          <p className="text-lg text-muted-foreground font-inter font-light max-w-3xl mx-auto leading-relaxed">
            {t('twoWaysSubtitle')}
          </p>
        </div>

        {/* Two Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {ways.map((way) => {
            const IconComponent = way.icon;
            return (
              <Card
                key={way.id}
                className="group overflow-hidden border-0 shadow-soft hover:shadow-elegant transition-all duration-500 hover:scale-[1.01] cursor-pointer bg-card rounded-2xl"
                onClick={() => navigate(way.route)}
              >
                {/* Image Section */}
                <div className="relative h-72 md:h-80 overflow-hidden">
                  <img
                    src={way.image}
                    alt={way.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  
                  {/* Icon Badge - Top Left on Image */}
                  <div className="absolute top-6 left-6 bg-white rounded-full p-3 shadow-lg">
                    <IconComponent className="h-5 w-5 text-[hsl(160,50%,30%)]" />
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-6 md:p-8">
                  <h3 className="text-2xl font-playfair font-semibold text-foreground mb-3">
                    {way.title}
                  </h3>
                  <p className="text-muted-foreground font-inter leading-relaxed">
                    {way.description}
                  </p>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TwoWaysSection;
